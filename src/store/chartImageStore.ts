import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  ChartImages,
  fetchAllChartImages,
  fetchChartImage,
  ChartType,
} from "../services/chartImageService";

interface ChartImageStore {
  chartImages: ChartImages;
  isLoading: boolean;
  error: string | null;
  realTimeInterval: number | null;

  // Actions
  fetchAllImages: () => Promise<void>;
  fetchSingleImage: (chartType: ChartType) => Promise<void>;
  startRealTimeUpdates: (interval: number) => void;
  stopRealTimeUpdates: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearImages: () => void;
}

export const useChartImageStore = create<ChartImageStore>()(
  devtools(
    (set, get) => ({
      chartImages: {},
      isLoading: false,
      error: null,
      realTimeInterval: null,

      fetchAllImages: async () => {
        set({ isLoading: true, error: null });
        try {
          const images = await fetchAllChartImages();
          set({
            chartImages: images,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "获取图片失败",
            isLoading: false,
          });
        }
      },

      fetchSingleImage: async (chartType: ChartType) => {
        set({ isLoading: true, error: null });
        try {
          const result = await fetchChartImage(chartType);
          if (result.success && result.data) {
            set((state) => ({
              chartImages: {
                ...state.chartImages,
                [chartType]: result.data,
              },
              isLoading: false,
            }));
          } else {
            set({ error: result.error || "获取图片失败", isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "获取图片失败",
            isLoading: false,
          });
        }
      },

      startRealTimeUpdates: (interval: number) => {
        const currentInterval = get().realTimeInterval;
        if (currentInterval) {
          clearInterval(currentInterval);
        }

        const newInterval = setInterval(async () => {
          try {
            const images = await fetchAllChartImages();
            set({ chartImages: images });
          } catch (error) {
            console.error("实时更新图片失败:", error);
          }
        }, interval);

        set({ realTimeInterval: newInterval as unknown as number });
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
      clearImages: () => set({ chartImages: {} }),
    }),
    {
      name: "chart-image-store",
    }
  )
);
