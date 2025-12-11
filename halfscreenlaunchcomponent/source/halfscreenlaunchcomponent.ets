/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
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
import { ErrorCallback, Callback, BusinessError } from '@ohos.base';
import AtomicServiceOptions from '@ohos.app.ability.AtomicServiceOptions';
import commonEventManager from '@ohos.commonEventManager';
import Base from '@ohos.base';
import { bundleManager } from '@kit.AbilityKit';

const EMBEDDED_HALF_MODE = 2;
const atomicServiceDataTag: string = 'ohos.atomicService.window';
const ERR_CODE_CAPABILITY_NOT_SUPPORT: number = 801;
const LOG_TAG: string = 'HalfScreenLaunchComponent';
const ERR_CODE_NOT_OPEN: number = 16000012;
@Component
export struct HalfScreenLaunchComponent {
  @BuilderParam content: Callback<void> = this.doNothingBuilder;
  context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
  appId: string = '';
  options?: AtomicServiceOptions;
  @State private isShow: boolean = false;
  private subscriber: commonEventManager.CommonEventSubscriber | null = null;
  onError?: ErrorCallback;
  onTerminated?: Callback<TerminationInfo>;
  onReceive?: Callback<Record<string, Object>>;
  private isSystemApp: boolean = false;

  aboutToAppear(): void {
    const bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
    const selfBundleInfo = bundleManager.getBundleInfoForSelfSync(bundleFlags);
    this.isSystemApp = selfBundleInfo?.appInfo?.systemApp;
    let subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
      events: [commonEventManager.Support.COMMON_EVENT_DISTRIBUTED_ACCOUNT_LOGOUT],
    };

    commonEventManager.createSubscriber(subscribeInfo,
      (err: Base.BusinessError, data: commonEventManager.CommonEventSubscriber) => {
        if (err) {
          hilog.error(0x3900, LOG_TAG,
            'Failed to create subscriber, err: %{public}s.', JSON.stringify(err));
          return;
        }

        if (data === null || data === undefined) {
          hilog.error(0x3900, LOG_TAG, 'Failed to create subscriber, data is null.');
          return;
        }

        this.subscriber = data;
        commonEventManager.subscribe(this.subscriber,
          (err: Base.BusinessError, data: commonEventManager.CommonEventData) => {
            if (err) {
              hilog.error(0x3900, LOG_TAG,
                'Failed to subscribe common event, err: %{public}s.', JSON.stringify(err));
              return;
            }
            this.isShow = false;
          })
      })
  }

  aboutToDisappear(): void {
    if (this.subscriber !== null) {
      commonEventManager.unsubscribe(this.subscriber, (err) => {
        if (err) {
          hilog.error(0x3900, LOG_TAG,
            'UnsubscribeCallBack, err: %{public}s.', JSON.stringify(err));
        } else {
          this.subscriber = null;
        }
      })
    }
  }

  @Builder
  doNothingBuilder() {
  };

  resetOptions(): void {
    if (this.options?.parameters) {
      this.options.parameters['ohos.extra.param.key.showMode'] = EMBEDDED_HALF_MODE;
      this.options.parameters['ability.want.params.IsNotifyOccupiedAreaChange'] = true;
      this.options.parameters['ability.want.params.IsModal'] = true;
      this.options.parameters['com.atomicservice.params.key.launchType'] = 'EMBED_HALF';
      this.options.parameters['com.atomicservice.params.key.isSystemApp'] = this.isSystemApp;
      hilog.info(0x3900, LOG_TAG, 'replaced options is %{public}s !', JSON.stringify(this.options));
    } else {
      this.options = {
        parameters: {
          'ohos.extra.param.key.showMode': EMBEDDED_HALF_MODE,
          'ability.want.params.IsNotifyOccupiedAreaChange': true,
          'ability.want.params.IsModal': true,
          'com.atomicservice.params.key.launchType': 'EMBED_HALF',
          'com.atomicservice.params.key.isSystemApp': this.isSystemApp
        }
      }
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
    } catch (err: BusinessError) {
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

  private handleOnReceiveEvent(data: Object): void {
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
    }.justifyContent(FlexAlign.Center)
    .onClick(
      () => {
        hilog.info(0x3900, LOG_TAG, 'on start atomicservice');
        this.checkAbility();
      }
    ).bindContentCover($$this.isShow, this.uiExtensionBuilder(),
      {
        modalTransition: ModalTransition.NONE,
        enableSafeArea: true
      });
  }

  @Builder
  uiExtensionBuilder() {
    Column() {
      UIExtensionComponent({
        bundleName: `com.atomicservice.${this.appId}`,
        flags: this.options?.flags,
        parameters: this.options?.parameters
      },
        {
          windowModeFollowStrategy: WindowModeFollowStrategy.FOLLOW_HOST_WINDOW_MODE
        })
        .height('100%')
        .width('100%')
        .backgroundColor(Color.Transparent)
        .onError(
          err => {
            if (this.onError) {
              this.onError(err);
            }
            this.isShow = false;
            hilog.error(0x3900, LOG_TAG, 'call up UIExtension error!%{public}s', err.message);
          }
        )
        .onTerminated(info => {
          this.isShow = false;
          if (this.onTerminated) {
            this.onTerminated(info);
          }
        })
        .onReceive(data => {
          this.handleOnReceiveEvent(data);
        })
    }
    .height(LayoutPolicy.matchParent)
    .width(LayoutPolicy.matchParent)
    .ignoreLayoutSafeArea([LayoutSafeAreaType.SYSTEM], [LayoutSafeAreaEdge.TOP, LayoutSafeAreaEdge.BOTTOM])
  }
}