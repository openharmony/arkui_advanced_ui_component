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

var __decorate = (this && this.__decorate) || function (a12, b12, c12, d12) {
    var e12 = arguments.length,
        f12 = e12 < 3 ? b12 : d12 === null ? d12 = Object.getOwnPropertyDescriptor(b12, c12) : d12, g12;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        f12 = Reflect.decorate(a12, b12, c12, d12);
    } else {
        for (var h12 = a12.length - 1; h12 >= 0; h12--) {
            if (g12 = a12[h12]) {
                f12 = (e12 < 3 ? g12(f12) : e12 > 3 ? g12(b12, c12, f12) : g12(b12, c12)) || f12;
            }
        }
    }
    return e12 > 3 && f12 && Object.defineProperty(b12, c12, f12), f12;
};

if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => {
    });
}
const webView = requireNapi('web.webview');
const router = requireNapi('router');
const deviceInfo = requireNapi('deviceInfo');
const geoLocationManager = requireNapi('geoLocationManager');
const bundleManager = requireNapi('bundle.bundleManager');
const abilityAccessCtrl = requireNapi('abilityAccessCtrl');
const connection = requireNapi('net.connection');
const request = requireNapi('request');
const fs = requireNapi('file.fs');
const util = requireNapi('util');
const photoAccessHelper = requireNapi('file.photoAccessHelper');
const filePreview = globalThis.requireNapi('filemanagement.filepreview', false, '', 'hms');
const fileUri = requireNapi('file.fileuri');
const picker = requireNapi('multimedia.cameraPicker');
const filePicker = requireNapi('file.picker');
const call = requireNapi('telephony.call');
const authentication = globalThis.requireNapi('core.authentication', false, '', 'hms');
const paymentService = globalThis.requireNapi('core.payment.paymentService', false, '', 'hms');
const atomicServiceWebNapi = requireInternal('atomicservice.AtomicServiceWeb');
const hiAppEvent = globalThis.requireNapi('hiviewdfx.hiAppEvent');

let atomicBasicEngine = null;

function loadAtomicBasicEngine() {
    try {
        import('@hms:atomicservicedistribution.atomicbasicengine').then((z10) => {
            console.log('AtomicServiceWeb loadAtomicBasicEngine success');
            atomicBasicEngine = z10;
        }).catch((y10) => {
            console.error('AtomicServiceWeb loadAtomicBasicEngine error, message: ' + y10.message);
        });
    } catch (x10) {
        console.error('AtomicServiceWeb loadAtomicBasicEngine error, message: ' + x10.message);
    }
}

loadAtomicBasicEngine();

class AsError {
    constructor(m11, n11) {
        this.code = m11;
        this.message = n11;
    }
}

class JsApiConfig {
    constructor(i11, j11, k11, l11) {
        this.apiName = i11;
        this.minVersion = j11;
        this.maxVersion = k11;
        this.requiredFieldNames = l11;
    }
}

const LOG_ENABLE = true;
const LOG_PREFIX = '[AtomicServiceWebLog]';
const UPLOAD_IMAGE_CACHE_DIR = '/cache/';
const JAVA_SCRIPT_PROXY_OBJECT_NAME = 'atomicServiceProxy';
const JAVA_SCRIPT_PROXY_API_NAME_LIST = ['invokeJsApi'];
const ATOMIC_SERVICE_JS_API_MAP = new Map();
const registerJsApi = (u11, v11, w11, x11, y11) => {
    ATOMIC_SERVICE_JS_API_MAP.set(u11, new JsApiConfig(v11, w11, x11, y11));
};
const MAX_VERSION = '99.99.99';
const ATOMIC_SERVICE_JS_SDK_CURRENT_VERSION = '1.0.1';
const PERMISSION_APPROXIMATELY_LOCATION = 'ohos.permission.APPROXIMATELY_LOCATION';
const TEL_PROTOCOL = 'tel:';
const MAILTO_PROTOCOL = 'mailto:';
const WANT_ACTION_SEND_TO_DATA = 'ohos.want.action.sendToData';
const RESOURCE_RAWFILE = 'resource://rawfile';
const TYPE_AS_WEB = 'ASWeb';
const WEB_PERMISSIONS = {
    'TYPE_VIDEO_CAPTURE': 'ohos.permission.CAMERA',
    'TYPE_AUDIO_CAPTURE': 'ohos.permission.MICROPHONE'
};
const SYSTEM_INTERNAL_ERROR = new AsError(500, 'System internal error.');
const JS_API_INVALID_INVOKE_ERROR = new AsError(200001, 'Invalid invoke.');
const PARAM_REQUIRED_ERROR_CODE = 200002;
const PARAM_NUMBER_POSITIVE_ERROR_CODE = 200003;
const ROUTER_PARAM_MODE_INVALID_ERROR = new AsError(200004, 'Param mode is invalid.');
const BACK_URL_NOT_EXIST_OR_OPENED_ERROR = new AsError(200005, 'Url is not exist or opened, can not be back.');
const NAV_PATH_STACK_NOT_EXIST_ERROR_CODE = 200006;
const POP_PATH_NAME_NOT_EXIST_ERROR = new AsError(200007, 'Name is not exist or opened, can not be pop.');
const POP_PATH_PARAM_INDEX_INVALID_ERROR = new AsError(200008, 'Param index is invalid.');
const POP_PATH_INDEX_OUT_OF_RANGE_ERROR = new AsError(200009, 'The Index is out of range.');
const UPLOAD_IMAGE_FILES_REQUIRED_ERROR = new AsError(200010, 'Param files is required.');
const UPLOAD_IMAGE_FILE_NOT_EXIST_ERROR_CODE = 200011;
const UPLOAD_IMAGE_FILES_URI_REQUIRED_ERROR = new AsError(200012, 'Param uri of files is required.');
const UPLOAD_FILE_ERROR = new AsError(200013, 'Upload file error.');
const IMAGE_CAN_NOT_PREVIEW_ERROR = new AsError(200014, 'The filePath can not preview.');
const NETWORK_NO_ACTIVE_ERROR = new AsError(200015, 'The network is not active.');
const PERMISSION_LOCATION_USER_REFUSED_ERROR = 200016;
const LOGIN_STATE_INVALID_ERROR = new AsError(200017, 'Login state is invalid.');
const LOGIN_RESPONSE_DATA_NULL_ERROR = new AsError(200018, 'Response data is null.');
const REQUEST_PAYMENT_ORDER_STR_INVALID_ERROR = new AsError(200019, 'orderStr is not type string.');
const NEED_REPORTED_API_LIST = ['has.cameraPicker.pick', 'has.photoViewPicker.select', 'has.filePreview.openPreview', 'has.request.uploadFile', 'has.request.downloadFile',
    'has.connection.getNetworkType', 'has.location.getLocation'];
