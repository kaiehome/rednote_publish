'use client';
import { Card, Row, Col, Statistic, Progress, Avatar, Skeleton } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  EditOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDashboardSummary, onDataChange, DashboardSummary } from "../utils/dataManager";

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
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    // 模拟加载延迟，然后获取真实数据
    setTimeout(() => {
      const data = getDashboardSummary();
      setSummary(data);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    loadData();
    
    // 监听数据变化，实时更新仪表盘
    const unsubscribe = onDataChange(() => {
      const data = getDashboardSummary();
      setSummary(data);
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 24 }}>仪表盘</h2>
      <Row gutter={24}>
        {statMeta.map((item, idx) => {
          const value = summary ? (summary as any)[item.percentKey] ?? 0 : 0;
          const trend = summary ? (summary as any)[item.trendKey] ?? [] : [];
          // 创建简单的SVG趋势图
          const createTrendChart = (data: number[], color: string) => {
            if (!data || data.length === 0) return null;
            
            const width = 200;
            const height = 32;
            const padding = 4;
            const maxValue = Math.max(...data);
            const minValue = Math.min(...data);
            const range = maxValue - minValue || 1;
            
            // 生成路径点
            const points = data.map((value, index) => {
              const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
              const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
              return `${x},${y}`;
            }).join(' ');
            
            // 生成面积路径
            const areaPath = `M ${padding},${height - padding} L ${points.split(' ').map(p => p).join(' L ')} L ${width - padding},${height - padding} Z`;
            
            return (
              <svg width={width} height={height} style={{ display: 'block' }}>
                <defs>
                  <linearGradient id={`gradient-${item.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d={areaPath}
                  fill={`url(#gradient-${item.key})`}
                  stroke="none"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            );
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
                  {loading ? (
                    <Skeleton.Input active size="small" style={{ width: '100%' }} />
                  ) : trend && trend.length > 0 ? (
                    createTrendChart(trend, item.trendColor)
                  ) : (
                    <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 12 }}>
                      暂无趋势数据
                    </div>
                  )}
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