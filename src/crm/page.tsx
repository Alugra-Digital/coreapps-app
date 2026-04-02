import { useState } from "react";
import { Users, TrendingUp, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useOpportunities, useCreateOpportunity, useDeleteOpportunity } from "@/hooks/useCrm";
import type { Lead, Opportunity, CreateLeadInput, CreateOpportunityInput } from "@/api/crm";
import { toast } from "sonner";

const LEAD_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NEW: { label: "New", color: "#3b82f6" },
  CONTACTED: { label: "Contacted", color: "#F5A623" },
  QUALIFIED: { label: "Qualified", color: "#22C55E" },
  LOST: { label: "Lost", color: "#EF4444" },
  CONVERTED: { label: "Converted", color: "#8b5cf6" },
};

const OPP_STAGE_CONFIG: Record<string, { label: string; color: string }> = {
  PROSPECTING: { label: "Prospecting", color: "#6B6B75" },
  QUALIFICATION: { label: "Qualification", color: "#3b82f6" },
  PROPOSAL: { label: "Proposal", color: "#F5A623" },
  NEGOTIATION: { label: "Negotiation", color: "#f97316" },
  CLOSED_WON: { label: "Closed Won", color: "#22C55E" },
  CLOSED_LOST: { label: "Closed Lost", color: "#EF4444" },
};

