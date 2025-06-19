import React from "react";
import { Card, Button, Switch, Slider, Row, Col, Statistic } from "antd";
import { PoweroffOutlined, SettingOutlined } from "@ant-design/icons";

const HVACControl: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ color: "#fff", marginBottom: "24px" }}>HVAC 系统控制</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="系统控制" style={{ height: "300px" }}>
            <div style={{ marginBottom: "16px" }}>
              <span style={{ marginRight: "12px" }}>主电源:</span>
              <Switch defaultChecked />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <span style={{ marginRight: "12px" }}>制冷模式:</span>
              <Switch />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <span style={{ marginRight: "12px" }}>供暖模式:</span>
              <Switch />
            </div>
            <Button type="primary" icon={<SettingOutlined />} block>
              高级设置
            </Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="温度设置" style={{ height: "300px" }}>
            <div style={{ marginBottom: "24px" }}>
              <p>目标温度: 24°C</p>
              <Slider defaultValue={24} min={16} max={30} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <p>湿度设置: 50%</p>
              <Slider defaultValue={50} min={30} max={70} />
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="系统状态" style={{ height: "300px" }}>
            <Statistic title="运行时间" value="24h 32m" />
            <Statistic
              title="能效比"
              value="3.2"
              suffix="COP"
              style={{ marginTop: "16px" }}
            />
            <Statistic
              title="负载率"
              value="68"
              suffix="%"
              style={{ marginTop: "16px" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HVACControl;
