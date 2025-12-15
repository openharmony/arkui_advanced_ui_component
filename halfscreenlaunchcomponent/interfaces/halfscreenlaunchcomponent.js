/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
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
const hilog = requireNapi('hilog');
const abilityManager = requireNapi('app.ability.abilityManager');
const commonEventManager = requireNapi('commonEventManager');
const bundleManager = requireNapi('bundle.bundleManager');
const halfScreenLaunchComponentNapi = requireInternal('atomicservice.HalfScreenLaunchComponent');
const EMBEDDED_HALF_MODE = 2;
const atomicServiceDataTag = 'ohos.atomicService.window';
const ERR_CODE_CAPABILITY_NOT_SUPPORT = 801;
const LOG_TAG = 'HalfScreenLaunchComponent';
const ERR_CODE_NOT_OPEN = 16000012;
const COLOR_HEX_MAX = 0xffffffff;
const SET_STATUS_BAR_COLOR = 'setStatusBarColor';
const RECEIVE_FUNCTION = 'ohos.atomicService.window.function';
const RECEIVE_PARAM_COLOR_NUMERIC = 'ohos.atomicService.window.param.color.numeric';
export class HalfScreenLaunchComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === 'function') {
            this.paramsGenerator_ = paramsLambda;
        }
        this.content = this.doNothingBuilder;
        this.context = getContext(this);
        this.appId = '';
        this.options = undefined;
        this.__isShow = new ObservedPropertySimplePU(false, this, 'isShow');
        this.subscriber = null;
        this.onError = undefined;
        this.onTerminated = undefined;
        this.onReceive = undefined;
        this.isSystemApp = false;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.content !== undefined) {
            this.content = params.content;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.appId !== undefined) {
            this.appId = params.appId;
        }
        if (params.options !== undefined) {
            this.options = params.options;
        }
        if (params.isShow !== undefined) {
            this.isShow = params.isShow;
        }
        if (params.subscriber !== undefined) {
            this.subscriber = params.subscriber;
        }
        if (params.onError !== undefined) {
            this.onError = params.onError;
        }
        if (params.onTerminated !== undefined) {
            this.onTerminated = params.onTerminated;
        }
        if (params.onReceive !== undefined) {
            this.onReceive = params.onReceive;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isShow.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get isShow() {
        return this.__isShow.get();
    }
    set isShow(newValue) {
        this.__isShow.set(newValue);
    }
    aboutToAppear() {
        const bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
        const selfBundleInfo = bundleManager.getBundleInfoForSelfSync(bundleFlags);
        this.isSystemApp = selfBundleInfo?.appInfo?.systemApp;
        let subscribeInfo = {
            events: [commonEventManager.Support.COMMON_EVENT_DISTRIBUTED_ACCOUNT_LOGOUT],
        };
        commonEventManager.createSubscriber(subscribeInfo, (err, data) => {
            if (err) {
                hilog.error(0x3900, LOG_TAG, 'Failed to create subscriber, err: %{public}s.', JSON.stringify(err));
                return;
            }
            if (data === null || data === undefined) {
                hilog.error(0x3900, LOG_TAG, 'Failed to create subscriber, data is null.');
                return;
            }
            this.subscriber = data;
            commonEventManager.subscribe(this.subscriber, (err, data) => {
                if (err) {
                    hilog.error(0x3900, LOG_TAG, 'Failed to subscribe common event, err: %{public}s.', JSON.stringify(err));
                    return;
                }
                this.isShow = false;
            });
        });
    }
    aboutToDisappear() {
        if (this.subscriber !== null) {
            commonEventManager.unsubscribe(this.subscriber, (err) => {
                if (err) {
                    hilog.error(0x3900, LOG_TAG, 'UnsubscribeCallBack, err: %{public}s.', JSON.stringify(err));
                }
                else {
                    this.subscriber = null;
                }
            });
        }
    }
    doNothingBuilder(parent = null) {
    }
    resetOptions() {
        if (this.options?.parameters) {
            this.options.parameters['ohos.extra.param.key.showMode'] = EMBEDDED_HALF_MODE;
            this.options.parameters['ability.want.params.IsNotifyOccupiedAreaChange'] = true;
            this.options.parameters['ability.want.params.IsModal'] = true;
            this.options.parameters['com.atomicservice.params.key.launchType'] = 'EMBED_HALF';
            this.options.parameters['com.atomicservice.params.key.isSystemApp'] = this.isSystemApp;
            hilog.info(0x3900, LOG_TAG, 'replaced options is %{public}s !', JSON.stringify(this.options));
        }
        else {
            this.options = {
                parameters: {
                    'ohos.extra.param.key.showMode': EMBEDDED_HALF_MODE,
                    'ability.want.params.IsNotifyOccupiedAreaChange': true,
                    'ability.want.params.IsModal': true,
                    'com.atomicservice.params.key.launchType': 'EMBED_HALF',
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
        } catch (err) {
            hilog.error(0x3900, LOG_TAG, 'AtomicServiceStartupRule failed: %{public}s', err.message);
            this.popUp();
        }
    }
    async popUp() {
        this.isShow = false;
        try {
            const ability = await this.context.openAtomicService(this.appId, this.options);
            hilog.info(0x3900, LOG_TAG, '%{public}s open service success!', ability.want);
        }
        catch (e) {
            hilog.error(0x3900, LOG_TAG, '%{public}s open service error!', e.message);
            this.pullUpError(e.code, 'open_atomic_service_fail', e.message);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.Center);
            Row.onClick(() => {
                hilog.info(0x3900, LOG_TAG, 'on start atomicservice');
                this.checkAbility();
            });
            Row.bindContentCover({ value: this.isShow, changeEvent: newValue => { this.isShow = newValue; } }, {
                builder: () => {
                    this.uiExtensionBuilder.call(this);
                }
            }, {
                modalTransition: ModalTransition.NONE,
                enableSafeArea: true,
                onWillDisappear: () => {
                    this.resetStatusBarContentColor();
                }
            });
        }, Row);
        this.content.bind(this)();
        Row.pop();
    }
    uiExtensionBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height(LayoutPolicy.matchParent);
            Column.width(LayoutPolicy.matchParent);
            Column.ignoreLayoutSafeArea([LayoutSafeAreaType.SYSTEM], [LayoutSafeAreaEdge.TOP, LayoutSafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            UIExtensionComponent.create({
                bundleName: `com.atomicservice.${this.appId}`,
                flags: this.options?.flags,
                parameters: this.options?.parameters
            },
            {
                windowModeFollowStrategy: WindowModeFollowStrategy.FOLLOW_HOST_WINDOW_MODE
            });
            UIExtensionComponent.height('100%');
            UIExtensionComponent.width('100%');
            UIExtensionComponent.backgroundColor(Color.Transparent);
            UIExtensionComponent.onError(err => {
                if (this.onError) {
                    this.onError(err);
                }
                this.isShow = false;
                hilog.error(0x3900, LOG_TAG, 'call up UIExtension error!%{public}s', err.message);
            });
            UIExtensionComponent.onTerminated(info => {
                this.isShow = false;
                if (this.onTerminated) {
                    this.onTerminated(info);
                }
            });
            UIExtensionComponent.onReceive(data => {
                this.handleOnReceiveEvent(data);
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
        halfScreenLaunchComponentNapi.setStatusBarColor(windowId, color);
    }

    static clearStatusBarColor(windowId) {
        halfScreenLaunchComponentNapi.clearStatusBarColor(windowId);
    }
}

export default { HalfScreenLaunchComponent };