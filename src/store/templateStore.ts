import Dexie, { Table } from "dexie";
import { create } from "zustand";

// 模板接口定义
export interface Template {
  id?: number;
  name: string;
  description: string;
  preview: string;
  config: TemplateConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateConfig {
  layout: "grid" | "flex" | "custom";
  components: ComponentConfig[];
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  refreshInterval: number;
  dataSource: string;
}

export interface ComponentConfig {
  id: string;
  type:
    | "temperature"
    | "humidity"
    | "energy"
    | "airflow"
    | "pressure"
    | "status"
    | "weather"
    | "alerts"
    | "realtime";
  position: { x: number; y: number; w: number; h: number };
  title: string;
  visible: boolean;
  config: any;
}

// Dexie 数据库配置
class TemplateDatabase extends Dexie {
  templates!: Table<Template>;

  constructor() {
    super("HVACTemplateDB");
    this.version(1).stores({
      templates: "++id, name, isActive, createdAt, updatedAt",
    });
  }
}

const db = new TemplateDatabase();

// 默认模板数据
const defaultTemplates: Omit<Template, "id">[] = [
  {
    name: "经典监控模板",
    description: "基础温湿度能耗监控",
    preview: " ",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    config: {
      layout: "grid",
      components: [
        {
          id: "temp-1",
          type: "temperature",
          position: { x: 0, y: 0, w: 6, h: 4 },
          title: "温度监控",
          visible: true,
          config: { showHistory: true, alertThreshold: 30 },
        },
        {
          id: "humidity-1",
          type: "humidity",
          position: { x: 6, y: 0, w: 6, h: 4 },
          title: "湿度监控",
          visible: true,
          config: { showHistory: true, alertThreshold: 70 },
        },
        {
          id: "energy-1",
          type: "energy",
          position: { x: 0, y: 4, w: 12, h: 4 },
          title: "能耗监控",
          visible: true,
          config: { showTrend: true, period: "24h" },
        },
      ],
      theme: {
        primaryColor: "#1890ff",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        textColor: "#ffffff",
      },
      refreshInterval: 5000,
      dataSource: "websocket",
    },
  },
  {
    name: "能耗分析模板",
    description: "专注能耗分析优化",
    preview: " ",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    config: {
      layout: "flex",
      components: [
        {
          id: "energy-main",
          type: "energy",
          position: { x: 0, y: 0, w: 8, h: 6 },
          title: "能耗趋势",
          visible: true,
          config: { chartType: "line", period: "7d" },
        },
        {
          id: "weather-1",
          type: "weather",
          position: { x: 8, y: 0, w: 4, h: 3 },
          title: "天气影响",
          visible: true,
          config: { showForecast: true },
        },
        {
          id: "realtime-1",
          type: "realtime",
          position: { x: 8, y: 3, w: 4, h: 3 },
          title: "实时数据",
          visible: true,
          config: { metrics: ["energy", "efficiency"] },
        },
      ],
      theme: {
        primaryColor: "#faad14",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        textColor: "#ffffff",
      },
      refreshInterval: 3000,
      dataSource: "api",
    },
  },
  {
    name: "系统状态模板",
    description: "全面系统运行监控",
    preview: " ",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    config: {
      layout: "custom",
      components: [
        {
          id: "status-main",
          type: "status",
          position: { x: 0, y: 0, w: 6, h: 4 },
          title: "系统状态",
          visible: true,
          config: { showDetails: true },
        },
        {
          id: "alerts-1",
          type: "alerts",
          position: { x: 6, y: 0, w: 6, h: 4 },
          title: "系统报警",
          visible: true,
          config: { maxItems: 10, autoRefresh: true },
        },
        {
          id: "pressure-1",
          type: "pressure",
          position: { x: 0, y: 4, w: 4, h: 4 },
          title: "压力监控",
          visible: true,
          config: { gaugeType: "arc", range: [95, 105] },
        },
        {
          id: "airflow-1",
          type: "airflow",
          position: { x: 4, y: 4, w: 4, h: 4 },
          title: "空气流量",
          visible: true,
          config: { gaugeType: "circle", unit: "m³/h" },
        },
        {
          id: "realtime-2",
          type: "realtime",
          position: { x: 8, y: 4, w: 4, h: 4 },
          title: "关键指标",
          visible: true,
          config: { layout: "compact" },
        },
      ],
      theme: {
        primaryColor: "#52c41a",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        textColor: "#ffffff",
      },
      refreshInterval: 2000,
      dataSource: "websocket",
    },
  },
];

// Zustand 状态管理
interface TemplateStore {
  templates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;

  // 操作方法
  loadTemplates: () => Promise<void>;
  createTemplate: (
    template: Omit<Template, "id" | "createdAt" | "updatedAt">
  ) => Promise<number>;
  updateTemplate: (id: number, updates: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: number) => Promise<void>;
  duplicateTemplate: (id: number, newName?: string) => Promise<number>;
  setCurrentTemplate: (template: Template | null) => void;
  toggleTemplateActive: (id: number) => Promise<void>;
  initializeDefaultTemplates: () => Promise<void>;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: [],
  currentTemplate: null,
  isLoading: false,

  loadTemplates: async () => {
    set({ isLoading: true });
    try {
      const templates = await db.templates
        .orderBy("updatedAt")
        .reverse()
        .toArray();
      set({ templates, isLoading: false });
    } catch (error) {
      console.error("加载模板失败:", error);
      set({ isLoading: false });
    }
  },

  createTemplate: async (templateData) => {
    const template: Omit<Template, "id"> = {
      ...templateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const id = await db.templates.add(template);
    await get().loadTemplates();
    return id as number;
  },

  updateTemplate: async (id, updates) => {
    await db.templates.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
    await get().loadTemplates();
  },

  deleteTemplate: async (id) => {
    await db.templates.delete(id);
    await get().loadTemplates();
  },

  duplicateTemplate: async (id, newName) => {
    const original = await db.templates.get(id);
    if (!original) throw new Error("模板不存在");

    const duplicate: Omit<Template, "id"> = {
      ...original,
      name: newName || `${original.name} - 副本`,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newId = await db.templates.add(duplicate);
    await get().loadTemplates();
    return newId as number;
  },

  setCurrentTemplate: (template) => {
    set({ currentTemplate: template });
  },

  toggleTemplateActive: async (id) => {
    const template = await db.templates.get(id);
    if (template) {
      await db.templates.update(id, {
        isActive: !template.isActive,
        updatedAt: new Date(),
      });
      await get().loadTemplates();
    }
  },

  initializeDefaultTemplates: async () => {
    const count = await db.templates.count();
    if (count === 0) {
      // 如果没有模板，初始化默认模板
      for (const template of defaultTemplates) {
        await db.templates.add(template);
      }
      await get().loadTemplates();
    }
  },
}));

export { db };
