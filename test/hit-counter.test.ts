import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ApiStack } from "../lib/api-stack";

test('HitCounterTable is created', () => {
    const app = new App();

    // WHEN
    const stack = new ApiStack(app, 'MyTestStack');

    // THEN
    const template = Template.fromStack(stack);


    template.hasResource('AWS::DynamoDB::Table', {});
});
