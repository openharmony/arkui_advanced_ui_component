# AtomicServiceSearch 代码背景介绍

## 项目概述

AtomicServiceSearch 是 HarmonyOS 元服务的搜索组件，提供统一的搜索交互体验。

## 目录结构

```
atomicservicesearch/
├── source/
│   └── atomicservicesearch.ets    # 搜索组件实现
├── interfaces/
│   └── atomicservicesearch.js    # 接口定义
└── BUILD.gn
```

## 核心功能

- **搜索框组件**：提供统一的搜索输入框样式
- **多选下拉框**：支持 Select 组件的定制化配置
- **操作项菜单**：支持搜索操作项的展示和交互
- **文本选择**：支持文本选择和粘贴功能

## 接口定义

- `InputFilterParams`：输入过滤参数配置
- `SearchButtonParams`：搜索按钮参数配置
- `MenuAlignParams`：菜单对齐参数配置
- `SelectParams`：下拉选择参数配置

## 样式配置

- 搜索框高度：40vp
- 选择器高度：36vp
- 边框圆角：20vp
- 图标大小：24vp
