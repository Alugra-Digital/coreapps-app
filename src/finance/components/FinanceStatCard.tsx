import React, { useId } from "react";
import { ArrowRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export interface FinanceStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  chartData?: { value: number }[];
  chartColor?: string;
  isVendorHighlight?: boolean;
}

export function FinanceStatCard({
  title,
  value,
  description,
  icon,
  color,
  chartData,
  chartColor,
  isVendorHighlight,
}: FinanceStatCardProps) {
  const chartId = useId().replace(/:/g, "");

  return (
    <Card className="bg-[#111113] border-[#1E1E22] overflow-hidden group hover:border-[#F5A623]/30 transition-all duration-500 shadow-2xl">
      <CardContent className="p-0">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-[#0A0A0B] border border-[#1E1E22] transition-colors group-hover:border-[#F5A623]/50">
              <div style={{ color }}>{icon}</div>
            </div>
            <span className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">
              {title}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-[#F0F0F0] truncate tracking-tight">
                {value}
              </h3>
              <p className="text-xs text-[#6B6B75] font-medium flex items-center gap-2">
                {description}
                {isVendorHighlight && value !== "—" && (
                  <ArrowRight className="h-3 w-3 text-[#F5A623]" />
                )}
              </p>
            </div>

            {chartData && chartColor ? (
              <div className="h-[60px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={chartColor}
                      strokeWidth={2.5}
                      fill={`url(#grad-${chartId})`}
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[60px] flex items-center justify-center">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-1 w-8 rounded-full bg-[#1E1E22] overflow-hidden">
                      <div
                        className="h-full bg-[#F5A623]/20 w-1/2 animate-[shimmer_2s_infinite]"
                        style={{ animationDelay: `${i * 0.5}s` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
