/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { curves, display, LengthMetrics, mediaquery } from '@kit.ArkUI';
import { image } from '@kit.ImageKit';

const LOG_TAG: string = 'CustomAppBar';
const VIEW_WIDTH: number = 80;
const VIEW_HEIGHT: number = 36;
const BUTTON_SIZE: number = 40;
const IMAGE_SIZE: string = '20vp';
const MENU_RADIUS: string = '20vp';
const DIVIDER_HEIGHT: string = '16vp';
const BORDER_WIDTH: string = '1px';
const VIEW_MARGIN_RIGHT: number = 8;
const ICON_SIZE: number = 27;
const ICON_FILL_COLOR_DEFAULT: string = '#182431';
const BORDER_COLOR_DEFAULT: string = '#33000000';
const MENU_BACK_COLOR: string = '#99FFFFFF';
const MENU_MARGIN_TOP: number = 10;
// 半屏参数
const BUTTON_IMAGE_SIZE: number = 18;
const HALF_CONTAINER_BORFER_SIZE: number = 32;
const HALF_BUTTON_BACK_COLOR: string = '#0D000000';
const HALF_BUTTON_IMAGE_COLOR: string = '#0C000000';
const HALF_MENU_MARGIN: number = 16;
const EYELASH_HEIGHT: number = 36;
const CHEVRON_HEIGHT: number = 20;
const CHEVRON_WIDTH: number = 10;
const CHEVRON_MAIGIN: number = 4;
const TITLE_FONT_SIZE: number = 14;
const TITLE_LINE_HEIGHT: number = 16;
const TITLE_MARGIN_RIGHT: number = 12;
const TITLE_MARGIN_TOP: number = 8;
const TITLE_LABEL_MARGIN: number = 8.5;
const TITLE_TEXT_MARGIN: number = 3;
const MAX_WIDTH: string = '60%';
const MAX_WIDTH_LIMIT: number = 600;
const ARKUI_APP_BAR_COLOR_CONFIGURATION: string = 'arkui_app_bar_color_configuration';
const ARKUI_APP_BAR_MENU_SAFE_AREA: string = 'arkui_app_bar_menu_safe_area';
const ARKUI_APP_BAR_CONTENT_SAFE_AREA: string = 'arkui_app_bar_content_safe_area';
const ARKUI_APP_BAR_BAR_INFO: string = 'arkui_app_bar_info';
const ARKUI_APP_BAR_SCREEN: string = 'arkui_app_bar_screen';
const ARKUI_APP_BG_COLOR: string = 'arkui_app_bg_color';

const EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK = 'arkui_custom_app_bar_menu_click';
const EVENT_NAME_CUSTOM_APP_BAR_CLOSE_CLICK = 'arkui_custom_app_bar_close_click';
const EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD = 'arkui_custom_app_bar_did_build';

/**
 * 适配不同颜色模式集合
 */
class ColorGroup {
  public light: string = '#000000';
  public dark: string = '#FFFFFF';

  constructor(light: string, dark: string) {
    this.light = light;
    this.dark = dark;
  }
}

const colorMap: Map<string, ColorGroup> = new Map<string, ColorGroup>([
  [ICON_FILL_COLOR_DEFAULT, new ColorGroup('#182431', '#e5ffffff')],
  [BORDER_COLOR_DEFAULT, new ColorGroup('#33182431', '#4Dffffff')],
  [MENU_BACK_COLOR, new ColorGroup('#99FFFFFF', '#33000000')],
  [HALF_BUTTON_BACK_COLOR, new ColorGroup('#0D000000', '#19FFFFFF')],
  [HALF_BUTTON_IMAGE_COLOR, new ColorGroup('#000000', '#FFFFFF')]
]);

