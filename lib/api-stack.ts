import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import * as path from "path";
import { HitCounter } from './hit-counter';

export class ApiStack extends cdk.Stack {

  public readonly apiEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloHandler = new NodejsFunction(this, "HelloFunction", {
      entry: path.join(__dirname, "lambdas/hello-world.ts"),
    });

    const hitCounter = new HitCounter(this, 'counter', {
      target: helloHandler,
    });

    const api = new LambdaRestApi(this, "Api", {
      handler: hitCounter.proxyHandler,
    });

    this.apiEndpoint = new CfnOutput(this, "ApiEndpoint", {
      value: api.url,
    });
  }
}
