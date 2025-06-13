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
import { ErrorCallback, Callback } from '@ohos.base';
import AtomicServiceOptions from '@ohos.app.ability.AtomicServiceOptions';
import commonEventManager from '@ohos.commonEventManager';
import Base from '@ohos.base';

const EMBEDDED_HALF_MODE = 2;
const atomicServiceDataTag: string = 'ohos.atomicService.window';
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

  aboutToAppear(): void {
    let subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
      events: [commonEventManager.Support.COMMON_EVENT_DISTRIBUTED_ACCOUNT_LOGOUT],
    };

    commonEventManager.createSubscriber(subscribeInfo,
      (err: Base.BusinessError, data: commonEventManager.CommonEventSubscriber) => {
        if (err) {
          hilog.error(0x3900, 'HalfScreenLaunchComponent',
            'Failed to create subscriber, err: %{public}s.', JSON.stringify(err));
          return;
        }

        if (data === null || data === undefined) {
          hilog.error(0x3900, 'HalfScreenLaunchComponent', 'Failed to create subscriber, data is null.');
          return;
        }

        this.subscriber = data;
        commonEventManager.subscribe(this.subscriber,
          (err: Base.BusinessError, data: commonEventManager.CommonEventData) => {
            if (err) {
              hilog.error(0x3900, 'HalfScreenLaunchComponent',
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
          hilog.error(0x3900, 'HalfScreenLaunchComponent',
            'UnsubscribeCallBack, err: %{public}s.', JSON.stringify(err));
        } else {
          hilog.info(0x3900, 'HalfScreenLaunchComponent', 'Unsubscribe.');
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
      hilog.info(0x3900, 'HalfScreenLaunchComponent', 'replaced options is %{public}s !', JSON.stringify(this.options));
    } else {
      this.options = {
        parameters: {
          'ohos.extra.param.key.showMode': EMBEDDED_HALF_MODE,
          'ability.want.params.IsNotifyOccupiedAreaChange': true,
          'ability.want.params.IsModal': true
        }
      }
    }
  }

  async checkAbility(): void {
    this.resetOptions();
    try {
      const res: boolean = await abilityManager.isEmbeddedOpenAllowed(this.context, this.appId);
      if (res) {
        if (this.isShow) {
          this.isShow = false;
          hilog.error(0x3900, 'HalfScreenLaunchComponent', ' EmbeddedOpen is already show!');
          return;
        }
        this.isShow = true;
        hilog.info(0x3900, 'HalfScreenLaunchComponent', ' EmbeddedOpen is Allowed!');
      } else {
        this.popUp();
      }
    } catch (e) {
      hilog.error(0x3900, 'HalfScreenLaunchComponent', 'isEmbeddedOpenAllowed called error!%{public}s', e.message);
    }
  }

  async popUp(): void {
    this.isShow = false;
    try {
      const ability = await this.context.openAtomicService(this.appId, this.options);
      hilog.info(0x3900, 'HalfScreenLaunchComponent', '%{public}s open service success!', ability.want);
    } catch (e) {
      hilog.error(0x3900, 'HalfScreenLaunchComponent', '%{public}s open service error!', e.message);
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

  build() {
    Row() {
      this.content();
    }.justifyContent(FlexAlign.Center)
    .onClick(
      () => {
        hilog.info(0x3900, 'HalfScreenLaunchComponent', 'on start atomicservice');
        this.checkAbility();
      }
    ).bindContentCover($$this.isShow, this.uiExtensionBuilder(), { modalTransition: ModalTransition.NONE });

  }

  @Builder
  uiExtensionBuilder() {
    UIExtensionComponent({
      bundleName: `com.atomicservice.${this.appId}`,
      flags: this.options?.flags,
      parameters: this.options?.parameters
    },
    {
      windowModeFollowStrategy: WindowModeFollowStrategy.FOLLOW_UI_EXTENSION_ABILITY_WINDOW_MODE
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
          hilog.error(0x3900, 'HalfScreenLaunchComponent', 'call up UIExtension error!%{public}s', err.message);
          this.getUIContext().showAlertDialog({
            message: err.message
          });
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
}