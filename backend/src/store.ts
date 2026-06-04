import { createHash, randomUUID } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "./config";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export function hashValue(value: string) {
  return createHash("sha256").update(`${config.ipHashSalt}:${value}`).digest("hex");
}

export async function saveLead(action: "diagnostic" | "method", item: Record<string, unknown>) {
  const now = new Date().toISOString();
  const email = String(item.email || "").toLowerCase();
  const id = randomUUID();

  await ddb.send(
    new PutCommand({
      TableName: config.tableName,
      Item: {
        pk: `lead#${email}`,
        sk: `${now}#${id}`,
        entityType: "lead",
        action,
        createdAt: now,
        ...item,
      },
    }),
  );

  return { id, createdAt: now };
}

export async function incrementRate(ip: string, action: string) {
  const bucket = Math.floor(Date.now() / (config.rateLimitWindowSeconds * 1000));
  const expiresAt = Math.floor(Date.now() / 1000) + config.rateLimitWindowSeconds + 120;
  const key = `rate#${hashValue(ip)}#${action}`;

  const result = await ddb.send(
    new UpdateCommand({
      TableName: config.tableName,
      Key: { pk: key, sk: String(bucket) },
      UpdateExpression: "ADD #count :one SET expiresAt = :expiresAt, entityType = :entityType",
      ExpressionAttributeNames: { "#count": "count" },
      ExpressionAttributeValues: {
        ":one": 1,
        ":expiresAt": expiresAt,
        ":entityType": "rate-limit",
      },
      ReturnValues: "UPDATED_NEW",
    }),
  );

  return Number(result.Attributes?.count || 0);
}
