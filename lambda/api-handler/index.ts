/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pizzaType: string;
  size: 'small' | 'medium' | 'large';
  quantity: number;
  toppings: string[];
  total: number;
  status: 'pending' | 'preparing' | 'baking' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedTime?: number;
  specialInstructions?: string;
}

class OrderService {
  private tableName = process.env.ORDERS_TABLE;

  async createOrder(orderData: Omit<Order, 'orderId' | 'createdAt' | 'status'>): Promise<Order> {
    const orderId = this.generateId();
    const order: Order = {
      orderId,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedTime: this.calculateEstimatedTime(orderData),
    };

    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: order,
    });
    await docClient.send(putCommand);

    await this.sendToSQS(order);

    return order;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { orderId },
    });

    const result = await docClient.send(command);
    return result.Item as Order | null;
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "status-index",
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
      },
    });

    const result = await docClient.send(command);
    return result.Items as Order[] || [];
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { orderId },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return result.Attributes as Order;
  }

  async getTodayOrders(): Promise<Order[]> {
    const today = new Date().toISOString().split('T')[0];
    const pendingOrders = await this.getOrdersByStatus('pending');
    const preparingOrders = await this.getOrdersByStatus('preparing');
    const readyOrders = await this.getOrdersByStatus('ready');
    
    const allOrders = [...pendingOrders, ...preparingOrders, ...readyOrders];
    return allOrders.filter(order => order.createdAt.startsWith(today));
  }

  private async sendToSQS(order: Order): Promise<void> {
    if (!process.env.ORDERS_QUEUE_URL) {
      console.log('SQS queue not configured, skipping');
      return;
    }

    const command = new SendMessageCommand({
      QueueUrl: process.env.ORDERS_QUEUE_URL,
      MessageBody: JSON.stringify(order),
    });

    await sqsClient.send(command);
    console.log(`Order ${order.orderId} sent to SQS`);
  }

  private generateId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateEstimatedTime(orderData: any): number {
    let time = 20;
    if (orderData.size === 'large') time += 5;
    if (orderData.size === 'small') time -= 3;
    if (orderData.quantity > 1) time += (orderData.quantity - 1) * 8;
    return time;
  }
}

const orderService = new OrderService();

export const handler = async (event: any) => {
  console.log('Event received:', event.httpMethod, event.path);
  
  const { httpMethod, path, pathParameters, queryStringParameters, body } = event;
  
  try {
    if (httpMethod === 'POST' && path === '/orders') {
      if (!body) {
        return respond(400, { error: 'Body is required' });
      }
      
      const orderData = JSON.parse(body);
      
      if (!orderData.customerName || !orderData.customerPhone || !orderData.pizzaType) {
        return respond(400, { error: 'Missing required fields: customerName, customerPhone, pizzaType' });
      }
      
      const order = await orderService.createOrder(orderData);
      
      return respond(201, {
        success: true,
        orderId: order.orderId,
        message: 'Order created successfully',
        estimatedTime: order.estimatedTime
      });
    }
    
    if (httpMethod === 'GET' && pathParameters && pathParameters.orderId) {
      const orderId = pathParameters.orderId;
      const order = await orderService.getOrder(orderId);
      
      if (!order) {
        return respond(404, { error: 'Order not found' });
      }
      
      return respond(200, order);
    }
    
    if (httpMethod === 'GET' && path === '/orders') {
      const status = queryStringParameters?.status;
      
      if (status) {
        const orders = await orderService.getOrdersByStatus(status);
        return respond(200, orders);
      } else {
        const orders = await orderService.getTodayOrders();
        return respond(200, orders);
      }
    }
    
    if (httpMethod === 'PUT' && pathParameters && pathParameters.orderId) {
      if (!body) {
        return respond(400, { error: 'Body is required' });
      }
      
      const orderId = pathParameters.orderId;
      const updateData = JSON.parse(body);
      
      if (updateData.status) {
        const updatedOrder = await orderService.updateOrderStatus(orderId, updateData.status);
        return respond(200, updatedOrder);
      }
      
      return respond(400, { error: 'Only status can be updated' });
    }
    
    return respond(404, { error: 'Route not found' });
    
  } catch (error) {
    console.error('Error in API Handler:', error);
    
    return respond(500, { 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

function respond(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    },
    body: JSON.stringify(body)
  };
}