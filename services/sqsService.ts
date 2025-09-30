import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@/lib/aws/clients";
import { Order } from "@/types/order";

export class SQSService {
  private queueUrl = process.env.ORDERS_QUEUE_URL;

  async sendOrderToQueue(order: Order): Promise<void> {
    if (!this.queueUrl) {
      console.log('SQS queue not configured, skipping queue send');
      return;
    }

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(order),
      MessageAttributes: {
        orderType: {
          DataType: "String",
          StringValue: order.pizzaType,
        },
        orderSize: {
          DataType: "String", 
          StringValue: order.size,
        },
      },
    });

    await sqsClient.send(command);
    console.log(`Order ${order.orderId} sent to SQS queue`);
  }
}

export const sqsService = new SQSService();