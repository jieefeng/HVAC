import React from "react";
import { Card, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import { HVACData } from "../../store/hvacStore";

interface EnergyConsumptionChartProps {
  data: HVACData | null;
  loading: boolean;
}

const EnergyConsumptionChart: React.FC<EnergyConsumptionChartProps> = ({
  data,
  loading,
}) => {
  if (loading || !data) {
    return (
      <Card title="能耗监控" style={{ height: 400 }}>
        <Spin size="large" />
      </Card>
    );
  }

  const option = {
    backgroundColor: "transparent",
    title: {
      text: `当前功率: ${data.energy.current.toFixed(1)} kW`,
      textStyle: { color: "#ffffff", fontSize: 16 },
      left: "center",
    },
    xAxis: {
      type: "category",
      data: data.energy.history.map((item) =>
        new Date(item.time).toLocaleTimeString()
      ),
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff", formatter: "{value} kW" },
    },
    series: [
      {
        name: "能耗",
        type: "bar",
        data: data.energy.history.map((item) => item.value),
        itemStyle: { color: "#faad14" },
      },
    ],
  };

  return (
    <Card title="能耗监控" style={{ height: 400 }}>
      <ReactECharts option={option} style={{ height: "300px" }} />
    </Card>
  );
};

export default EnergyConsumptionChart;
