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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { inventoryItemFormSchema, type InventoryItemFormValues } from "../schema";
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
} from "@/hooks/useInventory";
import type { InventoryItem } from "../types";
import { toast } from "sonner";

interface InventoryItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem;
  onSuccess: () => void;
}

export function InventoryItemFormDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: InventoryItemFormDialogProps) {
  const isEdit = !!item;
  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();

  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: {
      code: "",
      name: "",
      quantity: 0,
      price: 0,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        code: item.code,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
    } else if (open) {
      form.reset({
        code: "",
        name: "",
        quantity: 0,
        price: 0,
      });
    }
  }, [item, open, form]);

  const onSubmit = (values: InventoryItemFormValues) => {
    const handleSuccess = () => {
      onOpenChange(false);
      onSuccess();
    };

    if (isEdit && item) {
      updateMutation.mutate(
        { id: item.id, input: values },
        {
          onSuccess: (data) => {
            if (data === null) {
              toast.error("Failed to update item");
            } else {
              handleSuccess();
            }
          },
          onError: () => toast.error("Failed to update item"),
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: handleSuccess,
        onError: () => toast.error("Failed to create item"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Asset" : "Add Asset"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ASSET-1021" className="h-9 text-sm" />
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
                    <Input {...field} placeholder="Asset name" className="h-9 text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="h-9 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="h-9 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
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
