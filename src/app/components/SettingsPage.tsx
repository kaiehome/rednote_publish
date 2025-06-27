"use client";
import { Card, Form, Input, Button, message } from "antd";
import { useState } from "react";

export default function SettingsPage() {
  const [loadingKey, setLoadingKey] = useState("");
  
  const handleSave = (type: string) => {
    setLoadingKey(type);
    // 模拟保存操作
    setTimeout(() => {
      message.success("保存成功");
      setLoadingKey("");
    }, 1000);
  };

  return (
    <div>
      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 24 }}>系统设置</h2>
      <Card title="用户信息" style={{ marginBottom: 24 }}>
        <Form layout="vertical" initialValues={{ username: "管理员" }}>
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              onClick={() => handleSave("user")}
              disabled={loadingKey === "user"}
              style={{
                width: '80px',
                opacity: loadingKey === "user" ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}
            >
              {loadingKey === "user" ? "保存中..." : "保存"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="平台配置">
        <Form layout="vertical" initialValues={{ platform: "小红书矩阵AI运营平台" }}>
          <Form.Item label="平台名称" name="platform">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              onClick={() => handleSave("platform")}
              disabled={loadingKey === "platform"}
              style={{
                width: '80px',
                opacity: loadingKey === "platform" ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}
            >
              {loadingKey === "platform" ? "保存中..." : "保存"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 