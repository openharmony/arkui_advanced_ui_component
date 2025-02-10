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
const hilog = requireNapi('hilog');
const backGroundColor = ['rgb(0,0,0)', 'rgb(255,255,255)', 'rgb(241,243,245)'];
const backGroundTransparentGradientColor = [['rgba(0,0,0,0)', 'rgba(0,0,0,1)'],
    ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'], ['rgba(241,243,245,0)', 'rgba(241,243,245,1)']];
const transparencyMapArray = [0.15, 0.15, 0.4, 0.6, 0.8];
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
export let GradientAlpha;
(function (GradientAlpha) {
    /**
     * 不透明度为0.2
     *
     */
    GradientAlpha.OPACITY_20 = 1;
    /**
     * 不透明度为0.6
     *
     */
    GradientAlpha.OPACITY_60 = 2;
    /**
     * 不透明度为0.8
     */
    GradientAlpha.OPACITY_80 = 3;
    /**
     * 不透明度为1.0
     */
    GradientAlpha.OPACITY_100 = 4;
})(GradientAlpha || (GradientAlpha = {}));
/**
 * 背景颜色融合方式
 *
 * @enum { number }.
 */
export let MixMode;
(function (MixMode) {
    /**
     * 两种颜色所占比例相同
     */
    MixMode.AVERAGE = 1;
    /**
     * 一种颜色穿过另一种颜色
     */
    MixMode.CROSS = 2;
    /**
     * 一种颜色渐渐转变为另一种颜色
     */
    MixMode.TOWARDS = 3;
})(MixMode || (MixMode = {}));
/**
 * 背景底色
 *
 * @enum { number }.
 */
export let BackgroundTheme;
(function (BackgroundTheme) {
    /**
     * 黑色
     */
    BackgroundTheme.DARK = 1;
    /**
     * 白色
     */
    BackgroundTheme.LIGHT = 2;
    /**
     * 颜色值 #F1F3F5
     */
    BackgroundTheme.DEFAULT = 3;
})(BackgroundTheme || (BackgroundTheme = {}));
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
        this.navigationWidth = 0;
        this.navigationHeight = 0;
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
        if (v.navigationWidth !== undefined) {
            this.navigationWidth = v.navigationWidth;
        }
        if (v.navigationHeight !== undefined) {
            this.navigationHeight = v.navigationHeight;
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
    BackgroundBuilder(gradientBackground, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.opacity(transparencyMapArray[(gradientBackground.alpha === undefined) ? GradientAlpha.OPACITY_20 :
            gradientBackground.alpha]);
            Canvas.blur(BLUR_CONSTANT);
            Canvas.backgroundColor(gradientBackground.backgroundTheme === undefined ? backGroundColor[2] :
            backGroundColor[gradientBackground.backgroundTheme - 1]);
            Canvas.onReady(() => {
                if (gradientBackground.secondaryColor === undefined) {
                    //单色渐变
                    this.drawSingleGradient(this.context, gradientBackground.primaryColor,
                        gradientBackground.backgroundTheme === undefined ? backGroundColor[2] :
                        backGroundColor[gradientBackground.backgroundTheme - 1]);
                }
                else {
                    if (gradientBackground.mixMode === MixMode.AVERAGE) {
                        //双色渐变五五分
                        this.drawGradientCanvasHalf(this.context, gradientBackground.primaryColor, gradientBackground.secondaryColor);
                    }
                    else if (gradientBackground.mixMode === MixMode.CROSS) {
                        //第一种双色渐变三七分
                        this.drawGradientCanvasCross(this.context, gradientBackground.primaryColor, gradientBackground.secondaryColor);
                    }
                    else {
                        //第二种双色渐变三七分
                        this.drawGradientCanvasTowards(this.context, gradientBackground.primaryColor, gradientBackground.secondaryColor);
                    }
                    this.drawTransparentGradient(this.context, gradientBackground.backgroundTheme === undefined ? BackgroundTheme.DEFAULT :
                    gradientBackground.backgroundTheme);
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
            Navigation.background(this.gradientBackground === undefined ? undefined : { builder: () => {
                this.BackgroundBuilder.call(this, makeBuilderParameterProxy('BackgroundBuilder',
                    { primaryColor: () => this.gradientBackground.primaryColor,
                        secondaryColor: () => this.gradientBackground.secondaryColor,
                        backgroundTheme: () => this.gradientBackground.backgroundTheme,
                        mixMode: () => this.gradientBackground.mixMode,
                        alpha: () => this.gradientBackground.alpha }));
            } });
            Navigation.onSizeChange((oldValue, newValue) => {
                this.navigationWidth = newValue.width;
                this.navigationHeight = newValue.height;
            });
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
     * @param context 画布上下文
     * @param primaryColor 第一种颜色
     * @param secondaryColor 第二种颜色
     */
    drawGradientCanvasHalf(context, primaryColor, secondaryColor) {
        let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
        let grad1 = context.createLinearGradient(COORDINATE_NEGATIVE_ONE * this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT,
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
    drawGradientCanvasCross(context, primaryColor, secondaryColor) {
        let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
        let grad1 = context.createLinearGradient(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, 0);
        grad1.addColorStop(0, this.resourceColorToString(primaryColor));
        grad1.addColorStop(COLOR_RATIO_FIFTY_PERCENT, this.resourceColorToString(primaryColor));
        grad1.addColorStop(1, this.resourceColorToString(secondaryColor));
        context.fillStyle = grad1;
        context.fillRect(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, height);
        let y1 = (COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth) > 0 ?
            COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth : 0;
        let grad2 = context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, y1, this.navigationWidth,
            height * COLOR_RATIO_FIFTY_PERCENT);
        grad2.addColorStop(0, this.resourceColorToString(secondaryColor));
        grad2.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(secondaryColor));
        grad2.addColorStop(1, this.resourceColorToString(primaryColor));
        context.fillStyle = grad2;
        context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth - RECTANGLE_OUTSIDE_OFFSET_ONE, 0,
            this.navigationWidth * COLOR_RATIO_THIRTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE,
            height * COLOR_RATIO_FIFTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE);
        let y2 = (COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth) > 0 ?
            COLOR_RATIO_FIFTY_PERCENT * height + COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth :
            height;
        let grad3 = context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, y2,
            this.navigationWidth, height * COLOR_RATIO_FIFTY_PERCENT);
        grad3.addColorStop(0, this.resourceColorToString(secondaryColor));
        grad3.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(secondaryColor));
        grad3.addColorStop(1, this.resourceColorToString(primaryColor));
        context.fillStyle = grad3;
        context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth - RECTANGLE_OUTSIDE_OFFSET_ONE,
            height * COLOR_RATIO_FIFTY_PERCENT, COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth + RECTANGLE_OUTSIDE_OFFSET_ONE,
            height * COLOR_RATIO_FIFTY_PERCENT);
    }
    /**
     * 双色渐变的一种实现，从矩形左上角颜色渐变到右下角
     * @param context 画布上下文
     * @param primaryColor 第一种颜色
     * @param secondaryColor 第二种颜色
     */
    drawGradientCanvasTowards(context, primaryColor, secondaryColor) {
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
    drawTransparentGradient(context, backgroundTheme) {
        let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
        let grad = context.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, backGroundTransparentGradientColor[backgroundTheme - 1][0]);
        grad.addColorStop(1, backGroundTransparentGradientColor[backgroundTheme - 1][1]);
        context.fillStyle = grad;
        context.fillRect(0, 0, this.navigationWidth + RECTANGLE_OUTSIDE_OFFSET_ONE, height + RECTANGLE_OUTSIDE_OFFSET_ONE);
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
    drawSingleGradient(context, primaryColor, backgroundColor) {
        let height = this.navigationHeight * COLOR_RATIO_SIXTY_PERCENT;
        let grad1 = context.createLinearGradient(0, 0, 0, height);
        grad1.addColorStop(0, this.resourceColorToString(primaryColor));
        grad1.addColorStop(1, backgroundColor);
        context.fillStyle = grad1;
        context.fillRect(0, 0, this.navigationWidth, height);
        //当背景为黑色的时候需要特殊处理下
        if (backgroundColor === backGroundColor[0]) {
            context.fillStyle = Color.Black;
            context.fillRect(0, height, this.navigationWidth, this.navigationHeight * (1 - COLOR_RATIO_SIXTY_PERCENT));
        }
    }
    /**
     * ResourceColor转化为能作为addColorStop使用的字符串
     * @param resource ResourceColor = Color | number | string | Resource,对于Resource转化为直接使用的字符串需要特殊处理
     * @returns
     */
    resourceColorToString(resource) {
        if (typeof resource === 'object') {
            try {
                return getContext(this).resourceManager.getStringSync(resource);
            }
            catch (error) {
                let code = error.code;
                let message = error.message;
                hilog.error(0x0000, 'AtomicServiceNavigation', `resourceColorToString - systemResourceManager getStringValue failed, error code: ${code}, message: ${message}.`);
            }
            return '';
        }
        else {
            return resource.toString();
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}


export default { AtomicServiceNavigation, MixMode, GradientAlpha, BackgroundTheme};