import React from "react";
import { Card, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import { HVACData } from "../../store/hvacStore";

interface AirFlowChartProps {
  data: HVACData | null;
  loading: boolean;
}

const AirFlowChart: React.FC<AirFlowChartProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <Card title="空气流量" style={{ height: 400 }}>
        <Spin size="large" />
      </Card>
    );
  }

  const option = {
    backgroundColor: "transparent",
    title: {
      text: `当前流量: ${data.airFlow.current.toFixed(0)} m³/h`,
      textStyle: { color: "#ffffff", fontSize: 16 },
      left: "center",
    },
    series: [
      {
        type: "gauge",
        data: [{ value: data.airFlow.current, name: "空气流量" }],
        axisLine: { lineStyle: { color: [[1, "#36cfc9"]], width: 8 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: "#ffffff" },
        title: { color: "#ffffff" },
        detail: {
          formatter: "{value} m³/h",
          color: "#ffffff",
          fontSize: 16,
        },
      },
    ],
  };

  return (
    <Card title="空气流量" style={{ height: 400 }}>
      <ReactECharts option={option} style={{ height: "300px" }} />
    </Card>
  );
};

export default AirFlowChart;
