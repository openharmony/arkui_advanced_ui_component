# ArkUI Advanced UI Component 代码背景介绍

## 项目概述

本项目是 HarmonyOS 元服务（Atomic Service）的高阶组件库，提供一套在元服务场景下开发所需的 UI 组件和交互能力。

## 组件列表

| 组件名称 | 功能描述 |
|---------|---------|
| [customappbar](@./customappbar/customappbar.md) | menubar的代码实现，包括了在半屏嵌入式组件/全屏嵌入式组件中的menubar样式 |
| [atomicservicenavigation](@./atomicservicenavigation/atomicservicenavigation.md) | AtomicServiceNavigation导航组件，提供统一导航框架和标题栏定制 |
| [atomicservicesearch](@./atomicservicesearch/atomicservicesearch.md) | AtomicServiceSearch搜索组件，提供统一搜索交互体验 |
| [atomicservicetabs](@./atomicservicetabs/atomicservicetabs.md) | AtomicServiceTabs标签页组件，提供标签切换功能 |
| [atomicserviceweb](@./atomicserviceweb/atomicserviceweb.md) | 适用于元服务的Web组件，提供Web内容加载和交互 |
| [fullscreenlaunchcomponent](@./fullscreenlaunchcomponent/fullscreenlaunchcomponent.md) | 全屏嵌入式组件，支持在元服务中全屏嵌入式拉起元服务 |
| [halfscreenlaunchcomponent](@./halfscreenlaunchcomponent/halfscreenlaunchcomponent.md) | 半屏嵌入式组件，支持在元服务中半屏嵌入式拉起元服务 |
| [innerfullscreenlaunchcomponent](@./innerfullscreenlaunchcomponent/innerfullscreenlaunchcomponent.md) | 全屏嵌入式组件，支持在一方系统应用中全屏嵌入式拉起元服务 |
| [interstitialdialogaction](@./interstitialdialogaction/interstitialdialogaction.md) | 弹框组件，提供临时任务型弹窗 |
| [navpushpathhelper](@./navpushpathhelper/navpushpathhelper.md) | 页面路由管理工具，对ArkUI的NavPathStack进行封装，提供页面路由管理功能 |
| [advanced_ui_component_static](@./advanced_ui_component_static/advanced_ui_component_static.md) | 静态版本组件库，对标ArkTS 1.2标准的组件 |

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

## 组件结构说明

目前大部分组件的目录结构如下：

```
component_name/
├── source/
│   └── component_name.ets    # 组件在ArkTS侧的代码实现
├── interfaces/
│   └── component_name.js     # 组件经过编译后的js侧的代码实现
└── BUILD.gn
```

`component_name` 是组件的名称。

各个文件的作用如下：
- `component_name.ets`：组件在ArkTS侧的代码实现，在实际的编译过程中不会参与编译，对编译过程而言这个是无用的冗余代码。只在组件功能开发时提供ArkTS侧的参考。
- `component_name.js`：组件经过编译后的js侧的代码实现，在实际的编译过程中会参与编译。
- `BUILD.gn`：组件的构建配置文件，用于指定组件的编译规则和依赖项。

## 编译方法

在项目的根目录（例如极速空间为`code`目录下）执行下列命令
| 组件名称 | 编译命令 |
| - | - |
| AtomicServiceNavigation | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/atomicservicenavigation/interfaces:atomicservicenavigation |
| AtomicServiceSearch | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/atomicservicesearch/interfaces:atomicservicesearch |
| AtomicServiceTabs | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/atomicservicetabs/interfaces:atomicservicetabs |
| InnerFull全屏嵌入式组件 | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/innerfullscreenlaunchcomponent/interfaces:innerfullscreenlaunchcomponent |
| Dialog弹框 | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/interstitialdialogaction/interfaces:interstitialdialogaction |
| AtomicServiceMenuBar接口类 | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/customappbar/atomicservicemenubar:atomicservicemenubar |
| menubar | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/customappbar/interfaces:custom_app_bar |
| 半屏嵌入式组件 | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target foundation/arkui/advanced_ui_component/halfscreenlaunchcomponent/interfaces:halfscreenlaunchcomponent |
| FullScreen全屏嵌入式组件 | foundation/arkui/advanced_ui_component/fullscreenlaunchcomponent/interfaces:fullscreenlaunchcomponent |
| NavPushPathHelper | sudo ./build_system.sh --abi-type generic_generic_arm_64only --device-type general_all_phone_standard --ccache --build-variant root --build-target navpushpathhelper |

## 推包验证方法

将编译产物下载到本地，在下载目录中按序执行下列命令

步骤一：挂载
```
hdc target mount
```

步骤二：推包
| 组件名称 | 推包命令 |
| - | - |
| AtomicServiceNavigation | hdc file send ./libatomicservicenavigation.z.so /system/lib64/module/atomicservice/libatomicservicenavigation.z.so |
| AtomicServiceSearch | hdc file send ./libatomicservicesearch.z.so /system/lib64/module/atomicservice/libatomicservicesearch.z.so |
| AtomicServiceTabs | hdc file send ./libatomicservicetabs.z.so /system/lib64/module/atomicservice/libatomicservicetabs.z.so |
| InnerFull全屏嵌入式组件 | hdc file send ./libinnerfullscreenlaunchcomponent.z.so /system/lib64/module/arkui/advanced/libinnerfullscreenlaunchcomponent.z.so |
| Dialog弹框 | hdc file send ./libinterstitialdialogaction.z.so /system/lib64/module/atomicservice/libinterstitialdialogaction.z.so |
| AtomicServiceMenuBar接口类 | hdc file send ./libatomicservicemenubar.z.so /system/lib64/module/atomicservice/libatomicservicemenubar.z.so |
| menubar | hdc file send ./custom_app_bar.abc /system/etc/abc/arkui/custom_app_bar.abc |
| 半屏嵌入式组件 | hdc file send ./libhalfscreenlaunchcomponent.z.so /system/lib64/module/atomicservice/libhalfscreenlaunchcomponent.z.so |
| FullScreen全屏嵌入式组件 | hdc file send ./libfullscreenlaunchcomponent.z.so /system/lib64/module/arkui/advanced/libfullscreenlaunchcomponent.z.so |
| NavPushPathHelper | hdc file send ./libnavpushpathhelper.z.so /system/lib64/module/atomicservice/libnavpushpathhelper.z.so |

步骤三：重启手机
```
hdc shell sync
hdc shell reboot
```
