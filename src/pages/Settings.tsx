import React, { useState } from 'react';
import { Card, Form, InputNumber, Switch, Select, Button, Progress, Alert, Tabs } from 'antd';
import { Save, RotateCcw, Monitor, Cpu, HardDrive, Wifi } from 'lucide-react';
import type { TabsProps } from 'antd';
import MainLayout from '../components/Layout';

const { Option } = Select;

interface SystemSettings {
  // 算法参数
  defaultEpsilonCF: number;
  defaultEpsilonPW: number;
  defaultMinPts: number;
  defaultPAWeight: number;
  defaultDTOAWeight: number;
  defaultJointThreshold: number;
  
  // 系统配置
  maxConcurrentTasks: number;
  autoSaveInterval: number;
  logLevel: string;
  enableRealTimeProcessing: boolean;
  enableAutoBackup: boolean;
  
  // 显示设置
  chartRefreshRate: number;
  maxDisplayPoints: number;
  enableAnimations: boolean;
  theme: string;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 默认设置
  const defaultSettings: SystemSettings = {
    defaultEpsilonCF: 0.5,
    defaultEpsilonPW: 0.3,
    defaultMinPts: 5,
    defaultPAWeight: 0.6,
    defaultDTOAWeight: 0.4,
    defaultJointThreshold: 0.8,
    maxConcurrentTasks: 4,
    autoSaveInterval: 300,
    logLevel: 'info',
    enableRealTimeProcessing: true,
    enableAutoBackup: true,
    chartRefreshRate: 100,
    maxDisplayPoints: 1000,
    enableAnimations: true,
    theme: 'light'
  };

