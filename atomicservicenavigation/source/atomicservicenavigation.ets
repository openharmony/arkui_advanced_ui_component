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
const RATIO_THREE_TENTHS: number = 0.3;
const OFFSET_ONE = 1;
const HALF_RATIO = 0.5;
const SEVENTY_PERCENT_RATIO = 0.7;
const FOURTY_PERCENT_RATIO = 0.4;
const SIXTY_PERCENT_RATIO = 0.6;
const TWENTY_PERCENT_RATIO = 0.2;
const ONE_POINT_FIVE_RATIO = 1.5;
const NEGATIVE_ONE = -1;
let width = 0;
let height = 0;

export enum GradientAlpha {
  LEVEL1 = 1,
  LEVEL2 = 2,
  LEVEL3 = 3,
  LEVEL4 = 4
}

export enum MixMode {
  AVERAGE = 1,
  BIAS_STYLE_ONE = 2,
  BIAS_STYLE_TWO = 3,
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
        width = px2vp(displayClass.width);
        height = px2vp(displayClass.height);
        if (primaryColor !== undefined && secondColor === undefined) {
          //单色渐变
          this.drawSingleGradient(this.context, primaryColor);
        } else if (primaryColor !== undefined && secondColor !== undefined) {
          if (mixMode === MixMode.AVERAGE) {
            //双色渐变五五分
            this.drawGradientCanvasHalf(this.context, primaryColor, secondColor);
          } else if (mixMode === MixMode.BIAS_STYLE_ONE) {
            //第一种双色渐变三七分
            this.drawGradientCanvasPrefer(this.context, primaryColor, secondColor);
          } else if (mixMode === MixMode.BIAS_STYLE_TWO) {
            //第二种双色渐变三七分
            this.drawGradientCanvasPrefer1(this.context, primaryColor, secondColor);
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
   * @param context
   * @param primaryColor
   * @param secondColor
   */
  drawGradientCanvasHalf(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String,
    secondColor: ResourceColor | String) {
    height = height * RATIO_THREE_TENTHS;
    let grad1 = context.createLinearGradient(NEGATIVE_ONE * width * HALF_RATIO, height,
      width * HALF_RATIO, 0);
    let grad2 = context.createLinearGradient(width * ONE_POINT_FIVE_RATIO, height,
      width * HALF_RATIO, 0);
    grad1.addColorStop(0, primaryColor.toString());
    grad1.addColorStop(0, primaryColor.toString());
    grad1.addColorStop(1, secondColor.toString());
    grad2.addColorStop(0, primaryColor.toString());
    grad2.addColorStop(TWENTY_PERCENT_RATIO, primaryColor.toString());
    grad2.addColorStop(1, secondColor.toString());
    context.fillStyle = grad1;
    context.fillRect(0, 0, width * HALF_RATIO, height);
    context.fillStyle = grad2;
    context.fillRect(width * HALF_RATIO, 0, width, height);
  }

  /**
   * 双色渐变下颜色分别占70%和30%的实现，实现逻辑为把画布先分为两个大矩形，再把其中一个矩形分为两个小矩形
   * @param context
   * @param primaryColor
   * @param secondColor
   */
  drawGradientCanvasPrefer(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String,
    secondColor: ResourceColor | String) {
    height = height * RATIO_THREE_TENTHS;
    let grad1 = context.createLinearGradient(0, 0, SEVENTY_PERCENT_RATIO * width, 0);
    grad1.addColorStop(0, primaryColor.toString());
    grad1.addColorStop(HALF_RATIO, primaryColor.toString());
    grad1.addColorStop(1, secondColor.toString());
    context.fillStyle = grad1;
    context.fillRect(0, 0, SEVENTY_PERCENT_RATIO * width, height);
    let y1 =
      (HALF_RATIO * height - RATIO_THREE_TENTHS * width) > 0 ? HALF_RATIO * height - RATIO_THREE_TENTHS * width : 0;
    let grad2 = context.createLinearGradient(SEVENTY_PERCENT_RATIO * width, y1, width,
      height * HALF_RATIO);
    grad2.addColorStop(0, secondColor.toString());
    grad2.addColorStop(FOURTY_PERCENT_RATIO, secondColor.toString());
    grad2.addColorStop(1, primaryColor.toString());
    context.fillStyle = grad2;
    context.strokeStyle = primaryColor.toString();
    context.strokeRect(SEVENTY_PERCENT_RATIO * width, 0, width * RATIO_THREE_TENTHS,
      height * HALF_RATIO);
    context.fillRect(SEVENTY_PERCENT_RATIO * width - OFFSET_ONE, 0,
      width * RATIO_THREE_TENTHS + OFFSET_ONE, height * HALF_RATIO + OFFSET_ONE);
    let y2 =
      (HALF_RATIO * height - RATIO_THREE_TENTHS * width) > 0 ? HALF_RATIO * height + RATIO_THREE_TENTHS * width :
        height;
    let grad3 = context.createLinearGradient(SEVENTY_PERCENT_RATIO * width, y2,
      width, height * HALF_RATIO);
    grad3.addColorStop(0, secondColor.toString());
    grad3.addColorStop(FOURTY_PERCENT_RATIO, secondColor.toString());
    grad3.addColorStop(OFFSET_ONE, primaryColor.toString());
    context.fillStyle = grad3;
    context.fillRect(SEVENTY_PERCENT_RATIO * width - OFFSET_ONE, height * HALF_RATIO,
      RATIO_THREE_TENTHS * width + OFFSET_ONE, height * HALF_RATIO);
  }

  /**
   * 双色渐变的一种实现，从矩形左上角颜色渐变到右下角
   * @param context
   * @param primaryColor
   * @param secondColor
   */
  drawGradientCanvasPrefer1(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String,
    secondColor: ResourceColor | String) {
    height = height * RATIO_THREE_TENTHS;
    let grad = context.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, primaryColor.toString());
    grad.addColorStop(FOURTY_PERCENT_RATIO, primaryColor.toString());
    grad.addColorStop(1, secondColor.toString());
    context.fillStyle = grad;
    context.fillRect(0, 0, width, height);

  }

  /**
   * 双色渐变下透明效果的实现
   * @param context
   */
  drawTransparentGradient(context: CanvasRenderingContext2D) {
    let grad = context.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(241,242, 243, 0)');
    grad.addColorStop(1, 'rgba(241,242, 243, 1)');
    context.fillStyle = grad;
    context.fillRect(0, 0, width + OFFSET_ONE, height + OFFSET_ONE);
  }

  /**
   * 单色渐变：
   * @param createLinearGradient初始颜色为primaryColor，结束颜色为底色
   * @param primaryColor
   */
  drawSingleGradient(context: CanvasRenderingContext2D, primaryColor: ResourceColor | String) {
    height = height * SIXTY_PERCENT_RATIO;
    let grad1 = context.createLinearGradient(0, 0, 0, height);
    grad1.addColorStop(0, primaryColor.toString());
    grad1.addColorStop(1, DEAULT_COLOR);
    context.fillStyle = grad1;
    context.fillRect(0, 0, width, height);
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
