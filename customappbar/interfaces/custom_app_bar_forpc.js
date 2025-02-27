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

if (!('finalizeConstruction' in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, 'finalizeConstruction', () => { });
}
const bundleManager = requireNapi('bundle.bundleManager');
const hilog = requireNapi('hilog');
const window = requireNapi('window');
const LengthMetrics = requireNapi('arkui.node').LengthMetrics;

const BUTTON_WIDTH = 28;
const VIEW_HEIGHT = 28;
const IMAGE_SIZE = 16;
const MENU_RADIUS = 15.5;
const DIVIDER_HEIGHT = 16.5;
const DIVIDER_WIDTH = 0.5;
const MENU_BUTTON_MARGIN = 2;
const VIEW_MARGIN_TOP = 14;
const VIEW_MARGIN_RIGHT = 24;
const MENU_BACK_BLUR = 5;
const MENU_BORDER_WIDTH = '0.5px';
const ICON_FILL_COLOR_DEFAULT = '#182431';
const BORDER_COLOR_DEFAULT = '#33000000';
const MENU_BACK_COLOR = '#99FFFFFF';
const ARKUI_APP_BAR_COLOR_CONFIGURATION = 'arkui_app_bar_color_configuration';
const ARKUI_APP_BAR_CONTENT_SAFE_AREA = 'arkui_app_bar_content_safe_area';
const ARKUI_APP_BG_COLOR = 'arkui_app_bg_color';
const maximizeButtonResourceId = 125829923;
const recoverButtonResourceId = 125829925;
const EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK = 'arkui_custom_app_bar_menu_click';
const EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD = 'arkui_custom_app_bar_did_build';
const EVENT_NAME_MIN_CLICK = 'arkui_custom_min_click';
const EVENT_NAME_CLOSE_CLICK = 'arkui_custom_close_click';
const EVENT_NAME_CUSTOM_MAX_CLICK = 'arkui_custom_max_click';

