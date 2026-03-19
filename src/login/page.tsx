import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, User, Globe, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const returnTo = (location.state as { returnTo?: string })?.returnTo ?? "/dashboard";
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    if (!username || !password) return;
    setIsLoading(true);
    try {
      await login(username, password);
      toast.success("Login successful", { description: "Welcome back to Coreapps" });
      navigate(returnTo);
    } catch (err) {
      const apiErr = err as ApiError;
      const errorMsg = apiErr.code === "INVALID_CREDENTIALS" ? "Invalid credentials" : (apiErr.message ?? "Sign in failed");
      toast.error("Authentication Error", { description: errorMsg });
      setError(errorMsg);
      if (Array.isArray(apiErr.errors)) {
        const map: Record<string, string> = {};
        for (const { field, message } of apiErr.errors) {
          map[field] = message;
        }
        setFieldErrors(map);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] px-6">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="mb-6 group hover:scale-105 transition-transform">
            <img src="/alugra_logo.png" alt="Coreapps Logo" className="h-[60px] w-auto drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-foreground tracking-tight mb-2">
            Coreapps
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Enterprise Resource Planning System
          </p>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] bg-white/80 dark:bg-card/30 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-slate-200/50 dark:ring-white/5">
          <CardContent className="p-10 pt-12">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="text-sm text-destructive font-medium bg-destructive/10 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="pl-11 h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                {fieldErrors.username && (
                  <p className="text-xs text-destructive ml-1">{fieldErrors.username}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-[10px] font-bold text-slate-400 hover:text-primary transition-colors no-underline"
                  >
                    Forgot Password?
                  </Button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pl-11 h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-destructive ml-1">{fieldErrors.password}</p>
                )}
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
