const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are TruState's AI assistant, a helpful support agent for a real estate verification platform in the Philippines.

You can ONLY help with:
- Account information and settings
- Verification process (ID verification, face verification)
- Transaction inquiries
- Platform navigation and features

User context will be provided. Use it to personalize responses.

Rules:
- Be concise and helpful
- If asked about topics outside your scope, politely decline and redirect to account-related topics
- Never make up information about specific transactions or account details you don't have
- Keep responses under 150 words`;

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { messages, userContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return response(400, { error: "Messages array required" });
    }

    const contextMessage = userContext
      ? `User context: Email: ${userContext.email || "unknown"}, Account type: ${userContext.accountType || "unknown"}`
      : "";

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT + (contextMessage ? `\n\n${contextMessage}` : "") },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: groqMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Groq API error:", error);
      return response(500, { error: "AI service error" });
    }

    const data = await res.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    return response(200, { response: assistantResponse });
  } catch (error) {
    console.error("Lambda error:", error);
    return response(500, { error: "Internal server error" });
  }
};
