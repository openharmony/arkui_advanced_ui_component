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
import { BusinessError, commonEventManager } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { systemParameterEnhance } from '@kit.BasicServicesKit';
import { Animator as animator, AnimatorResult, componentUtils } from '@kit.ArkUI';
import { AnimatorOptions } from '@ohos.animator';

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
const MENU_BACK_BLUR: number = 5;
const MENU_MARGIN_TOP: number = 10;
const SM_MENU_MARGIN_END: number = 16;
const MD_MENU_MARGIN_END: number = 24;
const LG_MENU_MARGIN_END: number = 32;
// 半屏参数
const BUTTON_IMAGE_SIZE: number = 18;
const HALF_CONTAINER_BORDER_SIZE: number = 32;
const HALF_BUTTON_BACK_COLOR: string = '#0D000000';
const HALF_BUTTON_IMAGE_COLOR: string = '#0C000000';
const HALF_MENU_MARGIN: number = 16;
const EYELASH_HEIGHT: number = 36;
const CHEVRON_HEIGHT: number = 20;
const CHEVRON_WIDTH: number = 10;
const CHEVRON_MARGIN: number = 4;
const TITLE_FONT_SIZE: number = 14;
const TITLE_LINE_HEIGHT: number = 16;
const TITLE_MARGIN_RIGHT: number = 12;
const TITLE_MARGIN_TOP: number = 8;
const TITLE_LABEL_MARGIN: number = 8.5;
const TITLE_CONSTRAINT_SIZE: string = 'calc(100% - 73.5vp)';
const MD_WIDTH: number = 480;
const LG_WIDTH_LIMIT: number = 0.6;
const LG_WIDTH_HEIGHT_RATIO: number = 1.95;
const PRIVACY_MARGIN: number = 12;
const PRIVACY_FONT_SIZE: string = '12vp';
const PRIVACY_TEXT_MARGIN_START: number = 4;
const PRIVACY_TEXT_MARGIN_END: number = 8;
const PRIVACY_CONSTRAINT_SIZE: string = 'calc(100% - 136vp)';
const ARKUI_APP_BAR_COLOR_CONFIGURATION: string = 'arkui_app_bar_color_configuration';
const ARKUI_APP_BAR_MENU_SAFE_AREA: string = 'arkui_app_bar_menu_safe_area';
const ARKUI_APP_BAR_CONTENT_SAFE_AREA: string = 'arkui_app_bar_content_safe_area';

const ARKUI_APP_BAR_BAR_INFO: string = 'arkui_app_bar_info';
const ARKUI_APP_BAR_SCREEN: string = 'arkui_app_bar_screen';
const ARKUI_APP_BG_COLOR: string = 'arkui_app_bg_color';
const ARKUI_APP_BAR_SERVICE_PANEL: string = 'arkui_app_bar_service_panel';
const ARKUI_APP_BAR_CLOSE: string = 'arkui_app_bar_close';
const ARKUI_APP_BAR_PROVIDE_SERVICE: string = 'arkui_app_bar_provide_service';
const EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK = 'arkui_custom_app_bar_menu_click';
const EVENT_NAME_CUSTOM_APP_BAR_CLOSE_CLICK = 'arkui_custom_app_bar_close_click';
const EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD = 'arkui_custom_app_bar_did_build';
const EVENT_NAME_CUSTOM_APP_BAR_CREATE_SERVICE_PANEL = 'arkui_custom_app_bar_create_service_panel';
const ARKUI_APP_BAR_MAXIMIZE: string = 'arkui_app_bar_maximize';
const ARKUI_APP_BAR_PRIVACY_AUTHORIZE: string = 'arkui_app_bar_privacy_authorize';

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

enum BreakPointsType {
  NONE = 'NONE',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG'
}

