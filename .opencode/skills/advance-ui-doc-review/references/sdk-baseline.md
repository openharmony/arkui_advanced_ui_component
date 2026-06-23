# 高阶组件 SDK 基线

> 来源：`OpenSourceCenter_CR/openharmony/interface_sdk-js`
> 分支：`huawei/EMUI/HarmonyOS/hmos_trunk/OpenHarmony-Trunk`
> 获取方式：`Codehub-Mcp-Server_get_repo_file(project_id=100001628, file_path=api/@ohos.xxx.d.ets, ref=...)`

---

## 组件与 SDK 文件对照

| 文档 | SDK .d.ets 路径 |
|------|---------------|
| ohos-arkui-advanced-FullScreenLaunchComponent | `api/@ohos.arkui.advanced.FullScreenLaunchComponent.d.ets` |
| ohos-arkui-advanced-InnerFullScreenLaunchComponent | `api/@ohos.arkui.advanced.InnerFullScreenLaunchComponent.d.ets` |
| ohos-atomicservice-HalfScreenLaunchComponent | `api/@ohos.atomicservice.HalfScreenLaunchComponent.d.ets` |
| ohos-atomicservice-AtomicServiceNavigation | `api/@ohos.atomicservice.AtomicServiceNavigation.d.ets` |
| ohos-atomicservice-NavPushPathHelper | `api/@ohos.atomicservice.NavPushPathHelper.d.ets` |
| ohos-atomicservice-AtomicServiceTabs | `api/@ohos.atomicservice.AtomicServiceTabs.d.ets` |
| ohos-atomicservice-AtomicServiceSearch | `api/@ohos.atomicservice.AtomicServiceSearch.d.ets` |
| ohos-atomicservice-InterstitialDialogAction | `api/@ohos.atomicservice.InterstitialDialogAction.d.ets` |
| ohos-atomicservice-AtomicServiceWeb | `api/@ohos.atomicservice.AtomicServiceWeb.d.ets` |
| ohos-atomicservice-AtomicServiceMenuBar | `api/@ohos.atomicservice.AtomicServiceMenuBar.d.ets` |

---

## 1. FullScreenLaunchComponent

**文件：** `api/@ohos.arkui.advanced.FullScreenLaunchComponent.d.ets`
**@since:** 12

```typescript
@Component
export declare struct FullScreenLaunchComponent {
  @BuilderParam content: Callback<void>;  // Sets the component content.
  appId: string;  // Indicates atomic service appId.
  options?: AtomicServiceOptions;  // Indicates the atomic service start options.
  onError?: ErrorCallback;  // Callback triggered when an error occurs during running of the started ExtensionAbility.
  onTerminated?: Callback<TerminationInfo>;  // Callback triggered when the EmbeddableUIAbility is terminated.
  onReceive?: Callback<Record<string, Object>>;  // Indicates the callback of onReceive.
}
```

---

## 2. InnerFullScreenLaunchComponent

**文件：** `api/@ohos.arkui.advanced.InnerFullScreenLaunchComponent.d.ets`
**@since:** 12
**@systemapi**

```typescript
@Component
export declare struct InnerFullScreenLaunchComponent {
  @BuilderParam content: Callback<void>;
  controller: LaunchController;
  onReceive?: Callback<Record<string, Object>>;  // @since 20
  onError?: ErrorCallback;  // @since 23
  onTerminated?: Callback<TerminationInfo>;  // @since 23
}

export declare class LaunchController {
  public launchAtomicService: LaunchAtomicServiceCallback;
}

export declare type LaunchAtomicServiceCallback = (appId: string, options?: AtomicServiceOptions) => void;
```

---

## 3. HalfScreenLaunchComponent

**文件：** `api/@ohos.atomicservice.HalfScreenLaunchComponent.d.ets`
**@since:** 18

```typescript
@Component
export declare struct HalfScreenLaunchComponent {
  @BuilderParam content: Callback<void>;
  appId: string;
  options?: AtomicServiceOptions;
  onError?: ErrorCallback;
  onTerminated?: Callback<TerminationInfo>;
  onReceive?: Callback<Record<string, Object>>;  // @since 20
}
```

