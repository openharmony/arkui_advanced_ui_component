# InterstitialDialogAction 代码背景介绍

## 项目概述

InterstitialDialogAction 是 HarmonyOS 元服务的插页式对话框组件，提供临时性、任务型的弹窗交互体验。

## 目录结构

```
interstitialdialogaction/
├── source/
│   └── interstitialdialogaction.ets    # 弹框组件实现
├── interfaces/
│   └── interstitialdialogaction.js     # 弹框组件经过编译后的js侧的代码实现
└── BUILD.gn
```

## 核心功能

- **插页式对话框**：提供临时任务型弹窗
- **图标样式定制**：支持深色/浅色图标模式
- **标题与副标题**：支持主标题和副标题展示
- **前景图片**：支持展示图片内容
- **关闭按钮**：提供关闭交互

## 样式配置

- 对话框圆角：使用系统默认中圆角
- 对话框内边距：16vp
- 对话框最大宽度：480vp
- 阴影半径：16vp
- 关闭按钮图标大小：16vp
- 关闭按钮热区大小：32vp

## 组件类型

- `IconStyle`：图标样式枚举（DARK/LIGHT）
- 支持自定义内容和系统资源

## 关键技术点

- 使用 `ComponentContent` 实现节点内容
- 支持动画曲线配置
- 自动避让系统导航栏区域
