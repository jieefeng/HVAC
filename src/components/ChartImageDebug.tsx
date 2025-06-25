import React, { useState, useEffect } from "react";
import { Card, Button, Space, Input, Alert, Typography, Divider } from "antd";
import { PlayCircleOutlined, BugOutlined } from "@ant-design/icons";
import {
  fetchChartImage,
  formatBase64Image,
  ChartType,
} from "../services/chartImageService";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const ChartImageDebug: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<ChartType>("temperature");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [formattedImage, setFormattedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const chartTypes: ChartType[] = [
    "temperature",
    "humidity",
    "energy",
    "energy_pie",
    "airflow",
    "system_status",
  ];

  const handleFetchImage = async () => {
    setLoading(true);
    setError("");
    setApiResponse("");
    setFormattedImage("");

    try {
      console.log(`🔧 开始调试获取图片: ${selectedChart}`);
      const result = await fetchChartImage(selectedChart);

      if (result.success && result.data) {
        setApiResponse(result.data);
        const formatted = formatBase64Image(result.data);
        setFormattedImage(formatted);
        console.log(`🔧 调试成功:`, {
          originalLength: result.data.length,
          formattedLength: formatted.length,
          hasDataPrefix: formatted.startsWith("data:image"),
        });
      } else {
        setError(result.error || "获取失败");
        console.error(`🔧 调试失败:`, result.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "未知错误";
      setError(errorMsg);
      console.error(`🔧 调试异常:`, err);
    } finally {
      setLoading(false);
    }
  };

  const testBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  return (
    <Card title="图表图片调试工具" style={{ margin: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* 控制面板 */}
        <Card size="small" title="控制面板">
          <Space wrap>
            <Text>选择图表类型:</Text>
            {chartTypes.map((type) => (
              <Button
                key={type}
                type={selectedChart === type ? "primary" : "default"}
                size="small"
                onClick={() => setSelectedChart(type)}
              >
                {type}
              </Button>
            ))}
          </Space>
          <Divider />
          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={loading}
              onClick={handleFetchImage}
            >
              获取图片
            </Button>
            <Button
              icon={<BugOutlined />}
              onClick={() =>
                console.log("当前状态:", {
                  selectedChart,
                  apiResponse: apiResponse.substring(0, 100),
                  formattedImage: formattedImage.substring(0, 100),
                })
              }
            >
              打印调试信息
            </Button>
          </Space>
        </Card>

        {/* 错误显示 */}
        {error && (
          <Alert message="获取失败" description={error} type="error" showIcon />
        )}

        {/* API原始响应 */}
        {apiResponse && (
          <Card size="small" title="API原始响应">
            <Paragraph>
              <Text strong>数据长度:</Text> {apiResponse.length} 字符
            </Paragraph>
            <Paragraph>
              <Text strong>数据开头:</Text>{" "}
              <Text code>{apiResponse.substring(0, 50)}...</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>数据类型检测:</Text>
              <ul>
                <li>
                  是否以 'data:image' 开头:{" "}
                  {apiResponse.startsWith("data:image") ? "是" : "否"}
                </li>
                <li>
                  是否以 '/9j/' 开头 (JPEG):{" "}
                  {apiResponse.startsWith("/9j/") ? "是" : "否"}
                </li>
                <li>
                  是否以 'iVBOR' 开头 (PNG):{" "}
                  {apiResponse.startsWith("iVBOR") ? "是" : "否"}
                </li>
                <li>
                  是否匹配base64格式:{" "}
                  {/^[A-Za-z0-9+/]*={0,2}$/.test(apiResponse.substring(0, 100))
                    ? "可能是"
                    : "否"}
                </li>
              </ul>
            </Paragraph>
            <TextArea
              value={apiResponse}
              rows={4}
              readOnly
              placeholder="API响应数据将显示在这里..."
            />
          </Card>
        )}

        {/* 格式化后的图片数据 */}
        {formattedImage && (
          <Card size="small" title="格式化后的图片数据">
            <Paragraph>
              <Text strong>格式化后长度:</Text> {formattedImage.length} 字符
            </Paragraph>
            <Paragraph>
              <Text strong>MIME类型:</Text>{" "}
              <Text code>{formattedImage.split(";")[0]}</Text>
            </Paragraph>
            <TextArea
              value={formattedImage.substring(0, 200) + "..."}
              rows={3}
              readOnly
            />
          </Card>
        )}

        {/* 图片预览 */}
        {formattedImage && (
          <Card size="small" title="图片预览">
            <div style={{ textAlign: "center", padding: 16 }}>
              <img
                src={formattedImage}
                alt="调试预览"
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  border: "1px solid #d9d9d9",
                  borderRadius: 4,
                }}
                onLoad={() => console.log("✅ 调试图片加载成功")}
                onError={(e) => console.error("❌ 调试图片加载失败", e)}
              />
            </div>
          </Card>
        )}

        {/* 测试图片 */}
        <Card size="small" title="测试图片 (1x1像素PNG)">
          <Paragraph>
            <Text>用于测试图片显示功能是否正常:</Text>
          </Paragraph>
          <div style={{ textAlign: "center", padding: 16 }}>
            <img
              src={`data:image/png;base64,${testBase64}`}
              alt="测试图片"
              style={{
                width: 100,
                height: 100,
                border: "1px solid #d9d9d9",
                borderRadius: 4,
                backgroundColor: "#f0f0f0",
              }}
              onLoad={() => console.log("✅ 测试图片加载成功")}
              onError={(e) => console.error("❌ 测试图片加载失败", e)}
            />
            <div>
              <Text type="secondary">
                如果您能看到一个小的灰色方块，说明图片显示功能正常
              </Text>
            </div>
          </div>
        </Card>
      </Space>
    </Card>
  );
};

export default ChartImageDebug;
