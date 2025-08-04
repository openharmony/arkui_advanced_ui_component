/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BusinessError, Callback } from '@ohos.base';
import { curves, LengthMetrics, SymbolGlyphModifier, window, AtomicServiceBar } from '@kit.ArkUI';
import { bundleManager, common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { i18n } from '@kit.LocalizationKit';

/**
 * 背景渐变色相关数据
 */
const backGroundColor: string[] = ['rgb(0,0,0)', 'rgb(255,255,255)', 'rgb(241,243,245)'];
const backGroundTransparentGradientColor: string[][] = [['rgba(0,0,0,0)', 'rgba(0,0,0,1)'],
  ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'], ['rgba(241,243,245,0)', 'rgba(241,243,245,1)']];
const transparencyMapArray: number[] = [0.15, 0.15, 0.4, 0.6, 0.8];
const RECTANGLE_OUTSIDE_OFFSET_ONE = 1;
const COLOR_RATIO_THIRTY_PERCENT = 0.3;
const COLOR_RATIO_FIFTY_PERCENT = 0.5;
const COLOR_RATIO_SEVENTY_PERCENT = 0.7;
const COLOR_RATIO_FORTY_PERCENT = 0.4;
const COLOR_RATIO_SIXTY_PERCENT = 0.6;
const COLOR_RATIO_ONE_FIFTY_PERCENT = 1.5;
const COORDINATE_NEGATIVE_ONE = -1;
const BLUR_CONSTANT = 500;

/**
 * 三种标题栏相关数据
 */
const BREAK_POINT_VP_SM = 600;
const BREAK_POINT_VP_MD = 840;
const BREAK_POINT_SM = 'sm';
const BREAK_POINT_MD = 'md';
const BREAK_POINT_LG = 'lg';
const SIDE_BAR_EMBED_MIN_WIDTH = 240;
const SIDE_BAR_OVERLAY_WIDTH = 304;
const SIDE_BAR_COMMON_WIDTH = 360;
const CONTENT_MIN_WIDTH = 600;
/**
 * menubar避让区域宽度计算修正时用到的数据
 */
const MENUBAR_X_FIRST_THRESHOLD: number = 200;
const MENUBAR_X_SECOND_THRESHOLD: number = 40;
const MENUBAR_CORRECTION_OFFSET_VALUE: number = 92;
/**
 * 标题栏统一样式配置数据
 */
const TITLE_MAX_LINES: number = 2;
const TITLE_MIN_FONT_SIZE: number = 14;
const TITLE_MAX_FONT_SIZE: number = 26;
const DEFAULT_TITLE_HEIGHT: number = 36;
const TITLE_LAYOUT_WEIGHT: number = 1;
const DEFAULT_PADDING_START_DISTANCE: number = 32;
const DEFAULT_MARGIN_TOP_DISTANCE: number = 26;
const TITLE_FONT_COLOR: ResourceStr = $r('sys.color.font_primary');

/**
 * 背景颜色的不透明度的枚举类型
 *
 * @enum { number }.
 */
export enum GradientAlpha {
  /**
   * 不透明度为0.2
   *
   */
  OPACITY_20 = 1,
  /**
   * 不透明度为0.6
   *
   */
  OPACITY_60 = 2,
  /**
   * 不透明度为0.8
   */
  OPACITY_80 = 3,
  /**
   * 不透明度为1.0
   */
  OPACITY_100 = 4
}

/**
 * 背景颜色融合方式
 *
 * @enum { number }.
 */
export enum MixMode {
  /**
   * 两种颜色所占比例相同
   */
  AVERAGE = 1,
  /**
   * 一种颜色穿过另一种颜色
   */
  CROSS = 2,
  /**
   * 一种颜色渐渐转变为另一种颜色
   */
  TOWARDS = 3
}

/**
 * 背景底色
 *
 * @enum { number }.
 */
export enum BackgroundTheme {
  /**
   * 黑色
   */
  DARK = 1,
  /**
   * 白色
   */
  LIGHT = 2,
  /**
   * 颜色值 #F1F3F5
   */
  DEFAULT = 3
}

@Component
export struct AtomicServiceNavigation {
  @State navPathStack?: NavPathStack = new NavPathStack();
  @BuilderParam navigationContent?: Callback<void>;
  @Prop title?: ResourceStr;
  @Prop titleOptions?: TitleOptions = { isBlurEnabled: true };
  @Prop gradientBackground?: GradientBackground;
  @Prop hideTitleBar?: boolean;
  @Prop navBarWidth?: Length;
  @Prop mode?: NavigationMode;
  @BuilderParam navDestinationBuilder?: NavDestinationBuilder = this.defaultNavDestinationBuilder;
  @Prop navBarWidthRange?: [Dimension, Dimension];
  @Prop minContentWidth?: Dimension;
  @Prop sideBarOptions?: SideBarOptions;
  @BuilderParam sideBarContent?: Callback<void>;
  @State private showMaskLayer: boolean = false;
  @State private marginWindowLeft: number = 16;
  @State private currentBreakPoint: string = BREAK_POINT_SM;
  @State private sideBarAttribute: sideBarAttributeSet = new sideBarAttributeSet();
  @State private controlButtonVisible: boolean = true;
  @State private titleBuilderPaddingEndWidth: number = 0;
  @BuilderParam menus?: CustomBuilder | Array<NavigationMenuItem>;
  stateChangeCallback?: Callback<boolean>;
  modeChangeCallback?: Callback<NavigationMode>;

  private settings: RenderingContextSettings = new RenderingContextSettings(true);
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);
  @State private navigationWidth: number = 0;
  @State private navigationHeight: number = 0;

  private mainWindow?: window.Window;
  private onWindowSizeChangeCallback?: Callback<Size>;
  private onAvoidSafeAreaChangeCallback?: Callback<window.AvoidAreaOptions>;
  private sideBarHelper?: SideBarHelper;
  private atomicServiceIcon?: PixelMap;
  private navigationBarVisibility: boolean = true;

  @Builder
  defaultNavDestinationBuilder(name: string, param?: Object) {
  }

  @Builder
  BackgroundBuilder(gradientBackground: GradientBackground) {
    Canvas(this.context)
      .opacity(transparencyMapArray[(gradientBackground.alpha === undefined) ? GradientAlpha.OPACITY_20 :
      gradientBackground.alpha])
      .backdropBlur(BLUR_CONSTANT)
      .height(this.navigationHeight)
      .backgroundColor(gradientBackground.backgroundTheme === undefined ? backGroundColor[2] :
      backGroundColor[gradientBackground.backgroundTheme - 1])
      .onReady(() => {
        if (gradientBackground.secondaryColor === undefined) {
          //单色渐变
          this.drawSingleGradient(this.context, gradientBackground.primaryColor,
            gradientBackground.backgroundTheme === undefined ? backGroundColor[2] :
            backGroundColor[gradientBackground.backgroundTheme - 1]);
        } else {
          if (gradientBackground.mixMode === MixMode.AVERAGE) {
            //双色渐变五五分
            this.drawGradientCanvasHalf(this.context, gradientBackground.primaryColor,
              gradientBackground.secondaryColor);
          } else if (gradientBackground.mixMode === MixMode.CROSS) {
            //第一种双色渐变三七分
            this.drawGradientCanvasCross(this.context, gradientBackground.primaryColor,
              gradientBackground.secondaryColor);
          } else {
            //第二种双色渐变三七分
            this.drawGradientCanvasTowards(this.context, gradientBackground.primaryColor,
              gradientBackground.secondaryColor);
          }
          this.drawTransparentGradient(this.context,
            gradientBackground.backgroundTheme === undefined ? BackgroundTheme.DEFAULT :
            gradientBackground.backgroundTheme);
        }
      }).expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  aboutToAppear(): void {
    this.initWindow();
    this.initIcon();
    this.initSideBarAttr();
  }

  /**
   * 初始化侧边栏相关信息
   */
  private initSideBarAttr(): void {
    if (this.titleOptions?.titleBarType !== TitleBarType.DRAWER) {
      return;
    }
    this.sideBarAttribute = new sideBarAttributeSet();
    this.sideBarHelper = new SideBarHelper();
    let sideBarStatusListener = (show: boolean) => {
      this.sideBarAttribute.showSideBar = show;
      this.updateControlButtonVisibility();
      if (this.sideBarOptions?.onChange) {
        this.sideBarOptions.onChange(show);
      }
    };
    this.sideBarHelper.registerListener(sideBarStatusListener);
  }

  /**
   * 窗口初始化或者尺寸发生变化时，让menubar避让宽度更新
   */
  private freshMenubarAvoidAreaWidth(mainWindow: window.Window): void {
    setTimeout(() => {
      const atomicServiceBar: Nullable<AtomicServiceBar> = this.getUIContext().getAtomicServiceBar();
      if (!atomicServiceBar) {
        this.titleBuilderPaddingEndWidth = 0;
        return;
      }
      let menubarX: number = atomicServiceBar.getBarRect().x;
      let corretionWidth: number = 0;
      if (menubarX > MENUBAR_X_FIRST_THRESHOLD) {
        const mainWindowWidth: number = px2vp(mainWindow.getWindowProperties()?.windowRect?.width) - menubarX;
        corretionWidth = mainWindowWidth > MENUBAR_X_FIRST_THRESHOLD ? 0 : mainWindowWidth;
      } else if (menubarX < MENUBAR_X_SECOND_THRESHOLD) {
        corretionWidth = menubarX + MENUBAR_CORRECTION_OFFSET_VALUE;
      }
      let currentWidth: number = atomicServiceBar.getBarRect().width;
      this.titleBuilderPaddingEndWidth = corretionWidth > currentWidth ? corretionWidth : currentWidth;
    }, 100);
  }

  /**
   * 初始化window，并设置windowSizeChange监听，更新断点信息
   */
  private initWindow(): void {
    let context = getContext(this) as common.UIAbilityContext;
    context?.windowStage?.getMainWindow().then(mainWindow => {
      if (!mainWindow) {
        return;
      }
      this.mainWindow = mainWindow;
      if (this.titleOptions?.titleBarType === TitleBarType.DRAWER) {
        this.sideBarHelper?.updateLayout(this.currentBreakPoint, this.sideBarAttribute);
      }
      this.updateBreakPoint(mainWindow.getWindowProperties()?.windowRect?.width);
      this.freshMenubarAvoidAreaWidth(mainWindow);
      this.onWindowSizeChangeCallback = ((windowSize) => {
        this.updateBreakPoint(windowSize?.width);
        this.freshMenubarAvoidAreaWidth(mainWindow);
      });
      mainWindow.on('windowSizeChange', this.onWindowSizeChangeCallback);
    }).catch((err: Error) => {
      console.error(`AtomicServiceNavigation get main window failed, message is ${err?.message}`);
    });
  }

  /**
   * 初始化icon，用户如果设置了则用自定义的icon，没有设置则用元服务图标
   */
  private initIcon(): void {
    if ((this.titleOptions?.titleBarType !== TitleBarType.ROUND_ICON &&
      this.titleOptions?.titleBarType !== TitleBarType.SQUARED_ICON) || this.titleOptions?.titleIcon) {
      return;
    }
    let bundleFlags: number = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
    let bundleInfo: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(bundleFlags);
    let iconRes: Resource = bundleInfo?.appInfo?.iconResource;
    this.atomicServiceIcon = getContext(this)?.resourceManager?.getDrawableDescriptor(iconRes)?.getPixelMap();
  }

  /**
   * 更新断点信息
   */
  private updateBreakPoint(windowWidth: number): void {
    if (!windowWidth || windowWidth <= 0) {
      return;
    }
    let widthVp = px2vp(windowWidth);
    let newBreakPoint: string = '';
    if (widthVp < BREAK_POINT_VP_SM) {
      newBreakPoint = BREAK_POINT_SM;
    } else if (widthVp < BREAK_POINT_VP_MD) {
      newBreakPoint = BREAK_POINT_MD;
    } else {
      newBreakPoint = BREAK_POINT_LG;
    }
    if (this.currentBreakPoint !== newBreakPoint) {
      this.currentBreakPoint = newBreakPoint;
      this.updateMargin();
      if (this.titleOptions?.titleBarType === TitleBarType.DRAWER) {
        this.sideBarHelper?.updateLayout(this.currentBreakPoint, this.sideBarAttribute);
      }
    }
  }

  /**
   * 更新边距
   */
  private updateMargin(): void {
    switch (this.currentBreakPoint) {
      case BREAK_POINT_MD:
        this.marginWindowLeft = 24;
        break;
      case BREAK_POINT_LG:
        this.marginWindowLeft = 32;
        break;
      case BREAK_POINT_SM:
      default:
        this.marginWindowLeft = 16;
        break;
    }
  }

  aboutToDisappear(): void {
    if (this.onWindowSizeChangeCallback) {
      this.mainWindow?.off('windowSizeChange', this.onWindowSizeChangeCallback);
    }
  }

  /**
   * 更新control button的可见性
   */
  updateControlButtonVisibility(): void {
    if (this.titleOptions?.titleBarType !== TitleBarType.DRAWER) {
      return;
    }

    // 如果侧边栏显示，那么控制图标一定需要显示
    if (this.sideBarAttribute.showSideBar && this.controlButtonVisible) {
      return;
    }

    if (this.currentBreakPoint === BREAK_POINT_LG) {
      if (this.sideBarAttribute.showSideBar) {
        if (!this.controlButtonVisible) {
          this.controlButtonVisible = true;
        }
        return;
      }

      if (!this.navigationBarVisibility && !this.sideBarAttribute.showSideBar) {
        if (this.controlButtonVisible) {
          this.controlButtonVisible = false;
        }
      } else {
        if (!this.controlButtonVisible) {
          this.controlButtonVisible = true;
        }
      }
    } else {
      if (this.controlButtonVisible !== this.navigationBarVisibility) {
        this.controlButtonVisible = this.navigationBarVisibility;
      }
    }
  }

  /**
   * 获取当前系统是否为镜像模式（文本排布从右往左）
   *
   * @returns 返回true表示是镜像模式，反之返回false
   */
  private isRTL(): boolean {
    return i18n.isRTL(i18n.System.getSystemLocale());
  }

  @Builder
  drawerTitleBuilder(): void {
    if (this.titleOptions?.titleBarType === TitleBarType.DRAWER && this.title) {
      Row() {
        Text(this.title)
          .maxLines(TITLE_MAX_LINES)
          .minFontSize(TITLE_MIN_FONT_SIZE)
          .maxFontSize(TITLE_MAX_FONT_SIZE)
          .height(DEFAULT_TITLE_HEIGHT)
          .fontColor(TITLE_FONT_COLOR)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .fontWeight(FontWeight.Bold)
          .width(0)
          .layoutWeight(TITLE_LAYOUT_WEIGHT)
          .clip(true)
          .textAlign(this.isRTL() ? TextAlign.End : TextAlign.Start)
      }
      .padding({
        start: LengthMetrics.vp(this.currentBreakPoint !== BREAK_POINT_LG ? this.marginWindowLeft + 36 + 8 :
          (this.sideBarAttribute.showSideBar ? 8 : this.marginWindowLeft + 36 + 8)),
        top: LengthMetrics.vp(10),
        bottom: LengthMetrics.vp(10),
        // 在Stack模式，或者非分栏模式下右侧需要有一定padding值，避免超长文本时不能避让menuBar
        end: ((this.currentBreakPoint === BREAK_POINT_SM &&
          (this.mode === NavigationMode.Auto || !this.mode)) || this.mode === NavigationMode.Stack) ?
        LengthMetrics.vp(this.titleBuilderPaddingEndWidth) : LengthMetrics.vp(0)
      })
      .width('100%')
    }
  }

  @Builder
  maskLayer() {
    Column() {
    }
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
    .backgroundColor($r('sys.color.ohos_id_color_mask_thin'))
    .transition(TransitionEffect.opacity(0).animation({ duration: 500, curve: Curve.Linear }))
    .width('100%')
    .height('100%')
    .accessibilityLevel('no')
    .onClick(() => {
      this.changeSideBarWithAnimation(false);
    })
  }

  @Styles
  controlButtonStyle() {
    .backgroundColor($r('sys.color.ohos_id_color_button_normal'))
    .width(36)
    .height(36)
    .borderRadius(18)
    .margin({
      start: LengthMetrics.vp(this.marginWindowLeft),
    })
    .zIndex(2)
    .draggable(false)
    .onClick(() => {
      const isShowSideBar = !this.sideBarHelper?.isShowSideBar();
      this.changeSideBarWithAnimation(isShowSideBar);
    })
    .position({
      start: LengthMetrics.vp(0),
      top: LengthMetrics.vp(8)
    })
    .visibility(this.controlButtonVisible ? Visibility.Visible : Visibility.None)
  }

  @Builder
  controlButton() {
    if (this.sideBarAttribute.showSideBar) {
      if (!this.sideBarOptions?.sideBarIcon) {
        Button({ type: ButtonType.Circle }) {
          SymbolGlyph($r('sys.symbol.open_sidebar'))
            .fontWeight(FontWeight.Normal)
            .fontSize($r('sys.float.ohos_id_text_size_headline7'))
            .fontColor([$r('sys.color.ohos_id_color_titlebar_icon')])
        }
        .controlButtonStyle()
      } else if (this.sideBarOptions?.sideBarIcon instanceof SymbolGlyphModifier) {
        Button({ type: ButtonType.Circle }) {
          SymbolGlyph()
            .attributeModifier(this.sideBarOptions?.sideBarIcon)
            .fontSize($r('sys.float.ohos_id_text_size_headline7'))
            .size({
              width: $r('sys.float.ohos_id_text_size_headline7'),
              height: $r('sys.float.ohos_id_text_size_headline7')
            })
        }
        .controlButtonStyle()
      } else {
        Image(this.sideBarOptions?.sideBarIcon)
          .controlButtonStyle()
      }
    } else {
      if (!this.titleOptions?.titleIcon) {
        Button({ type: ButtonType.Circle }) {
          SymbolGlyph($r('sys.symbol.close_sidebar'))
            .fontWeight(FontWeight.Normal)
            .fontSize($r('sys.float.ohos_id_text_size_headline7'))
            .fontColor([$r('sys.color.ohos_id_color_titlebar_icon')])
        }
        .controlButtonStyle()
      } else if (this.titleOptions?.titleIcon instanceof SymbolGlyphModifier) {
        Button({ type: ButtonType.Circle }) {
          SymbolGlyph()
            .attributeModifier(this.titleOptions?.titleIcon)
            .fontSize($r('sys.float.ohos_id_text_size_headline7'))
            .size({
              width: $r('sys.float.ohos_id_text_size_headline7'),
              height: $r('sys.float.ohos_id_text_size_headline7')
            })
        }
        .controlButtonStyle()
      } else {
        Image(this.titleOptions?.titleIcon)
          .controlButtonStyle()
      }
    }
  }

  @Builder
  sideBar() {
    Row() {
      if (this.sideBarContent) {
        this.sideBarContent();
      }
    }
    .border({ width: {
      left: 0,
      right: '1px',
      top: 0,
      bottom: 0
    },
      color: $r('sys.color.comp_divider'),
      style: {
        right: BorderStyle.Solid
      }
    })
    .alignItems(VerticalAlign.Top)
    .width('100%')
    .height('100%')
    .padding({ top: 56 })
    .focusable(true)
    .defaultFocus(true)
    .backgroundColor(this.sideBarOptions?.sideBarBackground ?? $r('sys.color.ohos_id_color_sub_background'))
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  @Styles
  roundIconStyle() {
    .backgroundColor('rgba(0, 0, 0, 0)')
    .width(36)
    .height(36)
    .borderRadius(18)
    .margin({
      start: LengthMetrics.vp(this.marginWindowLeft),
      end: LengthMetrics.vp(8),
      top: LengthMetrics.vp(10),
      bottom: LengthMetrics.vp(10)
    })
    .zIndex(2)
    .draggable(false)
    .position({
      start: LengthMetrics.vp(0),
      top: LengthMetrics.vp(0)
    })
  }

  @Builder
  roundIconBuilder() {
    if (this.titleOptions?.titleIcon instanceof SymbolGlyphModifier) {
      Button({ type: ButtonType.Circle }) {
        SymbolGlyph()
          .attributeModifier(this.titleOptions?.titleIcon)
          .fontSize($r('sys.float.ohos_id_text_size_headline7'))
          .size({
            width: $r('sys.float.ohos_id_text_size_headline7'),
            height: $r('sys.float.ohos_id_text_size_headline7')
          })
      }
      .stateEffect(false)
      .roundIconStyle()
    } else {
      Image(this.titleOptions?.titleIcon ?? this.atomicServiceIcon)
        .roundIconStyle()
    }
  }

  @Styles
  longIconStyles() {
    .height(36)
    .width(36)
    .margin({
      start: LengthMetrics.vp(this.marginWindowLeft),
      end: LengthMetrics.vp(-12),
      top: LengthMetrics.vp(10),
      bottom: LengthMetrics.vp(10)
    })
    .draggable(false)
    .position({
      start: LengthMetrics.vp(0),
      top: LengthMetrics.vp(0)
    })
    .backgroundColor('rgba(0, 0, 0, 0)')
  }

  @Builder
  longIconBuilder() {
    if (this.titleOptions?.titleIcon instanceof SymbolGlyphModifier) {
      Button() {
        SymbolGlyph()
          .attributeModifier(this.titleOptions?.titleIcon)
          .fontSize($r('sys.float.ohos_id_text_size_headline7'))
          .size({
            width: $r('sys.float.ohos_id_text_size_headline7'),
            height: $r('sys.float.ohos_id_text_size_headline7')
          })
      }
      .longIconStyles()
      .stateEffect(false)
      .type(ButtonType.Normal)
    } else {
      Image(this.titleOptions?.titleIcon ?? this.atomicServiceIcon)
        .longIconStyles()
        .objectFit(ImageFit.Auto)
    }
  }

  @Builder
  titleBuilder() {
    if (this.titleOptions?.titleBarType === TitleBarType.SQUARED_ICON) {
      this.longIconBuilder();
    } else {
      this.roundIconBuilder();
    }
  }

  @Builder
  private defaultTitleBuilder(): void {
    Text(this.title)
      .maxLines(TITLE_MAX_LINES)
      .minFontSize(TITLE_MIN_FONT_SIZE)
      .maxFontSize(TITLE_MAX_FONT_SIZE)
      .height(DEFAULT_TITLE_HEIGHT)
      .fontColor(TITLE_FONT_COLOR)
      .textOverflow({ overflow: TextOverflow.Ellipsis })
      .fontWeight(FontWeight.Bold)
      .layoutWeight(TITLE_LAYOUT_WEIGHT)
      .clip(true)
      .margin({ top: LengthMetrics.px(DEFAULT_MARGIN_TOP_DISTANCE) })
      .padding({ start: LengthMetrics.px(DEFAULT_PADDING_START_DISTANCE) })
      .textAlign(this.isRTL() ? TextAlign.End : TextAlign.Start)
  }

  /**
   * 根据当前屏幕尺寸判断是否要显示用户插入的布局
   */
  private isShowMenus(): boolean {
    return this.mode === NavigationMode.Stack && this.currentBreakPoint !== BREAK_POINT_SM;
  }

  /**
   * 根据用户传入的类型和当前屏幕尺寸判断是否要显示NavigationMenuItem列表
   */
  private getMenuItemArray(): undefined | Array<NavigationMenuItem> {
    return this.isShowMenus() && this.menus instanceof Array ? this.menus : undefined;
  }

  build() {
    Stack() {
      Column() {
        if (this.gradientBackground !== undefined) {
          this.BackgroundBuilder({
            primaryColor: this.gradientBackground.primaryColor,
            secondaryColor: this.gradientBackground.secondaryColor,
            backgroundTheme: this.gradientBackground.backgroundTheme,
            mixMode: this.gradientBackground.mixMode,
            alpha: this.gradientBackground.alpha
          })
        }
      }
      if (this.titleOptions?.titleBarType === TitleBarType.DRAWER) {
        this.controlButton();

        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
        SideBarContainer(this.currentBreakPoint === BREAK_POINT_LG ? SideBarContainerType.Embed :
        SideBarContainerType.Overlay) {
          this.sideBar()

          Stack() {
            Navigation(this.navPathStack) {
              if (this.navigationContent) {
                this.navigationContent();
              }
            }
            .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
            .title(this.drawerTitleBuilder(), this.getTitleOption())
            .menus(this.isShowMenus() && this.menus instanceof Function ? this.menus() : this.getMenuItemArray())
            .titleMode(NavigationTitleMode.Mini)
            .hideBackButton(true)
            .hideTitleBar(this.hideTitleBar)
            .navBarWidth(this.navBarWidth)
            .navBarPosition(NavBarPosition.Start)
            .mode(this.mode)
            .navDestination(this.navDestinationBuilder)
            .navBarWidthRange(this.navBarWidthRange)
            .minContentWidth(this.minContentWidth)
            .onNavigationModeChange(this.modeChangeCallback)
            .onNavBarStateChange((visible: boolean) => {
              this.navigationBarVisibility = visible;
              this.updateControlButtonVisibility();
              if (this.stateChangeCallback) {
                this.stateChangeCallback(visible);
              }
            })

            if (this.titleOptions?.titleBarType === TitleBarType.DRAWER && this.sideBarAttribute.showSideBar &&
              this.currentBreakPoint !== BREAK_POINT_LG && this.showMaskLayer) {
              this.maskLayer();
            }
          }
          .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
        }
        .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
        .sideBarWidth(this.sideBarAttribute.sideBarWidth)
        .minContentWidth(this.sideBarAttribute.minContentWidthOfSideBar)
        .minSideBarWidth(this.sideBarAttribute.minSideBarWidth)
        .maxSideBarWidth(this.sideBarAttribute.maxSideBarWidth)
        .showControlButton(false)
        .showSideBar(this.sideBarAttribute.showSideBar)
        .onChange((showSideBar: boolean) => {
          if (this.sideBarHelper?.isShowSideBar() !== showSideBar) {
            this.changeSideBarWithAnimation(showSideBar);
          }
        })
      } else {
        Navigation(this.navPathStack) {
          if (this.navigationContent) {
            this.navigationContent();
          }
        }
        .title((this.titleOptions?.titleIcon || (this.titleOptions?.titleBarType && !this.title)) ?
          this.titleBuilder() : this.defaultTitleBuilder(), this.getTitleOption())
        .titleMode(NavigationTitleMode.Mini)
        .menus(this.isShowMenus() && this.menus instanceof Function ? this.menus() : this.getMenuItemArray())
        .hideBackButton(true)
        .hideTitleBar(this.hideTitleBar)
        .navBarWidth(this.navBarWidth)
        .navBarPosition(NavBarPosition.Start)
        .mode(this.mode)
        .navDestination(this.navDestinationBuilder)
        .navBarWidthRange(this.navBarWidthRange)
        .minContentWidth(this.minContentWidth)
        .onNavBarStateChange(this.stateChangeCallback)
        .onNavigationModeChange(this.modeChangeCallback)
      }
    }
    .align(Alignment.TopStart)
    .width('100%')
    .height('100%')
    .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
      this.navigationWidth = newValue.width as number;
      this.navigationHeight = newValue.height as number;
    })
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  /**
   * 双色渐变下两种颜色各占50%的实现，把整个画布区域分为两个一样的矩形在绘制
   * @param context 画布上下文
   * @param primaryColor 第一种颜色
   * @param secondaryColor 第二种颜色
   */
  drawGradientCanvasHalf(context: CanvasRenderingContext2D, primaryColor: ResourceColor,
    secondaryColor: ResourceColor): void {
    let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
    let grad1 =
      context.createLinearGradient(COORDINATE_NEGATIVE_ONE * this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT,
        height, this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, 0);
    let grad2 = context.createLinearGradient(this.navigationWidth * COLOR_RATIO_ONE_FIFTY_PERCENT, height,
      this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, 0);
    grad1.addColorStop(0, this.resourceColorToString(primaryColor));
    grad1.addColorStop(COLOR_RATIO_FIFTY_PERCENT, this.resourceColorToString(primaryColor));
    grad1.addColorStop(1, this.resourceColorToString(secondaryColor));
    grad2.addColorStop(0, this.resourceColorToString(primaryColor));
    grad2.addColorStop(COLOR_RATIO_FIFTY_PERCENT, this.resourceColorToString(primaryColor));
    grad2.addColorStop(1, this.resourceColorToString(secondaryColor));
    context.fillStyle = grad1;
    context.fillRect(0, 0, this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, height);
    context.fillStyle = grad2;
    context.fillRect(this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, 0, this.navigationWidth, height);
  }

  /**
   * 双色渐变的一种实现，把画布先分为两个大矩形，再把其中一个矩形分为两个小矩形
   * @param context 画布上下文
   * @param primaryColor 第一种颜色
   * @param secondaryColor 第二种颜色
   */
  drawGradientCanvasCross(context: CanvasRenderingContext2D, primaryColor: ResourceColor,
    secondaryColor: ResourceColor): void {
    let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
    let grad1 = context.createLinearGradient(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, 0);
    grad1.addColorStop(0, this.resourceColorToString(primaryColor));
    grad1.addColorStop(COLOR_RATIO_FIFTY_PERCENT, this.resourceColorToString(primaryColor));
    grad1.addColorStop(1, this.resourceColorToString(secondaryColor));
    context.fillStyle = grad1;
    context.fillRect(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, height);
    let y1 = (COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth) > 0 ?
      COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth : 0;
    let grad2 =
      context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, y1, this.navigationWidth,
        height * COLOR_RATIO_FIFTY_PERCENT);
    grad2.addColorStop(0, this.resourceColorToString(secondaryColor));
    grad2.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(secondaryColor));
    grad2.addColorStop(1, this.resourceColorToString(primaryColor));
    context.fillStyle = grad2;
    context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth - RECTANGLE_OUTSIDE_OFFSET_ONE, 0,
      this.navigationWidth * COLOR_RATIO_THIRTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE,
      height * COLOR_RATIO_FIFTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE);
    let y2 = (COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth) > 0 ?
      COLOR_RATIO_FIFTY_PERCENT * height + COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth : height;
    let grad3 =
      context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, y2, this.navigationWidth,
        height * COLOR_RATIO_FIFTY_PERCENT);
    grad3.addColorStop(0, this.resourceColorToString(secondaryColor));
    grad3.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(secondaryColor));
    grad3.addColorStop(1, this.resourceColorToString(primaryColor));
    context.fillStyle = grad3;
    context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth - RECTANGLE_OUTSIDE_OFFSET_ONE,
      height * COLOR_RATIO_FIFTY_PERCENT,
      COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth + RECTANGLE_OUTSIDE_OFFSET_ONE,
      height * COLOR_RATIO_FIFTY_PERCENT);
  }

  /**
   * 双色渐变的一种实现，从矩形左上角颜色渐变到右下角
   * @param context 画布上下文
   * @param primaryColor 第一种颜色
   * @param secondaryColor 第二种颜色
   */
  drawGradientCanvasTowards(context: CanvasRenderingContext2D, primaryColor: ResourceColor,
    secondaryColor: ResourceColor): void {
    let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
    let grad = context.createLinearGradient(0, 0, this.navigationWidth, height);
    grad.addColorStop(0, this.resourceColorToString(primaryColor));
    grad.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(primaryColor));
    grad.addColorStop(1, this.resourceColorToString(secondaryColor));
    context.fillStyle = grad;
    context.fillRect(0, 0, this.navigationWidth, height);
  }

  /**
   * 双色渐变下透明效果的实现
   * @param context 画布上下文
   * @param backgroundTheme 背景色底色
   */
  drawTransparentGradient(context: CanvasRenderingContext2D, backgroundTheme: BackgroundTheme): void {
    let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
    let grad = context.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, backGroundTransparentGradientColor[backgroundTheme - 1][0]);
    grad.addColorStop(1, backGroundTransparentGradientColor[backgroundTheme - 1][1]);
    context.fillStyle = grad;
    context.fillRect(0, 0, this.navigationWidth + RECTANGLE_OUTSIDE_OFFSET_ONE, height +
      RECTANGLE_OUTSIDE_OFFSET_ONE);
    if (backgroundTheme === BackgroundTheme.DARK) {
      context.fillStyle = Color.Black;
      context.fillRect(0, height, this.navigationWidth, this.navigationHeight - height);
    }
  }

  /**
   * 单色渐变：
   * @param context 画布上下文
   * @param primaryColor createLinearGradient初始颜色为primaryColor，结束颜色为底色
   * @param backgroundColor 颜色线性渐变的结束颜色
   */
  drawSingleGradient(context: CanvasRenderingContext2D,
    primaryColor: ResourceColor, backgroundColor: string): void {
    let height = this.navigationHeight * COLOR_RATIO_SIXTY_PERCENT;
    let grad1 = context.createLinearGradient(0, 0, 0, height);
    grad1.addColorStop(0, this.resourceColorToString(primaryColor));
    grad1.addColorStop(1, backgroundColor);
    context.fillStyle = grad1;
    context.fillRect(0, 0, this.navigationWidth, height);
    //当背景为黑色的时候需要特殊处理下
    if (backgroundColor === backGroundColor[0]) {
      context.fillStyle = Color.Black
      context.fillRect(0, height, this.navigationWidth, this.navigationHeight * (1 - COLOR_RATIO_SIXTY_PERCENT));
    }
  }

  /**
   * ResourceColor转化为能作为addColorStop使用的字符串
   * @param resource ResourceColor = Color | number | string | Resource,对于Resource转化为直接使用的字符串需要特殊处理
   * @returns
   */
  resourceColorToString(resource: ResourceColor): string {
    if (typeof resource === 'object') {
      try {
        return getContext(this).resourceManager.getStringSync(resource)
      } catch (error) {
        let code = (error as BusinessError).code;
        let message = (error as BusinessError).message;
        hilog.error(0x0000, 'AtomicServiceNavigation',
          `resourceColorToString - systemResourceManager getStringValue failed, error code: ${code}, message: ${message}.`);
      }
      return '';
    } else {
      return resource.toString();
    }
  }

  /**
   * 获取NavigationTitleOptions
   */
  private getTitleOption(): NavigationTitleOptions {
    return {
      backgroundColor: this.titleOptions?.backgroundColor,
      backgroundBlurStyle: this.titleOptions?.isBlurEnabled ? BlurStyle.COMPONENT_THICK : BlurStyle.NONE,
      barStyle: this.titleOptions?.barStyle
    };
  }

  /**
   * 更新control button的可见性，并运行动画效果
   */
  private changeSideBarWithAnimation(isShowSidebar: boolean): void {
    animateTo({
      duration: 500,
      curve: curves.cubicBezierCurve(0.2, 0.2, 0.1, 1),
      onFinish: () => {
        this.showMaskLayer = isShowSidebar;
      }
    }, () => {
      if (this.sideBarHelper) {
        this.sideBarHelper.setShowSideBar(isShowSidebar);
      }
      this.showMaskLayer = true;
    })
  }
}

