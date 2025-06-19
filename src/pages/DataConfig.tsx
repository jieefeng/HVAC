import React from "react";
import { Card, Form, Input, Select, Button, Switch, Row, Col } from "antd";
import {
  DatabaseOutlined,
  LinkOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const DataConfig: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ color: "#fff", marginBottom: "24px" }}>数据源配置</h1>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title={
              <>
                <DatabaseOutlined /> 数据源设置
              </>
            }
          >
            <Form layout="vertical">
              <Form.Item label="数据源类型">
                <Select defaultValue="websocket">
                  <Option value="websocket">WebSocket 实时数据</Option>
                  <Option value="api">REST API</Option>
                  <Option value="database">数据库连接</Option>
                  <Option value="mock">模拟数据</Option>
                </Select>
              </Form.Item>

              <Form.Item label="连接地址">
                <Input placeholder="ws://localhost:8000/ws" />
              </Form.Item>

              <Form.Item label="更新频率(秒)">
                <Select defaultValue="5">
                  <Option value="1">1秒</Option>
                  <Option value="5">5秒</Option>
                  <Option value="10">10秒</Option>
                  <Option value="30">30秒</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<LinkOutlined />}>
                  测试连接
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <>
                <SettingOutlined /> 显示设置
              </>
            }
          >
            <Form layout="vertical">
              <Form.Item label="数据项配置">
                <div style={{ marginBottom: "8px" }}>
                  <Switch defaultChecked /> 温度监控
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <Switch defaultChecked /> 湿度监控
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <Switch defaultChecked /> 能耗分析
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <Switch defaultChecked /> 空气流量
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <Switch /> 系统压力
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <Switch /> 报警信息
                </div>
              </Form.Item>

              <Form.Item>
                <Button type="primary">保存配置</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataConfig;