registerJsApi('router.pushUrl', 'pushUrl', '1.0.0', MAX_VERSION, ['url']);
registerJsApi('router.replaceUrl', 'replaceUrl', '1.0.0', MAX_VERSION, ['url']);
registerJsApi('router.back', 'backUrl', '1.0.0', MAX_VERSION, []);
registerJsApi('router.clear', 'clearUrl', '1.0.0', MAX_VERSION, []);
registerJsApi('navPathStack.pushPath', 'pushPath', '1.0.0', MAX_VERSION, ['name']);
registerJsApi('navPathStack.replacePath', 'replacePath', '1.0.0', MAX_VERSION, ['name']);
registerJsApi('navPathStack.pop', 'popPath', '1.0.0', MAX_VERSION, []);
registerJsApi('navPathStack.clear', 'clearPath', '1.0.0', MAX_VERSION, []);
registerJsApi('asWeb.postMessage', 'postMessage', '1.0.0', MAX_VERSION, ['data']);
registerJsApi('asWeb.getEnv', 'getEnv', '1.0.0', MAX_VERSION, []);
registerJsApi('asWeb.checkJsApi', 'checkJsApi', '1.0.0', MAX_VERSION, ['jsApiList']);
registerJsApi('cameraPicker.pick', 'pickCamera', '1.0.0', MAX_VERSION, ['mediaTypes', 'cameraPosition']);
registerJsApi('photoViewPicker.select', 'selectPhoto', '1.0.0', MAX_VERSION, []);
registerJsApi('filePreview.openPreview', 'openPreview', '1.0.0', MAX_VERSION, ['uri']);
registerJsApi('request.uploadFile', 'uploadFile', '1.0.0', MAX_VERSION, ['url', 'files']);
registerJsApi('request.downloadFile', 'downloadFile', '1.0.0', MAX_VERSION, ['url']);
registerJsApi('connection.getNetworkType', 'getNetworkType', '1.0.0', MAX_VERSION, []);
registerJsApi('location.getLocation', 'getLocation', '1.0.0', MAX_VERSION, []);
registerJsApi('account.login', 'login', '1.0.1', MAX_VERSION, []);
registerJsApi('payment.requestPayment', 'requestPayment', '1.0.1', MAX_VERSION, ['orderStr']);

export class AtomicServiceWeb extends ViewPU {
    constructor(s10, t10, u10, v10 = -1, w10 = undefined, x10) {
        super(s10, u10, v10, x10);
        if (typeof w10 === "function") {
            this.paramsGenerator_ = w10;
        }
        this.src = undefined;
        this.navPathStack = undefined;
        this.__mixedMode = new SynchedPropertySimpleOneWayPU(t10.mixedMode, this, "mixedMode");
        this.__darkMode = new SynchedPropertySimpleOneWayPU(t10.darkMode, this, "darkMode");
        this.__forceDarkAccess = new SynchedPropertySimpleOneWayPU(t10.forceDarkAccess, this, "forceDarkAccess");
        this.__nestedScroll = new SynchedPropertyObjectOneWayPU(t10.nestedScroll, this, 'nestedScroll');
        this.__controller = new SynchedPropertyNesedObjectPU(t10.controller, this, "controller");
        this.onMessage = () => {
        };
        this.onErrorReceive = () => {
        };
        this.onHttpErrorReceive = () => {
        };
        this.onPageBegin = () => {
        };
        this.onPageEnd = () => {
        };
        this.onProgressChange = () => {
        };
        this.onControllerAttached = undefined;
        this.onLoadIntercept = undefined;
        this.context = this.getUIContext().getHostContext();
        this.webViewController = new webView.WebviewController();
        this.schemeHandler = new webView.WebSchemeHandler();
        this.atomicService = undefined;
        this.atomicServiceProxy = undefined;
        this.setInitiallyProvidedValue(t10);
        this.finalizeConstruction();
    }

    setInitiallyProvidedValue(r10) {
        if (r10.src !== undefined) {
            this.src = r10.src;
        }
        if (r10.navPathStack !== undefined) {
            this.navPathStack = r10.navPathStack;
        }
        this.__controller.set(r10.controller);
        if (r10.onMessage !== undefined) {
            this.onMessage = r10.onMessage;
        }
        if (r10.onErrorReceive !== undefined) {
            this.onErrorReceive = r10.onErrorReceive;
        }
        if (r10.onHttpErrorReceive !== undefined) {
            this.onHttpErrorReceive = r10.onHttpErrorReceive;
        }
        if (r10.onPageBegin !== undefined) {
            this.onPageBegin = r10.onPageBegin;
        }
        if (r10.onPageEnd !== undefined) {
            this.onPageEnd = r10.onPageEnd;
        }
        if (r10.onProgressChange !== undefined) {
            this.onProgressChange = r10.onProgressChange;
        }
        if (r10.onControllerAttached !== undefined) {
            this.onControllerAttached = r10.onControllerAttached;
        }
        if (r10.onLoadIntercept !== undefined) {
            this.onLoadIntercept = r10.onLoadIntercept;
        }
        if (r10.context !== undefined) {
            this.context = r10.context;
        }
        if (r10.webViewController !== undefined) {
            this.webViewController = r10.webViewController;
        }
        if (r10.schemeHandler !== undefined) {
            this.schemeHandler = r10.schemeHandler;
        }
        if (r10.atomicService !== undefined) {
            this.atomicService = r10.atomicService;
        }
        if (r10.atomicServiceProxy !== undefined) {
            this.atomicServiceProxy = r10.atomicServiceProxy;
        }
    }

    updateStateVars(q10) {
        this.__mixedMode.reset(q10.mixedMode);
        this.__darkMode.reset(q10.darkMode);
        this.__forceDarkAccess.reset(q10.forceDarkAccess);
        this.__nestedScroll.reset(q10.nestedScroll);
        this.__controller.set(q10.controller);
    }

    purgeVariableDependenciesOnElmtId(p10) {
        this.__mixedMode.purgeDependencyOnElmtId(p10);
        this.__darkMode.purgeDependencyOnElmtId(p10);
        this.__forceDarkAccess.purgeDependencyOnElmtId(p10);
        this.__nestedScroll.purgeDependencyOnElmtId(p10);
        this.__controller.purgeDependencyOnElmtId(p10);
    }

    aboutToBeDeleted() {
        this.__mixedMode.aboutToBeDeleted();
        this.__darkMode.aboutToBeDeleted();
        this.__forceDarkAccess.aboutToBeDeleted();
        this.__nestedScroll.aboutToBeDeleted();
        this.__controller.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }

    get mixedMode() {
        return this.__mixedMode.get();
    }

    set mixedMode(t11) {
        this.__mixedMode.set(t11);
    }

    get darkMode() {
        return this.__darkMode.get();
    }

    set darkMode(s11) {
        this.__darkMode.set(s11);
    }

    get forceDarkAccess() {
        return this.__forceDarkAccess.get();
    }

    set forceDarkAccess(r11) {
        this.__forceDarkAccess.set(r11);
    }

    get nestedScroll() {
        return this.__nestedScroll.get();
    }

    set nestedScroll(d9) {
        this.__nestedScroll.set(d9);
    }

    get controller() {
        return this.__controller.get();
    }

    aboutToAppear() {
        if (!this.atomicService) {
            this.atomicService = new AtomicServiceApi(this.context, this.navPathStack, this.onMessage);
            this.atomicServiceProxy = new AtomicServiceProxy(this.atomicService);
        }
        try {
            let h2 = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
            if (h2?.appInfo?.appProvisionType === 'debug') {
                console.log(`AtomicServiceWeb setWebDebuggingAccess`);
                webView.WebviewController.setWebDebuggingAccess(true);
            }
        } catch (d2) {
            console.error(`AtomicServiceWeb set Web Debug Mode failed, code is ${d2.code}, message is ${d2.message}`);
        }
        this.initDomainCheckLog();
        HiAnalyticsUtil.reportComponentEvent();
    }

