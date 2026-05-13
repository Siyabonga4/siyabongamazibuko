import { ReactNode } from "react";

export function ToolShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      {children}
    </main>
  );
}

export function OutputCard({ content, loading }: { content: string; loading: boolean }) {
  return (
    <div
      className="min-h-[280px] rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]"
      style={{ background: "var(--gradient-card)" }}
    >
      {loading ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <span className="animate-pulse">Thinking…</span>
        </div>
      ) : content ? (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{content}</pre>
      ) : (
        <p className="text-sm text-muted-foreground">Output will appear here.</p>
      )}
    </div>
  );
}