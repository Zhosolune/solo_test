import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Home from './pages/Home';
import SignalAnalysis from './pages/SignalAnalysis';
import DataManagement from './pages/DataManagement';
import Settings from './pages/Settings';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signal-analysis" element={<SignalAnalysis />} />
      <Route path="/data-management" element={<DataManagement />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ConfigProvider>
  );
}
