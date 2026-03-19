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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { positionFormSchema, type PositionFormValues } from "../schema";
import { useCreatePosition, useUpdatePosition } from "@/hooks/usePositions";
import type { Position } from "../types";
import { toast } from "sonner";

interface PositionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: Position;
  onSuccess: () => void;
}

export function PositionFormDialog({
  open,
  onOpenChange,
  position,
  onSuccess,
}: PositionFormDialogProps) {
  const isEdit = !!position;
  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (position) {
      form.reset({
        name: position.name,
        code: position.code ?? "",
        description: position.description ?? "",
        isActive: position.isActive,
      });
    } else if (open) {
      form.reset({
        name: "",
        code: "",
        description: "",
        isActive: true,
      });
    }
  }, [position, open, form]);

  const onSubmit = (values: PositionFormValues) => {
    const payload = {
      name: values.name,
      code: values.code || undefined,
      description: values.description || undefined,
      isActive: values.isActive,
    };

    const handleSuccess = () => {
      onOpenChange(false);
      onSuccess();
    };

    if (isEdit && position) {
      updateMutation.mutate(
        { id: position.id, input: payload },
        {
          onSuccess: handleSuccess,
          onError: () => toast.error("Failed to update position"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleSuccess,
        onError: () => toast.error("Failed to create position"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Position" : "Add Position"}</DialogTitle>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama Jabatan</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-9 text-sm"
                            placeholder="e.g. Project Manager"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Code (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-9 text-sm"
                            placeholder="e.g. PM"
                          />
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
                        <Textarea
                          {...field}
                          rows={2}
                          className="text-sm resize-none"
                          placeholder="Deskripsi jabatan"
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
