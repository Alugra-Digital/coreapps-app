import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { accountsApi, type Account } from '@/api/accounts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit2, ChevronRight, ChevronDown } from 'lucide-react';
// import { MasterAccountForm } from './MasterAccountForm';

export function MasterAccountList() {
    const { data: accounts = [], isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountsApi.getAccounts()
    });

    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    const toggleRow = (id: number) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    // Build hierarchy
    const rootAccounts = accounts.filter(a => !a.parentAccountId);
    const getChildren = (parentId: number) => accounts.filter(a => a.parentAccountId === parentId).sort((a, b) => a.code.localeCompare(b.code));

    const renderRow = (acc: Account, level: number = 0) => {
        const children = getChildren(acc.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedRows[acc.id];

        const getTypeColor = (type: string) => {
            switch (type) {
                case 'ASSET': return 'bg-blue-100 text-blue-800';
                case 'LIABILITY': return 'bg-red-100 text-red-800';
                case 'EQUITY': return 'bg-purple-100 text-purple-800';
                case 'REVENUE': return 'bg-green-100 text-green-800';
                case 'EXPENSE': return 'bg-orange-100 text-orange-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <React.Fragment key={acc.id}>
                <TableRow className={level === 0 ? "bg-muted/30 font-medium" : ""}>
                    <TableCell>
                        <div className="flex items-center" style={{ paddingLeft: `${level * 1.5}rem` }}>
                            {hasChildren ? (
                                <button
                                    onClick={() => toggleRow(acc.id)}
                                    className="mr-2 h-4 w-4 text-muted-foreground hover:text-foreground"
                                >
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                            ) : (
                                <span className="mr-6 inline-block" />
                            )}
                            {acc.code}
                        </div>
                    </TableCell>
                    <TableCell>{acc.name}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={getTypeColor(acc.type)}>{acc.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            {/* Hidden delete for now unless we implement proper deletion checks */}
                        </div>
                    </TableCell>
                </TableRow>
                {isExpanded && children.map(child => renderRow(child, level + 1))}
            </React.Fragment >
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Total {accounts.length} accounts mapped.
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Account
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Account Code</TableHead>
                            <TableHead>Account Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rootAccounts.sort((a, b) => a.code.localeCompare(b.code)).map(acc => renderRow(acc, 0))}
                        {rootAccounts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No accounts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