@Entry
@Component
export struct CustomAppBar {
  @State menuResource: Resource = {
    bundleName: '',
    moduleName: '',
    params: [],
    id: 125830217,
    type: 20000
  };
  @State closeResource: Resource = {
    bundleName: '',
    moduleName: '',
    params: [],
    id: 125831084,
    type: 20000
  };
  @State menuFillColor: string = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
  @State closeFillColor: string = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
  @State menubarBorderColor: string = this.getResourceColor(BORDER_COLOR_DEFAULT);
  @State menubarBackColor: string = this.getResourceColor(MENU_BACK_COLOR);
  @State dividerBackgroundColor: string = this.getResourceColor(BORDER_COLOR_DEFAULT);
  @State halfButtonBackColor: string = this.getResourceColor(HALF_BUTTON_BACK_COLOR);
  @State halfButtonImageColor: string = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
  @State contentMarginTop: number = 0;
  @State contentMarginLeft: number = 0;
  @State contentMarginRight: number = 0;
  @State contentMarginBottom: number = 0;
  @State appBarOpacity: number = 0;
  // 半屏参数
  @State isHalfScreen: boolean = true;
  @State containerHeight: string = '0%';
  @State containerWidth: string = '100%';
  @State borderSize: number = HALF_CONTAINER_BORFER_SIZE;
  @State titleOpacity: number = 1;
  @State buttonOpacity: number = 1;
  @State titleHeight: number = 0;
  @State maskOpacity: number = 0;
  @State contentBgColor: ResourceColor = '#FFFFFFFF';
  @State isShowPanel: boolean = false;
  @State statusBarHeight: number = 0;
  private listener = mediaquery.matchMediaSync('(orientation: landscape)');
  private isDark: boolean = true;
  private bundleName: string = '';
  private labelName: string = '';
  private icon: Resource | string | PixelMap = $r('sys.media.ohos_app_icon');
  private fullContentMarginTop: number = 0;
  private windowWidth: number = 0;
  private windowHeight: number = 0;

  aboutToAppear(): void {
    let displayData = display.getDefaultDisplaySync();
    this.windowWidth = px2vp(displayData.width)
    this.windowHeight = px2vp(displayData.height);
    if (this.isHalfScreen) {
      this.contentBgColor = Color.Transparent;
      this.halfScreenShowAnimation();
      if (this.windowWidth > MAX_WIDTH_LIMIT) {
        this.containerWidth = MAX_WIDTH;
      }
      this.titleHeight = EYELASH_HEIGHT + 2 * TITLE_MARGIN_TOP + this.statusBarHeight;
    } else {
      this.containerHeight = '100%';
      this.containerWidth = '100%';
      this.appBarOpacity = 1;
    }
    let portraitFunc =
      (mediaQueryResult: mediaquery.MediaQueryResult): void => this.onPortrait(mediaQueryResult);
    this.listener.on('change', portraitFunc);
  }

  onPortrait(mediaQueryResult: mediaquery.MediaQueryResult): void {
    console.log(`onPortrait this.windowWidth = ${this.windowWidth}  this.windowHeight = ${this.windowHeight}`)
    let displayData = display.getDefaultDisplaySync();
    this.windowWidth = px2vp(displayData.width)
    this.windowHeight = px2vp(displayData.height);
    if (this.isHalfScreen && this.windowWidth > MAX_WIDTH_LIMIT) {
      animateTo({
        duration: 250,
        curve: Curve.Sharp,
      }, () => {
        this.containerWidth = MAX_WIDTH;
      })
    } else {
      animateTo({
        duration: 250,
        curve: Curve.Sharp,
      }, () => {
        this.containerWidth = '100%';
      })
    }
  }

  parseBoolean(value: string): boolean {
    if (value === 'true') {
      return true;
    }
    return false;
  }

  getResourceColor(defaultColor: string): string {
    if (colorMap.has(defaultColor)) {
      const colorGroup = colorMap.get(defaultColor);
      if (colorGroup) {
        return this.isDark ? colorGroup.dark : colorGroup.light;
      }
    }
    return defaultColor;
  }

  /**
   * atomicservice侧的事件变化回调
   * @param eventName 事件名称
   * @param param 事件参数
   */
  setCustomCallback(eventName: string, param: string): void {
    if (param === null || param === '' || param === undefined) {
      console.error(LOG_TAG, 'invalid params');
      return;
    }
    if (eventName === ARKUI_APP_BAR_COLOR_CONFIGURATION) {
      this.onColorConfigurationUpdate(this.parseBoolean(param))
    } else if (eventName === ARKUI_APP_BAR_MENU_SAFE_AREA) {
      if (this.statusBarHeight === px2vp(Number(param))) {
        return;
      }
      this.statusBarHeight = Number(param);
      this.titleHeight = EYELASH_HEIGHT + 2 * TITLE_MARGIN_TOP + this.statusBarHeight;
    } else if (eventName === ARKUI_APP_BAR_CONTENT_SAFE_AREA) {
      //top left right bottom
      let splitArray: string[] = param.split('|');
      if (splitArray.length < 4) {
        return;
      }
      this.contentMarginTop = this.isHalfScreen ? 0 : Number(splitArray[0]);
      this.fullContentMarginTop = Number(splitArray[0]);
      this.contentMarginLeft = Number(splitArray[1]);
      this.contentMarginRight = Number(splitArray[2]);
      this.contentMarginBottom = Number(splitArray[3]);
    } else if (eventName === ARKUI_APP_BAR_BAR_INFO) {
      let splitArray: string[] = param.split('|');
      if (splitArray.length < 2) {
        return;
      }
      this.bundleName = splitArray[0];
      this.labelName = splitArray[1];
    } else if (eventName === ARKUI_APP_BAR_SCREEN) {
      this.isHalfScreen = this.parseBoolean(param);
    } else if (eventName === ARKUI_APP_BG_COLOR) {
      this.contentBgColor = param;
    }
  }