/**
 * 侧边栏相关参数
 */
@Observed
class sideBarAttributeSet {
  /**
   * 侧边栏宽度
   */
  public sideBarWidth: number = SIDE_BAR_OVERLAY_WIDTH;
  /**
   * 侧边栏最小宽度
   */
  public minSideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
  /**
   * 侧边栏最大宽度
   */
  public maxSideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
  /**
   * 侧边栏内容最小宽度
   */
  public minContentWidthOfSideBar: Dimension = SIDE_BAR_COMMON_WIDTH;
  /**
   * 侧边栏显示隐藏状态
   */
  public showSideBar: boolean = false;
}

/**
 * 侧边栏对外暴露相关参数
 */
export interface SideBarOptions {
  /**
   * 侧边栏背景
   */
  sideBarBackground?: ResourceColor;

  /**
   * 侧边栏显示隐藏状态变化监听
   */
  onChange?: (show: boolean) => void;

  /**
   * 侧边栏icon
   */
  sideBarIcon?: Resource | SymbolGlyphModifier;
}

/**
 * 标题相关参数
 */
export interface TitleOptions {
  /**
   * 背景色
   */
  backgroundColor?: ResourceColor,

  /**
   * 是否启动模糊效果
   */
  isBlurEnabled?: boolean,

  /**
   * 标题栏风格
   */
  barStyle?: BarStyle,

