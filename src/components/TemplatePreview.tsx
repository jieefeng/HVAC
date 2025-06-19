import React from "react";
import { Modal, Row, Col, Card, Spin } from "antd";
import { Template, ComponentConfig } from "../store/templateStore";
import { useHVACStore } from "../store/hvacStore";
import {
  TemperatureChart,
  HumidityChart,
  AirFlowChart,
  EnergyConsumptionChart,
  SystemStatusChart,
  PressureChart,
} from "./charts";
import { WeatherWidget, AlertPanel, RealTimeData } from "./widgets";

interface TemplatePreviewProps {
  template: Template | null;
  visible: boolean;
  onClose: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  visible,
  onClose,
}) => {
  const { hvacData, isLoading } = useHVACStore();

  const renderComponent = (component: ComponentConfig) => {
    const commonProps = {
      data: hvacData,
      loading: isLoading,
      key: component.id,
    };

    switch (component.type) {
      case "temperature":
        return <TemperatureChart {...commonProps} />;
      case "humidity":
        return <HumidityChart {...commonProps} />;
      case "energy":
        return <EnergyConsumptionChart {...commonProps} />;
      case "airflow":
        return <AirFlowChart {...commonProps} />;
      case "pressure":
        return <PressureChart {...commonProps} />;
      case "status":
        return <SystemStatusChart {...commonProps} />;
      case "weather":
        return <WeatherWidget key={component.id} />;
      case "alerts":
        return (
          <AlertPanel key={component.id} alerts={hvacData?.alerts || []} />
        );
      case "realtime":
        return <RealTimeData key={component.id} data={hvacData} />;
      default:
        return (
          <Card title={component.title} style={{ height: 300 }}>
            <div
              style={{
                color: "#999",
                textAlign: "center",
                paddingTop: "100px",
              }}
            >
              组件类型: {component.type}
            </div>
          </Card>
        );
    }
  };

  const getGridLayout = (components: ComponentConfig[]) => {
    // 简化的网格布局，按组件位置排序
    const sortedComponents = [...components]
      .filter((c) => c.visible)
      .sort(
        (a, b) => a.position.y - b.position.y || a.position.x - b.position.x
      );

    return (
      <Row gutter={[16, 16]}>
        {sortedComponents.map((component) => (
          <Col
            key={component.id}
            span={Math.min(24, Math.max(6, component.position.w))}
          >
            {renderComponent(component)}
          </Col>
        ))}
      </Row>
    );
  };

  const getFlexLayout = (components: ComponentConfig[]) => {
    const visibleComponents = components.filter((c) => c.visible);

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {visibleComponents.map((component) => (
          <div
            key={component.id}
            style={{
              flex: component.position.w > 6 ? "1 1 100%" : "1 1 45%",
              minWidth: "300px",
            }}
          >
            {renderComponent(component)}
          </div>
        ))}
      </div>
    );
  };

  const getCustomLayout = (components: ComponentConfig[]) => {
    const visibleComponents = components.filter((c) => c.visible);

    return (
      <div style={{ position: "relative", minHeight: "600px" }}>
        {visibleComponents.map((component) => (
          <div
            key={component.id}
            style={{
              position: "absolute",
              left: `${(component.position.x / 12) * 100}%`,
              top: `${component.position.y * 60}px`,
              width: `${(component.position.w / 12) * 100}%`,
              height: `${component.position.h * 60}px`,
              minHeight: "200px",
            }}
          >
            {renderComponent(component)}
          </div>
        ))}
      </div>
    );
  };

  const renderLayout = () => {
    if (!template) return null;

    const { layout, components } = template.config;

    switch (layout) {
      case "grid":
        return getGridLayout(components);
      case "flex":
        return getFlexLayout(components);
      case "custom":
        return getCustomLayout(components);
      default:
        return getGridLayout(components);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>{template?.preview}</span>
          <span>模板预览 - {template?.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ top: 20 }}
      footer={null}
      bodyStyle={{
        padding: "24px",
        backgroundColor:
          template?.config.theme.backgroundColor || "rgba(0, 0, 0, 0.8)",
        color: template?.config.theme.textColor || "#ffffff",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px", color: "#999" }}>
            正在加载数据...
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{ margin: 0, color: template?.config.theme.primaryColor }}
            >
              {template?.description}
            </h3>
            <div style={{ marginTop: "8px", fontSize: "14px", color: "#999" }}>
              布局模式: {template?.config.layout} | 刷新间隔:{" "}
              {template?.config.refreshInterval}ms | 数据源:{" "}
              {template?.config.dataSource}
            </div>
          </div>

          <div
            style={
              {
                "--primary-color": template?.config.theme.primaryColor,
              } as React.CSSProperties
            }
          >
            {renderLayout()}
          </div>
        </>
      )}
    </Modal>
  );
};

export default TemplatePreview;