    aboutToDisappear() {
        this.atomicService?.notifyMessage();
    }

    initialRender() {
        this.observeComponentCreation2((g10, h10) => {
            Web.create({ src: this.src, controller: this.webViewController });
            Web.zoomAccess(false);
            Web.allowWindowOpenMethod(false);
            Web.domStorageAccess(true);
            Web.layoutMode(WebLayoutMode.NONE);
            Web.mixedMode(this.mixedMode);
            Web.darkMode(this.darkMode);
            Web.forceDarkAccess(this.forceDarkAccess);
            Web.nestedScroll(ObservedObject.GetRawObject(this.nestedScroll));
            Web.onErrorReceive((q11) => this.onCommonCallBack('onErrorReceive', q11, this.onErrorReceive));
            Web.onHttpErrorReceive((p11) => this.onCommonCallBack('onHttpErrorReceive', p11, this.onHttpErrorReceive));
            Web.onPageBegin((l10) => this.onCommonCallBack('onPageBegin', l10, this.onPageBegin));
            Web.onPageEnd((b11) => this.onCommonCallBack('onPageEnd', b11, this.onPageEnd));
            Web.onProgressChange((a11) => this.onCommonCallBack('onProgressChange', a11, this.onProgressChange));
            Web.onControllerAttached(() => {
                this.registerJavaScriptProxy();
                this.schemeHandler.onRequestStart((z10) => {
                    return !this.interceptUrl(z10.getRequestUrl(), z10.isMainFrame(), z10.getRequestResourceType());
                });
                this.webViewController.setWebSchemeHandler('http', this.schemeHandler);
                this.webViewController.setWebSchemeHandler('https', this.schemeHandler);
                this.initAtomicServiceWebController();
                if (this.onControllerAttached) {
                    try {
                        this.onControllerAttached();
                    } catch (y10) {
                        console.error(`AtomicServiceWeb onControllerAttached failed, code is ${y10.code}, message is ${y10.message}`);
                    }
                }
            });
            Web.onOverrideUrlLoading((i10) => {
                return !this.interceptOverrideUrlLoading(i10.getRequestUrl());
            });
            Web.onLoadIntercept(m7 => {
                let n7 = !this.checkUrl(m7.data.getRequestUrl());
                if (!n7 && this.onLoadIntercept) {
                    try {
                        return this.onLoadIntercept(m7);
                    } catch (u7) {
                        console.error(`AtomicServiceWeb onLoadIntercept failed, code is ${u7.code}, message is ${u7.message}`);
                        return true;
                    }
                }
                return n7;
            });
            Web.onPermissionRequest((c10) => { this.handleOnPermissionRequest(c10); });
        }, Web);
    }

    onCommonCallBack(q5, e6, j6) {
        try {
            j6 && j6(e6);
        } catch (k7) {
            console.error(`AtomicServiceWeb ${q5} failed, code is ${k7.code}, message is ${k7.message}`);
        }
    }

    registerJavaScriptProxy() {
        try {
            this.webViewController.registerJavaScriptProxy(this.atomicServiceProxy, JAVA_SCRIPT_PROXY_OBJECT_NAME,
                JAVA_SCRIPT_PROXY_API_NAME_LIST);
        } catch (d10) {
            let e10 = d10;
            console.error(`AtomicServiceWeb registerJavaScriptProxy failed, code is ${e10.code}, message is ${e10.message}`);
        }
    }

    initAtomicServiceWebController() {
        if (!this.controller) {
            return;
        }
        this.controller.setWebviewController(this.webViewController);
    }

    cutUrl(b10) {
        if (b10) {
            let c10 = b10.indexOf('?');
            if (c10 > -1) {
                return b10.substring(0, c10);
            }
        }
        return b10;
    }

    checkUrl(q1) {
        if (!q1) {
            return false;
        }
        if (q1.startsWith('resource://rawfile')) {
            return true;
        }
        try {
            let w1 = this.context.abilityInfo.bundleName;
            let t1 = 'webView';
            q1 = this.cutUrl(q1);
            let res = atomicServiceWebNapi.checkUrl(w1, t1, q1);
            console.debug(`AtomicServiceWeb checkUrl ret=${res === 0} url=${q1}`);
            return res === 0;
        } catch (j2) {
            let n2 = j2;
            console.error(`AtomicServiceWeb checkUrl failed, code is ${n2.code}, message is ${n2.message}`);
            return false;
        }
    }

    initDomainCheckLog() {
        try {
            let a9 = this.getAppId();
            let b9 = this.isCheckDomainBlockListAvailable();
            console.debug('AtomicServiceWeb initDomainCheckLog appId=' + a9 + ' checkDomainBlockListAvailable=' + b9);
        } catch (z8) {
            console.error('AtomicServiceWeb initDomainCheckLog error, message: ' + z8.message);
        }
    }

    getAppId() {
        let x8 = this.context.abilityInfo.bundleName;
        if (!x8) {
            return null;
        }
        let y8 = x8.split('.');
        if (!y8 || y8.length <= 0) {
            return null;
        }
        return y8[y8.length - 1];
    }

    isMainPageOrIframeRequest(m8, w8) {
        if (m8) {
            return true;
        }
        if (w8 === webView.WebResourceType.MAIN_FRAME ||
            w8 === webView.WebResourceType.SUB_FRAME) {
            return true;
        }
        return false;
    }

    isCheckDomainBlockListAvailable() {
        if (!atomicBasicEngine || !atomicBasicEngine.default) {
            return false;
        }
        return typeof atomicBasicEngine.default.checkDomainBlockList === 'function';
    }

    interceptUrl(s8, t8, u8) {
        if (!s8) {
            return false;
        }
        if (s8.startsWith(RESOURCE_RAWFILE)) {
            return true;
        }
        if (this.isMainPageOrIframeRequest(t8, u8)) {
            return this.checkUrl(s8);
        }
        if (this.isCheckDomainBlockListAvailable()) {
            return this.checkUrlNew(s8);
        }
        return true;
    }

    checkUrlNew(n8) {
        let o8 = this.getAppId();
        if (!o8) {
            console.error('AtomicServiceWeb checkUrlNew error, appId is invalid');
            return false;
        }
        try {
            let q8 = this.cutUrl(n8);
            let r8 = atomicBasicEngine.default.checkDomainBlockList(q8, o8);
            console.debug(`AtomicServiceWeb checkUrlNew ret=${!r8} url=${q8}`);
            return !r8;
        } catch (p8) {
            console.error(`AtomicServiceWeb checkUrlNew error, code: ${p8.code}, message: ${p8.message}`);
            return true;
        }
    }

    interceptOverrideUrlLoading(m8) {
        if (!m8) {
            return false;
        }
        if (m8.startsWith(TEL_PROTOCOL)) {
            this.openMakeCall(m8);
            return false;
        }
        if (m8.startsWith(MAILTO_PROTOCOL)) {
            this.openSendMail(m8);
            return false;
        }
        return this.checkUrl(m8);
    }

    openMakeCall(i8) {
        if (!i8 || !i8.startsWith(TEL_PROTOCOL)) {
            return;
        }
        try {
            let k8 = i8.substring(TEL_PROTOCOL.length);
            call.makeCall(k8).catch((l8) => {
                console.error(`AtomicServiceWeb openMakeCall error, code: ${l8.code}, message: ${l8.message}`);
            });
        } catch (j8) {
            console.error(`AtomicServiceWeb openMakeCall error, code: ${j8.code}, message: ${j8.message}`);
        }
    }

