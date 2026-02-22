import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
};

const ROLE_COLUMNS: RoleColumn[] = [
  { id: "admin", name: "Admin" },
  { id: "finance", name: "Finance" },
  { id: "hr", name: "HR" },
  { id: "manager", name: "Manager" },
  { id: "staff", name: "Staff" },
];

const ACCESS_ROWS: AccessRow[] = [
  { id: "dashboard_view", name: "View Dashboard" },
  { id: "finance_invoice_view", name: "View Invoices" },
  { id: "finance_invoice_create", name: "Create Invoice" },
  { id: "finance_payment_approve", name: "Approve Payment" },
  { id: "inventory_view", name: "View Inventory" },
  { id: "inventory_edit", name: "Edit Inventory" },
  { id: "hr_employee_view", name: "View Employees" },
  { id: "hr_employee_manage", name: "Manage Employees" },
  { id: "report_export", name: "Export Reports" },
];

const INITIAL_ASSIGNMENTS: Record<string, Record<string, boolean>> = {
  dashboard_view: { admin: true, finance: true, hr: true, manager: true, staff: true },
  finance_invoice_view: { admin: true, finance: true, hr: false, manager: true, staff: false },
  finance_invoice_create: { admin: true, finance: true, hr: false, manager: true, staff: false },
  finance_payment_approve: { admin: true, finance: true, hr: false, manager: false, staff: false },
  inventory_view: { admin: true, finance: false, hr: false, manager: true, staff: true },
  inventory_edit: { admin: true, finance: false, hr: false, manager: true, staff: false },
  hr_employee_view: { admin: true, finance: false, hr: true, manager: true, staff: false },
  hr_employee_manage: { admin: true, finance: false, hr: true, manager: false, staff: false },
  report_export: { admin: true, finance: true, hr: true, manager: true, staff: false },
};

export default function AccessRolesPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);

  const toggleAccess = (accessId: string, roleId: string, checked: boolean) => {
    setAssignments((prev) => ({
      ...prev,
      [accessId]: {
        ...prev[accessId],
        [roleId]: checked,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            Access Roles Matrix
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Dummy access-role matrix. Rows are access names, columns are roles.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-9 gap-2 text-xs font-semibold"
          onClick={() => navigate("/access-control/roles")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roles
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm">
        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                  <TableHead className="min-w-[260px] text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                    Access Name
                  </TableHead>
                  {ROLE_COLUMNS.map((role) => (
                    <TableHead
                      key={role.id}
                      className="text-center text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400"
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
                    className="border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5"
                  >
                    <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {access.name}
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
