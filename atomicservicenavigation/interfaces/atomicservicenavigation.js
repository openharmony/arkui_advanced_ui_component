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
if (!('finalizeConstruction' in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, 'finalizeConstruction', () => {
    });
}
const curves = requireNativeModule('ohos.curves');
const LengthMetrics = requireNapi('arkui.node').LengthMetrics;
const SymbolGlyphModifier = requireNapi('arkui.modifier').SymbolGlyphModifier;
const bundleManager = requireNapi('bundle.bundleManager');
const hilog = requireNapi('hilog');
const i18n = requireNapi('i18n');
/**
 * 背景渐变色相关数据
 */
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
const MENUBAR_X_FIRST_THRESHOLD = 200;
const MENUBAR_X_SECOND_THRESHOLD = 40;
const MENUBAR_CORRECTION_OFFSET_VALUE = 92;
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
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === 'function') {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__navPathStack = new ObservedPropertyObjectPU(new NavPathStack(), this, 'navPathStack');
        this.navigationContent = undefined;
        this.__title = new SynchedPropertyObjectOneWayPU(params.title, this, 'title');
        this.__titleOptions = new SynchedPropertyObjectOneWayPU(params.titleOptions, this, 'titleOptions');
        this.__gradientBackground = new SynchedPropertyObjectOneWayPU(params.gradientBackground, this, 'gradientBackground');
        this.__hideTitleBar = new SynchedPropertySimpleOneWayPU(params.hideTitleBar, this, 'hideTitleBar');
        this.__navBarWidth = new SynchedPropertyObjectOneWayPU(params.navBarWidth, this, 'navBarWidth');
        this.__mode = new SynchedPropertySimpleOneWayPU(params.mode, this, 'mode');
        this.navDestinationBuilder = this.defaultNavDestinationBuilder;
        this.__navBarWidthRange = new SynchedPropertyObjectOneWayPU(params.navBarWidthRange, this, 'navBarWidthRange');
        this.__minContentWidth = new SynchedPropertyObjectOneWayPU(params.minContentWidth, this, 'minContentWidth');
        this.__sideBarOptions = new SynchedPropertyObjectOneWayPU(params.sideBarOptions, this, 'sideBarOptions');
        this.sideBarContent = undefined;
        this.__showMaskLayer = new ObservedPropertySimplePU(false, this, 'showMaskLayer');
        this.__marginWindowLeft = new ObservedPropertySimplePU(16, this, 'marginWindowLeft');
        this.__currentBreakPoint = new ObservedPropertySimplePU(BREAK_POINT_SM, this, 'currentBreakPoint');
        this.__sideBarAttribute = new ObservedPropertyObjectPU(new sideBarAttributeSet(), this, 'sideBarAttribute');
        this.__controlButtonVisible = new ObservedPropertySimplePU(true, this, 'controlButtonVisible');
        this.__titleBuilderPaddingEndWidth = new ObservedPropertySimplePU(0, this, 'titleBuilderPaddingEndWidth');
        this.menus = undefined;
        this.stateChangeCallback = undefined;
        this.modeChangeCallback = undefined;
        this.settings = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.settings);
        this.__navigationWidth = new ObservedPropertySimplePU(0, this, 'navigationWidth');
        this.__navigationHeight = new ObservedPropertySimplePU(0, this, 'navigationHeight');
        this.mainWindow = undefined;
        this.onWindowSizeChangeCallback = undefined;
        this.onAvoidSafeAreaChangeCallback = undefined;
        this.sideBarHelper = undefined;
        this.atomicServiceIcon = undefined;
        this.navigationBarVisibility = true;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.navPathStack !== undefined) {
            this.navPathStack = params.navPathStack;
        }
        if (params.navigationContent !== undefined) {
            this.navigationContent = params.navigationContent;
        }
        if (params.titleOptions === undefined) {
            this.__titleOptions.set({ isBlurEnabled: true });
        }
        if (params.navDestinationBuilder !== undefined) {
            this.navDestinationBuilder = params.navDestinationBuilder;
        }
        if (params.sideBarContent !== undefined) {
            this.sideBarContent = params.sideBarContent;
        }
        if (params.showMaskLayer !== undefined) {
            this.showMaskLayer = params.showMaskLayer;
        }
        if (params.marginWindowLeft !== undefined) {
            this.marginWindowLeft = params.marginWindowLeft;
        }
        if (params.currentBreakPoint !== undefined) {
            this.currentBreakPoint = params.currentBreakPoint;
        }
        if (params.sideBarAttribute !== undefined) {
            this.sideBarAttribute = params.sideBarAttribute;
        }
        if (params.controlButtonVisible !== undefined) {
            this.controlButtonVisible = params.controlButtonVisible;
        }
        if (params.titleBuilderPaddingEndWidth !== undefined) {
            this.titleBuilderPaddingEndWidth = params.titleBuilderPaddingEndWidth;
        }
        if (params.menus !== undefined) {
            this.menus = params.menus;
        }
        if (params.stateChangeCallback !== undefined) {
            this.stateChangeCallback = params.stateChangeCallback;
        }
        if (params.modeChangeCallback !== undefined) {
            this.modeChangeCallback = params.modeChangeCallback;
        }
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.navigationWidth !== undefined) {
            this.navigationWidth = params.navigationWidth;
        }
        if (params.navigationHeight !== undefined) {
            this.navigationHeight = params.navigationHeight;
        }
        if (params.mainWindow !== undefined) {
            this.mainWindow = params.mainWindow;
        }
        if (params.onWindowSizeChangeCallback !== undefined) {
            this.onWindowSizeChangeCallback = params.onWindowSizeChangeCallback;
        }
        if (params.onAvoidSafeAreaChangeCallback !== undefined) {
            this.onAvoidSafeAreaChangeCallback = params.onAvoidSafeAreaChangeCallback;
        }
        if (params.sideBarHelper !== undefined) {
            this.sideBarHelper = params.sideBarHelper;
        }
        if (params.atomicServiceIcon !== undefined) {
            this.atomicServiceIcon = params.atomicServiceIcon;
        }
        if (params.navigationBarVisibility !== undefined) {
            this.navigationBarVisibility = params.navigationBarVisibility;
        }
    }
    updateStateVars(params) {
        this.__title.reset(params.title);
        this.__titleOptions.reset(params.titleOptions);
        this.__gradientBackground.reset(params.gradientBackground);
        this.__hideTitleBar.reset(params.hideTitleBar);
        this.__navBarWidth.reset(params.navBarWidth);
        this.__mode.reset(params.mode);
        this.__navBarWidthRange.reset(params.navBarWidthRange);
        this.__minContentWidth.reset(params.minContentWidth);
        this.__sideBarOptions.reset(params.sideBarOptions);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__navPathStack.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__titleOptions.purgeDependencyOnElmtId(rmElmtId);
        this.__gradientBackground.purgeDependencyOnElmtId(rmElmtId);
        this.__hideTitleBar.purgeDependencyOnElmtId(rmElmtId);
        this.__navBarWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__mode.purgeDependencyOnElmtId(rmElmtId);
        this.__navBarWidthRange.purgeDependencyOnElmtId(rmElmtId);
        this.__minContentWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__sideBarOptions.purgeDependencyOnElmtId(rmElmtId);
        this.__showMaskLayer.purgeDependencyOnElmtId(rmElmtId);
        this.__marginWindowLeft.purgeDependencyOnElmtId(rmElmtId);
        this.__currentBreakPoint.purgeDependencyOnElmtId(rmElmtId);
        this.__sideBarAttribute.purgeDependencyOnElmtId(rmElmtId);
        this.__controlButtonVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__titleBuilderPaddingEndWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__navigationWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__navigationHeight.purgeDependencyOnElmtId(rmElmtId);
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
        this.__sideBarOptions.aboutToBeDeleted();
        this.__showMaskLayer.aboutToBeDeleted();
        this.__marginWindowLeft.aboutToBeDeleted();
        this.__currentBreakPoint.aboutToBeDeleted();
        this.__sideBarAttribute.aboutToBeDeleted();
        this.__controlButtonVisible.aboutToBeDeleted();
        this.__titleBuilderPaddingEndWidth.aboutToBeDeleted();
        this.__navigationWidth.aboutToBeDeleted();
        this.__navigationHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get navPathStack() {
        return this.__navPathStack.get();
    }
    set navPathStack(newValue) {
        this.__navPathStack.set(newValue);
    }
    get title() {
        return this.__title.get();
    }
    set title(newValue) {
        this.__title.set(newValue);
    }
    get titleOptions() {
        return this.__titleOptions.get();
    }
    set titleOptions(newValue) {
        this.__titleOptions.set(newValue);
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
    set hideTitleBar(newValue) {
        this.__hideTitleBar.set(newValue);
    }
    get navBarWidth() {
        return this.__navBarWidth.get();
    }
    set navBarWidth(newValue) {
        this.__navBarWidth.set(newValue);
    }
    get mode() {
        return this.__mode.get();
    }
    set mode(newValue) {
        this.__mode.set(newValue);
    }
    get navBarWidthRange() {
        return this.__navBarWidthRange.get();
    }
    set navBarWidthRange(newValue) {
        this.__navBarWidthRange.set(newValue);
    }
    get minContentWidth() {
        return this.__minContentWidth.get();
    }
    set minContentWidth(newValue) {
        this.__minContentWidth.set(newValue);
    }
    get sideBarOptions() {
        return this.__sideBarOptions.get();
    }
    set sideBarOptions(newValue) {
        this.__sideBarOptions.set(newValue);
    }
    get showMaskLayer() {
        return this.__showMaskLayer.get();
    }
    set showMaskLayer(newValue) {
        this.__showMaskLayer.set(newValue);
    }
    get marginWindowLeft() {
        return this.__marginWindowLeft.get();
    }
    set marginWindowLeft(newValue) {
        this.__marginWindowLeft.set(newValue);
    }
    get currentBreakPoint() {
        return this.__currentBreakPoint.get();
    }
    set currentBreakPoint(newValue) {
        this.__currentBreakPoint.set(newValue);
    }
    get sideBarAttribute() {
        return this.__sideBarAttribute.get();
    }
    set sideBarAttribute(newValue) {
        this.__sideBarAttribute.set(newValue);
    }
    get controlButtonVisible() {
        return this.__controlButtonVisible.get();
    }
    set controlButtonVisible(newValue) {
        this.__controlButtonVisible.set(newValue);
    }
    get titleBuilderPaddingEndWidth() {
        return this.__titleBuilderPaddingEndWidth.get();
    }
    set titleBuilderPaddingEndWidth(newValue) {
        this.__titleBuilderPaddingEndWidth.set(newValue);
    }
    get navigationWidth() {
        return this.__navigationWidth.get();
    }
    set navigationWidth(newValue) {
        this.__navigationWidth.set(newValue);
    }
    get navigationHeight() {
        return this.__navigationHeight.get();
    }
    set navigationHeight(newValue) {
        this.__navigationHeight.set(newValue);
    }
    defaultNavDestinationBuilder(name, param, parent = null) {
    }
    BackgroundBuilder(gradientBackground, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.opacity(transparencyMapArray[(gradientBackground.alpha === undefined) ? GradientAlpha.OPACITY_20 :
                gradientBackground.alpha]);
            Canvas.backdropBlur(BLUR_CONSTANT);
            Canvas.height(this.navigationHeight);
            Canvas.backgroundColor(gradientBackground.backgroundTheme === undefined ? backGroundColor[2] :
                backGroundColor[gradientBackground.backgroundTheme - 1]);
            Canvas.onReady(() => {
                if (gradientBackground.secondaryColor === undefined) {
                    //单色渐变
                    this.drawSingleGradient(this.context, gradientBackground.primaryColor, gradientBackground.backgroundTheme === undefined ?
                        backGroundColor[2] : backGroundColor[gradientBackground.backgroundTheme - 1]);
                } else {
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
            Canvas.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Canvas);
        Canvas.pop();
    }
    aboutToAppear() {
        this.initWindow();
        this.initIcon();
        this.initSideBarAttr();
    }
    /**
     * 初始化侧边栏相关信息
     */
    initSideBarAttr() {
        if (this.titleOptions?.titleBarType !== TitleBarType.DRAWER) {
            return;
        }
        this.sideBarAttribute = new sideBarAttributeSet();
        this.sideBarHelper = new SideBarHelper();
        let sideBarStatusListener = (show) => {
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
    freshMenubarAvoidAreaWidth(mainWindow) {
        setTimeout(() => {
            const atomicServiceBar = this.getUIContext().getAtomicServiceBar();
            if (!atomicServiceBar) {
                this.titleBuilderPaddingEndWidth = 0;
                return;
            }
            let menubarX = atomicServiceBar.getBarRect().x;
            let corretionWidth = 0;
            if (menubarX > MENUBAR_X_FIRST_THRESHOLD) {
                const mainWindowWidth = px2vp(mainWindow.getWindowProperties()?.windowRect?.width) - menubarX;
                corretionWidth = mainWindowWidth > MENUBAR_X_FIRST_THRESHOLD ? 0 : mainWindowWidth;
            }
            else if (menubarX < MENUBAR_X_SECOND_THRESHOLD) {
                corretionWidth = menubarX + MENUBAR_CORRECTION_OFFSET_VALUE;
            }
            let currentWidth = atomicServiceBar.getBarRect().width;
            this.titleBuilderPaddingEndWidth = corretionWidth > currentWidth ? corretionWidth : currentWidth;
        }, 100);
    }
    /**
     * 初始化window，并设置windowSizeChange监听，更新断点信息
     */
    initWindow() {
        let context = getContext(this);
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
        }).catch((err) => {
            console.error(`AtomicServiceNavigation get main window failed, message is ${err?.message}`);
        });
    }
    /**
     * 初始化icon，用户如果设置了则用自定义的icon，没有设置则用元服务图标
     */
    initIcon() {
        if ((this.titleOptions?.titleBarType !== TitleBarType.ROUND_ICON &&
            this.titleOptions?.titleBarType !== TitleBarType.SQUARED_ICON) || this.titleOptions?.titleIcon) {
            return;
        }
        let bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
        let bundleInfo = bundleManager.getBundleInfoForSelfSync(bundleFlags);
        let iconRes = bundleInfo?.appInfo?.iconResource;
        this.atomicServiceIcon = getContext(this)?.resourceManager?.getDrawableDescriptor(iconRes)?.getPixelMap();
    }
    /**
     * 更新断点信息
     */
    updateBreakPoint(windowWidth) {
        if (!windowWidth || windowWidth <= 0) {
            return;
        }
        let widthVp = px2vp(windowWidth);
        let newBreakPoint = '';
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
    updateMargin() {
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
    aboutToDisappear() {
        if (this.onWindowSizeChangeCallback) {
            this.mainWindow?.off('windowSizeChange', this.onWindowSizeChangeCallback);
        }
    }
    /**
     * 更新control button的可见性
     */
    updateControlButtonVisibility() {
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
            }
            else {
                if (!this.controlButtonVisible) {
                    this.controlButtonVisible = true;
                }
            }
        }
        else {
            if (this.controlButtonVisible !== this.navigationBarVisibility) {
                this.controlButtonVisible = this.navigationBarVisibility;
            }
        }
    }
    drawerTitleBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleOptions?.titleBarType === TitleBarType.DRAWER && this.title) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.padding({
                            start: LengthMetrics.vp(this.currentBreakPoint !== BREAK_POINT_LG ? this.marginWindowLeft + 36 + 8 :
                                (this.sideBarAttribute.showSideBar ? 8 : this.marginWindowLeft + 36 + 8)),
                            top: LengthMetrics.vp(10),
                            bottom: LengthMetrics.vp(10),
                            // 在Stack模式，或者非分栏模式下右侧需要有一定padding值，避免超长文本时不能避让menuBar
                            end: ((this.currentBreakPoint === BREAK_POINT_SM &&
                                (this.mode === NavigationMode.Auto || !this.mode)) || this.mode === NavigationMode.Stack) ?
                                LengthMetrics.vp(this.titleBuilderPaddingEndWidth) : LengthMetrics.vp(0)
                        });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.title);
                        Text.maxLines(2);
                        Text.minFontSize(14);
                        Text.maxFontSize(26);
                        Text.height(36);
                        Text.fontColor({ 'id': -1, 'type': 10001, params: ['sys.color.font_primary'],
                            'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(0);
                        Text.layoutWeight(1);
                        Text.clip(true);
                        Text.textAlign(i18n.isRTL(i18n.System.getSystemLocale()) ? TextAlign.End : TextAlign.Start);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    maskLayer(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
            Column.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_mask_thin'],
                'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
            Column.transition(TransitionEffect.opacity(0).animation({ duration: 500, curve: Curve.Linear }));
            Column.width('100%');
            Column.height('100%');
            Column.accessibilityLevel('no');
            Column.onClick(() => {
                this.changeSideBarWithAnimation(false);
            });
        }, Column);
        Column.pop();
    }
    controlButton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.sideBarAttribute.showSideBar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (!this.sideBarOptions?.sideBarIcon) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild({ type: ButtonType.Circle });
                                    Button.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_button_normal'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    Button.width(36);
                                    Button.height(36);
                                    Button.borderRadius(18);
                                    Button.margin({
                                        start: LengthMetrics.vp(this.marginWindowLeft),
                                    });
                                    Button.zIndex(2);
                                    Button.draggable(false);
                                    Button.onClick(() => {
                                        const isShowSideBar = !this.sideBarHelper?.isShowSideBar();
                                        this.changeSideBarWithAnimation(isShowSideBar);
                                    });
                                    Button.position({
                                        start: LengthMetrics.vp(0),
                                        top: LengthMetrics.vp(8)
                                    });
                                    Button.visibility(this.controlButtonVisible ? Visibility.Visible : Visibility.None);
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    SymbolGlyph.create({ 'id': -1, 'type': 40000, params: ['sys.symbol.open_sidebar'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    SymbolGlyph.fontWeight(FontWeight.Normal);
                                    SymbolGlyph.fontSize({ 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    SymbolGlyph.fontColor([{ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_titlebar_icon'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' }]);
                                }, SymbolGlyph);
                                Button.pop();
                            });
                        }
                        else if (this.sideBarOptions?.sideBarIcon instanceof SymbolGlyphModifier) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild({ type: ButtonType.Circle });
                                    Button.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_button_normal'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    Button.width(36);
                                    Button.height(36);
                                    Button.borderRadius(18);
                                    Button.margin({
                                        start: LengthMetrics.vp(this.marginWindowLeft),
                                    });
                                    Button.zIndex(2);
                                    Button.draggable(false);
                                    Button.onClick(() => {
                                        const isShowSideBar = !this.sideBarHelper?.isShowSideBar();
                                        this.changeSideBarWithAnimation(isShowSideBar);
                                    });
                                    Button.position({
                                        start: LengthMetrics.vp(0),
                                        top: LengthMetrics.vp(8)
                                    });
                                    Button.visibility(this.controlButtonVisible ? Visibility.Visible : Visibility.None);
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    SymbolGlyph.create();
                                    SymbolGlyph.attributeModifier.bind(this)(this.sideBarOptions?.sideBarIcon);
                                    SymbolGlyph.fontSize({ 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    SymbolGlyph.size({
                                        width: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                            'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' },
                                        height: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                            'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' }
                                    });
                                }, SymbolGlyph);
                                Button.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.sideBarOptions?.sideBarIcon);
                                    Image.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_button_normal'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    Image.width(36);
                                    Image.height(36);
                                    Image.borderRadius(18);
                                    Image.margin({
                                        start: LengthMetrics.vp(this.marginWindowLeft),
                                    });
                                    Image.zIndex(2);
                                    Image.draggable(false);
                                    Image.onClick(() => {
                                        const isShowSideBar = !this.sideBarHelper?.isShowSideBar();
                                        this.changeSideBarWithAnimation(isShowSideBar);
                                    });
                                    Image.position({
                                        start: LengthMetrics.vp(0),
                                        top: LengthMetrics.vp(8)
                                    });
                                    Image.visibility(this.controlButtonVisible ? Visibility.Visible : Visibility.None);
                                }, Image);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (!this.titleOptions?.titleIcon) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild({ type: ButtonType.Circle });
                                    Button.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_button_normal'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    Button.width(36);
                                    Button.height(36);
                                    Button.borderRadius(18);
                                    Button.margin({
                                        start: LengthMetrics.vp(this.marginWindowLeft),
                                    });
                                    Button.zIndex(2);
                                    Button.draggable(false);
                                    Button.onClick(() => {
                                        const isShowSideBar = !this.sideBarHelper?.isShowSideBar();
                                        this.changeSideBarWithAnimation(isShowSideBar);
                                    });
                                    Button.position({
                                        start: LengthMetrics.vp(0),
                                        top: LengthMetrics.vp(8)
                                    });
                                    Button.visibility(this.controlButtonVisible ? Visibility.Visible : Visibility.None);
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    SymbolGlyph.create({ 'id': -1, 'type': 40000, params: ['sys.symbol.close_sidebar'], 'bundleName':
                                        '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    SymbolGlyph.fontWeight(FontWeight.Normal);
                                    SymbolGlyph.fontSize({ 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    SymbolGlyph.fontColor([{ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_titlebar_icon'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' }]);
                                }, SymbolGlyph);
                                Button.pop();
                            });
                        }
                        else if (this.titleOptions?.titleIcon instanceof SymbolGlyphModifier) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild({ type: ButtonType.Circle });
                                    Button.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_button_normal'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    Button.width(36);
                                    Button.height(36);
                                    Button.borderRadius(18);
                                    Button.margin({
                                        start: LengthMetrics.vp(this.marginWindowLeft),
                                    });
                                    Button.zIndex(2);
                                    Button.draggable(false);
                                    Button.onClick(() => {
                                        const isShowSideBar = !this.sideBarHelper?.isShowSideBar();
                                        this.changeSideBarWithAnimation(isShowSideBar);
                                    });
                                    Button.position({
                                        start: LengthMetrics.vp(0),
                                        top: LengthMetrics.vp(8)
                                    });
                                    Button.visibility(this.controlButtonVisible ? Visibility.Visible : Visibility.None);
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    SymbolGlyph.create();
                                    SymbolGlyph.attributeModifier.bind(this)(this.titleOptions?.titleIcon);
                                    SymbolGlyph.fontSize({ 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    SymbolGlyph.size({
                                        width: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                            'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' },
                                        height: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                            'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' }
                                    });
                                }, SymbolGlyph);
                                Button.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.titleOptions?.titleIcon);
                                    Image.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_button_normal'],
                                        'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                                    Image.width(36);
                                    Image.height(36);
                                    Image.borderRadius(18);
                                    Image.margin({
                                        start: LengthMetrics.vp(this.marginWindowLeft),
                                    });
                                    Image.zIndex(2);
                                    Image.draggable(false);
                                    Image.onClick(() => {
                                        const isShowSideBar = !this.sideBarHelper?.isShowSideBar();
                                        this.changeSideBarWithAnimation(isShowSideBar);
                                    });
                                    Image.position({
                                        start: LengthMetrics.vp(0),
                                        top: LengthMetrics.vp(8)
                                    });
                                    Image.visibility(this.controlButtonVisible ? Visibility.Visible : Visibility.None);
                                }, Image);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
    }
    sideBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.border({ width: {
                    left: 0,
                    right: '1px',
                    top: 0,
                    bottom: 0
                },
                color: { 'id': -1, 'type': 10001, params: ['sys.color.comp_divider'],
                    'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' },
                style: {
                    right: BorderStyle.Solid
                } });
            Row.alignItems(VerticalAlign.Top);
            Row.width('100%');
            Row.height('100%');
            Row.padding({ top: 56 });
            Row.focusable(true);
            Row.defaultFocus(true);
            Row.backgroundColor(this.sideBarOptions?.sideBarBackground ?? { 'id': -1, 'type': 10001,
                params: ['sys.color.ohos_id_color_sub_background'], 'bundleName': '__harDefaultBundleName__',
                'moduleName': '__harDefaultModuleName__' });
            Row.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.sideBarContent) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.sideBarContent.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    roundIconBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleOptions?.titleIcon instanceof SymbolGlyphModifier) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle });
                        Button.stateEffect(false);
                        Button.backgroundColor('rgba(0, 0, 0, 0)');
                        Button.width(36);
                        Button.height(36);
                        Button.borderRadius(18);
                        Button.margin({
                            start: LengthMetrics.vp(this.marginWindowLeft),
                            end: LengthMetrics.vp(8),
                            top: LengthMetrics.vp(10),
                            bottom: LengthMetrics.vp(10)
                        });
                        Button.zIndex(2);
                        Button.draggable(false);
                        Button.position({
                            start: LengthMetrics.vp(0),
                            top: LengthMetrics.vp(0)
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create();
                        SymbolGlyph.attributeModifier.bind(this)(this.titleOptions?.titleIcon);
                        SymbolGlyph.fontSize({ 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                            'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                        SymbolGlyph.size({
                            width: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' },
                            height: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' }
                        });
                    }, SymbolGlyph);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.titleOptions?.titleIcon ?? this.atomicServiceIcon);
                        Image.backgroundColor('rgba(0, 0, 0, 0)');
                        Image.width(36);
                        Image.height(36);
                        Image.borderRadius(18);
                        Image.margin({
                            start: LengthMetrics.vp(this.marginWindowLeft),
                            end: LengthMetrics.vp(8),
                            top: LengthMetrics.vp(10),
                            bottom: LengthMetrics.vp(10)
                        });
                        Image.zIndex(2);
                        Image.draggable(false);
                        Image.position({
                            start: LengthMetrics.vp(0),
                            top: LengthMetrics.vp(0)
                        });
                    }, Image);
                });
            }
        }, If);
        If.pop();
    }
    longIconBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleOptions?.titleIcon instanceof SymbolGlyphModifier) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.height(36);
                        Button.width(36);
                        Button.margin({
                            start: LengthMetrics.vp(this.marginWindowLeft),
                            end: LengthMetrics.vp(-12),
                            top: LengthMetrics.vp(10),
                            bottom: LengthMetrics.vp(10)
                        });
                        Button.draggable(false);
                        Button.position({
                            start: LengthMetrics.vp(0),
                            top: LengthMetrics.vp(0)
                        });
                        Button.backgroundColor('rgba(0, 0, 0, 0)');
                        Button.stateEffect(false);
                        Button.type(ButtonType.Normal);
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create();
                        SymbolGlyph.attributeModifier.bind(this)(this.titleOptions?.titleIcon);
                        SymbolGlyph.fontSize({ 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                            'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
                        SymbolGlyph.size({
                            width: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' },
                            height: { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_headline7'],
                                'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' }
                        });
                    }, SymbolGlyph);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.titleOptions?.titleIcon ?? this.atomicServiceIcon);
                        Image.height(36);
                        Image.width(36);
                        Image.margin({
                            start: LengthMetrics.vp(this.marginWindowLeft),
                            end: LengthMetrics.vp(-12),
                            top: LengthMetrics.vp(10),
                            bottom: LengthMetrics.vp(10)
                        });
                        Image.draggable(false);
                        Image.position({
                            start: LengthMetrics.vp(0),
                            top: LengthMetrics.vp(0)
                        });
                        Image.backgroundColor('rgba(0, 0, 0, 0)');
                        Image.objectFit(ImageFit.Auto);
                    }, Image);
                });
            }
        }, If);
        If.pop();
    }
    titleBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleOptions?.titleBarType === TitleBarType.SQUARED_ICON) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.longIconBuilder.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.roundIconBuilder.bind(this)();
                });
            }
        }, If);
        If.pop();
    }
    /**
     * 根据当前屏幕尺寸判断是否要显示用户插入的布局
     */
    isShowMenus() {
        return this.mode === NavigationMode.Stack && this.currentBreakPoint !== BREAK_POINT_SM;
    }
    /**
     * 根据用户传入的类型和当前屏幕尺寸判断是否要显示NavigationMenuItem列表
     */
    getMenuItemArray() {
        return this.isShowMenus() && this.menus instanceof Array ? this.menus : undefined;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.align(Alignment.TopStart);
            Stack.width('100%');
            Stack.height('100%');
            Stack.onSizeChange((oldValue, newValue) => {
                this.navigationWidth = newValue.width;
                this.navigationHeight = newValue.height;
            });
            Stack.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.gradientBackground !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.BackgroundBuilder.bind(this)(makeBuilderParameterProxy('BackgroundBuilder', {
                        primaryColor: () => this.gradientBackground.primaryColor,
                        secondaryColor: () => this.gradientBackground.secondaryColor,
                        backgroundTheme: () => this.gradientBackground.backgroundTheme,
                        mixMode: () => this.gradientBackground.mixMode,
                        alpha: () => this.gradientBackground.alpha
                    }));
                });
            } else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleOptions?.titleBarType === TitleBarType.DRAWER) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.controlButton.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.create(this.currentBreakPoint === BREAK_POINT_LG ? SideBarContainerType.Embed :
                            SideBarContainerType.Overlay);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.sideBarWidth(this.sideBarAttribute.sideBarWidth);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.minContentWidth(this.sideBarAttribute.minContentWidthOfSideBar);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.minSideBarWidth(this.sideBarAttribute.minSideBarWidth);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.maxSideBarWidth(this.sideBarAttribute.maxSideBarWidth);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.showControlButton(false);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.showSideBar(this.sideBarAttribute.showSideBar);
                        // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                        SideBarContainer.onChange((showSideBar) => {
                            if (this.sideBarHelper?.isShowSideBar() !== showSideBar) {
                                this.changeSideBarWithAnimation(showSideBar);
                            }
                        });
                    }, SideBarContainer);
                    this.sideBar.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Navigation.create(this.navPathStack, { moduleName: 'library', pagePath: '', isUserCreateStack: true });
                        Navigation.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
                        Navigation.title({ builder: () => {
                                this.drawerTitleBuilder.call(this);
                            } }, this.getTitleOption());
                        Navigation.menus(this.isShowMenus() && this.menus instanceof Function ? { builder: () => {
                                this.menus.call(this);
                            } } : this.getMenuItemArray());
                        Navigation.titleMode(NavigationTitleMode.Mini);
                        Navigation.hideBackButton(true);
                        Navigation.hideTitleBar(this.hideTitleBar);
                        Navigation.navBarWidth(ObservedObject.GetRawObject(this.navBarWidth));
                        Navigation.navBarPosition(NavBarPosition.Start);
                        Navigation.mode(this.mode);
                        Navigation.navDestination({ builder: this.navDestinationBuilder.bind(this) });
                        Navigation.navBarWidthRange(ObservedObject.GetRawObject(this.navBarWidthRange));
                        Navigation.minContentWidth(ObservedObject.GetRawObject(this.minContentWidth));
                        Navigation.onNavigationModeChange(this.modeChangeCallback);
                        Navigation.onNavBarStateChange((visible) => {
                            this.navigationBarVisibility = visible;
                            this.updateControlButtonVisibility();
                            if (this.stateChangeCallback) {
                                this.stateChangeCallback(visible);
                            }
                        });
                    }, Navigation);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.titleOptions?.titleBarType === TitleBarType.DRAWER && this.sideBarAttribute.showSideBar &&
                            this.currentBreakPoint !== BREAK_POINT_LG && this.showMaskLayer) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.maskLayer.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                    // 断点为LG时，侧边栏嵌入到组件内；断点为MD或SM时，侧边栏悬浮在B栏上
                    SideBarContainer.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Navigation.create(this.navPathStack, { moduleName: 'library', pagePath: '', isUserCreateStack: true });
                        Navigation.title((this.titleOptions?.titleIcon || (this.titleOptions?.titleBarType && !this.title)) ? { builder: () => {
                                this.titleBuilder.call(this);
                            } } : this.title, this.getTitleOption());
                        Navigation.titleMode(NavigationTitleMode.Mini);
                        Navigation.menus(this.isShowMenus() && this.menus instanceof Function ? { builder: () => {
                                this.menus.call(this);
                            } } : this.getMenuItemArray());
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
                    }, Navigation);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
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
                });
            }
        }, If);
        If.pop();
        Stack.pop();
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
            COLOR_RATIO_FIFTY_PERCENT * height + COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth : height;
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
                hilog.error(0x0000, 'AtomicServiceNavigation',
                    `resourceColorToString - systemResourceManager getStringValue failed, error code: ${code}, message: ${message}.`);
            }
            return '';
        }
        else {
            return resource.toString();
        }
    }
    /**
     * 获取NavigationTitleOptions
     */
    getTitleOption() {
        return {
            backgroundColor: this.titleOptions?.backgroundColor,
            backgroundBlurStyle: this.titleOptions?.isBlurEnabled ? BlurStyle.COMPONENT_THICK : BlurStyle.NONE,
            barStyle: this.titleOptions?.barStyle
        };
    }
    /**
     * 更新control button的可见性，并运行动画效果
     */
    changeSideBarWithAnimation(isShowSidebar) {
        Context.animateTo({
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
        });
    }
    rerender() {
        this.updateDirtyElements();
    }
}
/**
 * 侧边栏相关参数
 */
