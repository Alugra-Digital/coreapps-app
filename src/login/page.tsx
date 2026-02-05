import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Globe, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] px-6">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-6 group hover:rotate-6 transition-transform">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-foreground tracking-tight mb-2">
            IT Consultant{" "}
            <span className="text-primary font-black uppercase italic ml-1 select-none">
              Co.
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Enterprise Resource Planning System • v4.2.0
          </p>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] bg-white/80 dark:bg-card/30 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-slate-200/50 dark:ring-white/5">
          <CardContent className="p-10 pt-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="Enter your work email"
                    defaultValue="achmadhakim@gmail.com"
                    className="pl-11 h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Password
                  </Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[10px] font-bold text-slate-400 hover:text-primary transition-colors no-underline"
                  >
                    Forgot Password?
                  </Button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                    className="pl-11 h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-70 transition-all group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In to Console{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Globe className="h-3 w-3" /> Secure Gateway Active
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6">
          <Button
            variant="link"
            className="p-0 h-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 no-underline uppercase tracking-wider"
          >
            System Status
          </Button>
          <Button
            variant="link"
            className="p-0 h-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 no-underline uppercase tracking-wider"
          >
            Support Desk
          </Button>
          <Button
            variant="link"
            className="p-0 h-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 no-underline uppercase tracking-wider"
          >
            Privacy Policy
          </Button>
        </div>
      </div>
    </div>
  );
}