    openSendMail(f8) {
        if (!f8 || !f8.startsWith(MAILTO_PROTOCOL)) {
            return;
        }
        try {
            this.context.startAbility({
                action: WANT_ACTION_SEND_TO_DATA,
                uri: f8
            }).catch((h8) => {
                console.error(`AtomicServiceWeb openSendMail error, code: ${h8.code}, message: ${h8.message}`);
            });
        } catch (g8) {
            console.error(`AtomicServiceWeb openSendMail error, code: ${g8.code}, message: ${g8.message}`);
        }
    }

    handleOnPermissionRequest(t8) {
        if (this.checkPermissionRequest(t8)) {
            t8.request.grant(t8.request.getAccessibleResource());
        } else {
            t8.request.deny();
        }
    }

    checkPermissionRequest(o8) {
        let p8 = o8.request.getAccessibleResource();
        if (!p8 || p8.length <= 0) {
            return false;
        }
        let q8 = this.getAppId();
        if (!q8) {
            console.error('AtomicServiceWeb checkPermissionRequest error, appId is invalid');
            return false;
        }
        for (let r8 of p8) {
            let s8 = WEB_PERMISSIONS[r8];
            if (!s8) {
                console.error('AtomicServiceWeb checkPermissionRequest error, permission is not support');
                return false;
            }
            if (!this.isPermissionUserGranted(s8)) {
                return false;
            }
            if (!this.isPermissionWhiteListAllow(q8, s8)) {
                return false;
            }
        }
        return true;
    }

    isPermissionUserGranted(j8) {
        try {
            let l8 = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
            if (!l8?.appInfo?.accessTokenId) {
                return false;
            }
            let m8 = l8.appInfo.accessTokenId;
            let n8 = abilityAccessCtrl.createAtManager()
                .checkAccessTokenSync(m8, j8);
            if (n8 !== abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) {
                console.error(`AtomicServiceWeb isPermissionGranted permission ${j8} is not grant`);
                return false;
            }
            return true;
        } catch (k8) {
            console.error(`AtomicServiceWeb isPermissionGranted error, code: ${k8.code}, message: ${k8.message}`);
            return false;
        }
    }

    isPermissionWhiteListAllow(f8, g8) {
        if (!atomicBasicEngine || !atomicBasicEngine.default ||
            typeof atomicBasicEngine.default.checkAtomicServiceAllow !== 'function') {
            console.error('AtomicServiceWeb isPermissionRequestAllow error, checkAtomicServiceAllow is not available');
            return false;
        }
        try {
            let i8 = atomicBasicEngine.default.checkAtomicServiceAllow(f8, g8, TYPE_AS_WEB);
            console.debug(`AtomicServiceWeb isPermissionRequestAllow ret=${i8} permission=${g8}`);
            return i8;
        } catch (h8) {
            console.error(`AtomicServiceWeb isPermissionRequestAllow error, code: ${h8.code}, message: ${h8.message}`);
            return false;
        }
    }

    rerender() {
        this.updateDirtyElements();
    }
}
let AtomicServiceWebController = class AtomicServiceWebController {
    setWebviewController(l5) {
        this.webViewController = l5;
    }

    checkWebviewController() {
        if (!this.webViewController) {
            const d5 = {
                name: '',
                message: 'Init error. The AtomicServiceWebController must be associated with a AtomicServiceWeb component.',
                code: 17100001,
            };
            throw d5;
        }
    }

    getUserAgent() {
        this.checkWebviewController();
        return this.webViewController?.getUserAgent();
    }

    getCustomUserAgent() {
        this.checkWebviewController();
        return this.webViewController?.getCustomUserAgent();
    }

    setCustomUserAgent(z4) {
        this.checkWebviewController();
        this.webViewController?.setCustomUserAgent(z4);
    }

    accessForward() {
        this.checkWebviewController();
        return this.webViewController?.accessForward();
    }

    accessBackward() {
        this.checkWebviewController();
        return this.webViewController?.accessBackward();
    }

    accessStep(d4) {
        this.checkWebviewController();
        return this.webViewController?.accessStep(d4);
    }

    forward() {
        this.checkWebviewController();
        this.webViewController?.forward();
    }

    backward() {
        this.checkWebviewController();
        this.webViewController?.backward();
    }

    refresh() {
        this.checkWebviewController();
        this.webViewController?.refresh();
    }

    loadUrl(t3, y3) {
        this.checkWebviewController();
        if (y3) {
            this.webViewController?.loadUrl(t3, y3);
        } else {
            this.webViewController?.loadUrl(t3);
        }
    }
};
AtomicServiceWebController = __decorate([
    Observed
], AtomicServiceWebController);

export { AtomicServiceWebController };

class AtomicServiceProxy {
    constructor(z9) {
        this.atomicService = z9;
    }
    invokeJsApi(apiNameAlias, options) {
        try {
            this.atomicService.reportBeginEvent(apiNameAlias);
            options = options || {};
            if (options instanceof Object) {
                options.apiNameAlias = apiNameAlias;
            }
            if (!apiNameAlias || !ATOMIC_SERVICE_JS_API_MAP.has(apiNameAlias)) {
                this.atomicService.errorWithCodeAndMsg(JS_API_INVALID_INVOKE_ERROR, options);
                return;
            }
            let jsApiConfig = ATOMIC_SERVICE_JS_API_MAP.get(apiNameAlias);
            if (!this.atomicService.checkRequiredFieldInOptions(jsApiConfig, options)) {
                return;
            }
            let atomicService = this.atomicService;
            atomicService[jsApiConfig?.apiName](options);
        }
        catch (err) {
            this.atomicService.error(err, options);
        }
    }
}

class AtomicService {
    constructor(q9, r9, s9) {
        this.messageDataList = [];
        this.onMessage = () => {
        };
        this.context = q9;
        this.navPathStack = r9;
        this.onMessage = s9 ? s9 : this.onMessage;
    }

    success(o9, p9) {
        this.reportSuccessEvent(p9.apiNameAlias);
        try {
            p9?.callback && p9?.callback(undefined, o9);
        } catch (f3) {
            this.consoleError(`callback error, code is ${f3.code}, message is ${f3.message}`);
        }
    }

    error(m9, n9) {
        this.reportFailEvent(n9.apiNameAlias, m9.code);
        try {
            n9?.callback && n9?.callback(new AsError(m9.code ? m9.code : SYSTEM_INTERNAL_ERROR.code,
                m9.message ? m9.message : SYSTEM_INTERNAL_ERROR.message));
        } catch (a3) {
            this.consoleError(`callback error, code is ${a3.code}, message is ${a3.message}`);
        }
    }

    errorWithCodeAndMsg(k9, l9) {
        this.reportFailEvent(l9.apiNameAlias, k9.code);
        try {
            l9?.callback && l9?.callback(k9);
        } catch (u2) {
            this.consoleError(`callback error, code is ${u2.code}, message is ${u2.message}`);
        }
    }

    consoleLog(j9) {
        if (LOG_ENABLE) {
            console.log(`${LOG_PREFIX} ${j9}`);
        }
    }

    consoleError(i9) {
        if (LOG_ENABLE) {
            console.error(`${LOG_PREFIX} ${i9}`);
        }
    }

    logOptions(g9, h9) {
        this.consoleLog(`${g9} options=${JSON.stringify(h9)}`);
    }

