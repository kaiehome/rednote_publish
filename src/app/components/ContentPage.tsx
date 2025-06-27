"use client";
import { Table, Button, message } from "antd";
import { useState, useEffect } from "react";
import { getContentData, saveContentData, ContentData } from "../utils/dataManager";

const columns = [
  { title: "内容标题", dataIndex: "title", key: "title" },
  { title: "状态", dataIndex: "status", key: "status" },
  { title: "创建时间", dataIndex: "created", key: "created" },
];

export default function ContentPage() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ContentData[]>([]);

  useEffect(() => {
    // 加载内容数据
    const data = getContentData();
    setDataSource(data);
  }, []);
  
  const handleCreateContent = () => {
    setLoading(true);
    // 模拟创建内容操作
    setTimeout(() => {
      const newContent: ContentData = {
        key: Date.now().toString(),
        title: `AI生成内容${dataSource.length + 1}`,
        status: "草稿",
        created: new Date().toISOString().slice(0, 10)
      };
      const newData = [...dataSource, newContent];
      setDataSource(newData);
      saveContentData(newData);
      message.success("内容创建成功");
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontWeight: 600, fontSize: 22 }}>内容创作</h2>
        <Button 
          type="primary" 
          onClick={handleCreateContent}
          disabled={loading}
          style={{
            width: '90px',
            opacity: loading ? 0.6 : 1,
            transition: 'opacity 0.3s'
          }}
        >
          {loading ? "创建中..." : "新建内容"}
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
} 