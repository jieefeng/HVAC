import React from "react";
import { Select, Card, Row, Col, Button } from "antd";
import { AppstoreOutlined, EyeOutlined } from "@ant-design/icons";
import { useThemeStore } from "@/store/themeStore";

const { Option } = Select;

interface TemplateSelectorProps {
  templates: string[];
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateChange,
}) => {
  const templateInfo = {
    template1: {
      name: "经典监控模板",
      description: "基础的温湿度、能耗监控布局",
      preview: "🌡️💧⚡",
    },
    template2: {
      name: "能耗分析模板",
      description: "专注能耗分析和优化建议",
      preview: "⚡📊🌍",
    },
    template3: {
      name: "系统状态模板",
      description: "全面的系统运行状态监控",
      preview: "🔧⚙️📈",
    },
    template4: {
      name: "环境监控模板",
      description: "环境参数综合监控",
      preview: "🌡️💨🌿",
    },
    template5: {
      name: "趋势分析模板",
      description: "历史数据趋势和预测分析",
      preview: "📈📉🔮",
    },
    template6: {
      name: "设备健康模板",
      description: "设备状态和维护管理",
      preview: "🔧💊⚠️",
    },
    template7: {
      name: "能效优化模板",
      description: "能效分析和优化建议",
      preview: "🔋💡📊",
    },
    template8: {
      name: "报警中心模板",
      description: "集中的报警和事件管理",
      preview: "🚨⚠️📢",
    },
    template9: {
      name: "数据总览模板",
      description: "关键指标的总览展示",
      preview: "📊📋📈",
    },
    template10: {
      name: "自定义仪表盘",
      description: "可自定义布局的仪表盘",
      preview: "🎨🔧⚙️",
    },
  };

  const colors = useThemeStore()

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <AppstoreOutlined style={{color: colors.colors.text.primary, fontSize: "16px" }} />
      <span style={{ color: colors.colors.text.primary, fontSize: "14px" }}>模板:</span>
      <Select
        value={selectedTemplate}
        onChange={onTemplateChange}
        style={{ width: 200 }}
        dropdownRender={(menu) => (
          <div>
            {menu}
            <div style={{ padding: "8px", borderTop: "1px solid #f0f0f0" }}>
              <Row gutter={[8, 8]}>
                {/* {templates.map((template) => {
                  const info =
                    templateInfo[template as keyof typeof templateInfo];
                  return (
                    <Col span={24} key={template}>
                      <Card
                        size="small"
                        hoverable
                        style={{
                          cursor: "pointer",
                          border:
                            selectedTemplate === template
                              ? "2px solid #1890ff"
                              : "1px solid #d9d9d9",
                        }}
                        onClick={() => onTemplateChange(template)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>
                            {info?.preview}
                          </span>
                          <div>
                            <div
                              style={{ fontWeight: "bold", fontSize: "12px" }}
                            >
                              {info?.name}
                            </div>
                            <div style={{ fontSize: "10px", color: "#666" }}>
                              {info?.description}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })} */}
              </Row>
            </div>
          </div>
        )}
      >
        {templates.map((template) => {
          const info = templateInfo[template as keyof typeof templateInfo];
          return (
            <Option key={template} value={template}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>{info?.preview}</span>
                <span>{info?.name}</span>
              </div>
            </Option>
          );
        })}
      </Select>
      <Button
        type="text"
        icon={<EyeOutlined />}
        style={{ color: colors.colors.text.primary, }}
        size="small"

      >
        预览
      </Button>
    </div>
  );
};

export default TemplateSelector;
