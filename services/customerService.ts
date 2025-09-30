import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws/clients";

export interface Customer {
  customerId: string;
  phone: string;
  name: string;
  email?: string;
  totalOrders: number;
  createdAt: string;
  lastOrderAt?: string;
}

export class CustomerService {
  private tableName = process.env.CUSTOMERS_TABLE;

  async createOrUpdateCustomer(phone: string, name: string, email?: string): Promise<Customer> {
    const customerId = `cust_${phone.replace(/\D/g, '')}`;
    
    const existingCustomer = await this.getCustomerByPhone(phone);
    
    if (existingCustomer) {
      return this.updateCustomerOrderCount(customerId);
    }

    const customer: Customer = {
      customerId,
      phone,
      name,
      email,
      totalOrders: 1,
      createdAt: new Date().toISOString(),
      lastOrderAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: customer,
    });

    await docClient.send(command);
    return customer;
  }

  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "phone-index",
      KeyConditionExpression: "#phone = :phone",
      ExpressionAttributeNames: {
        "#phone": "phone",
      },
      ExpressionAttributeValues: {
        ":phone": phone,
      },
      Limit: 1,
    });

    const result = await docClient.send(command);
    return result.Items?.[0] as Customer || null;
  }

  private async updateCustomerOrderCount(customerId: string): Promise<Customer> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        customerId,
        totalOrders: { $inc: 1 },
        lastOrderAt: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    await docClient.send(command);
    
    const getCommand = new GetCommand({
      TableName: this.tableName,
      Key: { customerId },
    });

    const result = await docClient.send(getCommand);
    return result.Item as Customer;
  }
}

export const customerService = new CustomerService();