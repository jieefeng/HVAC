import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ComponentVisibilityState {
  visibility: {
    temperature: boolean;
    humidity: boolean;
    energy: boolean;
    energy_pie: boolean;
    airflow: boolean;
    status: boolean;
  };
  toggleComponent: (
    component: keyof ComponentVisibilityState["visibility"]
  ) => void;
  setComponentVisibility: (
    component: keyof ComponentVisibilityState["visibility"],
    visible: boolean
  ) => void;
  getVisibleComponents: () => string[];
  toggleAll: (visible: boolean) => void;
  getVisibilityStats: () => { visible: number; total: number };
  setVisibilityByTemplate: (templateComponents: string[]) => void;
}

export const useComponentVisibilityStore = create<ComponentVisibilityState>()(
  persist(
    (set, get) => ({
      visibility: {
        temperature: true, // 默认显示
        humidity: true, // 默认显示
        energy: true, // 默认显示
        energy_pie: false, // 默认隐藏
        airflow: true, // 默认显示
        status: false, // 默认隐藏
      },

      toggleComponent: (component) =>
        set((state) => ({
          visibility: {
            ...state.visibility,
            [component]: !state.visibility[component],
          },
        })),

      setComponentVisibility: (component, visible) =>
        set((state) => ({
          visibility: {
            ...state.visibility,
            [component]: visible,
          },
        })),

      getVisibleComponents: () => {
        const { visibility } = get();
        return Object.entries(visibility)
          .filter(([_, visible]) => visible)
          .map(([component, _]) => component);
      },

      toggleAll: (visible) =>
        set((state) => {
          const newVisibility = { ...state.visibility };
          Object.keys(newVisibility).forEach((key) => {
            newVisibility[key as keyof typeof newVisibility] = visible;
          });
          return { visibility: newVisibility };
        }),

      getVisibilityStats: () => {
        const { visibility } = get();
        const visibleCount = Object.values(visibility).filter(Boolean).length;
        const totalCount = Object.keys(visibility).length;
        return { visible: visibleCount, total: totalCount };
      },

      setVisibilityByTemplate: (templateComponents) =>
        set((state) => {
          const newVisibility = { ...state.visibility };
          // 首先将所有组件设为不可见
          Object.keys(newVisibility).forEach((key) => {
            newVisibility[key as keyof typeof newVisibility] = false;
          });
          // 然后将模板中的组件设为可见
          templateComponents.forEach((component) => {
            if (component in newVisibility) {
              newVisibility[component as keyof typeof newVisibility] = true;
            }
          });
          return { visibility: newVisibility };
        }),
    }),
    {
      name: "component-visibility-storage",
    }
  )
);
