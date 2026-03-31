import { Card, Form, InputNumber, Select, Switch, Button, Typography, message } from 'antd';

const { Title } = Typography;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then(() => {
      message.success('Настройки сохранены (демо-режим)');
    });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Настройки платформы</Title>
      <Card style={{ maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            default_currency: 'KZT',
            bonus_expiration_days: 365,
            max_bonus_payment_percent: 30,
            maintenance_mode: false,
          }}
        >
          <Form.Item name="default_currency" label="Валюта по умолчанию" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'KZT (тенге)', value: 'KZT' },
                { label: 'RUB (рубль)', value: 'RUB' },
                { label: 'USD (доллар)', value: 'USD' },
              ]}
            />
          </Form.Item>
          <Form.Item name="bonus_expiration_days" label="Срок действия бонусов (дни)" rules={[{ required: true }]}>
            <InputNumber min={1} max={3650} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="max_bonus_payment_percent" label="Макс. оплата бонусами (%)" rules={[{ required: true }]}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maintenance_mode" label="Режим обслуживания" valuePropName="checked">
            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSave}>Сохранить</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
