import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AppState,
  SystemStatus,
  RecentAnalysisRecord,
  QuickAction,
  SignalData,
  ClusteringParams,
  RecognitionParams,
  ProcessingResult,
  HomepageData
} from '../types';

interface AppStore extends AppState {
  // 侧边栏操作
  toggleSidebar: () => void;
  setActiveMenuItem: (menuId: string) => void;
  
  // 首页数据操作
  setHomepageData: (data: HomepageData) => void;
  updateSystemStatus: (status: SystemStatus) => void;
  addRecentRecord: (record: RecentAnalysisRecord) => void;
  
  // 信号分析操作
  setSignalData: (data: SignalData) => void;
  updateClusteringParams: (params: Partial<ClusteringParams>) => void;
  updateRecognitionParams: (params: Partial<RecognitionParams>) => void;
  setProcessingResult: (result: ProcessingResult) => void;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 初始化数据
  initializeApp: () => void;
}

// 默认聚类参数
const defaultClusteringParams: ClusteringParams = {
  epsilon_CF: 0.5,
  epsilon_PW: 0.3,
  min_pts: 5
};

// 默认识别参数
const defaultRecognitionParams: RecognitionParams = {
  PA_weight: 0.6,
  DTOA_weight: 0.4,
  joint_threshold: 0.8
};

// 模拟系统状态数据
const mockSystemStatus: SystemStatus = {
  cpu_usage: 45.2,
  memory_usage: 62.8,
  active_tasks: 3,
  system_uptime: 86400, // 1天
  last_analysis_time: new Date().toISOString()
};

// 模拟最近分析记录
const mockRecentRecords: RecentAnalysisRecord[] = [
  {
    id: '1',
    analysis_time: new Date(Date.now() - 3600000).toISOString(), // 1小时前
    signal_count: 156,
    success_rate: 94.2,
    processing_time: 12.5,
    file_name: 'radar_data_001.bin'
  },
  {
    id: '2',
    analysis_time: new Date(Date.now() - 7200000).toISOString(), // 2小时前
    signal_count: 203,
    success_rate: 91.8,
    processing_time: 18.3,
    file_name: 'radar_data_002.bin'
  },
  {
    id: '3',
    analysis_time: new Date(Date.now() - 10800000).toISOString(), // 3小时前
    signal_count: 89,
    success_rate: 96.1,
    processing_time: 8.7,
    file_name: 'radar_data_003.bin'
  }
];

// 快速操作配置
const quickActions: QuickAction[] = [
  {
    id: 'new-analysis',
    title: '开始新分析',
    description: '导入数据文件并开始信号分析',
    icon: 'Play',
    route: '/signal-analysis',
    color: '#1890ff'
  },
  {
    id: 'import-data',
    title: '导入数据',
    description: '从本地文件导入雷达信号数据',
    icon: 'Upload',
    route: '/data-management',
    color: '#52c41a'
  },
  {
    id: 'view-history',
    title: '查看历史',
    description: '浏览历史分析记录和结果',
    icon: 'History',
    route: '/data-management',
    color: '#faad14'
  },
  {
    id: 'system-settings',
    title: '系统设置',
    description: '配置系统参数和偏好设置',
    icon: 'Settings',
    route: '/settings',
    color: '#722ed1'
  }
];

// 初始化首页数据
const initialHomepageData: HomepageData = {
  system_status: mockSystemStatus,
  recent_records: mockRecentRecords,
  quick_actions: quickActions
};

export const useAppStore = create<AppStore>()(devtools(
  (set) => ({
    // 初始状态
    sidebar: {
      isCollapsed: false,
      activeMenuItem: 'home'
    },
    homepageData: initialHomepageData,
    signalData: null,
    clusteringParams: defaultClusteringParams,
    recognitionParams: defaultRecognitionParams,
    processingResult: null,
    isLoading: false,
    error: null,

    // 侧边栏操作
    toggleSidebar: () => set((state) => ({
      sidebar: {
        ...state.sidebar,
        isCollapsed: !state.sidebar.isCollapsed
      }
    })),

    setActiveMenuItem: (menuId: string) => set((state) => ({
      sidebar: {
        ...state.sidebar,
        activeMenuItem: menuId
      }
    })),

    // 首页数据操作
    setHomepageData: (data: HomepageData) => set({ homepageData: data }),

    updateSystemStatus: (status: SystemStatus) => set((state) => ({
      homepageData: state.homepageData ? {
        ...state.homepageData,
        system_status: status
      } : null
    })),

    addRecentRecord: (record: RecentAnalysisRecord) => set((state) => ({
      homepageData: state.homepageData ? {
        ...state.homepageData,
        recent_records: [record, ...state.homepageData.recent_records.slice(0, 4)]
      } : null
    })),

    // 信号分析操作
    setSignalData: (data: SignalData) => set({ signalData: data }),

    updateClusteringParams: (params: Partial<ClusteringParams>) => set((state) => ({
      clusteringParams: { ...state.clusteringParams, ...params }
    })),

    updateRecognitionParams: (params: Partial<RecognitionParams>) => set((state) => ({
      recognitionParams: { ...state.recognitionParams, ...params }
    })),

    setProcessingResult: (result: ProcessingResult) => set({ processingResult: result }),

    // 状态管理
    setLoading: (loading: boolean) => set({ isLoading: loading }),

    setError: (error: string | null) => set({ error }),

    clearError: () => set({ error: null }),

    // 初始化应用数据
    initializeApp: () => {
      const homepageData: HomepageData = {
        system_status: mockSystemStatus,
        recent_records: mockRecentRecords,
        quick_actions: quickActions
      };
      set({ homepageData });
    }
  }),
  {
    name: 'radar-analysis-store'
  }
));

// 导出类型
export type { AppStore };