  /**
   * 颜色变化设置
   * @param isDark 是否是深色模式
   */
  onColorConfigurationUpdate(isDark: boolean): void {
    this.isDark = isDark;
    this.menuFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
    this.closeFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
    this.menubarBorderColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
    this.dividerBackgroundColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
    this.menubarBackColor = this.getResourceColor(MENU_BACK_COLOR);
    this.halfButtonBackColor = this.getResourceColor(HALF_BUTTON_BACK_COLOR);
    this.halfButtonImageColor = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR)
  }

  /**
   * 标题栏图标回调
   * @param pixelMap
   */
  setAppIcon(pixelMap: image.PixelMap): void {
    this.icon = pixelMap;
  }

  /**
   * 服务面板按钮点击回调
   */
  onMenuButtonClick(): void {
  }

  /**
   * 关闭按钮点击回调
   */
  onCloseButtonClick(): void {
  }

  /**
   * 触发构建回调
   */
  onDidBuild(): void {
  }

  /**
   * 半屏拉起动效
   */
  halfScreenShowAnimation(): void {
    animateTo({
      duration: 250,
      curve: Curve.Sharp,
    }, () => {
      this.maskOpacity = 0.3;
    })
    animateTo({
      duration: 100,
      curve: curves.interpolatingSpring(0, 1, 328, 36),
    }, () => {
      this.containerHeight = '100%';
    })
  }

  /**
   * 半屏放大至全屏动效
   */
  expendContainerAnimation(): void {
    animateTo({
      duration: 100,
      curve: curves.interpolatingSpring(0, 1, 328, 36),
    }, () => {
      this.containerHeight = '100%';
      this.borderSize = 0;
      this.containerWidth = '100%';
      this.contentMarginTop = this.fullContentMarginTop;
      this.titleHeight = 0;
    })
    // 标题栏消失
    animateTo({
      duration: 150,
      curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
      onFinish: () => {
        this.isHalfScreen = false;
        this.contentBgColor = '#FFFFFF';
      }
    }, () => {
      this.titleOpacity = 0;
      this.appBarOpacity = 1;
    })
    // 按钮消失
    animateTo({
      duration: 150,
      curve: curves.cubicBezierCurve(0.33, 0, 0.67, 1),
    }, () => {
      this.buttonOpacity = 0;
    })
  }

  /**
   * 半屏嵌入式关闭动效
   */
  closeContainerAnimation(): void {
    // 关闭弹框
    animateTo({
      duration: 100,
      curve: curves.interpolatingSpring(0, 1, 328, 36),
      onFinish: () => {
        this.onCloseButtonClick();
      }
    }, () => {
      this.containerHeight = '0%';
      this.borderSize = 0;
    })
    // 蒙层渐隐
    animateTo({
      duration: 250,
      curve: Curve.Sharp,
    }, () => {
      this.maskOpacity = 0;
    })
    // 标题栏渐隐
    animateTo({
      duration: 200,
      curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
    }, () => {
      this.titleOpacity = 0;
    })
  }

  @Builder
  fullScreenMenubar() {
    Row() {
      Row() {
        Button() {
          Image(this.menuResource)
            .id('AtomicServiceMenuIconId')
            .width(IMAGE_SIZE)
            .height(IMAGE_SIZE)
            .fillColor(this.menuFillColor)
            .draggable(false)
            .interpolation(ImageInterpolation.High)
        }
        .id('AtomicServiceMenuId')
        .type(ButtonType.Normal)
        .borderRadius({ topLeft: MENU_RADIUS, bottomLeft: MENU_RADIUS })
        .backgroundColor(Color.Transparent)
        .width(BUTTON_SIZE)
        .height(VIEW_HEIGHT)
        .gesture(TapGesture().onAction(() => {
          this.onMenuButtonClick();
        }))

        Divider()
          .id('AtomicServiceDividerId')
          .vertical(true)
          .color(this.dividerBackgroundColor)
          .lineCap(LineCapStyle.Round)
          .strokeWidth(BORDER_WIDTH)
          .height(DIVIDER_HEIGHT)

        Button() {
          Image(this.closeResource)
            .id('AtomicServiceCloseIconId')
            .width(IMAGE_SIZE)
            .height(IMAGE_SIZE)
            .fillColor(this.closeFillColor)
            .draggable(false)
            .draggable(false)
            .interpolation(ImageInterpolation.High)
        }
        .id('AtomicServiceCloseId')
        .type(ButtonType.Normal)
        .backgroundColor(Color.Transparent)
        .borderRadius({ topRight: MENU_RADIUS, bottomRight: MENU_RADIUS })
        .width(BUTTON_SIZE)
        .height(VIEW_HEIGHT)
        .gesture(TapGesture().onAction(() => {
          this.onCloseButtonClick();
        }))
      }
      .borderRadius(MENU_RADIUS)
      .borderWidth(BORDER_WIDTH)
      .borderColor(this.menubarBorderColor)
      .backgroundColor(this.menubarBackColor)
      .height(VIEW_HEIGHT)
      .width(VIEW_WIDTH)
      .align(Alignment.Top)
      .draggable(false)
      .id('AtomicServiceMenubarId')
    }
    .id('AtomicServiceMenubarRowId')
    .margin({ top: this.statusBarHeight + MENU_MARGIN_TOP, left: VIEW_MARGIN_RIGHT, right: VIEW_MARGIN_RIGHT })
    .opacity(this.appBarOpacity)
    .justifyContent(FlexAlign.End)
    .height(VIEW_HEIGHT)
    .hitTestBehavior(HitTestMode.Transparent)
    .width('100%')
  }

  @Builder
  eyelashTitle() {
    Column() {
      Row() {
        Row() {
          Image(this.icon).height(ICON_SIZE).width(ICON_SIZE)
            .margin({
              start: LengthMetrics.vp(CHEVRON_MAIGIN)
            })
          Text(this.labelName)
            .fontSize(TITLE_FONT_SIZE)
            .lineHeight(TITLE_LINE_HEIGHT)
            .fontWeight(FontWeight.Medium)
            .fontColor('#FFFFFF')
            .margin({ start: LengthMetrics.vp(TITLE_LABEL_MARGIN) })
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .ellipsisMode(EllipsisMode.END)
          Text('提供服务')
            .fontSize(TITLE_FONT_SIZE)
            .lineHeight(TITLE_LINE_HEIGHT)
            .fontColor('#FFFFFF')
            .margin({ start: LengthMetrics.vp(TITLE_TEXT_MARGIN) })
          SymbolGlyph($r('sys.symbol.chevron_right'))
            .height(CHEVRON_HEIGHT)
            .width(CHEVRON_WIDTH)
            .margin({ start: LengthMetrics.vp(CHEVRON_MAIGIN), end: LengthMetrics.vp(CHEVRON_MAIGIN) })
            .fontColor([Color.White])
        }
        .height(EYELASH_HEIGHT)
        .stateStyles({
          focused: {
            .backgroundColor('#0D000000')
          },
          pressed: {
            .backgroundColor('#1A000000')
          },
          normal: {
            .backgroundColor(Color.Transparent)
          }
        })
        .borderRadius(EYELASH_HEIGHT / 2)
        .onClick(() => {
          console.info(LOG_TAG, ' show panel is ' + this.isShowPanel);
          this.isShowPanel = true;
        })
        .margin({ start: LengthMetrics.vp(TITLE_MARGIN_RIGHT) })
      }
      .margin({
        top: LengthMetrics.vp(this.statusBarHeight + TITLE_MARGIN_TOP),
        bottom: LengthMetrics.vp(TITLE_MARGIN_TOP)
      })
      .opacity(this.titleOpacity)
      .justifyContent(FlexAlign.Start)
      .width('100%')
      .hitTestBehavior(HitTestMode.Transparent)
    }
    .justifyContent(FlexAlign.Start)
    .height(this.titleHeight)
    .hitTestBehavior(HitTestMode.Transparent)
  }

  @Builder
  halfScreenMenuBar() {
    Column() {
      Row() {
        Button({ type: ButtonType.Circle }) {
          SymbolGlyph($r('sys.symbol.arrow_up_left_and_arrow_down_right'))
            .height(BUTTON_IMAGE_SIZE)
            .width(BUTTON_IMAGE_SIZE)
            .fontWeight(FontWeight.Medium)
            .fontColor([this.halfButtonImageColor])
        }.width(BUTTON_SIZE).height(BUTTON_SIZE).backgroundColor(this.halfButtonBackColor)
        .onClick(() => {
          this.expendContainerAnimation();
        })

        Button({ type: ButtonType.Circle }) {
          SymbolGlyph($r('sys.symbol.xmark'))
            .height(BUTTON_IMAGE_SIZE)
            .width(BUTTON_IMAGE_SIZE)
            .fontWeight(FontWeight.Medium)
            .fontColor([this.halfButtonImageColor])
        }
        .width(BUTTON_SIZE)
        .height(BUTTON_SIZE)
        .margin({ start: LengthMetrics.vp(VIEW_MARGIN_RIGHT), end: LengthMetrics.vp(HALF_MENU_MARGIN) })
        .backgroundColor(this.halfButtonBackColor)
        .onClick(() => {
          this.closeContainerAnimation();
        })
      }
      .width(this.containerWidth)
      .height(this.containerHeight)
      .alignItems(VerticalAlign.Top)
      .justifyContent(FlexAlign.End)
      .margin({
        top: LengthMetrics.vp(this.titleHeight + HALF_MENU_MARGIN)
      })
      .opacity(this.buttonOpacity)
    }.height('100%')
    .width('100%')
    .justifyContent(FlexAlign.End)
    .hitTestBehavior(HitTestMode.Transparent)
  }

  @Builder
  panelBuilder() {
    UIExtensionComponent({
      bundleName: 'com.huawei.hmos.asde',
      abilityName: 'PanelAbility',
      moduleName: 'panel',
      parameters: {
        'ability.want.params.uiExtensionType': 'sysDialog/atomicServicePanel',
        'bundleName': this.bundleName,
        'pageName': 'DETAIL'
      }
    })
      .defaultFocus(true)
      .height('100%')
      .width('100%')
      .onError(
        err => {
          this.isShowPanel = false;
          console.error(LOG_TAG, 'call up UIExtension error! %{public}s', err.message);
        }
      )
      .onReceive(() => {
        console.error(LOG_TAG, 'call up UIExtension error!');
      })
      .onTerminated(() => {
        console.error(LOG_TAG, 'onTerminated');
        this.isShowPanel = false;
      })
  }

  build() {
    Column() {
      Stack({ alignContent: Alignment.TopEnd }) {
        if (this.isHalfScreen) {
          // 透明模糊背板
          Column()
            .width('100%')
            .height('100%')
            .backgroundColor('#262626')
            .opacity(this.maskOpacity)
            .foregroundBlurStyle(BlurStyle.BACKGROUND_REGULAR)
            .onClick(() => {
              this.closeContainerAnimation();
            })
        }
        Column() {
          Column() {
            if (this.isHalfScreen) {
              this.eyelashTitle()
            }
            Row() {
            }
            .padding({
              top: this.contentMarginTop,
              left: this.contentMarginLeft,
              right: this.contentMarginRight,
              bottom: this.contentMarginBottom
            })
            .layoutWeight(1)
            .backgroundColor(Color.Transparent)
            .backgroundBlurStyle(BlurStyle.COMPONENT_ULTRA_THICK)
            .borderRadius({
              topLeft: this.borderSize,
              topRight: this.borderSize,
            })
            .clip(true)
            .alignItems(VerticalAlign.Bottom)
            .hitTestBehavior(HitTestMode.Transparent)
            .id('AtomicServiceStageId')
          }
          .height(this.containerHeight)
          .width(this.containerWidth)
          .justifyContent(FlexAlign.End)
          .hitTestBehavior(HitTestMode.Transparent)
        }.height('100%')
        .width('100%')
        .justifyContent(FlexAlign.End)
        .hitTestBehavior(HitTestMode.Transparent)
        if (this.isHalfScreen) {
          this.halfScreenMenuBar()
        } else {
          this.fullScreenMenubar()
        }
      }
      .height('100%')
      .width('100%')
      .backgroundColor(this.contentBgColor)
      .hitTestBehavior(HitTestMode.Transparent)
      .id('AtomicServiceContainerId')
    }
    .height('100%')
    .width('100%')
    .justifyContent(FlexAlign.End)
    .backgroundColor(Color.Transparent)
    .hitTestBehavior(HitTestMode.Transparent)
    .bindContentCover(this.isShowPanel, this.panelBuilder())
  }
}