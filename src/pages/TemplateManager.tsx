import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Space,
  Popconfirm,
  message,
  Spin,
  Empty,
  Input,
  Select,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { useTemplateStore, Template } from "../store/templateStore";
import { useThemeStore } from "../store/themeStore";
import TemplatePreview from "../components/TemplatePreview";
import TemplateEditor from "../components/TemplateEditor";

const { Search } = Input;
const { Option } = Select;

const TemplateManager: React.FC = () => {
  const { colors } = useThemeStore();
  const {
    templates,
    isLoading,
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    toggleTemplateActive,
    initializeDefaultTemplates,
  } = useTemplateStore();

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    const initData = async () => {
      await initializeDefaultTemplates();
      await loadTemplates();
    };
    initData();
  }, [initializeDefaultTemplates, loadTemplates]);

  // 过滤模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && template.isActive) ||
      (filterStatus === "inactive" && !template.isActive);
    return matchesSearch && matchesFilter;
  });

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleEdit = (template: Template) => {
    setEditTemplate(template);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditTemplate(null);
    setShowEditor(true);
  };

  const handleSave = async (
    templateData: Omit<Template, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (editTemplate) {
        await updateTemplate(editTemplate.id!, templateData);
        message.success("模板更新成功");
      } else {
        await createTemplate(templateData);
        message.success("模板创建成功");
      }
    } catch (error) {
      message.error("操作失败");
      throw error;
    }
  };

  const handleCopy = async (template: Template) => {
    try {
      const newName = `${template.name} - 副本`;
      await duplicateTemplate(template.id!, newName);
      message.success("模板复制成功");
    } catch (error) {
      message.error("复制失败");
    }
  };

  const handleDelete = async (template: Template) => {
    try {
      await deleteTemplate(template.id!);
      message.success("模板删除成功");
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleToggleActive = async (template: Template) => {
    try {
      await toggleTemplateActive(template.id!);
      message.success(`模板已${template.isActive ? "禁用" : "启用"}`);
    } catch (error) {
      message.error("操作失败");
    }
  };

  const renderTemplateCard = (template: Template) => (
    <Col span={8} key={template.id}>
      <Card
        hoverable
        className="theme-card"
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>{template.preview}</span>
            <span style={{ color: colors.text.primary }}>{template.name}</span>
            {template.isActive && <Tag color={colors.brand.success}>启用</Tag>}
          </div>
        }
        actions={[
          <Tooltip title="预览">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(template)}
              style={{ color: colors.text.secondary }}
            />
          </Tooltip>,
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(template)}
              style={{ color: colors.text.secondary }}
            />
          </Tooltip>,
          <Tooltip title="复制">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(template)}
              style={{ color: colors.text.secondary }}
            />
          </Tooltip>,
          <Tooltip title={template.isActive ? "禁用" : "启用"}>
            <Button
              type="text"
              icon={<PoweroffOutlined />}
              onClick={() => handleToggleActive(template)}
              style={{
                color: template.isActive
                  ? colors.status.online
                  : colors.text.tertiary,
              }}
            />
          </Tooltip>,
          <Popconfirm
            title="确定要删除这个模板吗？"
            onConfirm={() => handleDelete(template)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                style={{ color: colors.brand.error }}
              />
            </Tooltip>
          </Popconfirm>,
        ]}
        style={{ height: "280px" }}
      >
        <div style={{ height: "120px", overflow: "scroll" }}>
          <p style={{ color: colors.text.secondary, marginBottom: "12px" }}>
            {template.description}
          </p>
          <div style={{ fontSize: "12px", color: colors.text.tertiary }}>
            <div>布局: {template.config.layout}</div>
            <div>组件数: {template.config.components.length}</div>
            <div>刷新间隔: {template.config.refreshInterval}ms</div>
            <div>
              更新时间: {new Date(template.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );

  if (isLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px", color: colors.text.tertiary }}>
          正在加载模板...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ color: colors.text.primary, margin: 0 }}>
          可视化模板管理
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建模板
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <div
        className="theme-card"
        style={{
          marginBottom: "24px",
          padding: "16px",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col span={12}>
            <Search
              placeholder="搜索模板名称或描述"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={8}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: "100%" }}
              placeholder="筛选状态"
            >
              <Option value="all">全部模板</Option>
              <Option value="active">已启用</Option>
              <Option value="inactive">已禁用</Option>
            </Select>
          </Col>
          <Col span={4}>
            <div style={{ color: colors.text.tertiary, fontSize: "14px" }}>
              共 {filteredTemplates.length} 个模板
            </div>
          </Col>
        </Row>
      </div>

      {/* 模板列表 */}
      {filteredTemplates.length === 0 ? (
        <Empty
          description={
            <span style={{ color: colors.text.tertiary }}>
              {searchText || filterStatus !== "all"
                ? "没有找到匹配的模板"
                : "暂无模板"}
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          {!searchText && filterStatus === "all" && (
            <Button type="primary" onClick={handleCreate}>
              创建第一个模板
            </Button>
          )}
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>{filteredTemplates.map(renderTemplateCard)}</Row>
      )}

      {/* 预览模态框 */}
      <TemplatePreview
        template={previewTemplate}
        visible={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />

      {/* 编辑模态框 */}
      <TemplateEditor
        template={editTemplate}
        visible={showEditor}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false);
          setEditTemplate(null);
        }}
      />
    </div>
  );
};

export default TemplateManager;
