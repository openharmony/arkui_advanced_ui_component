/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to  in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
const display = requireNapi('display');
const DEAULT_COLOR = '#F1F3F5';
const transparencyMapArray = [0.15, 0.15, 0.4, 0.6, 0.8];
const RATIO_THREE_TENTHS = 0.3;
const OFFSET_ONE = 1;
const HALF_RATIO = 0.5;
const SEVENTY_PERCENT_RATIO = 0.7;
const FOURTY_PERCENT_RATIO = 0.4;
const SIXTY_PERCENT_RATIO = 0.6;
const ONE_POINT_FIVE_RATIO = 1.5;
const NEGATIVE_ONE = -1;
export let GradientAlpha;
(function (GradientAlpha) {
    GradientAlpha.LEVEL1 = 1;
    GradientAlpha.LEVEL2 = 2;
    GradientAlpha.LEVEL3 = 3;
    GradientAlpha.LEVEL4 = 4;
})(GradientAlpha || (GradientAlpha = {}));
export let MixMode;
(function (MixMode) {
    MixMode.AVERAGE = 1;
    MixMode.CROSS = 2;
    MixMode.TOWARDS = 3;
})(MixMode || (MixMode = {}));
export class AtomicServiceNavigation extends ViewPU {
    constructor(w, x, y, z = -1, a1 = undefined, b1) {
        super(w, y, z, b1);
        if (typeof a1 === 'function') {
            this.paramsGenerator_ = a1;
        }
        this.__navPathStack = new ObservedPropertyObjectPU(new NavPathStack(), this, 'navPathStack');
        this.navigationContent = undefined;
        this.__title = new SynchedPropertyObjectOneWayPU(x.title, this, 'title');
        this.__titleOptions = new SynchedPropertyObjectOneWayPU(x.titleOptions, this, 'titleOptions');
        this.__gradientBackground = new SynchedPropertyObjectOneWayPU(x.gradientBackground, this, 'gradientBackground');
        this.__hideTitleBar = new SynchedPropertySimpleOneWayPU(x.hideTitleBar, this, 'hideTitleBar');
        this.__navBarWidth = new SynchedPropertyObjectOneWayPU(x.navBarWidth, this, 'navBarWidth');
        this.__mode = new SynchedPropertySimpleOneWayPU(x.mode, this, 'mode');
        this.navDestinationBuilder = this.defaultNavDestinationBuilder;
        this.__navBarWidthRange = new SynchedPropertyObjectOneWayPU(x.navBarWidthRange, this, 'navBarWidthRange');
        this.__minContentWidth = new SynchedPropertyObjectOneWayPU(x.minContentWidth, this, 'minContentWidth');
        this.stateChangeCallback = undefined;
        this.modeChangeCallback = undefined;
        this.settings = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.settings);
        this.screenWidth = 0;
        this.screenHeight = 0;
        this.setInitiallyProvidedValue(x);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(v) {
        if (v.navPathStack !== undefined) {
            this.navPathStack = v.navPathStack;
        }
        if (v.navigationContent !== undefined) {
            this.navigationContent = v.navigationContent;
        }
        if (v.titleOptions === undefined) {
            this.__titleOptions.set({ isBlurEnabled: true });
        }
        if (v.gradientBackground === undefined) {
            this.__gradientBackground.set({
                primaryColor: DEAULT_COLOR,
                secondColor: DEAULT_COLOR,
                mixMode: MixMode.AVERAGE,
                alpha: GradientAlpha.LEVEL4
            });
        }
        if (v.navDestinationBuilder !== undefined) {
            this.navDestinationBuilder = v.navDestinationBuilder;
        }
        if (v.stateChangeCallback !== undefined) {
            this.stateChangeCallback = v.stateChangeCallback;
        }
        if (v.modeChangeCallback !== undefined) {
            this.modeChangeCallback = v.modeChangeCallback;
        }
        if (v.settings !== undefined) {
            this.settings = v.settings;
        }
        if (v.context !== undefined) {
            this.context = v.context;
        }
        if (v.screenWidth !== undefined) {
            this.screenWidth = params.screenWidth;
        }
        if (v.screenHeight !== undefined) {
            this.screenHeight = params.screenHeight;
        }
    }
    updateStateVars(u) {
        this.__title.reset(u.title);
        this.__titleOptions.reset(u.titleOptions);
        this.__gradientBackground.reset(u.gradientBackground);
        this.__hideTitleBar.reset(u.hideTitleBar);
        this.__navBarWidth.reset(u.navBarWidth);
        this.__mode.reset(u.mode);
        this.__navBarWidthRange.reset(u.navBarWidthRange);
        this.__minContentWidth.reset(u.minContentWidth);
    }
    purgeVariableDependenciesOnElmtId(t) {
        this.__navPathStack.purgeDependencyOnElmtId(t);
        this.__title.purgeDependencyOnElmtId(t);
        this.__titleOptions.purgeDependencyOnElmtId(t);
        this.__gradientBackground.purgeDependencyOnElmtId(t);
        this.__hideTitleBar.purgeDependencyOnElmtId(t);
        this.__navBarWidth.purgeDependencyOnElmtId(t);
        this.__mode.purgeDependencyOnElmtId(t);
        this.__navBarWidthRange.purgeDependencyOnElmtId(t);
        this.__minContentWidth.purgeDependencyOnElmtId(t);
    }
    aboutToBeDeleted() {
        this.__navPathStack.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__titleOptions.aboutToBeDeleted();
        this.__gradientBackground.aboutToBeDeleted();
        this.__hideTitleBar.aboutToBeDeleted();
        this.__navBarWidth.aboutToBeDeleted();
        this.__mode.aboutToBeDeleted();
        this.__navBarWidthRange.aboutToBeDeleted();
        this.__minContentWidth.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get navPathStack() {
        return this.__navPathStack.get();
    }
    set navPathStack(s) {
        this.__navPathStack.set(s);
    }
    get title() {
        return this.__title.get();
    }
    set title(r) {
        this.__title.set(r);
    }
    get titleOptions() {
        return this.__titleOptions.get();
    }
    set titleOptions(q) {
        this.__titleOptions.set(q);
    }
    get gradientBackground() {
        return this.__gradientBackground.get();
    }
    set gradientBackground(newValue) {
        this.__gradientBackground.set(newValue);
    }
    get hideTitleBar() {
        return this.__hideTitleBar.get();
    }
    set hideTitleBar(p) {
        this.__hideTitleBar.set(p);
    }
    get navBarWidth() {
        return this.__navBarWidth.get();
    }
    set navBarWidth(o) {
        this.__navBarWidth.set(o);
    }
    get mode() {
        return this.__mode.get();
    }
    set mode(n) {
        this.__mode.set(n);
    }
    get navBarWidthRange() {
        return this.__navBarWidthRange.get();
    }
    set navBarWidthRange(m) {
        this.__navBarWidthRange.set(m);
    }
    get minContentWidth() {
        return this.__minContentWidth.get();
    }
    set minContentWidth(l) {
        this.__minContentWidth.set(l);
    }
    defaultNavDestinationBuilder(i, j, k = null) {
    }
    BackgroundBuilder(primaryColor, secondColor, mixMode, alpha, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.opacity(transparencyMapArray[(alpha === undefined) ? GradientAlpha.LEVEL4 : alpha]);
            Canvas.blur(500);
            Canvas.onReady(() => {
                let displayClass = null;
                displayClass = display.getDefaultDisplaySync();
                this.screenWidth = px2vp(displayClass.width);
                this.screenHeight = px2vp(displayClass.height);
                if (primaryColor !== undefined && secondColor === undefined) {
                    //单色渐变
                    this.drawSingleGradient(this.context, primaryColor);
                }
                else if (primaryColor !== undefined && secondColor !== undefined) {
                    if (mixMode === MixMode.AVERAGE) {
                        //双色渐变五五分
                        this.drawGradientCanvasHalf(this.context, primaryColor, secondColor);
                    }
                    else if (mixMode === MixMode.CROSS) {
                        //第一种双色渐变三七分
                        this.drawGradientCanvasPrefer(this.context, primaryColor, secondColor);
                    }
                    else if (mixMode === MixMode.TOWARDS) {
                        //第二种双色渐变三七分
                        this.drawGradientCanvasPrefer1(this.context, primaryColor, secondColor);
                    }
                    this.drawTransparentGradient(this.context);
                }
            });
        }, Canvas);
        Canvas.pop();
    }
    initialRender() {
        this.observeComponentCreation2((g, h) => {
            Navigation.create(this.navPathStack, { moduleName: 'library', pagePath: '', isUserCreateStack: true });
            Navigation.title(ObservedObject.GetRawObject(this.title), {
                backgroundColor: this.titleOptions?.backgroundColor,
                backgroundBlurStyle: this.titleOptions?.isBlurEnabled ? BlurStyle.COMPONENT_THICK : BlurStyle.NONE,
                barStyle: this.titleOptions?.barStyle
            });
            Navigation.titleMode(NavigationTitleMode.Mini);
            Navigation.hideBackButton(true);
            Navigation.hideTitleBar(this.hideTitleBar);
            Navigation.navBarWidth(ObservedObject.GetRawObject(this.navBarWidth));
            Navigation.navBarPosition(NavBarPosition.Start);
            Navigation.mode(this.mode);
            Navigation.navDestination({ builder: this.navDestinationBuilder.bind(this) });
            Navigation.navBarWidthRange(ObservedObject.GetRawObject(this.navBarWidthRange));
            Navigation.minContentWidth(ObservedObject.GetRawObject(this.minContentWidth));
            Navigation.onNavBarStateChange(this.stateChangeCallback);
            Navigation.onNavigationModeChange(this.modeChangeCallback);
            Navigation.backgroundColor(DEAULT_COLOR);
            Navigation.background({ builder: () => {
                    this.BackgroundBuilder.call(this, this.gradientBackground?.primaryColor,
                        this.gradientBackground?.secondColor, this.gradientBackground?.mixMode, this.gradientBackground?.alpha);
                } });
        }, Navigation);
        this.observeComponentCreation2((c, d) => {
            If.create();
            if (this.navigationContent) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.navigationContent.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Navigation.pop();
    }
    /**
     * 双色渐变下两种颜色各占50%的实现，把整个画布区域分为两个一样的矩形在绘制
     * @param context
     * @param primaryColor
     * @param secondColor
     */
    drawGradientCanvasHalf(context, primaryColor, secondColor) {
        this.screenHeight = this.screenHeight * RATIO_THREE_TENTHS;
        let grad1 = context.createLinearGradient(NEGATIVE_ONE * this.screenWidth * HALF_RATIO, this.screenHeight, this.screenWidth * HALF_RATIO, 0);
        let grad2 = context.createLinearGradient(this.screenWidth * ONE_POINT_FIVE_RATIO, this.screenHeight, this.screenWidth * HALF_RATIO, 0);
        grad1.addColorStop(0, primaryColor.toString());
        grad1.addColorStop(HALF_RATIO, primaryColor.toString());
        grad1.addColorStop(1, secondColor.toString());
        grad2.addColorStop(0, primaryColor.toString());
        grad2.addColorStop(HALF_RATIO, primaryColor.toString());
        grad2.addColorStop(1, secondColor.toString());
        context.fillStyle = grad1;
        context.fillRect(0, 0, this.screenWidth * HALF_RATIO, this.screenHeight);
        context.fillStyle = grad2;
        context.fillRect(this.screenWidth * HALF_RATIO, 0, this.screenWidth, this.screenHeight);
    }
    /**
     * 双色渐变下颜色分别占70%和30%的实现，实现逻辑为把画布先分为两个大矩形，再把其中一个矩形分为两个小矩形
     * @param context
     * @param primaryColor
     * @param secondColor
     */
    drawGradientCanvasPrefer(context, primaryColor, secondColor) {
        this.screenHeight = this.screenHeight * RATIO_THREE_TENTHS;
        let grad1 = context.createLinearGradient(0, 0, SEVENTY_PERCENT_RATIO * this.screenWidth, 0);
        grad1.addColorStop(0, primaryColor.toString());
        grad1.addColorStop(HALF_RATIO, primaryColor.toString());
        grad1.addColorStop(1, secondColor.toString());
        context.fillStyle = grad1;
        context.fillRect(0, 0, SEVENTY_PERCENT_RATIO * this.screenWidth, this.screenHeight);
        let y1 = (HALF_RATIO * this.screenHeight - RATIO_THREE_TENTHS * this.screenWidth) > 0 ? HALF_RATIO * this.screenHeight - RATIO_THREE_TENTHS * this.screenWidth : 0;
        let grad2 = context.createLinearGradient(SEVENTY_PERCENT_RATIO * this.screenWidth, y1, this.screenWidth, this.screenHeight * HALF_RATIO);
        grad2.addColorStop(0, secondColor.toString());
        grad2.addColorStop(FOURTY_PERCENT_RATIO, secondColor.toString());
        grad2.addColorStop(1, primaryColor.toString());
        context.fillStyle = grad2;
        context.strokeStyle = primaryColor.toString();
        context.strokeRect(SEVENTY_PERCENT_RATIO * this.screenWidth, 0, this.screenWidth * RATIO_THREE_TENTHS, this.screenHeight * HALF_RATIO);
        context.fillRect(SEVENTY_PERCENT_RATIO * this.screenWidth - OFFSET_ONE, 0, this.screenWidth * RATIO_THREE_TENTHS + OFFSET_ONE, this.screenHeight * HALF_RATIO + OFFSET_ONE);
        let y2 = (HALF_RATIO * this.screenHeight - RATIO_THREE_TENTHS * this.screenWidth) > 0 ? HALF_RATIO * this.screenHeight + RATIO_THREE_TENTHS * this.screenWidth :
            this.screenHeight;
        let grad3 = context.createLinearGradient(SEVENTY_PERCENT_RATIO * this.screenWidth, y2, this.screenWidth, this.screenHeight * HALF_RATIO);
        grad3.addColorStop(0, secondColor.toString());
        grad3.addColorStop(FOURTY_PERCENT_RATIO, secondColor.toString());
        grad3.addColorStop(OFFSET_ONE, primaryColor.toString());
        context.fillStyle = grad3;
        context.fillRect(SEVENTY_PERCENT_RATIO * this.screenWidth - OFFSET_ONE, this.screenHeight * HALF_RATIO, RATIO_THREE_TENTHS * this.screenWidth + OFFSET_ONE, this.screenHeight * HALF_RATIO);
    }
    /**
     * 双色渐变的一种实现，从矩形左上角颜色渐变到右下角
     * @param context
     * @param primaryColor
     * @param secondColor
     */
    drawGradientCanvasPrefer1(context, primaryColor, secondColor) {
        this.screenHeight = this.screenHeight * RATIO_THREE_TENTHS;
        let grad = context.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
        grad.addColorStop(0, primaryColor.toString());
        grad.addColorStop(FOURTY_PERCENT_RATIO, primaryColor.toString());
        grad.addColorStop(1, secondColor.toString());
        context.fillStyle = grad;
        context.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }
    /**
     * 双色渐变下透明效果的实现
     * @param context
     */
    drawTransparentGradient(context) {
        let grad = context.createLinearGradient(0, 0, 0, this.screenHeight);
        grad.addColorStop(0, 'rgba(241,242, 243, 0)');
        grad.addColorStop(1, 'rgba(241,242, 243, 1)');
        context.fillStyle = grad;
        context.fillRect(0, 0, this.screenWidth + OFFSET_ONE, this.screenHeight + OFFSET_ONE);
    }
    /**
     * 单色渐变：
     * @param createLinearGradient初始颜色为primaryColor，结束颜色为底色
     * @param primaryColor
     */
    drawSingleGradient(context, primaryColor) {
        this.screenHeight = this.screenHeight * SIXTY_PERCENT_RATIO;
        let grad1 = context.createLinearGradient(0, 0, 0, this.screenHeight);
        grad1.addColorStop(0, primaryColor.toString());
        grad1.addColorStop(1, DEAULT_COLOR);
        context.fillStyle = grad1;
        context.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }
    rerender() {
        this.updateDirtyElements();
    }
}

export default { AtomicServiceNavigation, MixMode, GradientAlpha};