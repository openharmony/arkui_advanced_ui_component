# ArkUI Advanced UI Component 代码背景介绍

## 项目概述

本项目是 HarmonyOS 元服务（Atomic Service）的高阶组件库，提供一套在元服务场景下开发所需的 UI 组件和交互能力。

## 组件列表

| 组件名称 | 功能描述 |
|---------|---------|
| [customappbar](./customappbar/CODEAGENT.md) | menubar的代码实现，包括了在半屏嵌入式组件/全屏嵌入式组件中的menubar样式 |
| [atomicservicenavigation](./atomicservicenavigation/CODEAGENT.md) | AtomicServiceNavigation导航组件，提供统一导航框架和标题栏定制 |
| [atomicservicesearch](./atomicservicesearch/CODEAGENT.md) | AtomicServiceSearch搜索组件，提供统一搜索交互体验 |
| [atomicservicetabs](./atomicservicetabs/CODEAGENT.md) | AtomicServiceTabs标签页组件，提供标签切换功能 |
| [atomicserviceweb](./atomicserviceweb/CODEAGENT.md) | 适用于元服务的Web组件，提供Web内容加载和交互 |
| [fullscreenlaunchcomponent](./fullscreenlaunchcomponent/CODEAGENT.md) | 全屏嵌入式组件，支持在元服务中全屏嵌入式拉起元服务 |
| [halfscreenlaunchcomponent](./halfscreenlaunchcomponent/CODEAGENT.md) | 半屏嵌入式组件，支持在元服务中半屏嵌入式拉起元服务 |
| [innerfullscreenlaunchcomponent](./innerfullscreenlaunchcomponent/CODEAGENT.md) | 全屏嵌入式组件，支持在一方系统应用中全屏嵌入式拉起元服务 |
| [interstitialdialogaction](./interstitialdialogaction/CODEAGENT.md) | 弹框组件，提供临时任务型弹窗 |
| [navpushpathhelper](./navpushpathhelper/CODEAGENT.md) | 页面路由管理工具，对ArkUI的NavPathStack进行封装，提供页面路由管理功能 |
| [advanced_ui_component_static](./advanced_ui_component_static/CODEAGENT.md) | 静态版本组件库，对标ArkTS 1.2标准的组件 |

## 目录结构

```
arkui_advanced_ui_component/
├── customappbar/                    # menubar组件
├── atomicservicenavigation/         # 导航组件
├── atomicservicesearch/             # 搜索组件
├── atomicservicetabs/               # 标签页组件
├── atomicserviceweb/                # Web组件
├── fullscreenlaunchcomponent/       # 全屏嵌入式组件
├── halfscreenlaunchcomponent/       # 半屏嵌入式组件
├── innerfullscreenlaunchcomponent/  # Inner全屏嵌入式组件
├── interstitialdialogaction/        # 弹框组件
├── navpushpathhelper/               # 导航路径助手
├── advanced_ui_component_static/    # 静态组件
├── figures/                         # 图片资源
└── patches/                         # 补丁文件
```

**备注：** 目前仅navpushpathhelper、advanced_ui_component_static两份代码在不在本仓库生效

## 嵌入式场景

本组件库主要支持以下元服务嵌入式场景：

1. **半屏嵌入式**：元服务以半屏弹窗形式展示
2. **全屏嵌入式**：元服务以全屏形式嵌入到宿主应用
3. **内部全屏嵌入式**：在应用内部全屏拉起元服务
4. **常规窗口模式**：元服务以独立窗口形式运行

## 技术栈

- **框架**：ArkUI (ETS)
- **语言**：TypeScript/ArkTS/JS
- **Native 层**：C++
- **构建系统**：GN + Hvigor

## 使用说明

各组件详细使用说明请参考各组件目录下的 CODEAGENT.md 文件。
