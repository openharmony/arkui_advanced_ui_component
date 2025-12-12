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
import hilog from '@ohos.hilog';
import abilityManager from '@ohos.app.ability.abilityManager';
import common from '@ohos.app.ability.common';
import { Callback, BusinessError, ErrorCallback } from '@ohos.base';
import AtomicServiceOptions from '@ohos.app.ability.AtomicServiceOptions';
import commonEventManager from '@ohos.commonEventManager';
import { bundleManager } from '@kit.AbilityKit';
import Base from '@ohos.base';
import window from '@ohos.window';

export class LaunchController {
  public launchAtomicService = (appId: string, options?: AtomicServiceOptions) => {};
}

const EMBEDDED_FULL_MODE: number = 1;
const atomicServiceDataTag: string = 'ohos.atomicService.window';
const ERR_CODE_CAPABILITY_NOT_SUPPORT: number = 801;
const API20: number = 20;
const LOG_TAG: string = 'InnerFullScreenLaunchComponent';
const ERR_CODE_NOT_OPEN: number = 16000012;
const COLOR_HEX_MAX: number = 0xffffffff;
const SET_STATUS_BAR_COLOR: string = 'setStatusBarColor';
const RECEIVE_FUNCTION: string = 'ohos.atomicService.window.function';
const RECEIVE_PARAM_COLOR_NUMERIC: string = 'ohos.atomicService.window.param.color.numeric';

@Component
export struct InnerFullScreenLaunchComponent {
  @BuilderParam content: Callback<void> = this.doNothingBuilder;
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
  controller: LaunchController = new LaunchController();
  private appId: string = '';
  private options?: AtomicServiceOptions;
  @State private isShow: boolean = false;
  private subscriber: commonEventManager.CommonEventSubscriber | null = null;
  private apiVersion: number = 0;
  private launchAtomicService = (appId: string, options?: AtomicServiceOptions) => {
    hilog.info(0x3900, LOG_TAG,
      'launchAtomicService, appId: %{public}s.', appId);
    this.appId = appId;
    this.options = options;
    this.checkAbility();
  }
  onReceive?: Callback<Record<string, Object>>;
  onError?: ErrorCallback;
  onTerminated?: Callback<TerminationInfo>;
  private isSystemApp: boolean = false;

  aboutToAppear() {
    this.loadApiVersion();
    let subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
      events: [commonEventManager.Support.COMMON_EVENT_DISTRIBUTED_ACCOUNT_LOGOUT],
    };

