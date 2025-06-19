import React from "react";
import { Card, Spin, Tag } from "antd";
import { HVACData } from "../../store/hvacStore";

interface SystemStatusChartProps {
  data: HVACData | null;
  loading: boolean;
}

const SystemStatusChart: React.FC<SystemStatusChartProps> = ({
  data,
  loading,
}) => {
  if (loading || !data) {
    return (
      <Card title="系统状态" style={{ height: 400 }}>
        <Spin size="large" />
      </Card>
    );
  }

  return (
    <Card title="系统状态" style={{ height: 400 }}>
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ color: "#fff" }}>在线状态: </span>
          <Tag color={data.systemStatus.online ? "green" : "red"}>
            {data.systemStatus.online ? "在线" : "离线"}
          </Tag>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ color: "#fff" }}>运行模式: </span>
          <Tag color="blue">{data.systemStatus.mode}</Tag>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ color: "#fff" }}>系统效率: </span>
          <span style={{ color: "#52c41a", fontSize: "18px" }}>
            {data.systemStatus.efficiency.toFixed(1)}%
          </span>
        </div>
        <div>
          <span style={{ color: "#fff" }}>上次维护: </span>
          <span style={{ color: "#faad14" }}>
            {new Date(data.systemStatus.lastMaintenance).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatusChart;
