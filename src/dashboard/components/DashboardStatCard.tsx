import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
  className?: string;
}

export function DashboardStatCard({
  title,
  value,
  description,
  icon,
  color,
  className,
}: DashboardStatCardProps) {
  return (
    <Card
      className={`shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow ${className ?? ""}`}
    >
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
      </div>
      <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-slate-900 dark:text-foreground leading-none">
            {value}
          </div>
          {description && (
            <div className="text-[10px] text-slate-400 leading-tight">
              {description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
