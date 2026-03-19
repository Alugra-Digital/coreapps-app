import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
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
import { useRoles } from "@/hooks/useRoles";
import { updateRole } from "@/api/roles";
import { toast } from "sonner";

/** Access row: id, display name, category, permission key */
const ACCESS_ROWS: { id: string; name: string; category: string; permissionKey: string }[] = [
  { id: "view_dashboard", name: "View Dashboard", category: "General", permissionKey: "dashboard" },
  { id: "create_invoice", name: "Create Invoice", category: "Finance", permissionKey: "finance.invoice.create" },
  { id: "approve_invoice", name: "Approve Invoice", category: "Finance", permissionKey: "finance.invoice.approve" },
  { id: "release_payment", name: "Release Payment", category: "Finance", permissionKey: "finance.payment.release" },
  { id: "create_po", name: "Create Purchase Order", category: "Procurement", permissionKey: "finance.purchase-orders.create" },
  { id: "approve_po", name: "Approve Purchase Order", category: "Procurement", permissionKey: "finance.purchase-orders.approve" },
  { id: "view_employees", name: "View Employees", category: "HR", permissionKey: "hr.employees.view" },
  { id: "manage_employees", name: "Manage Employees", category: "HR", permissionKey: "hr.employees.manage" },
  { id: "export_reports", name: "Export Reports", category: "Reporting", permissionKey: "reports.export" },
];

/** Target role codes for the matrix (from image) */
const TARGET_ROLE_CODES = ["SUPER_ADMIN", "FINANCE", "PROCUREMENT", "HR", "AUDITOR"];

export default function AccessRolesPage() {
  const navigate = useNavigate();
  const { data: roles = [], isLoading: loading } = useRoles();
  const [assignments, setAssignments] = useState<Record<string, Record<string, boolean>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const filtered = roles.filter((r) => TARGET_ROLE_CODES.includes(r.code));
    const initial: Record<string, Record<string, boolean>> = {};
    for (const access of ACCESS_ROWS) {
      initial[access.id] = {};
      for (const role of filtered) {
        const keys = role.permissionKeys ?? [];
        const hasAccess =
          role.code === "SUPER_ADMIN" ||
          keys.includes(access.permissionKey) ||
          keys.includes(access.permissionKey.split(".")[0]);
        initial[access.id][role.id] = hasAccess;
      }
    }
    setAssignments(initial);
  }, [roles]);

  const targetRoles = roles.filter((r) => TARGET_ROLE_CODES.includes(r.code));

  const toggleAccess = (accessId: string, roleId: string, checked: boolean) => {
    setAssignments((prev) => ({
      ...prev,
      [accessId]: {
        ...prev[accessId],
        [roleId]: checked,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const role of targetRoles) {
        const keys = new Set(role.permissionKeys ?? []);
        for (const access of ACCESS_ROWS) {
          const checked = assignments[access.id]?.[role.id];
          if (checked) {
            keys.add(access.permissionKey);
          } else {
            keys.delete(access.permissionKey);
          }
        }
        await updateRole(role.id, { permissionKeys: Array.from(keys) });
      }
      toast.success("Access matrix saved successfully.");
    } catch (e) {
      toast.error(e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
        <p className="text-slate-500 dark:text-slate-400">Loading access matrix...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            Access by Role
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Configure permissions for SUPER ADMIN, FINANCE, PROCUREMENT, HR, and AUDITOR roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold"
            onClick={() => navigate("/access-control/roles")}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Roles
          </Button>
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground"
            onClick={handleSave}
            disabled={saving || targetRoles.length === 0}
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
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
                  {targetRoles.map((role) => (
                    <TableHead
                      key={role.id}
                      className="text-center text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400"
                    >
                      {role.name.replace(/_/g, " ")}
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
                      <div>{access.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{access.category}</div>
                    </TableCell>
                    {targetRoles.map((role) => (
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

      {targetRoles.length === 0 && (
        <p className="text-sm text-amber-600 dark:text-amber-500">
          No roles found with codes: SUPER_ADMIN, FINANCE, PROCUREMENT, HR, AUDITOR. Create these roles first in Access Control → Roles.
        </p>
      )}
    </div>
  );
}
