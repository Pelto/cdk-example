import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PathTickerApi } from './path-ticker-api';
import { Construct } from 'constructs';

import * as path from "path";

export class ApiStack extends cdk.Stack {

  public readonly apiEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new NodejsFunction(this, "HelloFunction", {
      entry: path.join(__dirname, "lambdas/hello-world.ts"),
    });

    const pathtTickerApi = new PathTickerApi(this, "Api", {
      handler,
    });

    this.apiEndpoint = new CfnOutput(this, "ApiEndpoint", {
      value: pathtTickerApi.api.url,
    });
  }
}