    checkParamRequired(d9, e9, f9) {
        if (e9 === undefined || e9 === null || e9 === '') {
            this.errorWithCodeAndMsg(new AsError(PARAM_REQUIRED_ERROR_CODE, `Param ${d9} is required.`), f9);
            return false;
        }
        return true;
    }

    checkNumberParamPositive(a9, b9, c9) {
        if (b9 <= 0) {
            this.errorWithCodeAndMsg(new AsError(PARAM_NUMBER_POSITIVE_ERROR_CODE,
                `Param ${a9} must be a positive number.`), c9);
            return false;
        }
        return true;
    }

    checkRequiredFieldInOptions(v8, w8) {
        if (!v8) {
            return false;
        }
        if (!v8.requiredFieldNames) {
            return true;
        }
        let x8 = w8;
        for (let y8 = 0; y8 < v8.requiredFieldNames.length; y8++) {
            let z8 = v8.requiredFieldNames[y8];
            if (!this.checkParamRequired(z8, x8[z8], w8)) {
                return false;
            }
        }
        return true;
    }

    checkRouterMode(t8, u8) {
        if (!t8 || t8 === 'Single' || t8 === 'Standard') {
            return true;
        }
        this.errorWithCodeAndMsg(ROUTER_PARAM_MODE_INVALID_ERROR, u8);
        return false;
    }

    parseRouterMode(s8) {
        return s8 === 'Single' ? router.RouterMode.Single : router.RouterMode.Standard;
    }

    getRouterIndexByDelta(o8) {
        let p8 = Number.parseInt(router.getLength());
        for (let q8 = p8; q8 > 0; q8--) {
            let r8 = router.getStateByIndex(q8);
            if (r8?.name && o8-- == 0) {
                return q8;
            }
        }
        return 1;
    }

    checkBackUrlExists(i8, j8) {
        let k8 = Number.parseInt(router.getLength());
        for (let l8 = k8; l8 > 0; l8--) {
            let m8 = router.getStateByIndex(l8);
            if (m8?.name) {
                let n8 = m8?.path + m8?.name;
                if (n8 === i8) {
                    return true;
                }
            }
        }
        this.errorWithCodeAndMsg(BACK_URL_NOT_EXIST_OR_OPENED_ERROR, j8);
        return false;
    }

    checkNavPathStack(g8, h8) {
        if (!this.navPathStack) {
            this.errorWithCodeAndMsg(new AsError(NAV_PATH_STACK_NOT_EXIST_ERROR_CODE,
                `Current page is not NavDestination, not support ${g8}().`), h8);
            return false;
        }
        return true;
    }

    getNavPathIndexByDelta(e8) {
        let f8 = this.navPathStack?.getAllPathName();
        if (!f8 || f8.length == 0) {
            return -1;
        }
        return f8.length > e8 ? (f8.length - e8 - 1) : -1;
    }

    onPopHandler(c8, d8) {
        if (!c8?.info || !d8) {
            return;
        }
        d8(new OnPopEvent(c8.info.name, c8.info.param, c8.result));
    }

    getCurrentNavPathInfo() {
        let a8 = this.navPathStack?.getAllPathName();
        let b8 = (a8 && a8.length > 0) ?
            new NavPathInfo(a8[a8.length - 1], a8.length - 1) : new NavPathInfo(undefined, -1);
        if (b8.index >= 0) {
            b8.param = this.navPathStack?.getParamByIndex(b8.index);
        }
        return b8;
    }

    notifyMessage() {
        if (this.messageDataList.length <= 0) {
            return;
        }
        try {
            this.onMessage(new OnMessageEvent(this.messageDataList));
        } catch (q2) {
            this.consoleError(`onMessage failed, code is ${q2.code}, message is ${q2.message}`);
        }
        this.messageDataList = [];
    }

    isJsApiEnable(z7) {
        if (!z7) {
            return false;
        }
        if (this.compareVersion(z7.minVersion, ATOMIC_SERVICE_JS_SDK_CURRENT_VERSION) &&
        this.compareVersion(ATOMIC_SERVICE_JS_SDK_CURRENT_VERSION, z7.maxVersion)) {
            return true;
        }
        return false;
    }

    compareVersion(p7, q7) {
        if (!p7 || !q7) {
            return false;
        }
        let r7 = p7.split('.').map(y7 => Number.parseInt(y7));
        let s7 = q7.split('.').map(x7 => Number.parseInt(x7));
        const t7 = Math.max(r7.length, s7.length);
        for (let w7 = 0; w7 < t7; w7++) {
            if (r7[w7] < s7[w7]) {
                return true;
            } else if (r7[w7] > s7[w7]) {
                return false;
            }
        }
        if (r7.length < s7.length) {
            return true;
        }
        if (r7.length > s7.length) {
            return false;
        }
        return true;
    }

    getUri(o7) {
        if (!o7 || o7.startsWith('file://')) {
            return o7;
        }
        return fileUri.getUriFromPath(o7);
    }

    async checkUploadFile(e7) {
        if (!e7.files || e7.files.length <= 0) {
            this.errorWithCodeAndMsg(UPLOAD_IMAGE_FILES_REQUIRED_ERROR, e7);
            return new CheckUploadFileResult(false);
        }
        let f7 = new Map();
        for (let g7 = 0; g7 < e7.files?.length; g7++) {
            let h7 = e7.files[g7];
            if (!h7.uri) {
                this.errorWithCodeAndMsg(UPLOAD_IMAGE_FILES_URI_REQUIRED_ERROR, e7);
                return new CheckUploadFileResult(false);
            }
            if (!h7.uri.startsWith('file://') && !fs.accessSync(h7.uri, fs.AccessModeType.EXIST)) {
                this.errorWithCodeAndMsg(new AsError(UPLOAD_IMAGE_FILE_NOT_EXIST_ERROR_CODE,
                    `File uri ${h7.uri} is not exist.`), e7);
                return new CheckUploadFileResult(false);
            }
            let i7 = h7.uri;
            let j7 = h7.uri;
            if (j7.indexOf(UPLOAD_IMAGE_CACHE_DIR) < 0) {
                let l7 = j7.startsWith('file://') ? j7 : fileUri.getUriFromPath(h7.uri);
                j7 = this.context.cacheDir + '/' + j7.substring(j7.lastIndexOf('/') + 1);
                try {
                    await fs.copy(l7, fileUri.getUriFromPath(j7));
                } catch (x1) {
                    this.errorWithCodeAndMsg(UPLOAD_FILE_ERROR, e7);
                    return new CheckUploadFileResult(false);
                }
            }
            h7.uri = 'internal://' + j7.substring(j7.indexOf(UPLOAD_IMAGE_CACHE_DIR) + 1);
            f7.set(j7, i7);
        }
        return new CheckUploadFileResult(true, f7);
    }

    convertToRequestData(a7) {
        let b7 = [];
        if (a7) {
            a7.forEach(d7 => {
                if (!d7.name || !d7.value) {
                    return;
                }
                b7.push({ name: d7.name, value: d7.value });
            });
        }
        return b7;
    }

    convertToFile(w6) {
        let x6 = [];
        if (w6) {
            w6.forEach(z6 => {
                x6.push({
                    filename: z6.filename,
                    name: z6.name,
                    uri: z6.uri,
                    type: z6.type
                });
            });
        }
        return x6;
    }

