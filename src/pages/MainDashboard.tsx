import React, { useState, useEffect } from "react";
import { Row, Col, Card, Select, Button, Space, Switch } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import TemperatureChart from "../components/charts/TemperatureChart";
import HumidityChart from "../components/charts/HumidityChart";
import AirFlowChart from "../components/charts/AirFlowChart";
import EnergyConsumptionChart from "../components/charts/EnergyConsumptionChart";
import SystemStatusChart from "../components/charts/SystemStatusChart";
import PressureChart from "../components/charts/PressureChart";
import WeatherWidget from "../components/widgets/WeatherWidget";
import AlertPanel from "../components/widgets/AlertPanel";
import RealTimeData from "../components/widgets/RealTimeData";
import TemplateSelector from "../components/TemplateSelector";
import { useHVACStore } from "../store/hvacStore";
// import "./MainDashboard.css";

const { Option } = Select;

const MainDashboard: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [isRealTime, setIsRealTime] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const {
    hvacData,
    isLoading,
    fetchHVACData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
  } = useHVACStore();

  useEffect(() => {
    fetchHVACData();
    if (isRealTime) {
      startRealTimeUpdates(refreshInterval);
    }

    return () => {
      stopRealTimeUpdates();
    };
  }, [isRealTime, refreshInterval]);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleRealTimeToggle = (checked: boolean) => {
    setIsRealTime(checked);
    if (checked) {
      startRealTimeUpdates(refreshInterval);
    } else {
      stopRealTimeUpdates();
    }
  };

  const templateConfigs = {
    template1: {
      name: "经典监控模板",
      layout: [
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
        { component: "airflow", span: 8 },
        { component: "energy", span: 12 },
        { component: "status", span: 12 },
      ],
    },
    template2: {
      name: "能耗分析模板",
      layout: [
        { component: "energy", span: 16 },
        { component: "weather", span: 8 },
        { component: "temperature", span: 6 },
        { component: "humidity", span: 6 },
        { component: "pressure", span: 6 },
        { component: "alerts", span: 6 },
      ],
    },
    template3: {
      name: "系统状态模板",
      layout: [
        { component: "status", span: 24 },
        { component: "realtime", span: 8 },
        { component: "airflow", span: 8 },
        { component: "pressure", span: 8 },
      ],
    },
  };

  const renderComponent = (componentType: string, span: number) => {
    const commonProps = {
      data: hvacData,
      loading: isLoading,
      key: componentType,
    };

    const componentMap = {
      temperature: <TemperatureChart {...commonProps} />,
      humidity: <HumidityChart {...commonProps} />,
      airflow: <AirFlowChart {...commonProps} />,
      energy: <EnergyConsumptionChart {...commonProps} />,
      status: <SystemStatusChart {...commonProps} />,
      pressure: <PressureChart {...commonProps} />,
      weather: <WeatherWidget />,
      alerts: <AlertPanel alerts={hvacData?.alerts || []} />,
      realtime: <RealTimeData data={hvacData} />,
    };

    return (
      <Col span={span} key={componentType} className="dashboard-item">
        {componentMap[componentType as keyof typeof componentMap]}
      </Col>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <h1 style={{ color: "#fff", margin: 0 }}>HVAC 数据可视化大屏</h1>
          </Col>
          <Col>
            <Space size="large">
              <TemplateSelector
                templates={Object.keys(templateConfigs)}
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
              />
              <Space>
                <span style={{ color: "#fff" }}>实时更新:</span>
                <Switch
                  checked={isRealTime}
                  onChange={handleRealTimeToggle}
                  checkedChildren={<PlayCircleOutlined />}
                  unCheckedChildren={<PauseCircleOutlined />}
                />
              </Space>
              <Select
                value={refreshInterval}
                onChange={setRefreshInterval}
                style={{ width: 120 }}
              >
                <Option value={1000}>1秒</Option>
                <Option value={5000}>5秒</Option>
                <Option value={10000}>10秒</Option>
                <Option value={30000}>30秒</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="dashboard-content">
        <Row gutter={[16, 16]}>
          {templateConfigs[
            selectedTemplate as keyof typeof templateConfigs
          ].layout.map((item) => renderComponent(item.component, item.span))}
        </Row>
      </div>
    </div>
  );
};

export default MainDashboard;
