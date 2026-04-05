import "dotenv/config";
import OpenAI from "openai";
import express from "express";
import cors from "cors";
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

if (!process.env.OPENAPIROUTERKEY) {
  console.error("Please set OpenRouter API Key in your .env");
  process.exit(1);
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAPIROUTERKEY,
});

const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

const SYSTEM_PROMPT = `
You are an AI assistant acting as a helpful travel agent.
Respond with JSON only. No prose, markdown, or backticks.

Use exactly this schema and field names:
{
  "destination": "string - city, country",
  "best_time": "string - month(s)/season with one sentence why",
  "duration_days": number,
  "top_attractions": ["string", "string", "string"],
  "sample_itinerary": [
    {"day": 1, "plan": "string"},
    {"day": 2, "plan": "string"},
    {"day": 3, "plan": "string"}
  ],
  "estimated_budget_eur": { "low": number, "mid": number, "high": number },
  "local_tips": ["string", "string"]
}

Rules:
- Output valid JSON only, nothing else.
- Keep numbers unquoted.
- If unsure, use null or [] but keep the schema.
`;

const app = express();
app.use(cors(corsOptions));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/travel-plan", async (req, res) => {
  const city = (req.query.city || "Tokyo").toString();
  const country = (req.query.country || "Japan").toString();
  const days = Number(req.query.days || 3);

  const USER_PROMPT = `Create a ${days} day travel plan for ${country},${city} for a first time visitor.`;

  console.log("Sending request to OpenRouter...");
  console.log(
    "Using Key:",
    process.env.OPENAPIROUTERKEY?.substring(0, 10) + "...",
  );

  try {
    const resp = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT },
      ],
    });

    console.log("Response received:");
    console.log("raw response", JSON.stringify(resp, null, 2));

    const content =
      resp.choices?.[0]?.message?.content || "No content in response";

    try {
      const parsed = JSON.parse(content);
      return res.json(parsed);
    } catch (error) {
      return res
        .status(502)
        .json({ error: "Model did not return valid json", raw: content });
    }
  } catch (e) {
    console.error("Error Detail:", e.response?.data || e.message);
    return res
      .status(500)
      .json({ error: "API Request Failed", details: e.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} Try localhost with /api/travel-plan`);
});
