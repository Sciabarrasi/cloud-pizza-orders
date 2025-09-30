import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1"
});

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any) => {
  console.log('Procesando órdenes desde SQS...');
  
  try {
    for (const record of event.Records) {
      const order = JSON.parse(record.body);
      console.log(`Procesando orden: ${order.orderId} - ${order.pizzaType}`);
      
      const updateCommand = new UpdateCommand({
        TableName: process.env.ORDERS_TABLE,
        Key: { orderId: order.orderId },
        UpdateExpression: "SET #status = :status, #updatedAt = :now",
        ExpressionAttributeNames: {
          "#status": "status",
          "#updatedAt": "updatedAt"
        },
        ExpressionAttributeValues: {
          ":status": "preparing",
          ":now": new Date().toISOString()
        }
      });
      
      await docClient.send(updateCommand);
      console.log(`✅ Orden ${order.orderId} actualizada a "preparing"`);
      
      if (order.pizzaType.includes('especial')) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      const readyCommand = new UpdateCommand({
        TableName: process.env.ORDERS_TABLE,
        Key: { orderId: order.orderId },
        UpdateExpression: "SET #status = :status, #updatedAt = :now",
        ExpressionAttributeNames: {
          "#status": "status",
          "#updatedAt": "updatedAt"
        },
        ExpressionAttributeValues: {
          ":status": "ready",
          ":now": new Date().toISOString()
        }
      });
      
      await docClient.send(readyCommand);
      console.log(`✅ Orden ${order.orderId} actualizada a "ready"`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Procesadas ${event.Records.length} órdenes exitosamente`
      })
    };
  } catch (error) {
    console.error('❌ Error procesando órdenes:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error procesando órdenes'
      })
    };
  }
};