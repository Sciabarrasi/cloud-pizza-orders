import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SQSClient } from "@aws-sdk/client-sqs";

const dynamoDBConfig = {
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
};

export const dynamoDBClient = new DynamoDBClient(dynamoDBConfig);

export const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const sqsClient = new SQSClient(dynamoDBConfig);

export const testAWSConnection = async () => {
  try {
    console.log("✅ AWS clients configurados correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error configurando AWS clients:", error);
    return false;
  }
};