---

## 4. AtomicServiceNavigation

**文件：** `api/@ohos.atomicservice.AtomicServiceNavigation.d.ets`
**@since:** 12

```typescript
@Component
export declare struct AtomicServiceNavigation {
  @State navPathStack?: NavPathStack;
  @BuilderParam navigationContent?: Callback<void>;
  @Prop title?: ResourceStr;
  @Prop titleOptions?: TitleOptions;
  @Prop gradientBackground?: GradientBackground;  // @since 18
  @Prop hideTitleBar?: boolean;
  @Prop navBarWidth?: Length;
  @Prop mode?: NavigationMode;
  @BuilderParam navDestinationBuilder?: NavDestinationBuilder;
  @Prop navBarWidthRange?: [Dimension, Dimension];
  @Prop minContentWidth?: Dimension;
  stateChangeCallback?: Callback<boolean>;
  modeChangeCallback?: Callback<NavigationMode>;
  @BuilderParam menus?: CustomBuilder | Array<NavigationMenuItem>;  // @since 18
  @Prop sideBarOptions?: SideBarOptions;  // @since 18
  @BuilderParam sideBarContent?: Callback<void>;  // @since 18
}
```

---

## 5. NavPushPathHelper

**文件：** `api/@ohos.atomicservice.NavPushPathHelper.d.ets`
**@since:** 12

```typescript
export declare class NavPushPathHelper {
  constructor(navPathStack: NavPathStack);
  pushPath(moduleName: string, info: NavPathInfo, animated?: boolean): Promise<void>;
  pushPath(moduleName: string, info: NavPathInfo, options?: NavigationOptions): Promise<void>;
  pushDestination(moduleName: string, info: NavPathInfo, animated?: boolean): Promise<void>;
  pushDestination(moduleName: string, info: NavPathInfo, options?: NavigationOptions): Promise<void>;
  pushPathByName(moduleName: string, name: string, param: Object, animated?: boolean): Promise<void>;
  pushPathByName(moduleName: string, name: string, param: Object, onPop: Callback<PopInfo>, animated?: boolean): Promise<void>;
  pushDestinationByName(moduleName: string, name: string, param: Object, animated?: boolean): Promise<void>;
  pushDestinationByName(moduleName: string, name: string, param: Object, onPop: Callback<PopInfo>, animated?: boolean): Promise<void>;
  replacePath(moduleName: string, info: NavPathInfo, animated?: boolean): Promise<void>;
  replacePath(moduleName: string, info: NavPathInfo, options?: NavigationOptions): Promise<void>;
  replacePathByName(moduleName: string, name: string, param: Object, animated?: boolean): Promise<void>;
}
```

**错误码：** 300001 (hsp silent install fail), 401 (Parameter error), 100001 (Internal error), 100005 (Builder function not registered), 100006 (NavDestination not found)

---

## 6. AtomicServiceTabs

**文件：** `api/@ohos.atomicservice.AtomicServiceTabs.d.ets`
**@since:** 12

```typescript
@Component
export declare struct AtomicServiceTabs {
  @BuilderParam tabContents?: [TabContentBuilder?, TabContentBuilder?, TabContentBuilder?, TabContentBuilder?, TabContentBuilder?];
  @Prop tabBarOptionsArray: [TabBarOptions, TabBarOptions, TabBarOptions?, TabBarOptions?, TabBarOptions?];
  @Prop tabBarPosition?: TabBarPosition;
  @Prop layoutMode?: LayoutMode;  // @since 18
  @Prop barBackgroundColor?: ResourceColor;
  @Prop index?: number;
  @Prop barOverlap?: boolean;
  controller?: TabsController;
  onChange?: Callback<number>;
  onTabBarClick?: Callback<number>;
  onContentWillChange?: OnContentWillChangeCallback;
}

export declare class TabBarOptions {
  constructor(icon: ResourceStr | TabBarSymbol, text: ResourceStr, unselectedColor?: ResourceColor, selectedColor?: ResourceColor);
}

export type OnContentWillChangeCallback = (currentIndex: number, comingIndex: number) => boolean;
// 返回值说明：当返回 true 时允许切换，false 时阻止切换
```

