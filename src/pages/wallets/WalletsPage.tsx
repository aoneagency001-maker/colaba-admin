import { useEffect, useState } from 'react';
import { Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import api from '../../services/api';
import type { Wallet } from '../../types';
import { WalletType, EntityStatus } from '../../types';

const { Title } = Typography;

const formatMoney = (v: number) =>
  new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(v) + ' тг';

const walletColors: Record<string, string> = {
  bonus: 'green', deposit: 'blue', burn: 'orange', system_fee: 'red',
};
const statusColors: Record<string, string> = { active: 'green', inactive: 'default', suspended: 'orange', blocked: 'red' };

export default function WalletsPage() {
  const [data, setData] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/wallets')
      .then((r) => setData(r.data.data || r.data))
      .catch(() => {
        setData([
          { id: 'w-1', owner_type: 'customer', owner_id: '1', wallet_type: WalletType.BONUS, balance_cached: 15400, currency: 'KZT', status: EntityStatus.ACTIVE, created_at: '2025-01-01', updated_at: '2025-06-01' },
          { id: 'w-2', owner_type: 'company', owner_id: '1', wallet_type: WalletType.DEPOSIT, balance_cached: 345000, currency: 'KZT', status: EntityStatus.ACTIVE, created_at: '2025-01-01', updated_at: '2025-06-01' },
          { id: 'w-sys', owner_type: 'system', owner_id: 'sys', wallet_type: WalletType.SYSTEM_FEE, balance_cached: 12000000, currency: 'KZT', status: EntityStatus.ACTIVE, created_at: '2025-01-01', updated_at: '2025-06-01' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<Wallet> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Тип владельца', dataIndex: 'owner_type', key: 'owner_type' },
    { title: 'ID владельца', dataIndex: 'owner_id', key: 'owner_id' },
    { title: 'Тип кошелька', dataIndex: 'wallet_type', key: 'wallet_type', render: (t: string) => <Tag color={walletColors[t]}>{t}</Tag> },
    { title: 'Баланс', dataIndex: 'balance_cached', key: 'balance_cached', render: (v: number) => formatMoney(v), sorter: (a, b) => a.balance_cached - b.balance_cached },
    { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Кошельки</Title>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
    </div>
  );
}
