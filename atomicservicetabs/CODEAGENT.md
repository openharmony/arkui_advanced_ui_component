# AtomicServiceTabs 代码背景介绍

## 项目概述

AtomicServiceTabs 是 HarmonyOS 元服务的标签页组件，提供统一的标签切换交互体验。

## 目录结构

```
atomicservicetabs/
├── source/
│   └── atomicservicetabs.ets    # 标签页组件实现
├── interfaces/
│   └── atomicservicetabs.js     # 标签页组件经过编译后的js侧的代码实现
└── BUILD.gn
```

## 核心功能

- **Tab 切换**：支持多标签页的切换功能
- **图标+文字组合**：支持图标+文字的标签展示
- **单图标/文本模式**：支持仅有图标或仅有文字的简洁展示
- **位置定制**：支持顶部/底部/左侧标签栏位置

## 组件参数

- `tabBarOptionsArray`：标签栏选项数组
- `tabBarPosition`：标签栏位置（TOP/BOTTOM/LEFT/RIGHT）
- `barBackgroundColor`：标签栏背景色
- `index`：当前选中索引
- `layoutMode`：布局模式（VERTICAL/HORIZONTAL）

## 样式配置

- 默认栏宽：96vp
- 默认栏高：48vp
- 文字字号：14vp
- 文字字重：500
