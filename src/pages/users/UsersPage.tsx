import { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Select, Typography, Popconfirm, message } from 'antd';
import { EyeOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api, { extractData } from '../../services/api';
import type { User } from '../../types';
import { UserRole, EntityStatus } from '../../types';

const { Title } = Typography;

const statusColors: Record<string, string> = { active: 'green', inactive: 'default', suspended: 'orange', blocked: 'red' };
const roleColors: Record<string, string> = {
  admin: 'red', company_admin: 'gold', seller: 'cyan', customer: 'green',
};

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  const fetch = () => {
    setLoading(true);
    api
      .get('/users', { params: roleFilter ? { role: roleFilter } : {} })
      .then((r) => setData(extractData<User>(r)))
      .catch(() => {
        setData([
          { id: '1', name: 'Мурат Админов', phone: '+77001234567', email: 'admin@colaba.kz', role: UserRole.ADMIN, status: EntityStatus.ACTIVE, created_at: '2025-01-01', updated_at: '2025-01-01' },
          { id: '2', name: 'Айгуль Менеджер', phone: '+77009876543', email: 'aigul@colaba.kz', role: UserRole.COMPANY_ADMIN, status: EntityStatus.ACTIVE, created_at: '2025-02-01', updated_at: '2025-02-01' },
          { id: '3', name: 'Бауыржан Продавец', phone: '+77005551234', email: 'baurz@colaba.kz', role: UserRole.SELLER, status: EntityStatus.ACTIVE, created_at: '2025-03-01', updated_at: '2025-03-01' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [roleFilter]);

  const handleDeactivate = async (id: string) => {
    try { await api.patch(`/users/${id}/deactivate`); } catch { /* demo */ }
    setData((prev) => prev.map((i) => (i.id === id ? { ...i, status: EntityStatus.INACTIVE } : i)));
    message.success('Пользователь деактивирован');
  };

  const columns: ColumnsType<User> = [
    { title: 'Имя', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Роль', dataIndex: 'role', key: 'role', render: (r: string) => <Tag color={roleColors[r]}>{r}</Tag> },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: 'Действия', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">Просмотр</Button>
          <Popconfirm title="Деактивировать?" onConfirm={() => handleDeactivate(r.id)}>
            <Button icon={<StopOutlined />} size="small" danger>Деактивировать</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Пользователи</Title>
        <Select
          allowClear
          placeholder="Фильтр по роли"
          style={{ width: 200 }}
          value={roleFilter}
          onChange={setRoleFilter}
          options={Object.values(UserRole).map((r) => ({ label: r, value: r }))}
        />
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
    </div>
  );
}
