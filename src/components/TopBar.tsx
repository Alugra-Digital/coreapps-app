import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";

function getInitials(fullName?: string | null, username?: string): string {
  if (fullName?.trim()) {
    return fullName
      .split(/\s+/)
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (username?.trim()) {
    return username.slice(0, 2).toUpperCase();
  }
  return "—";
}

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TopBar({ className }: TopBarProps) {
  const { currentUser } = useAuth();
  const initials = getInitials(currentUser?.fullName, currentUser?.username);

  return (
    <div
      className={cn(
        "flex h-16 items-center justify-between border-b border-border bg-white dark:bg-[#111111] px-8 transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="flex items-center gap-1.5 text-muted-foreground/60"
              >
                <LayoutGrid className="h-4 w-4" />
                Overview
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <NotificationDropdown />
        <Link
          to="/profile"
          className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border hover:ring-2 hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
}
