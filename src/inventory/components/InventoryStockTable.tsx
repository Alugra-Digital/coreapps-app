import {
  Package,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const inventoryItems = [
  {
    sku: "ASSET-1021",
    name: 'MacBook Pro 14" M3 Max',
    category: "Workstations",
    stock: 12,
    minStock: 5,
    status: "In Stock",
    price: "$2,499.00",
  },
  {
    sku: "ASSET-4052",
    name: "Dell PowerEdge R760",
    category: "Servers",
    stock: 2,
    minStock: 3,
    status: "Low Stock",
    price: "$8,500.00",
  },
  {
    sku: "ASSET-9012",
    name: "Cisco Catalyst 9300",
    category: "Networking",
    stock: 8,
    minStock: 4,
    status: "In Stock",
    price: "$4,200.00",
  },
  {
    sku: "LIC-8821",
    name: "Microsoft 365 Enterprise",
    category: "Software",
    stock: 0,
    minStock: 50,
    status: "Out of Stock",
    price: "$36.00/mo",
  },
  {
    sku: "ASSET-3021",
    name: "Logitech MX Master 3S",
    category: "Peripherals",
    stock: 45,
    minStock: 10,
    status: "In Stock",
    price: "$99.00",
  },
];

export function InventoryStockTable() {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3 px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <Package className="h-4 w-4" /> IT Asset Inventory
        </span>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              placeholder="Search assets, license..."
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-48 text-foreground"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-2 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            Actions <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-white/5">
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
              <TableHead className="w-12 text-center py-4">
                <Checkbox className="rounded-sm border-slate-300 dark:border-white/20" />
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Product Details
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Category
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Stock Level
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Status
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item, i) => (
              <TableRow
                key={item.sku}
                className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
              >
                <TableCell className="text-center py-3">
                  <Checkbox
                    checked={i === 0}
                    className="rounded-sm border-slate-300 dark:border-white/20 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-primary"
                  />
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {item.sku}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-full">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {item.stock} Units
                    </span>
                    <div className="w-24 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          item.stock <= item.minStock
                            ? "bg-red-500"
                            : "bg-emerald-500",
                        )}
                        style={{
                          width: `${Math.min(100, (item.stock / 50) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0 rounded-full border-none",
                      item.status === "In Stock" &&
                        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
                      item.status === "Low Stock" &&
                        "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
                      item.status === "Out of Stock" &&
                        "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500",
                    )}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
