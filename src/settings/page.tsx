import { useState, useEffect } from "react";
import {
  Bell,
  Brush,
  Building2,
  CreditCard,
  Database,
  Globe2,
  LockKeyhole,
  Mail,
  Network,
  TimerReset,
  Save,
  Settings2,
  Shield,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoAssignApprover, setAutoAssignApprover] = useState(true);
  const [dailyBackup, setDailyBackup] = useState(true);
  const [softDelete, setSoftDelete] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const { data } = useSettings();
  const updateMutation = useUpdateSettings();

  // Sync form state with settings from API
  useEffect(() => {
    if (!data) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data.companyName) setEmailNotifications(data.emailNotifications ?? true);
    if (data.pushNotifications != null) setPushNotifications(data.pushNotifications);
    if (data.securityAlerts != null) setSecurityAlerts(data.securityAlerts);
    if (data.twoFactorAuth != null) setTwoFactorAuth(data.twoFactorAuth);
    if (data.autoAssignApprover != null) setAutoAssignApprover(data.autoAssignApprover);
    if (data.dailyBackup != null) setDailyBackup(data.dailyBackup);
    if (data.softDelete != null) setSoftDelete(data.softDelete);
    if (data.compactMode != null) setCompactMode(data.compactMode);
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      {
        emailNotifications,
        pushNotifications,
        securityAlerts,
        twoFactorAuth,
        autoAssignApprover,
        dailyBackup,
        softDelete,
        compactMode,
      },
      {
        onSuccess: () => toast.success("Settings saved successfully."),
        onError: (e) =>
          toast.error(
            e && typeof e === "object" && "message" in e
              ? String((e as { message: string }).message)
              : "Failed to save settings."
          ),
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            <Settings2 className="h-7 w-7 text-primary" />
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Configure organization profile, regional preferences, notifications, and security.
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 space-y-4">
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Organization Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Alugra Teknologi Nusantara" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input id="company-email" type="email" defaultValue="hello@alugra.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone</Label>
                  <Input id="company-phone" defaultValue="+62 21 9988 7766" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input id="company-website" defaultValue="https://alugra.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Regional Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="asia-jakarta">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-jakarta">Asia/Jakarta (WIB)</SelectItem>
                      <SelectItem value="asia-makassar">Asia/Makassar (WITA)</SelectItem>
                      <SelectItem value="asia-jayapura">Asia/Jayapura (WIT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="idr">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idr">IDR - Indonesian Rupiah</SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Brush className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Appearance & Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <span className="text-sm text-slate-700 dark:text-slate-300">Compact interface mode</span>
                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Users2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Workflow & Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Approval Flow</Label>
                  <Select defaultValue="sequential">
                    <SelectTrigger>
                      <SelectValue placeholder="Select flow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">Sequential Approval</SelectItem>
                      <SelectItem value="parallel">Parallel Approval</SelectItem>
                      <SelectItem value="manager-only">Manager Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Escalation SLA</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue placeholder="Select SLA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8h">8 Hours</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="48h">48 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Auto-assign approver by department</span>
                </div>
                <Switch checked={autoAssignApprover} onCheckedChange={setAutoAssignApprover} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Email notifications</span>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <span className="text-sm text-slate-700 dark:text-slate-300">Push notifications</span>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <span className="text-sm text-slate-700 dark:text-slate-300">Security alerts</span>
                <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Security Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select defaultValue="30m">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="30m">30 Minutes</SelectItem>
                    <SelectItem value="60m">60 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Two-factor authentication</span>
                </div>
                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Data Backup & Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <Label>Retention Period</Label>
                <Select defaultValue="365d">
                  <SelectTrigger>
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="180d">180 Days</SelectItem>
                    <SelectItem value="365d">365 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <TimerReset className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Automatic daily backup</span>
                </div>
                <Switch checked={dailyBackup} onCheckedChange={setDailyBackup} />
              </div>
              <div className="flex items-center justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-background px-3 py-2.5">
                <span className="text-sm text-slate-700 dark:text-slate-300">Enable soft-delete recovery</span>
                <Switch checked={softDelete} onCheckedChange={setSoftDelete} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 rounded-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Billing Email</Label>
                  <Input id="billing-email" type="email" defaultValue="billing@alugra.com" />
                </div>
                <div className="space-y-2">
                  <Label>Current Plan</Label>
                  <Select defaultValue="enterprise">
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
