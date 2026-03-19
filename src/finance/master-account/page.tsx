import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
    useAccounts,
    useCreateAccount,
    useUpdateAccount,
    useDeleteAccount,
} from '@/hooks/useAccounts';
import type { Account } from '@/api/accounts';
import { AccountFormDialog } from './components/AccountFormDialog';

export default function MasterAccountPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Account | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);

    const { data: accounts = [], isLoading, isError } = useAccounts();
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();
    const deleteMutation = useDeleteAccount();

    const handleOpenCreate = () => {
        setEditTarget(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (account: Account) => {
        setEditTarget(account);
        setDialogOpen(true);
    };

    const handleFormSubmit = async (data: Partial<Account>) => {
        try {
            if (editTarget) {
                await updateMutation.mutateAsync({ id: editTarget.id, data });
                toast.success('Account updated successfully');
            } else {
                await createMutation.mutateAsync(data);
                toast.success('Account created successfully');
            }
            setDialogOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error saving account');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast.success('Account deleted successfully');
            setDeleteTarget(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error deleting account');
        }
    };

    // Helper to find parent name
    const getParentName = (parentId: number | null | undefined) => {
        if (!parentId) return '-';
        const parent = accounts.find(a => a.id === parentId);
        return parent ? `${parent.code} - ${parent.name}` : parentId;
    };

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center p-6 text-red-500">
                Error loading accounts data. Please ensure the backend is running.
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Master Account</h2>
                <Button onClick={handleOpenCreate} className="bg-slate-800 text-white hover:bg-slate-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Account
                </Button>
            </div>

            <Card className="bg-[#121214] border-[#1E1E22]">
                <CardHeader>
                    <CardTitle className="text-zinc-100 flex items-center gap-2">
                        <FolderTree className="h-5 w-5 text-zinc-400" />
                        Chart of Accounts Catalog
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Manage your general ledger accounts, including groupings and categorizations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-[#1E1E22]">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-[#1E1E22] hover:bg-transparent">
                                    <TableHead className="text-zinc-400 w-[120px]">Code</TableHead>
                                    <TableHead className="text-zinc-400">Name</TableHead>
                                    <TableHead className="text-zinc-400">Type</TableHead>
                                    <TableHead className="text-zinc-400 text-center">Group</TableHead>
                                    <TableHead className="text-zinc-400">Parent Account</TableHead>
                                    <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-zinc-400">
                                            Loading master accounts...
                                        </TableCell>
                                    </TableRow>
                                ) : accounts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-zinc-400">
                                            No accounts found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    accounts.map((account) => (
                                        <TableRow key={account.id} className="border-[#1E1E22] hover:bg-white/5">
                                            <TableCell className="font-medium text-zinc-200">
                                                {account.code}
                                            </TableCell>
                                            <TableCell className={account.isGroup ? "font-bold text-zinc-100" : "text-zinc-300"}>
                                                {account.name}
                                            </TableCell>
                                            <TableCell className="text-zinc-300">{account.type}</TableCell>
                                            <TableCell className="text-center">
                                                {account.isGroup ? (
                                                    <Badge variant="secondary" className="bg-blue-900/40 text-blue-300 border-blue-800">Yes</Badge>
                                                ) : (
                                                    <span className="text-zinc-600">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-zinc-400">
                                                {getParentName(account.parentAccountId)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenEdit(account)}
                                                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteTarget(account)}
                                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AccountFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleFormSubmit}
                initialData={editTarget ?? undefined}
                accounts={accounts}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent className="bg-[#121214] border-[#1E1E22] text-zinc-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Are you sure you want to delete account {deleteTarget?.code} - {deleteTarget?.name}?
                            This action cannot be undone and may cause issues if the account has linked transactions.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-[#1E1E22] text-zinc-300 hover:bg-white/5 hover:text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600/80 text-white hover:bg-red-600"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
