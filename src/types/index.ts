// 系统状态接口
export interface SystemStatus {
  cpu_usage: number;          // CPU使用率
  memory_usage: number;       // 内存使用率
  active_tasks: number;       // 当前处理任务数量
  system_uptime: number;      // 系统运行时间（秒）
  last_analysis_time: string; // 最后分析时间
}

// 最近分析记录接口
export interface RecentAnalysisRecord {
  id: string;
  analysis_time: string;      // 分析时间
  signal_count: number;       // 信号数量
  success_rate: number;       // 识别成功率
  processing_time: number;    // 处理耗时（秒）
  file_name: string;          // 数据文件名
}

// 快速操作接口
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color?: string;  // 可选的颜色属性
}

// 首页数据接口
export interface HomepageData {
  system_status: SystemStatus;
  recent_records: RecentAnalysisRecord[];
  quick_actions: QuickAction[];
}

// 信号数据接口
export interface SignalData {
  frequency: number[];     // 载频数据
  pulseWidth: number[];   // 脉宽数据
  amplitude: number[];    // 幅度数据
  levelDiff: number[];    // 级差数据
  azimuth: number[];      // 方位角数据
  timestamp: number[];    // 时间戳
}

// 聚类参数接口
export interface ClusteringParams {
  epsilon_CF: number;      // CF维度聚类参数
  epsilon_PW: number;      // PW维度聚类参数
  min_pts: number;         // 最小点数
}

// 识别参数接口
export interface RecognitionParams {
  PA_weight: number;       // PA判别权重
  DTOA_weight: number;     // DTOA判别权重
  joint_threshold: number; // 联合判别门限
}

// 雷达信号接口
export interface RadarSignal {
  id: string;
  frequency_mhz: number;   // 载频/MHz
  pulseWidth_us: number;   // 脉宽/us
  pri_us: number;          // PRI/us
  doa_degree: number;      // DOA/°
  confidence: number;      // 识别置信度
  signalType: string;      // 信号类型
}

// 处理结果接口
export interface ProcessingResult {
  signals: RadarSignal[];
  processingTime: number;
  sliceCount: number;
  currentSlice: number;
}

// 侧边栏状态接口
export interface SidebarState {
  isCollapsed: boolean;
  activeMenuItem: string;
}

// 应用状态接口
export interface AppState {
  // 侧边栏状态
  sidebar: SidebarState;
  
  // 首页数据
  homepageData: HomepageData | null;
  
  // 信号分析相关
  signalData: SignalData | null;
  clusteringParams: ClusteringParams;
  recognitionParams: RecognitionParams;
  processingResult: ProcessingResult | null;
  
  // 加载状态
  isLoading: boolean;
  
  // 错误状态
  error: string | null;
}

// 菜单项接口
export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  children?: MenuItem[];
}