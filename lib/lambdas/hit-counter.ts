import "source-map-support/register";

import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { InvokeCommand, LambdaClient} from "@aws-sdk/client-lambda";
import { APIGatewayProxyEvent } from "aws-lambda";

const { tableName, downstreamFunction } = process.env;

const dynamo = new DynamoDBClient({});
const lambda = new LambdaClient({})

export async function handler(event: APIGatewayProxyEvent): Promise<any> {
  try {
    const updateCommand = new UpdateItemCommand({
      TableName: tableName,
      Key: {
        Path: { S: event.path }
      },
      UpdateExpression: 'ADD hits :incr',
      ExpressionAttributeValues: { ':incr': { N: '1' } },
    });

    await dynamo.send(updateCommand);

    const invokeCommand = new InvokeCommand({
      Payload: Buffer.from(JSON.stringify(event)),
      FunctionName: downstreamFunction,
    });

    const response = await lambda.send(invokeCommand);
    const payload = response.Payload!.buffer;

    return JSON.parse(Buffer.from(payload).toString());
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: (error as Error).message,
      }),
    };
  }
}
