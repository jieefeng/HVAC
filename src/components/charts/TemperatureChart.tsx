import React from "react";
import { Card, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import { HVACData } from "../../store/hvacStore";
import { useThemeStore } from "../../store/themeStore";

interface TemperatureChartProps {
  data: HVACData | null;
  loading: boolean;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  data,
  loading,
}) => {
  const { colors } = useThemeStore();

  if (loading || !data) {
    return (
      <Card
        title="温度监控"
        className="chart-container"
        style={{ height: 400 }}
      >
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
      text: `当前温度: ${data.temperature.current.toFixed(1)}°C`,
      textStyle: { color: colors.text.primary, fontSize: 16 },
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: colors.background.modal,
      borderColor: colors.chart.temperature,
      textStyle: { color: colors.text.primary },
    },
    legend: {
      data: ["当前温度", "目标温度"],
      textStyle: { color: colors.text.secondary },
      top: 50,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.temperature.history.map((item) =>
        new Date(item.time).toLocaleTimeString()
      ),
      axisLine: { lineStyle: { color: colors.border.primary } },
      axisLabel: { color: colors.text.secondary },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: colors.border.primary } },
      axisLabel: { color: colors.text.secondary, formatter: "{value}°C" },
      splitLine: {
        lineStyle: { color: colors.border.secondary, type: "dashed" },
      },
    },
    series: [
      {
        name: "当前温度",
        type: "line",
        data: data.temperature.history.map((item) => item.value),
        smooth: true,
        lineStyle: { color: colors.chart.temperature, width: 3 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.chart.temperature + "40" },
              { offset: 1, color: colors.chart.temperature + "10" },
            ],
          },
        },
        itemStyle: { color: colors.chart.temperature },
      },
      {
        name: "目标温度",
        type: "line",
        data: Array(data.temperature.history.length).fill(
          data.temperature.target
        ),
        lineStyle: {
          color: colors.text.tertiary,
          width: 2,
          type: "dashed",
        },
        itemStyle: { color: colors.text.tertiary },
        symbol: "none",
      },
    ],
  };

  return (
    <Card
      title="温度监控"
      className="chart-container"
      style={{ height: 400 }}
      extra={
        <div
          style={{
            color:
              data.temperature.current > data.temperature.target + 2
                ? "#ff4d4f"
                : "#52c41a",
          }}
        >
          {data.temperature.current > data.temperature.target + 2
            ? "⚠️ 过热"
            : "✅ 正常"}
        </div>
      }
    >
      <ReactECharts
        option={option}
        style={{ height: "300px", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </Card>
  );
};

export default TemperatureChart;
