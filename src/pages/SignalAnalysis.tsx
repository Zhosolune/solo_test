import React from 'react';
import { Card, Button, InputNumber, Table, Progress, Tag } from 'antd';
import { Play, RotateCcw, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useAppStore } from '../store';
import type { RadarSignal } from '../types';
import MainLayout from '../components/Layout';

const SignalAnalysis: React.FC = () => {
  const {
    clusteringParams,
    recognitionParams,
    // processingResult, // Reserved for future use
    updateClusteringParams,
    updateRecognitionParams,
    isLoading
  } = useAppStore();

  // 模拟信号数据
  const mockSignals: RadarSignal[] = [
    {
      id: '1',
      frequency_mhz: 2450.5,
      pulseWidth_us: 1.2,
      pri_us: 1000,
      doa_degree: 45.3,
      confidence: 0.94,
      signalType: 'Type-A'
    },
    {
      id: '2',
      frequency_mhz: 3200.8,
      pulseWidth_us: 0.8,
      pri_us: 800,
      doa_degree: 120.7,
      confidence: 0.87,
      signalType: 'Type-B'
    },
    {
      id: '3',
      frequency_mhz: 5800.2,
      pulseWidth_us: 2.1,
      pri_us: 1500,
      doa_degree: 280.1,
      confidence: 0.91,
      signalType: 'Type-C'
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '载频/MHz',
      dataIndex: 'frequency_mhz',
      key: 'frequency_mhz',
      render: (value: number) => value.toFixed(1)
    },
    {
      title: '脉宽/us',
      dataIndex: 'pulseWidth_us',
      key: 'pulseWidth_us',
      render: (value: number) => value.toFixed(1)
    },
    {
      title: 'PRI/us',
      dataIndex: 'pri_us',
      key: 'pri_us',
      render: (value: number) => value.toFixed(0)
    },
    {
      title: 'DOA/°',
      dataIndex: 'doa_degree',
      key: 'doa_degree',
      render: (value: number) => value.toFixed(1)
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Progress 
            percent={value * 100} 
            size="small" 
            className="w-16"
            showInfo={false}
          />
          <span className="text-sm">{(value * 100).toFixed(1)}%</span>
        </div>
      )
    },
    {
      title: '信号类型',
      dataIndex: 'signalType',
      key: 'signalType',
      render: (type: string) => (
        <Tag color={type === 'Type-A' ? 'blue' : type === 'Type-B' ? 'green' : 'orange'}>
          {type}
        </Tag>
      )
    }
  ];

  const pageHeader = (
    <div className="bg-slate-800 text-white px-6 py-4 shadow-lg h-full flex items-center">
      <h1 className="text-xl font-bold">信号分析</h1>
    </div>
  );

  const pageFooter = (
    <div className="flex justify-between items-center px-4 h-full">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600">当前数据包:</span>
        <span className="text-xs font-medium">Package_001.bin</span>
        <span className="text-xs text-gray-600">预计切片数:</span>
        <span className="text-xs font-medium">128</span>
        <span className="text-xs text-gray-600">当前切片:</span>
        <span className="text-xs font-medium">45/128</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress percent={35} size="small" className="w-24" />
      </div>
    </div>
  );

  return (
    <MainLayout pageHeader={pageHeader} pageFooter={pageFooter}>
      <div className="p-6 flex gap-6 h-full">
        {/* 左侧信号显示区域 - 动态宽度 */}
        <div className="flex-1">
          {/* 信号显示区域 - 两列卡片，每列5个图像窗格 */}
          <div className="flex gap-[10px] h-full">
            {/* 第一列卡片 - 5个图像窗格 */}
            <Card className="flex-1 shadow-sm flex flex-col signal-display-card color-[#1890ff]" title="切片图像">
              <div className="flex flex-col gap-3 h-full">
                {Array.from({ length: 5 }, (_, index) => {
                  const labels = ['载频', '脉宽', '幅度', '一级差', '方位角'];
                  return (
                    <div key={index} className="flex-1 flex items-center gap-1">
                      {/* 左侧竖排标签 */}
                      <div className="w-5 h-full flex items-center justify-center">
                        <span className="text-xs text-gray-600 writing-mode-vertical-rl text-orientation-mixed">
                          {labels[index]}
                        </span>
                      </div>
                      {/* 图像窗格 */}
                      <div className="flex-1 h-full signal-box-fixed">
                        信号 {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            
            {/* 第二列卡片 - 5个图像窗格 */}
            <Card className="flex-1 shadow-sm flex flex-col signal-display-card" title="聚类图像">
              <div className="flex flex-col gap-3 h-full">
                {Array.from({ length: 5 }, (_, index) => {
                  const labels = ['载频', '脉宽', '幅度', '一级差', '方位角'];
                  return (
                    <div key={index + 5} className="flex-1 flex items-center gap-1">
                      {/* 左侧竖排标签 */}
                      <div className="w-5 h-full flex items-center justify-center">
                        <span className="text-xs text-gray-600 writing-mode-vertical-rl text-orientation-mixed">
                          {labels[index]}
                        </span>
                      </div>
                      {/* 图像窗格 */}
                      <div className="flex-1 h-full signal-box-fixed">
                        信号 {index + 6}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* 右侧控制面板 - 固定500px宽度 */}
        <div className="w-[500px] space-y-4 overflow-y-auto h-full">
          {/* 聚类参数设置 */}
          <Card title="聚类参数设置" className="shadow-sm">
            <div className="param-panel">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CF维度聚类参数 (epsilon_CF)
                  </label>
                  <InputNumber
                    value={clusteringParams.epsilon_CF}
                    onChange={(value) => updateClusteringParams({ epsilon_CF: value || 0 })}
                    step={0.1}
                    min={0}
                    max={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PW维度聚类参数 (epsilon_PW)
                  </label>
                  <InputNumber
                    value={clusteringParams.epsilon_PW}
                    onChange={(value) => updateClusteringParams({ epsilon_PW: value || 0 })}
                    step={0.1}
                    min={0}
                    max={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最小点数 (min_pts)
                  </label>
                  <InputNumber
                    value={clusteringParams.min_pts}
                    onChange={(value) => updateClusteringParams({ min_pts: value || 1 })}
                    min={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 识别参数设置 */}
          <Card title="识别参数设置" className="shadow-sm">
            <div className="param-panel">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PA判别权重
                  </label>
                  <InputNumber
                    value={recognitionParams.PA_weight}
                    onChange={(value) => updateRecognitionParams({ PA_weight: value || 0 })}
                    step={0.1}
                    min={0}
                    max={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DTOA判别权重
                  </label>
                  <InputNumber
                    value={recognitionParams.DTOA_weight}
                    onChange={(value) => updateRecognitionParams({ DTOA_weight: value || 0 })}
                    step={0.1}
                    min={0}
                    max={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联合判别门限
                  </label>
                  <InputNumber
                    value={recognitionParams.joint_threshold}
                    onChange={(value) => updateRecognitionParams({ joint_threshold: value || 0 })}
                    step={0.1}
                    min={0}
                    max={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 处理控制 */}
          <Card title="处理控制" className="shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Button type="primary" icon={<Play size={16} />} loading={isLoading} size="small">
                开始切片
              </Button>
              <Button icon={<Play size={16} />} size="small">
                识别
              </Button>
              <Button icon={<Settings size={16} />} size="small">
                合并亲单
              </Button>
              <Button icon={<ChevronLeft size={16} />} size="small">
                下一类
              </Button>
              <Button icon={<ChevronRight size={16} />} size="small">
                下一片
              </Button>
              <Button icon={<RotateCcw size={16} />} size="small">
                重置当前切片
              </Button>
              <Button type="default" size="small">
                全速处理
              </Button>
              <Button type="default" size="small">
                显示全部聚类结果
              </Button>
              <Button type="default" size="small">
                仅显示识别后结果
              </Button>
            </div>
          </Card>

          {/* 雷达信号识别结果表格 */}
          <Card title="雷达信号识别结果" className="shadow-sm">
            <Table
              columns={columns}
              dataSource={mockSignals}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              size="small"
              loading={isLoading}
              className="result-table"
              scroll={{ y: 200 }}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignalAnalysis;