import path from "node:path";
import { fileURLToPath } from "node:url";
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

export class WebAuditStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://tallerdedigitalizacion.com";

    const table = new Table(this, "WebAuditLeadsTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "expiresAt",
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const handler = new NodejsFunction(this, "SubmitWebAuditHandler", {
      entry: path.join(rootDir, "backend/src/webAudit/submitWebAudit.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(20),
      bundling: {
        target: "node20",
        minify: true,
        sourceMap: true,
        commandHooks: {
          beforeBundling: () => [],
          beforeInstall: () => [],
          afterBundling: (_inputDir, outputDir) => [`cp -R ${path.join(rootDir, "public/downloads")} ${outputDir}/downloads`],
        },
      },
      environment: {
        TABLE_NAME: table.tableName,
        EXECUTIVE_REPORT_FILE_ES: "downloads/auditoria-web-tecnica-reporte-ejecutivo-es.pdf",
        EXECUTIVE_REPORT_FILE_EN: "downloads/technical-web-audit-executive-report-en.pdf",
        SES_FROM_EMAIL: process.env.SES_FROM_EMAIL || "info@tallerdedigitalizacion.com",
        CALENDLY_URL: process.env.WEB_AUDIT_CALENDLY_URL || "https://cal.com/taller-de-digitalizacion/free-15-min-website-speed-call",
        ALLOWED_ORIGIN: allowedOrigin,
        AUDIT_CLIENT_TOKEN: process.env.AUDIT_CLIENT_TOKEN || "",
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || "",
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || "",
        IP_HASH_SALT: process.env.IP_HASH_SALT || "change-me",
        NODE_ENV: process.env.NODE_ENV || "production",
      },
    });

    table.grantWriteData(handler);
    handler.addToRolePolicy(
      new PolicyStatement({
        actions: ["ses:SendRawEmail", "ses:SendEmail"],
        resources: ["*"],
      }),
    );

    const functionUrl = handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "WebAuditFunctionUrl", {
      value: functionUrl.url,
      description: "Use this value as PUBLIC_WEB_AUDIT_API_URL in Astro.",
    });
  }
}
