import { useNavigate } from "react-router-dom";
import { Briefcase, Plus } from "lucide-react";
import { PositionTable } from "./components/PositionTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePositions } from "@/hooks/usePositions";

export default function PositionsPage() {
  const navigate = useNavigate();
  const { data: positions = [], refetch } = usePositions();

  const activeCount = positions.filter((p) => p.isActive).length;

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto bg-[#0A0A0B] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F0F0F0] mb-2">
            Positions
          </h1>
          <p className="text-[#6B6B75] text-sm font-medium">
            Define and manage the organizational structure and job roles.
          </p>
        </div>
        <Button
          className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
          onClick={() => navigate("/hr/positions/create")}
        >
          <Plus className="h-5 w-5 mr-2" /> Add Position
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PositionStatCard
          title="Total Positions"
          value={String(positions.length)}
          description="All job positions"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <PositionStatCard
          title="Active"
          value={String(activeCount)}
          description="Currently active positions"
          icon={<Briefcase className="h-4 w-4" />}
          color="#10b981"
        />
      </div>

      <PositionTable
        positions={positions}
        onRefresh={() => refetch()}
        onAddClick={() => navigate("/hr/positions/create")}
      />
    </div>
  );
}

function PositionStatCard({
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
