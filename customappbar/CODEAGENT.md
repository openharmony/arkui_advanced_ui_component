# CustomAppBar 代码背景介绍

## 项目概述

CustomAppBar 是 HarmonyOS 元服务（Atomic Service）的自定义应用栏组件，支持在嵌入式场景下提供标准化的标题栏功能。

## 核心功能

- **多模式支持**：支持常规（跳出式）模式/全屏嵌入式和半屏嵌入式两种展示模式
- **按钮组件**：提供菜单按钮、关闭按钮
- **隐私标识**：支持隐私安全标签展示及动画效果
- **主题适配**：支持深色/浅色模式自动切换
- **响应式布局**：支持 SM/MD/LG/XL 多种屏幕断点
- **与云服务功能联动**：通过底层交互接口，可以在不同场景按需拉起云服务的弹框组件
- **提供控制接口**：通过调用AtomicServiceMenuBar相关接口，可以实现menubar的隐藏功能

## 目录结构

```
customappbar/
├── source/
│   ├── custom_app_bar.ets       						# ets代码实现的手机端menubar功能
│   └── custom_app_bar_forpc.ets 				# ets代码实现的PC端menubar功能
├── interfaces/
│   ├── custom_app_bar.js        						 # js代码实现的手机端menubar功能
│   └── custom_app_bar_forpc.js  				 # js代码实现的PC端menubar功能
└── atomicservicemenubar/
	├── atomicservicemenubar.js 					 # 对外暴露的js接口
    ├── src/                     											  
    │   ├── native_menubar.cpp						 # AtomicServiceMenuBar NAPI桥接代码
    │   └── menubar_api_implement.cpp   # AtomicServiceMenuBar实际功能实现代码
    └── include/                 										# AtomicServiceMenuBar头文件
```

## 关键技术点

1. **接收来自底层的通信**：通过 `setCustomCallback` 接收来自 ArkUI 的事件（颜色配置、安全区域、屏幕模式等）
2. **底层交互事件管理**：使用 `NativeEventManager` 类来调用 Native 层（ArkUI）的功能
3. **动画系统**：使用 ArkUI 的 `animateTo` 和 `Animator` 实现平滑的动效
4. **隐私协议监听**：通过公共事件订阅 `usual.event.PRIVACY_STATE_CHANGED` 监听隐私状态变化

## 与外界交互事件定义

- `arkui_app_bar_color_configuration` - 颜色配置更新，由ArkUI通知menubar在当前场景下的颜色配置
- `arkui_app_bar_menu_safe_area` - menubar避让区域，由ArkUI通知menubar需要设置距离屏幕顶部的距离
- `arkui_app_bar_content_safe_area` - 内容避让区域，由ArkUI通知menubar内容布局需要设置的样式
- `arkui_app_bar_bar_info` - 应用信息，由ArkUI通知当前元服务的labelName以及bundleName
- `arkui_app_bar_screen` - 元服务状态信息，由ArkUI通知当前是否为半屏嵌入式模式
- `arkui_app_bg_color` - 元服务背景色，由ArkUI通知
- `arkui_app_bar_service_panel` - 多语言场景下获取无障碍交互朗读文本，仅在组件创建时获取一次
- `arkui_app_bar_close` - 多语言场景下获取无障碍交互朗读文本，仅在组件创建时获取一次
- `arkui_app_bar_provide_service` - 根据资源名称获取底层图标样式，仅在组件创建时获取一次
- `arkui_custom_app_bar_menu_click` - menubar的`菜单`按钮点击事件名
- `arkui_custom_app_bar_close_click` - menubar的“关闭”按钮点击事件名
- `arkui_custom_app_bar_did_build` - 当前该能力暂无使用场景
- `arkui_custom_app_bar_create_service_panel` - 通知ArkUI拉起控制面板，支持通过传入参数拉起特定的面板
- `arkui_app_bar_maximize` - 根据资源名称获取底层图标样式，仅在组件创建时获取一次
- `arkui_app_bar_privacy_authorize` - 多语言场景下获取文本内容，仅在组件创建时获取一次，用于隐私协议动画
- `arkui_app_bar_on_back_pressed` - 侧滑事件
- `arkui_app_bar_on_back_pressed_consumed` - 侧滑消费事件，调用一次等价于在ArkTS代码中为组件的`onBackPressed`接口返回值设置`true`
- `arkui_menu_bar_visible` - 设置menubar是否可见的事件通知，仅用于嵌入式拉起元服务的场景
- `arkui_extension_host_params` - 元服务创建时，获取从嵌入式组件传入的启动参数
- `arkui_app_bar_receive` - 嵌入式组件的`onReceive`事件通知

## 与嵌入式组件通信定制化的事件名

- `com.atomicservice.params.key.launchType` - 元服务的启动类型：`EMBED_HALF`表示半屏嵌入式拉起，`EMBED_INNER_FULL`表示InnerFullScreenLaunchComponent组件全屏嵌入式拉起，`FULL_SCREEN_LAUNCH`表示FullScreenLaunchComponent组件全屏嵌入式拉起
- `com.atomicservice.params.key.isSystemApp` - 宿主方元服务是否为一方系统应用/元服务的标志
- `com.atomicservice.visible` - 当前元服务是否要隐藏menubar（仅用于非嵌入式拉起元服务的场景）

## 适用场景

- 元服务半屏嵌入式拉起
- 元服务全屏嵌入式拉起（InnerFullScreenLaunchComponent与FullScreenLaunchComponent）
- 常规元服务窗口模式

## 扩展指南

### 场景1

- `场景描述`：从嵌入式组件中发送新的消息/事件到menubar
- `扩展方法`：
	- 1、在对应的嵌入式组件中，为`resetOptions`接口加上对应的键值对，键的格式必须为`com.atomicservice.params.key.xxxx`
    - 2、在menubar的`getWantParamEvent`接口中，通过解析数组获取到值
- `流程原理介绍`：
	- 1、嵌入式组件的`options`信息会在ArkUI侧被筛选，仅`com.atomicservice.params.key.`为前缀的键值对才会被发送给menubar
	- 2、ArkUI会将筛选后的键值对通过`arkui_extension_host_params`事件通知给menubar
    
### 场景2

- `场景描述`：新增拉起一种云服务侧的控制面板
- `扩展方法`：
	- 1、在`NativeEventManager`中新增一个拉起接口，接口参考`onEyelashTitleClick`对info进行定制化后再作为`ContainerAppBar.callNative`的第二个入参，第一个入参为`EVENT_NAME_CUSTOM_APP_BAR_CREATE_SERVICE_PANEL`
- `流程原理介绍`：
	- 1、通过`NativeEventManager`可以主动调用ArkUI预留的C++能力
    - 2、ArkUI对接口调用信息进行解析后，会创建对应的UEC组件，再通知云服务侧的Ability内容渲染