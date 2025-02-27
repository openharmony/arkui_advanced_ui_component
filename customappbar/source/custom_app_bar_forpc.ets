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

import { bundleManager, common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { LengthMetrics, window } from '@kit.ArkUI';

const BUTTON_WIDTH: number = 28;
const VIEW_HEIGHT: number = 28;
const IMAGE_SIZE: number = 16;
const MENU_RADIUS: number = 15.5;
const DIVIDER_HEIGHT: number = 16.5;
const DIVIDER_WIDTH: number = 0.5;
const MENU_BUTTON_MARGIN: number = 2;
const VIEW_MARGIN_TOP: number = 14;
const VIEW_MARGIN_RIGHT: number = 24;
const MENU_BACK_BLUR: number = 5;
const MENU_BORDER_WIDTH: string = '0.5px';

const ICON_FILL_COLOR_DEFAULT: string = '#182431';
const BORDER_COLOR_DEFAULT: string = '#33000000';
const MENU_BACK_COLOR: string = '#99FFFFFF';

const ARKUI_APP_BAR_COLOR_CONFIGURATION: string = 'arkui_app_bar_color_configuration';
const ARKUI_APP_BAR_CONTENT_SAFE_AREA: string = 'arkui_app_bar_content_safe_area';
const ARKUI_APP_BG_COLOR: string = 'arkui_app_bg_color';
const maximizeButtonResourceId: number = 125829923;
const recoverButtonResourceId: number = 125829925;
const EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK = 'arkui_custom_app_bar_menu_click';
const EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD = 'arkui_custom_app_bar_did_build';
const EVENT_NAME_MIN_CLICK: string = 'arkui_custom_min_click';
const EVENT_NAME_CLOSE_CLICK: string = 'arkui_custom_close_click';
const EVENT_NAME_CUSTOM_MAX_CLICK: string = 'arkui_custom_max_click';

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
]);

@Component
export struct CustomAppBarForPC {
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
  @State menubarBorderColor: string = this.getResourceColor(BORDER_COLOR_DEFAULT);
  @State menubarBackColor: string = this.getResourceColor(MENU_BACK_COLOR);
  @State dividerBackgroundColor: string = this.getResourceColor(BORDER_COLOR_DEFAULT);
  @State contentBgColor: string = '#FFFFFFFF';
  @State contentMarginTop: string = '0vp';
  @State contentMarginLeft: string = '0vp';
  @State contentMarginRight: string = '0vp';
  @State contentMarginBottom: string = '0vp';
  @State isAdaptPC: boolean = false;
  @State maximizeResource: Resource = this.getIconResource(maximizeButtonResourceId);
  private isDark: boolean = true;
  private windowClass: window.Window | undefined = undefined;

  async aboutToAppear(): Promise<void> {
    let bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_HAP_MODULE;
    try {
      bundleManager.getBundleInfoForSelf(bundleFlags).then((data) => {
        hilog.info(0x0000, 'testTag', 'getBundleInfoForSelf successfully. Data: %{public}s',
          JSON.stringify(data.hapModulesInfo[0].deviceTypes));
        let devicetype = data.hapModulesInfo[0].deviceTypes;
        for (let i = 0; i < devicetype.length; i++) {
          if (devicetype[i] === '2in1') {
            this.isAdaptPC = true;
            break;
          }
        }
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, 'testTag', 'getBundleInfoForSelf failed. Cause: %{public}s', err.message);
      });
    } catch (err) {
      let message = (err as BusinessError).message;
      hilog.error(0x0000, 'testTag', 'getBundleInfoForSelf failed: %{public}s', message);
    }
    
