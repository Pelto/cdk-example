import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
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

    const devStage = new ApiStage(this, "DevStage");
    const prodStage = new ApiStage(this, "ProdStage");

    const dev = pipeline.addStage(devStage);

    dev.addPost(new ShellStep("Test", {
      envFromCfnOutputs: {
        ENDPOINT_URL: devStage.apiEndpoint,
      },
      commands: [
        'curl --fail $ENDPOINT_URL/test'
      ],
    }));

    pipeline.addStage(prodStage);
  }
}
