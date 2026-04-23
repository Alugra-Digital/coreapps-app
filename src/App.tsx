import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

const DashboardPage = lazy(() => import('@/dashboard/page'));
const InventoryPage = lazy(() => import('./inventory/page'));
const InvoicePage = lazy(() => import('./invoice/page'));
const InvoiceCreatePage = lazy(() => import('./invoice/InvoiceCreatePage'));
const ProfilePage = lazy(() => import('./profile/page'));
const LoginPage = lazy(() => import('./login/page'));
const SalesPage = lazy(() => import('./sales/page'));
const ModalPage = lazy(() => import('./modal/page'));
const HREmployeePage = lazy(() => import('./hr/employees/page'));
const EmployeeDetailPage = lazy(() => import('./hr/employees/detail/page'));
const EmployeeFormPage = lazy(() => import('./hr/employees/form/page'));
const HRPositionsPage = lazy(() => import('./hr/positions/page'));
const PositionFormPage = lazy(() => import('./hr/positions/form/page'));
const HRLeavePage = lazy(() => import('./hr/leave/page'));
const HRAttendancePage = lazy(() => import('./hr/attendance/page'));
const HRLoansPage = lazy(() => import('./hr/loans/page'));
const HRPayrollPage = lazy(() => import('./hr/payroll/page'));
const CRMPage = lazy(() => import('./crm/page'));
const ManufacturingPage = lazy(() => import('./manufacturing/page'));
const KasKecilPage = lazy(() => import('./finance/kas-kecil/page'));
const KasBankPage = lazy(() => import('./finance/kas-bank/page'));
const CatatanPengeluaranPage = lazy(() => import('./finance/catatan-pengeluaran/page'));
const JurnalMemorialPage = lazy(() => import('./finance/jurnal-memorial/page'));
const VouchersPage = lazy(() => import('./finance/vouchers/page'));
const AssetsPage = lazy(() => import('./finance/assets/page'));
const AssetFormPage = lazy(() => import('./finance/assets/form/page'));
const AssetDetailPage = lazy(() => import('./finance/assets/detail/page'));
const AssetAcquisitionJournalsPage = lazy(() => import('./finance/asset-acquisition-journals/page'));
const AssetDepreciationJournalsPage = lazy(() => import('./finance/asset-depreciation-journals/page'));
const VoucherFormPage = lazy(() => import('./finance/vouchers/form/page'));
const VoucherDetailPage = lazy(() => import('./finance/vouchers/detail/page'));
const PurchaseOrderPage = lazy(() => import('./finance/purchase-orders/page'));
const PurchaseOrderDetailPage = lazy(() => import('./finance/purchase-orders/detail/page'));
const PurchaseOrderFormPage = lazy(() => import('./finance/purchase-orders/form/page'));
const ClientsPage = lazy(() => import('./finance/clients/page'));
const ClientDetailPage = lazy(() => import('./finance/clients/detail/page'));
const ClientFormPage = lazy(() => import('./finance/clients/form/page'));
const BASTPage = lazy(() => import('./finance/bast/page'));
const PerpajakanPage = lazy(() => import('./finance/perpajakan/page'));
const QuotationsPage = lazy(() => import('./finance/quotations/page'));
const ProposalPenawaranPage = lazy(() => import('./finance/proposal-penawaran/page'));
const NewTransactionPage = lazy(() => import('./finance/new-transaction/page'));
const BukuBesarPage = lazy(() => import('./finance/buku-besar/page'));
const AccountingPeriodsPage = lazy(() => import('./finance/accounting-periods/page'));
const NeracaSaldoPage = lazy(() => import('./finance/neraca-saldo/page'));
const AuditPage = lazy(() => import('./finance/audit/page'));
const MasterAccountPage = lazy(() => import('./finance/master-account/page'));
const ProjectPage = lazy(() => import('./project/page'));
const ProjectDetailPage = lazy(() => import('./project/detail/page'));
const ProjectFormPage = lazy(() => import('./project/form/page'));
const InventoryFormPage = lazy(() => import('./inventory/form/page'));
const ProposalPenawaranFormPage = lazy(() => import('./finance/proposal-penawaran/form/page'));
const RolesPage = lazy(() => import('./access-control/roles/page'));
const UsersPage = lazy(() => import('./access-control/users/page'));
const AccessRolesPage = lazy(() => import('./access-control/access-roles/page'));
const ModalSamplesPage = lazy(() => import('./components-ui/modal/page'));
const LoaderSamplesPage = lazy(() => import('./components-ui/loader/page'));
const RoleAccessPage = lazy(() => import('./components-ui/role-access/page'));
const SettingsPage = lazy(() => import('./settings/page'));
const NotificationsPage = lazy(() => import('./notifications/page'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage').then(m => ({ default: m.PlaceholderPage })));

function PageLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[200px]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

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
        <Suspense fallback={<PageLoader />}>
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
              <Route path='/finance/catatan-pengeluaran' element={<CatatanPengeluaranPage />} />
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
              <Route path='/finance/accounting-periods' element={<AccountingPeriodsPage />} />
              <Route path='/finance/buku-besar' element={<BukuBesarPage />} />
              <Route path='/finance/neraca-saldo' element={<NeracaSaldoPage />} />
              <Route path='/finance/audit' element={<AuditPage />} />
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
              <Route path='/hr/leave' element={<HRLeavePage />} />
              <Route path='/hr/attendance' element={<HRAttendancePage />} />
              <Route path='/hr/loans' element={<HRLoansPage />} />
              <Route path='/hr/payroll' element={<HRPayrollPage />} />
              <Route path='/crm' element={<CRMPage />} />
              <Route path='/manufacturing' element={<ManufacturingPage />} />
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
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
