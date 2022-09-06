#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack';
import { ApiPipelineStack } from '../lib/api-pipeline';

const app = new cdk.App();

new ApiPipelineStack(app, 'PipelineStack', {

});
