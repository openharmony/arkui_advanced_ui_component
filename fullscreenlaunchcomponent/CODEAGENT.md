# FullScreenLaunchComponent 代码背景介绍

## 项目概述

FullScreenLaunchComponent 是 HarmonyOS 元服务的全屏启动组件，支持以全屏模式拉起和展示元服务。

## 目录结构

```
fullscreenlaunchcomponent/
├── source/
│   └── fullscreenlaunchcomponent.ets    # 全屏嵌入式组件实现
├── interfaces/
│   └── fullscreenlaunchcomponent.js     # 全屏嵌入式组件经过编译后的js侧的代码实现
└── BUILD.gn
```

## 核心功能

- **全屏启动**：以全屏模式拉起元服务
- **生命周期管理**：提供 onTerminated 回调处理元服务终止事件
- **事件通信**：支持 onReceive 接收元服务回传事件
- **错误处理**：提供 onError 回调处理启动失败
- **状态栏控制**：支持设置状态栏颜色

## 组件参数

- `appId`：元服务 App ID
- `options`：启动选项配置
- `content`：自定义内容构建器

## 回调事件

- `onError`：启动错误回调
- `onTerminated`：元服务终止回调
- `onReceive`：接收事件回调

## 关键技术点

- 使用 `startAtomicService` API 启动元服务
- 公共事件订阅处理分布式账号登出
- API 版本检测和能力适配
- 系统应用标识检测
