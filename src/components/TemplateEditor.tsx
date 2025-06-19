import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Tabs,
  Row,
  Col,
  Card,
  InputNumber,
  ColorPicker,
  Space,
  Divider,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, DragOutlined } from "@ant-design/icons";
import {
  Template,
  ComponentConfig,
  TemplateConfig,
} from "../store/templateStore";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface TemplateEditorProps {
  template: Template | null;
  visible: boolean;
  onSave: (
    template: Omit<Template, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
}

const componentTypes = [
  { value: "temperature", label: "温度监控", icon: "🌡️" },
  { value: "humidity", label: "湿度监控", icon: "💧" },
  { value: "energy", label: "能耗监控", icon: "⚡" },
  { value: "airflow", label: "空气流量", icon: "💨" },
  { value: "pressure", label: "压力监控", icon: "📊" },
  { value: "status", label: "系统状态", icon: "🔧" },
  { value: "weather", label: "天气信息", icon: "🌤️" },
  { value: "alerts", label: "系统报警", icon: "⚠️" },
  { value: "realtime", label: "实时数据", icon: "📈" },
];

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  visible,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [components, setComponents] = useState<ComponentConfig[]>([]);

  useEffect(() => {
    if (template && visible) {
      form.setFieldsValue({
        name: template.name,
        description: template.description,
        preview: template.preview,
        isActive: template.isActive,
        layout: template.config.layout,
        refreshInterval: template.config.refreshInterval,
        dataSource: template.config.dataSource,
        primaryColor: template.config.theme.primaryColor,
        backgroundColor: template.config.theme.backgroundColor,
        textColor: template.config.theme.textColor,
      });
      setComponents(template.config.components || []);
    } else if (visible) {
      // 新建模板的默认值
      form.resetFields();
      form.setFieldsValue({
        layout: "grid",
        refreshInterval: 5000,
        dataSource: "websocket",
        primaryColor: "#1890ff",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        textColor: "#ffffff",
        isActive: true,
      });
      setComponents([]);
    }
  }, [template, visible, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const templateData: Omit<Template, "id" | "createdAt" | "updatedAt"> = {
        name: values.name,
        description: values.description,
        preview: values.preview,
        isActive: values.isActive,
        config: {
          layout: values.layout,
          components: components,
          theme: {
            primaryColor: values.primaryColor,
            backgroundColor: values.backgroundColor,
            textColor: values.textColor,
          },
          refreshInterval: values.refreshInterval,
          dataSource: values.dataSource,
        },
      };

      await onSave(templateData);
      message.success("模板保存成功");
      onCancel();
    } catch (error) {
      console.error("保存模板失败:", error);
      message.error("保存模板失败");
    } finally {
      setLoading(false);
    }
  };

  const addComponent = () => {
    const newComponent: ComponentConfig = {
      id: `component-${Date.now()}`,
      type: "temperature",
      position: { x: 0, y: components.length * 4, w: 6, h: 4 },
      title: "新组件",
      visible: true,
      config: {},
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (
    index: number,
    updates: Partial<ComponentConfig>
  ) => {
    const newComponents = [...components];
    newComponents[index] = { ...newComponents[index], ...updates };
    setComponents(newComponents);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const renderBasicSettings = () => (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Form.Item
          name="name"
          label="模板名称"
          rules={[{ required: true, message: "请输入模板名称" }]}
        >
          <Input placeholder="输入模板名称" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="preview"
          label="预览图标"
          rules={[{ required: true, message: "请输入预览图标" }]}
        >
          <Input placeholder="🌡️💧⚡" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name="description"
          label="模板描述"
          rules={[{ required: true, message: "请输入模板描述" }]}
        >
          <TextArea rows={3} placeholder="描述模板的功能和用途" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="layout"
          label="布局模式"
          rules={[{ required: true, message: "请选择布局模式" }]}
        >
          <Select>
            <Option value="grid">网格布局</Option>
            <Option value="flex">弹性布局</Option>
            <Option value="custom">自定义布局</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="refreshInterval"
          label="刷新间隔(ms)"
          rules={[{ required: true, message: "请输入刷新间隔" }]}
        >
          <InputNumber
            min={1000}
            max={60000}
            step={1000}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="dataSource"
          label="数据源"
          rules={[{ required: true, message: "请选择数据源" }]}
        >
          <Select>
            <Option value="websocket">WebSocket</Option>
            <Option value="api">REST API</Option>
            <Option value="mock">模拟数据</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="isActive" label="启用状态" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderThemeSettings = () => (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Form.Item name="primaryColor" label="主色调">
          <ColorPicker showText />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="backgroundColor" label="背景色">
          <Input placeholder="rgba(0, 0, 0, 0.8)" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="textColor" label="文字颜色">
          <ColorPicker showText />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderComponentSettings = () => (
    <div>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0, color: "#fff" }}>组件配置</h4>
        <Button type="primary" icon={<PlusOutlined />} onClick={addComponent}>
          添加组件
        </Button>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {components.map((component, index) => (
          <Card
            key={component.id}
            size="small"
            style={{ marginBottom: "12px" }}
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <DragOutlined />
                <span>
                  {componentTypes.find((t) => t.value === component.type)?.icon}
                </span>
                <span>{component.title}</span>
              </div>
            }
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeComponent(index)}
              />
            }
          >
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <label>组件类型:</label>
                <Select
                  value={component.type}
                  onChange={(value) => updateComponent(index, { type: value })}
                  style={{ width: "100%" }}
                  size="small"
                >
                  {componentTypes.map((type) => (
                    <Option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={8}>
                <label>标题:</label>
                <Input
                  value={component.title}
                  onChange={(e) =>
                    updateComponent(index, { title: e.target.value })
                  }
                  size="small"
                />
              </Col>
              <Col span={8}>
                <label>显示:</label>
                <Switch
                  checked={component.visible}
                  onChange={(checked) =>
                    updateComponent(index, { visible: checked })
                  }
                />
              </Col>
              <Col span={6}>
                <label>X位置:</label>
                <InputNumber
                  value={component.position.x}
                  onChange={(value) =>
                    updateComponent(index, {
                      position: { ...component.position, x: value || 0 },
                    })
                  }
                  min={0}
                  max={11}
                  size="small"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={6}>
                <label>Y位置:</label>
                <InputNumber
                  value={component.position.y}
                  onChange={(value) =>
                    updateComponent(index, {
                      position: { ...component.position, y: value || 0 },
                    })
                  }
                  min={0}
                  size="small"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={6}>
                <label>宽度:</label>
                <InputNumber
                  value={component.position.w}
                  onChange={(value) =>
                    updateComponent(index, {
                      position: { ...component.position, w: value || 1 },
                    })
                  }
                  min={1}
                  max={12}
                  size="small"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={6}>
                <label>高度:</label>
                <InputNumber
                  value={component.position.h}
                  onChange={(value) =>
                    updateComponent(index, {
                      position: { ...component.position, h: value || 1 },
                    })
                  }
                  min={1}
                  max={12}
                  size="small"
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      title={template ? "编辑模板" : "新建模板"}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" loading={loading} onClick={handleSave}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基础设置" key="basic">
            {renderBasicSettings()}
          </TabPane>
          <TabPane tab="主题配置" key="theme">
            {renderThemeSettings()}
          </TabPane>
          <TabPane tab="组件配置" key="components">
            {renderComponentSettings()}
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default TemplateEditor;
