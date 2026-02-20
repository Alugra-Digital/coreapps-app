import { Search, MoreVertical, Pencil, Trash2, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserFormDialog } from "./UserFormDialog";
import { deleteUser } from "@/api/users";
import { getRoles } from "@/api/roles";
import type { User } from "../types";
import type { Role } from "@/access-control/roles/types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
  onAddClick: () => void;
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
  pagination?: PaginationProps;
}

export function UserTable({
  users,
  onRefresh,
  onAddClick,
  isAddOpen,
  onAddOpenChange,
  pagination,
}: UserTableProps) {
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteUserName, setDeleteUserName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  const roleMap = new Map(roles.map((r) => [r.id, r]));

  const filtered = users.filter(
    (u) =>
      (u.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    setIsDeleting(true);
    try {
      await deleteUser(deleteUserId);
      onRefresh();
      setDeleteUserId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSuccess = () => {
    onAddOpenChange(false);
    onRefresh();
  };

  const handleEditSuccess = () => {
    setEditUser(null);
    onRefresh();
  };

  return (
    <>
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <Users className="h-4 w-4" /> Users
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search username, email, name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 outline-none w-56 text-foreground"
              />
            </div>
            <Button
              className="h-7 gap-2 rounded-lg text-[10px] font-semibold bg-primary text-primary-foreground hover:opacity-90"
              onClick={onAddClick}
            >
              Add User
            </Button>
          </div>
        </div>

        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Username
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Email
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Full Name
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Role
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow
                  key={u.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                      {u.username}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {u.email ?? "-"}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {u.fullName ?? "-"}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    {u.roleId ? (roleMap.get(u.roleId)?.name ?? u.roleId) : "-"}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        u.isActive
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                          : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditUser(u)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeleteUserId(u.id);
                            setDeleteUserName(u.username);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Page {pagination.currentPage} of {pagination.totalPages}
                {pagination.total > 0 && ` (${pagination.total} total)`}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                  disabled={pagination.currentPage <= 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() =>
                    pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))
                  }
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        open={isAddOpen}
        onOpenChange={onAddOpenChange}
        onSuccess={handleAddSuccess}
      />

      <UserFormDialog
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser ?? undefined}
        onSuccess={handleEditSuccess}
      />

      <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user <strong>{deleteUserName}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
