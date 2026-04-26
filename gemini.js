export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { system, messages, max_tokens } = req.body;

  // Convert Anthropic-style messages to Gemini format
  const geminiContents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Prepend system prompt as a user/model pair if present
  if (system) {
    geminiContents.unshift(
      { role: "user", parts: [{ text: `System instructions:\n${system}` }] },
      { role: "model", parts: [{ text: "Understood. I will follow these instructions." }] }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: max_tokens || 2048,
        temperature: 0.7,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  // Convert Gemini response back to Anthropic-style format so App.jsx works unchanged
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  res.status(200).json({
    content: [{ type: "text", text }],
  });
}