    let context = getContext(this) as common.UIAbilityContext;
    context?.windowStage?.getMainWindow().then(
      data => {
        this.windowClass = data;
        this.windowClass?.setWindowDecorVisible(false);
        this.windowClass?.setWindowTitleButtonVisible(false, false, false);
        this.updateMaximizeResource(this.windowClass?.getWindowStatus());
        this.windowClass?.on('windowStatusChange', (windowStatusType) => {
          console.info('windowStatusChange  windowStatusType: ' + JSON.stringify(windowStatusType));
          this.updateMaximizeResource(windowStatusType);
        });
      }
    ).catch((err: BusinessError) => {
      if (err.code) {
        console.error(`Failed to obtain the main window. Cause code: ${err.code}, message: ${err.message}`);
      }
    });
  }

  updateMaximizeResource(windowStatusType: window.WindowStatusType): void {
    if (windowStatusType === window.WindowStatusType.FULL_SCREEN ||
      windowStatusType === window.WindowStatusType.SPLIT_SCREEN) {
      this.maximizeResource = this.getIconResource(recoverButtonResourceId);
    } else {
      this.maximizeResource = this.getIconResource(maximizeButtonResourceId);
    }
  }

  aboutToDisappear(): void {
    this.windowClass?.off('windowStatusChange');
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
   * 监听来自arkui侧的回调
   * @param eventName 事件名
   * @param param 参数
   */
  setCustomCallback(eventName: string, param: string) {
    if (eventName === ARKUI_APP_BAR_COLOR_CONFIGURATION) {
      this.onColorConfigurationUpdate(this.parseBoolean(param));
    } else if (eventName === ARKUI_APP_BAR_CONTENT_SAFE_AREA) {
      //top left right bottom
      let splitArray: string[] = param.split('|');
      if (splitArray.length < 4) {
        return;
      }
      this.contentMarginTop = splitArray[0];
      this.contentMarginLeft = splitArray[1];
      this.contentMarginRight = splitArray[2];
      this.contentMarginBottom = splitArray[3];
    } else if (eventName === ARKUI_APP_BG_COLOR) {
      this.contentBgColor = param;
    }
  }

  /**
   * menu按钮点击
   */
  onMenuButtonClick(): void {
  }

  /**
   * 点击放大按钮
   */
  onMaximizeButtonClick(): void {
  }

  /**
   * 点击最小化按钮
   */
  onMinimizeButtonClick(): void {
  }

  /**
   * 点击关闭按钮
   */
  onCloseButtonClick(): void {
  }

  onDidBuild(): void {
  }

  @Builder
  dividerLine() {
    Divider()
      .id('AtomicServiceDividerId')
      .vertical(true)
      .color(this.dividerBackgroundColor)
      .lineCap(LineCapStyle.Round)
      .strokeWidth(DIVIDER_WIDTH)
      .height(DIVIDER_HEIGHT)
  }

  build() {
    Column() {
      Stack({ alignContent: Alignment.TopEnd }) {
        Row() {
        }
        .padding({
          top: this.contentMarginTop,
          left: this.contentMarginLeft,
          right: this.contentMarginRight,
          bottom: this.contentMarginBottom
        })
        .height('100%')
        .width('100%')
        .id('AtomicServiceStageId')
        .backgroundColor(Color.Blue)

        Row() {
          Row() {
            Button() {
              Image(this.menuResource)
                .width(IMAGE_SIZE)
                .height(IMAGE_SIZE)
                .fillColor(this.menuFillColor)
                .draggable(false)
                .interpolation(ImageInterpolation.High)
                .margin({ start: LengthMetrics.vp(MENU_BUTTON_MARGIN) })
            }
            .id('AtomicServiceMenuId')
            .type(ButtonType.Normal)
            .borderRadius({ topLeft: MENU_RADIUS, bottomLeft: MENU_RADIUS })
            .backgroundColor(Color.Transparent)
            .width(BUTTON_WIDTH + MENU_BUTTON_MARGIN)
            .height(VIEW_HEIGHT)
            .gesture(TapGesture().onAction(() => {
              this.onMenuButtonClick();
            }))

            this.dividerLine()

            if (this.isAdaptPC) {
              Button() {
                Image(this.maximizeResource)
                  .width(IMAGE_SIZE)
                  .height(IMAGE_SIZE)
                  .fillColor(this.menuFillColor)
                  .draggable(false)
                  .interpolation(ImageInterpolation.High)
              }
              .id('AtomicServiceexpendId')
              .type(ButtonType.Normal)
              .backgroundColor(Color.Transparent)
              .width(BUTTON_WIDTH)
              .height(VIEW_HEIGHT)
              .gesture(TapGesture().onAction(() => {
                this.onMaximizeButtonClick();
              }))

              this.dividerLine()
            }

            Button() {
              SymbolGlyph($r('sys.symbol.minus'))
                .fontSize(IMAGE_SIZE)
                .fontColor([this.menuFillColor])
                .draggable(false)
            }
            .id('AtomicServiceMinusId')
            .type(ButtonType.Normal)
            .backgroundColor(Color.Transparent)
            .width(BUTTON_WIDTH)
            .height(VIEW_HEIGHT)
            .gesture(TapGesture().onAction(() => {
              this.onMinimizeButtonClick();
            }))

            this.dividerLine()

            Button() {
              Image(this.closeResource)
                .width(IMAGE_SIZE)
                .height(IMAGE_SIZE)
                .fillColor(this.menuFillColor)
                .margin({ end: LengthMetrics.vp(MENU_BUTTON_MARGIN) })
                .draggable(false)
                .interpolation(ImageInterpolation.High)
            }
            .id('AtomicServiceCloseId')
            .type(ButtonType.Normal)
            .backgroundColor(Color.Transparent)
            .borderRadius({ topRight: MENU_RADIUS, bottomRight: MENU_RADIUS })
            .width(BUTTON_WIDTH + MENU_BUTTON_MARGIN)
            .height(VIEW_HEIGHT)
            .gesture(TapGesture().onAction(() => {
              this.onCloseButtonClick();
            }))
          }
          .borderRadius(MENU_RADIUS)
          .borderColor(this.menubarBorderColor)
          .backgroundColor(this.menubarBackColor)
          .backdropBlur(MENU_BACK_BLUR)
          .borderWidth(MENU_BORDER_WIDTH)
          .borderColor($r('sys.color.icon_fourth'))
          .height(VIEW_HEIGHT)
          .align(Alignment.Top)
          .draggable(false)
          .id('AtomicServiceMenubarId')
        }
        .id('AtomicServiceMenubarRowId')
        .justifyContent(FlexAlign.End)
        .margin({ top: LengthMetrics.vp(VIEW_MARGIN_TOP), end: LengthMetrics.vp(VIEW_MARGIN_RIGHT) })
        .height(VIEW_HEIGHT)
        .hitTestBehavior(HitTestMode.Transparent)
      }
      .id('AtomicServiceContainerId')
      .height('100%')
      .width('100%')
      .backgroundColor(Color.Transparent)
      .hitTestBehavior(HitTestMode.Transparent)
    }
    .height('100%')
    .width('100%')
    .justifyContent(FlexAlign.End)
    .backgroundColor(this.contentBgColor)
    .hitTestBehavior(HitTestMode.Transparent)
  }

  private onColorConfigurationUpdate(isDark: boolean) {
    this.isDark = isDark;
    this.menuFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
    this.menubarBorderColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
    this.dividerBackgroundColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
    this.menubarBackColor = this.getResourceColor(MENU_BACK_COLOR);
  }

  private getIconResource(resourceId: number): Resource {
    return {
      bundleName: '',
      moduleName: '',
      params: [],
      id: resourceId,
      type: 20000
    };
  }
}
