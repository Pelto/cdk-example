import { RemovalPolicy, Duration } from "aws-cdk-lib";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import * as path from 'path';

interface HitCounterProps {
  target: IFunction;
}

export class HitCounter extends Construct {

  public readonly proxyHandler: IFunction;

  public constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const { target } = props;

    const table = new Table(this, "CounterTable", {
      partitionKey: { name: "Path", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.proxyHandler = new NodejsFunction(this, "HitCounterFunction", {
      entry: path.join(__dirname, "lambdas/hit-counter.ts"),
      timeout: Duration.seconds(15),
      environment: {
        tableName: table.tableName,
        downstreamFunction: target.functionName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    table.grantReadWriteData(this.proxyHandler);
    target.grantInvoke(this.proxyHandler);
  }
}