    handleUploadFileResult(p6, q6, r6) {
        let s6 = [];
        if (p6) {
            p6.forEach(u6 => {
                let v6 = u6.path ? q6.get(u6.path) : u6.path;
                s6.push(new UploadFileTaskState(v6 ? v6 : u6.path, u6.responseCode, u6.message));
            });
        }
        this.success(new UploadFileResult(s6), r6);
    }

    parseFileNameFromUrl(m6) {
        if (!m6) {
            return '';
        }
        let n6 = m6.split('?')[0];
        if (n6.indexOf('/') < 0) {
            return '';
        }
        let o6 = n6.lastIndexOf('/');
        if (o6 == (n6.length - 1)) {
            return '';
        }
        return n6.substring(o6 + 1);
    }

    checkAccessToken(v5) {
        let w5 = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
        let x5 = w5.appInfo.accessTokenId;
        let y5 = abilityAccessCtrl.createAtManager();
        return y5.checkAccessToken(x5, v5);
    }

    checkPermissions(j5, k5) {
        this.checkAccessToken(j5).then(o5 => {
            if (o5 == abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) {
                k5(undefined);
            } else {
                let p5 = abilityAccessCtrl.createAtManager();
                p5.requestPermissionsFromUser(this.context, [j5]).then(t5 => {
                    for (let u5 = 0; u5 < t5.authResults.length; u5++) {
                        if (t5.authResults[u5] != 0) {
                            const error = {
                                name: '',
                                message: `RequestPermissionsFromUser error. authResult: ${t5.authResults[u5]}.`,
                                code: PERMISSION_LOCATION_USER_REFUSED_ERROR
                            };
                            k5(error);
                            return;
                        }
                    }
                    k5(undefined);
                }).catch((s5) => {
                    k5(s5);
                });
            }
        }).catch((n5) => {
            k5(n5);
        });
    }
    /**
     * 判断是否需要打点
     *
     * @param apiNameAlias 接口别名
     * @return 是否需要打点
     */
    isNeedReport(apiName) {
        return NEED_REPORTED_API_LIST.includes(apiName);
    }
    /**
     * 上报Api调用开始的打点
     *
     * @param apiNameAlias 接口别名
     */
    reportBeginEvent(apiNameAlias) {
        const apiName = `has.${apiNameAlias}`;
        if (this.isNeedReport(apiName)) {
            HiAnalyticsUtil.reportApiEvent(apiName, ActionState.BEGIN);
        }
    }
    /**
     * 上报Api调用成功的打点
     *
     * @param apiNameAlias 接口别名
     */
    reportSuccessEvent(apiNameAlias) {
        const apiName = `has.${apiNameAlias}`;
        if (this.isNeedReport(apiName)) {
            HiAnalyticsUtil.reportApiEvent(apiName, ActionState.SUCCESS);
        }
    }
    /**
     * 上报Api调用失败的打点
     *
     * @param apiNameAlias 接口别名
     * @param errCode 错误码
     */
    reportFailEvent(apiNameAlias, errCode) {
        const apiName = `has.${apiNameAlias}`;
        if (this.isNeedReport(apiName)) {
            HiAnalyticsUtil.reportApiEvent(apiName, ActionState.FAIL, errCode);
        }
    }
}

class AtomicServiceApi extends AtomicService {
    constructor(g5, h5, i5) {
        super(g5, h5, i5);
    }

    pushUrl(c5) {
        if (!this.checkRouterMode(c5.mode, c5)) {
            return;
        }
        router.pushUrl({ url: c5.url, params: c5.params }, this.parseRouterMode(c5.mode)).then(() => {
            this.success(new PushUrlResult(), c5);
        }).catch((f5) => {
            this.error(f5, c5);
        });
    }

    replaceUrl(y4) {
        if (!this.checkRouterMode(y4.mode, y4)) {
            return;
        }
        router.replaceUrl({ url: y4.url, params: y4.params }, this.parseRouterMode(y4.mode)).then(() => {
            this.success(new ReplaceUrlResult(), y4);
        }).catch((b5) => {
            this.error(b5, y4);
        });
    }

    backUrl(x4) {
        if (x4.url) {
            if (!this.checkBackUrlExists(x4.url, x4)) {
                return;
            }
            router.back({ url: x4.url, params: x4.params });
            this.success(new BackUrlResult(), x4);
        } else if (x4.index || x4.index === 0) {
            if (!this.checkNumberParamPositive('index', x4.index, x4)) {
                return;
            }
            router.back(x4.index, x4.params);
            this.success(new BackUrlResult(), x4);
        } else if (x4.delta || x4.delta === 0) {
            if (!this.checkNumberParamPositive('delta', x4.delta, x4)) {
                return;
            }
            router.back(this.getRouterIndexByDelta(x4.delta), x4.params);
            this.success(new BackUrlResult(), x4);
        } else {
            router.back();
            this.success(new BackUrlResult(), x4);
        }
    }

    clearUrl(w4) {
        router.clear();
        this.success(new ClearUrlResult(), w4);
    }

    pushPath(u4) {
        if (!this.checkNavPathStack('navPathStack.pushPath', u4)) {
            return;
        }
        this.navPathStack?.pushPath({
            name: u4.name,
            param: u4.param,
            onPop: v4 => this.onPopHandler(v4, u4.onPop)
        }, u4.animated);
        this.success(new PushPathResult(), u4);
    }

    replacePath(s4) {
        if (!this.checkNavPathStack('navPathStack.replacePath', s4)) {
            return;
        }
        this.navPathStack?.replacePath({
            name: s4.name,
            param: s4.param,
            onPop: t4 => this.onPopHandler(t4, s4.onPop)
        }, s4.animated);
        this.success(new ReplacePathResult(), s4);
    }

    popPath(p4) {
        if (!this.checkNavPathStack('navPathStack.pop', p4)) {
            return;
        }
        if (p4.name) {
            let r4 = this.navPathStack?.popToName(p4.name, p4.result, p4.animated);
            if (r4 === undefined || r4 === -1) {
                this.errorWithCodeAndMsg(POP_PATH_NAME_NOT_EXIST_ERROR, p4);
                return;
            }
        } else if (p4.index || p4.index === 0) {
            if (p4.index < -1) {
                this.errorWithCodeAndMsg(POP_PATH_PARAM_INDEX_INVALID_ERROR, p4);
                return;
            }
            if (p4.index > this.getCurrentNavPathInfo().index) {
                this.errorWithCodeAndMsg(POP_PATH_INDEX_OUT_OF_RANGE_ERROR, p4);
                return;
            }
            this.navPathStack?.popToIndex(p4.index, p4.result, p4.animated);
        } else if (p4.delta || p4.delta === 0) {
            if (!this.checkNumberParamPositive('delta', p4.delta, p4)) {
                return;
            }
            this.navPathStack?.popToIndex(this.getNavPathIndexByDelta(p4.delta), p4.result, p4.animated);
        } else {
            this.navPathStack?.pop(p4.result, p4.animated);
        }
        let q4 = this.getCurrentNavPathInfo();
        this.success(new PopPathResult(q4.name, q4.index, q4.param), p4);
    }

    clearPath(o4) {
        if (!this.checkNavPathStack('navPathStack.clear', o4)) {
            return;
        }
        this.navPathStack?.clear(o4.animated);
        this.success(new ClearPathResult(), o4);
    }

