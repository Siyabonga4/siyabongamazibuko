import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateContent } from "@/lib/ai.functions";
import { ToolShell, OutputCard } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, FileText } from "lucide-react";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkFlow AI Hub" },
      { name: "description", content: "Turn meeting transcripts into summaries, action items, and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(generateContent);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!input.trim()) return toast.error("Paste a meeting transcript first.");
    setLoading(true);
    setOutput("");
    try {
      const r = await run({ data: { tool: "meeting", input } });
      setOutput(r.content);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell title="Meeting Notes Summarizer" description="Paste a transcript. Get a clean summary, action items, and deadlines.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tx" className="mb-2 block">Transcript</Label>
            <Textarea
              id="tx"
              rows={14}
              placeholder="Paste your meeting transcript or notes here…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full" size="lg">
            <FileText className="mr-2 h-4 w-4" /> {loading ? "Summarizing…" : "Summarize meeting"}
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Result</Label>
            {output && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied");
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            )}
          </div>
          <OutputCard content={output} loading={loading} />
        </div>
      </div>
    </ToolShell>
  );
}