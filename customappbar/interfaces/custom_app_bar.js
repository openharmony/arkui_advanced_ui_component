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
// 引入依赖文件
const commonEventManager = requireNapi('commonEventManager');
const hilog = requireNapi('hilog');
const curves = requireNativeModule('ohos.curves');
const display = requireNapi('display');
const mediaquery = requireNapi('mediaquery');
const LengthMetrics = requireNapi('arkui.node').LengthMetrics;
const systemParameterEnhance = requireNapi('systemParameterEnhance');
const animator = requireNapi('animator');
const componentUtils = requireNapi('arkui.componentUtils');
// Menubar作用域内的日志打印前缀
const LOG_TAG = 'CustomAppBar';
// 常规模式/全屏嵌入式使用的参数
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
// 半屏嵌入式使用的参数
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
const TITLE_CONSTRAINT_SIZE = 'calc(100% - 73.5vp)';
const MD_WIDTH = 480;
const LG_WIDTH_LIMIT = 0.6;
const LG_WIDTH_HEIGHT_RATIO = 1.95;
const PRIVACY_MARGIN = 12;
const PRIVACY_FONT_SIZE = '12vp';
const PRIVACY_TEXT_MARGIN_START = 4;
const PRIVACY_TEXT_MARGIN_END = 8;
const PRIVACY_CONSTRAINT_SIZE = 'calc(100% - 136vp)';
const ARKUI_APP_BAR_COLOR_CONFIGURATION = 'arkui_app_bar_color_configuration';
const ARKUI_APP_BAR_MENU_SAFE_AREA = 'arkui_app_bar_menu_safe_area';
const ARKUI_APP_BAR_CONTENT_SAFE_AREA = 'arkui_app_bar_content_safe_area';
const ARKUI_APP_BAR_BAR_INFO = 'arkui_app_bar_info';
const ARKUI_APP_BAR_SCREEN = 'arkui_app_bar_screen';
const ARKUI_APP_BG_COLOR = 'arkui_app_bg_color';
const ARKUI_APP_BAR_SERVICE_PANEL = 'arkui_app_bar_service_panel';
const ARKUI_APP_BAR_CLOSE = 'arkui_app_bar_close';
const ARKUI_APP_BAR_PROVIDE_SERVICE = 'arkui_app_bar_provide_service';
const EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK = 'arkui_custom_app_bar_menu_click';
const EVENT_NAME_CUSTOM_APP_BAR_CLOSE_CLICK = 'arkui_custom_app_bar_close_click';
const EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD = 'arkui_custom_app_bar_did_build';
const EVENT_NAME_CUSTOM_APP_BAR_CREATE_SERVICE_PANEL = 'arkui_custom_app_bar_create_service_panel';
const ARKUI_APP_BAR_MAXIMIZE = 'arkui_app_bar_maximize';
const ARKUI_APP_BAR_PRIVACY_AUTHORIZE = 'arkui_app_bar_privacy_authorize';
/**
 * 断点类型
 */
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
const colorMap = new Map([
    [ICON_FILL_COLOR_DEFAULT, { light: '#182431', dark: '#e5ffffff' }],
    [BORDER_COLOR_DEFAULT, { light: '#33182431', dark: '#4Dffffff' }],
    [MENU_BACK_COLOR, { light: '#99FFFFFF', dark: '#33000000' }],
    [HALF_BUTTON_BACK_COLOR, { light: '#0D000000', dark: '#19FFFFFF' }],
    [HALF_BUTTON_IMAGE_COLOR, { light: '#000000', dark: '#FFFFFF' }]
]);
/**
 * 与Native侧通信的事件回调管理类
 *
 * @since 2025/8/15
 */
class NativeEventManager {
    /**
     * 服务面板按钮点击回调
     * 在ets无法实现，需要在编译后的js中加入对应的实现方法
     */
    static onMenuButtonClick() {
      ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_MENU_CLICK);
    }
    /**
     * 关闭按钮点击回调
     * 在ets无法实现，需要在编译后的js中加入对应的实现方法
     */
    static onCloseButtonClick() {
      ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_CLOSE_CLICK);
    }
    /**
     * 点击title栏
     * 在ets无法实现，需要在编译后的js中加入对应的实现方法
     */
    static onEyelashTitleClick() {
      let info = {
          'bundleName': 'com.huawei.hmos.asde',
          'abilityName': 'PanelAbility',
          'params': [
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
     * 在ets无法实现，需要在编译后的js中加入对应的实现方法
     */
    static onDidBuild() {
        ContainerAppBar.callNative(EVENT_NAME_CUSTOM_APP_BAR_DID_BUILD);
    }
}

/**
 * Menubar的基础属性定义，包括等价ArkTS中State、Link等修饰的变量
 */
class MenubarBaseInfo extends ViewPU {
    constructor(parent, __localStorage, elmtId, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        // @State修饰变量集合，里面的变量等价于ArkTS中的@State xxx
        let stateProps = {};
        stateProps.menuResource = {
            bundleName: '',
            moduleName: '',
            params: [],
            id: 125830217,
            type: 20000
        };
        stateProps.closeResource = {
            bundleName: '',
            moduleName: '',
            params: [],
            id: 125831084,
            type: 20000
        };
        stateProps.privacyResource = {
            bundleName: '',
            moduleName: '',
            params: [],
            id: 125835516,
            type: 20000
        };
        stateProps.menuFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
        stateProps.closeFillColor = this.getResourceColor(ICON_FILL_COLOR_DEFAULT);
        stateProps.menubarBorderColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
        stateProps.menubarBackColor = this.getResourceColor(MENU_BACK_COLOR);
        stateProps.dividerBackgroundColor = this.getResourceColor(BORDER_COLOR_DEFAULT);
        stateProps.halfButtonBackColor = this.getResourceColor(HALF_BUTTON_BACK_COLOR);
        stateProps.halfButtonImageColor = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
        stateProps.privacyImageColor = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
        stateProps.contentMarginTop = 0;
        stateProps.contentMarginLeft = 0;
        stateProps.contentMarginRight = 0;
        stateProps.contentMarginBottom = 0;
        stateProps.menuMarginEnd = SM_MENU_MARGIN_END;
        stateProps.isHalfScreen = true;
        stateProps.containerHeight = '0%';
        stateProps.containerWidth = '100%';
        stateProps.stackHeight = '100%';
        stateProps.titleOpacity = 0;
        stateProps.buttonOpacity = 1;
        stateProps.titleHeight = 0;
        stateProps.titleOffset = 0;
        stateProps.maskOpacity = 0;
        stateProps.maskBlurScale = 0;
        stateProps.contentBgColor = '#FFFFFFFF';
        stateProps.statusBarHeight = 0;
        stateProps.ratio = undefined;
        stateProps.breakPoint = BreakPointsType.NONE;
        stateProps.serviceMenuRead = this.getStringByResourceToken(ARKUI_APP_BAR_SERVICE_PANEL);
        stateProps.closeRead = this.getStringByResourceToken(ARKUI_APP_BAR_CLOSE);
        stateProps.maximizeRead = this.getStringByResourceToken(ARKUI_APP_BAR_MAXIMIZE);
        stateProps.provideService = '';
        stateProps.privacyAuthText = '';
        stateProps.privacyWidth = '0';
        stateProps.privacySymbolOpacity = 0;
        stateProps.angle = '-90deg';
        stateProps.buttonSize = BUTTON_SIZE;
        stateProps.privacyTextOpacity = 0;
        stateProps.dividerOpacity = 0;
        stateProps.isShowPrivacyAnimation = false;
        stateProps.labelName = '';
        this.__menubarStateProps = stateProps;
        this.statePropsNameList = Object.keys(this.__menubarStateProps);
        // @State修饰成员变量统一处理
        this.statePropsNameList.forEach(name => {
            const privateProp = `__${name}`;
            // 初始化所有的@State修饰变量初值
            this[privateProp] = new ObservedPropertySimplePU(this.__menubarStateProps[name], this, name);
            // 为所有的@State修饰变量构造set、get访问器
            Object.defineProperty(this, name, {
                get: () => this[privateProp].get(),
                set: (newVal) => this[privateProp].set(newVal),
                enumerable: false
            });
        });
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
        }
        catch (err) {
            hilog.error(0x3900, LOG_TAG, `getStringByResourceToken, error: ${err.toString()}`);
        }
        return '';
    }
}

/**
 * meunbar组件具体功能实现
 */
export class CustomAppBar extends MenubarBaseInfo {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === 'function') {
            this.paramsGenerator_ = paramsLambda;
        }
        this.isHalfScreenCompFirstLaunch = true;
        this.isHalfToFullScreen = false;
        this.isDark = true;
        this.bundleName = '';
        this.icon = { 'id': -1, 'type': 20000, params: ['sys.media.ohos_app_icon'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
        this.fullContentMarginTop = 0;
        this.deviceBorderRadius = '0';
        this.privacyAnimator = undefined;
        this.smListener = mediaquery.matchMediaSync('(0vp<width) and (width<600vp)');
        this.mdListener = mediaquery.matchMediaSync('(600vp<=width) and (width<840vp)');
        this.lgListener = mediaquery.matchMediaSync('(840vp<=width)');
        this.subscriber = null;
        this.subscribeInfo = {
            events: ['usual.event.PRIVACY_STATE_CHANGED']
        };
        this.setInitiallyProvidedValue(params);
        this.declareWatch('breakPoint', this.onBreakPointChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        this.statePropsNameList.forEach((propName) => {
            if (params[propName] !== undefined) {
                this[propName] = params[propName];
            }
        });
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.statePropsNameList.forEach((propName) => {
            const privatePropName = `__${propName}`;
            if (typeof this[privatePropName].purgeDependencyOnElmtId === 'function') {
                this[privatePropName].purgeDependencyOnElmtId(rmElmtId);
            }
        });
    }
    aboutToBeDeleted() {
        this.statePropsNameList.forEach((propName) => {
            const privatePropName = `__${propName}`;
            if (typeof this[privatePropName].aboutToBeDeleted === 'function') {
                this[privatePropName].aboutToBeDeleted();
            }
        });
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    aboutToDisappear() {
        this.smListener.off('change');
        this.mdListener.off('change');
        this.lgListener.off('change');
        if (this.subscriber !== null) {
            commonEventManager.unsubscribe(this.subscriber, (err) => {
                if (err) {
                    hilog.error(0x3900, LOG_TAG, `unsubscribe err callback, message is ${err.message}`);
                }
                else {
                    this.subscriber = null;
                }
            });
        }
    }
    /**
     * 注册监听隐私协议状态
     */
    subscribePrivacyState() {
        try {
            // 创建订阅者
            commonEventManager.createSubscriber(this.subscribeInfo).then((commonEventSubscriber) => {
                this.subscriber = commonEventSubscriber;
                // 订阅公共事件
                try {
                    commonEventManager.subscribe(this.subscriber, (err, data) => {
                        if (err) {
                            hilog.error(0x3900, LOG_TAG, `subscribe failed, code is ${err?.code}, message is ${err?.message}`);
                            return;
                        }
                        let result = JSON.parse(data?.data ?? '{}')?.resultType;
                        // privacyMgmtType：1 隐私同意完整模式
                        if (result === 1) {
                            if (this.isHalfScreen) {
                                return;
                            }
                            this.isShowPrivacyAnimation = true;
                            this.startPrivacyAnimation();
                        }
                    });
                } catch (error) {
                    hilog.error(0x3900, LOG_TAG, `init Subscriber failed, code is ${error?.code}, message is ${error?.message}`);
                }
            }).catch((error) => {
                hilog.error(0x3900, LOG_TAG, `createSubscriber failed, code is ${error?.code}, message is ${error?.message}`);
            });
        } catch (error) {
            hilog.error(0x3900, LOG_TAG,
                `subscribePrivacyState failed, code is ${error?.code}, message is ${error?.message}`);
        }
    }
    getDeviceRadiusConfig() {
        try {
            this.deviceBorderRadius = systemParameterEnhance.getSync('const.product.device_radius');
            hilog.info(0x3900, LOG_TAG, `read device_radius success, device_radius: ${this.deviceBorderRadius}`);
        } catch (error) {
            hilog.error(0x3900, LOG_TAG, `read device_radius failed`);
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
    /**
     * 半屏嵌入式定制使用，当半屏嵌入式组件首次被拉起或者屏幕宽度断点发生变化时被调用
     * 被调用时更新半屏嵌入式组件的宽高比例
     */
    updateRatio() {
        // 屏幕断点为LG或MD时设置成直板机的宽高尺寸比，断点为SM时设置成undefined从而使控制尺寸比的字段失效
        const isRatioBeUndefined = this.breakPoint === BreakPointsType.LG || this.breakPoint === BreakPointsType.MD;
        this.ratio = isRatioBeUndefined ? 1 / LG_WIDTH_HEIGHT_RATIO : undefined;
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
                try {
                    let displayData = display.getDefaultDisplaySync();
                    let windowWidth = px2vp(displayData.width);
                    let windowHeight = px2vp(displayData.height);
                    this.containerWidth = windowWidth > windowHeight ? windowHeight * LG_WIDTH_LIMIT : windowWidth * LG_WIDTH_LIMIT;
                }
                catch (error) {
                    hilog.error(0x3900, LOG_TAG, `getDefaultDisplaySync failed, code is ${error?.code}, message is ${error?.message}`);
                }
            }
        }
        if (!this.isHalfScreenCompFirstLaunch) {
            this.updateRatio();
        }
    }
    parseBoolean(value) {
        return value === 'true';
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
            hilog.error(0x3900, LOG_TAG, `getAccessibilityDescription, error: ${err.toString()}`);
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
        this.privacyAuthText = this.getStringByResourceToken(ARKUI_APP_BAR_PRIVACY_AUTHORIZE);
    }
    /**
     * atomicservice侧的事件变化回调
     *
     * @param eventName 事件名称
     * @param param 事件参数
     */
    setCustomCallback(eventName, param) {
        if (param === null || param === '' || param === undefined) {
            hilog.error(0x3900, LOG_TAG, 'invalid params');
            return;
        }
        if (eventName === ARKUI_APP_BAR_COLOR_CONFIGURATION) {
            hilog.error(0x3900, LOG_TAG, `setCustomCallback notifyMenuColor, params: {param}`);
            this.onColorConfigurationUpdate(this.parseBoolean(param));
        } else if (eventName === ARKUI_APP_BAR_MENU_SAFE_AREA) {
            hilog.error(0x3900, LOG_TAG, `setCustomCallback notifyMenuSafeArea, params: {param}`);
            if (this.statusBarHeight === px2vp(Number(param))) {
                return;
            }
            this.statusBarHeight = Number(param);
            this.titleHeight = EYELASH_HEIGHT + 2 * TITLE_MARGIN_TOP + this.statusBarHeight;
        } else if (eventName === ARKUI_APP_BAR_CONTENT_SAFE_AREA) {
            let splitArray = param.split('|');
            if (splitArray.length < 4) {
                hilog.error(0x3900, LOG_TAG, `setCustomCallback updateSafeArea failed, params: {param}`);
                return;
            }
            hilog.error(0x3900, LOG_TAG, `setCustomCallback updateSafeArea success, margin: {JSON.stringify(splitArray)}`);
            this.contentMarginTop = this.isHalfScreen ? 0 : Number(splitArray[0]);
            this.fullContentMarginTop = Number(splitArray[0]);
            this.contentMarginLeft = Number(splitArray[1]);
            this.contentMarginRight = Number(splitArray[2]);
            this.contentMarginBottom = Number(splitArray[3]);
        } else if (eventName === ARKUI_APP_BAR_BAR_INFO) {
            let splitArray = param.split('|');
            if (splitArray.length < 2) {
                return;
            }
            this.bundleName = splitArray[0];
            this.labelName = splitArray[1];
            this.updateStringByResource();
        } else if (eventName === ARKUI_APP_BAR_SCREEN) {
            this.isHalfScreen = this.parseBoolean(param);
            this.initBreakPointListener();
        } else if (eventName === ARKUI_APP_BG_COLOR) {
            hilog.error(0x3900, LOG_TAG, `setCustomCallback notifyBgColor, params: {param}`);
            this.contentBgColor = this.isHalfScreen ? Color.Transparent : param;
        }
    }
    /**
     * 颜色变化设置
     *
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
        this.privacyImageColor = this.getResourceColor(HALF_BUTTON_IMAGE_COLOR);
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
            this.updateRatio();
        });
        // 标题栏渐显
        Context.animateTo({
            duration: 100,
            curve: curves.cubicBezierCurve(0.2, 0, 0.2, 1),
        }, () => {
            this.titleOpacity = 1;
        });
        this.isHalfScreenCompFirstLaunch = false;
    }
    /**
     * 半屏放大至全屏动效
     */
    expendContainerAnimation() {
        this.isHalfToFullScreen = true;
        Context.animateTo({
            duration: 150,
            curve: curves.interpolatingSpring(0, 1, 328, 36),
            onFinish: () => {
                this.contentBgColor = '#FFFFFF';
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
     * 元服务关闭动效，包含嵌入式组件关闭动效
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
                    NativeEventManager.onCloseButtonClick();
                }
            }, () => {
                this.stackHeight = '0%';
            });
        }
        else {
            NativeEventManager.onCloseButtonClick();
        }
        this.isHalfScreenCompFirstLaunch = true;
    }
    /**
     * 半屏嵌入式组件关闭动效
     */
    closeHalfContainerAnimation() {
        // 关闭弹框
        Context.animateTo({
            duration: 250,
            curve: curves.interpolatingSpring(0, 1, 328, 36),
            onFinish: () => {
                NativeEventManager.onCloseButtonClick();
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
    /**
     * 开始隐私标识动效
     */
    startPrivacyAnimation() {
        Context.animateTo({
            curve: curves.interpolatingSpring(2, 1, 328, 26),
        }, () => {
            this.privacyWidth = '';
        });
        Context.animateTo({
            duration: 250,
            curve: Curve.Sharp,
            delay: 100,
        }, () => {
            this.privacyTextOpacity = 1;
        });
        Context.animateTo({
            delay: 200,
            curve: curves.interpolatingSpring(2, 1, 500, 26),
        }, () => {
            this.angle = '0';
        });
        Context.animateTo({
            duration: 100,
            delay: 200,
            curve: Curve.Sharp,
        }, () => {
            this.privacySymbolOpacity = 1;
            this.dividerOpacity = 1;
        });
        // 延迟5s后开始退出动画
        setTimeout(() => {
            this.initPrivacyAnimator();
            Context.animateTo({
                duration: 50,
                curve: Curve.Sharp,
            }, () => {
                this.dividerOpacity = 0;
            });
            Context.animateTo({
                duration: 100,
                curve: Curve.Sharp,
            }, () => {
                this.privacyTextOpacity = 0;
            });
            Context.animateTo({
                duration: 150,
                curve: Curve.Sharp,
            }, () => {
                this.privacySymbolOpacity = 0;
            });
            this.privacyAnimator?.play();
        }, 5000);
    }
    /**
     * 隐私标识动效退出，menubar长度缩小帧动画初始化
     */
    initPrivacyAnimator() {
        let privacyTextLength = px2vp(componentUtils.getRectangleById('AtomicServiceMenuPrivacyId').size.width);
        let options = {
            duration: 500,
            easing: 'interpolating-spring(1, 1, 328, 26)',
            delay: 0,
            fill: 'forwards',
            direction: 'normal',
            iterations: 1,
            begin: privacyTextLength + PRIVACY_MARGIN + PRIVACY_TEXT_MARGIN_START + PRIVACY_TEXT_MARGIN_END,
            end: 0
        };
        this.privacyAnimator = animator.create(options);
        this.privacyAnimator.onFrame = (value) => {
            // 当动画帧值小于0.01时，不做动画。
            if (value <= 0 && Math.abs(value) < 0.01) {
                this.buttonSize = BUTTON_SIZE;
                this.privacyWidth = '0';
                return;
            }
            // 当动画帧值小于0时，对menu按钮做动画；大于0时，对隐私动效宽度做动画。
            if (value < 0) {
                this.buttonSize = BUTTON_SIZE + value;
            } else {
                this.privacyWidth = JSON.stringify(value);
            }
        };
        this.privacyAnimator.onFinish = () => {
            this.isShowPrivacyAnimation = false;
        };
    }
    privacySecurityLabel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(this.privacyWidth);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create(this.privacyResource);
            SymbolGlyph.fontSize(IMAGE_SIZE);
            SymbolGlyph.fontColor([this.privacyImageColor, Color.Blue]);
            SymbolGlyph.renderingStrategy(SymbolRenderingStrategy.MULTIPLE_COLOR);
            SymbolGlyph.margin({ start: LengthMetrics.vp(PRIVACY_MARGIN) });
            SymbolGlyph.opacity(this.privacySymbolOpacity);
            SymbolGlyph.rotate({
                x: 0,
                y: 1,
                z: 0,
                centerX: '50%',
                centerY: '50%',
                angle: this.angle
            });
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.privacyAuthText);
            Text.fontSize(PRIVACY_FONT_SIZE);
            Text.fontWeight(FontWeight.Regular);
            Text.textAlign(TextAlign.Center);
            Text.padding({
                start: LengthMetrics.vp(PRIVACY_TEXT_MARGIN_START),
                end: LengthMetrics.vp(PRIVACY_TEXT_MARGIN_END)
            });
            Text.textAlign(TextAlign.Start);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.wordBreak(WordBreak.BREAK_WORD);
            Text.opacity(this.privacyTextOpacity);
            Text.ellipsisMode(EllipsisMode.END);
            Text.constraintSize({ maxWidth: PRIVACY_CONSTRAINT_SIZE });
            Text.fontColor(this.privacyImageColor);
            Text.renderFit(RenderFit.RESIZE_FILL);
            Text.maxLines(1);
            Text.id('AtomicServiceMenuPrivacyId');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.id('AtomicServiceDividerId');
            Divider.vertical(true);
            Divider.color(this.dividerBackgroundColor);
            Divider.lineCap(LineCapStyle.Round);
            Divider.strokeWidth(BORDER_WIDTH);
            Divider.height(DIVIDER_HEIGHT);
            Divider.opacity(this.dividerOpacity);
        }, Divider);
    }
    fullScreenMenubar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.id('AtomicServiceMenubarRowId');
            Row.margin({
                top: LengthMetrics.vp(this.statusBarHeight + MENU_MARGIN_TOP),
                end: LengthMetrics.vp(this.menuMarginEnd)
            });
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
            Row.align(Alignment.Top);
            Row.draggable(false);
            Row.geometryTransition('menubar');
            Row.id('AtomicServiceMenubarId');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isShowPrivacyAnimation) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.privacySecurityLabel.bind(this)();
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
            Button.id('AtomicServiceMenuId');
            Button.type(ButtonType.Normal);
            Button.borderRadius({ topLeft: MENU_RADIUS, bottomLeft: MENU_RADIUS });
            Button.backgroundColor(Color.Transparent);
            Button.width(this.buttonSize);
            Button.height(VIEW_HEIGHT);
            Button.accessibilityText(this.serviceMenuRead);
            Gesture.create(GesturePriority.Low);
            TapGesture.create();
            TapGesture.onAction(() => {
                NativeEventManager.onMenuButtonClick();
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
                NativeEventManager.onEyelashTitleClick();
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
                start: LengthMetrics.vp(VIEW_MARGIN_RIGHT),
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
            Stack.onAppear(() => {
                if (this.isHalfScreen) {
                    this.contentBgColor = Color.Transparent;
                    this.titleHeight = EYELASH_HEIGHT + 2 * TITLE_MARGIN_TOP + this.statusBarHeight;
                    this.halfScreenShowAnimation();
                } else {
                    this.containerHeight = '100%';
                    this.containerWidth = '100%';
                }
                this.updateStringByResource();
                this.getDeviceRadiusConfig();
                this.subscribePrivacyState();
            });
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
                        Column.foregroundBlurStyle(BlurStyle.BACKGROUND_REGULAR, { colorMode: ThemeColorMode.LIGHT, scale: this.maskBlurScale });
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
            Column.id('AtomicServiceStageLayoutId');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height(this.containerHeight);
            Column.width(this.containerWidth);
            Column.aspectRatio(ObservedObject.GetRawObject(this.ratio));
            Column.justifyContent(FlexAlign.End);
            Column.hitTestBehavior(HitTestMode.Transparent);
            Column.id('AtomicServiceStageColumnId');
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
                topLeft: this.isHalfScreen ? HALF_CONTAINER_BORDER_SIZE : 0,
                topRight: this.isHalfScreen ? HALF_CONTAINER_BORDER_SIZE : 0,
            });
            Row.clip(true);
            Row.alignItems(VerticalAlign.Bottom);
            Row.width('100%');
            Row.onClick(() => {
                // 拦截到背板的点击事件
            });
            Row.accessibilityLevel('no');
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

ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadCustomAppbar(new CustomAppBar(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
