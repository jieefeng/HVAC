import React from "react";
import { Card, Alert, Empty } from "antd";

interface AlertItem {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
}

interface AlertPanelProps {
  alerts: AlertItem[];
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  return (
    <Card title="系统报警" style={{ height: 400 }}>
      <div style={{ height: "300px", overflowY: "auto" }}>
        {alerts.length === 0 ? (
          <Empty
            description="暂无报警信息"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ color: "#fff" }}
          />
        ) : (
          alerts.map((alert) => (
            <Alert
              key={alert.id}
              message={alert.message}
              type={alert.type}
              showIcon
              style={{ marginBottom: "8px" }}
              description={new Date(alert.timestamp).toLocaleString()}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default AlertPanel;
