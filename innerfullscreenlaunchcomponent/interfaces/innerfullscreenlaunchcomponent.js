/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
const hilog = requireNapi('hilog');
const abilityManager = requireNapi('app.ability.abilityManager');
const commonEventManager = requireNapi('commonEventManager');
const bundleManager = requireNapi('bundle.bundleManager');
const innerFullScreenLaunchComponentNapi = requireInternal('arkui.advanced.InnerFullScreenLaunchComponent');
const atomicServiceDataTag = 'ohos.atomicService.window';
const ERR_CODE_CAPABILITY_NOT_SUPPORT = 801;
const API20 = 20;
const LOG_TAG = 'InnerFullScreenLaunchComponent';
const ERR_CODE_NOT_OPEN = 16000012;
const COLOR_HEX_MAX = 0xffffffff;
const SET_STATUS_BAR_COLOR = 'setStatusBarColor';
const RECEIVE_FUNCTION = 'ohos.atomicService.window.function';
const RECEIVE_PARAM_COLOR_NUMERIC = 'ohos.atomicService.window.param.color.numeric';
export class LaunchController {
    constructor() {
        this.launchAtomicService = (n1, o1) => { };
    }
}

const EMBEDDED_FULL_MODE = 1;
export class InnerFullScreenLaunchComponent extends ViewPU {
    constructor(d1, e1, f1, g1 = -1, h1 = undefined, i1) {
        super(d1, f1, g1, i1);
        if (typeof h1 === "function") {
            this.paramsGenerator_ = h1;
        }
        this.content = this.doNothingBuilder;
        this.context = getContext(this);
        this.controller = new LaunchController();
        this.appId = '';
        this.options = undefined;
        this.__isShow = new ObservedPropertySimplePU(false, this, "isShow");
        this.subscriber = null;
        this.apiVersion = 0;
        this.onReceive = undefined;
        this.onError = undefined;
        this.onTerminated = undefined;
        this.isSystemApp = false;
        this.launchAtomicService = (k1, l1) => {
            hilog.info(0x3900, LOG_TAG, 'launchAtomicService, appId: %{public}s.', k1);
            this.appId = k1;
            this.options = l1;
            this.checkAbility();
        };
        this.setInitiallyProvidedValue(e1);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(c1) {
        if (c1.content !== undefined) {
            this.content = c1.content;
        }
        if (c1.context !== undefined) {
            this.context = c1.context;
        }
        if (c1.controller !== undefined) {
            this.controller = c1.controller;
        }
        if (c1.appId !== undefined) {
            this.appId = c1.appId;
        }
        if (c1.options !== undefined) {
            this.options = c1.options;
        }
        if (c1.isShow !== undefined) {
            this.isShow = c1.isShow;
        }
        if (c1.subscriber !== undefined) {
            this.subscriber = c1.subscriber;
        }
        if (c1.apiVersion !== undefined) {
            this.apiVersion = c1.apiVersion;
        }
        if (c1.launchAtomicService !== undefined) {
            this.launchAtomicService = c1.launchAtomicService;
        }
        if (c1.onReceive !== undefined) {
            this.onReceive = c1.onReceive;
        }
        if (c1.onError !== undefined) {
            this.onError = c1.onError;
        }
        if (c1.onTerminated !== undefined) {
            this.onTerminated = c1.onTerminated;
        }
    }
    updateStateVars(b1) {
    }
    purgeVariableDependenciesOnElmtId(a1) {
        this.__isShow.purgeDependencyOnElmtId(a1);
    }
    aboutToBeDeleted() {
        this.__isShow.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get isShow() {
        return this.__isShow.get();
    }
    set isShow(z) {
        this.__isShow.set(z);
    }
    aboutToAppear() {
        this.loadApiVersion();
        let s = {
            events: [commonEventManager.Support.COMMON_EVENT_DISTRIBUTED_ACCOUNT_LOGOUT],
        };
        commonEventManager.createSubscriber(s, (u, v) => {
            if (u) {
                hilog.error(0x3900, LOG_TAG, 'Failed to create subscriber, err: %{public}s.', u.message);
                return;
            }
            if (v == null || v == undefined) {
                hilog.error(0x3900, LOG_TAG, 'Failed to create subscriber, data is null.');
                return;
            }
            this.subscriber = v;
            commonEventManager.subscribe(this.subscriber, (x, y) => {
                if (x) {
                    hilog.error(0x3900, LOG_TAG, 'Failed to subscribe common event, err: %{public}s.', x.message);
                    return;
                }
                hilog.info(0x3900, LOG_TAG, 'Received account logout event.');
                this.isShow = false;
            });
        });
        this.controller.launchAtomicService = this.launchAtomicService;
    }
    loadApiVersion() {
        let d = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION |
        bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_METADATA;
        try {
            bundleManager.getBundleInfoForSelf(d).then((g) => {
                if (!g?.targetVersion) {
                    hilog.error(0x3900, LOG_TAG, 'getBundleInfoForSelf error, targetVersion is undefined');
                    return;
                }
                this.apiVersion = g.targetVersion % 1000;
                this.isSystemApp = g.appInfo?.systemApp;
                hilog.info(0x3900, LOG_TAG, 'getBundleInfoForSelf success, data: %{public}d.', this.apiVersion);
            }).catch((f) => {
                hilog.error(0x3900, LOG_TAG, 'getBundleInfoForSelf fail_1, cause: %{public}s.', f.message);
            });
        }
        catch (e) {
            hilog.error(0x3900, LOG_TAG, 'getBundleInfoForSelf fail_2, cause: %{public}s.', e.message);
        }
    }
    aboutToDisappear() {
        if (this.subscriber !== null) {
            commonEventManager.unsubscribe(this.subscriber, (r) => {
                if (r) {
                    hilog.error(0x3900, LOG_TAG, 'UnsubscribeCallBack, err: %{public}s.', r.message);
                }
                else {
                    this.subscriber = null;
                }
            });
        }
    }
    doNothingBuilder(p = null) {
    }
    resetOptions() {
        if (this.options?.parameters) {
            this.options.parameters['ohos.extra.param.key.showMode'] = EMBEDDED_FULL_MODE;
            this.options.parameters['ability.want.params.IsNotifyOccupiedAreaChange'] = true;
            this.options.parameters['ohos.extra.atomicservice.param.key.isFollowHostWindowMode'] = (this.apiVersion >= API20);
            this.options.parameters['com.atomicservice.params.key.launchType'] = 'EMBED_INNER_FULL';
            this.options.parameters['com.atomicservice.params.key.isSystemApp'] = this.isSystemApp;
            hilog.info(0x3900, LOG_TAG, 'replaced options is %{public}s !', JSON.stringify(this.options));
        }
        else {
            this.options = {
                parameters: {
                    'ohos.extra.param.key.showMode': EMBEDDED_FULL_MODE,
                    'ability.want.params.IsNotifyOccupiedAreaChange': true,
                    'ohos.extra.atomicservice.param.key.isFollowHostWindowMode': (this.apiVersion >= API20),
                    'com.atomicservice.params.key.launchType': 'EMBED_INNER_FULL',
                    'com.atomicservice.params.key.isSystemApp': this.isSystemApp
                }
            };
        }
    }
    async checkAbility() {
        if (this.isShow) {
            hilog.error(0x3900, LOG_TAG, 'EmbeddedAbility already shows');
            this.isShow = false;
            return;
        }
        this.resetOptions();
        try {
            abilityManager.queryAtomicServiceStartupRule(this.context, this.appId)
                .then((data) => {
                    if (data.isOpenAllowed) {
                        if (data.isEmbeddedAllowed) {
                            this.isShow = true;
                            hilog.info(0x3900, LOG_TAG, 'EmbeddedOpen is Allowed!');
                        } else {
                            this.popUp();
                        }
                    } else {
                        hilog.info(0x3900, LOG_TAG, 'is not allowed open!');
                        this.pullUpError(ERR_CODE_NOT_OPEN, 'atomic_service_open_fail', 'is not allowed open!');
                    }
                }).catch((err) => {
                    hilog.error(0x3900, LOG_TAG, 'queryAtomicServiceStartupRule called error!%{public}s', err.message);
                    if (ERR_CODE_CAPABILITY_NOT_SUPPORT === err.code) {
                        this.popUp();
                    }
                    else {
                        this.pullUpError(err.code, 'query_atomic_service_startup__rule_fail', err.message);
                    } 
            });
        }
        catch (err) {
            hilog.error(0x3900, LOG_TAG, 'AtomicServiceStartupRule failed: %{public}s', err.message);
            this.popUp();
        }
    }
    async popUp() {
        this.isShow = false;
        try {
            const m = await this.context.openAtomicService(this.appId, this.options);
            hilog.info(0x3900, LOG_TAG, '%{public}s open service success!', m.want);
        }
        catch (l) {
            hilog.error(0x3900, LOG_TAG, '%{public}s open service error!', l.message);
            this.pullUpError(l.code, 'open_atomic_service_fail', l.message);
        }
    }
    handleOnReceiveEvent(data) {
        if (!data) {
            return;
        }
        if (data[RECEIVE_FUNCTION] === SET_STATUS_BAR_COLOR) {
            this.updateStatusBarContentColor(data[RECEIVE_PARAM_COLOR_NUMERIC]);
        }
        if (this.onReceive) {
            const sourceKeys = Object.keys(data);
            let atomicServiceData = {};
            for (let i = 0; i < sourceKeys.length; i++) {
                if (this.isOnReceiveCallback(sourceKeys[i], data[sourceKeys[i]])) {
                    atomicServiceData[sourceKeys[i]] = data[sourceKeys[i]];
                }
            }
            if (Object.keys(atomicServiceData).length > 0) {
                this.onReceive(atomicServiceData);
            }
        }
    }
    handleOnErrorEvent(e21) {
        this.isShow = false;
        hilog.error(0x3900, LOG_TAG, 'call up UIExtension error! %{public}s', e21.message);
        if (this.onError) {
            try {
                this.onError(e21);
            }
            catch (f21) {
                hilog.error(0x3900, LOG_TAG, 'onError callback error! %{public}s', f21.message);
            }
        }
    }
    handleOnTerminated(c21) {
        this.isShow = false;
        if (this.onTerminated) {
            try {
                this.onTerminated(c21);
            }
            catch (d21) {
                hilog.error(0x3900, LOG_TAG, 'onTerminated callback error! %{public}s', d21.message);
            }
        }
    }
    pullUpError(code, name, message) {
        if(!this.onError) {
            return;
        }
        let error = {
            code: code,
            name: name,
            message: message
        };
        try {
            this.onError(error);
        } catch (err) {
            hilog.error(0x3900, LOG_TAG, 'onError callback error! %{public}s', err.message);
        }
    }
    initialRender() {
        this.observeComponentCreation2((i, j) => {
            Row.create();
            Row.justifyContent(FlexAlign.Center);
            Row.bindContentCover({ value: this.isShow, changeEvent: k => { this.isShow = k; } }, { builder: () => {
                this.uiExtensionBuilder.call(this);
            } }, {
                modalTransition: ModalTransition.DEFAULT,
                enableSafeArea: true,
                onWillDisappear: () => {
                    this.resetStatusBarContentColor();
                }
            });
        }, Row);
        this.content.bind(this)(this);
        Row.pop();
    }
    uiExtensionBuilder(a = null) {
        this.observeComponentCreation2((w20, x20) => {
            Column.create();
            Column.height(LayoutPolicy.matchParent);
            Column.width(LayoutPolicy.matchParent);
            Column.ignoreLayoutSafeArea([LayoutSafeAreaType.SYSTEM], [LayoutSafeAreaEdge.TOP, LayoutSafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((c, d) => {
            UIExtensionComponent.create({
                bundleName: `com.atomicservice.${this.appId}`,
                flags: this.options?.flags,
                parameters: this.options?.parameters
            }, {
                windowModeFollowStrategy: WindowModeFollowStrategy.FOLLOW_HOST_WINDOW_MODE
            });
            UIExtensionComponent.backgroundColor({ 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_titlebar_bg'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
            UIExtensionComponent.defaultFocus(true);
            UIExtensionComponent.height('100%');
            UIExtensionComponent.width('100%');
            UIExtensionComponent.onRelease(() => {
                hilog.error(0x3900, LOG_TAG, 'onRelease');
                this.isShow = false;
            });
            UIExtensionComponent.onError(g => {
                this.handleOnErrorEvent(g);
            });
            UIExtensionComponent.onReceive(data => {
                this.handleOnReceiveEvent(data);
            });
            UIExtensionComponent.onTerminated((a) => {
                this.handleOnTerminated(a);
            });
        }, UIExtensionComponent);
        Column.pop();
    }
    updateStatusBarContentColor(g22) {
        if (typeof g22 !== 'number' || g22 < 0 || g22 > COLOR_HEX_MAX) {
            hilog.error(0x3900, LOG_TAG, `updateStatusBarContentColor fail, receivedColor is invalid`);
            return;
        }
        try {
            hilog.info(0x3900, LOG_TAG, `updateStatusBarContentColor receivedColor=${g22}`);
            let i22 = this.context.windowStage.getMainWindowSync();
            let j22 = i22?.getWindowProperties()?.id;
            if (typeof j22 !== 'number') {
                hilog.error(0x3900, LOG_TAG, `updateStatusBarContentColor fail, mainWindowId is undefined`);
                return;
            }
            WindowManager.setStatusBarColor(j22, g22);
        }
        catch (h22) {
            hilog.error(0x3900, LOG_TAG, `updateStatusBarContentColor error, message: ${h22.message}`);
        }
    }
    resetStatusBarContentColor() {
        try {
            let e22 = this.context.windowStage.getMainWindowSync();
            let f22 = e22?.getWindowProperties()?.id;
            if (typeof f22 !== 'number') {
                hilog.error(0x3900, LOG_TAG, `resetStatusBarContentColor fail, mainWindowId is undefined`);
                return;
            }
            WindowManager.clearStatusBarColor(f22);
        }
        catch (d22) {
            hilog.error(0x3900, LOG_TAG, `resetStatusBarContentColor error, message: ${d22.message}`);
        }
    }
    isOnReceiveCallback(m19, n19) {
        return !!m19 && m19.includes(atomicServiceDataTag) &&
            !(m19 === RECEIVE_PARAM_COLOR_NUMERIC ||
                (m19 === RECEIVE_FUNCTION && n19 === SET_STATUS_BAR_COLOR));
    }
    rerender() {
        this.updateDirtyElements();
    }
}

class WindowManager {
    static setStatusBarColor(windowId, color) {
        innerFullScreenLaunchComponentNapi.setStatusBarColor(windowId, color);
    }

    static clearStatusBarColor(windowId) {
        innerFullScreenLaunchComponentNapi.clearStatusBarColor(windowId);
    }
}

export default { InnerFullScreenLaunchComponent, LaunchController};