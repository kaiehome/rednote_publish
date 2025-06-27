"use client";
import { Card, Row, Col } from "antd";

export default function DataPage() {
  return (
    <div>
      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 24 }}>数据分析</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="内容发布趋势" variant="borderless">
            <div style={{ height: 80, textAlign: "center", lineHeight: "80px" }}>
              [趋势图表占位]
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="账号增长" variant="borderless">
            <div style={{ height: 80, textAlign: "center", lineHeight: "80px" }}>
              [增长图表占位]
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="互动数据" variant="borderless">
            <div style={{ height: 80, textAlign: "center", lineHeight: "80px" }}>
              [互动图表占位]
            </div>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 32 }}>
        <Card>
          <h3>数据分析说明</h3>
          <p>这里展示平台的核心数据趋势和分析结果，后续可接入图表库丰富展示。</p>
        </Card>
      </div>
    </div>
  );
} 