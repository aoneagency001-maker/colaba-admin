import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api, { extractData } from '../../services/api';
import type { Store } from '../../types';
import { EntityStatus } from '../../types';

const { Title } = Typography;

const statusColors: Record<string, string> = { active: 'green', inactive: 'default', suspended: 'orange', blocked: 'red' };

export default function StoresPage() {
  const [data, setData] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form] = Form.useForm();

  const fetch = () => {
    setLoading(true);
    api
      .get('/stores')
      .then((r) => setData(extractData<Store>(r)))
      .catch(() => {
        setData([
          { id: '1', company_id: '1', name: 'СталФед Алматы', city: 'Алматы', address: 'ул. Абая 52', status: EntityStatus.ACTIVE, created_at: '2025-01-01', updated_at: '2025-01-01' },
          { id: '2', company_id: '1', name: 'СталФед Астана', city: 'Астана', address: 'пр. Мангилик Ел 10', status: EntityStatus.ACTIVE, created_at: '2025-02-01', updated_at: '2025-02-01' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (r: Store) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      if (editing) { await api.put(`/stores/${editing.id}`, values); }
      else { await api.post('/stores', values); }
      message.success('Сохранено');
    } catch {
      message.info('Демо-режим');
      if (editing) {
        setData((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...values } : i)));
      } else {
        setData((prev) => [...prev, { ...values, id: String(Date.now()), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
      }
    }
    setModalOpen(false);
    fetch();
  };

  const columns: ColumnsType<Store> = [
    { title: 'Название', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Компания', dataIndex: 'company_id', key: 'company_id' },
    { title: 'Город', dataIndex: 'city', key: 'city' },
    { title: 'Адрес', dataIndex: 'address', key: 'address' },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: 'Действия', key: 'actions',
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)}>Изменить</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Магазины</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Создать</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal title={editing ? 'Редактировать магазин' : 'Новый магазин'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)} okText="Сохранить" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="company_id" label="ID компании" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="city" label="Город" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="address" label="Адрес" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="status" label="Статус" initialValue="active">
            <Select options={Object.values(EntityStatus).map((s) => ({ label: s, value: s }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
