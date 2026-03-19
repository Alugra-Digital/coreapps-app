import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Account } from '@/api/accounts';

const formSchema = z.object({
    code: z.string().min(1, 'Account Code is required'),
    name: z.string().min(1, 'Account Name is required'),
    type: z.string().min(1, 'Account Type is required'),
    isGroup: z.boolean(),
    parentAccountId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface AccountFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Partial<Account>) => void;
    initialData?: Account;
    accounts: Account[];
    isLoading?: boolean;
}

const ACCOUNT_TYPES = [
    'Asset',
    'Liability',
    'Equity',
    'Revenue',
    'Expense',
];

export function AccountFormDialog({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    accounts,
    isLoading,
}: AccountFormDialogProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            name: '',
            type: '',
            isGroup: false,
            parentAccountId: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    code: initialData.code || '',
                    name: initialData.name || '',
                    type: initialData.type || '',
                    isGroup: !!initialData.isGroup,
                    parentAccountId: initialData.parentAccountId ? String(initialData.parentAccountId) : '',
                });
            } else {
                form.reset({
                    code: '',
                    name: '',
                    type: '',
                    isGroup: false,
                    parentAccountId: '',
                });
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = (values: FormValues) => {
        onSubmit({
            ...values,
            parentAccountId: (values.parentAccountId && values.parentAccountId !== "none") ? Number(values.parentAccountId) : null,
        });
    };

    // Filter out the current account to prevent it from being its own parent, and only allow groups to be parents if enforcing that rule
    const parentAccountOptions = accounts.filter(
        (acc) => acc.id !== initialData?.id && acc.isGroup
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Master Account' : 'Create Master Account'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 1101" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Kas Besar" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ACCOUNT_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isGroup"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Group Account</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Is this a parent aggregate account?
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parentAccountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Account (Optional)</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select parent account" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">No Parent</SelectItem>
                                            {parentAccountOptions.map((acc) => (
                                                <SelectItem key={acc.id} value={String(acc.id)}>
                                                    {acc.code} - {acc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
