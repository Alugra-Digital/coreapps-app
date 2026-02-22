import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import DashboardPage from '@/dashboard/page';
import FinancePage from '@/finance/page';
import InventoryPage from './inventory/page';
import InvoicePage from './invoice/page';
import InvoiceCreatePage from './invoice/InvoiceCreatePage';
import PaymentPage from './payment/page';
import PaymentDetailPage from './detail-payment/page';
import ReportsPage from './reports/page';
import ProfilePage from './profile/page';
import LoginPage from './login/page';
import SalesPage from './sales/page';
import ModalPage from './modal/page';
import HREmployeePage from './hr/employees/page';
import HRPositionsPage from './hr/positions/page';
import PurchaseOrderPage from './finance/purchase-orders/page';
import ClientsPage from './finance/clients/page';
import VendorsPage from './finance/vendors/page';
import BASTPage from './finance/bast/page';
import PerpajakanPage from './finance/perpajakan/page';
import QuotationsPage from './finance/quotations/page';
import ProposalPenawaranPage from './finance/proposal-penawaran/page';
import NewTransactionPage from './finance/new-transaction/page';
import ProjectPage from './project/page';
import RolesPage from './access-control/roles/page';
import UsersPage from './access-control/users/page';
import AccessRolesPage from './access-control/access-roles/page';
import ModalSamplesPage from './components-ui/modal/page';
import LoaderSamplesPage from './components-ui/loader/page';
import RoleAccessPage from './components-ui/role-access/page';
import SettingsPage from './settings/page';

function AppLayout() {
  return (
    <div className='flex h-screen w-full bg-background overflow-hidden font-sans'>
      <Sidebar />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <TopBar />
        <main className='flex-1 overflow-y-auto bg-dashboard-bg transition-all'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<DashboardPage />} />
              <Route path='/finance/accounting' element={<FinancePage />} />
              <Route path='/finance/invoice' element={<InvoicePage />} />
              <Route
                path='/finance/invoice/create'
                element={<InvoiceCreatePage />}
              />
              <Route path='/finance/payment' element={<PaymentPage />} />
              <Route
                path='/finance/purchase-orders'
                element={<PurchaseOrderPage />}
              />
              <Route path='/finance/clients' element={<ClientsPage />} />
              <Route path='/finance/vendors' element={<VendorsPage />} />
              <Route path='/finance/quotations' element={<QuotationsPage />} />
              <Route
                path='/finance/new-transaction'
                element={<NewTransactionPage />}
              />
              <Route
                path='/finance/proposal-penawaran'
                element={<ProposalPenawaranPage />}
              />
              <Route path='/finance/perpajakan' element={<PerpajakanPage />} />
              <Route path='/finance/bast' element={<BASTPage />} />
              <Route path='/projects' element={<ProjectPage />} />
              <Route
                path='/finance/payment/detail'
                element={<PaymentDetailPage />}
              />
              <Route path='/inventory' element={<InventoryPage />} />
              <Route path='/hr/employees' element={<HREmployeePage />} />
              <Route path='/hr/positions' element={<HRPositionsPage />} />
              <Route path='/reports' element={<ReportsPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/sales' element={<SalesPage />} />
              <Route path='/modal' element={<ModalPage />} />
              <Route path='/access-control/roles' element={<RolesPage />} />
              <Route path='/access-control/users' element={<UsersPage />} />
              <Route
                path='/access-control/access-roles'
                element={<AccessRolesPage />}
              />
              <Route
                path='/components-ui/modal'
                element={<ModalSamplesPage />}
              />
              <Route
                path='/components-ui/loader'
                element={<LoaderSamplesPage />}
              />
              <Route
                path='components-ui/role-access'
                element={<RoleAccessPage />}
              />
              <Route path='/settings' element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
      {!import.meta.env.PROD && import.meta.env.MODE !== 'test' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
