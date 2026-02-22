import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BellRing,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  UserRoundPen,
} from "lucide-react";

export default function ModalSamplesPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [workspaceSection, setWorkspaceSection] = useState<
    "summary" | "budget" | "timeline" | "notes"
  >("summary");
  const wizardSteps = ["Company", "Owner", "Review"];
  const workspaceSections = [
    { key: "summary", label: "Summary" },
    { key: "budget", label: "Budget" },
    { key: "timeline", label: "Timeline" },
    { key: "notes", label: "Notes" },
  ] as const;
  const workspaceCardClass =
    "rounded-sm border border-slate-200/80 dark:border-white/10 p-4 bg-linear-to-b from-white to-slate-50/60 dark:from-background dark:to-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow";

  const handleWizardOpenChange = (open: boolean) => {
    setWizardOpen(open);
    if (!open) setWizardStep(1);
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
          Modal Showcase
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Sample modal styles with project-consistent spacing, colors, and typography.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Clean Form Modal</CardTitle>
            <CardDescription className="text-xs">
              Neutral style for editing simple profile data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs font-semibold">
                  <UserRoundPen className="h-4 w-4" />
                  Open Profile Form
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-sm">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                  <DialogTitle className="text-base">Edit Profile</DialogTitle>
                  <DialogDescription className="text-xs">
                    Update basic identity information for this account.
                  </DialogDescription>
                </DialogHeader>
                <div className="px-6 py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="text-xs">
                      Full Name
                    </Label>
                    <Input id="full-name" defaultValue="Mikhael Alugra" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs">
                      Email
                    </Label>
                    <Input id="email" defaultValue="mikhael@alugra.id" className="h-9 text-sm" />
                  </div>
                </div>
                <DialogFooter className="px-6 py-4 border-t">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Gradient Highlight</CardTitle>
            <CardDescription className="text-xs">
              Promotional modal with colorful accent and CTA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full h-9 text-xs font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Launch Campaign Modal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-0 rounded-sm overflow-hidden">
                <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                  <Badge className="bg-white/20 text-white border-white/20 text-[10px] uppercase tracking-wider">
                    New feature
                  </Badge>
                  <DialogHeader className="mt-3 text-left">
                    <DialogTitle className="text-xl font-bold text-white">
                      Smart Campaign Booster
                    </DialogTitle>
                    <DialogDescription className="text-white/85 text-sm">
                      Use AI-assisted templates to publish campaign content 3x faster.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="px-6 py-5 space-y-4 bg-white dark:bg-background">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    This premium workflow includes adaptive copy suggestions, audience
                    segmentation, and scheduled auto-optimization.
                  </p>
                  <DialogFooter>
                    <Button variant="outline">Later</Button>
                    <Button>Start Free Trial</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danger Confirmation</CardTitle>
            <CardDescription className="text-xs">
              Critical action with strong destructive emphasis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full h-9 text-xs font-semibold">
                  <Trash2 className="h-4 w-4" />
                  Delete Permanent Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-sm border-rose-200 dark:border-rose-400/30">
                <AlertDialogHeader>
                  <div className="flex items-center gap-2 text-rose-600">
                    <CircleAlert className="h-5 w-5" />
                    <AlertDialogTitle className="text-rose-700 dark:text-rose-300">
                      Permanent Delete
                    </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-sm">
                    This action removes all records and cannot be undone. Continue only if
                    you have a backup export.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white">
                    Delete Now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Announcement Modal</CardTitle>
            <CardDescription className="text-xs">
              Information-focused modal with soft success styling.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs font-semibold">
                  <BellRing className="h-4 w-4" />
                  Open Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[460px] rounded-sm p-0 overflow-hidden">
                <div className="px-6 pt-6 pb-4 bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-100 dark:border-emerald-500/20">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-emerald-700 dark:text-emerald-300 text-base">
                      Workflow Published
                    </DialogTitle>
                    <DialogDescription className="text-emerald-700/80 dark:text-emerald-200/80 text-sm">
                      All approvers have been notified and audit logs are updated.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Next step: track approval progress from the activity timeline and
                    export status report if needed.
                  </p>
                  <DialogFooter>
                    <Button variant="outline">Close</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      View Timeline
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Scrollable Document</CardTitle>
            <CardDescription className="text-xs">
              Long-content modal for policy or terms review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs font-semibold">
                  <FileText className="h-4 w-4" />
                  Open Terms Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[620px] max-h-[90vh] rounded-sm p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle className="text-base">Terms Update v2.5</DialogTitle>
                  <DialogDescription className="text-xs">
                    Review the latest updates before continuing.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[360px] px-6 py-4">
                  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 pr-4">
                    <p>
                      We updated data retention limits and expanded approval workflow
                      requirements for cross-department transactions.
                    </p>
                    <p>
                      New policy introduces stricter control over export actions and
                      mandatory activity tracking for any critical updates.
                    </p>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <p key={index}>
                        Section {index + 1}: Additional legal and operational text to
                        demonstrate long content behavior in a modal body.
                      </p>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter className="px-6 py-4 border-t">
                  <Button variant="outline">Decline</Button>
                  <Button>Accept & Continue</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Side Sheet Settings</CardTitle>
            <CardDescription className="text-xs">
              Right-side panel style for quick configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs font-semibold">
                  <Settings className="h-4 w-4" />
                  Open Settings Sheet
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md p-0">
                <SheetHeader className="px-6 py-5 border-b">
                  <SheetTitle className="text-base">Automation Settings</SheetTitle>
                  <SheetDescription className="text-xs">
                    Configure trigger behavior and delivery preferences.
                  </SheetDescription>
                </SheetHeader>
                <div className="px-6 py-5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url" className="text-xs">
                      Webhook URL
                    </Label>
                    <Input id="webhook-url" placeholder="https://api.example.com/hook" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channel" className="text-xs">
                      Notification Channel
                    </Label>
                    <Input id="channel" placeholder="finance-alerts" />
                  </div>
                  <div className="rounded-sm border bg-slate-50 dark:bg-white/5 p-3 text-xs text-slate-500 dark:text-slate-400">
                    Tip: use a dedicated channel for high-priority finance events.
                  </div>
                </div>
                <SheetFooter className="px-6 py-4 border-t">
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button>
                      <Plus className="h-4 w-4" />
                      Save Config
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Wizard Style Modal</CardTitle>
            <CardDescription className="text-xs">
              Multi-step modal flow with progress state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={wizardOpen} onOpenChange={handleWizardOpenChange}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Open Wizard Modal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[560px] p-0 rounded-sm overflow-hidden">
                <DialogHeader className="px-6 py-5 border-b">
                  <DialogTitle className="text-base">Create Workspace Wizard</DialogTitle>
                  <DialogDescription className="text-xs">
                    Complete each step to prepare your new workspace.
                  </DialogDescription>
                </DialogHeader>

                <div className="px-6 pt-4 pb-2">
                  <div className="grid grid-cols-3 gap-2">
                    {wizardSteps.map((stepLabel, index) => {
                      const stepNumber = index + 1;
                      const isDone = wizardStep > stepNumber;
                      const isActive = wizardStep === stepNumber;
                      return (
                        <div
                          key={stepLabel}
                          className="rounded-sm border px-3 py-2 bg-white dark:bg-background"
                        >
                          <div className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <span
                                className={`h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                                }`}
                              >
                                {stepNumber}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {stepLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {wizardStep === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="wizard-company-name">
                          Company Name
                        </Label>
                        <Input id="wizard-company-name" placeholder="PT Alugra Sistem" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="wizard-industry">
                          Industry
                        </Label>
                        <Input id="wizard-industry" placeholder="Enterprise Software" />
                      </div>
                    </>
                  )}

                  {wizardStep === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="wizard-owner-name">
                          Owner Name
                        </Label>
                        <Input id="wizard-owner-name" placeholder="Mikhael Alugra" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="wizard-owner-email">
                          Owner Email
                        </Label>
                        <Input id="wizard-owner-email" placeholder="owner@alugra.id" />
                      </div>
                    </>
                  )}

                  {wizardStep === 3 && (
                    <div className="rounded-sm border bg-slate-50 dark:bg-white/5 p-4 space-y-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ready to launch workspace
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        This will provision the default finance, inventory, and HR modules
                        for your organization.
                      </p>
                    </div>
                  )}
                </div>

                <DialogFooter className="px-6 py-4 border-t">
                  <Button
                    variant="outline"
                    disabled={wizardStep === 1}
                    onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  {wizardStep < 3 ? (
                    <Button onClick={() => setWizardStep((prev) => Math.min(3, prev + 1))}>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => handleWizardOpenChange(false)}>Finish Setup</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm md:col-span-2 xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Large Multi-Form Modal</CardTitle>
            <CardDescription className="text-xs">
              Big form modal with many grouped fields and scrolling body.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto h-9 text-xs font-semibold">
                  <Plus className="h-4 w-4" />
                  Open Full Registration Form
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[860px] max-h-[92vh] p-0 rounded-sm overflow-hidden">
                <DialogHeader className="px-6 py-5 border-b">
                  <DialogTitle className="text-base">Vendor Onboarding Form</DialogTitle>
                  <DialogDescription className="text-xs">
                    Fill all sections to submit complete vendor registration data.
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[62vh]">
                  <div className="px-6 py-5 space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-name">
                            Vendor Name
                          </Label>
                          <Input id="vendor-name" placeholder="PT Cipta Solusi" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-company">
                            Company Legal Name
                          </Label>
                          <Input id="vendor-company" placeholder="PT Cipta Solusi Indonesia" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-email">
                            Email
                          </Label>
                          <Input id="vendor-email" placeholder="contact@ciptasolusi.id" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-phone">
                            Phone
                          </Label>
                          <Input id="vendor-phone" placeholder="+62 812 3333 1234" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Address & Tax
                      </h3>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="vendor-address">
                          Full Address
                        </Label>
                        <Textarea
                          id="vendor-address"
                          className="min-h-[90px] text-sm"
                          placeholder="Jl. Jenderal Sudirman No. 123, Jakarta"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-city">
                            City
                          </Label>
                          <Input id="vendor-city" placeholder="Jakarta" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-postal">
                            Postal Code
                          </Label>
                          <Input id="vendor-postal" placeholder="10210" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-npwp">
                            NPWP
                          </Label>
                          <Input id="vendor-npwp" placeholder="00.123.456.7-890.000" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        PIC & Banking
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-pic-name">
                            PIC Name
                          </Label>
                          <Input id="vendor-pic-name" placeholder="Rani Putri" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-pic-role">
                            PIC Position
                          </Label>
                          <Input id="vendor-pic-role" placeholder="Procurement Manager" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-pic-contact">
                            PIC Contact
                          </Label>
                          <Input id="vendor-pic-contact" placeholder="+62 813 9988 1122" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-bank-name">
                            Bank Name
                          </Label>
                          <Input id="vendor-bank-name" placeholder="Bank Mandiri" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-bank-account">
                            Account Number
                          </Label>
                          <Input id="vendor-bank-account" placeholder="1234567890" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs" htmlFor="vendor-bank-branch">
                            Branch
                          </Label>
                          <Input id="vendor-bank-branch" placeholder="KCP Sudirman" />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <DialogFooter className="px-6 py-4 border-t">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Submit Onboarding</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Minimal Confirm Modal</CardTitle>
            <CardDescription className="text-xs">
              Very compact dialog for quick yes/no decisions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs font-semibold">
                  Quick Confirm
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[380px] rounded-sm">
                <DialogHeader>
                  <DialogTitle className="text-base">Apply Quick Sync?</DialogTitle>
                  <DialogDescription className="text-xs">
                    This will refresh all dashboard widgets with latest data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Not Now</Button>
                  <Button>Yes, Sync</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm md:col-span-2 xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Fullscreen Workspace Modal</CardTitle>
            <CardDescription className="text-xs">
              Large modal reference for complex review and editing workflows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-9 text-xs font-semibold">
                  Open Full Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[96vw] max-w-[96vw] h-[88vh] p-0 rounded-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                  <div className="lg:col-span-3 border-r bg-slate-50/80 dark:bg-white/5 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Sections
                    </p>
                    <div className="space-y-2">
                      {workspaceSections.map((section) => {
                        const isActive = workspaceSection === section.key;
                        return (
                          <button
                            key={section.key}
                            type="button"
                            onClick={() => setWorkspaceSection(section.key)}
                            className={cn(
                              "w-full rounded-sm border px-3 py-2.5 text-left text-xs font-semibold transition-all",
                              isActive
                                ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-background dark:text-slate-300 dark:hover:bg-white/10",
                            )}
                          >
                            {section.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="lg:col-span-9 flex flex-col">
                    <DialogHeader className="px-6 py-4 border-b">
                      <DialogTitle className="text-base">Project Workspace</DialogTitle>
                      <DialogDescription className="text-xs">
                        Large modal layout for handling data-heavy tasks.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1">
                      <div className="px-6 py-5 space-y-4">
                        {workspaceSection === "summary" && (
                          <>
                            <div className={workspaceCardClass}>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Executive Summary
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Revenue target is on track with a 12% increase from last quarter.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className={workspaceCardClass}>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  Current Focus
                                </p>
                                <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                                  Stabilize operational costs while keeping delivery speed high.
                                </p>
                              </div>
                              <div className={workspaceCardClass}>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  Key Risks
                                </p>
                                <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                                  Vendor lead-time and scope creep must be monitored weekly.
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        {workspaceSection === "budget" && (
                          <>
                            <div className={workspaceCardClass}>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Budget Allocation
                              </p>
                              <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                                Marketing: Rp 1,2 M
                              </p>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                Operations: Rp 2,5 M
                              </p>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                Contingency: Rp 600 jt
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className={workspaceCardClass}>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  Utilization
                                </p>
                                <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                                  73% of planned budget has been used.
                                </p>
                              </div>
                              <div className={workspaceCardClass}>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  Forecast
                                </p>
                                <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                                  End-quarter spend expected at 94% of total plan.
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        {workspaceSection === "timeline" && (
                          <>
                            <div className={workspaceCardClass}>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Project Milestones
                              </p>
                              <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                                Discovery complete, implementation in progress.
                              </p>
                            </div>
                            {[
                              "Week 1-2: Requirement validation",
                              "Week 3-4: Core module delivery",
                              "Week 5: Integration test",
                              "Week 6: UAT and handover",
                            ].map((item) => (
                              <div
                                key={item}
                                className={workspaceCardClass}
                              >
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {item}
                                </p>
                              </div>
                            ))}
                          </>
                        )}

                        {workspaceSection === "notes" && (
                          <>
                            <div className={workspaceCardClass}>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Team Notes
                              </p>
                              <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
                                Keep stakeholder updates concise and focused on blockers.
                              </p>
                            </div>
                            {Array.from({ length: 4 }).map((_, index) => (
                              <div
                                key={index}
                                className={workspaceCardClass}
                              >
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  Note {index + 1}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  Additional placeholder content for notes and action items.
                                </p>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </ScrollArea>
                    <DialogFooter className="px-6 py-4 border-t">
                      <Button variant="outline">Close</Button>
                      <Button>Save Workspace</Button>
                    </DialogFooter>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bottom Sheet Modal</CardTitle>
            <CardDescription className="text-xs">
              Bottom drawer style for quick mobile-like actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full h-9 text-xs font-semibold">
                  Open Bottom Actions
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-lg">
                <SheetHeader>
                  <SheetTitle className="text-base">Quick Actions</SheetTitle>
                  <SheetDescription className="text-xs">
                    Choose one action to continue your workflow.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs">
                    Duplicate Current Record
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs">
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs">
                    Send for Approval
                  </Button>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="w-full">Done</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
