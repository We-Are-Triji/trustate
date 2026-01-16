const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} = require("@aws-sdk/client-apigatewaymanagementapi");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const MESSAGES_TABLE = process.env.MESSAGES_TABLE;
const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE;

const response = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

async function handleConnect(event) {
  const connectionId = event.requestContext.connectionId;
  const transactionId = event.queryStringParameters?.transactionId;
  const userId = event.queryStringParameters?.userId;
  const userName = event.queryStringParameters?.userName;
  const userRole = event.queryStringParameters?.userRole;

  if (!transactionId || !userId) {
    return response(400, { error: "Missing transactionId or userId" });
  }

  const ttl = Math.floor(Date.now() / 1000) + 86400; // 24 hours

  await docClient.send(
    new PutCommand({
      TableName: CONNECTIONS_TABLE,
      Item: {
        connection_id: connectionId,
        transaction_id: transactionId,
        user_id: userId,
        user_name: userName || "Unknown",
        user_role: userRole || "client",
        connected_at: new Date().toISOString(),
        ttl,
      },
    })
  );

  return response(200, { message: "Connected" });
}

async function handleDisconnect(event) {
  const connectionId = event.requestContext.connectionId;

  await docClient.send(
    new DeleteCommand({
      TableName: CONNECTIONS_TABLE,
      Key: { connection_id: connectionId },
    })
  );

  return response(200, { message: "Disconnected" });
}

async function handleSendMessage(event) {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body || "{}");
  const { transactionId, content } = body;

  if (!transactionId || !content) {
    return response(400, { error: "Missing transactionId or content" });
  }

  // Get sender info from connections table
  const connectionResult = await docClient.send(
    new QueryCommand({
      TableName: CONNECTIONS_TABLE,
      KeyConditionExpression: "connection_id = :cid",
      ExpressionAttributeValues: { ":cid": connectionId },
    })
  );

  const sender = connectionResult.Items?.[0];
  if (!sender) {
    return response(400, { error: "Connection not found" });
  }

  const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  // Store message
  await docClient.send(
    new PutCommand({
      TableName: MESSAGES_TABLE,
      Item: {
        transaction_id: transactionId,
        sort_key: `${timestamp}#${messageId}`,
        message_id: messageId,
        sender_id: sender.user_id,
        sender_name: sender.user_name,
        sender_role: sender.user_role,
        content,
        created_at: timestamp,
      },
    })
  );

  // Get all connections for this transaction
  const connectionsResult = await docClient.send(
    new QueryCommand({
      TableName: CONNECTIONS_TABLE,
      IndexName: "transaction_id_index",
      KeyConditionExpression: "transaction_id = :tid",
      ExpressionAttributeValues: { ":tid": transactionId },
    })
  );

  // Broadcast to all connected clients
  const apiClient = new ApiGatewayManagementApiClient({
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  });

  const message = {
    action: "newMessage",
    data: {
      message_id: messageId,
      sender_id: sender.user_id,
      sender_name: sender.user_name,
      sender_role: sender.user_role,
      content,
      created_at: timestamp,
    },
  };

  const sendPromises = connectionsResult.Items.map(async (conn) => {
    try {
      await apiClient.send(
        new PostToConnectionCommand({
          ConnectionId: conn.connection_id,
          Data: JSON.stringify(message),
        })
      );
    } catch (err) {
      if (err.statusCode === 410) {
        // Connection stale, remove it
        await docClient.send(
          new DeleteCommand({
            TableName: CONNECTIONS_TABLE,
            Key: { connection_id: conn.connection_id },
          })
        );
      }
    }
  });

  await Promise.all(sendPromises);

  return response(200, { message: "Message sent" });
}

async function handleGetMessages(event) {
  const body = JSON.parse(event.body || "{}");
  const { transactionId, limit = 50 } = body;

  if (!transactionId) {
    return response(400, { error: "Missing transactionId" });
  }

  const result = await docClient.send(
    new QueryCommand({
      TableName: MESSAGES_TABLE,
      KeyConditionExpression: "transaction_id = :tid",
      ExpressionAttributeValues: { ":tid": transactionId },
      ScanIndexForward: false, // Latest first
      Limit: limit,
    })
  );

  // Send messages back to requester
  const apiClient = new ApiGatewayManagementApiClient({
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  });

  await apiClient.send(
    new PostToConnectionCommand({
      ConnectionId: event.requestContext.connectionId,
      Data: JSON.stringify({
        action: "messageHistory",
        data: result.Items.reverse(), // Chronological order
      }),
    })
  );

  return response(200, { message: "Messages sent" });
}

exports.handler = async (event) => {
  const routeKey = event.requestContext.routeKey;

  switch (routeKey) {
    case "$connect":
      return handleConnect(event);
    case "$disconnect":
      return handleDisconnect(event);
    case "sendMessage":
      return handleSendMessage(event);
    case "getMessages":
      return handleGetMessages(event);
    default:
      return response(400, { error: "Unknown route" });
  }
};
