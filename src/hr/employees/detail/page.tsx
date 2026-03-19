import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Search,
    Mail,
    Phone,
    CreditCard,
    Pencil,
    GraduationCap,
    Baby,
    Heart,
    Calendar,
    Building
} from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- Helper Components ---

function MetricRow({ label, value, icon: Icon, className }: { label: string; value: React.ReactNode; icon?: React.ComponentType<{ className?: string }>; className?: string }) {
    return (
        <div className={cn("flex items-center justify-between py-3 border-b border-[#1E1E22] last:border-0", className)}>
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-3.5 w-3.5 text-[#6B6B75]" />}
                <span className="text-[#6B6B75] text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-[#F0F0F0] text-sm font-bold">{value}</span>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <h2 className="text-[#6B6B75] text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">{title}</h2>
            <div className="h-[1px] w-full bg-[#1E1E22]" />
        </div>
    );
}

export default function EmployeeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: employees = [] } = useEmployees();

    const employee = employees.find(e => e.id === id);

    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#6B6B75]">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p>Employee not found</p>
                <Button variant="link" onClick={() => navigate("/hr/employees")} className="text-[#F5A623]">
                    Back to list
                </Button>
            </div>
        );
    }

    const isResigned = !!employee.tanggalKeluar;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#1E1E22]">
                    <div className="space-y-4">
                        <Link
                            to="/hr/employees"
                            className="group flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Employee Management
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-[#111113] border border-[#1E1E22] flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#F5A623]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {employee.profilePictureUrl ? (
                                    <img src={employee.profilePictureUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-8 w-8 text-[#F5A623]" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold tracking-tight">{employee.namaKaryawan}</h1>
                                    <Badge className={cn(
                                        "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none",
                                        isResigned
                                            ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                                            : "bg-[#22C55E]/10 text-[#22C55E]"
                                    )}>
                                        {isResigned ? "Resigned" : "Active"}
                                    </Badge>
                                </div>
                                <p className="text-[#6B6B75] flex items-center gap-2 text-sm">
                                    {employee.nik} <span className="text-[#1E1E22]">|</span> {employee.namaJabatan}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate(`/hr/employees/${id}/edit`)}
                            className="bg-[#111113] border border-[#1E1E22] text-[#F0F0F0] hover:bg-[#1E1E22] hover:border-[#F5A623]/50 transition-all font-bold group"
                        >
                            <Pencil className="h-4 w-4 mr-2 text-[#6B6B75] group-hover:text-[#F5A623]" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Dynamic Tabs Section */}
                <Tabs defaultValue="overview" className="space-y-8">
                    <div className="sticky top-0 z-10 bg-[#0A0A0B]/80 backdrop-blur-md py-2 border-b border-[#1E1E22]">
                        <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
                            {[
                                { value: "overview", label: "Overview", icon: User },
                                { value: "personal", label: "Personal Details", icon: Heart },
                                { value: "identity", label: "Identity & Tax", icon: CreditCard },
                                { value: "employment", label: "Employment & Bank", icon: Building },
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-[#F5A623] data-[state=active]:shadow-none px-0 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent data-[state=active]:border-[#F5A623] rounded-none flex items-center gap-2 transition-all hover:text-[#F0F0F0]"
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-[#111113] border-[#1E1E22] p-6 hover:border-[#F5A623]/20 transition-all group">
                                <SectionHeader title="Basic Information" />
                                <div className="space-y-1">
                                    <MetricRow label="Joined Date (TMK)" value={employee.tmk} icon={Calendar} />
                                    <MetricRow label="Email Address" value={employee.email} icon={Mail} />
                                    <MetricRow label="Phone Number" value={employee.noHp} icon={Phone} />
                                    <MetricRow label="Last Education" value={employee.pendidikan} icon={GraduationCap} />
                                </div>
                            </Card>

                            <Card className="bg-[#111113] border-[#1E1E22] p-6 hover:border-[#F5A623]/20 transition-all">
                                <SectionHeader title="Personal Status" />
                                <div className="space-y-1">
                                    <MetricRow label="Sex" value={employee.jenisKelamin} />
                                    <MetricRow label="Marital Status" value={employee.statusPerkawinan} />
                                    <MetricRow label="Children" value={employee.jumlahAnak} icon={Baby} />
                                    <MetricRow label="Birth Place/Date" value={`${employee.tempatLahir}, ${employee.tanggalLahir}`} />
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Personal Details Tab */}
                    <TabsContent value="personal" className="mt-0 animate-in fade-in duration-500">
                        <Card className="bg-[#111113] border-[#1E1E22] p-10 max-w-4xl mx-auto">
                            <SectionHeader title="Residential Information" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#6B6B75] uppercase tracking-widest font-bold">Residency Address (KTP)</label>
                                    <p className="text-[#F0F0F0] leading-relaxed italic text-lg">{employee.alamatKtp}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#1E1E22]">
                                    <MetricRow label="City" value={employee.kotaKtp} />
                                    <MetricRow label="Province" value={employee.provinsiKtp} />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Identity & Tax Tab */}
                    <TabsContent value="identity" className="mt-0 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-[#111113] border-[#1E1E22] p-6">
                                <SectionHeader title="Identification" />
                                <div className="space-y-1">
                                    <MetricRow label="ID Card Number (KTP)" value={employee.noKtp} />
                                    <MetricRow label="Family Card Number (KK)" value={employee.noKk} />
                                </div>
                            </Card>

                            <Card className="bg-[#111113] border-[#1E1E22] p-6">
                                <SectionHeader title="Taxation" />
                                <div className="space-y-1">
                                    <MetricRow label="NPWP Number" value={employee.npwp} />
                                    <MetricRow label="Tax Status" value={employee.statusPajak} />
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Employment & Bank Tab */}
                    <TabsContent value="employment" className="mt-0 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-[#111113] border-[#1E1E22] p-6">
                                <SectionHeader title="Banking Details" />
                                <div className="space-y-1">
                                    <MetricRow label="Bank Name" value={employee.namaBank} />
                                    <MetricRow label="Account Number" value={employee.noRek} />
                                </div>
                            </Card>

                            <Card className="bg-[#111113] border-[#1E1E22] p-6">
                                <SectionHeader title="Health & Insurance" />
                                <div className="space-y-1">
                                    <MetricRow label="JKN/KIS Number" value={employee.noJknKis} />
                                    <MetricRow label="JMS Number" value={employee.noJms} />
                                    {isResigned && (
                                        <MetricRow label="Resignation Date" value={employee.tanggalKeluar} className="text-[#F59E0B]" />
                                    )}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
