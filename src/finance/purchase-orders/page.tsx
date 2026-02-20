import { useId } from "react";
import { FileText, Plus, FileCheck, Handshake, Crown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { PurchaseOrderTable } from "./components/PurchaseOrderTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPurchaseOrders } from "@/api/purchase-orders";
import type { PurchaseOrder } from "./types";

const totalPriceChartData = [
  { value: 35 },
  { value: 48 },
  { value: 42 },
  { value: 55 },
  { value: 60 },
  { value: 52 },
  { value: 70 },
];

const thisMonthChartData = [
  { value: 20 },
  { value: 28 },
  { value: 25 },
  { value: 35 },
  { value: 40 },
  { value: 38 },
  { value: 45 },
];

function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2, minimumFractionDigits: 0 })} B`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2, minimumFractionDigits: 0 })} jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 1, minimumFractionDigits: 0 })} rb`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

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

  const totalPrice = purchaseOrders.reduce((sum, po) => {
    return (
      sum +
      (po.lineItems ?? []).reduce(
        (s, item) => s + (item.priceAfterTax ?? item.subtotal ?? 0),
        0
      )
    );
  }, 0);

  const thisMonthCount = purchaseOrders.filter(
    (p) =>
      new Date(p.orderInfo.poDate).getMonth() === new Date().getMonth()
  ).length;

  const vendorNames = [
    ...new Set(purchaseOrders.map((p) => p.vendorInfo.vendorName)),
  ];
  const primaryVendor = vendorNames[0] ?? null;

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
          title="Total Price"
          value={formatCurrencyCompact(totalPrice)}
          description={`${purchaseOrders.length} purchase orders`}
          icon={<FileText className="h-4 w-4" />}
          color="#3b82f6"
          chartData={totalPriceChartData}
          chartColor="#3b82f6"
        />
        <POStatCard
          title="This Month"
          value={String(thisMonthCount)}
          description="Created this month"
          icon={<FileCheck className="h-4 w-4" />}
          color="#10b981"
          chartData={thisMonthChartData}
          chartColor="#10b981"
        />
        <POStatCard
          title="Vendors"
          value={primaryVendor ?? "—"}
          description={primaryVendor ? "Trusted partner" : "No vendors yet"}
          icon={<Handshake className="h-4 w-4" />}
          color="#10b981"
          isVendorHighlight
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
  chartData,
  chartColor,
  isVendorHighlight,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  chartData?: { value: number }[];
  chartColor?: string;
  isVendorHighlight?: boolean;
}) {
  const chartId = useId().replace(/:/g, "");

  return (
    <Card
      className={
        isVendorHighlight
          ? "shadow-sm border-none bg-emerald-50/50 dark:bg-emerald-500/5 p-3 rounded-sm group hover:shadow-md transition-shadow border border-emerald-100 dark:border-emerald-500/10"
          : "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow"
      }
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
      <CardContent
        className={
          isVendorHighlight
            ? "p-4 bg-white/80 dark:bg-background/80 rounded-sm border border-emerald-100/50 dark:border-emerald-500/10 shadow-[0_1px_2px_rgba(16,185,129,0.08)]"
            : "p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        }
      >
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div
              className={
                isVendorHighlight
                  ? "text-lg font-bold text-emerald-800 dark:text-emerald-400 leading-tight truncate flex items-center gap-1.5"
                  : "text-2xl font-bold text-slate-900 dark:text-foreground leading-none"
              }
            >
              <span className="truncate">{value}</span>
              {isVendorHighlight && value !== "—" && (
                <Crown className="h-4 w-4 shrink-0 text-amber-500" />
              )}
            </div>
            <div
              className={
                isVendorHighlight
                  ? "text-[10px] text-emerald-600/80 dark:text-emerald-400/70 leading-tight font-medium"
                  : "text-[10px] text-slate-400 leading-tight"
              }
            >
              {description}
            </div>
          </div>
          {chartData && chartColor && (
            <div className="flex-1 h-[60px] min-w-[80px] max-w-[120px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id={`po-gradient-${chartId}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartColor}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#po-gradient-${chartId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
