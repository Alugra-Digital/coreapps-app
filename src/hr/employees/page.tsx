import { UserPlus, Users, UserCheck, UserX, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { EmployeeTable } from "./components/EmployeeTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEmployees } from "@/api/employees";
import type { Employee } from "./types";

export default function HREmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setError(null);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load employees";
      setError(message);
      setEmployees([]);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const activeCount = employees.filter((e) => !e.tanggalKeluar).length;
  const resignedCount = employees.filter((e) => e.tanggalKeluar).length;

  return (
    <div
      className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors"
      data-testid="employees-page"
    >
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1
            className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground"
            data-testid="employees-heading"
          >
            Employee Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage employee records, personal data, and employment information.
          </p>
        </div>
        <Button
          className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
          onClick={() => setIsAddOpen(true)}
          data-testid="add-employee-btn"
        >
          <UserPlus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      {error && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
          data-testid="employees-load-error"
        >
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadEmployees}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try again
          </Button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EmpStatCard
          title="Total Employees"
          value={String(employees.length)}
          description="All registered employees"
          icon={<Users className="h-4 w-4" />}
          color="#3b82f6"
        />
        <EmpStatCard
          title="Active"
          value={String(activeCount)}
          description="Currently employed"
          icon={<UserCheck className="h-4 w-4" />}
          color="#10b981"
        />
        <EmpStatCard
          title="Resigned"
          value={String(resignedCount)}
          description="Left the company"
          icon={<UserX className="h-4 w-4" />}
          color="#f59e0b"
        />
      </div>

      {/* Main Content */}
      <EmployeeTable
        employees={employees}
        onRefresh={loadEmployees}
        onAddClick={() => setIsAddOpen(true)}
        isAddOpen={isAddOpen}
        onAddOpenChange={setIsAddOpen}
      />
    </div>
  );
}

function EmpStatCard({
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
