import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { RoleTable } from "./components/RoleTable";
import { Button } from "@/components/ui/button";
import { getRoles } from "@/api/roles";
import type { Role } from "./types";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Roles
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage roles and assign menu permissions for RBAC.
          </p>
        </div>
        <Button
          className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Role
        </Button>
      </div>

      <RoleTable
        roles={roles}
        onRefresh={loadRoles}
        onAddClick={() => setIsAddOpen(true)}
        isAddOpen={isAddOpen}
        onAddOpenChange={setIsAddOpen}
      />
    </div>
  );
}
