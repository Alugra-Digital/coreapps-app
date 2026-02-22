import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RoleColumn = {
  id: string;
  name: string;
};

type AccessRow = {
  id: string;
  name: string;
  category: string;
};

type AccessAssignments = Record<string, Record<string, boolean>>;

const ROLE_COLUMNS: RoleColumn[] = [
  { id: "super_admin", name: "Super Admin" },
  { id: "finance", name: "Finance" },
  { id: "procurement", name: "Procurement" },
  { id: "hr", name: "HR" },
  { id: "auditor", name: "Auditor" },
];

const ACCESS_ROWS: AccessRow[] = [
  { id: "dashboard_view", name: "View Dashboard", category: "General" },
  { id: "invoice_create", name: "Create Invoice", category: "Finance" },
  { id: "invoice_approve", name: "Approve Invoice", category: "Finance" },
  { id: "payment_release", name: "Release Payment", category: "Finance" },
  { id: "po_create", name: "Create Purchase Order", category: "Procurement" },
  { id: "po_approve", name: "Approve Purchase Order", category: "Procurement" },
  { id: "employee_view", name: "View Employees", category: "HR" },
  { id: "employee_manage", name: "Manage Employees", category: "HR" },
  { id: "reports_export", name: "Export Reports", category: "Reporting" },
];

const INITIAL_ASSIGNMENTS: AccessAssignments = {
  dashboard_view: {
    super_admin: true,
    finance: true,
    procurement: true,
    hr: true,
    auditor: true,
  },
  invoice_create: {
    super_admin: true,
    finance: true,
    procurement: false,
    hr: false,
    auditor: false,
  },
  invoice_approve: {
    super_admin: true,
    finance: true,
    procurement: false,
    hr: false,
    auditor: true,
  },
  payment_release: {
    super_admin: true,
    finance: true,
    procurement: false,
    hr: false,
    auditor: true,
  },
  po_create: {
    super_admin: true,
    finance: false,
    procurement: true,
    hr: false,
    auditor: false,
  },
  po_approve: {
    super_admin: true,
    finance: true,
    procurement: true,
    hr: false,
    auditor: true,
  },
  employee_view: {
    super_admin: true,
    finance: false,
    procurement: false,
    hr: true,
    auditor: true,
  },
  employee_manage: {
    super_admin: true,
    finance: false,
    procurement: false,
    hr: true,
    auditor: false,
  },
  reports_export: {
    super_admin: true,
    finance: true,
    procurement: true,
    hr: true,
    auditor: true,
  },
};

export default function RoleAccessPage() {
  const [assignments, setAssignments] = useState<AccessAssignments>(INITIAL_ASSIGNMENTS);

  const toggleAccess = (accessId: string, roleId: string, checked: boolean) => {
    setAssignments((prev) => ({
      ...prev,
      [accessId]: {
        ...prev[accessId],
        [roleId]: checked,
      },
    }));
  };

  const assignedCount = useMemo(
    () =>
      ACCESS_ROWS.reduce((total, access) => {
        const rowAssignments = assignments[access.id] ?? {};
        return total + ROLE_COLUMNS.filter((role) => rowAssignments[role.id]).length;
      }, 0),
    [assignments],
  );

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            Role-Access Matrix
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Rows are access names and columns are roles. Toggle each checkbox to set access.
          </p>
        </div>
        <Card className="border border-slate-200 dark:border-white/10 rounded-sm shadow-none bg-slate-50/60 dark:bg-card/70">
          <CardContent className="px-4 py-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Assigned Cells</div>
            <div className="text-lg font-bold text-slate-900 dark:text-foreground">{assignedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground">
            Access by Role
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-sm border border-slate-100 dark:border-white/10 bg-white dark:bg-background overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/60 dark:bg-white/5">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/10">
                  <TableHead className="min-w-[260px] text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                    Access Name
                  </TableHead>
                  {ROLE_COLUMNS.map((role) => (
                    <TableHead
                      key={role.id}
                      className="min-w-[120px] text-center text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400"
                    >
                      {role.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {ACCESS_ROWS.map((access) => (
                  <TableRow
                    key={access.id}
                    className="border-slate-100 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-white/5"
                  >
                    <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex flex-col">
                        <span className="font-medium">{access.name}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {access.category}
                        </span>
                      </div>
                    </TableCell>

                    {ROLE_COLUMNS.map((role) => (
                      <TableCell key={`${access.id}-${role.id}`} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={Boolean(assignments[access.id]?.[role.id])}
                            onCheckedChange={(checked) =>
                              toggleAccess(access.id, role.id, checked === true)
                            }
                            aria-label={`${access.name} for ${role.name}`}
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
