# InnerFullScreenLaunchComponent 代码背景介绍

## 项目概述

InnerFullScreenLaunchComponent 是 HarmonyOS 元服务的内部全屏启动组件，支持在应用内部以全屏模式拉起元服务。

## 目录结构

```
innerfullscreenlaunchcomponent/
├── source/
│   └── innerfullscreenlaunchcomponent.ets    # Inner全屏嵌入式启动组件实现
├── interfaces/
│   └── innerfullscreenlaunchcomponent.js     # Inner全屏嵌入式启动组件经过编译后的js侧的代码实现
└── BUILD.gn
```

## 核心功能

- **内部全屏启动**：在宿主应用内部以全屏模式拉起元服务
- **控制器模式**：通过 LaunchController 控制启动行为
- **生命周期管理**：提供 onTerminated 回调处理终止事件
- **事件通信**：支持 onReceive 接收元服务回传事件

## 组件参数

- `appId`：元服务 App ID
- `options`：启动选项配置
- `content`：自定义内容构建器
- `controller`：启动控制器

## LaunchController

- `launchAtomicService(appId, options)`：启动元服务方法

## 关键技术点

- 使用 `startAbility` API 启动元服务
- API 版本检测和能力适配
- 公共事件订阅处理
- 系统应用标识检测
