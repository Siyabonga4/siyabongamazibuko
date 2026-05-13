import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PROMPTS = {
  email: (tone: string, context: string) =>
    `Write a professional ${tone} email based on the following context. Output ONLY the email (subject line on first line as "Subject: ...", then a blank line, then the body). Do not add commentary.\n\nContext:\n${context}`,
  meeting: (transcript: string) =>
    `You are summarizing a meeting transcript. Return markdown with three sections in this order:\n## Summary\n(3-5 sentences)\n## Action Items\n- bullet list (assignee in **bold** if mentioned)\n## Deadlines\n- bullet list (date — what)\n\nTranscript:\n${transcript}`,
  tasks: (timeframe: string, goals: string) =>
    `Create a prioritized ${timeframe} schedule from the user's goals below. Return markdown:\n## ${timeframe === "daily" ? "Today's Plan" : "This Week's Plan"}\n${timeframe === "daily" ? "Group by Morning / Afternoon / Evening." : "Group by day (Mon–Fri)."} Each task: time block — task — priority (High/Med/Low). End with a short "Focus tip" line.\n\nGoals:\n${goals}`,
};

const InputSchema = z.object({
  tool: z.enum(["email", "meeting", "tasks"]),
  tone: z.string().max(40).optional(),
  timeframe: z.enum(["daily", "weekly"]).optional(),
  input: z.string().min(1).max(8000),
});

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((d) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    let prompt = "";
    if (data.tool === "email") prompt = PROMPTS.email(data.tone || "formal", data.input);
    else if (data.tool === "meeting") prompt = PROMPTS.meeting(data.input);
    else prompt = PROMPTS.tasks(data.timeframe || "daily", data.input);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are WorkFlow AI, a concise productivity assistant. Always follow output formatting instructions exactly." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace Settings.");
    if (!res.ok) {
      const t = await res.text();
      console.error("AI error", res.status, t);
      throw new Error("AI request failed");
    }
    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });