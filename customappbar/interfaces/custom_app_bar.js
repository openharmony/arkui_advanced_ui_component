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

const curves = requireNativeModule('ohos.curves');
const display = requireNapi('display');
const mediaquery = requireNapi('mediaquery');
const LengthMetrics = requireNapi('arkui.node').LengthMetrics;
const systemParameterEnhance = requireNapi('systemParameterEnhance');
const LOG_TAG = 'CustomAppBar';
const VIEW_WIDTH = 80;
const VIEW_HEIGHT = 36;
const BUTTON_SIZE = 40;
const IMAGE_SIZE = '20vp';
const MENU_RADIUS = '20vp';
const DIVIDER_HEIGHT = '16vp';
const BORDER_WIDTH = '1px';
const VIEW_MARGIN_RIGHT = 8;
const ICON_SIZE = 27;
const ICON_FILL_COLOR_DEFAULT = '#182431';
const BORDER_COLOR_DEFAULT = '#33000000';
const MENU_BACK_COLOR = '#99FFFFFF';
const MENU_BACK_BLUR = 5;
const MENU_MARGIN_TOP = 10;
const SM_MENU_MARGIN_END = 16;
const MD_MENU_MARGIN_END = 24;
const LG_MENU_MARGIN_END = 32;
// 半屏参数
const BUTTON_IMAGE_SIZE = 18;
const HALF_CONTAINER_BORDER_SIZE = 32;
const HALF_BUTTON_BACK_COLOR = '#0D000000';
const HALF_BUTTON_IMAGE_COLOR = '#0C000000';
const HALF_MENU_MARGIN = 16;
const EYELASH_HEIGHT = 36;
const CHEVRON_HEIGHT = 20;
const CHEVRON_WIDTH = 10;
const CHEVRON_MARGIN = 4;
const TITLE_FONT_SIZE = 14;
const TITLE_LINE_HEIGHT = 16;
const TITLE_MARGIN_RIGHT = 12;
const TITLE_MARGIN_TOP = 8;
const TITLE_LABEL_MARGIN = 8.5;
const TITLE_TEXT_MARGIN = 3;
const TITLE_CONSTRAINT_SIZE = 'calc(100% - 73.5vp)';
const MD_WIDTH = 480;
const LG_WIDTH_LIMIT = 0.6;
const LG_WIDTH_HEIGHT_RATIO = 1.95;
const ARKUI_APP_BAR_COLOR_CONFIGURATION = 'arkui_app_bar_color_configuration';
const ARKUI_APP_BAR_MENU_SAFE_AREA = 'arkui_app_bar_menu_safe_area';
const ARKUI_APP_BAR_CONTENT_SAFE_AREA = 'arkui_app_bar_content_safe_area';
const ARKUI_APP_BAR_BAR_INFO = 'arkui_app_bar_info';
const ARKUI_APP_BAR_SCREEN = 'arkui_app_bar_screen';
const ARKUI_APP_BG_COLOR = 'arkui_app_bg_color';
const EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK = 'arkui_custom_app_bar_menu_click';
const EVENT_NAME_CUSTOM_APP_BAR_CLOSE_CLICK = 'arkui_custom_app_bar_close_click';
const EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD = 'arkui_custom_app_bar_did_build';
const EVENT_NAME_CUSTOM_APP_BAR_CREATE_SERVICE_PANEL = 'arkui_custom_app_bar_create_service_panel';
const ARKUI_APP_BAR_SERVICE_PANEL = 'arkui_app_bar_service_panel';
const ARKUI_APP_BAR_CLOSE = 'arkui_app_bar_close';
const ARKUI_APP_BAR_PROVIDE_SERVICE = 'arkui_app_bar_provide_service';
const ARKUI_APP_BAR_MAXIMIZE = 'arkui_app_bar_maximize';

