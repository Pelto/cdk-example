
import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ApiPipelineStack } from "../lib/api-pipeline";

test('Pipeline snapshot', () => {
  const app = new App();
  const pipeline = new ApiPipelineStack(app, 'Pipeline', {});
  const template = Template.fromStack(pipeline);
  expect(template.toJSON()).toMatchSnapshot();
});
