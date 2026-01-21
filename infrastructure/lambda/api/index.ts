import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { TOTP } from "otpauth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RouteHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

const routes: Record<string, Record<string, RouteHandler>> = {
  "/api/transactions": {
    POST: createTransaction,
    GET: getTransactions,
  },
  "/api/transactions/{id}": {
    GET: getTransaction,
  },
  "/api/transactions/{id}/access": {
    GET: getTransactionAccess,
    POST: verifyTransactionAccess,
  },
  "/api/broker/nexus": {
    GET: getBrokerNexus,
  },
  "/api/broker/nexus/generate": {
    POST: generateBrokerNexus,
  },
  "/api/broker/nexus/verify": {
    POST: verifyBrokerNexus,
  },
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const path = event.resource;
  const method = event.httpMethod;

  const routeHandlers = routes[path];
  if (!routeHandlers) {
    return response(404, { error: "Route not found" });
  }

  const handler = routeHandlers[method];
  if (!handler) {
    return response(405, { error: "Method not allowed" });
  }

  try {
    return await handler(event);
  } catch (error: any) {
    console.error("Handler error:", error);
    return response(500, { error: error.message || "Internal server error" });
  }
};

function response(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
    body: JSON.stringify(body),
  };
}

// Transaction handlers
async function createTransaction(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || "{}");
  // Implementation from app/api/transactions/route.ts
  return response(200, { message: "Not implemented yet" });
}

async function getTransactions(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return response(200, { transactions: [] });
}

async function getTransaction(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;
  return response(200, { id });
}

async function getTransactionAccess(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return response(200, { message: "Not implemented yet" });
}

async function verifyTransactionAccess(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return response(200, { message: "Not implemented yet" });
}

// Broker nexus handlers
async function getBrokerNexus(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const brokerId = event.queryStringParameters?.brokerId;

  if (!brokerId) {
    return response(400, { error: "Broker ID required" });
  }

  const { data, error } = await supabase
    .from("broker_nexus")
    .select("nexus_code, totp_secret")
    .eq("broker_id", brokerId)
    .single();

  if (error || !data) {
    return response(404, { error: "Nexus not found" });
  }

  return response(200, data);
}

async function generateBrokerNexus(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { brokerId } = JSON.parse(event.body || "{}");

  if (!brokerId) {
    return response(400, { error: "Broker ID required" });
  }

  const { data: existing } = await supabase
    .from("broker_nexus")
    .select("nexus_code")
    .eq("broker_id", brokerId)
    .single();

  if (existing) {
    return response(400, { error: "Nexus already exists" });
  }

  const nexusCode = nanoid(12);
  const totp = new TOTP({
    issuer: "TruState",
    label: "Broker Nexus",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });
  const totpSecret = totp.secret.base32;

  const { data, error } = await supabase
    .from("broker_nexus")
    .insert({
      broker_id: brokerId,
      nexus_code: nexusCode,
      totp_secret: totpSecret,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return response(500, { error: error.message });
  }

  return response(200, { nexusCode });
}

async function verifyBrokerNexus(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { nexusCode, totpCode, agentId } = JSON.parse(event.body || "{}");

  if (!nexusCode || !totpCode || !agentId) {
    return response(400, { error: "Missing required fields" });
  }

  const { data: nexus, error: nexusError } = await supabase
    .from("broker_nexus")
    .select("broker_id, totp_secret")
    .eq("nexus_code", nexusCode)
    .single();

  if (nexusError || !nexus) {
    return response(404, { error: "Invalid nexus code" });
  }

  const totp = new TOTP({
    issuer: "TruState",
    label: "Broker Nexus",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: nexus.totp_secret,
  });

  const delta = totp.validate({ token: totpCode, window: 1 });
  if (delta === null) {
    return response(401, { error: "Invalid verification code" });
  }

  const { data, error } = await supabase
    .from("agent_broker_requests")
    .insert({
      agent_id: agentId,
      broker_id: nexus.broker_id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return response(400, { error: "Request already exists" });
    }
    return response(500, { error: error.message });
  }

  return response(200, { success: true, brokerId: nexus.broker_id });
}
