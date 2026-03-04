# HalfScreenLaunchComponent 代码背景介绍

## 项目概述

HalfScreenLaunchComponent 是 HarmonyOS 元服务的半屏启动组件，支持以半屏弹窗模式拉起和展示元服务。

## 目录结构

```
halfscreenlaunchcomponent/
├── source/
│   └── halfscreenlaunchcomponent.ets    # 半屏嵌入式组件实现
├── interfaces/
│   └── halfscreenlaunchcomponent.js     # 半屏嵌入式组件经过编译后的js侧的代码实现
└── BUILD.gn
```

## 核心功能

- **半屏弹窗**：以半屏模式拉起元服务
- **生命周期管理**：提供 onTerminated 回调处理元服务终止事件
- **事件通信**：支持 onReceive 接收元服务回传事件
- **错误处理**：提供 onError 回调处理启动失败

## 组件参数

- `appId`：元服务 App ID
- `options`：启动选项配置
- `content`：自定义内容构建器

## 嵌入式模式

- `EMBEDDED_HALF_MODE (2)`：半屏嵌入式模式

## 关键技术点

- 使用 `startAbility` API 启动半屏元服务
- 窗口模式设置为半屏
- 公共事件订阅处理分布式账号登出
- 系统应用标识检测
