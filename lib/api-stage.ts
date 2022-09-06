import { CfnOutput, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ApiStack } from "./api-stack";

export class ApiStage extends Stage {

  public readonly apiEndpoint: CfnOutput;

  public constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const apiStack = new ApiStack(this, "ApiStack");

    this.apiEndpoint = apiStack.apiEndpoint;
  }
}
