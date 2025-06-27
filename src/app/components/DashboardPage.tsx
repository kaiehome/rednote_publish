'use client';
import { Card, Row, Col, Statistic, Progress, Avatar, Skeleton } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  EditOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/plots";
import { useEffect, useState } from "react";
import axios from "axios";

const statMeta = [
  {
    title: "今日发布",
    icon: <FileTextOutlined style={{ color: '#1890ff', fontSize: 32 }} />,
    color: '#e6f7ff',
    percentKey: "today_publish",
    trendKey: "trend_today_publish",
    key: 'dashboard',
    suffix: "篇",
    trendColor: '#1890ff',
  },
  {
    title: "账号总数",
    icon: <UserOutlined style={{ color: '#52c41a', fontSize: 32 }} />,
    color: '#f6ffed',
    percentKey: "account_total",
    trendKey: "trend_account_total",
    key: 'account',
    suffix: "个",
    trendColor: '#52c41a',
  },
  {
    title: "内容创作",
    icon: <EditOutlined style={{ color: '#faad14', fontSize: 32 }} />,
    color: '#fffbe6',
    percentKey: "content_total",
    trendKey: "trend_content_total",
    key: 'content',
    suffix: "条",
    trendColor: '#faad14',
  },
  {
    title: "数据分析",
    icon: <BarChartOutlined style={{ color: '#eb2f96', fontSize: 32 }} />,
    color: '#fff0f6',
    percentKey: "report_total",
    trendKey: "trend_report_total",
    key: 'data',
    suffix: "报表",
    trendColor: '#eb2f96',
  },
];

// 新增props类型声明
interface DashboardPageProps {
  onCardClick?: (key: string) => void;
}

export default function DashboardPage({ onCardClick }: DashboardPageProps) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/dashboard/summary").then(res => {
      setSummary(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 24 }}>仪表盘</h2>
      <Row gutter={24}>
        {statMeta.map((item, idx) => {
          const value = summary?.[item.percentKey] ?? 0;
          const trend = summary?.[item.trendKey] ?? [];
          const areaData = trend.map((y: number, i: number) => ({ x: i + 1, y }));
          const areaConfig = {
            data: areaData,
            xField: 'x',
            yField: 'y',
            height: 32,
            smooth: true,
            color: item.trendColor,
            areaStyle: { fill: item.trendColor, opacity: 0.15 },
            line: { color: item.trendColor, size: 2 },
            xAxis: { visible: false },
            yAxis: { visible: false },
            legend: false,
            tooltip: false,
            animation: true,
            padding: [0, 0, 0, 0],
          };
          // 卡片可点击，鼠标悬停高亮
          return (
            <Col span={6} key={item.title}>
              <Card
                onClick={() => onCardClick && onCardClick(item.key)}
                hoverable
                styles={{ body: { display: "flex", flexDirection: "column", justifyContent: "center", height: 180 } }}
                style={{
                  borderRadius: 12,
                  background: item.color,
                  boxShadow: "0 2px 8px #f0f1f2",
                  minHeight: 180,
                  cursor: onCardClick ? 'pointer' : 'default',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar
                    size={56}
                    style={{ background: "#fff", boxShadow: "0 1px 4px #eee" }}
                    icon={item.icon}
                  />
                  <div style={{ flex: 1 }}>
                    {loading ? <Skeleton.Input active size="large" style={{ width: 80 }} /> : (
                      <Statistic
                        title={<span style={{ fontSize: 16 }}>{item.title}</span>}
                        value={value}
                        valueStyle={{ fontSize: 28, fontWeight: 700 }}
                        suffix={item.suffix}
                      />
                    )}
                    <div style={{ marginTop: 8 }}>
                      <Progress
                        percent={value * 10}
                        size="small"
                        strokeColor={item.icon.props.style.color}
                        showInfo={false}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  {loading ? <Skeleton.Input active size="small" style={{ width: '100%' }} /> : <Area {...areaConfig} />}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div style={{ marginTop: 32 }}>
        <Card>
          <h3>欢迎使用小红书矩阵AI运营平台！</h3>
          <p>这里可以快速查看平台数据总览和各项核心指标。</p>
        </Card>
      </div>
    </div>
  );
} 