const menuMarginEndMap: Map<BreakPointsType, number> = new Map<BreakPointsType, number>([
  [BreakPointsType.NONE, SM_MENU_MARGIN_END],
  [BreakPointsType.SM, SM_MENU_MARGIN_END],
  [BreakPointsType.MD, MD_MENU_MARGIN_END],
  [BreakPointsType.LG, LG_MENU_MARGIN_END]
]);

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
  @State privacyResource: Resource = {
    bundleName: '',
    moduleName: '',
    params: [],
    id: 125835516,
    type: 20000
  };
  @State menuFillColor: string = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
  @State closeFillColor: string = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
  @State menubarBorderColor: string = this.getResourceColor(BORDER_COLOR_DEFAULT);
  @State menubarBackColor: string = this.getResourceColor(MENU_BACK_COLOR);
  @State dividerBackgroundColor: string = this.getResourceColor(BORDER_COLOR_DEFAULT);
  @State halfButtonBackColor: string = this.getResourceColor(HALF_BUTTON_BACK_COLOR);
  @State halfButtonImageColor: string = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
  @State privacyImageColor: string = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);

  @State contentMarginTop: number = 0;
  @State contentMarginLeft: number = 0;
  @State contentMarginRight: number = 0;
  @State contentMarginBottom: number = 0;
  @State menuMarginEnd: number = SM_MENU_MARGIN_END;
  // 半屏参数
  @State isHalfScreen: boolean = true;
  @State containerHeight: string | number = '0%';
  @State containerWidth: string | number = '100%';
  @State stackHeight: string = '100%';
  @State titleOpacity: number = 0;
  @State buttonOpacity: number = 1;
  @State titleHeight: number = 0;
  @State titleOffset: number = 0;
  @State maskOpacity: number = 0;
  @State maskBlurScale: number = 0;
  @State contentBgColor: ResourceColor = '#FFFFFFFF';
  @State statusBarHeight: number = 0;
  @State ratio: number | undefined = undefined;
  @State @Watch('onBreakPointChange') breakPoint: BreakPointsType = BreakPointsType.NONE;
  @State serviceMenuRead: string = this.getStringByResourceToken(ARKUI_APP_BAR_SERVICE_PANEL);
  @State closeRead: string = this.getStringByResourceToken(ARKUI_APP_BAR_CLOSE);
  @State maximizeRead: string = this.getStringByResourceToken(ARKUI_APP_BAR_MAXIMIZE);
  @State provideService: string = '';
  @State privacyWidth: string = '0';
  @State privacySymbolOpacity: number = 0;
  @State angle: string = '-90deg';
  @State buttonSize: number = BUTTON_SIZE;
  @State privacyTextOpacity: number = 0;
  @State dividerOpacity: number = 0;
  @State isShowPrivacyAnimation: boolean = false;
  @State privacyAuthText: string = '';
  private isHalfToFullScreen: boolean = false;
  private isDark: boolean = true;
  private bundleName: string = '';
  @State labelName: string = '';
  private icon: Resource | string | PixelMap = $r('sys.media.ohos_app_icon');
  private fullContentMarginTop: number = 0;
  private deviceBorderRadius: string = '0';
  private privacyAnimator: AnimatorResult | undefined = undefined;
  private smListener: mediaquery.MediaQueryListener = mediaquery.matchMediaSync('(0vp<width) and (width<600vp)');
  private mdListener: mediaquery.MediaQueryListener = mediaquery.matchMediaSync('(600vp<=width) and (width<840vp)');
  private lgListener: mediaquery.MediaQueryListener = mediaquery.matchMediaSync('(840vp<=width)');
  // 订阅者信息, 用于保存创建成功的订阅者对象，后续使用其完成订阅及退订的动作
  private subscriber: commonEventManager.CommonEventSubscriber | null = null;
  // 事件列表
  private subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
    events: ['usual.event.PRIVACY_STATE_CHANGED']
  };

  aboutToAppear(): void {
    if (this.isHalfScreen) {
      this.contentBgColor = Color.Transparent;
      this.titleHeight = EYELASH_HEIGHT + 2 * TITLE_MARGIN_TOP + this.statusBarHeight;
      this.halfScreenShowAnimation();
    } else {
      this.containerHeight = '100%';
      this.containerWidth = '100%';
    }
    this.updateStringByResource();
    this.getDeviceRadiusConfig();
    this.subscribePrivacyState();
  }

  aboutToDisappear(): void {
    this.smListener.off('change');
    this.mdListener.off('change');
    this.lgListener.off('change');
    if (this.subscriber !== null) {
      commonEventManager.unsubscribe(this.subscriber, (err) => {
        if (err) {
          hilog.error(0x3900, LOG_TAG, `unsubscribe err callback, message is ${err.message}`);
        } else {
          this.subscriber = null;
        }
      });
    }
  }

  /**
   * 注册监听隐私协议状态
   */
  private subscribePrivacyState(): void {
    try {
      // 创建订阅者
      commonEventManager.createSubscriber(this.subscribeInfo).then((commonEventSubscriber) => {
        this.subscriber = commonEventSubscriber;
        // 订阅公共事件
        try {
          commonEventManager.subscribe(this.subscriber, (err, data) => {
            if (err) {
              hilog.error(0x3900, LOG_TAG, `subscribe failed, code is ${err?.code}, message is ${err?.message}`);
              return;
            }
            let result = JSON.parse(data?.data ?? '{}')?.resultType as number;
            // privacyMgmtType：1 隐私同意完整模式
            if (result === 1) {
              if (this.isHalfScreen) {
                return;
              }
              this.isShowPrivacyAnimation = true;
              this.startPrivacyAnimation();
            }
          });
        } catch (error) {
          hilog.error(0x3900, LOG_TAG, `init Subscriber failed, code is ${error?.code}, message is ${error?.message}`);
        }
      }).catch((error: BusinessError) => {
        hilog.error(0x3900, LOG_TAG, `createSubscriber failed, code is ${error?.code}, message is ${error?.message}`);
      });
    } catch (error) {
      hilog.error(0x3900, LOG_TAG,
        `subscribePrivacyState failed, code is ${error?.code}, message is ${error?.message}`);
    }
  }

  getDeviceRadiusConfig(): void {
    try {
      this.deviceBorderRadius = systemParameterEnhance.getSync('const.product.device_radius');
      hilog.info(0x3900, LOG_TAG, `read device_radius success, device_radius: ${this.deviceBorderRadius}`);
    } catch (error) {
      hilog.error(0x3900, LOG_TAG, `read device_radius failed`);
    }
  }

  initBreakPointListener(): void {
    this.smListener.on('change', (mediaQueryResult: mediaquery.MediaQueryResult) => {
      if (mediaQueryResult.matches) {
        this.breakPoint = BreakPointsType.SM;
      }
    })
    this.mdListener.on('change', (mediaQueryResult: mediaquery.MediaQueryResult) => {
      if (mediaQueryResult.matches) {
        this.breakPoint = BreakPointsType.MD;
      }
    })
    this.lgListener.on('change', (mediaQueryResult: mediaquery.MediaQueryResult) => {
      if (mediaQueryResult.matches) {
        this.breakPoint = BreakPointsType.LG;
      }
    })
  }

  onBreakPointChange(): void {
    if (menuMarginEndMap.has(this.breakPoint)) {
      this.menuMarginEnd = menuMarginEndMap.get(this.breakPoint) as number;
    }
    if (this.isHalfScreen) {
      if (this.breakPoint === BreakPointsType.SM) {
        this.containerWidth = '100%';
      } else if (this.breakPoint === BreakPointsType.MD) {
        this.containerWidth = MD_WIDTH;
      } else if (this.breakPoint === BreakPointsType.LG) {
        try {
          let displayData = display.getDefaultDisplaySync();
          let windowWidth = px2vp(displayData.width);
          let windowHeight = px2vp(displayData.height);
          this.containerWidth = windowWidth > windowHeight ? windowHeight * LG_WIDTH_LIMIT : windowWidth * LG_WIDTH_LIMIT;
        } catch (error) {
          hilog.error(0x3900, LOG_TAG, `getDefaultDisplaySync failed, code is ${error?.code}, message is ${error?.message}`);
        }
    }
      }
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

  getStringByResourceToken(resName: string, value?: string): string {
    try {
      if (value) {
        return getContext(this).resourceManager.getStringByNameSync(resName, value);
      }
      return getContext(this).resourceManager.getStringByNameSync(resName);
    } catch (err) {
      hilog.error(0x3900, LOG_TAG, `getAccessibilityDescription, error: ${err.toString()}`);
    }
    return '';
  }

  updateStringByResource(): void {
    if (this.isHalfScreen) {
      this.provideService = this.getStringByResourceToken(ARKUI_APP_BAR_PROVIDE_SERVICE, this.labelName);
      this.maximizeRead = this.getStringByResourceToken(ARKUI_APP_BAR_MAXIMIZE);
    }
    this.closeRead = this.getStringByResourceToken(ARKUI_APP_BAR_CLOSE);
    this.serviceMenuRead = this.getStringByResourceToken(ARKUI_APP_BAR_SERVICE_PANEL);
    this.privacyAuthText = this.getStringByResourceToken(ARKUI_APP_BAR_PRIVACY_AUTHORIZE);
  }

  /**
   * atomicservice侧的事件变化回调
   * @param eventName 事件名称
   * @param param 事件参数
   */
  setCustomCallback(eventName: string, param: string): void {
    if (param === null || param === '' || param === undefined) {
      hilog.error(0x3900, LOG_TAG, 'invalid params');
      return;
    }
    if (eventName === ARKUI_APP_BAR_COLOR_CONFIGURATION) {
      this.onColorConfigurationUpdate(this.parseBoolean(param));
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
      this.updateStringByResource();
    } else if (eventName === ARKUI_APP_BAR_SCREEN) {
      this.isHalfScreen = this.parseBoolean(param);
      this.initBreakPointListener();
    } else if (eventName === ARKUI_APP_BG_COLOR) {
      if (this.isHalfScreen) {
        this.contentBgColor = Color.Transparent;
      } else {
        this.contentBgColor = param;
      }
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
    this.halfButtonImageColor = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
    this.privacyImageColor = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
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
   * 点击title栏
   */
  onEyelashTitleClick(): void {
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
      this.maskBlurScale = 1;
    });
    animateTo({
      duration: 250,
      curve: curves.interpolatingSpring(0, 1, 328, 36),
    }, () => {
      this.containerHeight = '100%';
      this.ratio = this.breakPoint === BreakPointsType.LG ? 1 / LG_WIDTH_HEIGHT_RATIO : undefined;

    });
    // 标题栏渐显
    animateTo({
      duration: 100,
      curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
    }, () => {
      this.titleOpacity = 1;
    });
  }

  /**
   * 半屏放大至全屏动效
   */
  expendContainerAnimation(): void {
    animateTo({
      duration: 150,
      curve: curves.interpolatingSpring(0, 1, 328, 36),
      onFinish: () => {
        this.contentBgColor = '#FFFFFF';
        this.isHalfToFullScreen = true;
      }
    }, () => {
      this.containerWidth = '100%';
      this.contentMarginTop = this.fullContentMarginTop;
      this.titleOffset = -this.titleHeight;
      this.isHalfScreen = false;
    });
    // 标题栏渐隐
    animateTo({
      duration: 100,
      curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
    }, () => {
      this.titleOpacity = 0;
    });
  }

  /**
   * 嵌入式关闭动效
   */
  closeContainerAnimation(): void {
    if (this.isHalfScreen) {
      this.closeHalfContainerAnimation();
      return;
    }
    if (this.isHalfToFullScreen) {
      // 关闭弹框
      animateTo({
        duration: 250,
        curve: curves.interpolatingSpring(0, 1, 328, 36),
        onFinish: () => {
          this.onCloseButtonClick();
        }
      }, () => {
        this.stackHeight = '0%';
      });
    } else {
      this.onCloseButtonClick();
    }
  }

  closeHalfContainerAnimation() {
    // 关闭弹框
    animateTo({
      duration: 250,
      curve: curves.interpolatingSpring(0, 1, 328, 36),
      onFinish: () => {
        this.onCloseButtonClick();
      }
    }, () => {
      this.containerHeight = '0%';
      this.ratio = undefined;
    });
    // 蒙层渐隐
    animateTo({
      duration: 250,
      curve: Curve.Sharp,
    }, () => {
      this.maskOpacity = 0;
      this.maskBlurScale = 0;
    });
    // 标题栏渐隐
    animateTo({
      duration: 100,
      curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
    }, () => {
      this.titleOpacity = 0;
    });
  }

  /**
   * 开始隐私标识动效
   */
  private startPrivacyAnimation(): void {
    animateTo({
      curve: curves.interpolatingSpring(2, 1, 328, 26),
    }, () => {
      this.privacyWidth = '';
    });
    animateTo({
      duration: 250,
      curve: Curve.Sharp,
      delay: 100,
    }, () => {
      this.privacyTextOpacity = 1;
    });
    animateTo({
      delay: 200,
      curve: curves.interpolatingSpring(2, 1, 500, 26),
    }, () => {
      this.angle = '0';
    });
    animateTo({
      duration: 100,
      delay: 200,
      curve: Curve.Sharp,
    }, () => {
      this.privacySymbolOpacity = 1;
      this.dividerOpacity = 1;
    });
    // 延迟5s后开始退出动画
    setTimeout(() => {
      this.initPrivacyAnimator();
      animateTo({
        duration: 50,
        curve: Curve.Sharp,
      }, () => {
        this.dividerOpacity = 0;
      });
      animateTo({
        duration: 100,
        curve: Curve.Sharp,
      }, () => {
        this.privacyTextOpacity = 0;
      });
      animateTo({
        duration: 150,
        curve: Curve.Sharp,
      }, () => {
        this.privacySymbolOpacity = 0;
      });
      this.privacyAnimator?.play();
    }, 5000);
  }

  /**
   * 隐私标识动效退出，menubar长度缩小帧动画初始化
   */
  private initPrivacyAnimator(): void {
    let privacyTextLength = px2vp(componentUtils.getRectangleById('AtomicServiceMenuPrivacyId').size.width);
      let options: AnimatorOptions = {
        duration: 500,
        easing: 'interpolating-spring(1, 1, 328, 26)',
        delay: 0,
        fill: 'forwards',
        direction: 'normal',
        iterations: 1,
        begin: privacyTextLength + PRIVACY_MARGIN + PRIVACY_TEXT_MARGIN_START + PRIVACY_TEXT_MARGIN_END,
        end: 0
      };
    this.privacyAnimator = animator.create(options);
    this.privacyAnimator.onFrame = (value: number) => {
      // 当动画帧值小于0.01时，不做动画。
      if (value <= 0 && Math.abs(value) < 0.01) {
        this.buttonSize = BUTTON_SIZE;
        this.privacyWidth = '0';
        return;
      }
      // 当动画帧值小于0时，对menu按钮做动画；大于0时，对隐私动效宽度做动画。
      if (value < 0) {
        this.buttonSize = BUTTON_SIZE + value;
      } else {
        this.privacyWidth = JSON.stringify(value);
      }
    }
    this.privacyAnimator.onFinish = () => {
      this.isShowPrivacyAnimation = false;
    };
  }

  @Builder
  privacySecurityLabel() {
    Row() {
      SymbolGlyph(this.privacyResource)
        .fontSize(IMAGE_SIZE)
        .fontColor([this.privacyImageColor, Color.Blue])
        .renderingStrategy(SymbolRenderingStrategy.MULTIPLE_COLOR)
        .margin({ start: LengthMetrics.vp(PRIVACY_MARGIN) })
        .opacity(this.privacySymbolOpacity)
        .rotate({
          x: 0,
          y: 1,
          z: 0,
          centerX: '50%',
          centerY: '50%',
          angle: this.angle
        })
      Text(this.privacyAuthText)
        .fontSize(PRIVACY_FONT_SIZE)
        .fontWeight(FontWeight.Regular)
        .textAlign(TextAlign.Center)
        .padding({
          start: LengthMetrics.vp(PRIVACY_TEXT_MARGIN_START),
          end: LengthMetrics.vp(PRIVACY_TEXT_MARGIN_END)
        })
        .textAlign(TextAlign.Start)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .wordBreak(WordBreak.BREAK_WORD)
        .opacity(this.privacyTextOpacity)
        .ellipsisMode(EllipsisMode.END)
        .constraintSize({ maxWidth: PRIVACY_CONSTRAINT_SIZE })
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .renderFit(RenderFit.RESIZE_FILL)
        .maxLines(1)
        .id('AtomicServiceMenuPrivacyId')
    }
    .width(this.privacyWidth)

    Divider()
      .id('AtomicServiceDividerId')
      .vertical(true)
      .color(this.dividerBackgroundColor)
      .lineCap(LineCapStyle.Round)
      .strokeWidth(BORDER_WIDTH)
      .height(DIVIDER_HEIGHT)
      .opacity(this.dividerOpacity)
  }

  @Builder
  fullScreenMenubar() {
    Row() {
      Row() {
        if (this.isShowPrivacyAnimation) {
          this.privacySecurityLabel()
        }

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
        .width(this.buttonSize)
        .height(VIEW_HEIGHT)
        .accessibilityText(this.serviceMenuRead)
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
            .interpolation(ImageInterpolation.High)
        }
        .id('AtomicServiceCloseId')
        .type(ButtonType.Normal)
        .backgroundColor(Color.Transparent)
        .borderRadius({ topRight: MENU_RADIUS, bottomRight: MENU_RADIUS })
        .width(BUTTON_SIZE)
        .height(VIEW_HEIGHT)
        .accessibilityText(this.closeRead)
        .gesture(TapGesture().onAction(() => {
          this.closeContainerAnimation();
        }))
      }
      .borderRadius(MENU_RADIUS)
      .borderWidth(BORDER_WIDTH)
      .borderColor(this.menubarBorderColor)
      .backgroundColor(this.menubarBackColor)
      .backgroundEffect({
        radius: MENU_BACK_BLUR,
        color: this.menubarBackColor
      })
      .height(VIEW_HEIGHT)
      .align(Alignment.Top)
      .draggable(false)
      .geometryTransition('menubar')
      .id('AtomicServiceMenubarId')
    }
    .id('AtomicServiceMenubarRowId')
    .margin({
      top: LengthMetrics.vp(this.statusBarHeight + MENU_MARGIN_TOP),
      end: LengthMetrics.vp(this.menuMarginEnd)
    })
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
              start: LengthMetrics.vp(CHEVRON_MARGIN)
            })
          Text(this.provideService)
            .fontSize(TITLE_FONT_SIZE)
            .lineHeight(TITLE_LINE_HEIGHT)
            .fontWeight(FontWeight.Medium)
            .fontColor('#FFFFFF')
            .margin({ start: LengthMetrics.vp(TITLE_LABEL_MARGIN) })
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .ellipsisMode(EllipsisMode.END)
            .constraintSize({ maxWidth: TITLE_CONSTRAINT_SIZE })
          SymbolGlyph($r('sys.symbol.chevron_right'))
            .height(CHEVRON_HEIGHT)
            .width(CHEVRON_WIDTH)
            .margin({ start: LengthMetrics.vp(CHEVRON_MARGIN), end: LengthMetrics.vp(CHEVRON_MARGIN) })
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
          this.onEyelashTitleClick();
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
    .offset({ y: this.titleOffset })
    .hitTestBehavior(HitTestMode.Transparent)
  }

  @Builder
  halfScreenMenuBar() {
    Column() {
      Row() {
        Row() {
          Button({ type: ButtonType.Circle }) {
            SymbolGlyph($r('sys.symbol.arrow_up_left_and_arrow_down_right'))
              .fontSize(BUTTON_IMAGE_SIZE)
              .fontWeight(FontWeight.Medium)
              .fontColor([this.halfButtonImageColor])
          }.width(BUTTON_SIZE).height(BUTTON_SIZE).backgroundColor(this.halfButtonBackColor)
          .onClick(() => {
            this.expendContainerAnimation();
          })
          .accessibilityText(this.maximizeRead)
          Button({ type: ButtonType.Circle }) {
            SymbolGlyph($r('sys.symbol.xmark'))
              .fontSize(BUTTON_IMAGE_SIZE)
              .fontWeight(FontWeight.Medium)
              .fontColor([this.halfButtonImageColor])
          }
          .width(BUTTON_SIZE)
          .height(BUTTON_SIZE)
          .margin({
            start: LengthMetrics.vp(VIEW_MARGIN_RIGHT),
          })
          .backgroundColor(this.halfButtonBackColor)
          .onClick(() => {
            this.closeContainerAnimation();
          })
          .accessibilityText(this.closeRead)
        }
        .geometryTransition('menubar')
        .justifyContent(FlexAlign.End)
        .transition(TransitionEffect.OPACITY)
        .borderRadius(MENU_RADIUS)
        .height(BUTTON_SIZE)
        .margin({
          top: LengthMetrics.vp(this.titleHeight + HALF_MENU_MARGIN),
          end: LengthMetrics.vp(HALF_MENU_MARGIN)
        })
      }
      .width(this.containerWidth)
      .height(this.containerHeight)
      .aspectRatio(this.ratio)
      .alignItems(VerticalAlign.Top)
      .justifyContent(FlexAlign.End)
      .opacity(this.buttonOpacity)
    }.height('100%')
    .width('100%')
    .justifyContent(FlexAlign.End)
    .hitTestBehavior(HitTestMode.Transparent)
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
            .foregroundBlurStyle(BlurStyle.BACKGROUND_REGULAR, { scale: this.maskBlurScale })
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
            .backgroundBlurStyle(this.isHalfScreen ? BlurStyle.COMPONENT_ULTRA_THICK : undefined)
            .borderRadius({
              topLeft: this.isHalfScreen ? HALF_CONTAINER_BORDER_SIZE : this.deviceBorderRadius,
              topRight: this.isHalfScreen ? HALF_CONTAINER_BORDER_SIZE : this.deviceBorderRadius,
            })
            .clip(true)
            .alignItems(VerticalAlign.Bottom)
            .hitTestBehavior(HitTestMode.Transparent)
            .width('100%')
            .id('AtomicServiceStageId')
          }
          .height(this.containerHeight)
          .width(this.containerWidth)
          .aspectRatio(this.ratio)
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
      .height(this.stackHeight)
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
  }
}