/**
 * 适配不同颜色模式集合
 */
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
    [HALF_BUTTON_BACK_COLOR, new ColorGroup('#0D000000', '#19FFFFFF')],
    [HALF_BUTTON_IMAGE_COLOR, new ColorGroup('#000000', '#FFFFFF')]
]);
export class CustomAppBar extends ViewPU {
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
        this.__closeFillColor = new ObservedPropertySimplePU(this.getResourceColor(ICON_FILL_COLOR_DEFAULT), this, 'closeFillColor');
        this.__menubarBorderColor = new ObservedPropertySimplePU(this.getResourceColor(BORDER_COLOR_DEFAULT), this, 'menubarBorderColor');
        this.__menubarBackColor = new ObservedPropertySimplePU(this.getResourceColor(MENU_BACK_COLOR), this, 'menubarBackColor');
        this.__dividerBackgroundColor = new ObservedPropertySimplePU(this.getResourceColor(BORDER_COLOR_DEFAULT), this, 'dividerBackgroundColor');
        this.__halfButtonBackColor = new ObservedPropertySimplePU(this.getResourceColor(HALF_BUTTON_BACK_COLOR), this, 'halfButtonBackColor');
        this.__halfButtonImageColor = new ObservedPropertySimplePU(this.getResourceColor(HALF_BUTTON_IMAGE_COLOR), this, 'halfButtonImageColor');
        this.__contentMarginTop = new ObservedPropertySimplePU(0, this, 'contentMarginTop');
        this.__contentMarginLeft = new ObservedPropertySimplePU(0, this, 'contentMarginLeft');
        this.__contentMarginRight = new ObservedPropertySimplePU(0, this, 'contentMarginRight');
        this.__contentMarginBottom = new ObservedPropertySimplePU(0, this, 'contentMarginBottom');
        this.__menuMarginEnd = new ObservedPropertySimplePU(SM_MENU_MARGIN_END, this, 'menuMarginEnd');
        this.__isHalfScreen = new ObservedPropertySimplePU(true, this, 'isHalfScreen');
        this.__containerHeight = new ObservedPropertySimplePU('0%', this, 'containerHeight');
        this.__containerWidth = new ObservedPropertySimplePU('100%', this, 'containerWidth');
        this.__stackHeight = new ObservedPropertySimplePU('100%', this, 'stackHeight');
        this.__titleOpacity = new ObservedPropertySimplePU(0, this, 'titleOpacity');
        this.__buttonOpacity = new ObservedPropertySimplePU(1, this, 'buttonOpacity');
        this.__titleHeight = new ObservedPropertySimplePU(0, this, 'titleHeight');
        this.__titleOffset = new ObservedPropertySimplePU(0, this, 'titleOffset');
        this.__maskOpacity = new ObservedPropertySimplePU(0, this, 'maskOpacity');
        this.__maskBlurScale = new ObservedPropertySimplePU(0, this, 'maskBlurScale');
        this.__contentBgColor = new ObservedPropertyObjectPU('#FFFFFFFF', this, 'contentBgColor');
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, 'statusBarHeight');
        this.__ratio = new ObservedPropertyObjectPU(undefined, this, 'ratio');
        this.__breakPoint = new ObservedPropertySimplePU(BreakPointsType.NONE, this, 'breakPoint');
        this.__serviceMenuRead = new ObservedPropertySimplePU(this.getStringByResourceToken(ARKUI_APP_BAR_SERVICE_PANEL), this, 'serviceMenuRead');
        this.__closeRead = new ObservedPropertySimplePU(this.getStringByResourceToken(ARKUI_APP_BAR_CLOSE), this, 'closeRead');
        this.__maximizeRead = new ObservedPropertySimplePU(this.getStringByResourceToken(ARKUI_APP_BAR_MAXIMIZE), this, 'maximizeRead');
        this.__provideService = new ObservedPropertySimplePU('', this, 'provideService');
        this.__labelName = new ObservedPropertySimplePU('', this, 'labelName');
        this.isHalfToFullScreen = false;
        this.isDark = true;
        this.bundleName = '';
        this.icon = { 'id': -1, 'type': 20000, params: ['sys.media.ohos_app_icon'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
        this.fullContentMarginTop = 0;
        this.deviceBorderRadius = '0';
        this.smListener = mediaquery.matchMediaSync('(0vp<width) and (width<600vp)');
        this.mdListener = mediaquery.matchMediaSync('(600vp<=width) and (width<840vp)');
        this.lgListener = mediaquery.matchMediaSync('(840vp<=width)');
        this.setInitiallyProvidedValue(params);
        this.declareWatch('breakPoint', this.onBreakPointChange);
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
        if (params.closeFillColor !== undefined) {
            this.closeFillColor = params.closeFillColor;
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
        if (params.halfButtonBackColor !== undefined) {
            this.halfButtonBackColor = params.halfButtonBackColor;
        }
        if (params.halfButtonImageColor !== undefined) {
            this.halfButtonImageColor = params.halfButtonImageColor;
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
        if (params.menuMarginEnd !== undefined) {
            this.menuMarginEnd = params.menuMarginEnd;
        }
        if (params.isHalfScreen !== undefined) {
            this.isHalfScreen = params.isHalfScreen;
        }
        if (params.containerHeight !== undefined) {
            this.containerHeight = params.containerHeight;
        }
        if (params.containerWidth !== undefined) {
            this.containerWidth = params.containerWidth;
        }
        if (params.stackHeight !== undefined) {
            this.stackHeight = params.stackHeight;
        }
        if (params.titleOpacity !== undefined) {
            this.titleOpacity = params.titleOpacity;
        }
        if (params.buttonOpacity !== undefined) {
            this.buttonOpacity = params.buttonOpacity;
        }
        if (params.titleHeight !== undefined) {
            this.titleHeight = params.titleHeight;
        }
        if (params.titleOffset !== undefined) {
            this.titleOffset = params.titleOffset;
        }
        if (params.maskOpacity !== undefined) {
            this.maskOpacity = params.maskOpacity;
        }
        if (params.maskBlurScale !== undefined) {
            this.maskBlurScale = params.maskBlurScale;
        }
        if (params.contentBgColor !== undefined) {
            this.contentBgColor = params.contentBgColor;
        }
        if (params.statusBarHeight !== undefined) {
            this.statusBarHeight = params.statusBarHeight;
        }
        if (params.ratio !== undefined) {
            this.ratio = params.ratio;
        }
        if (params.breakPoint !== undefined) {
            this.breakPoint = params.breakPoint;
        }
        if (params.serviceMenuRead !== undefined) {
            this.serviceMenuRead = params.serviceMenuRead;
        }
        if (params.closeRead !== undefined) {
            this.closeRead = params.closeRead;
        }
        if (params.maximizeRead !== undefined) {
            this.maximizeRead = params.maximizeRead;
        }
        if (params.provideService !== undefined) {
            this.provideService = params.provideService;
        }
        if (params.isHalfToFullScreen !== undefined) {
            this.isHalfToFullScreen = params.isHalfToFullScreen;
        }
        if (params.isDark !== undefined) {
            this.isDark = params.isDark;
        }
        if (params.bundleName !== undefined) {
            this.bundleName = params.bundleName;
        }
        if (params.labelName !== undefined) {
            this.labelName = params.labelName;
        }
        if (params.icon !== undefined) {
            this.icon = params.icon;
        }
        if (params.fullContentMarginTop !== undefined) {
            this.fullContentMarginTop = params.fullContentMarginTop;
        }
        if (params.deviceBorderRadius !== undefined) {
            this.deviceBorderRadius = params.deviceBorderRadius;
        }
        if (params.smListener !== undefined) {
            this.smListener = params.smListener;
        }
        if (params.mdListener !== undefined) {
            this.mdListener = params.mdListener;
        }
        if (params.lgListener !== undefined) {
            this.lgListener = params.lgListener;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__menuResource.purgeDependencyOnElmtId(rmElmtId);
        this.__closeResource.purgeDependencyOnElmtId(rmElmtId);
        this.__menuFillColor.purgeDependencyOnElmtId(rmElmtId);
        this.__closeFillColor.purgeDependencyOnElmtId(rmElmtId);
        this.__menubarBorderColor.purgeDependencyOnElmtId(rmElmtId);
        this.__menubarBackColor.purgeDependencyOnElmtId(rmElmtId);
        this.__dividerBackgroundColor.purgeDependencyOnElmtId(rmElmtId);
        this.__halfButtonBackColor.purgeDependencyOnElmtId(rmElmtId);
        this.__halfButtonImageColor.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginTop.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginLeft.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginRight.purgeDependencyOnElmtId(rmElmtId);
        this.__contentMarginBottom.purgeDependencyOnElmtId(rmElmtId);
        this.__menuMarginEnd.purgeDependencyOnElmtId(rmElmtId);
        this.__isHalfScreen.purgeDependencyOnElmtId(rmElmtId);
        this.__containerHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__containerWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__stackHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__titleOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__buttonOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__titleHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__titleOffset.purgeDependencyOnElmtId(rmElmtId);
        this.__maskOpacity.purgeDependencyOnElmtId(rmElmtId);
        this.__maskBlurScale.purgeDependencyOnElmtId(rmElmtId);
        this.__contentBgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__statusBarHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__ratio.purgeDependencyOnElmtId(rmElmtId);
        this.__breakPoint.purgeDependencyOnElmtId(rmElmtId);
        this.__serviceMenuRead.purgeDependencyOnElmtId(rmElmtId);
        this.__closeRead.purgeDependencyOnElmtId(rmElmtId);
        this.__maximizeRead.purgeDependencyOnElmtId(rmElmtId);
        this.__provideService.purgeDependencyOnElmtId(rmElmtId);
        this.__labelName.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__menuResource.aboutToBeDeleted();
        this.__closeResource.aboutToBeDeleted();
        this.__menuFillColor.aboutToBeDeleted();
        this.__closeFillColor.aboutToBeDeleted();
        this.__menubarBorderColor.aboutToBeDeleted();
        this.__menubarBackColor.aboutToBeDeleted();
        this.__dividerBackgroundColor.aboutToBeDeleted();
        this.__halfButtonBackColor.aboutToBeDeleted();
        this.__halfButtonImageColor.aboutToBeDeleted();
        this.__contentMarginTop.aboutToBeDeleted();
        this.__contentMarginLeft.aboutToBeDeleted();
        this.__contentMarginRight.aboutToBeDeleted();
        this.__contentMarginBottom.aboutToBeDeleted();
        this.__menuMarginEnd.aboutToBeDeleted();
        this.__isHalfScreen.aboutToBeDeleted();
        this.__containerHeight.aboutToBeDeleted();
        this.__containerWidth.aboutToBeDeleted();
        this.__stackHeight.aboutToBeDeleted();
        this.__titleOpacity.aboutToBeDeleted();
        this.__buttonOpacity.aboutToBeDeleted();
        this.__titleHeight.aboutToBeDeleted();
        this.__titleOffset.aboutToBeDeleted();
        this.__maskOpacity.aboutToBeDeleted();
        this.__maskBlurScale.aboutToBeDeleted();
        this.__contentBgColor.aboutToBeDeleted();
        this.__statusBarHeight.aboutToBeDeleted();
        this.__ratio.aboutToBeDeleted();
        this.__breakPoint.aboutToBeDeleted();
        this.__serviceMenuRead.aboutToBeDeleted();
        this.__closeRead.aboutToBeDeleted();
        this.__maximizeRead.aboutToBeDeleted();
        this.__provideService.aboutToBeDeleted();
        this.__labelName.aboutToBeDeleted();
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
    get closeFillColor() {
        return this.__closeFillColor.get();
    }
    set closeFillColor(newValue) {
        this.__closeFillColor.set(newValue);
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
    get halfButtonBackColor() {
        return this.__halfButtonBackColor.get();
    }
    set halfButtonBackColor(newValue) {
        this.__halfButtonBackColor.set(newValue);
    }
    get halfButtonImageColor() {
        return this.__halfButtonImageColor.get();
    }
    set halfButtonImageColor(newValue) {
        this.__halfButtonImageColor.set(newValue);
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
    get menuMarginEnd() {
        return this.__menuMarginEnd.get();
    }
    set menuMarginEnd(newValue) {
        this.__menuMarginEnd.set(newValue);
    }
    get isHalfScreen() {
        return this.__isHalfScreen.get();
    }
    set isHalfScreen(newValue) {
        this.__isHalfScreen.set(newValue);
    }
    get containerHeight() {
        return this.__containerHeight.get();
    }
    set containerHeight(newValue) {
        this.__containerHeight.set(newValue);
    }
    get containerWidth() {
        return this.__containerWidth.get();
    }
    set containerWidth(newValue) {
        this.__containerWidth.set(newValue);
    }
    get stackHeight() {
        return this.__stackHeight.get();
    }
    set stackHeight(newValue) {
        this.__stackHeight.set(newValue);
    }
    get titleOpacity() {
        return this.__titleOpacity.get();
    }
    set titleOpacity(newValue) {
        this.__titleOpacity.set(newValue);
    }
    get buttonOpacity() {
        return this.__buttonOpacity.get();
    }
    set buttonOpacity(newValue) {
        this.__buttonOpacity.set(newValue);
    }
    get titleHeight() {
        return this.__titleHeight.get();
    }
    set titleHeight(newValue) {
        this.__titleHeight.set(newValue);
    }
    get titleOffset() {
        return this.__titleOffset.get();
    }
    set titleOffset(newValue) {
        this.__titleOffset.set(newValue);
    }
    get maskOpacity() {
        return this.__maskOpacity.get();
    }
    set maskOpacity(newValue) {
        this.__maskOpacity.set(newValue);
    }
    get maskBlurScale() {
        return this.__maskBlurScale.get();
    }
    set maskBlurScale(newValue) {
        this.__maskBlurScale.set(newValue);
    }
    get contentBgColor() {
        return this.__contentBgColor.get();
    }
    set contentBgColor(newValue) {
        this.__contentBgColor.set(newValue);
    }
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(newValue) {
        this.__statusBarHeight.set(newValue);
    }
    get ratio() {
        return this.__ratio.get();
    }
    set ratio(newValue) {
        this.__ratio.set(newValue);
    }
    get breakPoint() {
        return this.__breakPoint.get();
    }
    set breakPoint(newValue) {
        this.__breakPoint.set(newValue);
    }
    get serviceMenuRead() {
        return this.__serviceMenuRead.get();
    }
    set serviceMenuRead(newValue) {
        this.__serviceMenuRead.set(newValue);
    }
    get closeRead() {
        return this.__closeRead.get();
    }
    set closeRead(newValue) {
        this.__closeRead.set(newValue);
    }
    get maximizeRead() {
        return this.__maximizeRead.get();
    }
    set maximizeRead(newValue) {
        this.__maximizeRead.set(newValue);
    }
    get provideService() {
        return this.__provideService.get();
    }
    set provideService(newValue) {
        this.__provideService.set(newValue);
    }
    get labelName() {
        return this.__labelName.get();
    }
    set labelName(newValue) {
        this.__labelName.set(newValue);
    }
    aboutToAppear() {
        if (this.isHalfScreen) {
            this.contentBgColor = Color.Transparent;
            this.titleHeight = EYELASH_HEIGHT + 2 * TITLE_MARGIN_TOP + this.statusBarHeight;
            this.halfScreenShowAnimation();
        }
        else {
            this.containerHeight = '100%';
            this.containerWidth = '100%';
        }
        this.updateStringByResource();
        this.getDeviceRadiusConfig();
    }
    aboutToDisappear() {
        this.smListener.off('change');
        this.mdListener.off('change');
        this.lgListener.off('change');
    }
    getDeviceRadiusConfig() {
        try {
          this.deviceBorderRadius = systemParameterEnhance.getSync('const.product.device_radius');
          console.info(LOG_TAG, `read device_radius success, device_radius: ${this.deviceBorderRadius}`);
        } catch (error) {
          console.error(LOG_TAG, `read device_radius failed`);
        }
    }
    initBreakPointListener() {
        this.smListener.on('change', (mediaQueryResult) => {
            if (mediaQueryResult.matches) {
                this.breakPoint = BreakPointsType.SM;
            }
        });
        this.mdListener.on('change', (mediaQueryResult) => {
            if (mediaQueryResult.matches) {
                this.breakPoint = BreakPointsType.MD;
            }
        });
        this.lgListener.on('change', (mediaQueryResult) => {
            if (mediaQueryResult.matches) {
                this.breakPoint = BreakPointsType.LG;
            }
        });
    }
    onBreakPointChange() {
        if (menuMarginEndMap.has(this.breakPoint)) {
            this.menuMarginEnd = menuMarginEndMap.get(this.breakPoint);
        }
        if (this.isHalfScreen) {
            if (this.breakPoint === BreakPointsType.SM) {
                this.containerWidth = '100%';
            }
            else if (this.breakPoint === BreakPointsType.MD) {
                this.containerWidth = MD_WIDTH;
            }
            else if (this.breakPoint === BreakPointsType.LG) {
                let displayData = display.getDefaultDisplaySync();
                let windowWidth = px2vp(displayData.width);
                let windowHeight = px2vp(displayData.height);
                this.containerWidth = windowWidth > windowHeight ? windowHeight * LG_WIDTH_LIMIT : windowWidth * LG_WIDTH_LIMIT;
            }
        }
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
    getStringByResourceToken(resName, value) {
        try {
            if (value) {
                return getContext(this).resourceManager.getStringByNameSync(resName, value);
            }
            return getContext(this).resourceManager.getStringByNameSync(resName);
        } catch (err) {
            console.error(LOG_TAG, `getAccessibilityDescription, error: ${err.toString()}`);
        }
        return '';
    }
    updateStringByResource() {
        if (this.isHalfScreen) {
          this.provideService = this.getStringByResourceToken(ARKUI_APP_BAR_PROVIDE_SERVICE, this.labelName);
          this.maximizeRead = this.getStringByResourceToken(ARKUI_APP_BAR_MAXIMIZE);
        }
        this.closeRead = this.getStringByResourceToken(ARKUI_APP_BAR_CLOSE);
        this.serviceMenuRead = this.getStringByResourceToken(ARKUI_APP_BAR_SERVICE_PANEL);
      }
    /**
     * atomicservice侧的事件变化回调
     * @param eventName 事件名称
     * @param param 事件参数
     */
    setCustomCallback(eventName, param) {
        if (param === null || param === '' || param === undefined) {
            console.error(LOG_TAG, 'invalid params');
            return;
        }
        if (eventName === ARKUI_APP_BAR_COLOR_CONFIGURATION) {
            this.onColorConfigurationUpdate(this.parseBoolean(param));
        }
        else if (eventName === ARKUI_APP_BAR_MENU_SAFE_AREA) {
            if (this.statusBarHeight === px2vp(Number(param))) {
                return;
            }
            this.statusBarHeight = Number(param);
            this.titleHeight = EYELASH_HEIGHT + 2 * TITLE_MARGIN_TOP + this.statusBarHeight;
        }
        else if (eventName === ARKUI_APP_BAR_CONTENT_SAFE_AREA) {
            //top left right bottom
            let splitArray = param.split('|');
            if (splitArray.length < 4) {
                return;
            }
            this.contentMarginTop = this.isHalfScreen ? 0 : Number(splitArray[0]);
            this.fullContentMarginTop = Number(splitArray[0]);
            this.contentMarginLeft = Number(splitArray[1]);
            this.contentMarginRight = Number(splitArray[2]);
            this.contentMarginBottom = Number(splitArray[3]);
        }
        else if (eventName === ARKUI_APP_BAR_BAR_INFO) {
            let splitArray = param.split('|');
            if (splitArray.length < 2) {
                return;
            }
            this.bundleName = splitArray[0];
            this.labelName = splitArray[1];
            this.updateStringByResource();
        }
        else if (eventName === ARKUI_APP_BAR_SCREEN) {
            this.isHalfScreen = this.parseBoolean(param);
            this.initBreakPointListener();
        }
        else if (eventName === ARKUI_APP_BG_COLOR) {
            this.contentBgColor = param;
        }
    }
    /**
     * 颜色变化设置
     * @param isDark 是否是深色模式
     */
    onColorConfigurationUpdate(isDark) {
        this.isDark = isDark;
        this.menuFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
        this.closeFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
        this.menubarBorderColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
        this.dividerBackgroundColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
        this.menubarBackColor = this.getResourceColor(MENU_BACK_COLOR);
        this.halfButtonBackColor = this.getResourceColor(HALF_BUTTON_BACK_COLOR);
        this.halfButtonImageColor = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
    }
    /**
     * 标题栏图标回调
     * @param pixelMap
     */
    setAppIcon(pixelMap) {
        this.icon = pixelMap;
    }
    /**
     * 服务面板按钮点击回调
     */
    onMenuButtonClick() {
        ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK);
    }
    /**
     * 关闭按钮点击回调
     */
    onCloseButtonClick() {
        ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_CLOSE_CLICK);
    }
    /**
     * 点击title栏
     */
    onEyelashTitleClick() {
        let info = {
            'bundleName':'com.huawei.hmos.asde',
            'abilityName':'PanelAbility',
            'params':[
                `bundleName:${this.bundleName}`,
                'abilityName:MainAbility',
                'module:entry',
                'pageName:DETAIL',
                'ability.want.params.uiExtensionType:sysDialog/atomicServicePanel'
            ]
        };
        ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_CREATE_SERVICE_PANEL, info);
    }
    /**
     * 触发构建回调
     */
    onDidBuild() {
        ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD);
    }
    /**
     * 半屏拉起动效
     */
    halfScreenShowAnimation() {
        Context.animateTo({
            duration: 250,
            curve: Curve.Sharp,
        }, () => {
            this.maskOpacity = 0.3;
            this.maskBlurScale = 1;
        });
        Context.animateTo({
            duration: 250,
            curve: curves.interpolatingSpring(0, 1, 328, 36),
        }, () => {
            this.containerHeight = '100%';
            this.ratio = this.breakPoint === BreakPointsType.LG ? 1 / LG_WIDTH_HEIGHT_RATIO : undefined;
        });
        // 标题栏渐显
        Context.animateTo({
            duration: 100,
            curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
        }, () => {
            this.titleOpacity = 1;
        });
    }
    /**
     * 半屏放大至全屏动效
     */
    expendContainerAnimation() {
        Context.animateTo({
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
        Context.animateTo({
            duration: 100,
            curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
        }, () => {
            this.titleOpacity = 0;
        });
    }
    /**
     * 嵌入式关闭动效
     */
    closeContainerAnimation() {
        if (this.isHalfScreen) {
            this.closeHalfContainerAnimation();
            return;
        }
        if (this.isHalfToFullScreen) {
            // 关闭弹框
            Context.animateTo({
                duration: 250,
                curve: curves.interpolatingSpring(0, 1, 328, 36),
                onFinish: () => {
                    this.onCloseButtonClick();
                }
            }, () => {
                this.stackHeight = '0%';
            });
        }
        else {
            this.onCloseButtonClick();
        }
    }
    closeHalfContainerAnimation() {
        // 关闭弹框
        Context.animateTo({
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
        Context.animateTo({
            duration: 250,
            curve: Curve.Sharp,
        }, () => {
            this.maskOpacity = 0;
            this.maskBlurScale = 0;
        });
        // 标题栏渐隐
        Context.animateTo({
            duration: 100,
            curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
        }, () => {
            this.titleOpacity = 0;
        });
    }
    fullScreenMenubar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.id('AtomicServiceMenubarRowId');
            Row.margin({ top: LengthMetrics.vp(this.statusBarHeight + MENU_MARGIN_TOP), end: LengthMetrics.vp(this.menuMarginEnd) });
            Row.justifyContent(FlexAlign.End);
            Row.height(VIEW_HEIGHT);
            Row.hitTestBehavior(HitTestMode.Transparent);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.borderRadius(MENU_RADIUS);
            Row.borderWidth(BORDER_WIDTH);
            Row.borderColor(this.menubarBorderColor);
            Row.backgroundColor(this.menubarBackColor);
            Row.backgroundEffect({
                radius: MENU_BACK_BLUR,
                color: this.menubarBackColor
            });
            Row.height(VIEW_HEIGHT);
            Row.width(VIEW_WIDTH);
            Row.align(Alignment.Top);
            Row.draggable(false);
            Row.geometryTransition('menubar');
            Row.id('AtomicServiceMenubarId');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.id('AtomicServiceMenuId');
            Button.type(ButtonType.Normal);
            Button.borderRadius({ topLeft: MENU_RADIUS, bottomLeft: MENU_RADIUS });
            Button.backgroundColor(Color.Transparent);
            Button.width(BUTTON_SIZE);
            Button.height(VIEW_HEIGHT);
            Button.accessibilityText(this.serviceMenuRead);
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
            Image.id('AtomicServiceMenuIconId');
            Image.width(IMAGE_SIZE);
            Image.height(IMAGE_SIZE);
            Image.fillColor(this.menuFillColor);
            Image.draggable(false);
            Image.interpolation(ImageInterpolation.High);
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.id('AtomicServiceDividerId');
            Divider.vertical(true);
            Divider.color(this.dividerBackgroundColor);
            Divider.lineCap(LineCapStyle.Round);
            Divider.strokeWidth(BORDER_WIDTH);
            Divider.height(DIVIDER_HEIGHT);
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.id('AtomicServiceCloseId');
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.borderRadius({ topRight: MENU_RADIUS, bottomRight: MENU_RADIUS });
            Button.width(BUTTON_SIZE);
            Button.height(VIEW_HEIGHT);
            Button.accessibilityText(this.closeRead);
            Gesture.create(GesturePriority.Low);
            TapGesture.create();
            TapGesture.onAction(() => {
                this.closeContainerAnimation();
            });
            TapGesture.pop();
            Gesture.pop();
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.closeResource);
            Image.id('AtomicServiceCloseIconId');
            Image.width(IMAGE_SIZE);
            Image.height(IMAGE_SIZE);
            Image.fillColor(this.closeFillColor);
            Image.draggable(false);
            Image.interpolation(ImageInterpolation.High);
        }, Image);
        Button.pop();
        Row.pop();
        Row.pop();
    }
    eyelashTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.justifyContent(FlexAlign.Start);
            Column.height(this.titleHeight);
            Column.offset({ y: this.titleOffset });
            Column.hitTestBehavior(HitTestMode.Transparent);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({
                top: LengthMetrics.vp(this.statusBarHeight + TITLE_MARGIN_TOP),
                bottom: LengthMetrics.vp(TITLE_MARGIN_TOP)
            });
            Row.opacity(this.titleOpacity);
            Row.justifyContent(FlexAlign.Start);
            Row.width('100%');
            Row.hitTestBehavior(HitTestMode.Transparent);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height(EYELASH_HEIGHT);
            ViewStackProcessor.visualState('focused');
            Row.backgroundColor('#0D000000');
            ViewStackProcessor.visualState('pressed');
            Row.backgroundColor('#1A000000');
            ViewStackProcessor.visualState('normal');
            Row.backgroundColor(Color.Transparent);
            ViewStackProcessor.visualState();
            Row.borderRadius(EYELASH_HEIGHT / 2);
            Row.onClick(() => {
                this.onEyelashTitleClick();
            });
            Row.margin({ start: LengthMetrics.vp(TITLE_MARGIN_RIGHT) });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.icon);
            Image.height(ICON_SIZE);
            Image.width(ICON_SIZE);
            Image.margin({
                start: LengthMetrics.vp(CHEVRON_MARGIN)
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.provideService);
            Text.fontSize(TITLE_FONT_SIZE);
            Text.lineHeight(TITLE_LINE_HEIGHT);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FFFFFF');
            Text.margin({ start: LengthMetrics.vp(TITLE_LABEL_MARGIN) });
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.ellipsisMode(EllipsisMode.END);
            Text.constraintSize({ maxWidth: TITLE_CONSTRAINT_SIZE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ 'id': -1, 'type': 40000, params: ['sys.symbol.chevron_right'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
            SymbolGlyph.height(CHEVRON_HEIGHT);
            SymbolGlyph.width(CHEVRON_WIDTH);
            SymbolGlyph.margin({ start: LengthMetrics.vp(CHEVRON_MARGIN), end: LengthMetrics.vp(CHEVRON_MARGIN) });
            SymbolGlyph.fontColor([Color.White]);
        }, SymbolGlyph);
        Row.pop();
        Row.pop();
        Column.pop();
    }
    halfScreenMenuBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
            Column.justifyContent(FlexAlign.End);
            Column.hitTestBehavior(HitTestMode.Transparent);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(this.containerWidth);
            Row.height(this.containerHeight);
            Row.aspectRatio(ObservedObject.GetRawObject(this.ratio));
            Row.alignItems(VerticalAlign.Top);
            Row.justifyContent(FlexAlign.End);
            Row.opacity(this.buttonOpacity);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.geometryTransition('menubar');
            Row.justifyContent(FlexAlign.End);
            Row.transition(TransitionEffect.OPACITY);
            Row.borderRadius(MENU_RADIUS);
            Row.height(BUTTON_SIZE);
            Row.margin({
                top: LengthMetrics.vp(this.titleHeight + HALF_MENU_MARGIN),
                end: LengthMetrics.vp(HALF_MENU_MARGIN)
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle });
            Button.width(BUTTON_SIZE);
            Button.height(BUTTON_SIZE);
            Button.backgroundColor(this.halfButtonBackColor);
            Button.onClick(() => {
                this.expendContainerAnimation();
            });
            Button.accessibilityText(this.maximizeRead);
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ 'id': -1, 'type': 40000, params: ['sys.symbol.arrow_up_left_and_arrow_down_right'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
            SymbolGlyph.fontSize(BUTTON_IMAGE_SIZE);
            SymbolGlyph.fontWeight(FontWeight.Medium);
            SymbolGlyph.fontColor([this.halfButtonImageColor]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle });
            Button.width(BUTTON_SIZE);
            Button.height(BUTTON_SIZE);
            Button.margin({
                start: LengthMetrics.vp(VIEW_MARGIN_RIGHT)
            });
            Button.backgroundColor(this.halfButtonBackColor);
            Button.onClick(() => {
                this.closeContainerAnimation();
            });
            Button.accessibilityText(this.closeRead);
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ 'id': -1, 'type': 40000, params: ['sys.symbol.xmark'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
            SymbolGlyph.fontSize(BUTTON_IMAGE_SIZE);
            SymbolGlyph.fontWeight(FontWeight.Medium);
            SymbolGlyph.fontColor([this.halfButtonImageColor]);
        }, SymbolGlyph);
        Button.pop();
        Row.pop();
        Row.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
            Column.justifyContent(FlexAlign.End);
            Column.backgroundColor(Color.Transparent);
            Column.hitTestBehavior(HitTestMode.Transparent);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopEnd });
            Stack.height(this.stackHeight);
            Stack.width('100%');
            Stack.backgroundColor(ObservedObject.GetRawObject(this.contentBgColor));
            Stack.hitTestBehavior(HitTestMode.Transparent);
            Stack.id('AtomicServiceContainerId');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isHalfScreen) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 透明模糊背板
                        Column.create();
                        // 透明模糊背板
                        Column.width('100%');
                        // 透明模糊背板
                        Column.height('100%');
                        // 透明模糊背板
                        Column.backgroundColor('#262626');
                        // 透明模糊背板
                        Column.opacity(this.maskOpacity);
                        // 透明模糊背板
                        Column.foregroundBlurStyle(BlurStyle.BACKGROUND_REGULAR, { scale: this.maskBlurScale });
                        // 透明模糊背板
                        Column.onClick(() => {
                            this.closeContainerAnimation();
                        });
                    }, Column);
                    // 透明模糊背板
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
            Column.justifyContent(FlexAlign.End);
            Column.hitTestBehavior(HitTestMode.Transparent);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height(this.containerHeight);
            Column.width(this.containerWidth);
            Column.aspectRatio(ObservedObject.GetRawObject(this.ratio));
            Column.justifyContent(FlexAlign.End);
            Column.hitTestBehavior(HitTestMode.Transparent);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isHalfScreen) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.eyelashTitle.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({
                top: this.contentMarginTop,
                left: this.contentMarginLeft,
                right: this.contentMarginRight,
                bottom: this.contentMarginBottom
            });
            Row.layoutWeight(1);
            Row.backgroundColor(Color.Transparent);
            Row.backgroundBlurStyle(this.isHalfScreen ? BlurStyle.COMPONENT_ULTRA_THICK : undefined);
            Row.borderRadius({
                topLeft: this.isHalfScreen ? HALF_CONTAINER_BORDER_SIZE : this.deviceBorderRadius,
                topRight: this.isHalfScreen ? HALF_CONTAINER_BORDER_SIZE : this.deviceBorderRadius,
            });
            Row.clip(true);
            Row.alignItems(VerticalAlign.Bottom);
            Row.hitTestBehavior(HitTestMode.Transparent);
            Row.width('100%');
            Row.id('AtomicServiceStageId');
        }, Row);
        Row.pop();
        Column.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isHalfScreen) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.halfScreenMenuBar.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.fullScreenMenubar.bind(this)();
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName() {
        return 'CustomAppBar';
    }
}
const BreakPointsType = {
    NONE: 'NONE',
    SM: 'SM',
    MD: 'MD',
    LG: 'LG',
};
const menuMarginEndMap = new Map([
    [BreakPointsType.NONE, SM_MENU_MARGIN_END],
    [BreakPointsType.SM, SM_MENU_MARGIN_END],
    [BreakPointsType.MD, MD_MENU_MARGIN_END],
    [BreakPointsType.LG, LG_MENU_MARGIN_END]
]);

ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadCustomAppbar(new CustomAppBar(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();