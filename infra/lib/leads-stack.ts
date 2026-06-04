import path from "node:path";
import { fileURLToPath } from "node:url";
import { Duration, RemovalPolicy, Stack, type StackProps, CfnOutput } from "aws-cdk-lib";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

export class LeadsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const leadsTable = new Table(this, "LeadsTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "expiresAt",
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const apiHandler = new NodejsFunction(this, "LeadsApiHandler", {
      entry: path.join(rootDir, "backend/src/index.ts"),
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
        LEADS_TABLE_NAME: leadsTable.tableName,
        EMAIL_DRIVER: process.env.EMAIL_DRIVER || "ses",
        SENDER_EMAIL: process.env.SENDER_EMAIL || "info@tallerdedigitalizacion.com",
        NOTIFY_EMAIL: process.env.NOTIFY_EMAIL || "info@tallerdedigitalizacion.com",
        SMTP_HOST: process.env.SMTP_HOST || "smtp.zoho.eu",
        SMTP_PORT: process.env.SMTP_PORT || "465",
        SMTP_SECURE: process.env.SMTP_SECURE || "true",
        SMTP_USER: process.env.SMTP_USER || "",
        SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
        SITE_URL: process.env.PUBLIC_SITE_URL || "https://tallerdedigitalizacion.com",
        BOOKING_URL: process.env.BOOKING_URL || "https://calendly.com/tallerdedigitalizacion-info/30min",
        ALLOWED_ORIGINS:
          process.env.ALLOWED_ORIGINS || "https://tallerdedigitalizacion.com,http://localhost:4322,http://localhost:4323",
        IP_HASH_SALT: process.env.IP_HASH_SALT || "b91e4c6cfe32f2309c14f9edecc3490abf3a259bede1c27da7b160814d19febe",
        METHOD_PDF_FILE: "downloads/metodo-auditoria-caos-operativo.pdf",
      },
    });

    leadsTable.grantReadWriteData(apiHandler);
    apiHandler.addToRolePolicy(
      new PolicyStatement({
        actions: ["ses:SendRawEmail", "ses:SendEmail"],
        resources: ["*"],
      }),
    );

    const api = new RestApi(this, "LeadsApi", {
      restApiName: "taller-digitalizacion-leads-api",
      description: "API pública para capturar leads de Taller de Digitalización.",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["content-type"],
      },
    });

    const integration = new LambdaIntegration(apiHandler);
    const lead = api.root.addResource("lead");
    lead.addResource("diagnostic").addMethod("POST", integration);
    lead.addResource("method").addMethod("POST", integration);
    api.root.addResource("health").addMethod("GET", integration);

    new CfnOutput(this, "LeadsApiUrl", {
      value: api.url,
      description: "URL base de la API. Usar este valor en siteConfig.formEndpoint.",
    });
  }
}
