#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { LeadsStack } from "../lib/leads-stack";
import { WebAuditStack } from "../lib/web-audit-stack";

const app = new App();

new LeadsStack(app, "TallerDigitalizacionLeadsStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "eu-west-1",
  },
});

new WebAuditStack(app, "TallerDigitalizacionWebAuditStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "eu-west-1",
  },
});
