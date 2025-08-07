"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const child_process_1 = require("child_process");
const isDev = process.env.NODE_ENV === 'development';
let mainWindow = null;
let pythonProcess = null;
// 启动Python后端服务
function startPythonBackend() {
    if (isDev) {
        // 开发环境下，假设Python后端独立运行
        console.log('开发环境：Python后端应独立启动');
        return;
    }
    // 生产环境下启动Python后端
    try {
        const pythonPath = (0, path_1.join)(process.resourcesPath, 'backend', 'main.py');
        pythonProcess = (0, child_process_1.spawn)('python', [pythonPath], {
            stdio: 'pipe'
        });
        pythonProcess.stdout?.on('data', (data) => {
            console.log(`Python后端: ${data}`);
        });
        pythonProcess.stderr?.on('data', (data) => {
            console.error(`Python后端错误: ${data}`);
        });
        pythonProcess.on('close', (code) => {
            console.log(`Python后端进程退出，代码: ${code}`);
        });
    }
    catch (error) {
        console.error('启动Python后端失败:', error);
    }
}
// 停止Python后端服务
function stopPythonBackend() {
    if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
    }
}
// 创建主窗口
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        },
        icon: (0, path_1.join)(__dirname, '../assets/icon.png'),
        title: '雷达信号分析软件',
        show: false
    });
    // 加载应用
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        const htmlPath = (0, path_1.join)(__dirname, 'dist', 'index.html');
        mainWindow.loadFile(htmlPath);
    }
    // 窗口准备好后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
        if (isDev) {
            mainWindow?.webContents.openDevTools();
        }
    });
    // 处理窗口关闭
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // 处理外部链接
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_1.shell.openExternal(url);
        return { action: 'deny' };
    });
}
// 创建应用菜单
function createMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '导入信号数据',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        // 发送消息到渲染进程
                        mainWindow?.webContents.send('menu-import-data');
                    }
                },
                {
                    label: '导出分析结果',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow?.webContents.send('menu-export-results');
                    }
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        electron_1.app.quit();
                    }
                }
            ]
        },
        {
            label: '分析',
            submenu: [
                {
                    label: '开始信号分析',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow?.webContents.send('menu-start-analysis');
                    }
                },
                {
                    label: '停止分析',
                    accelerator: 'CmdOrCtrl+T',
                    click: () => {
                        mainWindow?.webContents.send('menu-stop-analysis');
                    }
                }
            ]
        },
        {
            label: '视图',
            submenu: [
                {
                    label: '重新加载',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow?.reload();
                    }
                },
                {
                    label: '强制重新加载',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: () => {
                        mainWindow?.webContents.reloadIgnoringCache();
                    }
                },
                {
                    label: '开发者工具',
                    accelerator: 'F12',
                    click: () => {
                        mainWindow?.webContents.toggleDevTools();
                    }
                },
                { type: 'separator' },
                {
                    label: '实际大小',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        mainWindow?.webContents.setZoomLevel(0);
                    }
                },
                {
                    label: '放大',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        const currentZoom = mainWindow?.webContents.getZoomLevel() || 0;
                        mainWindow?.webContents.setZoomLevel(currentZoom + 0.5);
                    }
                },
                {
                    label: '缩小',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        const currentZoom = mainWindow?.webContents.getZoomLevel() || 0;
                        mainWindow?.webContents.setZoomLevel(currentZoom - 0.5);
                    }
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        mainWindow?.webContents.send('menu-about');
                    }
                }
            ]
        }
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
// 应用准备就绪
electron_1.app.whenReady().then(() => {
    createMainWindow();
    createMenu();
    startPythonBackend();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});
// 所有窗口关闭时退出应用（macOS除外）
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        stopPythonBackend();
        electron_1.app.quit();
    }
});
// 应用即将退出
electron_1.app.on('before-quit', () => {
    stopPythonBackend();
});
// 安全设置
electron_1.app.on('web-contents-created', (_, contents) => {
    contents.on('new-window', (navigationEvent, navigationUrl) => {
        navigationEvent.preventDefault();
        electron_1.shell.openExternal(navigationUrl);
    });
    contents.on('will-navigate', (navigationEvent, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.origin !== 'http://localhost:3000' && !isDev) {
            navigationEvent.preventDefault();
        }
    });
});
//# sourceMappingURL=main.js.map