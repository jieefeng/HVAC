import React from "react";
import { Card } from "antd";

const WeatherWidget: React.FC = () => {
  return (
    <Card title="天气信息" style={{ height: 400 }}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>☀️</div>
        <div style={{ color: "#fff", fontSize: "24px", marginBottom: "8px" }}>
          26°C
        </div>
        <div style={{ color: "#999", marginBottom: "16px" }}>晴朗</div>
        <div style={{ color: "#fff", fontSize: "14px" }}>
          <div>湿度: 65%</div>
          <div>风速: 12 km/h</div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
