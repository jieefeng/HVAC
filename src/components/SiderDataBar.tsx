import React from "react";
import { Layout, Menu,Form, Switch, Checkbox } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  SettingOutlined,
  DatabaseOutlined,
  ControlOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import ThemeToggle from "./ThemeToggle";
import { useThemeStore } from "../store/themeStore";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { colors } = useThemeStore();

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


      <Form layout="vertical" style={{display: "flex", flexDirection: "column",justifyContent: "center",alignItems: "center"}}>
              <Form.Item label="数据项配置">
                <div style={{ marginBottom: "8px" ,color: colors.text.primary }}>
                  <Checkbox defaultChecked /> 温度监控
                </div>
                <div style={{ marginBottom: "8px" ,color: colors.text.primary }}>
                  <Checkbox defaultChecked /> 湿度监控
                </div>
                <div style={{ marginBottom: "8px" ,color: colors.text.primary }}>
                  <Checkbox defaultChecked /> 能耗分析
                </div>
                <div style={{ marginBottom: "8px" ,color: colors.text.primary }}>
                  <Checkbox defaultChecked /> 空气流量
                </div>
                <div style={{ marginBottom: "8px" ,color: colors.text.primary }}>
                  <Checkbox /> 系统压力
                </div>
                <div style={{ marginBottom: "8px" ,color: colors.text.primary }}>
                  <Checkbox /> 报警信息
                </div>
              </Form.Item>

              </Form>
      {/* 导航菜单 */}
      {/* <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          background: "transparent",
          border: "none",
        }}
      /> */}

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
        <div style={{ fontSize: "12px", color: colors.text.tertiary }}>
          <div>版本: v1.0.0</div>
          <div>© 2024 HVAC System</div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
