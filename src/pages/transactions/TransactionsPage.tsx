import { useEffect, useState } from 'react';
import { Table, Tag, Typography, Select, DatePicker, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import api from '../../services/api';
import type { Transaction } from '../../types';
import { TransactionType, TransactionStatus } from '../../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const formatMoney = (v: number) =>
  new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(v) + ' тг';

const typeColors: Record<string, string> = {
  accrual: 'green', redemption: 'orange', transfer: 'blue',
  adjustment: 'purple', refund: 'magenta', expiration: 'default',
};
const statusColors: Record<string, string> = {
  pending: 'processing', completed: 'success', failed: 'error', cancelled: 'default', held: 'warning',
};

export default function TransactionsPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const fetch = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (typeFilter) params.type = typeFilter;
    if (statusFilter) params.status = statusFilter;
    if (dateRange) {
      params.from = dateRange[0].toISOString();
      params.to = dateRange[1].toISOString();
    }
    api
      .get('/transactions', { params })
      .then((r) => setData(r.data.data || r.data))
      .catch(() => {
        setData([
          { id: 'txn-001', type: TransactionType.ACCRUAL, amount: 5200, currency: 'KZT', source_wallet_id: null, target_wallet_id: 'w-1', status: TransactionStatus.COMPLETED, idempotency_key: 'idem-001', meta: {}, created_at: '2025-06-01T10:00:00Z', updated_at: '2025-06-01T10:00:00Z' },
          { id: 'txn-002', type: TransactionType.REDEMPTION, amount: 2000, currency: 'KZT', source_wallet_id: 'w-1', target_wallet_id: 'w-2', status: TransactionStatus.COMPLETED, idempotency_key: 'idem-002', meta: {}, created_at: '2025-06-02T14:30:00Z', updated_at: '2025-06-02T14:30:00Z' },
          { id: 'txn-003', type: TransactionType.ADJUSTMENT, amount: 180, currency: 'KZT', source_wallet_id: 'w-2', target_wallet_id: 'w-sys', status: TransactionStatus.PENDING, idempotency_key: 'idem-003', meta: {}, created_at: '2025-06-03T09:15:00Z', updated_at: '2025-06-03T09:15:00Z' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [typeFilter, statusFilter, dateRange]);

  const columns: ColumnsType<Transaction> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (id: string) => id.slice(0, 12) },
    { title: 'Тип', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={typeColors[t]}>{t}</Tag> },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', render: (v: number) => formatMoney(v), sorter: (a, b) => a.amount - b.amount },
    { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
    { title: 'Кошелек-источник', dataIndex: 'source_wallet_id', key: 'source_wallet_id', render: (v: string | null) => v || '-' },
    { title: 'Кошелек-получатель', dataIndex: 'target_wallet_id', key: 'target_wallet_id', render: (v: string | null) => v || '-' },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: 'Ключ идемпотентности', dataIndex: 'idempotency_key', key: 'idempotency_key', ellipsis: true },
    { title: 'Дата', dataIndex: 'created_at', key: 'created_at', render: (d: string) => dayjs(d).format('DD.MM.YYYY HH:mm'), sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix() },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Транзакции</Title>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          allowClear placeholder="Тип" style={{ width: 180 }}
          value={typeFilter} onChange={setTypeFilter}
          options={Object.values(TransactionType).map((t) => ({ label: t, value: t }))}
        />
        <Select
          allowClear placeholder="Статус" style={{ width: 180 }}
          value={statusFilter} onChange={setStatusFilter}
          options={Object.values(TransactionStatus).map((s) => ({ label: s, value: s }))}
        />
        <RangePicker
          onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
        />
      </Space>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} scroll={{ x: 1200 }} />
    </div>
  );
}
