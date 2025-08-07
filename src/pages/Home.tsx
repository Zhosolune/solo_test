import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Progress, Statistic, Modal, Checkbox } from 'antd';
import { 
  Play, 
  Database, 
  Settings, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  SettingsIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import type { QuickAction } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { homepageData } = useAppStore();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // 卡片显示配置状态
  const [cardSettings, setCardSettings] = useState({
    systemStatus: true,
    quickActions: true,
    recentRecords: true
  });

  // 快速操作按钮配置
  const quickActions: QuickAction[] = [
    {
      id: 'start-analysis',
      title: '开始信号分析',
      description: '启动新的雷达信号分析任务',
      icon: 'Play',
      route: '/signal-analysis',
      color: '#1890ff'
    },
    {
      id: 'view-data',
      title: '查看数据',
      description: '管理和查看历史分析数据',
      icon: 'Database',
      route: '/data-management',
      color: '#52c41a'
    },
    {
      id: 'system-settings',
      title: '系统设置',
      description: '配置系统参数和算法设置',
      icon: 'Settings',
      route: '/settings',
      color: '#722ed1'
    }
  ];

  // 图标映射
  const iconMap = {
    Play: Play,
    Database: Database,
    Settings: Settings,
    TrendingUp: TrendingUp,
    Activity: Activity,
    Clock: Clock,
    CheckCircle: CheckCircle,
    AlertCircle: AlertCircle
  };

  // 最近分析记录表格列配置
  const columns = [
    {
      title: '分析时间',
      dataIndex: 'analysis_time',
      key: 'analysis_time',
      width: 180,
      render: (timestamp: string) => (
        <span className="text-gray-600">{new Date(timestamp).toLocaleString()}</span>
      )
    },
    {
      title: '文件名',
      dataIndex: 'file_name',
      key: 'file_name',
      width: 150,
      render: (fileName: string) => (
        <Tag color="blue">{fileName}</Tag>
      )
    },
    {
      title: '信号数量',
      dataIndex: 'signal_count',
      key: 'signal_count',
      width: 100,
      render: (count: number) => (
        <span className="font-medium text-blue-600">{count}</span>
      )
    },
    {
      title: '成功率',
      dataIndex: 'success_rate',
      key: 'success_rate',
      width: 100,
      render: (rate: number) => (
        <span className={`font-medium ${
          rate >= 90 ? 'text-green-600' : 
          rate >= 80 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {rate.toFixed(1)}%
        </span>
      )
    },
    {
      title: '处理时间',
      dataIndex: 'processing_time',
      key: 'processing_time',
      width: 100,
      render: (time: number) => (
        <span className="text-gray-600">{time.toFixed(1)}s</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button 
          type="link" 
          size="small"
          onClick={() => navigate('/signal-analysis')}
        >
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen">
      {/* 页面Header */}
      <header className="bg-slate-800 text-white px-6 py-4 shadow-lg h-16 flex justify-between items-center">
        <h1 className="text-xl font-bold">首页</h1>
        <Button
          type="text"
          icon={<SettingsIcon size={20} />}
          className="text-white border-none settings-gear-button"
          onClick={() => setIsSettingsModalOpen(true)}
        />
      </header>
      
      <main className="p-6 space-y-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">雷达信号分析系统</h1>
          <p className="text-gray-600">欢迎使用雷达信号分析系统，开始您的信号处理和分析工作</p>
        </div>

      {/* 系统状态概览 */}
      {cardSettings.systemStatus && (
        <Card title="系统状态概览" className="shadow-sm">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center system-status-card">
                <Statistic
                  title="系统状态"
                  value="正常运行"
                   valueStyle={{ 
                     color: '#52c41a',
                     fontSize: '18px'
                   }}
                  prefix={<Activity size={20} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center system-status-card">
                <Statistic
                  title="CPU使用率"
                  value={homepageData.system_status.cpu_usage}
                  suffix="%"
                  valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                  prefix={<TrendingUp size={20} />}
                />
                <Progress 
                   percent={homepageData.system_status.cpu_usage} 
                  size="small" 
                  showInfo={false}
                  className="mt-2"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center system-status-card">
                <Statistic
                  title="内存使用率"
                  value={homepageData.system_status.memory_usage}
                  suffix="%"
                  valueStyle={{ color: '#722ed1', fontSize: '18px' }}
                  prefix={<Database size={20} />}
                />
                <Progress 
                   percent={homepageData.system_status.memory_usage} 
                  size="small" 
                  showInfo={false}
                  className="mt-2"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center system-status-card">
                <Statistic
                  title="运行时间"
                  value="24小时"
                  valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                  prefix={<Clock size={20} />}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      {/* 快速操作 */}
      {cardSettings.quickActions && (
        <Card title="快速操作" className="shadow-sm">
          <Row gutter={[16, 16]}>
            {quickActions.map((action) => {
              const IconComponent = iconMap[action.icon as keyof typeof iconMap];
              return (
                <Col xs={24} sm={12} lg={8} key={action.id}>
                  <Card 
                    className="h-full cursor-pointer transition-all duration-200 quick-action-card"
                    onClick={() => navigate(action.route)}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        <IconComponent 
                          size={24} 
                          style={{ color: action.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* 最近分析记录 */}
      {cardSettings.recentRecords && (
        <Card 
          title="最近分析记录" 
          className="shadow-sm"
          extra={
            <Button 
              type="primary" 
              onClick={() => navigate('/data-management')}
            >
              查看全部
            </Button>
          }
        >
          <Table
             columns={columns}
             dataSource={homepageData.recent_records}
             pagination={false}
             size="middle"
             rowKey="id"
             className="custom-table"
           />
        </Card>
      )}
      </main>
      
      {/* 卡片设置弹窗 */}
      <Modal
        title="首页卡片设置"
        open={isSettingsModalOpen}
        onOk={() => setIsSettingsModalOpen(false)}
        onCancel={() => setIsSettingsModalOpen(false)}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        <div className="space-y-4">
          <div className="text-gray-600 mb-4">
            选择要在首页显示的卡片：
          </div>
          
          <div className="space-y-3">
            <Checkbox
              checked={cardSettings.systemStatus}
              onChange={(e) => setCardSettings(prev => ({ ...prev, systemStatus: e.target.checked }))}
            >
              <span className="font-medium">系统状态概览</span>
              <div className="text-sm text-gray-500">显示系统运行状态、CPU和内存使用率等信息</div>
            </Checkbox>
            
            <Checkbox
              checked={cardSettings.quickActions}
              onChange={(e) => setCardSettings(prev => ({ ...prev, quickActions: e.target.checked }))}
            >
              <span className="font-medium">快速操作</span>
              <div className="text-sm text-gray-500">提供快速访问信号分析、数据管理和系统设置的入口</div>
            </Checkbox>
            
            <Checkbox
              checked={cardSettings.recentRecords}
              onChange={(e) => setCardSettings(prev => ({ ...prev, recentRecords: e.target.checked }))}
            >
              <span className="font-medium">最近分析记录</span>
              <div className="text-sm text-gray-500">显示最近的信号分析记录和结果</div>
            </Checkbox>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;