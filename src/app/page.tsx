"use client";
import { Layout, Menu, theme, Spin } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  EditOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import DashboardPage from "./components/DashboardPage";
import ClientOnly from "./components/ClientOnly";

const AccountPage = dynamic(() => import("./components/AccountPage"));
const ContentPage = dynamic(() => import("./components/ContentPage"));
const DataPage = dynamic(() => import("./components/DataPage"));
const SettingsPage = dynamic(() => import("./components/SettingsPage"));

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "仪表盘" },
  { key: "account", icon: <UserOutlined />, label: "账号管理" },
  { key: "content", icon: <EditOutlined />, label: "内容创作" },
  { key: "data", icon: <BarChartOutlined />, label: "数据分析" },
  { key: "settings", icon: <SettingOutlined />, label: "系统设置" },
];

function MainApp() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  let pageContent = null;
  switch (selectedKey) {
    case "dashboard":
      pageContent = <DashboardPage onCardClick={setSelectedKey} />;
      break;
    case "account":
      pageContent = <AccountPage />;
      break;
    case "content":
      pageContent = <ContentPage />;
      break;
    case "data":
      pageContent = <DataPage />;
      break;
    case "settings":
      pageContent = <SettingsPage />;
      break;
    default:
      pageContent = <DashboardPage onCardClick={setSelectedKey} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, color: "#fff", fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
          小红书AI平台
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, textAlign: "right", paddingRight: 24 }}>
          欢迎，管理员
        </Header>
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280, background: colorBgContainer }}>
          {pageContent}
        </Content>
      </Layout>
    </Layout>
  );
}

export default function Home() {
  return (
    <ClientOnly fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <Spin size="large" />
        <span style={{ marginLeft: 16 }}>加载中...</span>
      </div>
    }>
      <MainApp />
    </ClientOnly>
  );
}
