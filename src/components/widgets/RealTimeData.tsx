import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { HVACData } from "../../store/hvacStore";

interface RealTimeDataProps {
  data: HVACData | null;
}

const RealTimeData: React.FC<RealTimeDataProps> = ({ data }) => {
  if (!data) {
    return (
      <Card title="实时数据" style={{ height: 400 }}>
        <div style={{ color: "#999" }}>暂无数据</div>
      </Card>
    );
  }

  return (
    <Card title="实时数据" style={{ height: 400 }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="温度"
            value={data.temperature.current}
            precision={1}
            suffix="°C"
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="湿度"
            value={data.humidity.current}
            precision={1}
            suffix="%"
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="能耗"
            value={data.energy.current}
            precision={1}
            suffix="kW"
            valueStyle={{ color: "#faad14" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="风量"
            value={data.airFlow.current}
            precision={0}
            suffix="m³/h"
            valueStyle={{ color: "#36cfc9" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default RealTimeData;
