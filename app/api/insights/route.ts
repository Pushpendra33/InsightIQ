import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, dataSummary, columns, rowCount } = await req.json();

    if (!question || !dataSummary) {
      return NextResponse.json({ error: "Missing question or data" }, { status: 400 });
    }

    const systemPrompt = `You are an expert data analyst AI embedded in InsightIQ, a modern analytics dashboard.
The user has uploaded a CSV dataset with the following properties:
- Columns: ${columns.join(", ")}
- Total rows: ${rowCount}
- Data sample & statistics: ${dataSummary}

Your job is to answer the user's question about this data clearly and concisely.
- Give specific numbers and percentages when possible.
- Highlight trends, anomalies, or actionable insights.
- Format your response in 2-4 short paragraphs max.
- Use plain language — no markdown headers, no bullet points, just clean prose.
- Be direct and confident.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    return NextResponse.json({ answer: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
