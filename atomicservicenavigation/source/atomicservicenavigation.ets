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

import { display } from '@kit.ArkUI';
import { Callback } from '@ohos.base';

const DEAULT_COLOR = '#F1F3F5';
const transparencyMapArray: number[] = [0.15, 0.15, 0.4, 0.6, 0.8];
const RECTANGLE_OUTSIDE_OFFSET_ONE = 1;
const COLOR_RATIO_THIRTY_PERCENT = 0.3;
const COLOR_RATIO_FIFTY_PERCENT = 0.5;
const COLOR_RATIO_SEVENTY_PERCENT = 0.7;
const COLOR_RATIO_FORTY_PERCENT = 0.4;
const COLOR_RATIO_SIXTY_PERCENT = 0.6;
const COLOR_RATIO_ONE_FIFTY_PERCENT = 1.5;
const COORDINATE_NEGATIVE_ONE = -1;

export enum GradientAlpha {
  LEVEL1 = 1,
  LEVEL2 = 2,
  LEVEL3 = 3,
  LEVEL4 = 4
}

export enum MixMode {
  AVERAGE = 1,
  CROSS = 2,
  TOWARDS = 3,
}

@Component
export struct AtomicServiceNavigation {
  @State navPathStack?: NavPathStack = new NavPathStack();
  @BuilderParam navigationContent?: Callback<void>;
  @Prop title?: ResourceStr;
  @Prop titleOptions?: TitleOptions = { isBlurEnabled: true };
  @Prop gradientBackground?: GradientBackground = {
    primaryColor: DEAULT_COLOR,
    secondColor: DEAULT_COLOR,
    mixMode: MixMode.AVERAGE,
    alpha: GradientAlpha.LEVEL4
  };
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
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  @Builder
  defaultNavDestinationBuilder(name: string, param?: Object) {
  }

