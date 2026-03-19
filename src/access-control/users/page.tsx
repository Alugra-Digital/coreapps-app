import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { UserTable } from "./components/UserTable";
import { Button } from "@/components/ui/button";
import { useUsersPaginated } from "@/hooks/useUsers";
import type { User } from "./types";
import { PageLoader } from "@/components/ui/PageLoader";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading, error, refetch } = useUsersPaginated({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const users: User[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: string }).message)
      : null;

  return (
    <div
      className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors"
      data-testid="users-page"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1
            className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground"
            data-testid="users-heading"
          >
            Master User
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage users and assign roles for access control.
          </p>
        </div>
        <Button
          className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
          onClick={() => setIsAddOpen(true)}
          data-testid="add-user-btn"
        >
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {isLoading && <PageLoader />}

      {!isLoading && errorMessage && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
          data-testid="users-load-error"
        >
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try again
          </Button>
        </div>
      )}

      {!isLoading && (
        <UserTable
          users={users}
          onRefresh={() => refetch()}
          onAddClick={() => setIsAddOpen(true)}
          isAddOpen={isAddOpen}
          onAddOpenChange={setIsAddOpen}
          pagination={{
            currentPage,
            totalPages,
            total,
            onPageChange: setCurrentPage,
          }}
        />
      )}
    </div>
  );
}
