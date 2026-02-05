import {
  User,
  Mail,
  Lock,
  Bell,
  Monitor,
  ShieldCheck,
  MapPin,
  Globe,
  Camera,
  LogOut,
  ChevronRight,
  ExternalLink,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Profile Header / Hero */}
      <div className="relative">
        <div className="h-32 w-full bg-linear-to-r from-indigo-500 to-primary rounded-3xl opacity-10 dark:opacity-20 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)]" />
        </div>
        <div className="px-8 -mt-12 flex flex-col md:flex-row items-end gap-6 relative z-10">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-4 border-white dark:border-[#111111] shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-foreground text-3xl font-black">
                AH
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full absolute bottom-1 right-1 bg-primary text-primary-foreground border-2 border-white dark:border-[#111111] shadow-lg hover:scale-110 transition-transform"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-foreground tracking-tight">
                Achmad Hakim
              </h1>
              <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-none font-bold text-[10px] uppercase tracking-wider">
                Verified Admin
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Jakarta, Indonesia
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Timezone: GMT+7 (WIB)
              </span>
              <span className="flex items-center gap-1.5 text-primary">
                <Mail className="h-3.5 w-3.5" /> achmadhakim@gmail.com
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Button
              variant="outline"
              className="h-9 gap-2 text-xs font-bold border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400"
            >
              Cancel
            </Button>
            <Button className="h-9 gap-2 text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        {/* Left Column: Personal Info & Preferences */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                <User className="h-4 w-4" /> Personal Information
              </span>
            </div>
            <CardContent className="p-6 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <Input
                    defaultValue="Achmad Hakim"
                    className="h-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Job Title
                  </label>
                  <Input
                    defaultValue="Chief Operation Officer"
                    className="h-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <Input
                    defaultValue="achmadhakim@gmail.com"
                    className="h-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <Input
                    defaultValue="+62 812-4421-XXXX"
                    className="h-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-lg"
                  />
                </div>
              </div>
              <Separator className="my-8 bg-slate-200/50 dark:bg-white/5" />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Bio / Profile Description
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all dark:text-foreground italic"
                  defaultValue="Driving operational excellence at IT Consultant Co. Focused on enterprise growth and system efficiency."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                <Monitor className="h-4 w-4" /> System Preferences
              </span>
            </div>
            <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="space-y-3">
                <PreferenceItem
                  icon={<Bell className="h-4 w-4" />}
                  title="Push Notifications"
                  description="Receive real-time alerts for critical system events"
                  enabled
                />
                <PreferenceItem
                  icon={<Monitor className="h-4 w-4" />}
                  title="Appearance Mode"
                  description="Switch between light and dark system themes"
                  meta="Dark Mode Active"
                />
                <PreferenceItem
                  icon={<Globe className="h-4 w-4" />}
                  title="Language Settings"
                  description="Localized UI for international compliance"
                  meta="English (US)"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Security & Sessions */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <Card className="shadow-sm border-none bg-slate-900 dark:bg-primary/5 p-6 rounded-2xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Account Security
                </h3>
                <p className="text-[10px] text-slate-400">
                  Manage login & access security
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold">2FA Authentication</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black uppercase">
                    Active
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 mb-3">
                  Your account is secured with multi-factor authentication.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-[10px] text-emerald-400 font-bold no-underline flex items-center gap-1"
                >
                  Configure Settings <ExternalLink className="h-2.5 w-2.5" />
                </Button>
              </div>
              <Button className="w-full h-10 bg-white text-slate-900 hover:bg-white/90 font-bold text-xs rounded-xl">
                <Lock className="h-3.5 w-3.5 mr-2" /> Change Password
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" /> Active Sessions
              </span>
            </div>
            <CardContent className="p-6 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="space-y-6">
                <SessionItem
                  device="MacBook Pro 14\"
                  browser="Chrome • Jakarta, ID"
                  status="Current Session"
                  active
                />
                <SessionItem
                  device="iPhone 15 Pro"
                  browser="Mobile App • Bogor, ID"
                  status="3 hours ago"
                />
              </div>
              <Separator className="my-6 bg-slate-200/50 dark:bg-white/5" />
              <Button
                variant="ghost"
                className="w-full h-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold text-xs rounded-xl flex items-center justify-start gap-3"
              >
                <LogOut className="h-4 w-4" /> Sign Out from All Devices
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PreferenceItem({ icon, title, description, enabled, meta }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-all hover:border-slate-300 dark:hover:border-white/10 group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-foreground">
            {title}
          </h4>
          <p className="text-[10px] text-slate-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {meta && (
          <span className="text-[10px] font-bold text-slate-400">{meta}</span>
        )}
        {enabled !== undefined && (
          <div
            className={cn(
              "h-4 w-8 rounded-full relative transition-colors p-[2px]",
              enabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/10",
            )}
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full bg-white shadow-sm transition-all",
                enabled ? "translate-x-4" : "translate-x-0",
              )}
            />
          </div>
        )}
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </div>
    </div>
  );
}

function SessionItem({ device, browser, status, active }: any) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5",
          active
            ? "bg-primary/10 text-primary"
            : "bg-slate-50 dark:bg-white/5 text-slate-400",
        )}
      >
        {device.includes("iPhone") ? (
          <Smartphone className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-foreground truncate">
            {device}
          </span>
          {active && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 truncate">{browser}</span>
          <span
            className={cn(
              "text-[9px] font-black uppercase tracking-wider",
              active ? "text-emerald-500" : "text-slate-400",
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