let sideBarAttributeSet = class sideBarAttributeSet {
    constructor() {
        /**
         * 侧边栏宽度
         */
        this.sideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        /**
         * 侧边栏最小宽度
         */
        this.minSideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        /**
         * 侧边栏最大宽度
         */
        this.maxSideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        /**
         * 侧边栏内容最小宽度
         */
        this.minContentWidthOfSideBar = SIDE_BAR_COMMON_WIDTH;
        /**
         * 侧边栏显示隐藏状态
         */
        this.showSideBar = false;
    }
};
sideBarAttributeSet = __decorate([
    Observed
], sideBarAttributeSet);
/**
 * 侧边栏辅助管理类
 */
class SideBarHelper {
    constructor() {
        this.isExpandSideBar = false;
    }
    /**
     * 注册侧边栏显隐状态变化监听
     *
     * @param listener 监听器对象
     */
    registerListener(listener) {
        this.listener = listener;
    }
    /**
     * 取消注册监听
     */
    unregisterListener() {
        this.listener = undefined;
    }
    /**
     * 获取侧边栏显示隐藏状态
     *
     * @returns 侧边栏是否显示
     */
    isShowSideBar() {
        return this.isExpandSideBar;
    }
    /**
     * 设置侧边栏显示隐藏状态
     *
     * @param value 显示或隐藏状态
     */
    setShowSideBar(value) {
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
    updateLayout(breakPoint, layout) {
        if (breakPoint === BREAK_POINT_LG) {
            this.updateLGLayout(layout);
        }
        else {
            this.updateCommonLayout(layout);
        }
    }
    /**
     * 更新除LG外窗口模式的布局
     */
    updateCommonLayout(layout) {
        layout.sideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        layout.minContentWidthOfSideBar = '100%';
    }
    /**
     * 更新LG窗口模式布局
     */
    updateLGLayout(layout) {
        layout.sideBarWidth = SIDE_BAR_EMBED_MIN_WIDTH;
        layout.minContentWidthOfSideBar = CONTENT_MIN_WIDTH;
    }
}
/**
 * 标题栏类型
 */
export let TitleBarType;
(function (TitleBarType) {
    /**
     * 长图标类型标题栏
     */
    TitleBarType.SQUARED_ICON = 1;
    /**
     * 圆形图标类型标题栏
     */
    TitleBarType.ROUND_ICON = 2;
    /**
     * 抽屉类型标题栏
     */
    TitleBarType.DRAWER = 3;
})(TitleBarType || (TitleBarType = {}));
//# sourceMappingURL=AtomicServiceNavigation.js.map
export default {
    AtomicServiceNavigation,
    MixMode,
    GradientAlpha,
    BackgroundTheme,
    TitleBarType
};