import { useNavigate } from "react-router-dom";
import { InvoiceFormDialog } from "./components/InvoiceFormDialog";

/**
 * Full-page route for creating a new invoice.
 * Reuses InvoiceFormDialog; on save or cancel, navigates back to invoice list.
 * Enables deep linking and test automation (e.g. /finance/invoice/create).
 */
export default function InvoiceCreatePage() {
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      navigate("/finance/invoice");
    }
  };

  const handleSuccess = () => {
    navigate("/finance/invoice");
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors"
      data-testid="invoice-create-page"
    >
      <InvoiceFormDialog
        open={true}
        onOpenChange={handleOpenChange}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