    commonEventManager.createSubscriber(subscribeInfo,
      (err:Base.BusinessError, data: commonEventManager.CommonEventSubscriber) => {
        if (err) {
          hilog.error(0x3900, LOG_TAG,
            'Failed to create subscriber, err: %{public}s.', err.message);
          return;
        }

        if (data == null || data == undefined) {
          hilog.error(0x3900, LOG_TAG, 'Failed to create subscriber, data is null.');
          return;
        }

        this.subscriber = data;
        commonEventManager.subscribe(this.subscriber,
          (err: Base.BusinessError, data: commonEventManager.CommonEventData) => {
            if (err) {
              hilog.error(0x3900, LOG_TAG,
                'Failed to subscribe common event, err: %{public}s.', err.message);
              return;
            }

            hilog.info(0x3900, LOG_TAG, 'Received account logout event.');
            this.isShow = false;
          })
      })
    this.controller.launchAtomicService = this.launchAtomicService;
  }

  /**
   * 加载应用运行目标版本
   */
  loadApiVersion() {
    let bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION |
    bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_METADATA;
    try {
      bundleManager.getBundleInfoForSelf(bundleFlags).then((data) => {
        if (!data?.targetVersion) {
          hilog.error(0x3900, LOG_TAG, 'getBundleInfoForSelf error, targetVersion is undefined');
          return;
        }
        this.apiVersion = data.targetVersion % 1000;
        this.isSystemApp = data.appInfo?.systemApp;
        hilog.info(0x3900, LOG_TAG, 'getBundleInfoForSelf success, data: %{public}d.', this.apiVersion);
      }).catch((err: BusinessError) => {
        hilog.error(0x3900, LOG_TAG, 'getBundleInfoForSelf fail_1, cause: %{public}s.', err.message);
      });
    } catch (err) {
      hilog.error(0x3900, LOG_TAG, 'getBundleInfoForSelf fail_2, cause: %{public}s.', err.message);
    }
  }

  aboutToDisappear() {
    if (this.subscriber !== null) {
      commonEventManager.unsubscribe(this.subscriber, (err) => {
        if (err) {
          hilog.error(0x3900, LOG_TAG,
            'UnsubscribeCallBack, err: %{public}s.', err.message);
        } else {
          this.subscriber = null;
        }
      })
    }
  }

  @Builder
  doNothingBuilder() {
  };

  resetOptions() {
    if (this.options?.parameters) {
      this.options.parameters['ohos.extra.param.key.showMode'] = EMBEDDED_FULL_MODE;
      this.options.parameters['ability.want.params.IsNotifyOccupiedAreaChange'] = true;
      this.options.parameters['ohos.extra.atomicservice.param.key.isFollowHostWindowMode'] = (this.apiVersion >= API20);
      this.options.parameters['com.atomicservice.params.key.launchType'] = 'EMBED_INNER_FULL';
      this.options.parameters['com.atomicservice.params.key.isSystemApp'] = this.isSystemApp;
      hilog.info(0x3900, LOG_TAG, 'replaced options is %{public}s !', JSON.stringify(this.options));
    } else {
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

  async checkAbility(): Promise<void> {
    if (this.isShow) {
      hilog.error(0x3900, LOG_TAG, 'EmbeddedAbility already shows');
      this.isShow = false;
      return;
    }
    this.resetOptions();
    try {
      abilityManager.queryAtomicServiceStartupRule(this.context, this.appId)
        .then((data: abilityManager.AtomicServiceStartupRule) => {
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
        }).catch((err: BusinessError) => {
          hilog.error(0x3900, LOG_TAG, 'queryAtomicServiceStartupRule called error!%{public}s', err.message);
          if (ERR_CODE_CAPABILITY_NOT_SUPPORT === err.code) {
            this.popUp();
          } else {
            this.pullUpError(err.code, 'query_atomic_service_startup__rule_fail', err.message);
          }
      });
    } catch (err) {
      hilog.error(0x3900, LOG_TAG, 'AtomicServiceStartupRule failed: %{public}s', err.message);
      this.popUp();
    }
  }

  async popUp(): Promise<void> {
    this.isShow = false;
    try {
      const ability = await this.context.openAtomicService(this.appId, this.options);
      hilog.info(0x3900, LOG_TAG, '%{public}s open service success!', ability.want);
    } catch (e) {
      hilog.error(0x3900, LOG_TAG, '%{public}s open service error!', e.message);
      this.pullUpError(e.code, 'open_atomic_service_fail', e.message);
    }
  }

  private handleOnReceiveEvent(data: object): void {
    if (!data) {
      return;
    }
    if (data[RECEIVE_FUNCTION] === SET_STATUS_BAR_COLOR) {
      this.updateStatusBarContentColor(data[RECEIVE_PARAM_COLOR_NUMERIC]);
    }
    if (this.onReceive) {
      const sourceKeys = Object.keys(data);
      let atomicServiceData: Record<string, Object> = {};
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

  /**
   * 处理onError回调
   */
  private handleOnErrorEvent(err: BusinessError): void {
    this.isShow = false;
    hilog.error(0x3900, LOG_TAG, 'call up UIExtension error! %{public}s', err.message);
    if (this.onError) {
      try {
        this.onError(err);
      } catch (err) {
        hilog.error(0x3900, LOG_TAG, 'onError callback error! %{public}s', err.message);
      }
    }
  }

  /**
   * 处理onTerminated回调
   */
  private handleOnTerminated(info: TerminationInfo): void {
    this.isShow = false;
    if (this.onTerminated) {
      try {
        this.onTerminated(info);
      } catch (err) {
        hilog.error(0x3900, LOG_TAG, 'onTerminated callback error! %{public}s', err.message);
      }
    }
  }

  pullUpError(code: number, name: string, message: string): void {
    if (!this.onError) {
      return;
    }
    let error: BusinessError = {
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

  build() {
    Row() {
      this.content();
    }
    .justifyContent(FlexAlign.Center)
    .bindContentCover($$this.isShow, this.uiExtensionBuilder(), {
      modalTransition: ModalTransition.DEFAULT,
      enableSafeArea: true,
      onWillDisappear: () => {
        this.resetStatusBarContentColor();
      }
    })
  }

  @Builder
  uiExtensionBuilder() {
    Column() {
      UIExtensionComponent({
        bundleName: `com.atomicservice.${this.appId}`,
        flags: this.options?.flags,
        parameters: this.options?.parameters
      },{
        windowModeFollowStrategy: WindowModeFollowStrategy.FOLLOW_HOST_WINDOW_MODE
      })
        .backgroundColor($r('sys.color.ohos_id_color_titlebar_bg'))
        .defaultFocus(true)
        .height('100%')
        .width('100%')
        .onRelease(
          () => {
            hilog.error(0x3900, LOG_TAG, 'onRelease');
            this.isShow = false;
          }
        )
        .onError((err: BusinessError) => {
          this.handleOnErrorEvent(err);
        })
        .onReceive(data => {
          this.handleOnReceiveEvent(data);
        })
        .onTerminated((info: TerminationInfo) => {
          this.handleOnTerminated(info);
        })
    }
    .height(LayoutPolicy.matchParent)
    .width(LayoutPolicy.matchParent)
    .ignoreLayoutSafeArea([LayoutSafeAreaType.SYSTEM], [LayoutSafeAreaEdge.TOP, LayoutSafeAreaEdge.BOTTOM])
  }

  /**
   * 接收提供方onReceive通知，更新宿主的状态栏文字颜色
   */
  private updateStatusBarContentColor(receivedColor: number): void {
    if (typeof receivedColor !== 'number' || receivedColor < 0 || receivedColor > COLOR_HEX_MAX) {
      hilog.error(0x3900, LOG_TAG, `updateStatusBarContentColor fail, receivedColor is invalid`);
      return;
    }
    try {
      hilog.info(0x3900, LOG_TAG, `updateStatusBarContentColor receivedColor=${receivedColor}`);
      let mainWindow: window.Window = this.context.windowStage.getMainWindowSync();
      let mainWindowId: number = mainWindow?.getWindowProperties()?.id;
      if (typeof mainWindowId !== 'number') {
        hilog.error(0x3900, LOG_TAG, `updateStatusBarContentColor fail, mainWindowId is undefined`);
        return;
      }
      WindowManager.setStatusBarColor(mainWindowId, receivedColor);
    } catch (err) {
      hilog.error(0x3900, LOG_TAG, `updateStatusBarContentColor error, message: ${err.message}`);
    }
  }

  /**
   * 恢复宿主的状态栏文字颜色
   */
  private resetStatusBarContentColor(): void {
    try {
      let mainWindow: window.Window = this.context.windowStage.getMainWindowSync();
      let mainWindowId: number = mainWindow?.getWindowProperties()?.id;
      if (typeof mainWindowId !== 'number') {
        hilog.error(0x3900, LOG_TAG, `resetStatusBarContentColor fail, mainWindowId is undefined`);
        return;
      }
      WindowManager.clearStatusBarColor(mainWindowId);
    } catch (err) {
      hilog.error(0x3900, LOG_TAG, `resetStatusBarContentColor error, message: ${err.message}`);
    }
  }

  /**
   * onReceive()是否回调给开发者
   */
  private isOnReceiveCallback(key: string, value: string): boolean {
    return !!key && key.includes(atomicServiceDataTag) &&
      !(key === RECEIVE_PARAM_COLOR_NUMERIC ||
        (key === RECEIVE_FUNCTION && value === SET_STATUS_BAR_COLOR));
  }
}

class WindowManager {
  static setStatusBarColor(windowId: number, color: number): void {
  }

  static clearStatusBarColor(windowId: number): void {
  }
}
