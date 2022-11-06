import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ApiStack } from "../lib/api-stack";

test('ApiStack snapshot', () => {
  const app = new App();
  const pipeline = new ApiStack(app, 'Api', {});
  const template = Template.fromStack(pipeline);
  expect(template.toJSON()).toMatchSnapshot();
});
