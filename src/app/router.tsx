import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { DesignSystemPage } from '@/pages/design-system/DesignSystemPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { SupplierDetailPage } from '@/pages/suppliers/SupplierDetailPage';
import { SuppliersListPage } from '@/pages/suppliers/SuppliersListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'suppliers', element: <SuppliersListPage /> },
      { path: 'suppliers/:id', element: <SupplierDetailPage /> },
      { path: 'design-system', element: <DesignSystemPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
