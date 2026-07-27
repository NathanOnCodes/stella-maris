import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "wine" | "gold" | "neutral" | "danger";
}

const TONS = {
  wine: "bg-wine-950 text-white",
  gold: "bg-gold-500 text-wine-950",
  neutral: "bg-white text-wine-950 border border-wine-900/10",
  danger: "bg-wine-900/10 text-wine-950 border border-wine-900/10",
};

export function PainelMetricCard({ label, value, hint, icon: Icon, tone = "neutral" }: Props) {
  return (
    <article className={`relative overflow-hidden rounded-[1.35rem] p-5 shadow-sm ${TONS[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${tone === "neutral" ? "text-wine-700" : "opacity-70"}`}>{label}</p>
          <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
          {hint && <p className={`mt-2 text-xs ${tone === "neutral" ? "text-muted-foreground" : "opacity-70"}`}>{hint}</p>}
        </div>
        <Icon className="size-5 opacity-60" strokeWidth={1.5} />
      </div>
    </article>
  );
}
