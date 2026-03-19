import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { roleFormSchema, type RoleFormValues } from "../schema";
import { useCreateRole, useUpdateRole } from "@/hooks/useRoles";
import type { ApiError } from "@/lib/api/client";
import { toast } from "sonner";
import type { Role } from "../types";
import { MAIN_NAV_MENU } from "@/lib/menuConfig";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role;
  onSuccess: () => void;
}

/** Build permission options from menu: top-level items and their children for checkboxes */
function getPermissionOptions(): { key: string; label: string; group?: string }[] {
  const options: { key: string; label: string; group?: string }[] = [];
  for (const item of MAIN_NAV_MENU) {
    if (item.children?.length) {
      options.push({ key: item.permissionKey, label: `${item.label} (parent)`, group: item.label });
      for (const child of item.children) {
        if (child.children?.length) {
          // Submenu with nested children (e.g., Catatan Pengeluaran)
          options.push({
            key: child.permissionKey,
            label: `${child.label} (parent)`,
            group: `${item.label} / ${child.label}`,
          });
          for (const grandChild of child.children) {
            options.push({
              key: grandChild.permissionKey,
              label: grandChild.label,
              group: `${item.label} / ${child.label}`,
            });
          }
        } else {
          // Regular child (no nested children)
          options.push({ key: child.permissionKey, label: child.label, group: item.label });
        }
      }
    } else {
      options.push({ key: item.permissionKey, label: item.label });
    }
  }
  return options;
}

const PERMISSION_OPTIONS = getPermissionOptions();

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: RoleFormDialogProps) {
  const isEdit = !!role;
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      permissionKeys: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        code: role.code,
        name: role.name,
        description: role.description ?? "",
        permissionKeys: role.permissionKeys,
        isActive: role.isActive,
      });
    } else if (open) {
      form.reset({
        code: "",
        name: "",
        description: "",
        permissionKeys: [],
        isActive: true,
      });
    }
  }, [role, open, form]);

  const onSubmit = (values: RoleFormValues) => {
    const payload = {
      code: values.code,
      name: values.name,
      description: values.description || undefined,
      permissionKeys: values.permissionKeys,
      isActive: values.isActive,
    };

    const handleError = (err: unknown) => {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "An error occurred");
      if (Array.isArray(apiErr.errors)) {
        for (const { field, message } of apiErr.errors) {
          form.setError(field as keyof RoleFormValues, { message });
        }
      }
    };

    const handleSuccess = () => {
      onOpenChange(false);
      onSuccess();
    };

    if (isEdit && role) {
      updateMutation.mutate(
        { id: role.id, input: payload },
        { onSuccess: handleSuccess, onError: handleError }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Role" : "Add Role"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="flex-1 px-6 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-9 text-sm"
                            placeholder="e.g. ADMIN, FINANCE_USER"
                          />
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
                        <FormLabel className="text-xs">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9 text-sm" placeholder="Display name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ""} rows={2} className="text-sm resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissionKeys"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Menu Permissions</FormLabel>
                      <div className="rounded-md border border-slate-200 dark:border-white/10 p-3 max-h-48 overflow-y-auto space-y-2">
                        {PERMISSION_OPTIONS.map((opt) => (
                          <div
                            key={opt.key}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`perm-${opt.key}`}
                              checked={field.value?.includes(opt.key)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                const newVal = checked
                                  ? [...current, opt.key]
                                  : current.filter((k) => k !== opt.key);
                                field.onChange(newVal);
                              }}
                            />
                            <label
                              htmlFor={`perm-${opt.key}`}
                              className="text-sm font-medium leading-none cursor-pointer text-foreground"
                            >
                              {opt.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <FormLabel className="text-xs">Active</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="p-6 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEdit
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
