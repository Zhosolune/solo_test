import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Activity,
  Database,
  Settings
} from 'lucide-react';
import { useAppStore } from '../store';
import type { MenuItem } from '../types';

const { Header, Content, Sider, Footer } = AntLayout;

/**
 * 主布局组件属性接口
 */
interface MainLayoutProps {
  children: React.ReactNode;
  /** 页面Header内容 */
  pageHeader?: React.ReactNode;
  /** 页面Footer内容 */
  pageFooter?: React.ReactNode;
}

/**
 * 主布局组件
 * 提供统一的Sider、Header、Content、Footer布局结构
 * 支持通过pageHeader和pageFooter属性自定义页面级别的Header和Footer内容
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  pageHeader,
  pageFooter
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebar, toggleSidebar, setActiveMenuItem } = useAppStore();
  const [isExpanding, setIsExpanding] = React.useState(false);

  // 菜单配置
  const menuItems: MenuItem[] = React.useMemo(() => [
    {
      id: 'home',
      title: '首页',
      icon: 'Home',
      route: '/'
    },
    {
      id: 'signal-analysis',
      title: '信号分析',
      icon: 'Activity',
      route: '/signal-analysis'
    },
    {
      id: 'data-management',
      title: '数据管理',
      icon: 'Database',
      route: '/data-management'
    },
    {
      id: 'settings',
      title: '系统设置',
      icon: 'Settings',
      route: '/settings'
    }
  ], []);

  // 图标映射
  const iconMap = {
    Home: Home,
    Activity: Activity,
    Database: Database,
    Settings: Settings
  };

  // 处理菜单点击
  const handleMenuClick = (menuItem: MenuItem) => {
    setActiveMenuItem(menuItem.id);
    navigate(menuItem.route);
  };

  // 处理侧边栏切换
  const handleToggleSidebar = () => {
    if (sidebar.isCollapsed) {
      setIsExpanding(true);
      setTimeout(() => setIsExpanding(false), 300);
    }
    toggleSidebar();
  };

  // 根据当前路径设置活跃菜单项
  React.useEffect(() => {
    const currentMenuItem = menuItems.find(item => item.route === location.pathname);
    if (currentMenuItem) {
      setActiveMenuItem(currentMenuItem.id);
    }
  }, [location.pathname, setActiveMenuItem, menuItems]);

  // 转换为Ant Design Menu格式
  const antMenuItems = menuItems.map(item => {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap];
    return {
      key: item.id,
      icon: <IconComponent size={18} />,
      label: item.title,
      onClick: () => handleMenuClick(item)
    };
  });

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 40,
  };



  return (
    <AntLayout hasSider style={{ minHeight: '100vh' }}>
      {/* 固定侧边栏 */}
      <Sider
        collapsed={sidebar.isCollapsed}
        collapsible
        trigger={null}
        width={240}
        collapsedWidth={60}
        className="fixed left-0 top-0 bottom-0 z-[1000] bg-gray-800 border-r border-gray-600 shadow-lg"
        theme="dark"
      >
        {/* Logo区域 */}
        <div className="h-16 flex items-center justify-between px-4">
          {!sidebar.isCollapsed ? (
            <>
              <div className="relative overflow-hidden">
                <div
                  className={`text-white font-bold text-lg transition-all duration-300 ease-out ${isExpanding ? 'reveal-text' : ''
                    }`}
                  style={{
                    clipPath: sidebar.isCollapsed ? 'inset(0 100% 0 0)' : 'inset(0 0% 0 0)'
                  }}
                >
                  导航菜单
                </div>
              </div>
              <div
                className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-md group"
                onClick={handleToggleSidebar}
              >
                <MenuFoldOutlined
                  className="text-white transition-all duration-200 group-hover:font-bold group-hover:brightness-125"
                  style={{ fontSize: '18px' }}
                />
              </div>
            </>
          ) : (
            <div
              className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-md mx-auto group"
              onClick={handleToggleSidebar}
            >
              <MenuUnfoldOutlined
                className="text-white transition-all duration-200 group-hover:font-bold group-hover:brightness-125"
                style={{ fontSize: '18px' }}
              />
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[sidebar.activeMenuItem]}
          items={antMenuItems}
          className="bg-slate-800 border-r-0"
          style={{
            fontSize: '14px'
          }}
        />

        {/* 底部信息 */}
        {!sidebar.isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-400">
            <div className="border-t border-slate-700 pt-3">
              <div>版本 v1.0.0</div>
              <div className="mt-1">© 2024 雷达分析系统</div>
            </div>
          </div>
        )}
      </Sider>

      {/* 主内容区域 */}
      <AntLayout 
        style={{ 
          marginLeft: sidebar.isCollapsed ? '60px' : '240px',
          transition: 'margin-left 0.2s ease'
        }}
      >
        {/* Header区域 - 页面级别Header */}
        <Header className="p-0 h-18">
          {pageHeader}
        </Header>

        {/* Content区域 - 子页面内容 */}
        <Content className="m-0 h-[calc(100vh-72px-20px)] p-0"> {/* 高度：100vh - header - footer */}

          {children}
        </Content>

        {/* Footer区域 - 页面级别Footer */}
        <Footer className='p-0 h-5 bg-[#f0f2f5]'>
          {pageFooter}
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default MainLayout;