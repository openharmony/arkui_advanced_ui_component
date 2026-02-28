# CustomAppBar 代码背景介绍

## 项目概述

CustomAppBar 是 HarmonyOS 元服务（Atomic Service）的自定义应用栏组件，支持在嵌入式场景下提供标准化的标题栏功能。

## 核心功能

- **多模式支持**：支持常规模式/全屏嵌入式和半屏嵌入式两种展示模式
- **按钮组件**：提供菜单按钮、关闭按钮、最大化/退出按钮
- **隐私标识**：支持隐私安全标签展示及动画效果
- **主题适配**：支持深色/浅色模式自动切换
- **响应式布局**：支持 SM/MD/LG/XL 多种屏幕断点

## 目录结构

```
customappbar/
├── source/
│   ├── custom_app_bar.ets       # 手机端自定义应用栏实现
│   └── custom_app_bar_forpc.ets # PC端自定义应用栏实现
├── interfaces/
│   ├── custom_app_bar.js        # 手机端接口定义
│   └── custom_app_bar_forpc.js  # PC端接口定义
└── atomicservicemenubar/
    ├── src/                     # Native 层实现
    │   ├── native_menubar.cpp
    │   └── menubar_api_implement.cpp
    └── include/                 # 头文件
```

## 关键技术点

1. **嵌入式组件通信**：通过 `setCustomCallback` 接收来自 ArkUI 的事件（颜色配置、安全区域、屏幕模式等）
2. **事件回调管理**：使用 `NativeEventManager` 类处理与 Native 层的通信
3. **动画系统**：使用 ArkUI 的 `animateTo` 和 `Animator` 实现平滑的动效
4. **隐私协议监听**：通过公共事件订阅 `usual.event.PRIVACY_STATE_CHANGED` 监听隐私状态变化

## 事件定义

- `arkui_app_bar_color_configuration` - 颜色配置更新
- `arkui_app_bar_menu_safe_area` - 菜单安全区域
- `arkui_app_bar_content_safe_area` - 内容安全区域
- `arkui_app_bar_bar_info` - 应用栏信息
- `arkui_app_bar_screen` - 屏幕模式切换
- `arkui_app_bar_on_back_pressed` - 返回键按下事件

## 适用场景

- 元服务半屏嵌入式拉起
- 元服务全屏嵌入式拉起
- 常规元服务窗口模式
