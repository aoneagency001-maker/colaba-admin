import { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Typography, Modal, InputNumber, Form, message } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api, { extractData } from '../../services/api';
import type { Customer } from '../../types';
import { EntityStatus } from '../../types';

const { Title } = Typography;

const formatMoney = (v: number) =>
  new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(v) + ' тг';

const statusColors: Record<string, string> = { active: 'green', inactive: 'default', suspended: 'orange', blocked: 'red' };

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustCustomer, setAdjustCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  const fetch = () => {
    setLoading(true);
    api
      .get('/customers')
      .then((r) => setData(extractData<Customer>(r)))
      .catch(() => {
        setData([
          { id: '1', user_id: '10', name: 'Ержан Покупатель', phone: '+77011112233', referral_code: 'ERZ001', bonus_balance: 15400, status: EntityStatus.ACTIVE, created_at: '2025-01-15', updated_at: '2025-06-01' },
          { id: '2', user_id: '11', name: 'Динара Клиент', phone: '+77022223344', referral_code: 'DIN002', bonus_balance: 8700, status: EntityStatus.ACTIVE, created_at: '2025-02-20', updated_at: '2025-06-10' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdjust = (c: Customer) => { setAdjustCustomer(c); form.resetFields(); setAdjustOpen(true); };

  const handleAdjust = async () => {
    const values = await form.validateFields();
    try {
      await api.post(`/customers/${adjustCustomer!.id}/adjust`, values);
      message.success('Баланс скорректирован');
    } catch {
      message.info('Демо-режим: корректировка применена локально');
      setData((prev) =>
        prev.map((i) =>
          i.id === adjustCustomer!.id
            ? { ...i, bonus_balance: i.bonus_balance + (values.amount as number) }
            : i,
        ),
      );
    }
    setAdjustOpen(false);
  };

  const columns: ColumnsType<Customer> = [
    { title: 'Имя', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
    { title: 'Реферальный код', dataIndex: 'referral_code', key: 'referral_code' },
    { title: 'Бонусный баланс', dataIndex: 'bonus_balance', key: 'bonus_balance', render: (v: number) => formatMoney(v), sorter: (a, b) => a.bonus_balance - b.bonus_balance },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: 'Действия', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">Кошелек</Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => openAdjust(r)}>Корректировка</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Клиенты</Title>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal title="Ручная корректировка баланса" open={adjustOpen} onOk={handleAdjust} onCancel={() => setAdjustOpen(false)} okText="Применить" cancelText="Отмена">
        <p>Клиент: {adjustCustomer?.name}</p>
        <p>Текущий баланс: {adjustCustomer ? formatMoney(adjustCustomer.bonus_balance) : ''}</p>
        <Form form={form} layout="vertical">
          <Form.Item name="amount" label="Сумма корректировки (+ начисление, - списание)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