  // 系统状态数据
  const systemStatus = {
    cpu: { usage: 45.2, temperature: 65 },
    memory: { usage: 62.8, total: 16, used: 10.1 },
    disk: { usage: 78.5, total: 500, used: 392.5 },
    network: { status: 'connected', latency: 12 }
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('保存设置:', values);
      setHasUnsavedChanges(false);
      // 这里可以调用API保存设置
    });
  };

  const handleReset = () => {
    form.setFieldsValue(defaultSettings);
    setHasUnsavedChanges(true);
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  // 算法参数设置
  const AlgorithmSettings = () => (
    <div className="space-y-6">
      <Card title="默认聚类参数" size="small">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="epsilon_CF"
            name="defaultEpsilonCF"
            rules={[{ required: true, message: '请输入CF维度聚类参数' }]}
          >
            <InputNumber
              step={0.1}
              min={0}
              max={2}
              className="w-full"
              placeholder="CF维度聚类参数"
            />
          </Form.Item>
          <Form.Item
            label="epsilon_PW"
            name="defaultEpsilonPW"
            rules={[{ required: true, message: '请输入PW维度聚类参数' }]}
          >
            <InputNumber
              step={0.1}
              min={0}
              max={2}
              className="w-full"
              placeholder="PW维度聚类参数"
            />
          </Form.Item>
          <Form.Item
            label="min_pts"
            name="defaultMinPts"
            rules={[{ required: true, message: '请输入最小点数' }]}
          >
            <InputNumber
              step={1}
              min={1}
              max={20}
              className="w-full"
              placeholder="最小点数"
            />
          </Form.Item>
        </div>
      </Card>

      <Card title="默认识别参数" size="small">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="PA判别权重"
            name="defaultPAWeight"
            rules={[{ required: true, message: '请输入PA判别权重' }]}
          >
            <InputNumber
              step={0.1}
              min={0}
              max={1}
              className="w-full"
              placeholder="PA判别权重"
            />
          </Form.Item>
          <Form.Item
            label="DTOA判别权重"
            name="defaultDTOAWeight"
            rules={[{ required: true, message: '请输入DTOA判别权重' }]}
          >
            <InputNumber
              step={0.1}
              min={0}
              max={1}
              className="w-full"
              placeholder="DTOA判别权重"
            />
          </Form.Item>
          <Form.Item
            label="联合判别门限"
            name="defaultJointThreshold"
            rules={[{ required: true, message: '请输入联合判别门限' }]}
          >
            <InputNumber
              step={0.1}
              min={0}
              max={1}
              className="w-full"
              placeholder="联合判别门限"
            />
          </Form.Item>
        </div>
      </Card>
    </div>
  );

  // 系统配置
  const SystemConfig = () => (
    <div className="space-y-6">
      <Card title="性能设置" size="small">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="最大并发任务数"
            name="maxConcurrentTasks"
            rules={[{ required: true, message: '请输入最大并发任务数' }]}
          >
            <InputNumber
              step={1}
              min={1}
              max={16}
              className="w-full"
              placeholder="最大并发任务数"
            />
          </Form.Item>
          <Form.Item
            label="自动保存间隔(秒)"
            name="autoSaveInterval"
            rules={[{ required: true, message: '请输入自动保存间隔' }]}
          >
            <InputNumber
              step={60}
              min={60}
              max={3600}
              className="w-full"
              placeholder="自动保存间隔"
            />
          </Form.Item>
        </div>
      </Card>

      <Card title="系统选项" size="small">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>启用实时处理</span>
            <Form.Item name="enableRealTimeProcessing" valuePropName="checked" className="mb-0">
              <Switch />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center">
            <span>启用自动备份</span>
            <Form.Item name="enableAutoBackup" valuePropName="checked" className="mb-0">
              <Switch />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center">
            <span>日志级别</span>
            <Form.Item name="logLevel" className="mb-0">
              <Select style={{ width: 120 }}>
                <Option value="debug">Debug</Option>
                <Option value="info">Info</Option>
                <Option value="warn">Warning</Option>
                <Option value="error">Error</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  );

  // 显示设置
  const DisplaySettings = () => (
    <div className="space-y-6">
      <Card title="图表设置" size="small">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="刷新频率(ms)"
            name="chartRefreshRate"
            rules={[{ required: true, message: '请输入图表刷新频率' }]}
          >
            <InputNumber
              step={50}
              min={50}
              max={1000}
              className="w-full"
              placeholder="图表刷新频率"
            />
          </Form.Item>
          <Form.Item
            label="最大显示点数"
            name="maxDisplayPoints"
            rules={[{ required: true, message: '请输入最大显示点数' }]}
          >
            <InputNumber
              step={100}
              min={100}
              max={10000}
              className="w-full"
              placeholder="最大显示点数"
            />
          </Form.Item>
        </div>
      </Card>

      <Card title="界面设置" size="small">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>启用动画效果</span>
            <Form.Item name="enableAnimations" valuePropName="checked" className="mb-0">
              <Switch />
            </Form.Item>
          </div>
          <div className="flex justify-between items-center">
            <span>主题</span>
            <Form.Item name="theme" className="mb-0">
              <Select style={{ width: 120 }}>
                <Option value="light">浅色</Option>
                <Option value="dark">深色</Option>
                <Option value="auto">自动</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  );

  // 系统监控
  const SystemMonitor = () => (
    <div className="space-y-6">
      <Card title="系统状态" size="small">
        <div className="grid grid-cols-2 gap-6">
          {/* CPU状态 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-blue-500" />
              <span className="font-medium">CPU</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>使用率</span>
                <span>{systemStatus.cpu.usage}%</span>
              </div>
              <Progress percent={systemStatus.cpu.usage} size="small" />
              <div className="flex justify-between text-sm">
                <span>温度</span>
                <span>{systemStatus.cpu.temperature}°C</span>
              </div>
            </div>
          </div>

          {/* 内存状态 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Monitor size={16} className="text-green-500" />
              <span className="font-medium">内存</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>使用率</span>
                <span>{systemStatus.memory.usage}%</span>
              </div>
              <Progress percent={systemStatus.memory.usage} size="small" />
              <div className="flex justify-between text-sm">
                <span>已用/总计</span>
                <span>{systemStatus.memory.used}GB / {systemStatus.memory.total}GB</span>
              </div>
            </div>
          </div>

          {/* 磁盘状态 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-orange-500" />
              <span className="font-medium">磁盘</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>使用率</span>
                <span>{systemStatus.disk.usage}%</span>
              </div>
              <Progress percent={systemStatus.disk.usage} size="small" />
              <div className="flex justify-between text-sm">
                <span>已用/总计</span>
                <span>{systemStatus.disk.used}GB / {systemStatus.disk.total}GB</span>
              </div>
            </div>
          </div>

          {/* 网络状态 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wifi size={16} className="text-purple-500" />
              <span className="font-medium">网络</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>状态</span>
                <span className="text-green-600">已连接</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>延迟</span>
                <span>{systemStatus.network.latency}ms</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'algorithm',
      label: '算法参数',
      children: <AlgorithmSettings />
    },
    {
      key: 'system',
      label: '系统配置',
      children: <SystemConfig />
    },
    {
      key: 'display',
      label: '显示设置',
      children: <DisplaySettings />
    },
    {
      key: 'monitor',
      label: '系统监控',
      children: <SystemMonitor />
    }
  ];

  const pageHeader = (
    <div className="bg-slate-800 text-white px-6 py-4 shadow-lg flex items-center justify-between">
      <h1 className="text-xl font-bold">系统设置</h1>
      <div className="flex gap-3">
        <Button 
          icon={<RotateCcw size={16} />} 
          onClick={handleReset}
          className="text-white border-white hover:bg-slate-700"
        >
          重置默认
        </Button>
        <Button 
          type="primary" 
          icon={<Save size={16} />} 
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className="bg-blue-600 hover:bg-blue-700"
        >
          保存设置
        </Button>
      </div>
    </div>
  );

  return (
    <MainLayout pageHeader={pageHeader}>
      <div className="p-6 space-y-6">

        {/* 未保存更改提示 */}
        {hasUnsavedChanges && (
          <Alert
            message="您有未保存的更改"
            description="请记得保存您的设置更改"
            type="warning"
            showIcon
            closable
          />
        )}

        {/* 设置表单 */}
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultSettings}
          onValuesChange={handleFormChange}
        >
          <Card>
            <Tabs items={tabItems} />
          </Card>
        </Form>
      </div>
    </MainLayout>
  );
};

export default Settings;