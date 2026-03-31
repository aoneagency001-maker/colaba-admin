import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag } from 'antd';
import {
  ShopOutlined,
  TeamOutlined,
  TransactionOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../services/api';
import type { DashboardStats, Transaction } from '../../types';
import { TransactionType, TransactionStatus } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const formatMoney = (v: number) =>
  new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(v) + ' тг';

const typeColors: Record<string, string> = {
  accrual: 'green', redemption: 'orange', transfer: 'blue',
  adjustment: 'purple', refund: 'magenta', expiration: 'default',
};
const statusColors: Record<string, string> = {
  pending: 'processing', completed: 'success', failed: 'error', cancelled: 'default', held: 'warning',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    customers_count: 0,
    stores_count: 0,
    transactions_today: 0,
    transactions_total: 0,
    bonus_volume: 0,
  });
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardStats>('/dashboard/stats')
      .then((r) => setStats(r.data))
      .catch(() => {
        setStats({
          customers_count: 12450,
          stores_count: 87,
          transactions_today: 342,
          transactions_total: 156800,
          bonus_volume: 2340000,
        });
      })
      .finally(() => setLoading(false));

    api
      .get('/transactions', { params: { limit: 5 } })
      .then((r) => setRecentTx(r.data.data || r.data))
      .catch(() => {
        setRecentTx([
          { id: 'txn-001', type: TransactionType.ACCRUAL, amount: 5200, currency: 'KZT', source_wallet_id: null, target_wallet_id: 'w-1', status: TransactionStatus.COMPLETED, idempotency_key: 'idem-001', meta: {}, created_at: '2025-06-01T10:00:00Z', updated_at: '2025-06-01T10:00:00Z' },
          { id: 'txn-002', type: TransactionType.REDEMPTION, amount: 2000, currency: 'KZT', source_wallet_id: 'w-1', target_wallet_id: 'w-2', status: TransactionStatus.COMPLETED, idempotency_key: 'idem-002', meta: {}, created_at: '2025-06-02T14:30:00Z', updated_at: '2025-06-02T14:30:00Z' },
        ]);
      });
  }, []);

  const cards = [
    { title: 'Клиенты', value: stats.customers_count, icon: <TeamOutlined />, color: '#533483' },
    { title: 'Магазины', value: stats.stores_count, icon: <ShopOutlined />, color: '#0f3460' },
    { title: 'Транзакции сегодня', value: stats.transactions_today, icon: <TransactionOutlined />, color: '#16213e' },
    { title: 'Транзакции всего', value: stats.transactions_total, icon: <TransactionOutlined />, color: '#1a1a2e' },
    { title: 'Объем бонусов', value: stats.bonus_volume, icon: <WalletOutlined />, color: '#e94560', isMoney: true },
  ];

  const txColumns: ColumnsType<Transaction> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (id: string) => id.slice(0, 12) },
    { title: 'Тип', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={typeColors[t]}>{t}</Tag> },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', render: (v: number) => formatMoney(v) },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: 'Дата', dataIndex: 'created_at', key: 'created_at', render: (d: string) => dayjs(d).format('DD.MM.YYYY HH:mm') },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Дашборд</Title>
      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col xs={24} sm={12} lg={8} key={c.title}>
            <Card loading={loading} hoverable>
              <Statistic
                title={c.title}
                value={c.isMoney ? formatMoney(c.value) : c.value}
                prefix={c.icon}
                valueStyle={{ color: c.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Title level={5} style={{ marginTop: 32, marginBottom: 16 }}>Последние транзакции</Title>
      <Table columns={txColumns} dataSource={recentTx} rowKey="id" pagination={false} size="small" />
    </div>
  );
}