function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export default function CRMPage() {
  const { data: leads = [], isLoading: leadsLoading, refetch: refetchLeads } = useLeads();
  const { data: opportunities = [], isLoading: oppsLoading, refetch: refetchOpps } = useOpportunities();

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const createOpportunity = useCreateOpportunity();
  const deleteOpportunity = useDeleteOpportunity();

  const [leadDialog, setLeadDialog] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState<CreateLeadInput>({
    name: "", company: "", email: "", phone: "", status: "NEW", source: "", notes: "",
  });

  const [oppDialog, setOppDialog] = useState(false);
  const [oppForm, setOppForm] = useState<CreateOpportunityInput>({
    name: "", amount: 0, probability: 50, stage: "PROSPECTING", notes: "",
  });

  const [deleteLeadId, setDeleteLeadId] = useState<number | null>(null);
  const [deleteOppId, setDeleteOppId] = useState<number | null>(null);

  const openCreateLead = () => {
    setEditLead(null);
    setLeadForm({ name: "", company: "", email: "", phone: "", status: "NEW", source: "", notes: "" });
    setLeadDialog(true);
  };

  const openEditLead = (lead: Lead) => {
    setEditLead(lead);
    setLeadForm({ name: lead.name, company: lead.company ?? "", email: lead.email ?? "", phone: lead.phone ?? "", status: lead.status, source: lead.source ?? "", notes: lead.notes ?? "" });
    setLeadDialog(true);
  };

  const handleSaveLead = () => {
    if (!leadForm.name) return toast.error("Name is required");
    if (editLead) {
      updateLead.mutate(
        { id: editLead.id, data: leadForm },
        {
          onSuccess: () => { toast.success("Lead updated"); setLeadDialog(false); refetchLeads(); },
          onError: (err: Error) => toast.error(err.message),
        }
      );
    } else {
      createLead.mutate(leadForm, {
        onSuccess: () => { toast.success("Lead created"); setLeadDialog(false); refetchLeads(); },
        onError: (err: Error) => toast.error(err.message),
      });
    }
  };

  const handleDeleteLead = () => {
    if (!deleteLeadId) return;
    deleteLead.mutate(deleteLeadId, {
      onSuccess: () => { toast.success("Lead deleted"); setDeleteLeadId(null); refetchLeads(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleSaveOpp = () => {
    if (!oppForm.name) return toast.error("Name is required");
    if (!oppForm.amount || oppForm.amount <= 0) return toast.error("Amount must be greater than 0");
    createOpportunity.mutate(oppForm, {
      onSuccess: () => { toast.success("Opportunity created"); setOppDialog(false); refetchOpps(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleDeleteOpp = () => {
    if (!deleteOppId) return;
    deleteOpportunity.mutate(deleteOppId, {
      onSuccess: () => { toast.success("Opportunity deleted"); setDeleteOppId(null); refetchOpps(); },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const totalOpportunityValue = opportunities.reduce((sum, o) => sum + Number(o.amount), 0);
  const wonCount = opportunities.filter((o) => o.stage === "CLOSED_WON").length;
  const newLeadsCount = leads.filter((l) => l.status === "NEW").length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] p-4 sm:p-6 lg:p-10">
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F0F0F0]">
              CRM
            </h1>
            <p className="text-[#6B6B75] text-sm font-medium">
              Manage leads and sales opportunities.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Leads", value: String(leads.length), color: "#3b82f6" },
            { label: "New Leads", value: String(newLeadsCount), color: "#F5A623" },
            { label: "Pipeline Value", value: formatCurrency(totalOpportunityValue), color: "#22C55E" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[#111113] border-[#1E1E22] p-6 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6B75]">{stat.label}</p>
              <p className="text-2xl font-extrabold mt-3 truncate" style={{ color: stat.color }}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads">
          <TabsList className="bg-[#111113] border border-[#1E1E22] p-1 rounded-xl">
            <TabsTrigger value="leads" className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-black font-bold rounded-lg px-6">
              <Users className="h-4 w-4 mr-2" />Leads
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-black font-bold rounded-lg px-6">
              <TrendingUp className="h-4 w-4 mr-2" />Opportunities
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-[#F5A623]" /> Leads
              </h2>
              <Button
                onClick={openCreateLead}
                className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold min-h-[40px] px-6 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Lead
              </Button>
            </div>

            {leadsLoading ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
            ) : leads.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                No leads found.
              </div>
            ) : (
              <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                  <TableHeader className="bg-[#0A0A0B]">
                    <TableRow className="hover:bg-transparent border-[#1E1E22]">
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Name</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Company</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Email</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Source</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Status</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => {
                      const cfg = LEAD_STATUS_CONFIG[lead.status] ?? { label: lead.status, color: "#6B6B75" };
                      return (
                        <TableRow key={lead.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                          <TableCell className="py-4 text-sm font-bold text-[#F0F0F0]">{lead.name}</TableCell>
                          <TableCell className="py-4 text-sm text-[#6B6B75]">{lead.company ?? "—"}</TableCell>
                          <TableCell className="py-4 text-sm text-[#6B6B75]">{lead.email ?? "—"}</TableCell>
                          <TableCell className="py-4 text-sm text-[#6B6B75]">{lead.source ?? "—"}</TableCell>
                          <TableCell className="py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-[#6B6B75] hover:text-[#F0F0F0] hover:bg-white/5"
                                onClick={() => openEditLead(lead)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-[#6B6B75] hover:text-[#EF4444] hover:bg-red-500/10"
                                onClick={() => setDeleteLeadId(lead.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E1E22] pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#F5A623]" /> Opportunities
              </h2>
              <Button
                onClick={() => {
                  setOppForm({ name: "", amount: 0, probability: 50, stage: "PROSPECTING", notes: "" });
                  setOppDialog(true);
                }}
                className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold min-h-[40px] px-6 rounded-xl shadow-lg shadow-[#F5A623]/10 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Opportunity
              </Button>
            </div>

            {oppsLoading ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75]">Loading...</div>
            ) : opportunities.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#6B6B75] bg-[#111113] border border-[#1E1E22] rounded-2xl">
                No opportunities found.
              </div>
            ) : (
              <Card className="bg-[#111113] border-[#1E1E22] rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                  <TableHeader className="bg-[#0A0A0B]">
                    <TableRow className="hover:bg-transparent border-[#1E1E22]">
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Name</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Amount</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Probability</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Stage</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4">Close Date</TableHead>
                      <TableHead className="text-[#6B6B75] text-[10px] font-bold uppercase tracking-widest py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => {
                      const cfg = OPP_STAGE_CONFIG[opp.stage ?? ""] ?? { label: opp.stage ?? "—", color: "#6B6B75" };
                      return (
                        <TableRow key={opp.id} className="hover:bg-white/[0.02] border-[#1E1E22]">
                          <TableCell className="py-4 text-sm font-bold text-[#F0F0F0]">{opp.name}</TableCell>
                          <TableCell className="py-4 text-sm font-bold text-[#F5A623] text-right">{formatCurrency(opp.amount)}</TableCell>
                          <TableCell className="py-4 text-sm text-[#F0F0F0] text-right">{opp.probability}%</TableCell>
                          <TableCell className="py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-sm text-[#6B6B75]">
                            {opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toLocaleDateString("id-ID") : "—"}
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-[#6B6B75] hover:text-[#EF4444] hover:bg-red-500/10"
                              onClick={() => setDeleteOppId(opp.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Dialog */}
      <Dialog open={leadDialog} onOpenChange={setLeadDialog}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F0F0F0]">{editLead ? "Edit Lead" : "New Lead"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { label: "Name *", key: "name", placeholder: "Full name" },
              { label: "Company", key: "company", placeholder: "Company name" },
              { label: "Email", key: "email", placeholder: "email@example.com" },
              { label: "Phone", key: "phone", placeholder: "+62..." },
              { label: "Source", key: "source", placeholder: "Website, referral, etc." },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">{label}</label>
                <input
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={(leadForm as Record<string, string>)[key] ?? ""}
                  onChange={(e) => setLeadForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Status</label>
              <select
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={leadForm.status ?? "NEW"}
                onChange={(e) => setLeadForm((f) => ({ ...f, status: e.target.value }))}
              >
                {Object.entries(LEAD_STATUS_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Notes</label>
              <textarea
                rows={2}
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623] resize-none"
                value={leadForm.notes ?? ""}
                onChange={(e) => setLeadForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLeadDialog(false)} className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]">
              Cancel
            </Button>
            <Button
              onClick={handleSaveLead}
              disabled={createLead.isPending || updateLead.isPending}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
            >
              {editLead ? "Update Lead" : "Create Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Opportunity Dialog */}
      <Dialog open={oppDialog} onOpenChange={setOppDialog}>
        <DialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F0F0F0]">New Opportunity</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Name *</label>
              <input
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={oppForm.name}
                onChange={(e) => setOppForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Opportunity name"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Amount (IDR)</label>
                <input
                  type="number"
                  min={0}
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={oppForm.amount || ""}
                  onChange={(e) => setOppForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                  placeholder="e.g. 50000000"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Probability (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                  value={oppForm.probability}
                  onChange={(e) => setOppForm((f) => ({ ...f, probability: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Stage</label>
              <select
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={oppForm.stage ?? "PROSPECTING"}
                onChange={(e) => setOppForm((f) => ({ ...f, stage: e.target.value }))}
              >
                {Object.entries(OPP_STAGE_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Expected Close Date</label>
              <input
                type="date"
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623]"
                value={oppForm.expectedCloseDate ?? ""}
                onChange={(e) => setOppForm((f) => ({ ...f, expectedCloseDate: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6B75]">Notes</label>
              <textarea
                rows={2}
                className="bg-[#0A0A0B] border border-[#1E1E22] text-[#F0F0F0] text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#F5A623] resize-none"
                value={oppForm.notes ?? ""}
                onChange={(e) => setOppForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOppDialog(false)} className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]">
              Cancel
            </Button>
            <Button
              onClick={handleSaveOpp}
              disabled={createOpportunity.isPending}
              className="bg-[#F5A623] hover:bg-[#D98E1C] text-black font-bold"
            >
              {createOpportunity.isPending ? "Creating..." : "Create Opportunity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Lead Confirm */}
      <AlertDialog open={deleteLeadId !== null} onOpenChange={(o) => !o && setDeleteLeadId(null)}>
        <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B6B75]">
              Are you sure you want to delete this lead? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLead} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Opportunity Confirm */}
      <AlertDialog open={deleteOppId !== null} onOpenChange={(o) => !o && setDeleteOppId(null)}>
        <AlertDialogContent className="bg-[#111113] border-[#1E1E22] text-[#F0F0F0]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B6B75]">
              Are you sure you want to delete this opportunity?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1E1E22] bg-transparent text-[#F0F0F0] hover:bg-[#1E1E22]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOpp} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
