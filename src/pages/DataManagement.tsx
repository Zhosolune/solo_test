import React, { useState } from 'react';
import { Card, Table, Button, Upload, Modal, Tag, Space, Input, DatePicker, Select } from 'antd';
import { Upload as UploadIcon, Download, Trash2, Eye, Search, Filter } from 'lucide-react';
import type { UploadProps } from 'antd';
// import dayjs from 'dayjs'; // Reserved for future use

const { Search: AntSearch } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface DataFile {
  id: string;
  fileName: string;
  fileSize: string;
  uploadTime: string;
  status: 'processed' | 'pending' | 'error';
  signalCount?: number;
  successRate?: number;
  processingTime?: number;
}

const DataManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 模拟数据文件列表
  const mockDataFiles: DataFile[] = [
    {
      id: '1',
      fileName: 'radar_data_001.bin',
      fileSize: '125.6 MB',
      uploadTime: '2024-01-15 14:30:25',
      status: 'processed',
      signalCount: 156,
      successRate: 94.2,
      processingTime: 12.5
    },
    {
      id: '2',
      fileName: 'radar_data_002.bin',
      fileSize: '89.3 MB',
      uploadTime: '2024-01-15 13:15:10',
      status: 'processed',
      signalCount: 203,
      successRate: 91.8,
      processingTime: 18.3
    },
    {
      id: '3',
      fileName: 'radar_data_003.bin',
      fileSize: '67.8 MB',
      uploadTime: '2024-01-15 12:45:33',
      status: 'pending',
      signalCount: undefined,
      successRate: undefined,
      processingTime: undefined
    },
    {
      id: '4',
      fileName: 'radar_data_004.bin',
      fileSize: '156.2 MB',
      uploadTime: '2024-01-15 11:20:15',
      status: 'error',
      signalCount: undefined,
      successRate: undefined,
      processingTime: undefined
    },
    {
      id: '5',
      fileName: 'radar_data_005.bin',
      fileSize: '98.7 MB',
      uploadTime: '2024-01-15 10:30:42',
      status: 'processed',
      signalCount: 89,
      successRate: 96.1,
      processingTime: 8.7
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <span className="font-medium text-blue-600">{text}</span>
      )
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize'
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          processed: { color: 'green', text: '已处理' },
          pending: { color: 'orange', text: '待处理' },
          error: { color: 'red', text: '处理失败' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '信号数量',
      dataIndex: 'signalCount',
      key: 'signalCount',
      render: (count: number | undefined) => count ? count.toString() : '-'
    },
    {
      title: '识别成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number | undefined) => rate ? `${rate.toFixed(1)}%` : '-'
    },
    {
      title: '处理耗时',
      dataIndex: 'processingTime',
      key: 'processingTime',
      render: (time: number | undefined) => time ? `${time.toFixed(1)}s` : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: DataFile) => (
        <Space size="small">
          <Button
            type="link"
            icon={<Eye size={14} />}
            size="small"
            disabled={record.status !== 'processed'}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<Download size={14} />}
            size="small"
            disabled={record.status !== 'processed'}
          >
            导出
          </Button>
          <Button
            type="link"
            danger
            icon={<Trash2 size={14} />}
            size="small"
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.bin,.dat,.csv,.json',
    beforeUpload: () => {
      return false; // 阻止自动上传
    },
    onChange(info) {
      console.log('文件上传:', info.fileList);
    }
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  // 过滤数据
  const filteredData = mockDataFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      {/* 页面Header */}
      <header className="bg-slate-800 text-white px-6 py-4 shadow-lg h-16">
        <h1 className="text-xl font-bold">数据管理</h1>
      </header>

      <main className="p-6 space-y-6">
        {/* 页面标题和操作按钮 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">数据管理</h1>
          <Space>
            <Button
              type="primary"
              icon={<UploadIcon size={16} />}
              onClick={() => setIsUploadModalVisible(true)}
            >
              导入数据
            </Button>
            <Button
              icon={<Download size={16} />}
              disabled={selectedRowKeys.length === 0}
            >
              批量导出
            </Button>
            <Button
              danger
              icon={<Trash2 size={16} />}
              disabled={selectedRowKeys.length === 0}
            >
              批量删除
            </Button>
          </Space>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{mockDataFiles.length}</div>
            <div className="text-sm text-gray-600">总文件数</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockDataFiles.filter(f => f.status === 'processed').length}
            </div>
            <div className="text-sm text-gray-600">已处理</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {mockDataFiles.filter(f => f.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">待处理</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {mockDataFiles.filter(f => f.status === 'error').length}
            </div>
            <div className="text-sm text-gray-600">处理失败</div>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card>
          <div className="flex gap-4 items-center">
            <AntSearch
              placeholder="搜索文件名"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<Search size={16} />}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              suffixIcon={<Filter size={16} />}
            >
              <Option value="all">全部状态</Option>
              <Option value="processed">已处理</Option>
              <Option value="pending">待处理</Option>
              <Option value="error">处理失败</Option>
            </Select>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              style={{ width: 300 }}
            />
          </div>
        </Card>

        {/* 数据文件列表 */}
        <Card title="数据文件列表">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
            }}
            size="small"
          />
        </Card>

        {/* 上传文件模态框 */}
        <Modal
          title="导入数据文件"
          open={isUploadModalVisible}
          onCancel={() => setIsUploadModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsUploadModalVisible(false)}>
              取消
            </Button>,
            <Button key="upload" type="primary">
              开始上传
            </Button>
          ]}
          width={600}
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              支持的文件格式：.bin, .dat, .csv, .json
            </div>
            <Upload.Dragger {...uploadProps} className="p-6">
              <div className="text-center">
                <UploadIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg">点击或拖拽文件到此区域上传</p>
                <p className="text-sm text-gray-500">支持单个或批量上传，文件大小不超过 500MB</p>
              </div>
            </Upload.Dragger>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default DataManagement;