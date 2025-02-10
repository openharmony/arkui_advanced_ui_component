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

import { Callback } from '@ohos.base';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';

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
  stateChangeCallback?: Callback<boolean>;
  modeChangeCallback?: Callback<NavigationMode>;
  private settings: RenderingContextSettings = new RenderingContextSettings(true);
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);
  private navigationWidth: number = 0;
  private navigationHeight: number = 0;

  @Builder
  defaultNavDestinationBuilder(name: string, param?: Object) {
  }

  @Builder
  BackgroundBuilder(gradientBackground: GradientBackground) {
    Canvas(this.context)
      .opacity(transparencyMapArray[(gradientBackground.alpha === undefined) ? GradientAlpha.OPACITY_20 :
      gradientBackground.alpha])
      .blur(BLUR_CONSTANT)
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
      })
  }

  build() {
    Navigation(this.navPathStack) {
      if (this.navigationContent) {
        this.navigationContent()
      }
    }
    .title(this.title, {
      backgroundColor: this.titleOptions?.backgroundColor,
      backgroundBlurStyle: this.titleOptions?.isBlurEnabled ? BlurStyle.COMPONENT_THICK : BlurStyle.NONE,
      barStyle: this.titleOptions?.barStyle
    })
    .titleMode(NavigationTitleMode.Mini)
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
    .background(this.gradientBackground === undefined ? undefined : this.BackgroundBuilder({
      primaryColor: this.gradientBackground.primaryColor,
      secondaryColor: this.gradientBackground.secondaryColor,
      backgroundTheme: this.gradientBackground.backgroundTheme,
      mixMode: this.gradientBackground.mixMode,
      alpha: this.gradientBackground.alpha
    }))
    .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
      this.navigationWidth = newValue.width as number;
      this.navigationHeight = newValue.height as number;
    })
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
}

export interface TitleOptions {
  backgroundColor?: ResourceColor,
  isBlurEnabled?: boolean,
  barStyle?: BarStyle
}

export interface GradientBackground {
  primaryColor: ResourceColor,
  secondaryColor?: ResourceColor,
  backgroundTheme?: BackgroundTheme,
  mixMode?: MixMode,
  alpha?: GradientAlpha
}

export type NavDestinationBuilder = (name: string, param?: Object) => void;