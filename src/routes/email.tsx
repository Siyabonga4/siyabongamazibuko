import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateContent } from "@/lib/ai.functions";
import { ToolShell, OutputCard } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Send } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkFlow AI Hub" },
      { name: "description", content: "Generate professional emails in formal, friendly, or persuasive tone." },
    ],
  }),
  component: EmailPage,
});

const tones = ["formal", "friendly", "persuasive"] as const;

function EmailPage() {
  const run = useServerFn(generateContent);
  const [tone, setTone] = useState<(typeof tones)[number]>("formal");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!input.trim()) return toast.error("Describe what the email is about.");
    setLoading(true);
    setOutput("");
    try {
      const r = await run({ data: { tool: "email", tone, input } });
      setOutput(r.content);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell title="Smart Email Generator" description="Describe what you need to say. Pick a tone. Get a polished email.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Tone</Label>
            <div className="flex gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                    tone === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="ctx" className="mb-2 block">Context</Label>
            <Textarea
              id="ctx"
              rows={10}
              placeholder="e.g. Reply to client asking for project status. Phase 1 done, phase 2 starts Monday."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full" size="lg">
            <Send className="mr-2 h-4 w-4" /> {loading ? "Generating…" : "Generate email"}
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