  @Builder
  BackgroundBuilder(primaryColor?: ResourceColor | String, secondColor?: ResourceColor | String,
    mixMode?: MixMode, alpha?: GradientAlpha) {

    Canvas(this.context)
      .opacity(transparencyMapArray[(alpha === undefined) ? GradientAlpha.LEVEL4 : alpha])
      .blur(500)
      .onReady(() => {
        let displayClass: display.Display | null = null;
        displayClass = display.getDefaultDisplaySync();
        this.screenWidth = px2vp(displayClass.width);
        this.screenHeight = px2vp(displayClass.height);
        if (primaryColor !== undefined && secondColor === undefined) {
          //单色渐变
          this.drawSingleGradient(this.context, primaryColor);
        } else if (primaryColor !== undefined && secondColor !== undefined) {
          if (mixMode === MixMode.AVERAGE) {
            //双色渐变五五分
            this.drawGradientCanvasHalf(this.context, primaryColor, secondColor);
          } else if (mixMode === MixMode.CROSS) {
            //第一种双色渐变三七分
            this.drawGradientCanvasCross(this.context, primaryColor, secondColor);
          } else if (mixMode === MixMode.TOWARDS) {
            //第二种双色渐变三七分
            this.drawGradientCanvasTowards(this.context, primaryColor, secondColor);
          }
          this.drawTransparentGradient(this.context)
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
    .backgroundColor(DEAULT_COLOR)
    .background(this.BackgroundBuilder(this.gradientBackground?.primaryColor, this.gradientBackground?.secondColor,
      this.gradientBackground?.mixMode, this.gradientBackground?.alpha))
  }

  /**
   * 双色渐变下两种颜色各占50%的实现，把整个画布区域分为两个一样的矩形在绘制
   * @param context 画布上下文
   * @param primaryColor 第一种颜色
   * @param secondColor 第二种颜色
   */
  drawGradientCanvasHalf(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String,
    secondColor: ResourceColor | String) {
    this.screenHeight = this.screenHeight * COLOR_RATIO_THIRTY_PERCENT;
    let grad1 = context.createLinearGradient(COORDINATE_NEGATIVE_ONE * this.screenWidth * COLOR_RATIO_FIFTY_PERCENT, this.screenHeight,
      this.screenWidth * COLOR_RATIO_FIFTY_PERCENT, 0);
    let grad2 = context.createLinearGradient(this.screenWidth * COLOR_RATIO_ONE_FIFTY_PERCENT, this.screenHeight,
      this.screenWidth * COLOR_RATIO_FIFTY_PERCENT, 0);
    grad1.addColorStop(0, primaryColor.toString());
    grad1.addColorStop(COLOR_RATIO_FIFTY_PERCENT, primaryColor.toString());
    grad1.addColorStop(1, secondColor.toString());
    grad2.addColorStop(0, primaryColor.toString());
    grad2.addColorStop(COLOR_RATIO_FIFTY_PERCENT, primaryColor.toString());
    grad2.addColorStop(1, secondColor.toString());
    context.fillStyle = grad1;
    context.fillRect(0, 0, this.screenWidth * COLOR_RATIO_FIFTY_PERCENT, this.screenHeight);
    context.fillStyle = grad2;
    context.fillRect(this.screenWidth * COLOR_RATIO_FIFTY_PERCENT, 0, this.screenWidth, this.screenHeight);
  }

  /**
   * 双色渐变的一种实现，把画布先分为两个大矩形，再把其中一个矩形分为两个小矩形
   * @param context 画布上下文
   * @param primaryColor 第一种颜色
   * @param secondColor 第二种颜色
   */
  drawGradientCanvasCross(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String,
    secondColor: ResourceColor | String) {
    this.screenHeight = this.screenHeight * COLOR_RATIO_THIRTY_PERCENT;
    let grad1 = context.createLinearGradient(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.screenWidth, 0);
    grad1.addColorStop(0, primaryColor.toString());
    grad1.addColorStop(COLOR_RATIO_FIFTY_PERCENT, primaryColor.toString());
    grad1.addColorStop(1, secondColor.toString());
    context.fillStyle = grad1;
    context.fillRect(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.screenWidth, this.screenHeight);
    let y1 =
      (COLOR_RATIO_FIFTY_PERCENT * this.screenHeight - COLOR_RATIO_THIRTY_PERCENT * this.screenWidth) > 0 ? COLOR_RATIO_FIFTY_PERCENT * this.screenHeight - COLOR_RATIO_THIRTY_PERCENT * this.screenWidth : 0;
    let grad2 = context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.screenWidth, y1, this.screenWidth,
      this.screenHeight * COLOR_RATIO_FIFTY_PERCENT);
    grad2.addColorStop(0, secondColor.toString());
    grad2.addColorStop(COLOR_RATIO_FORTY_PERCENT, secondColor.toString());
    grad2.addColorStop(1, primaryColor.toString());
    context.fillStyle = grad2;
    context.strokeStyle = primaryColor.toString();
    context.strokeRect(COLOR_RATIO_SEVENTY_PERCENT * this.screenWidth, 0, this.screenWidth * COLOR_RATIO_THIRTY_PERCENT,
      this.screenHeight * COLOR_RATIO_FIFTY_PERCENT);
    context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.screenWidth - RECTANGLE_OUTSIDE_OFFSET_ONE, 0,
      this.screenWidth * COLOR_RATIO_THIRTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE, this.screenHeight * COLOR_RATIO_FIFTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE);
    let y2 =
      (COLOR_RATIO_FIFTY_PERCENT * this.screenHeight - COLOR_RATIO_THIRTY_PERCENT * this.screenWidth) > 0 ? COLOR_RATIO_FIFTY_PERCENT * this.screenHeight + COLOR_RATIO_THIRTY_PERCENT * this.screenWidth :
      this.screenHeight;
    let grad3 = context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.screenWidth, y2,
      this.screenWidth, this.screenHeight * COLOR_RATIO_FIFTY_PERCENT);
    grad3.addColorStop(0, secondColor.toString());
    grad3.addColorStop(COLOR_RATIO_FORTY_PERCENT, secondColor.toString());
    grad3.addColorStop(1, primaryColor.toString());
    context.fillStyle = grad3;
    context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.screenWidth - RECTANGLE_OUTSIDE_OFFSET_ONE, this.screenHeight * COLOR_RATIO_FIFTY_PERCENT,
      COLOR_RATIO_THIRTY_PERCENT * this.screenWidth + RECTANGLE_OUTSIDE_OFFSET_ONE, this.screenHeight * COLOR_RATIO_FIFTY_PERCENT);
  }

  /**
   * 双色渐变的一种实现，从矩形左上角颜色渐变到右下角
   * @param context 画布上下文
   * @param primaryColor 第一种颜色
   * @param secondColor 第二种颜色
   */
  drawGradientCanvasTowards(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String,
    secondColor: ResourceColor | String): void {
    this.screenHeight = this.screenHeight * COLOR_RATIO_THIRTY_PERCENT;
    let grad = context.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    grad.addColorStop(0, primaryColor.toString());
    grad.addColorStop(COLOR_RATIO_FORTY_PERCENT, primaryColor.toString());
    grad.addColorStop(1, secondColor.toString());
    context.fillStyle = grad;
    context.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  /**
   * 双色渐变下透明效果的实现
   * @param context 画布上下文
   */
  drawTransparentGradient(context: CanvasRenderingContext2D): void {
    let grad = context.createLinearGradient(0, 0, 0, this.screenHeight);
    grad.addColorStop(0, 'rgba(241,242, 243, 0)');
    grad.addColorStop(1, 'rgba(241,242, 243, 1)');
    context.fillStyle = grad;
    context.fillRect(0, 0, this.screenWidth + RECTANGLE_OUTSIDE_OFFSET_ONE, this.screenHeight + RECTANGLE_OUTSIDE_OFFSET_ONE);
  }

  /**
   * 单色渐变：
   * @param primaryColor createLinearGradient初始颜色为primaryColor，结束颜色为底色
   */
  drawSingleGradient(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String): void {
    this.screenHeight = this.screenHeight * COLOR_RATIO_SIXTY_PERCENT;
    let grad1 = context.createLinearGradient(0, 0, 0, this.screenHeight);
    grad1.addColorStop(0, primaryColor.toString());
    grad1.addColorStop(1, DEAULT_COLOR);
    context.fillStyle = grad1;
    context.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }
}

export interface TitleOptions {
  backgroundColor?: ResourceColor,
  isBlurEnabled?: boolean,
  barStyle?: BarStyle
}

export interface GradientBackground {
  primaryColor?: ResourceColor | String,
  secondColor?: ResourceColor | String,
  mixMode?: MixMode,
  alpha?: GradientAlpha
}

export type NavDestinationBuilder = (name: string, param?: Object) => void;