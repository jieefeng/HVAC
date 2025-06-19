import React from "react";
import { Card, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import { HVACData } from "../../store/hvacStore";

interface PressureChartProps {
  data: HVACData | null;
  loading: boolean;
}

const PressureChart: React.FC<PressureChartProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <Card title="压力监控" style={{ height: 400 }}>
        <Spin size="large" />
      </Card>
    );
  }

  const option = {
    backgroundColor: "transparent",
    title: {
      text: `当前压力: ${data.pressure.current.toFixed(1)} kPa`,
      textStyle: { color: "#ffffff", fontSize: 16 },
      left: "center",
    },
    series: [
      {
        type: "gauge",
        min: 95,
        max: 105,
        data: [{ value: data.pressure.current, name: "压力" }],
        axisLine: { lineStyle: { color: [[1, "#722ed1"]], width: 8 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: "#ffffff" },
        title: { color: "#ffffff" },
        detail: {
          formatter: "{value} kPa",
          color: "#ffffff",
          fontSize: 16,
        },
      },
    ],
  };

  return (
    <Card title="压力监控" style={{ height: 400 }}>
      <ReactECharts option={option} style={{ height: "300px" }} />
    </Card>
  );
};

export default PressureChart;
