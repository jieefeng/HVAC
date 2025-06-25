import React from "react";
import { Layout, Menu, Form, Switch, Checkbox, Button, Divider } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  SettingOutlined,
  DatabaseOutlined,
  ControlOutlined,
  AppstoreOutlined,
  BugOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ThemeToggle from "./ThemeToggle";
import { useThemeStore } from "../store/themeStore";
import { useComponentVisibilityStore } from "../store/componentVisibilityStore";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors } = useThemeStore();
  const { visibility, toggleComponent, toggleAll, getVisibilityStats } =
    useComponentVisibilityStore();

  const stats = getVisibilityStats();
  const isAllSelected = stats.visible === stats.total;
  const isIndeterminate = stats.visible > 0 && stats.visible < stats.total;

  const componentConfig = [
    { key: "temperature", label: "温度监控", icon: "" },
    { key: "humidity", label: "湿度监控", icon: "" },
    { key: "energy", label: "能耗分析", icon: "" },
    { key: "energy_pie", label: "能耗分布", icon: "" },
    { key: "airflow", label: "空气流量", icon: "" },
    { key: "status", label: "系统状态", icon: "" },
  ];

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">仪表板</Link>,
    },
    {
      key: "/templates",
      icon: <AppstoreOutlined />,
      label: <Link to="/templates">模板管理</Link>,
    },
    {
      key: "/hvac-control",
      icon: <ControlOutlined />,
      label: <Link to="/hvac-control">系统控制</Link>,
    },
    {
      key: "/data-config",
      icon: <DatabaseOutlined />,
      label: <Link to="/data-config">数据配置</Link>,
    },
  ];

  return (
    <Sider
      width={250}
      style={{
        background: colors.background.secondary,
        borderRight: `1px solid ${colors.border.primary}`,
      }}
    >
      {/* Logo 区域 */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${colors.border.primary}`,
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            color: colors.text.primary,
            fontSize: "18px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <SettingOutlined style={{ color: colors.brand.primary }} />
          HVAC 监控系统
        </div>
      </div>

      <Form
        layout="vertical"
        style={{
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Form.Item>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                color: colors.text.primary,
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              数据项配置
            </span>
            <span
              style={{
                color: colors.text.secondary,
                fontSize: "12px",
              }}
            >
              {/* ({stats.visible}/{stats.total}) */}
            </span>
          </div>

          {/* 全选控制 */}
          <div style={{ marginBottom: "12px" }}>
            <Checkbox
              indeterminate={isIndeterminate}
              checked={isAllSelected}
              onChange={(e) => toggleAll(e.target.checked)}
              style={{ color: colors.text.primary }}
            >
              <span style={{ fontWeight: "500" }}>全选/取消全选</span>
            </Checkbox>
          </div>

          <Divider
            style={{
              margin: "8px 0",
              borderColor: colors.border.primary,
            }}
          />

          {/* 组件选择列表 */}
          {componentConfig.map((component) => (
            <div
              key={component.key}
              style={{
                marginBottom: "8px",
                padding: "4px 0",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
              }}
            >
              <Checkbox
                checked={visibility[component.key as keyof typeof visibility]}
                onChange={() =>
                  toggleComponent(component.key as keyof typeof visibility)
                }
                style={{ color: colors.text.primary }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: colors.text.primary,
                  }}
                >
                  <span>{component.icon}</span>
                  <span>{component.label}</span>
                </span>
              </Checkbox>
            </div>
          ))}
        </Form.Item>
      </Form>

      {/* 底部工具栏 */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "16px",
          right: "16px",
          padding: "16px",
          borderTop: `1px solid ${colors.border.primary}`,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* 调试按钮 */}
        {/* <Button
          icon={<BugOutlined />}
          onClick={() => navigate("/debug")}
          block
          size="small"
          type={location.pathname === "/debug" ? "primary" : "default"}
        >
          图片调试工具
        </Button> */}

        {/* 主题切换 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: colors.text.secondary, fontSize: "14px" }}>
            主题模式
          </span>
          <ThemeToggle size="small" />
        </div>

        {/* 系统信息 */}
        {/* <div style={{ fontSize: "12px", color: colors.text.tertiary }}>
          <div>版本: v1.0.0</div>
          <div>© 2024 HVAC System</div>
        </div> */}
      </div>
    </Sider>
  );
};

export default Sidebar;
