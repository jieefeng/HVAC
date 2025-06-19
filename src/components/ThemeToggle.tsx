import React from "react";
import { Button, Tooltip } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useThemeStore } from "../store/themeStore";

interface ThemeToggleProps {
  size?: "small" | "middle" | "large";
  type?: "default" | "primary" | "dashed" | "link" | "text";
  showText?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = "middle",
  type = "text",
  showText = false,
}) => {
  const { mode, toggleTheme } = useThemeStore();

  const isDark = mode === "dark";
  const icon = isDark ? <SunOutlined /> : <MoonOutlined />;
  const tooltipText = isDark ? "切换到白天模式" : "切换到夜晚模式";
  const buttonText = isDark ? "白天模式" : "夜晚模式";

  return (
    <Tooltip title={tooltipText}>
      <Button
        type={type}
        size={size}
        icon={icon}
        onClick={toggleTheme}
        style={{
          color: "var(--text-primary)",
          borderColor: "var(--border-primary)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {showText && buttonText}
      </Button>
    </Tooltip>
  );
};

export default ThemeToggle;
