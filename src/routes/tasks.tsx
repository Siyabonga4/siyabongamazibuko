import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateContent } from "@/lib/ai.functions";
import { ToolShell, OutputCard } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, ListChecks } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Daily Task Planner — WorkFlow AI Hub" },
      { name: "description", content: "Turn your goals into a prioritized daily or weekly schedule." },
    ],
  }),
  component: TasksPage,
});

const timeframes = ["daily", "weekly"] as const;

function TasksPage() {
  const run = useServerFn(generateContent);
  const [timeframe, setTimeframe] = useState<(typeof timeframes)[number]>("daily");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!input.trim()) return toast.error("List a few goals first.");
    setLoading(true);
    setOutput("");
    try {
      const r = await run({ data: { tool: "tasks", timeframe, input } });
      setOutput(r.content);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell title="Daily Task Planner" description="List your goals. Get a prioritized, time-blocked plan.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Timeframe</Label>
            <div className="flex gap-2">
              {timeframes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                    timeframe === t
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
            <Label htmlFor="goals" className="mb-2 block">Goals</Label>
            <Textarea
              id="goals"
              rows={10}
              placeholder="e.g. Finish project proposal, prep for Tuesday demo, gym 3x, reply to investor email."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full" size="lg">
            <ListChecks className="mr-2 h-4 w-4" /> {loading ? "Planning…" : "Build my plan"}
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