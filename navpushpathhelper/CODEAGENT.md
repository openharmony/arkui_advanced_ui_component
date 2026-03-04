# NavPushPathHelper 代码背景介绍

## 项目概述

NavPushPathHelper 是 HarmonyOS 元服务的导航路径助手类，提供支持静默安装的导航推送能力。
目前在本仓库中只是一份备份代码，在ROM中实际生效的代码仍然在ArkUI仓库中

## 目录结构

```
navpushpathhelper/
├── navpushpathhelper.js    # 导航路径助手实现
├── src/                    # Native 层实现
│   └── ...
├── include/                # 头文件
│   └── ...
└── BUILD.gn
```

## 核心功能

- **静默安装推送**：在导航到目标页面时自动进行 HSP 静默安装
- **路由映射更新**：自动更新路由映射表
- **多种推送方式**：支持 pushPath、pushDestination、pushPathByName、pushDestinationByName 等

## 主要方法

### pushPath
```typescript
async pushPath(moduleName: string, info: PathInfo, optionParam?: OptionParam): Promise<void>
```
推送页面路径，支持静默安装

### pushDestination
```typescript
async pushDestination(moduleName: string, info: PathInfo, optionParam?: OptionParam): Promise<void>
```
推送目标页面，支持静默安装

### pushPathByName
```typescript
async pushPathByName(moduleName: string, name: string, param: Object, onPop: Callback<PopInfo>, optionParam?: OptionParam): Promise<void>
```
通过名称推送页面

### replacePath
```typescript
async replacePath(moduleName: string, info: PathInfo, optionParam?: OptionParam): Promise<void>
```
替换当前页面路径

## 关键技术点

- 使用 `requireInternal` 获取Native API
- 检查 HSP 是否已存在，避免重复安装
- 静默安装成功后再更新路由映射
- 错误处理和 Promise 包装
