"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { VisualizacaoPorPeriodo } from "@/features/metricas/types";

interface Props {
  dados: VisualizacaoPorPeriodo[];
}

export function GraficoAcessos({ dados }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="periodo"
          tick={{ fontSize: 12 }}
          className="text-xs text-muted-foreground font-ui"
        />
        <YAxis
          className="text-xs text-muted-foreground font-ui"
          allowDecimals={false}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
