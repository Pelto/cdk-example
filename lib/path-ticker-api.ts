import { RemovalPolicy, Duration } from "aws-cdk-lib";
import { LambdaRestApi, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import * as path from 'path';
interface HitCounterProps {
  handler: IFunction;
}
export class PathTickerApi extends Construct {

  public readonly api: RestApi;

  public constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const { handler } = props;

    const table = new Table(this, 'CounterTable', {
      partitionKey: { name: 'Path', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const proxyHandler = new NodejsFunction(this, 'HitCounterFunction', {
      entry: path.join(__dirname, 'lambdas/hit-counter.ts'),
      timeout: Duration.seconds(15),
      environment: {
        tableName: table.tableName,
        downstreamFunction: handler.functionName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    table.grantReadWriteData(proxyHandler);
    handler.grantInvoke(proxyHandler);

    this.api = new LambdaRestApi(this, 'ApiGateway', {
      handler: proxyHandler,
    });
  }
}
