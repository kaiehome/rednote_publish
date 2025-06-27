"use client";
import { Card, Form, Input, Button } from "antd";

export default function SettingsPage() {
  return (
    <div>
      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 24 }}>系统设置</h2>
      <Card title="用户信息" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Form.Item label="用户名" name="username">
            <Input defaultValue="管理员" />
          </Form.Item>
          <Form.Item>
            <Button type="primary">保存</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="平台配置">
        <Form layout="vertical">
          <Form.Item label="平台名称" name="platform">
            <Input defaultValue="小红书矩阵AI运营平台" />
          </Form.Item>
          <Form.Item>
            <Button type="primary">保存</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 