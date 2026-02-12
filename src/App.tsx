import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardPage from "@/dashboard/page";
import FinancePage from "@/finance/page";
import InventoryPage from "./inventory/page";
import InvoicePage from "./invoice/page";
import PaymentPage from "./payment/page";
import PaymentDetailPage from "./detail-payment/page";
import ReportsPage from "./reports/page";
import ProfilePage from "./profile/page";
import LoginPage from "./login/page";
import SalesPage from "./sales/page";
import HREmployeePage from "./hr/employees/page";
import PurchaseOrderPage from "./finance/purchase-orders/page";
import BASTPage from "./finance/bast/page";
import PerpajakanPage from "./finance/perpajakan/page";
import ProposalPenawaranPage from "./finance/proposal-penawaran/page";
import ProjectPage from "./project/page";
import RolesPage from "./access-control/roles/page";
import UsersPage from "./access-control/users/page";
import { cn } from "@/lib/utils";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <AuthProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
        {!isLoginPage && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isLoginPage && <TopBar />}
        <main
          className={cn(
            "flex-1 overflow-y-auto bg-dashboard-bg transition-all",
            isLoginPage && "bg-background",
          )}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/finance/accounting" element={<FinancePage />} />
            <Route path="/finance/invoice" element={<InvoicePage />} />
            <Route path="/finance/payment" element={<PaymentPage />} />
            <Route
              path="/finance/purchase-orders"
              element={<PurchaseOrderPage />}
            />
            <Route path="/finance/proposal-penawaran" element={<ProposalPenawaranPage />} />
            <Route path="/finance/perpajakan" element={<PerpajakanPage />} />
            <Route path="/finance/bast" element={<BASTPage />} />
            <Route path="/projects" element={<ProjectPage />} />
            <Route
              path="/finance/payment/detail"
              element={<PaymentDetailPage />}
            />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/hr/employees" element={<HREmployeePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/access-control/roles" element={<RolesPage />} />
            <Route path="/access-control/users" element={<UsersPage />} />
          </Routes>
        </main>
      </div>
    </div>
    </AuthProvider>
  );
}

export default App;
