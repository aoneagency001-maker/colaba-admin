import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import api from '../services/api';
import type { UserRole } from '../types';

const { Title, Text } = Typography;

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: { id: string; name: string; role: UserRole };
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', values);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      message.success('Вход выполнен');
      navigate('/');
    } catch {
      message.error('Неверный телефон или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Auto-login for demo — no API call needed
    localStorage.setItem('access_token', 'demo-token');
    localStorage.setItem('refresh_token', 'demo-refresh');
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 'demo', name: 'Демо Админ', role: 'super_admin' }),
    );
    message.success('Демо-вход выполнен');
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>Colaba-LTV</Title>
          <Text type="secondary">Панель администратора</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="phone" rules={[{ required: true, message: 'Введите номер телефона' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Телефон" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Войти
            </Button>
          </Form.Item>
        </Form>

        <Button type="dashed" block onClick={handleDemoLogin}>
          Демо-вход (Super Admin)
        </Button>
      </Card>
    </div>
  );
}
