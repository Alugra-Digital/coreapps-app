import { FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { QuotationTable } from "./components/QuotationTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getQuotations } from "@/api/quotations";
import type { Quotation } from "./types";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadQuotations = async () => {
    const data = await getQuotations();
    setQuotations(data);
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const draftCount = quotations.filter((q) => q.status === "draft").length;
  const acceptedCount = quotations.filter((q) => q.status === "accepted").length;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Quotations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage quotations for clients - pricing proposals before PO/Invoice.
          </p>
        </div>
        <Button
          className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Quotation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuotationStatCard
          title="Total"
          value={String(quotations.length)}
          description="All quotations"
          icon={<FileText className="h-4 w-4" />}
          color="#3b82f6"
        />
        <QuotationStatCard
          title="Draft"
          value={String(draftCount)}
          description="In progress"
          icon={<FileText className="h-4 w-4" />}
          color="#f59e0b"
        />
        <QuotationStatCard
          title="Accepted"
          value={String(acceptedCount)}
          description="Won"
          icon={<FileText className="h-4 w-4" />}
          color="#10b981"
        />
      </div>

      <QuotationTable
        quotations={quotations}
        onRefresh={loadQuotations}
        onAddClick={() => setIsAddOpen(true)}
        isAddOpen={isAddOpen}
        onAddOpenChange={setIsAddOpen}
      />
    </div>
  );
}

function QuotationStatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
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
          <div className="text-[10px] text-slate-400 leading-tight">
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