class ColorGroup {
    constructor(light, dark) {
        this.light = '#000000';
        this.dark = '#FFFFFF';
        this.light = light;
        this.dark = dark;
    }
}
const colorMap = new Map([
    [ICON_FILL_COLOR_DEFAULT, new ColorGroup('#182431', '#e5ffffff')],
    [BORDER_COLOR_DEFAULT, new ColorGroup('#33182431', '#4Dffffff')],
    [MENU_BACK_COLOR, new ColorGroup('#99FFFFFF', '#33000000')],
]);
export class CustomAppBarForPC extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === 'function') {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__menuResource = new ObservedPropertyObjectPU({
            bundleName: '',
            moduleName: '',
            params: [],
            id: 125830217,
            type: 20000
        }, this, 'menuResource');
        this.__closeResource = new ObservedPropertyObjectPU({
            bundleName: '',
            moduleName: '',
            params: [],
            id: 125831084,
            type: 20000
        }, this, 'closeResource');
        this.__menuFillColor = new ObservedPropertySimplePU(this.getResourceColor(ICON_FILL_COLOR_DEFAULT), this, 'menuFillColor');
        this.__menubarBorderColor = new ObservedPropertySimplePU(this.getResourceColor(BORDER_COLOR_DEFAULT), this, 'menubarBorderColor');
        this.__menubarBackColor = new ObservedPropertySimplePU(this.getResourceColor(MENU_BACK_COLOR), this, 'menubarBackColor');
        this.__dividerBackgroundColor = new ObservedPropertySimplePU(this.getResourceColor(BORDER_COLOR_DEFAULT), this, 'dividerBackgroundColor');
        this.__contentBgColor = new ObservedPropertySimplePU('#FFFFFFFF', this, 'contentBgColor');
        this.__contentMarginTop = new ObservedPropertySimplePU('0vp', this, 'contentMarginTop');
        this.__contentMarginLeft = new ObservedPropertySimplePU('0vp', this, 'contentMarginLeft');
        this.__contentMarginRight = new ObservedPropertySimplePU('0vp', this, 'contentMarginRight');
        this.__contentMarginBottom = new ObservedPropertySimplePU('0vp', this, 'contentMarginBottom');
        this.__isAdaptPC = new ObservedPropertySimplePU(false, this, 'isAdaptPC');
        this.__maximizeResource = new ObservedPropertyObjectPU(this.getIconResource(maximizeButtonResourceId), this, 'maximizeResource');
        this.isDark = true;
        this.windowClass = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.menuResource !== undefined) {
            this.menuResource = params.menuResource;
        }
        if (params.closeResource !== undefined) {
            this.closeResource = params.closeResource;
        }
        if (params.menuFillColor !== undefined) {
            this.menuFillColor = params.menuFillColor;
        }
        if (params.menubarBorderColor !== undefined) {
            this.menubarBorderColor = params.menubarBorderColor;
        }
        if (params.menubarBackColor !== undefined) {
            this.menubarBackColor = params.menubarBackColor;
        }
        if (params.dividerBackgroundColor !== undefined) {
            this.dividerBackgroundColor = params.dividerBackgroundColor;
        }
        if (params.contentBgColor !== undefined) {
            this.contentBgColor = params.contentBgColor;
        }
        if (params.contentMarginTop !== undefined) {
            this.contentMarginTop = params.contentMarginTop;
        }
        if (params.contentMarginLeft !== undefined) {
            this.contentMarginLeft = params.contentMarginLeft;
        }
        if (params.contentMarginRight !== undefined) {
            this.contentMarginRight = params.contentMarginRight;
        }
        if (params.contentMarginBottom !== undefined) {
            this.contentMarginBottom = params.contentMarginBottom;
        }
        if (params.isAdaptPC !== undefined) {
            this.isAdaptPC = params.isAdaptPC;
        }
        if (params.maximizeResource !== undefined) {
            this.maximizeResource = params.maximizeResource;
        }
        if (params.isDark !== undefined) {
            this.isDark = params.isDark;
        }
        if (params.windowClass !== undefined) {
            this.windowClass = params.windowClass;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__menuResource.purgeDependencyOnElmtId(rmElmtId);
        this.__closeResource.purgeDependencyOnElmtId(rmElmtId);
        this.__menuFillColor.purgeDependencyOnElmtId(rmElmtId);
        this.__menubarBorderColor.purgeDependencyOnElmtId(rmElmtId);
        this.__menubarBackColor.purgeDependencyOnElmtId(rmElmtId);
        this.__dividerBackgroundColor.purgeDependencyOnElmtId(rmElmtId);
        this.__contentBgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginTop.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginLeft.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginRight.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginBottom.purgeDependencyOnElmtId(rmElmtId);
        this.__isAdaptPC.purgeDependencyOnElmtId(rmElmtId);
        this.__maximizeResource.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__menuResource.aboutToBeDeleted();
        this.__closeResource.aboutToBeDeleted();
        this.__menuFillColor.aboutToBeDeleted();
        this.__menubarBorderColor.aboutToBeDeleted();
        this.__menubarBackColor.aboutToBeDeleted();
        this.__dividerBackgroundColor.aboutToBeDeleted();
        this.__contentBgColor.aboutToBeDeleted();
        this.__contentMarginTop.aboutToBeDeleted();
        this.__contentMarginLeft.aboutToBeDeleted();
        this.__contentMarginRight.aboutToBeDeleted();
        this.__contentMarginBottom.aboutToBeDeleted();
        this.__isAdaptPC.aboutToBeDeleted();
        this.__maximizeResource.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get menuResource() {
        return this.__menuResource.get();
    }
    set menuResource(newValue) {
        this.__menuResource.set(newValue);
    }
    get closeResource() {
        return this.__closeResource.get();
    }
    set closeResource(newValue) {
        this.__closeResource.set(newValue);
    }
    get menuFillColor() {
        return this.__menuFillColor.get();
    }
    set menuFillColor(newValue) {
        this.__menuFillColor.set(newValue);
    }
    get menubarBorderColor() {
        return this.__menubarBorderColor.get();
    }
    set menubarBorderColor(newValue) {
        this.__menubarBorderColor.set(newValue);
    }
    get menubarBackColor() {
        return this.__menubarBackColor.get();
    }
    set menubarBackColor(newValue) {
        this.__menubarBackColor.set(newValue);
    }
    get dividerBackgroundColor() {
        return this.__dividerBackgroundColor.get();
    }
    set dividerBackgroundColor(newValue) {
        this.__dividerBackgroundColor.set(newValue);
    }
    get contentBgColor() {
        return this.__contentBgColor.get();
    }
    set contentBgColor(newValue) {
        this.__contentBgColor.set(newValue);
    }
    get contentMarginTop() {
        return this.__contentMarginTop.get();
    }
    set contentMarginTop(newValue) {
        this.__contentMarginTop.set(newValue);
    }
    get contentMarginLeft() {
        return this.__contentMarginLeft.get();
    }
    set contentMarginLeft(newValue) {
        this.__contentMarginLeft.set(newValue);
    }
    get contentMarginRight() {
        return this.__contentMarginRight.get();
    }
    set contentMarginRight(newValue) {
        this.__contentMarginRight.set(newValue);
    }
    get contentMarginBottom() {
        return this.__contentMarginBottom.get();
    }
    set contentMarginBottom(newValue) {
        this.__contentMarginBottom.set(newValue);
    }
    get isAdaptPC() {
        return this.__isAdaptPC.get();
    }
    set isAdaptPC(newValue) {
        this.__isAdaptPC.set(newValue);
    }
    get maximizeResource() {
        return this.__maximizeResource.get();
    }
    set maximizeResource(newValue) {
        this.__maximizeResource.set(newValue);
    }
    async aboutToAppear() {
        let bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_HAP_MODULE;
        try {
            bundleManager.getBundleInfoForSelf(bundleFlags).then((data) => {
                hilog.info(0x0000, 'testTag', 'getBundleInfoForSelf successfully. Data: %{public}s', JSON.stringify(data.hapModulesInfo[0].deviceTypes));
                let devicetype = data.hapModulesInfo[0].deviceTypes;
                for (let i = 0; i < devicetype.length; i++) {
                    if (devicetype[i] === '2in1') {
                        this.isAdaptPC = true;
                        break;
                    }
                }
            }).catch((err) => {
                hilog.error(0x0000, 'testTag', 'getBundleInfoForSelf failed. Cause: %{public}s', err.message);
            });
        }
        catch (err) {
            let message = err.message;
            hilog.error(0x0000, 'testTag', 'getBundleInfoForSelf failed: %{public}s', message);
        }
        let context = getContext(this);
        context?.windowStage?.getMainWindow().then(data => {
            this.windowClass = data;
            this.windowClass?.setWindowDecorVisible(false);
            this.windowClass?.setWindowTitleButtonVisible(false, false, false);
            this.updateMaximizeResource(this.windowClass?.getWindowStatus());
            this.windowClass?.on('windowStatusChange', (windowStatusType) => {
                console.info('windowStatusChange  windowStatusType: ' + JSON.stringify(windowStatusType));
                this.updateMaximizeResource(windowStatusType);
            });
        }).catch((err) => {
            if (err.code) {
                console.error(`Failed to obtain the main window. Cause code: ${err.code}, message: ${err.message}`);
            }
        });
    }
    updateMaximizeResource(windowStatusType) {
        if (windowStatusType === window.WindowStatusType.FULL_SCREEN ||
            windowStatusType === window.WindowStatusType.SPLIT_SCREEN) {
            this.maximizeResource = this.getIconResource(recoverButtonResourceId);
        } else {
            this.maximizeResource = this.getIconResource(maximizeButtonResourceId);
        }
    }
    aboutToDisappear() {
        this.windowClass?.off('windowStatusChange');
    }
    parseBoolean(value) {
        if (value === 'true') {
            return true;
        }
        return false;
    }
    getResourceColor(defaultColor) {
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
    setCustomCallback(eventName, param) {
        if (eventName === ARKUI_APP_BAR_COLOR_CONFIGURATION) {
            this.onColorConfigurationUpdate(this.parseBoolean(param));
        }
        else if (eventName === ARKUI_APP_BAR_CONTENT_SAFE_AREA) {
            //top left right bottom
            let splitArray = param.split('|');
            if (splitArray.length < 4) {
                return;
            }
            this.contentMarginTop = splitArray[0];
            this.contentMarginLeft = splitArray[1];
            this.contentMarginRight = splitArray[2];
            this.contentMarginBottom = splitArray[3];
        }
        else if (eventName === ARKUI_APP_BG_COLOR) {
            this.contentBgColor = param;
        }
    }
    /**
     * menu按钮点击
     */
    onMenuButtonClick() {
        ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK);
    }
    /**
     * 点击放大按钮
     */
    onMaximizeButtonClick() {
        ContainerModal.callNative(EVENT_NAME_CUSTOM_MAX_CLICK);
    }
    /**
     * 点击最小化按钮
     */
    onMinimizeButtonClick() {
        ContainerModal.callNative(EVENT_NAME_MIN_CLICK);
    }
    /**
     * 点击关闭按钮
     */
    onCloseButtonClick() {
        ContainerModal.callNative(EVENT_NAME_CLOSE_CLICK);
    }
    onDidBuild() {
        ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD);
    }
    dividerLine(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.id('AtomicServiceDividerId');
            Divider.vertical(true);
            Divider.color(this.dividerBackgroundColor);
            Divider.lineCap(LineCapStyle.Round);
            Divider.strokeWidth(DIVIDER_WIDTH);
            Divider.height(DIVIDER_HEIGHT);
        }, Divider);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
            Column.justifyContent(FlexAlign.End);
            Column.backgroundColor(this.contentBgColor);
            Column.hitTestBehavior(HitTestMode.Transparent);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopEnd });
            Stack.id('AtomicServiceContainerId');
            Stack.height('100%');
            Stack.width('100%');
            Stack.backgroundColor(Color.Transparent);
            Stack.hitTestBehavior(HitTestMode.Transparent);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                top: this.contentMarginTop,
                left: this.contentMarginLeft,
                right: this.contentMarginRight,
                bottom: this.contentMarginBottom
            });
            Row.height('100%');
            Row.width('100%');
            Row.id('AtomicServiceStageId');
            Row.backgroundColor(Color.Blue);
        }, Row);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.id('AtomicServiceMenubarRowId');
            Row.justifyContent(FlexAlign.End);
            Row.margin({ top: LengthMetrics.vp(VIEW_MARGIN_TOP), end: LengthMetrics.vp(VIEW_MARGIN_RIGHT) });
            Row.height(VIEW_HEIGHT);
            Row.hitTestBehavior(HitTestMode.Transparent);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.borderRadius(MENU_RADIUS);
            Row.borderColor(this.menubarBorderColor);
            Row.backgroundColor(this.menubarBackColor);
            Row.backdropBlur(MENU_BACK_BLUR);
            Row.borderWidth(MENU_BORDER_WIDTH);
            Row.borderColor($r('sys.color.icon_fourth'));
            Row.height(VIEW_HEIGHT);
            Row.align(Alignment.Top);
            Row.draggable(false);
            Row.id('AtomicServiceMenubarId');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.id('AtomicServiceMenuId');
            Button.type(ButtonType.Normal);
            Button.borderRadius({ topLeft: MENU_RADIUS, bottomLeft: MENU_RADIUS });
            Button.backgroundColor(Color.Transparent);
            Button.width(BUTTON_WIDTH + MENU_BUTTON_MARGIN);
            Button.height(VIEW_HEIGHT);
            Gesture.create(GesturePriority.Low);
            TapGesture.create();
            TapGesture.onAction(() => {
                this.onMenuButtonClick();
            });
            TapGesture.pop();
            Gesture.pop();
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.menuResource);
            Image.width(IMAGE_SIZE);
            Image.height(IMAGE_SIZE);
            Image.fillColor(this.menuFillColor);
            Image.draggable(false);
            Image.interpolation(ImageInterpolation.High);
            Image.margin({ start: LengthMetrics.vp(MENU_BUTTON_MARGIN) });
        }, Image);
        Button.pop();
        this.dividerLine.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isAdaptPC) {
                this.ifElseBranchUpdateFunction(0, () => {
                    if (!If.canRetake('AtomicServiceexpendId')) {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Button.createWithChild();
                            Button.id('AtomicServiceexpendId');
                            Button.type(ButtonType.Normal);
                            Button.backgroundColor(Color.Transparent);
                            Button.width(BUTTON_WIDTH);
                            Button.height(VIEW_HEIGHT);
                            Gesture.create(GesturePriority.Low);
                            TapGesture.create();
                            TapGesture.onAction(() => {
                                this.onMaximizeButtonClick();
                            });
                            TapGesture.pop();
                            Gesture.pop();
                        }, Button);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Image.create(this.maximizeResource);
                            Image.width(IMAGE_SIZE);
                            Image.height(IMAGE_SIZE);
                            Image.fillColor(this.menuFillColor);
                            Image.draggable(false);
                            Image.interpolation(ImageInterpolation.High);
                        }, Image);
                        Button.pop();
                    }
                    this.dividerLine.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.id('AtomicServiceMinusId');
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.width(BUTTON_WIDTH);
            Button.height(VIEW_HEIGHT);
            Gesture.create(GesturePriority.Low);
            TapGesture.create();
            TapGesture.onAction(() => {
                this.onMinimizeButtonClick();
            });
            TapGesture.pop();
            Gesture.pop();
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ 'id': -1, 'type': 40000, params: ['sys.symbol.minus'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
            SymbolGlyph.fontSize(IMAGE_SIZE);
            SymbolGlyph.fontColor([this.menuFillColor]);
            SymbolGlyph.draggable(false);
        }, SymbolGlyph);
        Button.pop();
        this.dividerLine.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.id('AtomicServiceCloseId');
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.borderRadius({ topRight: MENU_RADIUS, bottomRight: MENU_RADIUS });
            Button.width(BUTTON_WIDTH + MENU_BUTTON_MARGIN);
            Button.height(VIEW_HEIGHT);
            Gesture.create(GesturePriority.Low);
            TapGesture.create();
            TapGesture.onAction(() => {
                this.onCloseButtonClick();
            });
            TapGesture.pop();
            Gesture.pop();
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.closeResource);
            Image.width(IMAGE_SIZE);
            Image.height(IMAGE_SIZE);
            Image.fillColor(this.menuFillColor);
            Image.margin({ end: LengthMetrics.vp(MENU_BUTTON_MARGIN) });
            Image.draggable(false);
            Image.interpolation(ImageInterpolation.High);
        }, Image);
        Button.pop();
        Row.pop();
        Row.pop();
        Stack.pop();
        Column.pop();
    }
    onColorConfigurationUpdate(isDark) {
        this.isDark = isDark;
        this.menuFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
        this.menubarBorderColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
        this.dividerBackgroundColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
        this.menubarBackColor = this.getResourceColor(MENU_BACK_COLOR);
    }
    getIconResource(resourceId) {
        return {
            bundleName: '',
            moduleName: '',
            params: [],
            id: resourceId,
            type: 20000
        };
    }
    rerender() {
        this.updateDirtyElements();
    }
}

loadCustomAppbar(new CustomAppBarForPC(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
