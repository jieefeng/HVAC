import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
      },
      "/external-api": {
        target: "http://7af0b3f3.r16.cpolar.top",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/external-api/, ""),
        configure: (proxy) => {
          proxy.on("error", (err, req) => {
            console.log("代理错误:", err.message);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("代理请求:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("代理响应:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["echarts", "echarts-for-react", "d3"],
          ui: ["antd", "styled-components"],
        },
      },
    },
  },
});
