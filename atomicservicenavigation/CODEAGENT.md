# AtomicServiceNavigation 代码背景介绍

## 项目概述

AtomicServiceNavigation 是 HarmonyOS 元服务的导航组件，提供统一的导航框架和交互能力。

## 目录结构

```
atomicservicenavigation/
├── source/
│   └── atomicservicenavigation.ets    # 导航组件arkts侧的代码实现
├── interfaces/
│   └── atomicservicenavigation.js     # 导航组件经过编译后的js侧的代码实现
└── BUILD.gn
```

## 核心功能

- **统一导航框架**：提供元服务统一的导航能力
- **标题栏定制**：支持多种样式的标题栏配置（背景渐变、透明度等）
- **侧边栏支持**：支持侧边栏嵌入式布局模式
- **响应式布局**：支持 SM/MD/LG 断点适配
- **menubar 避让**：智能处理系统导航栏区域的避让

## 关键技术点

1. **背景渐变**：支持 rgb/白色/浅灰三种背景色的渐变效果
2. **透明度控制**：支持 0.15/0.15/0.4/0.6/0.8 等多种透明度级别
3. **模糊效果**：使用 BlurStyle 实现背景模糊
4. **避让计算**：动态计算 menubar 区域的避让偏移量
