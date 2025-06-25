import React from "react";
import { Select, Card, Row, Col, Button } from "antd";
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
    main: {
      name: "自定义仪表盘",
      description: "可自定义布局的仪表盘",
    },
    template1: {
      name: "经典监控模板",
      description: "基础的温湿度、能耗监控布局",
    },
    template2: {
      name: "能耗分析模板",
      description: "专注能耗分析和优化建议",
    },
    template3: {
      name: "系统状态模板",
      description: "全面的系统运行状态监控",
    },
    template4: {
      name: "环境监控专业版",
      description: "环境参数综合监控",
    },
    template5: {
      name: "能耗优化管理版",
      description: "能效分析和优化建议",
    },
    template6: {
      name: "实时监控仪表板",
      description: "实时数据监控面板",
    },
    template7: {
      name: "紧凑型监控面板",
      description: "紧凑布局的监控面板",
    },
    template8: {
      name: "全景展示大屏",
      description: "全景式数据展示",
    },
    template9: {
      name: "运维专家模式",
      description: "专业运维监控界面",
    },
    template10: {
      name: "节能分析专版",
      description: "节能分析和优化",
    },
    template11: {
      name: "智能控制中心",
      description: "智能化控制管理",
    },
  };

  const colors = useThemeStore();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ color: colors.colors.text.primary, fontSize: "14px" }}>
        模板:
      </span>
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
              <span>{info?.name}</span>
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default TemplateSelector;
