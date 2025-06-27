"use client";
import { Table, Button } from "antd";

const dataSource = [
  { key: "1", title: "AI生成内容1", status: "草稿", created: "2024-06-25" },
  { key: "2", title: "AI生成内容2", status: "已发布", created: "2024-06-24" },
];

const columns = [
  { title: "内容标题", dataIndex: "title", key: "title" },
  { title: "状态", dataIndex: "status", key: "status" },
  { title: "创建时间", dataIndex: "created", key: "created" },
];

export default function ContentPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontWeight: 600, fontSize: 22 }}>内容创作</h2>
        <Button type="primary">新建内容</Button>
      </div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
} 