---

## 7. AtomicServiceSearch

**文件：** `api/@ohos.atomicservice.AtomicServiceSearch.d.ets`
**@since:** 18

```typescript
@Component
export declare struct AtomicServiceSearch {
  @Prop value?: ResourceStr;
  @Prop placeholder?: ResourceStr;
  @Prop search?: SearchParams;
  @Prop select?: SelectParams;
  @Prop operation?: OperationParams;
  controller?: SearchController;
}

// SelectParams
// selected?: number  // 默认值 -1 表示无选中项

// SearchParams 包含 35 个属性，SelectParams 包含 21 个属性
// 详细见 SDK 文件
```

---

## 8. InterstitialDialogAction

**文件：** `api/@ohos.atomicservice.InterstitialDialogAction.d.ets`
**@since:** 12

```typescript
export declare class InterstitialDialogAction {
  constructor(dialogOptions: DialogOptions);
  openDialog(): void;
  closeDialog(): void;
}

export declare interface DialogOptions {
  uiContext: UIContext;  // 必填
  bottomOffsetType?: BottomOffset;
  title?: ResourceStr;
  subtitle?: ResourceStr;
  titleColor?: ResourceStr | Color;
  subtitleColor?: ResourceStr | Color;
  backgroundImage?: Resource;
  foregroundImage?: Resource;
  iconStyle?: IconStyle;
  titlePosition?: TitlePosition;
  onDialogClick?: Callback<void>;
  onDialogClose?: Callback<void>;
}
```

---

## 9. AtomicServiceWeb

**文件：** `api/@ohos.atomicservice.AtomicServiceWeb.d.ets`
**@since:** 12

```typescript
@Component
export declare struct AtomicServiceWeb {
  src: ResourceStr;  // 必填
  @ObjectLink controller: AtomicServiceWebController;  // 必填
  @Prop mixedMode?: MixedMode;
  @Prop darkMode?: WebDarkMode;
  @Prop forceDarkAccess?: boolean;
  @Prop nestedScroll?: NestedScrollOptions | NestedScrollOptionsExt;  // @since 15
  navPathStack?: NavPathStack;
  onMessage?: Callback<OnMessageEvent>;
  onErrorReceive?: Callback<OnErrorReceiveEvent>;
  onHttpErrorReceive?: Callback<OnHttpErrorReceiveEvent>;
  onPageBegin?: Callback<OnPageBeginEvent>;
  onPageEnd?: Callback<OnPageEndEvent>;
  onControllerAttached?: Callback<void>;
  onLoadIntercept?: OnLoadInterceptCallback;
  onProgressChange?: Callback<OnProgressChangeEvent>;
}

// 需要权限: ohos.permission.INTERNET

export declare class AtomicServiceWebController {
  getUserAgent(): string;
  getCustomUserAgent(): string;
  setCustomUserAgent(userAgent: string): void;
  refresh(): void;
  forward(): void;
  backward(): void;
  accessForward(): boolean;
  accessBackward(): boolean;
  accessStep(step: number): boolean;
  loadUrl(url: string | Resource, headers?: Array<WebHeader>): void;
}
```

**错误码：** 401 (Parameter error), 17100001 (Init error), 17100002 (Invalid url), 17100003 (Invalid resource path or file type)

---

## 10. AtomicServiceMenuBar

**文件：** `api/@ohos.atomicservice.AtomicServiceMenuBar.d.ets`
**@since:** 23
**@systemapi**
**@stagemodelonly**

```typescript
export declare class AtomicServiceMenuBar {
  constructor(uiContext: UIContext);  // 必填
  public setVisible(visible: boolean): void;
  // visible: true 表示菜单栏可见，false 表示菜单栏不可见
}
```