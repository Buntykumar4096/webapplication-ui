import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import type { StatusTone } from "@/types";

export function StatCard({
  label,
  value,
  change,
  context,
  tone,
  icon: Icon,
  currency,
}: {
  label: string;
  value: number;
  change: string;
  context: string;
  tone: StatusTone;
  icon: LucideIcon;
  currency?: boolean;
}) {
  return (
    <Card className="min-h-[132px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {currency ? formatCurrency(value) : formatCompactNumber(value)}
          </div>
        </div>
        <div className="rounded-md border border-border bg-surface-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <StatusPill tone={tone}>{change}</StatusPill>
        <span className="truncate text-xs text-muted-foreground">{context}</span>
      </div>
    </Card>
  );
}
