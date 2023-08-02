/*
 * Copyright (c) 2023-2023 Huawei Device Co., Ltd.
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

const SPACE_MARGIN = 8;
const MARGIN_NUM = 4;
const IMAGE_WIDTH_NUM = 16;
const IMAGE_HEIGHT_NUM = 24;
const BUTTON_SIZE = 32;
const SINGLE_LINE_HEIGHT = 48;
const DOUBLE_LINE_HEIGHT = 64;
const BUTTON_HEIGHT = 28;
const IMAGE_WIDTH = 12;
const BORDER_WIDTH = 2;
const SINGLE_LINE_NUM = 1;
const DOUBLE_LINE_NUM = 2;
const MIN_FONT_SIZE = 14;
const MAIN_TEXT_SIZE = 10;
const MIN_CONSTRAINT_WIDTH = 3;

export var OperationType;
!function(e){
  e[e.TEXT_ARROW=0] = "TEXT_ARROW";
  e[e.BUTTON=1] = "BUTTON";
  e[e.ICON_GROUP=2] = "ICON_GROUP";
  e[e.LOADING=3] = "LOADING"
}(OperationType || (OperationType = {}));

class ButtonStyle extends ViewPU {
  constructor(e, o, t, s = -1) {
    super(e, t, s);
    this.__buttonBgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "buttonBgColor");
    this.__isButtonFocus = new ObservedPropertySimplePU(!1, this, "isButtonFocus");
    this.button = void 0;
    this.focusBorderWidth = 2;
    this.setInitiallyProvidedValue(o)
  }

  setInitiallyProvidedValue(e) {
    void 0 !== e.buttonBgColor && (this.buttonBgColor = e.buttonBgColor);
    void 0 !== e.isButtonFocus && (this.isButtonFocus = e.isButtonFocus);
    void 0 !== e.button && (this.button = e.button);
    void 0 !== e.focusBorderWidth && (this.focusBorderWidth = e.focusBorderWidth)
  }

  updateStateVars(e) {
  }

  purgeVariableDependenciesOnElmtId(e) {
    this.__buttonBgColor.purgeDependencyOnElmtId(e);
    this.__isButtonFocus.purgeDependencyOnElmtId(e)
  }

  aboutToBeDeleted() {
    this.__buttonBgColor.aboutToBeDeleted();
    this.__isButtonFocus.aboutToBeDeleted();
    SubscriberManager.Get().delete(this.id__());
    this.aboutToBeDeletedInternal()
  }

  get buttonBgColor() {
    return this.__buttonBgColor.get()
  }

  set buttonBgColor(e) {
    this.__buttonBgColor.set(e)
  }

  get isButtonFocus() {
    return this.__isButtonFocus.get()
  }

  set isButtonFocus(e) {
    this.__isButtonFocus.set(e)
  }

  initialRender() {
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Row.create();
      Row.align(Alignment.End);
      Row.justifyContent(FlexAlign.Center);
      Row.focusable(!0);
      Row.height(28);
      Row.margin({ left: 8, right: 8 });
      Row.borderRadius(16);
      Row.backgroundColor(ObservedObject.GetRawObject(this.buttonBgColor));
      Row.onTouch((e => {
        if (e.type === TouchType.Down) {
          this.button.action && this.button.action();
          this.buttonBgColor = {
            id: -1,
            type: 10001,
            params: ["sys.color.ohos_id_color_click_effect"],
            bundleName: "",
            moduleName: ""
          }
        }
        e.type === TouchType.Up && (this.buttonBgColor = {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_background"],
          bundleName: "",
          moduleName: ""
        })
      }));
      Row.onHover((e => {
        this.buttonBgColor = e ? {
                                   id: -1,
                                   type: 10001,
                                   params: ["sys.color.ohos_id_color_hover"],
                                   bundleName: "",
                                   moduleName: ""
                                 } : {
                                       id: -1,
                                       type: 10001,
                                       params: ["sys.color.ohos_id_color_background"],
                                       bundleName: "",
                                       moduleName: ""
                                     }
      }));
      Row.border(this.isButtonFocus ? {
                                        width: this.focusBorderWidth,
                                        color: {
                                          id: -1,
                                          type: 10001,
                                          params: ["sys.color.ohos_id_color_focused_outline"],
                                          bundleName: "",
                                          moduleName: ""
                                        },
                                        style: BorderStyle.Solid
                                      } : { width: 0 });
      Row.onFocus((() => {
        this.isButtonFocus = !0
      }));
      Row.onBlur((() => {
        this.isButtonFocus = !1
      }));
      Row.onKeyEvent((e => {
        2054 !== e.keyCode && 2050 !== e.keyCode || this.button.action && this.button.action()
      }));
      o || Row.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Text.create(this.button.value);
      Text.fontColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_text_primary_activated"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_button2"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontWeight(FontWeight.Medium);
      Text.margin({ left: 8, right: 8 });
      Text.focusable(!0);
      Text.maxLines(2);
      o || Text.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Text.pop();
    Row.pop()
  }

  rerender() {
    this.updateDirtyElements()
  }
}

class IconGroup extends ViewPU {
  constructor(e, o, t, s = -1) {
    super(e, t, s);
    this.__bgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "bgColor");
    this.__isFocus = new ObservedPropertySimplePU(!1, this, "isFocus");
    this.item = void 0;
    this.focusBorderWidth = 2;
    this.setInitiallyProvidedValue(o)
  }

  setInitiallyProvidedValue(e) {
    void 0 !== e.bgColor && (this.bgColor = e.bgColor);
    void 0 !== e.isFocus && (this.isFocus = e.isFocus);
    void 0 !== e.item && (this.item = e.item);
    void 0 !== e.focusBorderWidth && (this.focusBorderWidth = e.focusBorderWidth)
  }

  updateStateVars(e) {
  }

  purgeVariableDependenciesOnElmtId(e) {
    this.__bgColor.purgeDependencyOnElmtId(e);
    this.__isFocus.purgeDependencyOnElmtId(e)
  }

  aboutToBeDeleted() {
    this.__bgColor.aboutToBeDeleted();
    this.__isFocus.aboutToBeDeleted();
    SubscriberManager.Get().delete(this.id__());
    this.aboutToBeDeletedInternal()
  }

  get bgColor() {
    return this.__bgColor.get()
  }

  set bgColor(e) {
    this.__bgColor.set(e)
  }

  get isFocus() {
    return this.__isFocus.get()
  }

  set isFocus(e) {
    this.__isFocus.set(e)
  }

  initialRender() {
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Row.create();
      Row.focusable(!0);
      Row.width(32);
      Row.height(32);
      Row.margin({ right: 8 });
      Row.justifyContent(FlexAlign.Center);
      Row.borderRadius({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_corner_radius_clicked"],
        bundleName: "",
        moduleName: ""
      });
      Row.backgroundColor(ObservedObject.GetRawObject(this.bgColor));
      Row.onTouch((e => {
        if (e.type === TouchType.Down) {
          this.item.action && this.item.action();
          this.bgColor = {
            id: -1,
            type: 10001,
            params: ["sys.color.ohos_id_color_click_effect"],
            bundleName: "",
            moduleName: ""
          }
        }
        e.type === TouchType.Up && (this.bgColor = {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_background"],
          bundleName: "",
          moduleName: ""
        })
      }));
      Row.onHover((e => {
        this.bgColor = e ? {
                             id: -1,
                             type: 10001,
                             params: ["sys.color.ohos_id_color_hover"],
                             bundleName: "",
                             moduleName: ""
                           } : {
                                 id: -1,
                                 type: 10001,
                                 params: ["sys.color.ohos_id_color_background"],
                                 bundleName: "",
                                 moduleName: ""
                               }
      }));
      Row.border(this.isFocus ? {
                                  width: this.focusBorderWidth,
                                  color: {
                                    id: -1,
                                    type: 10001,
                                    params: ["sys.color.ohos_id_color_emphasize"],
                                    bundleName: "",
                                    moduleName: ""
                                  },
                                  style: BorderStyle.Solid
                                } : { width: 0 });
      Row.onFocus((() => {
        this.isFocus = !0
      }));
      Row.onBlur((() => {
        this.isFocus = !1
      }));
      Row.onKeyEvent((e => {
        2054 !== e.keyCode && 2050 !== e.keyCode || this.item.action && this.item.action()
      }));
      o || Row.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Image.create(this.item.value);
      Image.fillColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_primary"],
        bundleName: "",
        moduleName: ""
      });
      Image.width(24);
      Image.height(24);
      Image.focusable(!0);
      o || Image.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Row.pop()
  }

  rerender() {
    this.updateDirtyElements()
  }
}

export class SubHeader extends ViewPU {
  constructor(e, o, t, s = -1) {
    super(e, t, s);
    this.__icon = new SynchedPropertyObjectOneWayPU(o.icon, this, "icon");
    this.__primaryTitle = new SynchedPropertySimpleOneWayPU(o.primaryTitle, this, "primaryTitle");
    this.__secondaryTitle = new SynchedPropertySimpleOneWayPU(o.secondaryTitle, this, "secondaryTitle");
    this.__select = new SynchedPropertyObjectOneWayPU(o.select, this, "select");
    this.__operationType = new SynchedPropertySimpleOneWayPU(o.operationType, this, "operationType");
    this.operationItem = void 0;
    this.__isDuplicateLine = new ObservedPropertySimplePU(!1, this, "isDuplicateLine");
    this.__textArrowBgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "textArrowBgColor");
    this.__buttonBgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "buttonBgColor");
    this.__iconBgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "iconBgColor");
    this.__firstIconBgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "firstIconBgColor");
    this.__SecondaryIconBgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "SecondaryIconBgColor");
    this.__thirdIconBgColor = new ObservedPropertyObjectPU({
      id: -1,
      type: 10001,
      params: ["sys.color.ohos_id_color_background"],
      bundleName: "",
      moduleName: ""
    }, this, "thirdIconBgColor");
    this.__flag = new ObservedPropertySimplePU(!1, this, "flag");
    this.__isTextArrowFocus = new ObservedPropertySimplePU(!1, this, "isTextArrowFocus");
    this.focusBorderWidth = 2;
    this.setInitiallyProvidedValue(o)
  }

  setInitiallyProvidedValue(e) {
    void 0 !== e.operationType ? this.__operationType.set(e.operationType) : this.__operationType.set(OperationType.BUTTON);
    void 0 !== e.operationItem && (this.operationItem = e.operationItem);
    void 0 !== e.isDuplicateLine && (this.isDuplicateLine = e.isDuplicateLine);
    void 0 !== e.textArrowBgColor && (this.textArrowBgColor = e.textArrowBgColor);
    void 0 !== e.buttonBgColor && (this.buttonBgColor = e.buttonBgColor);
    void 0 !== e.iconBgColor && (this.iconBgColor = e.iconBgColor);
    void 0 !== e.firstIconBgColor && (this.firstIconBgColor = e.firstIconBgColor);
    void 0 !== e.SecondaryIconBgColor && (this.SecondaryIconBgColor = e.SecondaryIconBgColor);
    void 0 !== e.thirdIconBgColor && (this.thirdIconBgColor = e.thirdIconBgColor);
    void 0 !== e.flag && (this.flag = e.flag);
    void 0 !== e.isTextArrowFocus && (this.isTextArrowFocus = e.isTextArrowFocus);
    void 0 !== e.focusBorderWidth && (this.focusBorderWidth = e.focusBorderWidth)
  }

  updateStateVars(e) {
    this.__icon.reset(e.icon);
    this.__primaryTitle.reset(e.primaryTitle);
    this.__secondaryTitle.reset(e.secondaryTitle);
    this.__select.reset(e.select);
    this.__operationType.reset(e.operationType)
  }

  purgeVariableDependenciesOnElmtId(e) {
    this.__icon.purgeDependencyOnElmtId(e);
    this.__primaryTitle.purgeDependencyOnElmtId(e);
    this.__secondaryTitle.purgeDependencyOnElmtId(e);
    this.__select.purgeDependencyOnElmtId(e);
    this.__operationType.purgeDependencyOnElmtId(e);
    this.__isDuplicateLine.purgeDependencyOnElmtId(e);
    this.__textArrowBgColor.purgeDependencyOnElmtId(e);
    this.__buttonBgColor.purgeDependencyOnElmtId(e);
    this.__iconBgColor.purgeDependencyOnElmtId(e);
    this.__firstIconBgColor.purgeDependencyOnElmtId(e);
    this.__SecondaryIconBgColor.purgeDependencyOnElmtId(e);
    this.__thirdIconBgColor.purgeDependencyOnElmtId(e);
    this.__flag.purgeDependencyOnElmtId(e);
    this.__isTextArrowFocus.purgeDependencyOnElmtId(e)
  }

  aboutToBeDeleted() {
    this.__icon.aboutToBeDeleted();
    this.__primaryTitle.aboutToBeDeleted();
    this.__secondaryTitle.aboutToBeDeleted();
    this.__select.aboutToBeDeleted();
    this.__operationType.aboutToBeDeleted();
    this.__isDuplicateLine.aboutToBeDeleted();
    this.__textArrowBgColor.aboutToBeDeleted();
    this.__buttonBgColor.aboutToBeDeleted();
    this.__iconBgColor.aboutToBeDeleted();
    this.__firstIconBgColor.aboutToBeDeleted();
    this.__SecondaryIconBgColor.aboutToBeDeleted();
    this.__thirdIconBgColor.aboutToBeDeleted();
    this.__flag.aboutToBeDeleted();
    this.__isTextArrowFocus.aboutToBeDeleted();
    SubscriberManager.Get().delete(this.id__());
    this.aboutToBeDeletedInternal()
  }

  get icon() {
    return this.__icon.get()
  }

  set icon(e) {
    this.__icon.set(e)
  }

  get primaryTitle() {
    return this.__primaryTitle.get()
  }

  set primaryTitle(e) {
    this.__primaryTitle.set(e)
  }

  get secondaryTitle() {
    return this.__secondaryTitle.get()
  }

  set secondaryTitle(e) {
    this.__secondaryTitle.set(e)
  }

  get select() {
    return this.__select.get()
  }

  set select(e) {
    this.__select.set(e)
  }

  get operationType() {
    return this.__operationType.get()
  }

  set operationType(e) {
    this.__operationType.set(e)
  }

  get isDuplicateLine() {
    return this.__isDuplicateLine.get()
  }

  set isDuplicateLine(e) {
    this.__isDuplicateLine.set(e)
  }

  get textArrowBgColor() {
    return this.__textArrowBgColor.get()
  }

  set textArrowBgColor(e) {
    this.__textArrowBgColor.set(e)
  }

  get buttonBgColor() {
    return this.__buttonBgColor.get()
  }

  set buttonBgColor(e) {
    this.__buttonBgColor.set(e)
  }

  get iconBgColor() {
    return this.__iconBgColor.get()
  }

  set iconBgColor(e) {
    this.__iconBgColor.set(e)
  }

  get firstIconBgColor() {
    return this.__firstIconBgColor.get()
  }

  set firstIconBgColor(e) {
    this.__firstIconBgColor.set(e)
  }

  get SecondaryIconBgColor() {
    return this.__SecondaryIconBgColor.get()
  }

  set SecondaryIconBgColor(e) {
    this.__SecondaryIconBgColor.set(e)
  }

  get thirdIconBgColor() {
    return this.__thirdIconBgColor.get()
  }

  set thirdIconBgColor(e) {
    this.__thirdIconBgColor.set(e)
  }

  get flag() {
    return this.__flag.get()
  }

  set flag(e) {
    this.__flag.set(e)
  }

  get isTextArrowFocus() {
    return this.__isTextArrowFocus.get()
  }

  set isTextArrowFocus(e) {
    this.__isTextArrowFocus.set(e)
  }

  ListTextStyle(e, o = null) {
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Text.create(e.content);
      Text.fontColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_text_secondary"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title3"],
        bundleName: "",
        moduleName: ""
      });
      Text.maxLines(2);
      Text.textOverflow({ overflow: TextOverflow.Ellipsis });
      Text.margin({
        left: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_max_padding_end"],
          bundleName: "",
          moduleName: ""
        },
        bottom: 8,
        right: 4
      });
      t || Text.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Text.pop()
  }

  ListIconStyle(e, o, t = null) {
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Row.create();
      Row.margin({
        left: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_max_padding_end"],
          bundleName: "",
          moduleName: ""
        },
        bottom: 8,
        right: 4
      });
      o || Row.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((e, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Image.create(o);
      Image.width(16);
      Image.height(16);
      Image.margin({ right: 8 });
      t || Image.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Text.create(e.content);
      Text.fontColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_text_secondary"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title3"],
        bundleName: "",
        moduleName: ""
      });
      Text.maxLines(2);
      Text.textOverflow({ overflow: TextOverflow.Ellipsis });
      t || Text.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Text.pop();
    Row.pop()
  }

  ContentTextStyle(e, o = null) {
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Text.create(e.content);
      Text.fontColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_text_primary"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title2"],
        bundleName: "",
        moduleName: ""
      });
      Text.maxLines(2);
      Text.maxFontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title2"],
        bundleName: "",
        moduleName: ""
      });
      Text.minFontSize(14);
      Text.textOverflow({ overflow: TextOverflow.Ellipsis });
      Text.margin({
        left: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_max_padding_start"],
          bundleName: "",
          moduleName: ""
        },
        right: 4,
        bottom: 8
      });
      t || Text.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Text.pop()
  }

  SubTextStyle(e, o = null) {
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Column.create();
      Column.alignItems(HorizontalAlign.Start);
      Column.onAppear((() => {
        this.isDuplicateLine = !0
      }));
      Column.margin({
        left: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_max_padding_start"],
          bundleName: "",
          moduleName: ""
        },
        right: 4,
        bottom: 8
      });
      o || Column.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Text.create(e.content);
      Text.fontColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_text_primary"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title2"],
        bundleName: "",
        moduleName: ""
      });
      Text.maxLines(1);
      Text.maxFontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title2"],
        bundleName: "",
        moduleName: ""
      });
      Text.minFontSize(14);
      Text.textOverflow({ overflow: TextOverflow.Ellipsis });
      t || Text.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Text.pop();
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Text.create(e.subContent);
      Text.fontColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_text_secondary"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title3"],
        bundleName: "",
        moduleName: ""
      });
      Text.maxLines(1);
      Text.maxFontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_sub_title3"],
        bundleName: "",
        moduleName: ""
      });
      Text.minFontSize(10);
      Text.textOverflow({ overflow: TextOverflow.Ellipsis });
      t || Text.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Text.pop();
    Column.pop()
  }

  SelectStyle(e, o = null) {
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Select.create(e.options);
      Select.selected(e.selected);
      Select.value(e.value);
      Select.onSelect(((o, t) => {
        e.onSelect && e.onSelect(o, t)
      }));
      Select.margin({
        left: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_default_padding_start"],
          bundleName: "",
          moduleName: ""
        },
        right: 4
      });
      t || Select.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Select.pop()
  }

  LoadingProcessStyle(e = null) {
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      LoadingProgress.create();
      LoadingProgress.width(24);
      LoadingProgress.height(24);
      LoadingProgress.focusable(!0);
      LoadingProgress.margin({
        right: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_default_padding_end"],
          bundleName: "",
          moduleName: ""
        }
      });
      o || LoadingProgress.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }))
  }

  TextArrowStyle(e, o = null) {
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Row.create();
      Row.focusable(!0);
      Row.margin({ left: 4, right: 4, bottom: 4 });
      Row.borderRadius({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_corner_radius_subtab"],
        bundleName: "",
        moduleName: ""
      });
      Row.backgroundColor(ObservedObject.GetRawObject(this.textArrowBgColor));
      Row.onTouch((o => {
        if (o.type === TouchType.Down) {
          e.action && e.action();
          this.textArrowBgColor = {
            id: -1,
            type: 10001,
            params: ["sys.color.ohos_id_color_click_effect"],
            bundleName: "",
            moduleName: ""
          }
        }
        o.type === TouchType.Up && (this.textArrowBgColor = {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_background"],
          bundleName: "",
          moduleName: ""
        })
      }));
      Row.onHover((e => {
        this.textArrowBgColor = e ? {
                                      id: -1,
                                      type: 10001,
                                      params: ["sys.color.ohos_id_color_hover"],
                                      bundleName: "",
                                      moduleName: ""
                                    } : {
                                          id: -1,
                                          type: 10001,
                                          params: ["sys.color.ohos_id_color_background"],
                                          bundleName: "",
                                          moduleName: ""
                                        }
      }));
      Row.border(this.isTextArrowFocus ? {
                                           width: this.focusBorderWidth,
                                           color: {
                                             id: -1,
                                             type: 10001,
                                             params: ["sys.color.ohos_id_color_focused_outline"],
                                             bundleName: "",
                                             moduleName: ""
                                           },
                                           style: BorderStyle.Solid
                                         } : { width: 0 });
      Row.onFocus((() => {
        this.isTextArrowFocus = !0
      }));
      Row.onBlur((() => {
        this.isTextArrowFocus = !1
      }));
      Row.onKeyEvent((o => {
        2054 !== o.keyCode && 2050 !== o.keyCode || e.action && e.action()
      }));
      t || Row.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Row.create();
      Row.margin({ left: 8, right: 8 });
      o || Row.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((o, t) => {
      ViewStackProcessor.StartGetAccessRecordingFor(o);
      Text.create(e.value);
      Text.fontColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_text_secondary"],
        bundleName: "",
        moduleName: ""
      });
      Text.fontSize({
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_size_body2"],
        bundleName: "",
        moduleName: ""
      });
      Text.margin({ right: 4 });
      Text.focusable(!0);
      Text.maxLines(2);
      t || Text.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Text.pop();
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Image.create({
        id: -1,
        type: 2e4,
        params: ["sys.media.ohos_ic_public_arrow_right"],
        bundleName: "",
        moduleName: ""
      });
      Image.fillColor({
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_tertiary"],
        bundleName: "",
        moduleName: ""
      });
      Image.width(12);
      Image.height(24);
      Image.focusable(!0);
      o || Image.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    Row.pop();
    Row.pop()
  }

  initialRender() {
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      Flex.create({ justifyContent: FlexAlign.SpaceBetween, alignItems: ItemAlign.End });
      Flex.padding({
        right: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_default_padding_end"],
          bundleName: "",
          moduleName: ""
        }
      });
      Flex.height(this.isDuplicateLine ? 64 : 48);
      o || Flex.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      If.create();
      null != this.secondaryTitle && null != this.icon ? this.ifElseBranchUpdateFunction(0, (() => {
        this.ListIconStyle.bind(this)({ content: this.secondaryTitle }, ObservedObject.GetRawObject(this.icon))
      })) : null != this.secondaryTitle && null != this.primaryTitle ? this.ifElseBranchUpdateFunction(1, (() => {
        this.SubTextStyle.bind(this)(makeBuilderParameterProxy("SubTextStyle", {
          content: () => this.__primaryTitle ? this.__primaryTitle : this.primaryTitle,
          subContent: () => this.__secondaryTitle ? this.__secondaryTitle : this.secondaryTitle
        }))
      })) : null != this.secondaryTitle ? this.ifElseBranchUpdateFunction(2, (() => {
        this.ListTextStyle.bind(this)(makeBuilderParameterProxy("ListTextStyle", {
          content: () => this.__secondaryTitle ? this.__secondaryTitle : this.secondaryTitle
        }))
      })) : null != this.select ? this.ifElseBranchUpdateFunction(3, (() => {
        this.SelectStyle.bind(this)(ObservedObject.GetRawObject(this.select))
      })) : null != this.primaryTitle && this.ifElseBranchUpdateFunction(4, (() => {
        this.ContentTextStyle.bind(this)(makeBuilderParameterProxy("ContentTextStyle", {
          content: () => this.__primaryTitle ? this.__primaryTitle : this.primaryTitle
        }))
      }));
      o || If.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    If.pop();
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      If.create();
      this.operationType === OperationType.BUTTON && null != this.operationItem ? this.ifElseBranchUpdateFunction(0, (() => {
        this.observeComponentCreation(((e, o) => {
          ViewStackProcessor.StartGetAccessRecordingFor(e);
          __Common__.create();
          __Common__.margin({ bottom: 4 });
          o || __Common__.pop();
          ViewStackProcessor.StopGetAccessRecording()
        }));
        this.observeComponentCreation(((e, o) => {
          ViewStackProcessor.StartGetAccessRecordingFor(e);
          o ? ViewPU.create(new ButtonStyle(this, {
            button: this.operationItem[0]
          }, void 0, e)) : this.updateStateVarsOfChildByElmtId(e, {});
          ViewStackProcessor.StopGetAccessRecording()
        }));
        __Common__.pop()
      })) : If.branchId(1);
      o || If.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    If.pop();
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      If.create();
      this.operationType === OperationType.ICON_GROUP && null != this.operationItem ? this.ifElseBranchUpdateFunction(0, (() => {
        this.observeComponentCreation(((e, o) => {
          ViewStackProcessor.StartGetAccessRecordingFor(e);
          Row.create();
          Row.margin({ bottom: 4 });
          o || Row.pop();
          ViewStackProcessor.StopGetAccessRecording()
        }));
        this.observeComponentCreation(((e, o) => {
          ViewStackProcessor.StartGetAccessRecordingFor(e);
          ForEach.create();
          this.forEachUpdateFunction(e, this.operationItem, ((e, o) => {
            const t = e;
            this.observeComponentCreation(((e, s) => {
              ViewStackProcessor.StartGetAccessRecordingFor(e);
              If.create();
              0 == o ? this.ifElseBranchUpdateFunction(0, (() => {
                this.observeComponentCreation(((e, o) => {
                  ViewStackProcessor.StartGetAccessRecordingFor(e);
                  o ? ViewPU.create(new IconGroup(this, {
                    item: t
                  }, void 0, e)) : this.updateStateVarsOfChildByElmtId(e, {});
                  ViewStackProcessor.StopGetAccessRecording()
                }))
              })) : If.branchId(1);
              s || If.pop();
              ViewStackProcessor.StopGetAccessRecording()
            }));
            If.pop();
            this.observeComponentCreation(((e, s) => {
              ViewStackProcessor.StartGetAccessRecordingFor(e);
              If.create();
              1 == o ? this.ifElseBranchUpdateFunction(0, (() => {
                this.observeComponentCreation(((e, o) => {
                  ViewStackProcessor.StartGetAccessRecordingFor(e);
                  o ? ViewPU.create(new IconGroup(this, {
                    item: t
                  }, void 0, e)) : this.updateStateVarsOfChildByElmtId(e, {});
                  ViewStackProcessor.StopGetAccessRecording()
                }))
              })) : If.branchId(1);
              s || If.pop();
              ViewStackProcessor.StopGetAccessRecording()
            }));
            If.pop();
            this.observeComponentCreation(((e, s) => {
              ViewStackProcessor.StartGetAccessRecordingFor(e);
              If.create();
              2 == o ? this.ifElseBranchUpdateFunction(0, (() => {
                this.observeComponentCreation(((e, o) => {
                  ViewStackProcessor.StartGetAccessRecordingFor(e);
                  o ? ViewPU.create(new IconGroup(this, {
                    item: t
                  }, void 0, e)) : this.updateStateVarsOfChildByElmtId(e, {});
                  ViewStackProcessor.StopGetAccessRecording()
                }))
              })) : If.branchId(1);
              s || If.pop();
              ViewStackProcessor.StopGetAccessRecording()
            }));
            If.pop()
          }), void 0,!0,!1);
          o || ForEach.pop();
          ViewStackProcessor.StopGetAccessRecording()
        }));
        ForEach.pop();
        Row.pop()
      })) : If.branchId(1);
      o || If.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    If.pop();
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      If.create();
      this.operationType === OperationType.TEXT_ARROW && null != this.operationItem ? this.ifElseBranchUpdateFunction(0, (() => {
        this.TextArrowStyle.bind(this)(this.operationItem[0])
      })) : If.branchId(1);
      o || If.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    If.pop();
    this.observeComponentCreation(((e, o) => {
      ViewStackProcessor.StartGetAccessRecordingFor(e);
      If.create();
      this.operationType === OperationType.LOADING ? this.ifElseBranchUpdateFunction(0, (() => {
        this.LoadingProcessStyle.bind(this)()
      })) : If.branchId(1);
      o || If.pop();
      ViewStackProcessor.StopGetAccessRecording()
    }));
    If.pop();
    Flex.pop()
  }

  rerender() {
    this.updateDirtyElements()
  }
}

export default { OperationStyle, SubHeader }