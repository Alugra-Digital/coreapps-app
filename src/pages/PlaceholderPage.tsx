import { Clock } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[800px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
          <Clock className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
          {description ?? "This feature is coming soon. Check back later for updates."}
        </p>
      </div>
    </div>
  );
}
