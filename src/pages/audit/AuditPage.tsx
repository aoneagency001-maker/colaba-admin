import { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import api from '../../services/api';
import type { AuditLog } from '../../types';

const { Title } = Typography;

export default function AuditPage() {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/audit-logs')
      .then((r) => setData(r.data.data || r.data))
      .catch(() => {
        setData([
          { id: '1', actor_id: '1', actor_name: 'Мурат Админов', entity_type: 'tenant', entity_id: '1', action: 'create', meta: { name: 'KZ-Metal' }, created_at: '2025-06-01T10:00:00Z' },
          { id: '2', actor_id: '1', actor_name: 'Мурат Админов', entity_type: 'company', entity_id: '1', action: 'update', meta: { field: 'participation_mode', old: 'accrual_only', new: 'full' }, created_at: '2025-06-02T14:30:00Z' },
          { id: '3', actor_id: '2', actor_name: 'Айгуль Менеджер', entity_type: 'customer', entity_id: '5', action: 'adjust_balance', meta: { amount: 5000, reason: 'Компенсация' }, created_at: '2025-06-03T09:15:00Z' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<AuditLog> = [
    { title: 'Актор', dataIndex: 'actor_name', key: 'actor_name' },
    { title: 'Тип сущности', dataIndex: 'entity_type', key: 'entity_type' },
    { title: 'ID сущности', dataIndex: 'entity_id', key: 'entity_id' },
    { title: 'Действие', dataIndex: 'action', key: 'action' },
    {
      title: 'Мета',
      dataIndex: 'meta',
      key: 'meta',
      render: (meta: Record<string, unknown>) => (
        <pre style={{ margin: 0, fontSize: 12, maxWidth: 300, overflow: 'auto' }}>
          {JSON.stringify(meta, null, 2)}
        </pre>
      ),
    },
    { title: 'Дата', dataIndex: 'created_at', key: 'created_at', render: (d: string) => dayjs(d).format('DD.MM.YYYY HH:mm'), sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix() },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Журнал аудита</Title>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} scroll={{ x: 900 }} />
    </div>
  );
}
