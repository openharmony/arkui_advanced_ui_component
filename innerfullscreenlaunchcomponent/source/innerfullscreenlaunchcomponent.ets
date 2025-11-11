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

export class LaunchController {
  public launchAtomicService = (appId: string, options?: AtomicServiceOptions) => {};
}

const EMBEDDED_FULL_MODE: number = 1;
const atomicServiceDataTag: string = 'ohos.atomicService.window';
const ERR_CODE_CAPABILITY_NOT_SUPPORT: number = 801;
const API20: number = 20;
const LOG_TAG: string = 'InnerFullScreenLaunchComponent';

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
      hilog.info(0x3900, LOG_TAG, 'replaced options is %{public}s !', JSON.stringify(this.options));
    } else {
      this.options = {
        parameters: {
          'ohos.extra.param.key.showMode': EMBEDDED_FULL_MODE,
          'ability.want.params.IsNotifyOccupiedAreaChange': true,
          'ohos.extra.atomicservice.param.key.isFollowHostWindowMode': (this.apiVersion >= API20)
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
          }
        }).catch((err: BusinessError) => {
          hilog.error(0x3900, LOG_TAG, 'queryAtomicServiceStartupRule called error!%{public}s', err.message);
          if (ERR_CODE_CAPABILITY_NOT_SUPPORT === err.code) {
            this.popUp();
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
    }
  }

  private handleOnReceiveEvent(data: object): void {
    if (data === undefined || data === null) {
      return;
    }
    if (this.onReceive !== undefined) {
      const sourceKeys = Object.keys(data);
      let atomicServiceData: Record<string, Object> = {};
      for (let i = 0; i < sourceKeys.length; i++) {
        if (sourceKeys[i].includes(atomicServiceDataTag)) {
          atomicServiceData[sourceKeys[i]] = data[sourceKeys[i]];
        }
      }
      this.onReceive(atomicServiceData);
    }
  }

  /**
   * 处理onError回调
   */
  private handleOnErrorEvent(err: BusinessError): void {
    this.isShow = false;
    hilog.error(0x3900, LOG_TAG, 'call up UIExtension error! %{public}s', err.message);
    if (this.onError !== undefined) {
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
    if (this.onTerminated !== undefined) {
      try {
        this.onTerminated(info);
      } catch (err) {
        hilog.error(0x3900, LOG_TAG, 'onTerminated callback error! %{public}s', err.message);
      }
    }
  }

  build() {
    Row() {
      this.content();
    }
    .justifyContent(FlexAlign.Center)
    .bindContentCover($$this.isShow, this.uiExtensionBuilder(), {
      modalTransition: ModalTransition.DEFAULT,
      enableSafeArea: true
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
}