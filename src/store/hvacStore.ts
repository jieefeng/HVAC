import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface HVACData {
  temperature: {
    current: number;
    target: number;
    history: Array<{ time: string; value: number }>;
  };
  humidity: {
    current: number;
    target: number;
    history: Array<{ time: string; value: number }>;
  };
  airFlow: {
    current: number;
    target: number;
    history: Array<{ time: string; value: number }>;
  };
  pressure: {
    current: number;
    target: number;
    history: Array<{ time: string; value: number }>;
  };
  energy: {
    current: number;
    today: number;
    thisMonth: number;
    history: Array<{ time: string; value: number }>;
  };
  systemStatus: {
    online: boolean;
    mode: "cooling" | "heating" | "auto" | "off";
    efficiency: number;
    lastMaintenance: string;
  };
  alerts: Array<{
    id: string;
    type: "warning" | "error" | "info";
    message: string;
    timestamp: string;
  }>;
  weather: {
    temperature: number;
    humidity: number;
    condition: string;
    forecast: Array<{
      date: string;
      temperature: { min: number; max: number };
      condition: string;
    }>;
  };
}

interface HVACStore {
  hvacData: HVACData | null;
  isLoading: boolean;
  error: string | null;
  realTimeInterval: NodeJS.Timeout | null;

  // Actions
  fetchHVACData: () => Promise<void>;
  updateHVACData: (data: Partial<HVACData>) => void;
  startRealTimeUpdates: (interval: number) => void;
  stopRealTimeUpdates: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 模拟数据生成函数
const generateMockData = (): HVACData => {
  const now = new Date();
  const generateHistory = (baseValue: number, count: number = 24) => {
    return Array.from({ length: count }, (_, i) => ({
      time: new Date(
        now.getTime() - (count - i) * 60 * 60 * 1000
      ).toISOString(),
      value: baseValue + (Math.random() - 0.5) * 10,
    }));
  };

  return {
    temperature: {
      current: 22 + Math.random() * 4,
      target: 24,
      history: generateHistory(23),
    },
    humidity: {
      current: 45 + Math.random() * 10,
      target: 50,
      history: generateHistory(48),
    },
    airFlow: {
      current: 1500 + Math.random() * 300,
      target: 1600,
      history: generateHistory(1550),
    },
    pressure: {
      current: 101.3 + Math.random() * 2,
      target: 101.5,
      history: generateHistory(101.4),
    },
    energy: {
      current: 8.5 + Math.random() * 2,
      today: 180 + Math.random() * 40,
      thisMonth: 5400 + Math.random() * 1000,
      history: generateHistory(8.8),
    },
    systemStatus: {
      online: Math.random() > 0.1,
      mode: ["cooling", "heating", "auto"][
        Math.floor(Math.random() * 3)
      ] as any,
      efficiency: 85 + Math.random() * 10,
      lastMaintenance: new Date(
        now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    alerts: [
      {
        id: "1",
        type: "warning",
        message: "温度传感器读数异常",
        timestamp: new Date(
          now.getTime() - Math.random() * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "2",
        type: "info",
        message: "系统运行正常",
        timestamp: new Date(
          now.getTime() - Math.random() * 12 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
    weather: {
      temperature: 28 + Math.random() * 8,
      humidity: 60 + Math.random() * 20,
      condition: ["晴", "多云", "阴", "雨"][Math.floor(Math.random() * 4)],
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(now.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
        temperature: {
          min: 20 + Math.random() * 5,
          max: 30 + Math.random() * 8,
        },
        condition: ["晴", "多云", "阴", "雨"][Math.floor(Math.random() * 4)],
      })),
    },
  };
};

export const useHVACStore = create<HVACStore>()(
  devtools(
    (set, get) => ({
      hvacData: null,
      isLoading: false,
      error: null,
      realTimeInterval: null,

      fetchHVACData: async () => {
        set({ isLoading: true, error: null });
        try {
          // 模拟API调用
          await new Promise((resolve) => setTimeout(resolve, 10000));
          const data = generateMockData();
          set({ hvacData: data, isLoading: false });
        } catch (error) {
          set({ error: "获取数据失败", isLoading: false });
        }
      },

      updateHVACData: (data) => {
        const current = get().hvacData;
        if (current) {
          set({ hvacData: { ...current, ...data } });
        }
      },

      startRealTimeUpdates: (interval) => {
        const currentInterval = get().realTimeInterval;
        if (currentInterval) {
          clearInterval(currentInterval);
        }

        const newInterval = setInterval(() => {
          const data = generateMockData();
          set({ hvacData: data });
        }, interval);

        set({ realTimeInterval: newInterval });
      },

      stopRealTimeUpdates: () => {
        const interval = get().realTimeInterval;
        if (interval) {
          clearInterval(interval);
          set({ realTimeInterval: null });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "hvac-store",
    }
  )
);
