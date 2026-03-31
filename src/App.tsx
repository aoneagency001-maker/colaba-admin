import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CompaniesPage from './pages/companies/CompaniesPage';
import StoresPage from './pages/stores/StoresPage';
import UsersPage from './pages/users/UsersPage';
import CustomersPage from './pages/customers/CustomersPage';
import TransactionsPage from './pages/transactions/TransactionsPage';
import WalletsPage from './pages/wallets/WalletsPage';
import AuditPage from './pages/audit/AuditPage';
import SettingsPage from './pages/settings/SettingsPage';
import LoyaltyPage from './pages/loyalty/LoyaltyPage';

dayjs.locale('ru');

// Auto-login for demo if no token exists
if (!localStorage.getItem('access_token')) {
  localStorage.setItem('access_token', 'demo-token');
  localStorage.setItem('refresh_token', 'demo-refresh');
  localStorage.setItem(
    'user',
    JSON.stringify({ id: 'demo', name: 'Демо Админ', role: 'admin' }),
  );
}

function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1a1a2e',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="wallets" element={<WalletsPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="loyalty" element={<LoyaltyPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
