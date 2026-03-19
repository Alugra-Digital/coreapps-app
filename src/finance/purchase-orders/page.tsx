import { useId, useState } from "react";
import { FileText, Plus, FileCheck, Handshake, ArrowRight, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { PurchaseOrderTable } from "./components/PurchaseOrderTable";
import { ClientPurchaseOrderTable } from "./components/ClientPurchaseOrderTable";
import { ClientPurchaseOrderFormDialog } from "./components/ClientPurchaseOrderFormDialog";
import { ClientPurchaseOrderViewDialog } from "./components/ClientPurchaseOrderViewDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import { useClientPurchaseOrders, useVerifyClientPurchaseOrder } from "@/hooks/useClientPurchaseOrders";
import { PageLoader } from "@/components/ui/PageLoader";
import type { ClientPurchaseOrder } from "./clientPurchaseOrderTypes";
import { toast } from "sonner";

const totalPriceChartData = [
  { value: 35 }, { value: 48 }, { value: 42 }, { value: 55 }, { value: 60 }, { value: 52 }, { value: 70 },
];

const thisMonthChartData = [
  { value: 20 }, { value: 28 }, { value: 25 }, { value: 35 }, { value: 40 }, { value: 38 }, { value: 45 },
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
  const navigate = useNavigate();
  const { data: purchaseOrders = [], refetch, isLoading } = usePurchaseOrders();
  const { data: clientPOs = [], refetch: refetchCPO, isLoading: isLoadingCPO } = useClientPurchaseOrders();
  const verifyMutation = useVerifyClientPurchaseOrder();

  const [activeTab, setActiveTab] = useState("po-keluar");

  // PO Masuk dialog states
  const [cpoFormOpen, setCpoFormOpen] = useState(false);
  const [cpoEditTarget, setCpoEditTarget] = useState<ClientPurchaseOrder | null>(null);
  const [cpoViewTarget, setCpoViewTarget] = useState<ClientPurchaseOrder | null>(null);

  // PO Keluar stats
  const totalPrice = purchaseOrders.reduce((sum, po) => {
    return sum + po.lineItems.reduce((s, item) => s + (item.priceAfterTax ?? item.subtotal ?? 0), 0);
  }, 0);

  const thisMonthCount = purchaseOrders.filter(
    (p) => new Date(p.orderInfo.poDate).getMonth() === new Date().getMonth()
  ).length;

  const clientNames = [
    ...new Set(purchaseOrders.map((p) => p.vendorInfo?.vendorName ?? p.clientId ?? "").filter(Boolean)),
  ];
  const primaryClient = clientNames[0] ?? null;

  // PO Masuk stats
  const cpoTotalAmount = clientPOs.reduce((sum, c) => sum + (c.amount || 0), 0);
  const cpoThisMonth = clientPOs.filter(
    (c) => c.receivedDate && new Date(c.receivedDate).getMonth() === new Date().getMonth()
  ).length;
  const cpoVerifiedCount = clientPOs.filter((c) => c.status === "VERIFIED").length;

  const handleVerifyCPO = (cpo: ClientPurchaseOrder) => {
    verifyMutation.mutate(cpo.id, {
      onSuccess: () => {
        toast.success(`PO Masuk ${cpo.cpoNumber} verified`);
        refetchCPO();
        setCpoViewTarget(null);
      },
      onError: (err: Error) => toast.error(err.message || "Failed to verify"),
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              Purchase Orders
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Manage outgoing and incoming procurement documents.
            </p>
          </div>
          {activeTab === "po-keluar" ? (
            <Button
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
              onClick={() => navigate("/finance/purchase-orders/create")}
            >
              <Plus className="h-4 w-4 mr-2" /> New PO Keluar
            </Button>
          ) : (
            <Button
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#3b82f6]/10 transition-all active:scale-95"
              onClick={() => setCpoFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> New PO Masuk
            </Button>
          )}
        </div>

        {/* ─── PO TYPE TABS ─── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#111113] border border-[#1E1E22] p-1.5 h-14 rounded-2xl w-full md:w-auto justify-start gap-2 px-4 shadow-xl">
            <TabsTrigger
              value="po-keluar"
              className="data-[state=active]:bg-[#F5A623]/10 data-[state=active]:text-[#F5A623] data-[state=active]:border-[#F5A623]/30 rounded-xl px-6 h-10 transition-all border border-transparent font-bold"
            >
              <ArrowUpFromLine className="h-4 w-4 mr-2" /> PO Keluar
            </TabsTrigger>
            <TabsTrigger
              value="po-masuk"
              className="data-[state=active]:bg-[#3b82f6]/10 data-[state=active]:text-[#3b82f6] data-[state=active]:border-[#3b82f6]/30 rounded-xl px-6 h-10 transition-all border border-transparent font-bold"
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" /> PO Masuk
            </TabsTrigger>
          </TabsList>

          {/* ═══ PO KELUAR TAB ═══ */}
          <TabsContent value="po-keluar" className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <POStatCard
                title="Total Volume"
                value={formatCurrencyCompact(totalPrice)}
                description={`${purchaseOrders.length} documents issued`}
                icon={<FileText className="h-4 w-4" />}
                color="#F5A623"
                chartData={totalPriceChartData}
                chartColor="#F5A623"
              />
              <POStatCard
                title="Activity (MTD)"
                value={String(thisMonthCount)}
                description="Issued this calendar month"
                icon={<FileCheck className="h-4 w-4" />}
                color="#22C55E"
                chartData={thisMonthChartData}
                chartColor="#22C55E"
              />
              <POStatCard
                title="Key Supplier"
                value={primaryClient != null ? String(primaryClient) : "—"}
                description={primaryClient ? "Top transaction volume" : "No vendor data yet"}
                icon={<Handshake className="h-4 w-4" />}
                color="#3b82f6"
                isVendorHighlight
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ArrowUpFromLine className="h-5 w-5 text-[#F5A623]" />
                  PO Keluar — Document Registry
                </h2>
                <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </div>
              </div>
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 bg-[#111113] border border-[#1E1E22] rounded-3xl">
                  <PageLoader />
                </div>
              ) : (
                <PurchaseOrderTable
                  purchaseOrders={purchaseOrders}
                  onRefresh={() => refetch()}
                />
              )}
            </div>
          </TabsContent>

          {/* ═══ PO MASUK TAB ═══ */}
          <TabsContent value="po-masuk" className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <POStatCard
                title="Total Received"
                value={formatCurrencyCompact(cpoTotalAmount)}
                description={`${clientPOs.length} documents received`}
                icon={<ArrowDownToLine className="h-4 w-4" />}
                color="#3b82f6"
                chartData={thisMonthChartData}
                chartColor="#3b82f6"
              />
              <POStatCard
                title="This Month"
                value={String(cpoThisMonth)}
                description="Received this calendar month"
                icon={<FileCheck className="h-4 w-4" />}
                color="#22C55E"
                chartData={totalPriceChartData}
                chartColor="#22C55E"
              />
              <POStatCard
                title="Verified"
                value={String(cpoVerifiedCount)}
                description={`of ${clientPOs.length} total PO Masuk`}
                icon={<FileCheck className="h-4 w-4" />}
                color="#8b5cf6"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ArrowDownToLine className="h-5 w-5 text-[#3b82f6]" />
                  PO Masuk — Client Purchase Orders
                </h2>
                <div className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Live System
                </div>
              </div>
              {isLoadingCPO ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 bg-[#111113] border border-[#1E1E22] rounded-3xl">
                  <PageLoader />
                </div>
              ) : (
                <ClientPurchaseOrderTable
                  purchaseOrders={clientPOs}
                  onRefresh={() => refetchCPO()}
                  onView={(cpo) => setCpoViewTarget(cpo)}
                  onEdit={(cpo) => {
                    setCpoEditTarget(cpo);
                    setCpoFormOpen(true);
                  }}
                  onVerify={handleVerifyCPO}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* PO Masuk Dialogs */}
      <ClientPurchaseOrderFormDialog
        open={cpoFormOpen}
        onOpenChange={(o) => {
          setCpoFormOpen(o);
          if (!o) setCpoEditTarget(null);
        }}
        purchaseOrder={cpoEditTarget}
        onSuccess={() => refetchCPO()}
      />

      <ClientPurchaseOrderViewDialog
        purchaseOrder={cpoViewTarget}
        onOpenChange={(o) => { if (!o) setCpoViewTarget(null); }}
        onEdit={() => {
          if (cpoViewTarget) {
            setCpoEditTarget(cpoViewTarget);
            setCpoViewTarget(null);
            setCpoFormOpen(true);
          }
        }}
        onVerify={() => {
          if (cpoViewTarget) handleVerifyCPO(cpoViewTarget);
        }}
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
    <Card className="bg-[#111113] border-[#1E1E22] overflow-hidden group hover:border-[#F5A623]/30 transition-all duration-500 shadow-2xl">
      <CardContent className="p-0">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-[#0A0A0B] border border-[#1E1E22] transition-colors group-hover:border-[#F5A623]/50">
              <div style={{ color: color }}>{icon}</div>
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
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 w-8 rounded-full bg-[#1E1E22] overflow-hidden">
                      <div className="h-full bg-[#F5A623]/20 w-1/2 animate-[shimmer_2s_infinite]" style={{ animationDelay: `${i * 0.5}s` }} />
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
