import { PutCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws/clients";
import { Order, CreateOrderRequest } from "@/types/order";
import { generateId } from "@/lib/utils/generateId";

export class OrderService {
  private tableName = process.env.ORDERS_TABLE;

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const order: Order = {
      orderId: generateId(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedTime: this.calculateEstimatedTime(orderData),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: order,
    });

    await docClient.send(command);
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
    const allOrders = await this.getOrdersByStatus('pending');
    const preparingOrders = await this.getOrdersByStatus('preparing');
    const readyOrders = await this.getOrdersByStatus('ready');
    
    const allRecentOrders = [...allOrders, ...preparingOrders, ...readyOrders];
    
    return allRecentOrders.filter(order => 
      order.createdAt.startsWith(today)
    );
  }

  private calculateEstimatedTime(orderData: CreateOrderRequest): number {
    let time = 20;
    
    if (orderData.size === 'large') time += 5;
    if (orderData.size === 'small') time -= 3;
    
    if (orderData.quantity > 1) {
      time += (orderData.quantity - 1) * 8;
    }
    
    return time;
  }
}

export const orderService = new OrderService();