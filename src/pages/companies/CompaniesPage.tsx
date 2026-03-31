import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api, { extractData } from '../../services/api';
import type { Company } from '../../types';
import { EntityStatus } from '../../types';

const { Title } = Typography;

const statusColors: Record<string, string> = { active: 'green', inactive: 'default', suspended: 'orange', blocked: 'red' };

export default function CompaniesPage() {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form] = Form.useForm();

  const fetch = () => {
    setLoading(true);
    api
      .get('/companies')
      .then((r) => setData(extractData<Company>(r)))
      .catch(() => {
        setData([
          { id: '1', name: 'СталФед', status: EntityStatus.ACTIVE, created_at: '2025-01-01', updated_at: '2025-01-01' },
          { id: '2', name: 'МеталТрейд', status: EntityStatus.ACTIVE, created_at: '2025-03-01', updated_at: '2025-03-01' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (r: Company) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      if (editing) { await api.put(`/companies/${editing.id}`, values); }
      else { await api.post('/companies', values); }
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

  const columns: ColumnsType<Company> = [
    { title: 'Название', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
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
        <Title level={4}>Компании</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Создать</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal title={editing ? 'Редактировать компанию' : 'Новая компания'} open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)} okText="Сохранить" cancelText="Отмена">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="status" label="Статус" initialValue="active">
            <Select options={Object.values(EntityStatus).map((s) => ({ label: s, value: s }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
