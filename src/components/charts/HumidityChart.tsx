import React from "react";
import { Card, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import { HVACData } from "../../store/hvacStore";

interface HumidityChartProps {
  data: HVACData | null;
  loading: boolean;
}

const HumidityChart: React.FC<HumidityChartProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <Card title="湿度监控" style={{ height: 400 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  const option = {
    backgroundColor: "transparent",
    title: {
      text: `当前湿度: ${data.humidity.current.toFixed(1)}%`,
      textStyle: { color: "#ffffff", fontSize: 16 },
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#52c41a",
      textStyle: { color: "#ffffff" },
    },
    xAxis: {
      type: "category",
      data: data.humidity.history.map((item) =>
        new Date(item.time).toLocaleTimeString()
      ),
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#ffffff" } },
      axisLabel: { color: "#ffffff", formatter: "{value}%" },
    },
    series: [
      {
        name: "湿度",
        type: "line",
        data: data.humidity.history.map((item) => item.value),
        smooth: true,
        lineStyle: { color: "#52c41a", width: 3 },
        areaStyle: { color: "rgba(82, 196, 26, 0.3)" },
      },
    ],
  };

  return (
    <Card title="湿度监控" style={{ height: 400 }}>
      <ReactECharts
        option={option}
        style={{ height: "300px", width: "100%" }}
      />
    </Card>
  );
};

export default HumidityChart;
