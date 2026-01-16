const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are TruState's AI assistant for a real estate verification platform in the Philippines.

SCOPE - Only help with:
- Account info and settings
- Verification (ID, face verification)
- Transactions
- Platform navigation

RULES:
- Be concise (under 100 words)
- If user asks something you answered before in this conversation, rephrase your answer naturally - don't repeat verbatim
- Politely decline off-topic questions
- Never invent transaction/account details

USER CONTEXT PROVIDED BELOW.`;

const response = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { messages, userContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return response(400, { error: "Messages array required" });
    }

    const context = userContext
      ? `\n\nUser: ${userContext.email || "unknown"} (${userContext.accountType || "unknown"} account)`
      : "";

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT + context },
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
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", await res.text());
      return response(500, { error: "AI service error" });
    }

    const data = await res.json();
    return response(200, { response: data.choices?.[0]?.message?.content || "Sorry, I could not respond." });
  } catch (error) {
    console.error("Lambda error:", error);
    return response(500, { error: "Internal server error" });
  }
};