    postMessage(n4) {
        n4.data && this.messageDataList.push(n4.data);
        this.success(new PostMessageResult(), n4);
    }

    getEnv(l4) {
        let m4 = new GetEnvResult();
        m4.deviceType = deviceInfo.deviceType;
        m4.brand = deviceInfo.brand;
        m4.productModel = deviceInfo.productModel;
        m4.osFullName = deviceInfo.osFullName;
        this.success(m4, l4);
    }

    checkJsApi(h4) {
        let i4 = new Map();
        h4.jsApiList?.forEach(k4 => {
            i4[k4] = this.isJsApiEnable(ATOMIC_SERVICE_JS_API_MAP.get(k4));
        });
        this.success(new CheckJsApiResult(i4), h4);
    }

    pickCamera(c4) {
        picker.pick(this.context, c4.mediaTypes, {
            cameraPosition: c4.cameraPosition,
            saveUri: c4.saveUri,
            videoDuration: c4.videoDuration
        }).then((g4) => {
            this.success(new PickCameraResult(g4.resultCode, g4.resultUri, g4.mediaType), c4);
        }).catch((f4) => {
            this.error(f4, c4);
        });
    }

    selectPhoto(w3) {
        let x3 = new photoAccessHelper.PhotoViewPicker();
        x3.select({
            MIMEType: w3.mimeType,
            maxSelectNumber: w3.maxSelectNumber,
            isPhotoTakingSupported: w3.isPhotoTakingSupported,
            isEditSupported: w3.isEditSupported,
            isSearchSupported: w3.isSearchSupported,
            recommendationOptions: {
                recommendationType: w3.recommendationType
            },
            preselectedUris: w3.preselectedUris
        }).then((b4) => {
            this.success(new SelectPhotoResult(b4.photoUris, b4.isOriginalPhoto), w3);
        }).catch((a4) => {
            this.error(a4, w3);
        });
    }

    openPreview(n3) {
        let o3 = this.getUri(n3.uri);
        filePreview.openPreview(this.context, {
            uri: o3,
            mimeType: n3.mimeType,
            title: n3.title
        }).then(() => {
            this.success(new OpenPreviewResult(), n3);
        }).catch((v3) => {
            this.error(v3, n3);
        });
    }

    uploadFile(z2) {
        this.checkUploadFile(z2).then(d3 => {
            if (!d3.checkResult) {
                return;
            }
            let e3 = {
                url: z2.url,
                header: z2.header,
                method: z2.method,
                files: this.convertToFile(z2.files),
                data: this.convertToRequestData(z2.data)
            };
            request.uploadFile(this.context, e3).then((i3) => {
                i3.on('complete', (m3) => {
                    this.handleUploadFileResult(m3, d3.uriMap, z2);
                });
                i3.on('fail', (l3) => {
                    this.handleUploadFileResult(l3, d3.uriMap, z2);
                });
            }).catch((h3) => {
                this.error(h3, z2);
            });
        }).catch((c3) => {
            this.error(c3, z2);
        });
    }

    downloadFile(m2) {
        let o2 = `${util.generateRandomUUID().replaceAll('-', '')}`;
        let p2 = `${this.context.cacheDir}/${o2}`;
        request.downloadFile(this.context, {
            url: m2.url,
            header: m2.header ? m2.header : new Object(),
            filePath: p2,
            enableMetered: m2.enableMetered,
            enableRoaming: m2.enableRoaming,
            networkType: m2.networkType,
            background: false
        }).then((t2) => {
            t2.on('complete', () => {
                this.success(new DownloadFileResult(p2), m2);
            });
            t2.on('fail', w2 => {
                this.errorWithCodeAndMsg(new AsError(w2, 'File download fail.'), m2);
            });
        }).catch((s2) => {
            this.error(s2, m2);
        });
    }

    getNetworkType(c2) {
        connection.getDefaultNet().then(g2 => {
            if (!g2 || g2.netId === 0) {
                this.errorWithCodeAndMsg(NETWORK_NO_ACTIVE_ERROR, c2);
                return;
            }
            connection.getNetCapabilities(g2).then(k2 => {
                let l2 = new GetNetworkTypeResult(k2.bearerTypes, k2.networkCap, k2.linkUpBandwidthKbps,
                    k2.linkDownBandwidthKbps);
                this.success(l2, c2);
            }).catch((j2) => {
                this.error(j2, c2);
            });
        }).catch((f2) => {
            this.error(f2, c2);
        });
    }

    getLocation(u1) {
        this.checkPermissions(PERMISSION_APPROXIMATELY_LOCATION, w1 => {
            if (w1) {
                this.error(w1, u1);
                return;
            }
            geoLocationManager.getCurrentLocation({
                priority: u1.priority,
                scenario: u1.scenario,
                maxAccuracy: u1.maxAccuracy,
                timeoutMs: u1.timeoutMs
            }).then(a2 => {
                let b2 =
                    new GetLocationResult(a2.latitude, a2.longitude, a2.altitude, a2.accuracy, a2.speed, a2.timeStamp,
                        a2.direction, a2.timeSinceBoot, a2.additions, a2.additionSize);
                this.success(b2, u1);
            }).catch((z1) => {
                this.error(z1, u1);
            });
        });
    }

    login(c2) {
        let d2 = new authentication.HuaweiIDProvider().createLoginWithHuaweiIDRequest();
        d2.forceLogin = false;
        d2.state = util.generateRandomUUID();
        let e2 = new authentication.AuthenticationController();
        e2.executeRequest(d2).then((g2) => {
            if (!g2 || !g2.data) {
                this.errorWithCodeAndMsg(LOGIN_RESPONSE_DATA_NULL_ERROR, c2);
                return;
            }
            if (d2.state !== g2.state) {
                this.errorWithCodeAndMsg(LOGIN_STATE_INVALID_ERROR, c2);
                return;
            }
            this.success(new LoginResult(g2.data.openID, g2.data.unionID, g2.data.authorizationCode, g2.data.idToken),
                c2);
        }).catch((f2) => {
            this.error(f2, c2);
        });
    }

    requestPayment(a2) {
        if (typeof a2.orderStr !== 'string') {
            this.errorWithCodeAndMsg(REQUEST_PAYMENT_ORDER_STR_INVALID_ERROR, a2);
            return;
        }
        paymentService.requestPayment(this.context, a2.orderStr).then(() => {
            this.success(new RequestPaymentResult(), a2);
        }).catch((b2) => {
            this.error(b2, a2);
        });
    }
}

class NavPathInfo {
    constructor(s1, t1) {
        this.name = s1;
        this.index = t1;
    }
}

class CheckUploadFileResult {
    constructor(q1, r1) {
        this.checkResult = q1;
        this.uriMap = r1;
    }
}

class BaseOptions {
}

class PushUrlOptions extends BaseOptions {
}

class PushUrlResult {
}

class ReplaceUrlOptions extends BaseOptions {
}

class ReplaceUrlResult {
}

class BackUrlOptions extends BaseOptions {
}

class BackUrlResult {
}

class ClearUrlOptions extends BaseOptions {
}

class ClearUrlResult {
}

class OnPopEvent {
    constructor(n1, o1, p1) {
        this.name = n1;
        this.param = o1;
        this.result = p1;
    }
}

class PushPathOptions extends BaseOptions {
}

class PushPathResult {
}

class ReplacePathOptions extends BaseOptions {
}

class ReplacePathResult {
}

