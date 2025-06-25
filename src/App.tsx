import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import MainDashboard from "./pages/MainDashboard";
import TemplateManager from "./pages/TemplateManager";
import DataConfig from "./pages/DataConfig";
import HVACControl from "./pages/HVACControl";
// import Sidebar from "./components/Sidebar";
import SideDataBar from "./components/SiderDataBar";
import FractalBackground from "./components/FractalBackground";
import { useThemeStore } from "./store/themeStore";
import "./App.css";
import "./styles/theme.css";

const { Content } = Layout;

const App: React.FC = () => {
  const { applyThemeToDocument } = useThemeStore();

  // 初始化主题
  useEffect(() => {
    applyThemeToDocument();
  }, [applyThemeToDocument]);

  return (
    <div className="App">
      <FractalBackground />
      <Layout style={{ minHeight: "100vh", background: "transparent",overflow: "scroll" }}>
        <SideDataBar />
        <Layout>
          <Content
            style={{
              padding: "24px",
              background: "transparent",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<MainDashboard />} />
              <Route path="/dashboard" element={<MainDashboard />} />
              <Route path="/templates" element={<TemplateManager />} />
              <Route path="/data-config" element={<DataConfig />} />
              <Route path="/hvac-control" element={<HVACControl />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
