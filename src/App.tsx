import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import DashboardPage from '@/dashboard/page';
import InventoryPage from './inventory/page';
import InvoicePage from './invoice/page';
import InvoiceCreatePage from './invoice/InvoiceCreatePage';
import ProfilePage from './profile/page';
import LoginPage from './login/page';
import SalesPage from './sales/page';
import ModalPage from './modal/page';
import HREmployeePage from './hr/employees/page';
import EmployeeDetailPage from './hr/employees/detail/page';
import EmployeeFormPage from './hr/employees/form/page';
import HRPositionsPage from './hr/positions/page';
import PositionFormPage from './hr/positions/form/page';
import KasKecilPage from './finance/kas-kecil/page';
import KasBankPage from './finance/kas-bank/page';
import JurnalMemorialPage from './finance/jurnal-memorial/page';
import VouchersPage from './finance/vouchers/page';
import AssetsPage from './finance/assets/page';
import AssetFormPage from './finance/assets/form/page';
import AssetDetailPage from './finance/assets/detail/page';
import AssetAcquisitionJournalsPage from './finance/asset-acquisition-journals/page';
import AssetDepreciationJournalsPage from './finance/asset-depreciation-journals/page';
import VoucherFormPage from './finance/vouchers/form/page';
import VoucherDetailPage from './finance/vouchers/detail/page';
import PurchaseOrderPage from './finance/purchase-orders/page';
import PurchaseOrderDetailPage from './finance/purchase-orders/detail/page';
import PurchaseOrderFormPage from './finance/purchase-orders/form/page';
import ClientsPage from './finance/clients/page';
import ClientDetailPage from './finance/clients/detail/page';
import ClientFormPage from './finance/clients/form/page';
import BASTPage from './finance/bast/page';
import PerpajakanPage from './finance/perpajakan/page';
import QuotationsPage from './finance/quotations/page';
import ProposalPenawaranPage from './finance/proposal-penawaran/page';
import NewTransactionPage from './finance/new-transaction/page';
import BukuBesarPage from './finance/buku-besar/page';
import NeracaSaldoPage from './finance/neraca-saldo/page';
import MasterAccountPage from './finance/master-account/page';
import ProjectPage from './project/page';
import ProjectDetailPage from './project/detail/page';
import ProjectFormPage from './project/form/page';
import InventoryFormPage from './inventory/form/page';
import ProposalPenawaranFormPage from './finance/proposal-penawaran/form/page';
import RolesPage from './access-control/roles/page';
import UsersPage from './access-control/users/page';
import AccessRolesPage from './access-control/access-roles/page';
import ModalSamplesPage from './components-ui/modal/page';
import LoaderSamplesPage from './components-ui/loader/page';
import RoleAccessPage from './components-ui/role-access/page';
import SettingsPage from './settings/page';
import NotificationsPage from './notifications/page';
import { PlaceholderPage } from './pages/PlaceholderPage';

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
              <Route path='/finance/invoice' element={<InvoicePage />} />
              <Route
                path='/finance/invoice/create'
                element={<InvoiceCreatePage />}
              />
              <Route path='/finance/vouchers' element={<VouchersPage />} />
              <Route path='/finance/vouchers/create' element={<VoucherFormPage />} />
              <Route path='/finance/vouchers/:id' element={<VoucherDetailPage />} />
              <Route path='/finance/vouchers/:id/edit' element={<VoucherFormPage />} />
              <Route path='/finance/assets' element={<AssetsPage />} />
              <Route path='/finance/assets/create' element={<AssetFormPage />} />
              <Route path='/finance/assets/:id' element={<AssetDetailPage />} />
              <Route path='/finance/assets/:id/edit' element={<AssetFormPage />} />
              <Route path='/finance/asset-acquisition-journals' element={<AssetAcquisitionJournalsPage />} />
              <Route path='/finance/asset-depreciation-journals' element={<AssetDepreciationJournalsPage />} />
              <Route path='/finance/catatan-pengeluaran' element={<Navigate to='/finance/kas-kecil' replace />} />
              <Route path='/finance/kas-kecil' element={<KasKecilPage />} />
              <Route path='/finance/kas-bank' element={<KasBankPage />} />
              <Route path='/finance/jurnal-memorial' element={<JurnalMemorialPage />} />
              <Route path='/finance/purchase-orders' element={<PurchaseOrderPage />} />
              <Route path='/finance/purchase-orders/create' element={<PurchaseOrderFormPage />} />
              <Route path='/finance/purchase-orders/:id' element={<PurchaseOrderDetailPage />} />
              <Route path='/finance/purchase-orders/:id/edit' element={<PurchaseOrderFormPage />} />
              <Route path='/finance/clients' element={<ClientsPage />} />
              <Route path='/finance/clients/create' element={<ClientFormPage />} />
              <Route path='/finance/clients/:id' element={<ClientDetailPage />} />
              <Route path='/finance/clients/:id/edit' element={<ClientFormPage />} />
              <Route path='/finance/quotations' element={<QuotationsPage />} />
              <Route
                path='/finance/new-transaction'
                element={<NewTransactionPage />}
              />
              <Route
                path='/finance/proposal-penawaran'
                element={<ProposalPenawaranPage />}
              />
              <Route path='/finance/proposal-penawaran/create' element={<ProposalPenawaranFormPage />} />
              <Route path='/finance/proposal-penawaran/:id/edit' element={<ProposalPenawaranFormPage />} />
              <Route path='/finance/perpajakan' element={<PerpajakanPage />} />
              <Route path='/finance/bast' element={<BASTPage />} />
              <Route path='/finance/buku-besar' element={<BukuBesarPage />} />
              <Route path='/finance/neraca-saldo' element={<NeracaSaldoPage />} />
              <Route path='/finance/master-account' element={<MasterAccountPage />} />
              <Route path='/projects' element={<ProjectPage />} />
              <Route path='/projects/create' element={<ProjectFormPage />} />
              <Route path='/projects/:id' element={<ProjectDetailPage />} />
              <Route path='/projects/:id/edit' element={<ProjectFormPage />} />
              <Route path='/inventory' element={<InventoryPage />} />
              <Route path='/inventory/create' element={<InventoryFormPage />} />
              <Route path='/inventory/:id/edit' element={<InventoryFormPage />} />
              <Route path='/hr/employees' element={<HREmployeePage />} />
              <Route path='/hr/employees/create' element={<EmployeeFormPage />} />
              <Route path='/hr/employees/:id' element={<EmployeeDetailPage />} />
              <Route path='/hr/employees/:id/edit' element={<EmployeeFormPage />} />
              <Route path='/hr/positions' element={<HRPositionsPage />} />
              <Route path='/hr/positions/create' element={<PositionFormPage />} />
              <Route path='/hr/positions/:id/edit' element={<PositionFormPage />} />
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
              <Route path='/notifications' element={<NotificationsPage />} />
              <Route path='/feedback' element={<PlaceholderPage title="Feedback" description="Submit and manage user feedback." />} />
              <Route path='/help' element={<PlaceholderPage title="Help & Support" description="Access help documentation and support resources." />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