  /**
   * 标题栏类型
   */
  titleBarType?: TitleBarType,

  /**
   * 标题栏icon
   */
  titleIcon?: Resource | SymbolGlyphModifier;
}

export type NavDestinationBuilder = (name: string, param?: Object) => void;

export interface GradientBackground {
  primaryColor: ResourceColor,
  secondaryColor?: ResourceColor,
  backgroundTheme?: BackgroundTheme,
  mixMode?: MixMode,
  alpha?: GradientAlpha
}

/**
 * 侧边栏辅助管理类
 */
class SideBarHelper {
  private isExpandSideBar: boolean = false;
  private listener?: Function;

  /**
   * 注册侧边栏显隐状态变化监听
   *
   * @param listener 监听器对象
   */
  public registerListener(listener: Function): void {
    this.listener = listener;
  }

  /**
   * 取消注册监听
   */
  public unregisterListener(): void {
    this.listener = undefined;
  }

  /**
   * 获取侧边栏显示隐藏状态
   *
   * @returns 侧边栏是否显示
   */
  public isShowSideBar(): boolean {
    return this.isExpandSideBar;
  }

  /**
   * 设置侧边栏显示隐藏状态
   *
   * @param value 显示或隐藏状态
   */
  public setShowSideBar(value: boolean): void {
    this.isExpandSideBar = value;
    if (this.listener) {
      this.listener(value);
    }
  }

  /**
   * 更新侧边栏布局
   *
   * @param breakPoint 当前断点
   * @param layout 布局参数
   */
  public updateLayout(breakPoint: string, layout: sideBarAttributeSet): void {
    if (breakPoint === BREAK_POINT_LG) {
      this.updateLGLayout(layout);
    } else {
      this.updateCommonLayout(layout);
    }
  }

  /**
   * 更新除LG外窗口模式的布局
   */
  private updateCommonLayout(layout: sideBarAttributeSet): void {
    layout.sideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
    layout.minContentWidthOfSideBar = '100%';
  }

  /**
   * 更新LG窗口模式布局
   */
  private updateLGLayout(layout: sideBarAttributeSet): void {
    layout.sideBarWidth = SIDE_BAR_EMBED_MIN_WIDTH;
    layout.minContentWidthOfSideBar = CONTENT_MIN_WIDTH;
  }
}

/**
 * 标题栏类型
 */
export enum TitleBarType {
  /**
   * 长图标类型标题栏
   */
  SQUARED_ICON = 1,

  /**
   * 圆形图标类型标题栏
   */
  ROUND_ICON,

  /**
   * 抽屉类型标题栏
   */
  DRAWER
}