import { useMemo, useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Save,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MAIN_NAV_MENU } from "@/lib/menuConfig";
import { useRoles, useUpdateRole, useDeleteRole } from "@/hooks/useRoles";
import { RoleFormDialog } from "./RoleFormDialog";
import type { Role } from "../types";
import { toast } from "sonner";

type AccessRow = {
  id: string;
  name: string;
  category: string;
};

/** Build permission rows from menu config (matches RoleFormDialog structure) */
function getAccessRows(): AccessRow[] {
  const rows: AccessRow[] = [];
  for (const item of MAIN_NAV_MENU) {
    if (item.children?.length) {
      rows.push({
        id: item.permissionKey,
        name: `${item.label} (parent)`,
        category: item.label,
      });
      for (const child of item.children) {
        if (child.children?.length) {
          // Submenu with nested children (e.g., Catatan Pengeluaran)
          rows.push({
            id: child.permissionKey,
            name: `${child.label} (parent)`,
            category: `${item.label} / ${child.label}`,
          });
          for (const grandChild of child.children) {
            rows.push({
              id: grandChild.permissionKey,
              name: grandChild.label,
              category: `${item.label} / ${child.label}`,
            });
          }
        } else {
          // Regular child (no nested children)
          rows.push({
            id: child.permissionKey,
            name: child.label,
            category: item.label,
          });
        }
      }
    } else {
      rows.push({
        id: item.permissionKey,
        name: item.label,
        category: "General",
      });
    }
  }
  return rows;
}

const ACCESS_ROWS = getAccessRows();

/** Compare two string arrays (order-independent) */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size !== setB.size) return false;
  for (const x of setA) if (!setB.has(x)) return false;
  return true;
}

export function RoleAccessMatrix() {
  const { data: roles = [], isLoading, error, refetch } = useRoles();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRoleState, setDeleteRoleState] = useState<{ id: string; name: string } | null>(null);
  /** Local permission keys per role (unsaved changes) */
  const [localPermissionKeys, setLocalPermissionKeys] = useState<Record<string, string[]>>({});

  // Sync local state with roles data from external API
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const initial: Record<string, string[]> = {};
    for (const r of roles) {
      initial[r.id] = [...r.permissionKeys];
    }
    setLocalPermissionKeys(initial);
  }, [roles]);

  const togglePermission = (roleId: string, permissionKey: string, checked: boolean) => {
    setLocalPermissionKeys((prev) => {
      const current = prev[roleId] ?? [];
      const newKeys = checked
        ? [...current, permissionKey]
        : current.filter((k) => k !== permissionKey);
      return { ...prev, [roleId]: newKeys };
    });
  };

  const hasChanges = useMemo(() => {
    for (const role of roles) {
      const local = localPermissionKeys[role.id];
      if (!local) continue;
      if (!arraysEqual(local, role.permissionKeys)) return true;
    }
    return false;
  }, [roles, localPermissionKeys]);

  const handleSaveChanges = async () => {
    const toUpdate = roles.filter((role) => {
      const local = localPermissionKeys[role.id];
      return local && !arraysEqual(local, role.permissionKeys);
    });
    try {
      for (const role of toUpdate) {
        await updateMutation.mutateAsync({
          id: role.id,
          input: { permissionKeys: localPermissionKeys[role.id] ?? role.permissionKeys },
        });
      }
      toast.success("Changes saved");
      refetch();
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to save changes";
      toast.error(msg);
    }
  };

  const handleDiscardChanges = () => {
    const initial: Record<string, string[]> = {};
    for (const r of roles) {
      initial[r.id] = [...r.permissionKeys];
    }
    setLocalPermissionKeys(initial);
    toast.info("Changes discarded");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRoleState) return;
    try {
      await deleteMutation.mutateAsync(deleteRoleState.id);
      setDeleteRoleState(null);
      toast.success("Role deleted");
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to delete role";
      toast.error(msg);
    }
  };

  const assignedCount = useMemo(
    () =>
      ACCESS_ROWS.reduce((total, access) => {
        return (
          total +
          roles.filter((role) => {
            const keys = localPermissionKeys[role.id] ?? role.permissionKeys;
            return keys.includes(access.id);
          }).length
        );
      }, 0),
    [roles, localPermissionKeys]
  );

  const handleAddSuccess = () => {
    setIsAddOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditRole(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading roles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            Master Role
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Rows are access permissions and columns are roles. Toggle each checkbox to set access,
            then click &quot;Save Changes&quot; to apply. Create, edit, or delete roles from the
            column headers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!error && (
            <Card className="border border-slate-200 dark:border-white/10 rounded-sm shadow-none bg-slate-50/60 dark:bg-card/70">
              <CardContent className="px-4 py-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Assigned Cells
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-foreground">
                  {assignedCount}
                </div>
              </CardContent>
            </Card>
          )}
          {hasChanges && (
            <>
              <Button
                variant="outline"
                className="h-9 gap-2 text-xs font-semibold"
                onClick={handleDiscardChanges}
              >
                <RotateCcw className="h-4 w-4" /> Discard
              </Button>
              <Button
                className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
                onClick={handleSaveChanges}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                Save Changes
              </Button>
            </>
          )}
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
            onClick={() => setIsAddOpen(true)}
            data-testid="add-role-btn"
          >
            <Plus className="h-4 w-4" /> Add Role
          </Button>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
          data-testid="roles-load-error"
        >
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {error instanceof Error ? error.message : String(error)}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

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
                  {roles.map((role) => (
                    <TableHead
                      key={role.id}
                      className="min-w-[160px] text-center text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditRole(role)}
                          className="truncate max-w-[90px] text-left font-bold text-slate-700 dark:text-slate-300 hover:text-primary hover:underline cursor-pointer transition-colors"
                          title={`Edit ${role.name}`}
                        >
                          {role.name}
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-slate-400 hover:text-primary hover:bg-primary/10"
                          onClick={() => setEditRole(role)}
                          title="Edit role"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            setDeleteRoleState({ id: role.id, name: role.name })
                          }
                          title="Delete role"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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

                    {roles.map((role) => {
                      const keys = localPermissionKeys[role.id] ?? role.permissionKeys;
                      const checked = keys.includes(access.id);
                      return (
                        <TableCell
                          key={`${access.id}-${role.id}`}
                          className="text-center"
                        >
                          <div className="flex justify-center">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                togglePermission(role.id, access.id, value === true)
                              }
                              aria-label={`${access.name} for ${role.name}`}
                            />
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {roles.length === 0 && !error && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              No roles yet. Click &quot;Add Role&quot; to create your first role.
            </div>
          )}
        </CardContent>
      </Card>

      <RoleFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={handleAddSuccess}
      />

      <RoleFormDialog
        open={!!editRole}
        onOpenChange={(open) => !open && setEditRole(null)}
        role={editRole ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <AlertDialog
        open={!!deleteRoleState}
        onOpenChange={(open) => !open && setDeleteRoleState(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteRoleState?.name}</strong>? Users assigned to this
              role will need to be reassigned. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
