import { Plus, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { UserTable } from "./components/UserTable";
import { Button } from "@/components/ui/button";
import { getUsersPaginated } from "@/api/users";
import type { User } from "./types";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async (page = 1) => {
    setError(null);
    setLoading(true);
    try {
      const res = await getUsersPaginated({ page, limit: PAGE_SIZE });
      setUsers(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setCurrentPage(res.page);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load users";
      setError(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(currentPage);
  }, [loadUsers, currentPage]);

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

      {loading && (
        <div
          className="flex items-center justify-center gap-2 py-12 text-muted-foreground"
          data-testid="users-loading"
        >
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      )}

      {!loading && error && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
          data-testid="users-load-error"
        >
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadUsers(currentPage)}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try again
          </Button>
        </div>
      )}

      {!loading && (
        <UserTable
          users={users}
          onRefresh={() => loadUsers(currentPage)}
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
