import { useEffect, useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { userFormSchema, type UserFormValues } from "../schema";
import { createUser, updateUser } from "@/api/users";
import { getRoles } from "@/api/roles";
import type { ApiError } from "@/lib/api/client";
import { toast } from "sonner";
import type { User } from "../types";
import type { Role } from "@/access-control/roles/types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSuccess: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const isEdit = !!user;
  const [roles, setRoles] = useState<Role[]>([]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      roleId: "",
      password: "",
      isActive: true,
    },
  });

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email ?? "",
        fullName: user.fullName ?? "",
        roleId: user.roleId ?? "",
        password: "",
        isActive: user.isActive,
      });
    } else if (open) {
      form.reset({
        username: "",
        email: "",
        fullName: "",
        roleId: roles[0]?.id ?? "",
        password: "",
        isActive: true,
      });
    }
  }, [user, open, form, roles]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (isEdit && user) {
        const payload: { username: string; email: string; fullName: string; roleId: string; isActive: boolean; password?: string } = {
          username: values.username,
          email: values.email,
          fullName: values.fullName,
          roleId: values.roleId,
          isActive: values.isActive,
        };
        if (values.password?.trim()) payload.password = values.password;
        await updateUser(user.id, payload);
      } else {
        await createUser({
          username: values.username,
          email: values.email,
          fullName: values.fullName,
          roleId: values.roleId,
          password: values.password?.trim() || undefined,
          isActive: values.isActive,
        });
      }
      onSuccess();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "An error occurred");
      if (Array.isArray(apiErr.errors)) {
        for (const { field, message } of apiErr.errors) {
          form.setError(field as keyof UserFormValues, { message });
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 text-sm"
                        placeholder="Login username"
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="h-9 text-sm" placeholder="user@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9 text-sm" placeholder="Display name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name} ({r.code})
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Password {isEdit ? "(leave blank to keep current)" : "(optional)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      value={field.value ?? ""}
                      className="h-9 text-sm"
                      placeholder={isEdit ? "••••••••" : "Optional"}
                      autoComplete="new-password"
                    />
                  </FormControl>
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
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
