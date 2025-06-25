import React, { useState, useEffect } from "react";
import { Row, Col, Card, Select, Button, Space, Switch } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import ChartImage from "../components/ChartImage";
import TemplateSelector from "../components/TemplateSelector";
import { useHVACStore } from "../store/hvacStore";
import { useChartImageStore } from "../store/chartImageStore";
import { useComponentVisibilityStore } from "../store/componentVisibilityStore";
import { useThemeStore } from "@/store/themeStore";
// import "./MainDashboard.css";

const { Option } = Select;

const MainDashboard: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("main");
  const [isRealTime, setIsRealTime] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const colors = useThemeStore();
  const {
    visibility,
    getVisibleComponents,
    setVisibilityByTemplate,
    toggleAll,
  } = useComponentVisibilityStore();
  const {
    hvacData,
    isLoading: hvacLoading,
    fetchHVACData,
    startRealTimeUpdates: startHVACRealTime,
    stopRealTimeUpdates: stopHVACRealTime,
  } = useHVACStore();

  const {
    chartImages,
    isLoading: imageLoading,
    error: imageError,
    fetchAllImages,
    startRealTimeUpdates: startImageRealTime,
    stopRealTimeUpdates: stopImageRealTime,
  } = useChartImageStore();

  useEffect(() => {
    // 获取HVAC数据（用于部分组件）
    fetchHVACData();
    // 获取图片数据
    fetchAllImages();

    if (isRealTime) {
      startHVACRealTime(refreshInterval);
      startImageRealTime(refreshInterval);
    }

    return () => {
      stopHVACRealTime();
      stopImageRealTime();
    };
  }, [isRealTime, refreshInterval]);

  // 初始化时如果是主模板，自动勾选所有组件
  useEffect(() => {
    if (selectedTemplate === "main") {
      toggleAll(true);
    }
  }, []); // 只在组件初始化时执行一次

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);

    if (template === "main") {
      // 主模板：自动勾选所有组件
      toggleAll(true);
    } else {
      // 其他模板：根据模板配置更新侧边栏勾选状态
      const templateConfig =
        templateConfigs[template as keyof typeof templateConfigs];
      if (templateConfig) {
        const templateComponents = templateConfig.layout.map(
          (item) => item.component
        );
        setVisibilityByTemplate(templateComponents);
      }
    }
  };

  const handleRealTimeToggle = (checked: boolean) => {
    setIsRealTime(checked);
    if (checked) {
      startHVACRealTime(refreshInterval);
      startImageRealTime(refreshInterval);
    } else {
      stopHVACRealTime();
      stopImageRealTime();
    }
  };

  const templateConfigs = {
    main: {
      name: "自定义仪表盘",
      layout: [
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
        { component: "airflow", span: 8 },
        { component: "energy", span: 12 },
        { component: "energy_pie", span: 12 },
        { component: "status", span: 24 },
      ],
    },
    template1: {
      name: "经典监控模板",
      layout: [
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
        { component: "airflow", span: 8 },
        { component: "energy", span: 12 },
        { component: "status", span: 12 },
      ],
    },
    template2: {
      name: "能耗分析模板",
      layout: [
        { component: "energy", span: 16 },
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
        { component: "energy_pie", span: 8 },
        { component: "airflow", span: 8 },
        { component: "status", span: 8 },
      ],
    },
    template3: {
      name: "系统状态模板",
      layout: [
        { component: "status", span: 24 },
        { component: "airflow", span: 8 },
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
      ],
    },
    template4: {
      name: "环境监控专业版",
      layout: [
        { component: "temperature", span: 12 },
        { component: "humidity", span: 12 },
        { component: "airflow", span: 8 },
        { component: "energy", span: 8 },
        { component: "energy_pie", span: 8 },
        { component: "status", span: 24 },
      ],
    },
    template5: {
      name: "能耗优化管理版",
      layout: [
        { component: "energy", span: 24 },
        { component: "energy_pie", span: 8 },
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
        { component: "status", span: 12 },
        { component: "airflow", span: 12 },
      ],
    },
    template6: {
      name: "实时监控仪表板",
      layout: [
        { component: "status", span: 12 },
        { component: "energy", span: 12 },
        { component: "temperature", span: 6 },
        { component: "humidity", span: 6 },
        { component: "airflow", span: 6 },
        { component: "energy_pie", span: 6 },
      ],
    },
    template7: {
      name: "紧凑型监控面板",
      layout: [
        { component: "status", span: 12 },
        { component: "energy", span: 12 },
        { component: "temperature", span: 6 },
        { component: "humidity", span: 6 },
        { component: "airflow", span: 6 },
        { component: "energy_pie", span: 6 },
      ],
    },
    template8: {
      name: "全景展示大屏",
      layout: [
        { component: "energy", span: 8 },
        { component: "energy_pie", span: 8 },
        { component: "status", span: 8 },
        { component: "temperature", span: 6 },
        { component: "humidity", span: 6 },
        { component: "airflow", span: 6 },
      ],
    },
    template9: {
      name: "运维专家模式",
      layout: [
        { component: "status", span: 24 },
        { component: "energy", span: 8 },
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
        { component: "airflow", span: 12 },
        { component: "energy_pie", span: 12 },
      ],
    },
    template10: {
      name: "节能分析专版",
      layout: [
        { component: "energy", span: 14 },
        { component: "energy_pie", span: 10 },
        { component: "temperature", span: 8 },
        { component: "humidity", span: 8 },
        { component: "airflow", span: 8 },
        { component: "status", span: 8 },
      ],
    },
    template11: {
      name: "智能控制中心",
      layout: [
        { component: "status", span: 8 },
        { component: "energy", span: 8 },
        { component: "energy_pie", span: 8 },
        { component: "temperature", span: 6 },
        { component: "humidity", span: 6 },
        { component: "airflow", span: 6 },
      ],
    },
  };

  const renderComponent = (componentType: string, span: number) => {
    const commonProps = {
      key: componentType,
    };

    // 图表组件映射到图片组件
    const componentMap = {
      temperature: (
        <ChartImage
          title="温度趋势"
          imageData={chartImages.temperature}
          loading={imageLoading}
          error={imageError || undefined}
          height={300}
          {...commonProps}
        />
      ),
      humidity: (
        <ChartImage
          title="湿度趋势"
          imageData={chartImages.humidity}
          loading={imageLoading}
          error={imageError || undefined}
          height={300}
          {...commonProps}
        />
      ),
      airflow: (
        <ChartImage
          title="空气流量"
          imageData={chartImages.airflow}
          loading={imageLoading}
          error={imageError || undefined}
          height={300}
          {...commonProps}
        />
      ),
      energy: (
        <ChartImage
          title="能耗统计"
          imageData={chartImages.energy}
          loading={imageLoading}
          error={imageError || undefined}
          height={300}
          {...commonProps}
        />
      ),
      energy_pie: (
        <ChartImage
          title="能耗分布"
          imageData={chartImages.energy_pie}
          loading={imageLoading}
          error={imageError || undefined}
          height={300}
          {...commonProps}
        />
      ),
      status: (
        <ChartImage
          title="系统状态"
          imageData={chartImages.system_status}
          loading={imageLoading}
          error={imageError || undefined}
          height={300}
          {...commonProps}
        />
      ),
    };

    return (
      <Col span={span} key={componentType} className="dashboard-item">
        {componentMap[componentType as keyof typeof componentMap]}
      </Col>
    );
  };

  // 获取当前模板的可见组件
  const getVisibleTemplateComponents = () => {
    const currentTemplate =
      templateConfigs[selectedTemplate as keyof typeof templateConfigs];

    // 所有模板都根据当前勾选状态显示组件
    const visibleComponents = getVisibleComponents();
    return currentTemplate.layout.filter((item) =>
      visibleComponents.includes(item.component)
    );
  };

  const visibleComponents = getVisibleTemplateComponents();

  // 如果没有选择任何组件，显示提示信息
  if (visibleComponents.length === 0) {
    return (
      <div
        className="dashboard-container"
        style={{ color: colors.colors.text.primary }}
      >
        <div className="dashboard-header">
          <Row
            justify="space-between"
            align="middle"
            style={{
              color: colors.colors.text.primary,
              backgroundColor: colors.colors.background.primary,
            }}
          >
            <Col>
              <h1 style={{ margin: 0, color: colors.colors.text.primary }}>
                HVAC 数据可视化大屏
              </h1>
            </Col>
            <Col>
              <Space size="large">
                <TemplateSelector
                  templates={Object.keys(templateConfigs)}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={handleTemplateChange}
                />
                <Space>
                  <span style={{ color: colors.colors.text.primary }}>
                    实时更新:
                  </span>
                  <Switch
                    checked={isRealTime}
                    onChange={handleRealTimeToggle}
                    checkedChildren={<PlayCircleOutlined />}
                    unCheckedChildren={<PauseCircleOutlined />}
                  />
                </Space>
                <Select
                  value={refreshInterval}
                  onChange={setRefreshInterval}
                  style={{ width: 120 }}
                >
                  <Option value={10000}>10秒</Option>
                  <Option value={50000}>50秒</Option>
                  <Option value={100000}>100秒</Option>
                  <Option value={300000}>300秒</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </div>

        <div className="dashboard-content">
          <Card
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: colors.colors.background.secondary,
              border: `1px solid ${colors.colors.border.primary}`,
              margin: "40px auto",
              maxWidth: "600px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: colors.colors.text.primary,
                marginBottom: "16px",
              }}
            >
              {selectedTemplate === "main"
                ? "🎛️ 请在左侧侧边栏中选择要显示的数据项"
                : `📊 当前模板"${
                    templateConfigs[
                      selectedTemplate as keyof typeof templateConfigs
                    ].name
                  }"暂无可显示的组件`}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: colors.colors.text.secondary,
                marginBottom: "24px",
              }}
            >
              {selectedTemplate === "main"
                ? "至少选择一个数据项来查看对应的图表"
                : "请在左侧侧边栏中勾选该模板包含的组件"}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: colors.colors.text.tertiary,
                padding: "12px",
                background: colors.colors.background.primary,
                borderRadius: "6px",
                border: `1px solid ${colors.colors.border.secondary}`,
              }}
            >
              💡
              提示：切换模板时会自动更新左侧勾选状态，您也可以手动调整显示的组件
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="dashboard-container"
      style={{ color: colors.colors.text.primary }}
    >
      <div
        className="dashboard-header"
        style={{ backgroundColor: colors.colors.background.primary }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ color: colors.colors.text.primary }}
        >
          <Col>
            <h1 style={{ margin: 0, color: colors.colors.text.primary }}>
              HVAC 数据可视化大屏
            </h1>
            <div
              style={{
                fontSize: "14px",
                color: colors.colors.text.secondary,
                marginTop: "4px",
              }}
            >
              当前显示: {visibleComponents.length} 个组件 | 模板:{" "}
              {
                templateConfigs[
                  selectedTemplate as keyof typeof templateConfigs
                ].name
              }
            </div>
          </Col>
          <Col>
            <Space size="large">
              <TemplateSelector
                templates={Object.keys(templateConfigs)}
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
              />
              <Space>
                <span style={{ color: colors.colors.text.primary }}>
                  实时更新:
                </span>
                <Switch
                  checked={isRealTime}
                  onChange={handleRealTimeToggle}
                  checkedChildren={<PlayCircleOutlined />}
                  unCheckedChildren={<PauseCircleOutlined />}
                />
              </Space>
              <Select
                value={refreshInterval}
                onChange={setRefreshInterval}
                style={{ width: 120 }}
              >
                <Option value={10000}>10秒</Option>
                <Option value={50000}>50秒</Option>
                <Option value={100000}>100秒</Option>
                <Option value={300000}>300秒</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="dashboard-content">
        <Row gutter={[16, 16]}>
          {visibleComponents.map((item) =>
            renderComponent(item.component, item.span)
          )}
        </Row>
      </div>
    </div>
  );
};

export default MainDashboard;
