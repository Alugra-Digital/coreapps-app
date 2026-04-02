import React, { useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  LifeBuoy,
  Settings,
  Search,
  ChevronDown,
  PanelLeft,
  ChevronUp,
  LogOut,
  Users,
  Briefcase,
  Lock,
  CalendarDays,
  Clock,
  Banknote,
  DollarSign,
  TrendingUp,
  Factory,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePermissions, useAuth } from "@/contexts/AuthContext";
import { MAIN_NAV_MENU, type MenuItemConfig } from "@/lib/menuConfig";
import { hasPermission } from "@/lib/rbac";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

/** Filter menu items by permissions: show item if user has permission or has any allowed child */
function filterMenuByPermissions(
  menu: MenuItemConfig[],
  permissions: string[]
): MenuItemConfig[] {
  if (permissions.length === 0) return [];
  return menu.filter((item) => {
    const hasParent = hasPermission(permissions, item.permissionKey);
    const allowedChildren =
      item.children?.filter((c) => hasPermission(permissions, c.permissionKey)) ?? [];
    if (item.children?.length) {
      return hasParent || allowedChildren.length > 0;
    }
    return hasParent;
  });
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const { currentUser, isLoading, logout } = useAuth();

  const mainNavItems = useMemo(
    () => (isLoading ? MAIN_NAV_MENU : filterMenuByPermissions(MAIN_NAV_MENU, permissions)),
    [permissions, isLoading]
  );

  return (
    <div
      className={cn(
        "flex h-full w-[280px] flex-col bg-sidebar dark:bg-[#111111] border-r border-sidebar-border p-4 gap-4 transition-colors",
        className,
      )}
    >
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-2 py-2">
        <img
          src="/alugra_logo.png"
          alt="Alugra"
          className="h-8 object-contain object-left"
        />
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-sidebar-border to-transparent opacity-50" />

      {/* Scrollable Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1 -mr-1">
        {/* Search */}
        <div className="relative px-1 mt-2">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search anything"
            className="pl-10 h-10 bg-white dark:bg-card border border-slate-200 dark:border-white/5 rounded-sm shadow-sm focus-visible:ring-1 focus-visible:ring-sidebar-primary text-sm placeholder:text-slate-400 dark:text-foreground outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-slate-400 font-semibold px-1">
            <span className="font-sans text-xs">⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Main Navigation (RBAC from menuConfig) */}
        <div className="flex flex-col gap-1">
          <div className="px-3 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400/80">
              Main Navigation
            </h2>
          </div>

          {mainNavItems.map((item) => {
            const hasParent = hasPermission(permissions, item.permissionKey);
            const allowedChildren =
              item.children?.filter((c) => hasPermission(permissions, c.permissionKey)) ?? [];
            const childrenToShow = hasParent ? (item.children ?? []) : allowedChildren;
            const hasChildren = childrenToShow.length > 0;
            const isParentActive =
              item.children?.some((c) => location.pathname === c.path) ??
              location.pathname.startsWith(item.path);

            if (item.children?.length) {
              return (
                <SidebarItem
                  key={item.permissionKey}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  hasChevron={hasChildren}
                  active={isParentActive}
                >
                  {childrenToShow.map((child) => {
                    const isChildActive = location.pathname === child.path;
                    const hasGrandChildren = child.children && child.children.length > 0;
                    const isGrandParentActive =
                      child.children?.some((gc) => location.pathname === gc.path) ??
                      location.pathname.startsWith(child.path);

                    if (hasGrandChildren) {
                      // Render sub-item with its own children (nested menu)
                      return (
                        <SidebarItem
                          key={child.permissionKey}
                          to={child.path}
                          label={child.label}
                          hasChevron={hasGrandChildren}
                          active={isGrandParentActive}
                          level={1}
                        >
                          {child.children!.map((grandChild) => (
                            <SidebarSubItem
                              key={grandChild.permissionKey}
                              to={grandChild.path}
                              label={grandChild.label}
                              active={location.pathname === grandChild.path}
                            />
                          ))}
                        </SidebarItem>
                      );
                    }

                    // Render regular sub-item
                    return (
                      <SidebarSubItem
                        key={child.permissionKey}
                        to={child.path}
                        label={child.label}
                        active={isChildActive}
                      />
                    );
                  })}
                </SidebarItem>
              );
            }
            return (
              <SidebarItem
                key={item.permissionKey}
                to={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
              />
            );
          })}
        </div>

        {/* Finance Quick Access */}
        <div className="flex flex-col gap-1">
          <div className="px-3 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Finance Reports
            </h2>
          </div>
          <SidebarItem
            to="/finance/catatan-pengeluaran"
            icon={<BookOpen className="h-[18px] w-[18px]" />}
            label="Catatan Pengeluaran"
            active={location.pathname === '/finance/catatan-pengeluaran'}
          />
        </div>

        {/* CRM & Manufacturing Section */}
        <div className="flex flex-col gap-1">
          <div className="px-3 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              CRM & Manufacturing
            </h2>
          </div>
          <SidebarItem
            to="/crm"
            icon={<TrendingUp className="h-[18px] w-[18px]" />}
            label="CRM"
            active={location.pathname === "/crm"}
          />
          <SidebarItem
            to="/manufacturing"
            icon={<Factory className="h-[18px] w-[18px]" />}
            label="Manufacturing"
            active={location.pathname === "/manufacturing"}
          />
        </div>

        {/* HR Section */}
        <div className="flex flex-col gap-1">
          <div className="px-3 mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              HR
            </h2>
          </div>
          <SidebarItem
            to="/hr/employees"
            icon={<Users className="h-[18px] w-[18px]" />}
            label="Employees"
            active={location.pathname === "/hr/employees"}
          />
          <SidebarItem
            to="/hr/positions"
            icon={<Briefcase className="h-[18px] w-[18px]" />}
            label="Positions"
            active={location.pathname === "/hr/positions"}
          />
          <SidebarItem
            to="/hr/leave"
            icon={<CalendarDays className="h-[18px] w-[18px]" />}
            label="Leave"
            active={location.pathname === "/hr/leave"}
          />
          <SidebarItem
            to="/hr/attendance"
            icon={<Clock className="h-[18px] w-[18px]" />}
            label="Attendance"
            active={location.pathname === "/hr/attendance"}
          />
          <SidebarItem
            to="/hr/loans"
            icon={<Banknote className="h-[18px] w-[18px]" />}
            label="Loans"
            active={location.pathname === "/hr/loans"}
          />
          <SidebarItem
            to="/hr/payroll"
            icon={<DollarSign className="h-[18px] w-[18px]" />}
            label="Payroll"
            active={location.pathname === "/hr/payroll"}
          />
        </div>

        {/* Support Section */}
        <div className="flex flex-col gap-1">
          <div className="px-3 mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Support
          </div>
          <SidebarItem
            to="/feedback"
            icon={<MessageSquare className="h-[18px] w-[18px]" />}
            label="Feedback"
            active={location.pathname === "/feedback"}
          />
          <SidebarItem
            to="/help"
            icon={<LifeBuoy className="h-[18px] w-[18px]" />}
            label="Help & Support"
            active={location.pathname === "/help"}
          />
          <SidebarItem
            to="/settings"
            icon={<Settings className="h-[18px] w-[18px]" />}
            label="Settings"
            active={location.pathname === "/settings"}
          />
        </div>

        {/* Components Section */}
        <div className='flex flex-col gap-1'>
          <div className='px-3 mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            Components UI
          </div>
          <SidebarItem
            to='/components-ui/modal'
            icon={<MessageSquare className='h-[18px] w-[18px]' />}
            label='Modal'
            active={location.pathname === '/components-ui/modal'}
          />
          <SidebarItem
            to='/components-ui/loader'
            icon={<MessageSquare className='h-[18px] w-[18px]' />}
            label='Loader'
            active={location.pathname === '/components-ui/loader'}
          />
          <SidebarItem
            to='/components-ui/role-access'
            icon={<Lock className='h-[18px] w-[18px]' />}
            label='Role-Access'
            active={location.pathname === '/components-ui/role-access'}
          />
        </div>
      </div>

      {/* Footer Area: User Profile */}
      <div className="pt-2">
        <Link
          to="/profile"
          className="p-2 bg-white dark:bg-card rounded-2xl border border-sidebar-border dark:border-white/5 shadow-sm flex items-center gap-3 transition-all hover:border-slate-300 dark:hover:border-white/10 group cursor-pointer"
        >
          <div className="relative">
            <Avatar className="h-9 w-9 border border-slate-100 dark:border-white/10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-slate-100 text-xs font-bold">
                {currentUser?.fullName
                  ?.split(/\s+/)
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() ?? "—"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111111]" />
          </div>
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="text-sm font-bold truncate text-slate-900 dark:text-foreground">
              {currentUser?.fullName ?? "—"}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {currentUser?.email ?? "—"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-slate-400 mr-1">
            <ChevronUp className="h-3 w-3" />
            <ChevronDown className="h-3 w-3 -mt-1.5" />
          </div>
        </Link>
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full justify-start gap-3 px-3 h-10 font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 mt-2 rounded-xl transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span className="text-sm uppercase tracking-widest">
            Logout System
          </span>
        </Button>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  to?: string;
  active?: boolean;
  hasChevron?: boolean;
  children?: React.ReactNode;
  level?: number;
}

function SidebarItem({
  icon,
  label,
  to = "#",
  active = false,
  hasChevron = false,
  children,
  level = 0,
}: SidebarItemProps) {
  const isSubItem = level > 0;

  return (
    <div className="relative group/menu">
      {isSubItem ? (
        <Link
          to={to}
          className="relative flex items-center h-8 group cursor-pointer pl-6"
        >
          {/* Horizontal line: Connects from parent's vertical line to the label */}
          <div className="absolute left-0 top-4 w-6 h-px bg-sidebar-border" />
          <span
            className={cn(
              "text-sm transition-colors",
              active
                ? "text-sidebar-primary font-bold"
                : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300",
            )}
          >
            {label}
          </span>
          {hasChevron && (
            <ChevronDown
              className={cn(
                "ml-auto h-3 w-3 transition-transform text-slate-300 group-hover:text-slate-400 dark:text-slate-600",
                children && "group-hover/menu:rotate-180",
              )}
            />
          )}
        </Link>
      ) : (
        <Link to={to} className="block w-full">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-3 h-10 font-medium transition-all group",
              active
                ? "bg-white dark:bg-primary/10 text-sidebar-primary shadow-[0_2px_4px_rgba(0,0,0,0.04)] ring-1 ring-sidebar-border dark:ring-primary/20 hover:bg-white dark:hover:bg-primary/20"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <div
              className={cn(
                "transition-colors",
                active
                  ? "text-sidebar-primary"
                  : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
              )}
            >
              {icon}
            </div>
            <span className="flex-1 text-left text-sm">{label}</span>
            {hasChevron && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform text-slate-300 group-hover:text-slate-400 dark:text-slate-600",
                  children && "group-hover/menu:rotate-180",
                )}
              />
            )}
          </Button>
        </Link>
      )}

      {children && (
        <div
          className={cn(
            "hidden group-hover/menu:block space-y-1 animate-in fade-in slide-in-from-top-1 duration-200 relative",
            isSubItem ? "pl-6 mt-1" : "pl-4 mt-1",
          )}
        >
          {/* Vertical line: extends up (-top-1) to bridge mt-1 gap and connect to parent */}
          <div
            className={cn("absolute -top-1 bottom-0 w-px bg-sidebar-border", isSubItem ? "left-6" : "left-4")}
          />
          {children}
        </div>
      )}
    </div>
  );
}

function SidebarSubItem({
  label,
  to = "#",
  active = false,
}: {
  label: string;
  isLast?: boolean;
  to?: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className="relative flex items-center h-8 group cursor-pointer pl-6"
    >
      {/* Horizontal line: Connects from parent's vertical line to the label */}
      <div className="absolute left-0 top-4 w-6 h-px bg-sidebar-border" />

      <span
        className={cn(
          "text-sm transition-colors",
          active
            ? "text-sidebar-primary font-bold"
            : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
