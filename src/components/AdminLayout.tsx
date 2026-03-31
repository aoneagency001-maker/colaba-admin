import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  TransactionOutlined,
  WalletOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Дашборд', path: '/' },
  { key: 'companies', icon: <AppstoreOutlined />, label: 'Компании', path: '/companies' },
  { key: 'stores', icon: <ShopOutlined />, label: 'Магазины', path: '/stores' },
  { key: 'users', icon: <UserOutlined />, label: 'Продавцы', path: '/users' },
  { key: 'customers', icon: <TeamOutlined />, label: 'Клиенты', path: '/customers' },
  { key: 'transactions', icon: <TransactionOutlined />, label: 'Транзакции', path: '/transactions' },
  { key: 'wallets', icon: <WalletOutlined />, label: 'Кошельки', path: '/wallets' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Настройки', path: '/settings' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin' };

  const selectedKey = menuItems.find((i) => i.path !== '/' && location.pathname.startsWith(i.path))?.key
    || (location.pathname === '/' ? 'dashboard' : 'dashboard');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenu: MenuProps['items'] = [
    { key: 'logout', icon: <LogoutOutlined />, label: 'Выйти', onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{ background: '#1a1a2e' }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Text strong style={{ color: '#fff', fontSize: collapsed ? 14 : 18 }}>
            {collapsed ? 'C' : 'Colaba-LTV'}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: '#1a1a2e' }}
          items={menuItems.map((i) => ({
            key: i.key,
            icon: i.icon,
            label: i.label,
            onClick: () => navigate(i.path),
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{user.name}</Text>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
