# 雷达信号分析软件 - Electron 桌面应用打包指南

## 项目概述

本项目是一个基于 React + Electron 的雷达信号分析桌面应用程序。项目已经完成了完整的 Electron 配置和打包设置。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **桌面框架**: Electron 37.2.5
- **构建工具**: Vite 6.3.5
- **打包工具**: electron-builder 26.0.12
- **UI 组件**: Ant Design 5.26.7
- **样式**: Tailwind CSS 3.4.17

## 项目结构

```
solo_test/
├── electron/                 # Electron 主进程源码
│   ├── main.ts              # 主进程入口文件
│   └── tsconfig.json        # Electron TypeScript 配置
├── src/                     # React 应用源码
├── dist/                    # React 构建输出
├── dist-electron/           # Electron 打包输出
├── main.js                  # 编译后的主进程文件
└── package.json             # 项目配置和依赖
```

## 打包配置说明

### package.json 配置

项目已配置完整的 electron-builder 设置：

```json
{
  "main": "main.js",
  "build": {
    "appId": "com.radar.signal.analysis",
    "productName": "雷达信号分析软件",
    "asar": true,
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "package.json"
    ],
    "win": {
      "target": {
        "target": "nsis",
        "arch": ["x64"]
      },
      "icon": "public/favicon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowElevation": true,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "雷达信号分析软件"
    }
  }
}
```

### 构建脚本

- `npm run build` - 构建 React 应用
- `npm run build:electron-main` - 编译 Electron 主进程
- `npm run electron:build` - 完整构建并打包
- `npm run electron:pack` - 打包但不生成安装程序
- `npm run electron:dist` - 生成分发版本

## 打包步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 构建应用

```bash
# 构建 React 应用
npm run build

# 编译 Electron 主进程
npm run build:electron-main

# 打包成桌面应用
npm run electron:dist
```

### 3. 输出文件

打包完成后，在 `dist-electron/` 目录下会生成：

- `雷达信号分析软件 Setup 0.0.0.exe` - Windows 安装程序
- `win-unpacked/` - 未打包的应用文件夹
- `雷达信号分析软件.exe` - 可执行文件（在 win-unpacked 目录中）

## 应用特性

### 窗口配置
- 默认尺寸：1400x900
- 最小尺寸：1200x800
- 安全配置：禁用 nodeIntegration，启用 contextIsolation

### 菜单功能
- **文件菜单**：导入信号数据、导出分析结果
- **分析菜单**：开始/停止信号分析
- **视图菜单**：重新加载、开发者工具、缩放控制
- **帮助菜单**：关于信息

### 后端集成
- 支持 Python 后端服务集成
- 开发环境：连接到 localhost:8000
- 生产环境：自动启动内置 Python 服务

## 开发模式

```bash
# 启动开发服务器
npm run dev

# 启动 Electron 开发模式
npm run electron:dev
```

## 部署说明

### Windows 部署
1. 运行 `npm run electron:dist` 生成安装程序
2. 分发 `雷达信号分析软件 Setup 0.0.0.exe` 文件
3. 用户双击安装程序即可安装应用

### 绿色版部署
1. 使用 `npm run electron:pack` 生成未打包版本
2. 分发整个 `win-unpacked` 文件夹
3. 用户直接运行 `雷达信号分析软件.exe`

## 注意事项

1. **图标文件**：已添加基础图标，建议替换为专业设计的图标
2. **代码签名**：生产环境建议配置代码签名证书
3. **自动更新**：可配置 electron-updater 实现自动更新功能
4. **性能优化**：大型 chunk 建议使用代码分割优化

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本（推荐 18+）
   - 清理 node_modules 重新安装
   - 检查 TypeScript 编译错误

2. **打包失败**
   - 确保 dist 目录存在且包含构建文件
   - 检查 electron-builder 配置
   - 查看详细错误日志

3. **应用启动失败**
   - 检查主进程文件路径
   - 验证 HTML 文件加载路径
   - 查看开发者控制台错误

## 版本信息

- 应用版本：0.0.0
- Electron 版本：37.2.5
- 构建时间：2024年

---

**打包成功！** 🎉

安装程序已生成：`dist-electron/雷达信号分析软件 Setup 0.0.0.exe`

可直接分发此文件给用户安装使用。