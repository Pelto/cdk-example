import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import * as path from "path";

export class ApiStack extends cdk.Stack {

  public readonly apiEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloHandler = new NodejsFunction(this, "HelloFunction", {
      entry: path.join(__dirname, "lambdas/hello-world.ts"),
    });

    const table = new Table(this, "CounterTable", {
      partitionKey: { name: "Path", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const hitCounterHandler = new NodejsFunction(this, "HitCounterFunction", {
      entry: path.join(__dirname, "lambdas/hit-counter.ts"),
      timeout: Duration.seconds(15),
      environment: {
        tableName: table.tableName,
        downstreamFunction: helloHandler.functionName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    table.grantReadWriteData(hitCounterHandler);
    helloHandler.grantInvoke(hitCounterHandler);

    const api = new LambdaRestApi(this, "Api", {
      handler: hitCounterHandler,
    });

    this.apiEndpoint = new CfnOutput(this, "ApiEndpoint", {
      value: api.url,
    });
  }
}
