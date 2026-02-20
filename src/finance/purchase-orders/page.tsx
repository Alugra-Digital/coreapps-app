import { FileText, Plus, FileCheck, FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import { PurchaseOrderTable } from "./components/PurchaseOrderTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPurchaseOrders } from "@/api/purchase-orders";
import type { PurchaseOrder } from "./types";

export default function PurchaseOrderPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadPurchaseOrders = async () => {
    const data = await getPurchaseOrders();
    setPurchaseOrders(data);
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Purchase Order
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage purchase orders as proof of transaction between buyer and seller.
          </p>
        </div>
        <Button
          className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <POStatCard
          title="Total POs"
          value={String(purchaseOrders.length)}
          description="All purchase orders"
          icon={<FileText className="h-4 w-4" />}
          color="#3b82f6"
        />
        <POStatCard
          title="This Month"
          value={String(
            purchaseOrders.filter(
              (p) =>
                new Date(p.orderInfo.poDate).getMonth() === new Date().getMonth()
            ).length
          )}
          description="Created this month"
          icon={<FileCheck className="h-4 w-4" />}
          color="#10b981"
        />
        <POStatCard
          title="Vendors"
          value={String(
            new Set(purchaseOrders.map((p) => p.vendorInfo.vendorName)).size
          )}
          description="Unique vendors"
          icon={<FileQuestion className="h-4 w-4" />}
          color="#f59e0b"
        />
      </div>

      <PurchaseOrderTable
        purchaseOrders={purchaseOrders}
        onRefresh={loadPurchaseOrders}
        onAddClick={() => setIsAddOpen(true)}
        isAddOpen={isAddOpen}
        onAddOpenChange={setIsAddOpen}
      />
    </div>
  );
}

function POStatCard({
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
