import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  // 背景色
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    modal: string;
  };
  // 文字颜色
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  // 边框颜色
  border: {
    primary: string;
    secondary: string;
    hover: string;
  };
  // 品牌色
  brand: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  // 图表颜色
  chart: {
    temperature: string;
    humidity: string;
    energy: string;
    airflow: string;
    pressure: string;
    status: string;
  };
  // 状态颜色
  status: {
    online: string;
    offline: string;
    warning: string;
    normal: string;
  };
}

// 深色主题配色
const darkTheme: ThemeColors = {
  background: {
    primary: "rgba(0, 0, 0, 0.9)",
    secondary: "rgba(0, 0, 0, 0.8)",
    tertiary: "rgba(0, 0, 0, 0.6)",
    card: "rgba(255, 255, 255, 0.05)",
    modal: "rgba(0, 0, 0, 0.85)",
  },
  text: {
    primary: "#ffffff",
    secondary: "#d9d9d9",
    tertiary: "#999999",
    inverse: "#000000",
  },
  border: {
    primary: "rgba(255, 255, 255, 0.1)",
    secondary: "rgba(255, 255, 255, 0.05)",
    hover: "rgba(255, 255, 255, 0.2)",
  },
  brand: {
    primary: "#1890ff",
    secondary: "#096dd9",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
    info: "#13c2c2",
  },
  chart: {
    temperature: "#ff7875",
    humidity: "#52c41a",
    energy: "#faad14",
    airflow: "#36cfc9",
    pressure: "#722ed1",
    status: "#1890ff",
  },
  status: {
    online: "#52c41a",
    offline: "#ff4d4f",
    warning: "#faad14",
    normal: "#1890ff",
  },
};

// 浅色主题配色
const lightTheme: ThemeColors = {
  background: {
    primary: "#f0f2f5",
    secondary: "#ffffff",
    tertiary: "#fafafa",
    card: "#ffffff",
    modal: "#ffffff",
  },
  text: {
    primary: "#262626",
    secondary: "#595959",
    tertiary: "#8c8c8c",
    inverse: "#ffffff",
  },
  border: {
    primary: "#d9d9d9",
    secondary: "#f0f0f0",
    hover: "#40a9ff",
  },
  brand: {
    primary: "#1890ff",
    secondary: "#096dd9",
    success: "#52c41a",
    warning: "#fa8c16",
    error: "#f5222d",
    info: "#13c2c2",
  },
  chart: {
    temperature: "#f5222d",
    humidity: "#52c41a",
    energy: "#fa8c16",
    airflow: "#13c2c2",
    pressure: "#722ed1",
    status: "#1890ff",
  },
  status: {
    online: "#52c41a",
    offline: "#f5222d",
    warning: "#fa8c16",
    normal: "#1890ff",
  },
};

interface ThemeStore {
  mode: ThemeMode;
  colors: ThemeColors;

  // 操作方法
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  getThemeColors: () => ThemeColors;
  applyThemeToDocument: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "dark",
      colors: darkTheme,

      toggleTheme: () => {
        const currentMode = get().mode;
        const newMode = currentMode === "dark" ? "light" : "dark";
        const newColors = newMode === "dark" ? darkTheme : lightTheme;

        set({ mode: newMode, colors: newColors });
        get().applyThemeToDocument();
      },

      setTheme: (mode: ThemeMode) => {
        const newColors = mode === "dark" ? darkTheme : lightTheme;
        set({ mode, colors: newColors });
        get().applyThemeToDocument();
      },

      getThemeColors: () => {
        return get().colors;
      },

      applyThemeToDocument: () => {
        const { colors, mode } = get();
        const root = document.documentElement;

        // 设置 CSS 变量
        root.style.setProperty("--theme-mode", mode);

        // 背景色变量
        root.style.setProperty("--bg-primary", colors.background.primary);
        root.style.setProperty("--bg-secondary", colors.background.secondary);
        root.style.setProperty("--bg-tertiary", colors.background.tertiary);
        root.style.setProperty("--bg-card", colors.background.card);
        root.style.setProperty("--bg-modal", colors.background.modal);

        // 文字颜色变量
        root.style.setProperty("--text-primary", colors.text.primary);
        root.style.setProperty("--text-secondary", colors.text.secondary);
        root.style.setProperty("--text-tertiary", colors.text.tertiary);
        root.style.setProperty("--text-inverse", colors.text.inverse);

        // 边框颜色变量
        root.style.setProperty("--border-primary", colors.border.primary);
        root.style.setProperty("--border-secondary", colors.border.secondary);
        root.style.setProperty("--border-hover", colors.border.hover);

        // 品牌色变量
        root.style.setProperty("--brand-primary", colors.brand.primary);
        root.style.setProperty("--brand-secondary", colors.brand.secondary);
        root.style.setProperty("--brand-success", colors.brand.success);
        root.style.setProperty("--brand-warning", colors.brand.warning);
        root.style.setProperty("--brand-error", colors.brand.error);
        root.style.setProperty("--brand-info", colors.brand.info);

        // 图表颜色变量
        root.style.setProperty("--chart-temperature", colors.chart.temperature);
        root.style.setProperty("--chart-humidity", colors.chart.humidity);
        root.style.setProperty("--chart-energy", colors.chart.energy);
        root.style.setProperty("--chart-airflow", colors.chart.airflow);
        root.style.setProperty("--chart-pressure", colors.chart.pressure);
        root.style.setProperty("--chart-status", colors.chart.status);

        // 状态颜色变量
        root.style.setProperty("--status-online", colors.status.online);
        root.style.setProperty("--status-offline", colors.status.offline);
        root.style.setProperty("--status-warning", colors.status.warning);
        root.style.setProperty("--status-normal", colors.status.normal);

        // 设置 body 背景色
        document.body.style.background = colors.background.primary;

        // 更新 Ant Design 主题
        if (mode === "light") {
          document.body.classList.remove("dark-theme");
          document.body.classList.add("light-theme");
        } else {
          document.body.classList.remove("light-theme");
          document.body.classList.add("dark-theme");
        }
      },
    }),
    {
      name: "hvac-theme-storage",
      onRehydrateStorage: () => (state) => {
        // 恢复主题时应用到文档
        if (state) {
          state.applyThemeToDocument();
        }
      },
    }
  )
);

export { darkTheme, lightTheme };
