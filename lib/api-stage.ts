import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ApiStack } from "./api-stack";

export class ApiStage extends Stage {
  public constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new ApiStack(this, "ApiStack");
  }
}
