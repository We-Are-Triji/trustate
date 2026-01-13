const { RekognitionClient, CreateFaceLivenessSessionCommand, GetFaceLivenessSessionResultsCommand } = require("@aws-sdk/client-rekognition");

const rekognition = new RekognitionClient({});

exports.handler = async (event) => {
  try {
    const { action, sessionId } = JSON.parse(event.body || "{}");

    if (action === "get-results") {
      return await getSessionResults(sessionId);
    }

    return await createSession();
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Liveness session operation failed" }),
    };
  }
};

async function createSession() {
  const command = new CreateFaceLivenessSessionCommand({});
  const result = await rekognition.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId: result.SessionId }),
  };
}

async function getSessionResults(sessionId) {
  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing sessionId" }),
    };
  }

  const command = new GetFaceLivenessSessionResultsCommand({ SessionId: sessionId });
  const result = await rekognition.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: result.Status,
      confidence: result.Confidence,
      referenceImage: result.ReferenceImage,
    }),
  };
}
