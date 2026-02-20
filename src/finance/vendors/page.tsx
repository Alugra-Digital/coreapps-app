import { Truck, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { VendorTable } from "./components/VendorTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getVendors } from "@/api/vendors";
import type { Vendor } from "./types";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadVendors = async () => {
    const data = await getVendors();
    setVendors(data);
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const activeCount = vendors.filter((v) => v.isActive).length;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Vendors
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage vendor/supplier companies for purchase orders.
          </p>
        </div>
        <Button
          className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VendorStatCard
          title="Total Vendors"
          value={String(vendors.length)}
          description="All registered vendors"
          icon={<Truck className="h-4 w-4" />}
          color="#3b82f6"
        />
        <VendorStatCard
          title="Active"
          value={String(activeCount)}
          description="Currently active vendors"
          icon={<Truck className="h-4 w-4" />}
          color="#10b981"
        />
      </div>

      <VendorTable
        vendors={vendors}
        onRefresh={loadVendors}
        onAddClick={() => setIsAddOpen(true)}
        isAddOpen={isAddOpen}
        onAddOpenChange={setIsAddOpen}
      />
    </div>
  );
}

function VendorStatCard({
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
