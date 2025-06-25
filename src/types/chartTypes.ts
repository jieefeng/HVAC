// 图表相关类型定义

export interface ChartImageData {
  id: string;
  type:
    | "temperature"
    | "humidity"
    | "energy"
    | "energy_pie"
    | "airflow"
    | "system_status";
  title: string;
  imageBase64: string;
  timestamp: string;
  status: "success" | "error" | "loading";
  error?: string;
}

export interface ChartConfig {
  component: string;
  span: number;
  title?: string;
  height?: number;
}

export interface TemplateConfig {
  name: string;
  layout: ChartConfig[];
}

export interface DashboardTemplate {
  [key: string]: TemplateConfig;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// 图表API响应类型
export interface ChartApiResponse extends ApiResponse {
  data?: string; // base64 图片数据
}

// 仪表板状态类型
export interface DashboardState {
  selectedTemplate: string;
  isRealTime: boolean;
  refreshInterval: number;
  isLoading: boolean;
  error: string | null;
}
