import { useNavigate } from "react-router-dom";
import { UserPlus, Users, UserCheck, UserX, AlertCircle, RefreshCw } from "lucide-react";
import { EmployeeTable } from "./components/EmployeeTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEmployees } from "@/hooks/useEmployees";

export default function HREmployeePage() {
  const navigate = useNavigate();
  const { data: employees = [], error, refetch } = useEmployees();

  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: string }).message)
      : null;

  const activeCount = employees.filter((e) => !e.tanggalKeluar).length;
  const resignedCount = employees.filter((e) => e.tanggalKeluar).length;

  return (
    <div
      className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto bg-[#0A0A0B] min-h-screen"
      data-testid="employees-page"
    >
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1
            className="text-4xl font-extrabold tracking-tight text-[#F0F0F0] mb-2"
            data-testid="employees-heading"
          >
            Employee Management
          </h1>
          <p className="text-[#6B6B75] text-sm font-medium">
            Manage your organization's human capital with precision.
          </p>
        </div>
        <Button
          className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
          onClick={() => navigate("/hr/employees/create")}
          data-testid="add-employee-btn"
        >
          <UserPlus className="h-5 w-5 mr-2" /> Add Employee
        </Button>
      </div>

      {errorMessage && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
          data-testid="employees-load-error"
        >
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
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
        onRefresh={() => refetch()}
        onAddClick={() => navigate("/hr/employees/create")}
      />
    </div>
  );
}

function EmpStatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-[#111113] border-[#1E1E22] p-6 rounded-2xl group hover:border-[#F5A623]/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em] leading-none">
            {title}
          </span>
          <div className="text-3xl font-bold text-[#F0F0F0] tracking-tight">
            {value}
          </div>
        </div>
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#0A0A0B] border border-[#1E1E22] text-[#F5A623] shadow-inner"
        >
          {icon}
        </div>
      </div>
      <div className="text-[10px] text-[#6B6B75] font-medium tracking-wide">
        {description}
      </div>
    </Card>
  );
}
