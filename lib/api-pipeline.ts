import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { CodeBuildStep, CodePipeline, CodePipelineSource } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

import { ApiStage } from "./api-stage";

export class ApiPipelineStack extends Stack{
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repository = new Repository(this, "Repository", {
      repositoryName: "api",
    });

    repository.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "ApiPipeline",
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.codeCommit(repository, "main"),
        installCommands: [
          `npm install -g aws-cdk`,
        ],
        buildEnvironment: {
          privileged: true,
        },
        commands: [
          `npm ci`,
          `npm run build`,
          `npx cdk synth`
        ]
      }),
    });

    pipeline.addStage(new ApiStage(this, "ApiStage"));
  }
}
