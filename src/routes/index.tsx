import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Compose formal, friendly, or persuasive emails in seconds.",
  },
  {
    to: "/meetings" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn long transcripts into summaries, action items, and deadlines.",
  },
  {
    to: "/tasks" as const,
    icon: ListTodo,
    title: "AI Task Planner",
    desc: "Generate prioritized daily or weekly schedules from your goals.",
  },
];

function Index() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center font-serif">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by Lovable AI
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
            Your AI co-worker for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              everyday work
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            WorkFlow AI Hub automates the three tasks that eat your day: writing emails,
            summarizing meetings, and planning what to do next.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-hero)" }}
            >
              Try it now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              See tools
            </a>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-card)" }}
            >
              <div
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: "var(--gradient-hero)" }}
              >
                <t.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="mt-5 text-lg font-semibold">{t.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-16 max-w-2xl text-center text-xs text-muted-foreground">
          AI outputs may contain errors or bias. Review before sending. Don't input
          sensitive personal data.
        </p>
      </section>
    </main>
  );
}