class PopPathOptions extends BaseOptions {
}

class PopPathResult {
    constructor(k1, l1, m1) {
        this.name = k1;
        this.index = l1;
        this.param = m1;
    }
}

class ClearPathOptions extends BaseOptions {
}

class ClearPathResult {
}

class PostMessageOptions extends BaseOptions {
}

class PostMessageResult {
}

export class OnMessageEvent {
    constructor(j1) {
        this.data = j1;
    }
}

export class OnErrorReceiveEvent {
    constructor(h1, i1) {
        this.request = h1;
        this.error = i1;
    }
}

export class OnHttpErrorReceiveEvent {
    constructor(f1, g1) {
        this.request = f1;
        this.response = g1;
    }
}

export class OnPageBeginEvent {
    constructor(e1) {
        this.url = e1;
    }
}

export class OnPageEndEvent {
    constructor(d1) {
        this.url = d1;
    }
}

export class WebHeader {
    constructor(j3, p3) {
        this.headerKey = j3;
        this.headerValue = p3;
    }
}

class GetEnvOptions extends BaseOptions {
}

class GetEnvResult {
}

class CheckJsApiOptions extends BaseOptions {
}

class CheckJsApiResult {
    constructor(c1) {
        this.checkResult = c1;
    }
}

class PickCameraOptions extends BaseOptions {
}

class PickCameraResult {
    constructor(z, a1, b1) {
        this.resultCode = z;
        this.resultUri = a1;
        this.mediaType = b1;
    }
}

class SelectPhotoOptions extends BaseOptions {
}

class SelectPhotoResult {
    constructor(x, y) {
        this.photoUris = x;
        this.isOriginalPhoto = y;
    }
}

class OpenPreviewOptions extends BaseOptions {
}

class OpenPreviewResult {
}

class UploadFileOptions extends BaseOptions {
}

class UploadFile {
    constructor(t, u, v, w) {
        this.filename = t;
        this.name = u;
        this.uri = v;
        this.type = w;
    }
}

class UploadRequestData {
}

class UploadFileResult {
    constructor(s) {
        this.taskStates = s;
    }
}

class UploadFileTaskState {
    constructor(p, q, r) {
        this.path = p;
        this.responseCode = q;
        this.message = r;
    }
}

class DownloadFileOptions extends BaseOptions {
}

class DownloadFileResult {
    constructor(o) {
        this.uri = o;
    }
}

class GetNetworkTypeOptions extends BaseOptions {
}

class GetNetworkTypeResult {
    constructor(k, l, m, n) {
        this.bearerTypes = k;
        this.networkCap = l;
        this.linkUpBandwidthKbps = m;
        this.linkDownBandwidthKbps = n;
    }
}

class GetLocationOptions extends BaseOptions {
}

class GetLocationResult {
    constructor(a, b, c, d, e, f, g, h, i, j) {
        this.latitude = a;
        this.longitude = b;
        this.altitude = c;
        this.accuracy = d;
        this.speed = e;
        this.timeStamp = f;
        this.direction = g;
        this.timeSinceBoot = h;
        this.additions = i;
        this.additionSize = j;
    }
}

class LoginOptions extends BaseOptions {
}

class LoginResult {
    constructor(a, b, c, d) {
        this.code = c;
        this.idToken = d;
        this.openID = a;
        this.unionID = b;
    }
}

class RequestPaymentOptions extends BaseOptions {
}

class RequestPaymentResult {
}

class HiAnalyticsUtil {
    /**
     * 打点数据上报
     *
     * @param time 时间戳
     * @param content 打点参数json字符串
     */
    static writeEndEvent(time, content) {
        console.info(`writeEndEvent ->  time: ${time} ,content: ${content} `);
        let event = {
            domain: 'api_diagnostic',
            name: 'api_exec_end',
            params: {
                api_name: 'ascf',
                sdk_name: 'atomicservice_web',
                begin_time: time,
                // 调用次数
                call_times: 3,
                // 调用成功次数
                success_times: 1,
                contents: content
            },
            eventType: hiAppEvent.EventType.BEHAVIOR
        };
        hiAppEvent.write(event);
    }
    /**
     * 应用的唯一标识
     */
    static initAnalytics() {
        if (!HiAnalyticsUtil.processorId) {
            HiAnalyticsUtil.addEventProcessor();
        }
        if (HiAnalyticsUtil.appIdentifier && HiAnalyticsUtil.runningMode) {
            return;
        }
        let bundleInfo = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO |
            bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
        HiAnalyticsUtil.appIdentifier = bundleInfo.signatureInfo.appIdentifier;
        HiAnalyticsUtil.runningMode = bundleInfo.appInfo.appProvisionType;
    }
    /**
     * 添加处理者
     */
    static addEventProcessor() {
        let processor = {
            name: 'ha_app_event',
            appId: 'com_huawei_hmos_sdk_ocg',
            routeInfo: 'AUTO',
            eventConfigs: [
                {
                    domain: 'api_diagnostic',
                    name: 'api_exec_end',
                    isRealTime: false
                },
                {
                    domain: 'api_diagnostic',
                    name: 'api_called_stat',
                    isRealTime: true
                },
                {
                    domain: 'api_diagnostic',
                    name: 'api_called_stat_cnt',
                    isRealTime: true
                },
            ],
            periodReport: 90,
            batchReport: 30
        };
        return hiAppEvent.addProcessor(processor);
    }
    /**
     * asweb jssdk API数据打点业务处理
     *
     * @param apiName 接口名
     * @param actionState 接口调用状态
     * @param errorNumber 错误码
     */
    static reportApiEvent(apiName, actionState, errorNumber) {
        try {
            if (!apiName || !actionState) {
                return;
            }
            HiAnalyticsUtil.initAnalytics();
            const ascfAction = 'APICaller_' + apiName;
            const content = JSON.stringify({
                appIdentify: HiAnalyticsUtil.appIdentifier,
                ascfVersionName: deviceInfo.displayVersion,
                runningMode: HiAnalyticsUtil.runningMode,
                ascfAction,
                caller: 'ASWeb',
                actionState,
                errorNumber
            });
            HiAnalyticsUtil.writeEndEvent(new Date().getTime(), content);
        }
        catch (err) {
            console.error(`reportApiEvent -> reportApiEvent error, message: ${err.message}`);
        }
    }
    /**
     * asweb 组件创建打点
     *
     * @param apiName 接口名
     * @param actionState 接口调用状态
     * @param errorNumber 错误码
     */
    static reportComponentEvent() {
        try {
            HiAnalyticsUtil.initAnalytics();
            const content = JSON.stringify({
                appIdentify: HiAnalyticsUtil.appIdentifier,
                ascfVersionName: deviceInfo.displayVersion,
                runningMode: HiAnalyticsUtil.runningMode,
                caller: 'ASWeb',
            });
            HiAnalyticsUtil.writeEndEvent(new Date().getTime(), content);
        }
        catch (err) {
            console.error(`reportComponentEvent -> reportComponentEvent error, message: ${err.message}`);
        }
    }
}
HiAnalyticsUtil.processorId = undefined;
/**
 * 数据打点的接口状态
 */
const ActionState = {
    BEGIN: 'begin',
    SUCCESS: 'success',
    FAIL: 'fail'
}
//# sourceMappingURL=atomicserviceweb.js.map
export default {
    AtomicServiceWeb,
    AtomicServiceWebController
}
