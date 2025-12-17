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
const BREAK_POINT_VP_SM = 600;
const BREAK_POINT_VP_MD = 840;
const BREAK_POINT_SM = 'sm';
const BREAK_POINT_MD = 'md';
const BREAK_POINT_LG = 'lg';
const SIDE_BAR_EMBED_MIN_WIDTH = 240;
const SIDE_BAR_OVERLAY_WIDTH = 304;
const SIDE_BAR_COMMON_WIDTH = 360;
const CONTENT_MIN_WIDTH = 600;
const MENUBAR_X_FIRST_THRESHOLD = 200;
const MENUBAR_X_SECOND_THRESHOLD = 40;
const MENUBAR_CORRECTION_OFFSET_VALUE = 92;
const TITLE_MAX_LINES = 2;
const TITLE_MIN_FONT_SIZE = 14;
const TITLE_MAX_FONT_SIZE = 26;
const DEFAULT_TITLE_HEIGHT = 36;
const TITLE_LAYOUT_WEIGHT = 1;
const DEFAULT_PADDING_START_DISTANCE = 32;
const DEFAULT_MARGIN_TOP_DISTANCE = 26;
const TITLE_FONT_COLOR = { 'id': -1, 'type': 10001, params: ['sys.color.font_primary'],
    'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
export let GradientAlpha;
(function (GradientAlpha) {
    GradientAlpha.OPACITY_20 = 1;
    GradientAlpha.OPACITY_60 = 2;
    GradientAlpha.OPACITY_80 = 3;
    GradientAlpha.OPACITY_100 = 4;
})(GradientAlpha || (GradientAlpha = {}));
export let MixMode;
(function (MixMode) {
    MixMode.AVERAGE = 1;
    MixMode.CROSS = 2;
    MixMode.TOWARDS = 3;
})(MixMode || (MixMode = {}));
export let BackgroundTheme;
(function (BackgroundTheme) {
    BackgroundTheme.DARK = 1;
    BackgroundTheme.LIGHT = 2;
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
                    this.drawSingleGradient(this.context, gradientBackground.primaryColor, gradientBackground.backgroundTheme === undefined ?
                        backGroundColor[2] : backGroundColor[gradientBackground.backgroundTheme - 1]);
                } else {
                    if (gradientBackground.mixMode === MixMode.AVERAGE) {
                        this.drawGradientCanvasHalf(this.context, gradientBackground.primaryColor, gradientBackground.secondaryColor);
                    }
                    else if (gradientBackground.mixMode === MixMode.CROSS) {
                        this.drawGradientCanvasCross(this.context, gradientBackground.primaryColor, gradientBackground.secondaryColor);
                    }
                    else {
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
    initSideBarAttr() {
        if (this.titleOptions?.titleBarType !== TitleBarType.DRAWER) {
            return;
        }
        this.sideBarAttribute = new sideBarAttributeSet();
        this.sideBarHelper = new SideBarHelper();
        let p1 = (show) => {
            this.sideBarAttribute.showSideBar = show;
            this.updateControlButtonVisibility();
            if (this.sideBarOptions?.onChange) {
                this.sideBarOptions.onChange(show);
            }
        };
        this.sideBarHelper.v1(p1);
    }
    freshMenubarAvoidAreaWidth(j1) {
        setTimeout(() => {
            const k1 = this.getUIContext().getAtomicServiceBar();
            if (!k1) {
                this.titleBuilderPaddingEndWidth = 0;
                return;
            }
            let l1 = k1.getBarRect().x;
            let m1 = 0;
            if (l1 > MENUBAR_X_FIRST_THRESHOLD) {
                const o1 = px2vp(j1.getWindowProperties()?.windowRect?.width) - l1;
                m1 = o1 > MENUBAR_X_FIRST_THRESHOLD ? 0 : o1;
            } else if (l1 < MENUBAR_X_SECOND_THRESHOLD) {
                m1 = l1 + MENUBAR_CORRECTION_OFFSET_VALUE;
            }
            let n1 = k1.getBarRect().width;
            this.titleBuilderPaddingEndWidth = m1 > n1 ? m1 : n1;
        }, 100);
    }
    initWindow() {
        let context = getContext(this);
        context?.windowStage?.getMainWindow().then(i1 => {
            if (!i1) {
                return;
            }
            this.mainWindow = i1;
            if (this.titleOptions?.titleBarType === TitleBarType.DRAWER) {
                this.sideBarHelper?.w1(this.currentBreakPoint, this.sideBarAttribute);
            }
            this.updateBreakPoint(i1.getWindowProperties()?.windowRect?.width);
            this.freshMenubarAvoidAreaWidth(i1);
            this.onWindowSizeChangeCallback = ((windowSize) => {
                this.updateBreakPoint(windowSize?.width);
                this.freshMenubarAvoidAreaWidth(i1);
            });
            i1.on('windowSizeChange', this.onWindowSizeChangeCallback);
        }).catch((err) => {
            console.error(`AtomicServiceNavigation get main window failed, message is ${err?.message}`);
        });
    }
    initIcon() {
        if ((this.titleOptions?.titleBarType !== TitleBarType.ROUND_ICON &&
            this.titleOptions?.titleBarType !== TitleBarType.SQUARED_ICON) || this.titleOptions?.titleIcon) {
            return;
        }
        let bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
        let g1 = bundleManager.getBundleInfoForSelfSync(bundleFlags);
        let h1 = g1?.appInfo?.iconResource;
        this.atomicServiceIcon = getContext(this)?.resourceManager?.getDrawableDescriptor(h1)?.getPixelMap();
    }
    updateBreakPoint(windowWidth) {
        if (!windowWidth || windowWidth <= 0) {
            return;
        }
        let e1 = px2vp(windowWidth);
        let f1 = '';
        if (e1 < BREAK_POINT_VP_SM) {
            f1 = BREAK_POINT_SM;
        } else if (e1 < BREAK_POINT_VP_MD) {
            f1 = BREAK_POINT_MD;
        } else {
            f1 = BREAK_POINT_LG;
        }
        if (this.currentBreakPoint !== f1) {
            this.currentBreakPoint = f1;
            this.updateMargin();
            if (this.titleOptions?.titleBarType === TitleBarType.DRAWER) {
                this.sideBarHelper?.w1(this.currentBreakPoint, this.sideBarAttribute);
            }
        }
    }
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
    updateControlButtonVisibility() {
        if (this.titleOptions?.titleBarType !== TitleBarType.DRAWER) {
            return;
        }
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
    isRTL() {
        return i18n.isRTL(i18n.System.getSystemLocale());
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
                            end: ((this.currentBreakPoint === BREAK_POINT_SM &&
                                (this.mode === NavigationMode.Auto || !this.mode)) || this.mode === NavigationMode.Stack) ?
                                LengthMetrics.vp(this.titleBuilderPaddingEndWidth) : LengthMetrics.vp(0)
                        });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.title);
                        Text.maxLines(TITLE_MAX_LINES);
                        Text.minFontSize(TITLE_MIN_FONT_SIZE);
                        Text.maxFontSize(TITLE_MAX_FONT_SIZE);
                        Text.height(DEFAULT_TITLE_HEIGHT);
                        Text.fontColor(TITLE_FONT_COLOR);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(0);
                        Text.layoutWeight(TITLE_LAYOUT_WEIGHT);
                        Text.clip(true);
                        Text.textAlign(this.isRTL() ? TextAlign.End : TextAlign.Start);
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
                                    SymbolGlyph.create({ 'id': -1, 'type': 40000, params: ['sys.symbol.close_sidebar'],
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
    defaultTitleBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.maxLines(TITLE_MAX_LINES);
            Text.minFontSize(TITLE_MIN_FONT_SIZE);
            Text.maxFontSize(TITLE_MAX_FONT_SIZE);
            Text.height(DEFAULT_TITLE_HEIGHT);
            Text.fontColor(TITLE_FONT_COLOR);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(TITLE_LAYOUT_WEIGHT);
            Text.clip(true);
            Text.margin({ top: LengthMetrics.px(DEFAULT_MARGIN_TOP_DISTANCE) });
            Text.padding({ start: LengthMetrics.px(DEFAULT_PADDING_START_DISTANCE) });
            Text.textAlign(this.isRTL() ? TextAlign.End : TextAlign.Start);
        }, Text);
        Text.pop();
    }
    isShowMenus() {
        return this.mode === NavigationMode.Stack && this.currentBreakPoint !== BREAK_POINT_SM;
    }
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
                        SideBarContainer.create(this.currentBreakPoint === BREAK_POINT_LG ? SideBarContainerType.Embed :
                            SideBarContainerType.Overlay);
                        SideBarContainer.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
                        SideBarContainer.sideBarWidth(this.sideBarAttribute.sideBarWidth);
                        SideBarContainer.minContentWidth(this.sideBarAttribute.z1);
                        SideBarContainer.minSideBarWidth(this.sideBarAttribute.minSideBarWidth);
                        SideBarContainer.maxSideBarWidth(this.sideBarAttribute.maxSideBarWidth);
                        SideBarContainer.showControlButton(false);
                        SideBarContainer.showSideBar(this.sideBarAttribute.showSideBar);
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
                        Navigation.create(this.navPathStack, { moduleName: '__harDefaultModuleName__', pagePath: '', isUserCreateStack: true });
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
                    SideBarContainer.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Navigation.create(this.navPathStack, { moduleName: '__harDefaultModuleName__', pagePath: '', isUserCreateStack: true });
                        Navigation.title((this.titleOptions?.titleIcon || (this.titleOptions?.titleBarType && !this.title)) ? { builder: () => {
                                this.titleBuilder.call(this);
                            } } : { builder: () => {
                                this.defaultTitleBuilder.call(this);
                            } }, this.getTitleOption());
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
    drawGradientCanvasHalf(context, primaryColor, secondaryColor) {
        let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
        let c1 = context.createLinearGradient(COORDINATE_NEGATIVE_ONE * this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT,
            height, this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, 0);
        let d1 = context.createLinearGradient(this.navigationWidth * COLOR_RATIO_ONE_FIFTY_PERCENT,
            height, this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, 0);
        c1.addColorStop(0, this.resourceColorToString(primaryColor));
        c1.addColorStop(COLOR_RATIO_FIFTY_PERCENT, this.resourceColorToString(primaryColor));
        c1.addColorStop(1, this.resourceColorToString(secondaryColor));
        d1.addColorStop(0, this.resourceColorToString(primaryColor));
        d1.addColorStop(COLOR_RATIO_FIFTY_PERCENT, this.resourceColorToString(primaryColor));
        d1.addColorStop(1, this.resourceColorToString(secondaryColor));
        context.fillStyle = c1;
        context.fillRect(0, 0, this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, height);
        context.fillStyle = d1;
        context.fillRect(this.navigationWidth * COLOR_RATIO_FIFTY_PERCENT, 0, this.navigationWidth, height);
    }
    drawGradientCanvasCross(context, primaryColor, secondaryColor) {
        let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
        let u = context.createLinearGradient(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, 0);
        u.addColorStop(0, this.resourceColorToString(primaryColor));
        u.addColorStop(COLOR_RATIO_FIFTY_PERCENT, this.resourceColorToString(primaryColor));
        u.addColorStop(1, this.resourceColorToString(secondaryColor));
        context.fillStyle = u;
        context.fillRect(0, 0, COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, height);
        let y1 = (COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth) > 0 ?
            COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth : 0;
        let a1 = context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, y1, this.navigationWidth, height * COLOR_RATIO_FIFTY_PERCENT);
        a1.addColorStop(0, this.resourceColorToString(secondaryColor));
        a1.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(secondaryColor));
        a1.addColorStop(1, this.resourceColorToString(primaryColor));
        context.fillStyle = a1;
        context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth - RECTANGLE_OUTSIDE_OFFSET_ONE, 0,
            this.navigationWidth * COLOR_RATIO_THIRTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE,
            height * COLOR_RATIO_FIFTY_PERCENT + RECTANGLE_OUTSIDE_OFFSET_ONE);
        let y2 = (COLOR_RATIO_FIFTY_PERCENT * height - COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth) > 0 ?
            COLOR_RATIO_FIFTY_PERCENT * height + COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth : height;
        let b1 = context.createLinearGradient(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth, y2, this.navigationWidth, height * COLOR_RATIO_FIFTY_PERCENT);
        b1.addColorStop(0, this.resourceColorToString(secondaryColor));
        b1.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(secondaryColor));
        b1.addColorStop(1, this.resourceColorToString(primaryColor));
        context.fillStyle = b1;
        context.fillRect(COLOR_RATIO_SEVENTY_PERCENT * this.navigationWidth - RECTANGLE_OUTSIDE_OFFSET_ONE,
            height * COLOR_RATIO_FIFTY_PERCENT, COLOR_RATIO_THIRTY_PERCENT * this.navigationWidth + RECTANGLE_OUTSIDE_OFFSET_ONE,
            height * COLOR_RATIO_FIFTY_PERCENT);
    }
    drawGradientCanvasTowards(context, primaryColor, secondaryColor) {
        let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
        let t = context.createLinearGradient(0, 0, this.navigationWidth, height);
        t.addColorStop(0, this.resourceColorToString(primaryColor));
        t.addColorStop(COLOR_RATIO_FORTY_PERCENT, this.resourceColorToString(primaryColor));
        t.addColorStop(1, this.resourceColorToString(secondaryColor));
        context.fillStyle = t;
        context.fillRect(0, 0, this.navigationWidth, height);
    }
    drawTransparentGradient(context, backgroundTheme) {
        let height = this.navigationHeight * COLOR_RATIO_THIRTY_PERCENT;
        let o = context.createLinearGradient(0, 0, 0, height);
        o.addColorStop(0, backGroundTransparentGradientColor[backgroundTheme - 1][0]);
        o.addColorStop(1, backGroundTransparentGradientColor[backgroundTheme - 1][1]);
        context.fillStyle = o;
        context.fillRect(0, 0, this.navigationWidth + RECTANGLE_OUTSIDE_OFFSET_ONE, height +
            RECTANGLE_OUTSIDE_OFFSET_ONE);
        if (backgroundTheme === BackgroundTheme.DARK) {
            context.fillStyle = Color.Black;
            context.fillRect(0, height, this.navigationWidth, this.navigationHeight - height);
        }
    }
    drawSingleGradient(context, primaryColor, backgroundColor) {
        let height = this.navigationHeight * COLOR_RATIO_SIXTY_PERCENT;
        let m = context.createLinearGradient(0, 0, 0, height);
        m.addColorStop(0, this.resourceColorToString(primaryColor));
        m.addColorStop(1, backgroundColor);
        context.fillStyle = m;
        context.fillRect(0, 0, this.navigationWidth, height);
        if (backgroundColor === backGroundColor[0]) {
            context.fillStyle = Color.Black;
            context.fillRect(0, height, this.navigationWidth, this.navigationHeight * (1 - COLOR_RATIO_SIXTY_PERCENT));
        }
    }
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
    getTitleOption() {
        return {
            backgroundColor: this.titleOptions?.backgroundColor,
            backgroundBlurStyle: this.titleOptions?.isBlurEnabled ? BlurStyle.COMPONENT_THICK : BlurStyle.NONE,
            barStyle: this.titleOptions?.barStyle
        };
    }
    changeSideBarWithAnimation(j) {
        Context.animateTo({
            duration: 500,
            curve: curves.cubicBezierCurve(0.2, 0.2, 0.1, 1),
            onFinish: () => {
                this.showMaskLayer = j;
            }
        }, () => {
            if (this.sideBarHelper) {
                this.sideBarHelper.a2(j);
            }
            this.showMaskLayer = true;
        });
    }
    rerender() {
        this.updateDirtyElements();
    }
}
let sideBarAttributeSet = class sideBarAttributeSet {
    constructor() {
        this.sideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        this.minSideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        this.maxSideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        this.z1 = SIDE_BAR_COMMON_WIDTH;
        this.showSideBar = false;
    }
};
sideBarAttributeSet = __decorate([
    Observed
], sideBarAttributeSet);
class SideBarHelper {
    constructor() {
        this.b2 = false;
    }
    v1(listener) {
        this.listener = listener;
    }
    c2() {
        this.listener = undefined;
    }
    isShowSideBar() {
        return this.b2;
    }
    a2(value) {
        this.b2 = value;
        if (this.listener) {
            this.listener(value);
        }
    }
    w1(i, layout) {
        if (i === BREAK_POINT_LG) {
            this.d2(layout);
        } else {
            this.e2(layout);
        }
    }
    e2(layout) {
        layout.sideBarWidth = SIDE_BAR_OVERLAY_WIDTH;
        layout.z1 = '100%';
    }
    d2(layout) {
        layout.sideBarWidth = SIDE_BAR_EMBED_MIN_WIDTH;
        layout.z1 = CONTENT_MIN_WIDTH;
    }
}
export let TitleBarType;
(function (TitleBarType) {
    TitleBarType.SQUARED_ICON = 1;
    TitleBarType.ROUND_ICON = 2;
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