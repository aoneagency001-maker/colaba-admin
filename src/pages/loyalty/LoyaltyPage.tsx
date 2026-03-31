import { useState } from 'react';
import { Card, Form, InputNumber, Button, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface LoyaltyRule {
  id: string;
  name: string;
  cashback_percent: number;
  min_purchase: number;
  max_cashback_amount: number;
  expiration_days: number;
  status: string;
}

const initialRules: LoyaltyRule[] = [
  { id: '1', name: 'Базовый кешбэк', cashback_percent: 5, min_purchase: 1000, max_cashback_amount: 50000, expiration_days: 365, status: 'active' },
  { id: '2', name: 'Премиум кешбэк', cashback_percent: 10, min_purchase: 5000, max_cashback_amount: 100000, expiration_days: 180, status: 'active' },
];

const columns: ColumnsType<LoyaltyRule> = [
  { title: 'Название', dataIndex: 'name', key: 'name' },
  { title: 'Кешбэк %', dataIndex: 'cashback_percent', key: 'cashback_percent', render: (v: number) => `${v}%` },
  { title: 'Мин. покупка', dataIndex: 'min_purchase', key: 'min_purchase', render: (v: number) => `${v.toLocaleString('ru-RU')} тг` },
  { title: 'Макс. кешбэк', dataIndex: 'max_cashback_amount', key: 'max_cashback_amount', render: (v: number) => `${v.toLocaleString('ru-RU')} тг` },
  { title: 'Срок (дни)', dataIndex: 'expiration_days', key: 'expiration_days' },
  { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
];

export default function LoyaltyPage() {
  const [rules, setRules] = useState<LoyaltyRule[]>(initialRules);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newRule: LoyaltyRule = {
        id: String(Date.now()),
        name: `Правило #${rules.length + 1}`,
        ...values,
        status: 'active',
      };
      setRules((prev) => [...prev, newRule]);
      form.resetFields();
      message.success('Правило добавлено (демо-режим)');
    });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Правила лояльности</Title>

      <Card title="Новое правило" style={{ marginBottom: 24, maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ cashback_percent: 5, min_purchase: 1000, max_cashback_amount: 50000, expiration_days: 365 }}
        >
          <Form.Item name="cashback_percent" label="Процент кешбэка" rules={[{ required: true }]}>
            <InputNumber min={0.1} max={100} step={0.5} style={{ width: '100%' }} addonAfter="%" />
          </Form.Item>
          <Form.Item name="min_purchase" label="Мин. сумма покупки" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="тг" />
          </Form.Item>
          <Form.Item name="max_cashback_amount" label="Макс. сумма кешбэка" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="тг" />
          </Form.Item>
          <Form.Item name="expiration_days" label="Срок действия (дни)" rules={[{ required: true }]}>
            <InputNumber min={1} max={3650} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleAdd}>Добавить правило</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Текущие правила">
        <Table columns={columns} dataSource={rules} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
}
