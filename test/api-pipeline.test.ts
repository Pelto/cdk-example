// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import * as ApiPipeline from '../lib/api-pipeline-stack';

import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ApiPipelineStack } from "../lib/api-pipeline";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/api-pipeline-stack.ts
test('Pipeline snapshot', () => {
  const app = new App();
  const pipeline = new ApiPipelineStack(app, 'Pipeline', {});
  const template = Template.fromStack(pipeline);
  expect(template.toJSON()).toMatchSnapshot();
});
