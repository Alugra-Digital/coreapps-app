import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    Building2,
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    ShieldCheck,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClients } from "@/hooks/useClients";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: clients = [] } = useClients();
    const client = clients.find(c => c.id === id);

    if (!client) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-[#F0F0F0]">Client not found</h2>
                    <Button onClick={() => navigate("/finance/clients")} variant="outline">
                        Back to Clients
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <Link
                            to="/finance/clients"
                            className="flex items-center gap-2 text-[#6B6B75] hover:text-[#F5A623] transition-colors text-sm mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Clients
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-extrabold tracking-tight">{client.name}</h1>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[10px] font-bold px-3 py-0.5 rounded-full border-none capitalize",
                                    client.isActive
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-[#6B6B75]/10 text-[#6B6B75]"
                                )}
                            >
                                {client.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="text-[#6B6B75] text-sm font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> {client.companyName}
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate(`/finance/clients/${id}/edit`)}
                        className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold px-8 h-12 shadow-lg shadow-[#F5A623]/10"
                    >
                        <Pencil className="h-4 w-4 mr-2" /> Edit Client
                    </Button>
                </div>

                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-[#0A0A0B] border-b border-[#1E1E22] w-full justify-start rounded-none h-auto p-0 gap-8">
                        <TabsTrigger
                            value="overview"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#F5A623] data-[state=active]:text-[#F5A623] rounded-none px-0 py-4 text-sm font-bold uppercase tracking-widest transition-all"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="documents"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#F5A623] data-[state=active]:text-[#F5A623] rounded-none px-0 py-4 text-sm font-bold uppercase tracking-widest transition-all"
                        >
                            Financial & Legal
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 focus-visible:outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Profile Card */}
                            <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8 h-full">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Client Profile</h3>
                                        <p className="text-lg font-bold text-[#F0F0F0]">Identity Details</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">Email Address</p>
                                        <p className="text-sm text-[#F0F0F0] font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-[#F5A623]" /> {client.email || "Not provided"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">Phone Number</p>
                                        <p className="text-sm text-[#F0F0F0] font-medium flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-[#F5A623]" /> {client.phone || "Not provided"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">Website / Office</p>
                                        <p className="text-sm text-[#F0F0F0] font-medium flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-[#F5A623]" /> {client.companyName}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Actionable Info Card */}
                            <Card className="md:col-span-2 bg-[#111113] border-[#1E1E22] p-8 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Location & Accessibility</h3>
                                            <p className="text-lg font-bold text-[#F0F0F0]">Address Information</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-4">
                                        <div className="p-6 bg-[#0A0A0B] border border-[#1E1E22] rounded-2xl space-y-2">
                                            <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">Registered Address</p>
                                            <p className="text-sm text-[#F0F0F0] leading-relaxed font-medium">
                                                {client.address || "No address recorded."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-2xl space-y-4">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="h-5 w-5 text-[#F5A623]" />
                                                <h4 className="text-sm font-bold text-[#F0F0F0]">PIC Details</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center border-b border-[#1E1E22] pb-2">
                                                    <span className="text-[10px] text-[#6B6B75] uppercase font-bold tracking-widest">Name</span>
                                                    <span className="text-xs font-bold text-[#F0F0F0]">{client.pic?.name || "-"}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-[#1E1E22] pb-2">
                                                    <span className="text-[10px] text-[#6B6B75] uppercase font-bold tracking-widest">Position</span>
                                                    <span className="text-xs font-bold text-[#F0F0F0]">{client.pic?.position || "-"}</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-1">
                                                    <span className="text-[10px] text-[#6B6B75] uppercase font-bold tracking-widest">Contact</span>
                                                    <span className="text-xs font-bold text-[#F0F0F0]">{client.pic?.contact || "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="documents" className="focus-visible:outline-none">
                        <Card className="bg-[#111113] border-[#1E1E22] p-8 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B6B75]">Legal & Compliance</h3>
                                    <p className="text-lg font-bold text-[#F0F0F0]">Financial Identifiers</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-[#0A0A0B] border border-[#1E1E22] rounded-2xl space-y-2">
                                    <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">NPWP (Tax ID)</p>
                                    <p className="text-xl font-bold font-mono text-[#F5A623]">
                                        {client.npwp || "Not Recorded"}
                                    </p>
                                </div>
                                <div className="p-6 bg-[#0A0A0B] border border-[#1E1E22] rounded-2xl space-y-2">
                                    <p className="text-[10px] font-bold text-[#6B6B75] uppercase tracking-[0.2em]">System Identifier</p>
                                    <p className="text-xs font-bold font-mono text-[#6B6B75]">
                                        {client.id}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
