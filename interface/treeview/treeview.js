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

var __decorate = this && this.__decorate || function (e, t, o, i) {
  var s, a = arguments.length, d = a < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, o) : i;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) d = Reflect.decorate(e, t, o, i); else for (var r = e.length - 1;r >= 0; r--) (s = e[r]) && (d = (a < 3 ? s(d) : a > 3 ? s(t, o, d) : s(t, o)) || d);
  return a > 3 && d && Object.defineProperty(t, o, d), d
};

export var TreeView;
!function(e){
  const t = "#00000000";
  const o = "#FFFFFF";

  class i {
    constructor() {
      this._events = []
    }

    on(e, t) {
      if (Array.isArray(e)) for (let o = 0,
        i = e.length;o < i; o++) this.on(e[o], t); else (this._events[e] || (this._events[e] = [])).push(t)
    }

    once(e, t) {
      let o = this;

      function i() {
        o.off(e, i);
        t.apply(null, [e, t])
      }

      i.callback = t;
      this.on(e, i)
    }

    off(e, t) {
      null == e && (this._events = []);
      if (Array.isArray(e)) for (let o = 0, i = e.length;o < i; o++) this.off(e[o], t);
      const o = this._events[e];
      if (!o) return;
      null == t && (this._events[e] = null);
      let i, s = o.length;
      for (; s--; ) {
        i = o[s];
        if (i === t || i.callback === t) {
          o.splice(s, 1);
          break
        }
      }
    }

    emit(e, t) {
      let o = this;
      if (!this._events[e]) return;
      let i = [...this._events[e]];
      if (i) for (let e = 0, s = i.length;e < s; e++) try {
        i[e].apply(o, t)
      } catch (e) {
        new Error(e)
      }
    }
  }

  e.TreeListener = i;
  let s;
  !function(e){
    e.NODE_ADD = "NodeAdd";
    e.NODE_DELETE = "NodeDelete";
    e.NODE_MODIFY = "NodeModify";
    e.NODE_MOVE = "NodeMove";
    e.NODE_CLICK = "NodeClick"
  }(s = e.TreeListenType || (e.TreeListenType = {}));

  class a {
    constructor() {
      this.appEventBus = new i
    }

    static getInstance() {
      null == AppStorage.Get(this.APP_KEY_EVENT_BUS) && AppStorage.SetOrCreate(this.APP_KEY_EVENT_BUS, new a);
      return AppStorage.Get(this.APP_KEY_EVENT_BUS)
    }

    getTreeListener() {
      return this.appEventBus
    }
  }

  a.APP_KEY_EVENT_BUS = "app_key_event_bus";
  e.TreeListenerManager = a;

  class d {
    constructor() {
      this.listeners = []
    }

    totalCount() {
      return 0
    }

    getData(e) {
    }

    registerDataChangeListener(e) {
      this.listeners.indexOf(e) < 0 && this.listeners.push(e)
    }

    unregisterDataChangeListener(e) {
      const t = this.listeners.indexOf(e);
      t >= 0 && this.listeners.splice(t, 1)
    }

    notifyDataReload() {
      this.listeners.forEach((e => {
        e.onDataReloaded()
      }))
    }

    notifyDataAdd(e) {
      this.listeners.forEach((t => {
        t.onDataAdd(e)
      }))
    }

    notifyDataChange(e) {
      this.listeners.forEach((t => {
        t.onDataChange(e)
      }))
    }

    notifyDataDelete(e) {
      this.listeners.forEach((t => {
        t.onDataDelete(e)
      }))
    }

    notifyDataMove(e, t) {
      this.listeners.forEach((o => {
        o.onDataMove(e, t)
      }))
    }
  }

  let r;
  !function(e){
    e[e.TOUCH_DOWN=0] = "TOUCH_DOWN";
    e[e.TOUCH_UP=1] = "TOUCH_UP";
    e[e.HOVER=3] = "HOVER";
    e[e.HOVER_OVER=4] = "HOVER_OVER";
    e[e.FOCUS=5] = "FOCUS";
    e[e.BLUR=6] = "BLUR";
    e[e.MOUSE_BUTTON_RIGHT=7] = "MOUSE_BUTTON_RIGHT";
    e[e.DRAG=8] = "DRAG"
  }(r = e.Event || (e.Event = {}));
  let n;
  !function(e){
    e[e.ADD_NODE=0] = "ADD_NODE";
    e[e.REMOVE_NODE=1] = "REMOVE_NODE";
    e[e.MODIFY_NODE=2] = "MODIFY_NODE";
    e[e.COMMIT_NODE=3] = "COMMIT_NODE"
  }(n = e.MenuOperation || (e.MenuOperation = {}));
  let l;
  !function(e){
    e[e.HINTS=0] = "HINTS";
    e[e.WARNINGS=1] = "WARNINGS"
  }(l = e.PopUpType || (e.PopUpType = {}));
  let h;
  !function(e){
    e[e.INVALID_ERROR=0] = "INVALID_ERROR";
    e[e.LENGTH_ERROR=1] = "LENGTH_ERROR";
    e[e.NONE=2] = "NONE"
  }(h = e.InputError || (e.InputError = {}));
  let g;
  !function(e){
    e[e.DOWN_FLAG=0] = "DOWN_FLAG";
    e[e.UP_FLAG=1] = "UP_FLAG";
    e[e.NONE=2] = "NONE"
  }(g = e.Flag || (e.Flag = {}));

  class c {
    constructor(e) {
      this.data = e;
      this.nodeLevel = -1;
      this.parentNodeId = -1;
      this.nodeItem = { imageNode: null, mainTitleNode: null, imageCollapse: null };
      this.childNodeInfo = { isHasChildNode: !1, childNum: 0, allChildNum: 0 };
      this.menu = e.menu;
      e.icon && (this.nodeItem.imageNode = new p(e.icon, e.selectedIcon, e.editIcon, {
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_alpha_content_fourth"],
        bundleName: "",
        moduleName: ""
      }, 24, 24));
      e.primaryTitle && (this.nodeItem.mainTitleNode = new m(e.primaryTitle));
      this.children = []
    }

    addImageCollapse(e) {
      if (e) {
        this.nodeItem.imageCollapse = new p({
          id: -1,
          type: 2e4,
          params: ["sys.media.ohos_ic_public_arrow_right"],
          bundleName: "",
          moduleName: ""
        }, null, null, {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_alpha_content_tertiary"],
          bundleName: "",
          moduleName: ""
        }, 24, 24);
        this.nodeItem.imageCollapse.itemRightMargin = {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_paragraph_margin_xs"],
          bundleName: "",
          moduleName: ""
        }
      } else this.nodeItem.imageCollapse = null
    }

    getNodeItem() {
      return this.nodeItem
    }

    getChildNodeInfo() {
      return this.childNodeInfo
    }

    getMenu() {
      return this.menu
    }

    getCurrentNodeId() {
      return this.currentNodeId
    }

    getIsFolder() {
      return this.data.isFolder
    }
  }

  e.NodeItem = c;

  class N {
    constructor() {
    }

    set itemWidth(e) {
      this.width = e
    }

    get itemWidth() {
      return this.width
    }

    set itemHeight(e) {
      this.height = e
    }

    get itemHeight() {
      return this.height
    }

    set itemRightMargin(e) {
      this.rightMargin = e
    }

    get itemRightMargin() {
      return this.rightMargin
    }
  }

  let I;
  !function(e){
    e[e.Expand=0] = "Expand";
    e[e.Collapse=1] = "Collapse"
  }(I = e.NodeStatus || (e.NodeStatus = {}));
  let u;
  !function(e){
    e[e.Normal=0] = "Normal";
    e[e.Selected=1] = "Selected";
    e[e.Edit=2] = "Edit";
    e[e.FinishEdit=3] = "FinishEdit";
    e[e.DragInsert=4] = "DragInsert";
    e[e.FinishDragInsert=5] = "FinishDragInsert"
  }(u = e.InteractionStatus || (e.InteractionStatus = {}));

  class p extends N {
    constructor(e, t, o, i, s, a) {
      super();
      this.rightMargin = {
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_elements_margin_horizontal_m"],
        bundleName: "",
        moduleName: ""
      };
      this.imageSource = e;
      this.imageNormalSource = e;
      this.imageSelectedSource = null != t ? t : this.imageNormalSource;
      this.imageEditSource = null != o ? o : this.imageNormalSource;
      this.imageOpacity = i;
      this.itemWidth = s;
      this.itemHeight = a;
      this.imageCollapseSource = e;
      this.imageCollapseDownSource = {
        id: -1,
        type: 2e4,
        params: ["sys.media.ohos_ic_public_arrow_down"],
        bundleName: "",
        moduleName: ""
      };
      this.imageCollapseRightSource = {
        id: -1,
        type: 2e4,
        params: ["sys.media.ohos_ic_public_arrow_right"],
        bundleName: "",
        moduleName: ""
      };
      this.isImageCollapse = !0
    }

    get source() {
      return this.imageSource
    }

    get normalSource() {
      return this.imageNormalSource
    }

    get selectedSource() {
      return this.imageSelectedSource
    }

    get editSource() {
      return this.imageEditSource
    }

    get opacity() {
      return this.imageOpacity
    }

    get noOpacity() {
      return 1
    }

    get collapseSource() {
      return this.imageCollapseSource
    }

    get isCollapse() {
      return this.isImageCollapse
    }

    changeImageCollapseSource(e) {
      e == I.Expand ? this.imageCollapseSource = this.imageCollapseDownSource : e == I.Collapse && (this.imageCollapseSource = this.imageCollapseRightSource)
    }

    setImageCollapseSource(e, t) {
      if (e === u.Edit || e === u.DragInsert) {
        this.imageCollapseDownSource = {
          id: -1,
          type: 2e4,
          params: ["sys.media.ohos_ic_public_arrow_down"],
          bundleName: "",
          moduleName: ""
        };
        this.imageCollapseRightSource = {
          id: -1,
          type: 2e4,
          params: ["sys.media.ohos_ic_public_arrow_right"],
          bundleName: "",
          moduleName: ""
        };
        this.isImageCollapse = !1
      } else if (e === u.FinishEdit || e === u.FinishDragInsert) {
        this.imageCollapseDownSource = {
          id: -1,
          type: 2e4,
          params: ["sys.media.ohos_ic_public_arrow_down"],
          bundleName: "",
          moduleName: ""
        };
        this.imageCollapseRightSource = {
          id: -1,
          type: 2e4,
          params: ["sys.media.ohos_ic_public_arrow_right"],
          bundleName: "",
          moduleName: ""
        };
        this.isImageCollapse = !0
      }
      this.imageCollapseSource = t == I.Collapse ? this.imageCollapseRightSource : this.imageCollapseDownSource
    }

    setImageSource(e) {
      switch (e) {
        case u.Normal:
          this.imageSource = this.imageNormalSource;
          this.currentInteractionStatus = e;
          break;
        case u.Selected:
          if (this.currentInteractionStatus !== u.Edit) {
            this.imageSource = this.imageSelectedSource;
            this.currentInteractionStatus = e
          }
          break;
        case u.Edit:
          this.imageSource = this.imageEditSource;
          this.currentInteractionStatus = e;
          break;
        case u.FinishEdit:
          this.imageSource = this.imageSelectedSource;
          this.currentInteractionStatus = e;
          break;
        case u.DragInsert:
          this.imageSource = this.imageEditSource;
          this.currentInteractionStatus = e;
          break;
        case u.FinishDragInsert:
          this.imageSource = this.imageNormalSource;
          this.currentInteractionStatus = e
      }
    }
  }

  e.ImageNode = p;

  class m extends N {
    constructor(e) {
      super();
      this.mainTitleName = e;
      this.itemWidth = 0;
      this.itemHeight = 44;
      this.rightMargin = {
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_paragraph_margin_xs"],
        bundleName: "",
        moduleName: ""
      };
      this.mainTitleSetting = {
        fontColor: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_primary"],
          bundleName: "",
          moduleName: ""
        },
        fontSize: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_size_body1"],
          bundleName: "",
          moduleName: ""
        },
        fontWeight: FontWeight.Normal
      };
      this.showPopUpTimeout = 0
    }

    setMainTitleSelected(e) {
      this.mainTitleSetting = e ? {
                                    fontColor: {
                                      id: -1,
                                      type: 10001,
                                      params: ["sys.color.ohos_id_color_text_primary_activated"],
                                      bundleName: "",
                                      moduleName: ""
                                    },
                                    fontSize: {
                                      id: -1,
                                      type: 10002,
                                      params: ["sys.float.ohos_id_text_size_body1"],
                                      bundleName: "",
                                      moduleName: ""
                                    },
                                    fontWeight: FontWeight.Regular
                                  } : {
                                        fontColor: {
                                          id: -1,
                                          type: 10001,
                                          params: ["sys.color.ohos_id_color_primary"],
                                          bundleName: "",
                                          moduleName: ""
                                        },
                                        fontSize: {
                                          id: -1,
                                          type: 10002,
                                          params: ["sys.float.ohos_id_text_size_body1"],
                                          bundleName: "",
                                          moduleName: ""
                                        },
                                        fontWeight: FontWeight.Normal
                                      }
    }

    set title(e) {
      this.mainTitleName = e
    }

    get title() {
      return this.mainTitleName
    }

    set popUpTimeout(e) {
      this.showPopUpTimeout = e
    }

    get popUpTimeout() {
      return this.showPopUpTimeout
    }

    get color() {
      return this.mainTitleSetting.fontColor
    }

    get size() {
      return this.mainTitleSetting.fontSize
    }

    get weight() {
      return this.mainTitleSetting.fontWeight
    }

    setMainTitleHighLight(e) {
      this.mainTitleSetting = e ? {
                                    fontColor: {
                                      id: -1,
                                      type: 10001,
                                      params: ["sys.color.ohos_id_color_primary_contrary"],
                                      bundleName: "",
                                      moduleName: ""
                                    },
                                    fontSize: {
                                      id: -1,
                                      type: 10002,
                                      params: ["sys.float.ohos_id_text_size_body1"],
                                      bundleName: "",
                                      moduleName: ""
                                    },
                                    fontWeight: FontWeight.Regular
                                  } : {
                                        fontColor: {
                                          id: -1,
                                          type: 10001,
                                          params: ["sys.color.ohos_id_color_primary"],
                                          bundleName: "",
                                          moduleName: ""
                                        },
                                        fontSize: {
                                          id: -1,
                                          type: 10002,
                                          params: ["sys.float.ohos_id_text_size_body1"],
                                          bundleName: "",
                                          moduleName: ""
                                        },
                                        fontWeight: FontWeight.Normal
                                      }
    }
  }

  e.MainTitleNode = m;

  class f extends N {
    constructor() {
      super();
      this.statusColor = {
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_background"],
        bundleName: "",
        moduleName: ""
      };
      this.editItemColor = {
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_emphasize"],
        bundleName: "",
        moduleName: ""
      };
      this.radius = {
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_corner_radius_default_xs"],
        bundleName: "",
        moduleName: ""
      };
      this.itemWidth = 0;
      this.itemHeight = 32;
      this.rightMargin = {
        id: -1,
        type: 10002,
        params: ["sys.float.ohos_id_text_paragraph_margin_xs"],
        bundleName: "",
        moduleName: ""
      };
      this.inputTextSetting = {
        fontColor: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_text_primary"],
          bundleName: "",
          moduleName: ""
        },
        fontSize: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_size_body1"],
          bundleName: "",
          moduleName: ""
        },
        fontWeight: FontWeight.Normal
      }
    }

    get color() {
      return this.inputTextSetting.fontColor
    }

    get size() {
      return this.inputTextSetting.fontSize
    }

    get weight() {
      return this.inputTextSetting.fontWeight
    }

    get borderRadius() {
      return this.radius
    }

    get backgroundColor() {
      return this.statusColor
    }

    get editColor() {
      return this.editItemColor
    }

    get textInputStatusColor() {
      return this.status
    }
  }

  e.InputText = f;

  class S {
    constructor(e) {
      this.borderWidth = { has: 2, none: 0 };
      this.canShowFlagLine = !1;
      this.isOverBorder = !1;
      this.canShowBottomFlagLine = !1;
      this.isHighLight = !1;
      this.isModify = !1;
      this.childNodeInfo = e.getChildNodeInfo();
      this.nodeItem = { imageNode: null, inputText: null, mainTitleNode: null, imageCollapse: null };
      this.popUpInfo = {
        popUpIsShow: !1,
        popUpEnableArrow: !1,
        popUpColor: null,
        popUpText: "",
        popUpTextColor: null
      };
      this.nodeItem.imageNode = e.getNodeItem().imageNode;
      this.nodeItem.inputText = new f;
      this.nodeItem.mainTitleNode = e.getNodeItem().mainTitleNode;
      this.nodeItem.imageCollapse = e.getNodeItem().imageCollapse;
      this.menu = e.menu;
      this.parentNodeId = e.parentNodeId;
      this.currentNodeId = e.currentNodeId;
      this.nodeHeight = 44;
      this.nodeLevel = e.nodeLevel;
      this.nodeLeftPadding = 12 * e.nodeLevel + 8;
      this.nodeColor = {
        id: -1,
        type: 10001,
        params: ["sys.color.ohos_id_color_background"],
        bundleName: "",
        moduleName: ""
      };
      this.nodeIsShow = !(this.nodeLevel > 0);
      this.listItemHeight = this.nodeLevel > 0 ? 0 : 48;
      this.isShowTitle = !0;
      this.isShowInputText = !1;
      this.isSelected = !1;
      this.status = {
        normal: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_background_transparent"],
          bundleName: "",
          moduleName: ""
        },
        hover: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_hover"],
          bundleName: "",
          moduleName: ""
        },
        press: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_click_effect"],
          bundleName: "",
          moduleName: ""
        },
        selected: "#1A0A59F7",
        highLight: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_activated"],
          bundleName: "",
          moduleName: ""
        }
      };
      this.nodeBorder = {
        borderWidth: 0,
        borderColor: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_focused_outline"],
          bundleName: "",
          moduleName: ""
        },
        borderRadius: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_corner_radius_clicked"],
          bundleName: "",
          moduleName: ""
        }
      };
      this.flagLineLeftMargin = 12 * e.nodeLevel + 8;
      this.node = e;
      this.nodeParam = e.data
    }

    getPopUpInfo() {
      return this.popUpInfo
    }

    setPopUpIsShow(e) {
      this.popUpInfo.popUpIsShow = e
    }

    setPopUpEnableArrow(e) {
      this.popUpInfo.popUpEnableArrow = e
    }

    setPopUpColor(e) {
      this.popUpInfo.popUpColor = e
    }

    setPopUpText(e) {
      this.popUpInfo.popUpText = e
    }

    setPopUpTextColor(e) {
      this.popUpInfo.popUpTextColor = e
    }

    getIsShowTitle() {
      return this.isShowTitle
    }

    getIsShowInputText() {
      return this.isShowInputText
    }

    setTitleAndInputTextStatus(e) {
      if (e) {
        this.isShowTitle = !1;
        this.isShowInputText = !0
      } else {
        this.isShowTitle = !0;
        this.isShowInputText = !1
      }
    }

    handleImageCollapseAfterAddNode(e) {
      if (e) {
        this.nodeItem.imageCollapse = new p({
          id: -1,
          type: 2e4,
          params: ["sys.media.ohos_ic_public_arrow_down"],
          bundleName: "",
          moduleName: ""
        }, null, null, {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_alpha_content_tertiary"],
          bundleName: "",
          moduleName: ""
        }, 24, 24);
        this.nodeItem.imageCollapse.itemRightMargin = {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_paragraph_margin_xs"],
          bundleName: "",
          moduleName: ""
        }
      } else this.nodeItem.imageCollapse = null
    }

    setNodeColor(e) {
      this.nodeColor = e
    }

    getNodeColor() {
      return this.nodeColor
    }

    setListItemHeight(e) {
      this.listItemHeight = e
    }

    getListItemHeight() {
      return this.listItemHeight
    }

    getNodeCurrentNodeId() {
      return this.currentNodeId
    }

    getNodeParentNodeId() {
      return this.parentNodeId
    }

    getNodeLeftPadding() {
      return this.nodeLeftPadding
    }

    getNodeHeight() {
      return this.nodeHeight
    }

    setNodeIsShow(e) {
      this.nodeIsShow = e
    }

    getNodeIsShow() {
      return this.nodeIsShow
    }

    getNodeItem() {
      return this.nodeItem
    }

    getNodeStatus() {
      return this.status
    }

    getNodeBorder() {
      return this.nodeBorder
    }

    setNodeBorder(e) {
      this.nodeBorder.borderWidth = e ? this.borderWidth.has : this.borderWidth.none
    }

    getChildNodeInfo() {
      return this.childNodeInfo
    }

    getCurrentNodeId() {
      return this.currentNodeId
    }

    getMenu() {
      return this.menu
    }

    setIsSelected(e) {
      this.isSelected = e
    }

    getIsSelected() {
      return this.isSelected
    }

    getNodeInfoData() {
      return this.nodeParam
    }

    getNodeInfoNode() {
      return this.node
    }

    getIsFolder() {
      return this.nodeParam.isFolder
    }

    setCanShowFlagLine(e) {
      this.canShowFlagLine = e
    }

    getCanShowFlagLine() {
      return this.canShowFlagLine
    }

    setFlagLineLeftMargin(e) {
      this.flagLineLeftMargin = 12 * e + 8
    }

    getFlagLineLeftMargin() {
      return this.flagLineLeftMargin
    }

    getNodeLevel() {
      return this.nodeLevel
    }

    setIsOverBorder(e) {
      this.isOverBorder = e
    }

    getIsOverBorder() {
      return this.isOverBorder
    }

    setCanShowBottomFlagLine(e) {
      this.canShowBottomFlagLine = e
    }

    getCanShowBottomFlagLine() {
      return this.canShowBottomFlagLine
    }

    setIsHighLight(e) {
      this.isHighLight = e
    }

    getIsHighLight() {
      return this.isHighLight
    }

    setIsModify(e) {
      this.isModify = e
    }

    getIsModify() {
      return this.isModify
    }
  }

  e.NodeInfo = S;

  class C {
    constructor() {
      this.MaxNodeLevel = 50;
      this.MAX_CN_LENGTH = 254;
      this.MAX_EN_LENGTH = 255;
      this.INITIAL_INVALID_VALUE = -1;
      this._root = new c({});
      this._root.nodeLevel = -1;
      this._root.parentNodeId = -1;
      this._root.currentNodeId = -1
    }

    getNewNodeId() {
      return this.addNewNodeId
    }

    traverseNodeDF(e, t = this._root) {
      let o = [], i = !1;
      o.unshift(t);
      let s = o.shift();
      for (;!i && s; ) {
        i = !0 === e(s);
        if (!i) {
          o.unshift(...s.children);
          s = o.shift()
        }
      }
    }

    traverseNodeBF(e) {
      let t = [];
      let o = !1;
      t.push(this._root);
      let i = t.shift();
      for (;!o && i; ) {
        try {
          o = e(i)
        } catch (e) {
          e.name, e.message
        }
        if (!o) {
          t.push(...i.children);
          i = t.shift()
        }
      }
    }

    contains(e, t) {
      t.call(this, e,!0)
    }

    updateParentChildNum(e, t, o) {
      let i = e.parentNodeId;
      for (; i >= 0; ) this.traverseNodeDF((e => {
        if (e.currentNodeId == i) {
          e.getChildNodeInfo().allChildNum = t ? e.getChildNodeInfo().allChildNum + o : e.getChildNodeInfo()
                                                                                          .allChildNum - o;
          i = e.parentNodeId;
          return !1
        }
        return !1
      }))
    }

    findParentNodeId(e) {
      let t = null;
      this.contains((function (o) {
        if (o.currentNodeId == e) {
          t = o;
          return !0
        }
        return !1
      }), this.traverseNodeBF);
      return t.parentNodeId
    }

    addNode(e, t, o) {
      if (null === this._root) {
        this._root = new c({});
        this._root.nodeLevel = -1;
        this._root.parentNodeId = -1;
        this._root.currentNodeId = -1
      }
      let i = null;
      this.contains((function (t) {
        if (t.currentNodeId == e) {
          i = t;
          return !0
        }
        return !1
      }), this.traverseNodeBF);
      if (i) {
        let s = new c(o);
        if (i.nodeLevel > this.MaxNodeLevel) throw new Error("ListNodeUtils[addNode]: The level of the tree view cannot exceed 50.");
        s.nodeLevel = i.nodeLevel + 1;
        s.parentNodeId = e;
        s.currentNodeId = t;
        i.children.push(s);
        i.getChildNodeInfo().isHasChildNode = !0;
        i.getChildNodeInfo().childNum = i.children.length;
        i.getChildNodeInfo().allChildNum += 1;
        i.addImageCollapse(i.getChildNodeInfo().isHasChildNode);
        this.updateParentChildNum(i,!0, 1);
        return this
      }
      throw new Error("ListNodeUtils[addNode]: Parent node not found.")
    }

    findNodeIndex(e, t) {
      let o = this.INITIAL_INVALID_VALUE;
      for (let i = 0, s = e.length;i < s; i++) if (e[i].currentNodeId === t) {
        o = i;
        break
      }
      return o
    }

    freeNodeMemory(e, t) {
      let o = [];
      this.traverseNodeDF((function (e) {
        o.push(e);
        return !1
      }), e);
      o.forEach((e => {
        t.push(e.currentNodeId);
        e = null
      }))
    }

    removeNode(e, t, o) {
      let i = null;
      this.contains((function (e) {
        if (e.currentNodeId == t) {
          i = e;
          return !0
        }
        return !1
      }), o);
      if (i) {
        let t = [];
        let o = this.findNodeIndex(i.children, e);
        if (o < 0) throw new Error("Node does not exist.");
        {
          var s = i.children[o].getChildNodeInfo().allChildNum + 1;
          this.freeNodeMemory(i.children[o], t);
          let e = i.children.splice(o, 1);
          e = null;
          0 == i.children.length && i.addImageCollapse(!1)
        }
        i.getChildNodeInfo().childNum = i.children.length;
        i.getChildNodeInfo().allChildNum -= s;
        this.updateParentChildNum(i,!1, s);
        return t
      }
      throw new Error("Parent does not exist.")
    }

    getNewNodeInfo(e) {
      let t = null;
      this.contains((function (o) {
        if (o.currentNodeId == e) {
          t = o;
          return !0
        }
        return !1
      }), this.traverseNodeBF);
      let o = {
        isFolder: !0,
        icon: null,
        selectedIcon: null,
        editIcon: null,
        menu: null,
        secondaryTitle: ""
      };
      if (t) if (0 === t.children.length) if (null != t.getNodeItem().imageNode) {
        o.icon = t.getNodeItem().imageNode.normalSource;
        o.selectedIcon = t.getNodeItem().imageNode.selectedSource;
        o.editIcon = t.getNodeItem().imageNode.editSource;
        o.menu = t.getMenu()
      } else {
        o.icon = null;
        o.selectedIcon = null;
        o.editIcon = null;
        o.menu = t.getMenu()
      } else if (t.children.length > 0) if (null != t.getNodeItem().imageNode) {
        o.icon = null != t.children[0].getNodeItem().imageNode ? t.children[0].getNodeItem()
                                                                   .imageNode
                                                                   .normalSource : null;
        o.selectedIcon = null != t.children[0].getNodeItem().imageNode ? t.children[0].getNodeItem()
                                                                           .imageNode
                                                                           .selectedSource : null;
        o.editIcon = null != t.children[0].getNodeItem().imageNode ? t.children[0].getNodeItem()
                                                                       .imageNode
                                                                       .editSource : null;
        o.menu = t.children[0].getMenu()
      } else {
        o.icon = null;
        o.selectedIcon = null;
        o.editIcon = null;
        o.menu = t.children[0].getMenu()
      }
      return o
    }

    getClickChildId(e) {
      let t = null;
      this.contains((function (o) {
        if (o.currentNodeId == e) {
          t = o;
          return !0
        }
        return !1
      }), this.traverseNodeBF);
      if (t) {
        if (0 === t.children.length) return [];
        if (t.children.length > 0) {
          var o = new Array(t.children.length);
          for (let e = 0;e < o.length; e++) o[e] = 0;
          for (let e = 0;e < t.children.length && e < o.length; e++) o[e] = t.children[e].currentNodeId;
          return o
        }
      }
      return []
    }

    getClickNodeChildrenInfo(e) {
      let t = null;
      this.contains((function (o) {
        if (o.currentNodeId == e) {
          t = o;
          return !0
        }
        return !1
      }), this.traverseNodeBF);
      if (t) {
        if (0 === t.children.length) return [];
        if (t.children.length > 0) {
          var o = new Array(t.children.length);
          for (let e = 0;e < o.length; e++) o[e] = { itemId: null, itemIcon: null, itemTitle: null, isFolder: null };
          for (let e = 0;e < t.children.length && e < o.length; e++) {
            o[e].itemId = t.children[e].currentNodeId;
            t.children[e].getNodeItem().imageNode && (o[e].itemIcon = t.children[e].getNodeItem().imageNode.source);
            t.children[e].getNodeItem().mainTitleNode && (o[e].itemTitle = t.children[e].getNodeItem()
              .mainTitleNode
              .title);
            o[e].isFolder = t.children[e].getIsFolder()
          }
          return o
        }
      }
      return []
    }

    checkMainTitleIsValid(e) {
      let t = /^[\u4e00-\u9fa5]+$/;
      return!/[\\\/:*?"<>|]/.test(e) && !(t.test(e) && e.length > this.MAX_CN_LENGTH || !t.test(e) && e.length > this.MAX_EN_LENGTH)
    }

    dragTraverseNodeDF(e, t = this._root, o) {
      let i = [], s = !1;
      i.unshift(t);
      let a = i.shift();
      for (;!s && a; ) {
        s = !0 === e(a, o);
        if (!s) {
          i.unshift(...a.children);
          a = i.shift()
        }
      }
    }

    addDragNode(e, t, o, i, s) {
      if (null === this._root) {
        this._root = new c({});
        this._root.nodeLevel = this.INITIAL_INVALID_VALUE;
        this._root.parentNodeId = this.INITIAL_INVALID_VALUE;
        this._root.currentNodeId = this.INITIAL_INVALID_VALUE
      }
      let a = null;
      this.contains((function (t) {
        if (t.currentNodeId == e) {
          a = t;
          return !0
        }
        return !1
      }), this.traverseNodeBF);
      if (a) {
        let d = new c(s);
        if (a.nodeLevel > this.MaxNodeLevel) throw new Error("ListNodeUtils[addNode]: The level of the tree view cannot exceed 50.");
        d.nodeLevel = a.nodeLevel + 1;
        d.parentNodeId = e;
        d.currentNodeId = t;
        let r = this.INITIAL_INVALID_VALUE;
        if (a.children.length) {
          for (let e = 0;e < a.children.length; e++) if (a.children[e].getCurrentNodeId() == o) {
            r = e;
            break
          }
          i ? a.children.splice(r + 1, 0, d) : a.children.splice(r, 0, d)
        } else a.children.push(d);
        a.getChildNodeInfo().isHasChildNode = !0;
        a.getChildNodeInfo().childNum = a.children.length;
        a.getChildNodeInfo().allChildNum += 1;
        a.addImageCollapse(a.getChildNodeInfo().isHasChildNode);
        this.updateParentChildNum(a,!0, 1);
        return this
      }
      throw new Error("ListNodeUtils[addNode]: Parent node not found.")
    }
  }

  e.ListNodeUtils = C;

  class D extends d {
    constructor() {
      super(...arguments);
      this.ROOT_NODE_ID = -1;
      this.listNodeUtils = new C;
      this.listNode = [];
      this.INITIAL_INVALID_VALUE = -1;
      this.lastIndex = -1;
      this.thisIndex = -1;
      this.modifyNodeIndex = -1;
      this.modifyNodeId = -1;
      this.expandAndCollapseInfo = new Map;
      this.loadedNodeIdAndIndexMap = new Map;
      this.isTouchDown = !1;
      this.appEventBus = a.getInstance().getTreeListener();
      this.isInnerDrag = !1;
      this.isDrag = !1;
      this.draggingCurrentNodeId = this.INITIAL_INVALID_VALUE;
      this.draggingParentNodeId = this.INITIAL_INVALID_VALUE;
      this.currentNodeInfo = null;
      this.listItemOpacity = 1;
      this.lastPassIndex = this.INITIAL_INVALID_VALUE;
      this.lastPassId = this.INITIAL_INVALID_VALUE;
      this.thisPassIndex = this.INITIAL_INVALID_VALUE;
      this.lastDelayExpandIndex = this.INITIAL_INVALID_VALUE;
      this.timeoutExpandId = this.INITIAL_INVALID_VALUE;
      this.lastTimeoutExpandId = this.INITIAL_INVALID_VALUE;
      this.clearTimeoutExpandId = this.INITIAL_INVALID_VALUE;
      this.timeoutHighLightId = this.INITIAL_INVALID_VALUE;
      this.lastTimeoutHighLightId = this.INITIAL_INVALID_VALUE;
      this.clearTimeoutHighLightId = this.INITIAL_INVALID_VALUE;
      this.lastDelayHighLightIndex = this.INITIAL_INVALID_VALUE;
      this.lastDelayHighLightId = this.INITIAL_INVALID_VALUE;
      this.nodeIdAndSubtitleMap = new Map;
      this.flag = g.NONE;
      this.selectedParentNodeId = this.INITIAL_INVALID_VALUE;
      this.selectedParentNodeSubtitle = "";
      this.insertNodeSubtitle = "";
      this.currentFocusNodeId = this.INITIAL_INVALID_VALUE;
      this.lastFocusNodeId = this.INITIAL_INVALID_VALUE;
      this.addFocusNodeId = this.INITIAL_INVALID_VALUE;
      this.FLAG_LINE = {
        flagLineHeight: "1.5vp",
        flagLineColor: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_activated"],
          bundleName: "",
          moduleName: ""
        },
        xOffset: "0vp",
        yTopOffset: "2.75vp",
        yBottomOffset: "-1.25vp",
        yBasePlateOffset: "1.5vp"
      };
      this.DRAG_POPUP = {
        floorConstraintSize: { minWidth: "128vp", maxWidth: "208vp" },
        textConstraintSize: { minWidth1: "80vp", maxWidth1: "160vp", minWidth2: "112vp", maxWidth2: "192vp" },
        padding: { left: "8vp", right: "8vp" },
        backgroundColor: o,
        height: "48",
        shadow: {
          radius: {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_corner_radius_default_m"],
            bundleName: "",
            moduleName: ""
          },
          color: "#00001E",
          offsetX: 0,
          offsetY: 10
        },
        borderRadius: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_corner_radius_clicked"],
          bundleName: "",
          moduleName: ""
        },
        fontColor: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_primary"],
          bundleName: "",
          moduleName: ""
        },
        fontSize: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_size_body1"],
          bundleName: "",
          moduleName: ""
        },
        fontWeight: FontWeight.Regular,
        imageOpacity: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_alpha_content_fourth"],
          bundleName: "",
          moduleName: ""
        }
      };
      this.subTitle = {
        normalFontColor: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_secondary"],
          bundleName: "",
          moduleName: ""
        },
        highLightFontColor: {
          id: -1,
          type: 10001,
          params: ["sys.color.ohos_id_color_primary_contrary"],
          bundleName: "",
          moduleName: ""
        },
        fontSize: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_size_body2"],
          bundleName: "",
          moduleName: ""
        },
        fontWeight: FontWeight.Regular,
        margin: { left: "4vp", right: "24" }
      }
    }

    changeNodeColor(e, t) {
      this.listNode[e].setNodeColor(t)
    }

    getNodeColor(e) {
      return this.listNode[e].getNodeColor()
    }

    handleFocusEffect(e, t) {
      this.listNode[e].getNodeIsShow() && this.listNode[e].setNodeBorder(t)
    }

    setImageSource(e, t) {
      let o = this.listNode[e];
      o.setIsSelected(t === u.Selected || t === u.Edit || t === u.FinishEdit);
      null != o.getNodeItem().mainTitleNode && t != u.DragInsert && t != u.FinishDragInsert && o.getNodeItem()
        .mainTitleNode
        .setMainTitleSelected(t === u.Selected || t === u.FinishEdit);
      null != o.getNodeItem().imageNode && o.getNodeItem().imageNode.setImageSource(t)
    }

    setImageCollapseSource(e, t) {
      let o = this.listNode[e];
      null != o.getNodeItem().imageCollapse && o.getNodeItem()
        .imageCollapse
        .setImageCollapseSource(t, this.expandAndCollapseInfo.get(o.getCurrentNodeId()))
    }

    clearLastIndexStatus() {
      if (!(-1 == this.lastIndex || this.lastIndex >= this.listNode.length)) {
        this.setImageSource(this.lastIndex, u.Normal);
        this.changeNodeColor(this.lastIndex, this.listNode[this.lastIndex].getNodeStatus().normal);
        this.handleFocusEffect(this.lastIndex,!1);
        this.notifyDataChange(this.loadedNodeIdAndIndexMap.get(this.listNode[this.lastIndex].getCurrentNodeId()))
      }
    }

    changeNodeStatus(e) {
      let t = e;
      let o = this.ListNode;
      let i = o[e].getCurrentNodeId();
      if (this.expandAndCollapseInfo.get(i) == I.Expand) {
        this.expandAndCollapseInfo.set(i, I.Collapse);
        o[t].getNodeItem().imageCollapse.changeImageCollapseSource(I.Collapse)
      } else if (this.expandAndCollapseInfo.get(i) == I.Collapse) {
        this.expandAndCollapseInfo.set(i, I.Expand);
        o[t].getNodeItem().imageCollapse.changeImageCollapseSource(I.Expand)
      }
    }

    handleExpandAndCollapse(e) {
      let t = e;
      let o = this.ListNode;
      let i = o[t].getCurrentNodeId();
      if (!this.expandAndCollapseInfo.has(i)) return;
      let s = this.expandAndCollapseInfo.get(i);
      if (o[t].getChildNodeInfo().isHasChildNode && s == I.Collapse) {
        for (var a = 0;a < o[t].getChildNodeInfo().allChildNum; a++) {
          o[t + 1+a].setNodeIsShow(!1);
          o[t + 1+a].setListItemHeight(0)
        }
        this.notifyDataReload();
        return
      }
      let d = new Array(o[t].getChildNodeInfo().childNum);
      d[0] = t + 1;
      let r = 1;
      for (; r < o[t].getChildNodeInfo().childNum; ) {
        d[r] = d[r-1] + o[d[r-1]].getChildNodeInfo().allChildNum + 1;
        r++
      }
      if (s == I.Expand) for (a = 0; a < d.length; a++) {
        o[d[a]].setNodeIsShow(!0);
        o[d[a]].setListItemHeight(48);
        let e = o[d[a]].getCurrentNodeId();
        this.expandAndCollapseInfo.get(e) == I.Expand && this.handleExpandAndCollapse(d[a])
      }
      d = null;
      this.notifyDataReload()
    }

    init(e) {
      let t = 0;
      this.listNode = [];
      this.listNodeUtils = e;
      this.loadedNodeIdAndIndexMap.clear();
      this.listNodeUtils.traverseNodeDF((e => {
        if (e.currentNodeId >= 0) {
          var o = new S(e);
          this.listNode.push(o);
          o.getChildNodeInfo().isHasChildNode && this.expandAndCollapseInfo.set(o.getCurrentNodeId(), I.Collapse);
          o.getNodeIsShow() && this.loadedNodeIdAndIndexMap.set(o.getCurrentNodeId(), t++);
          o.getIsFolder() && this.nodeIdAndSubtitleMap.set(o.getCurrentNodeId(), o.getNodeInfoData()
                                                                                   .secondaryTitle || 0 == o.getNodeInfoData()
            .secondaryTitle ? o.getNodeInfoData().secondaryTitle : "")
        }
        return !1
      }))
    }

    refreshRemoveNodeData(e, t) {
      let o = [];
      for (let t = 0;t < e.length; t++) for (let i = 0;i < this.listNode.length; i++) if (this.listNode[i].getNodeCurrentNodeId() == e[t]) {
        let s = this.listNode[i].getNodeCurrentNodeId();
        this.loadedNodeIdAndIndexMap.has(s) && o.push(this.loadedNodeIdAndIndexMap.get(s));
        let a = this.listNode.splice(i, 1);
        a = null;
        this.expandAndCollapseInfo.has(e[t]) && this.expandAndCollapseInfo.delete(e[t]);
        break
      }
      o.forEach((e => {
        this.notifyDataDelete(e);
        this.notifyDataChange(e)
      }));
      for (let e = 0;e < this.listNode.length; e++) if (this.listNode[e].getNodeCurrentNodeId() == t.getNodeCurrentNodeId()) {
        if (null == t.getNodeItem().imageCollapse) {
          this.listNode[e].handleImageCollapseAfterAddNode(!1);
          this.expandAndCollapseInfo.delete(t.getNodeCurrentNodeId());
          this.notifyDataChange(this.loadedNodeIdAndIndexMap.get(this.listNode[e].getNodeCurrentNodeId()))
        }
        break
      }
      let i = { currentNodeId: t.getNodeCurrentNodeId(), parentNodeId: t.getNodeParentNodeId() };
      this.appEventBus.emit(s.NODE_DELETE, [i])
    }

    refreshAddNodeData(e) {
      var t;
      this.listNodeUtils.traverseNodeDF((o => {
        if (o.currentNodeId === e[0]) {
          t = new S(o);
          return !0
        }
        return !1
      }));
      t.setIsModify(!0);
      let o = 0;
      for (let e = 0;e < this.listNode.length; e++) if (this.listNode[e].getNodeCurrentNodeId() == t.getNodeParentNodeId()) {
        o = e;
        if (null == this.listNode[e].getNodeItem().imageCollapse) {
          this.listNode[e].handleImageCollapseAfterAddNode(!0);
          this.notifyDataChange(o)
        } else this.expandAndCollapseInfo.get(this.listNode[e].getNodeCurrentNodeId()) == I.Collapse && this.changeNodeStatus(o);
        this.listNode.splice(e + 1, 0, t);
        this.listNode[e+1].setTitleAndInputTextStatus(!0);
        this.listNode[e+1].setNodeIsShow(!0);
        this.listNode[e+1].setListItemHeight(48);
        this.setImageSource(e + 1, u.Edit);
        this.currentOperation = n.ADD_NODE;
        this.notifyDataAdd(e + 1);
        this.notificationNodeInfo(e + 1, this.currentOperation);
        break
      }
      this.modifyNodeIndex = o + 1;
      this.expandAndCollapseInfo.set(t.getNodeParentNodeId(), I.Expand);
      this.handleExpandAndCollapse(o)
    }

    refreshData(e, t, o, i) {
      let s;
      this.listNodeUtils = e;
      this.listNodeUtils.traverseNodeDF((e => {
        if (e.currentNodeId == o) {
          s = new S(e);
          return !0
        }
        return !1
      }));
      if (t === n.REMOVE_NODE) {
        this.nodeIdAndSubtitleMap.set(o, this.selectedParentNodeSubtitle);
        this.notifyDataChange(this.loadedNodeIdAndIndexMap.get(o));
        this.refreshRemoveNodeData(i, s)
      }
      if (t === n.ADD_NODE) {
        this.addFocusNodeId = i[0];
        this.nodeIdAndSubtitleMap.set(this.getClickNodeId(), this.selectedParentNodeSubtitle);
        this.nodeIdAndSubtitleMap.set(i[0], this.insertNodeSubtitle);
        this.refreshAddNodeData(i)
      }
    }

    setClickIndex(e) {
      this.thisIndex = e
    }

    getClickNodeId() {
      return this.thisIndex < 0 || this.thisIndex >= this.ListNode.length ? -1 : this.ListNode[this.thisIndex].getCurrentNodeId()
    }

    expandAndCollapseNode(e) {
      this.changeNodeStatus(e);
      this.handleExpandAndCollapse(e)
    }

    getIsTouchDown() {
      return this.isTouchDown
    }

    getLastIndex() {
      return this.lastIndex
    }

    handleEvent(e, t) {
      if (this.isDrag) return;
      e !== r.TOUCH_DOWN && e !== r.TOUCH_UP && e !== r.MOUSE_BUTTON_RIGHT || t != this.lastIndex && this.clearLastIndexStatus();
      let o = this.loadedNodeIdAndIndexMap.get(this.listNode[t].getCurrentNodeId());
      switch (e) {
        case r.TOUCH_DOWN:
          this.isTouchDown = !0;
          this.changeNodeColor(t, this.listNode[t].getNodeStatus().press);
          break;
        case r.TOUCH_UP: {
          this.isInnerDrag && (this.isInnerDrag = !1);
          this.isTouchDown = !1;
          let e = this.listNode[t];
          this.setImageSource(t, u.Selected);
          this.lastIndex = t;
          this.changeNodeColor(t, e.getNodeStatus().selected);
          this.notifyDataChange(o);
          break
        }
        case r.HOVER:
          if (this.getNodeColor(t) != this.listNode[t].getNodeStatus().selected) {
            this.changeNodeColor(t, this.listNode[t].getNodeStatus().hover);
            this.notifyDataChange(o)
          }
          break;
        case r.HOVER_OVER:
          if (this.getNodeColor(t) != this.listNode[t].getNodeStatus().selected) {
            this.changeNodeColor(t, this.listNode[t].getNodeStatus().normal);
            this.notifyDataChange(o)
          }
          break;
        case r.FOCUS:
          this.handleFocusEffect(t,!0);
          this.notifyDataChange(o);
          break;
        case r.BLUR:
          this.handleFocusEffect(t,!1);
          this.notifyDataChange(o);
          break;
        case r.MOUSE_BUTTON_RIGHT:
          this.lastIndex = t;
          this.finishEditing();
          break;
        case r.DRAG:
          this.isTouchDown = !1;
          let e = this.listNode[t];
          this.setImageSource(t, u.Selected);
          this.lastIndex = t;
          this.changeNodeColor(t, e.getNodeStatus().selected);
          this.notifyDataChange(o)
      }
    }

    notificationNodeInfo(e, t) {
      if (t === n.MODIFY_NODE) {
        let e = this.listNode[this.modifyNodeIndex];
        let t = { currentNodeId: e.getNodeCurrentNodeId(), parentNodeId: e.getNodeParentNodeId() };
        this.appEventBus.emit(s.NODE_MODIFY, [t])
      } else if (t === n.ADD_NODE) {
        let t = this.listNode[e];
        null != t.getNodeItem().imageNode && t.getNodeItem().imageNode.source;
        null != t.getNodeItem().imageNode && t.getNodeItem().imageNode.selectedSource;
        null != t.getNodeItem().imageNode && t.getNodeItem().imageNode.editSource;
        let o = { currentNodeId: t.getNodeCurrentNodeId(), parentNodeId: t.getNodeParentNodeId() };
        this.appEventBus.emit(s.NODE_ADD, [o])
      }
    }

    finishEditing() {
      if (-1 != this.modifyNodeIndex) {
        this.setImageSource(this.modifyNodeIndex, u.FinishEdit);
        this.setImageCollapseSource(this.modifyNodeIndex, u.FinishEdit);
        this.listNode[this.modifyNodeIndex].setIsModify(!1);
        this.listNode[this.modifyNodeIndex].setTitleAndInputTextStatus(!1);
        this.notificationNodeInfo(this.modifyNodeIndex, this.currentOperation);
        this.notifyDataChange(this.modifyNodeIndex)
      }
    }

    setItemVisibilityOnEdit(e, t) {
      let o = -1;
      if (-1 != e) {
        if (t === n.MODIFY_NODE) {
          for (let t = 0;t < this.listNode.length; t++) if (this.listNode[t].getCurrentNodeId() == e) {
            o = t;
            break
          }
          let t = this.listNode[o];
          t.setIsModify(!0);
          if (null === t.getNodeItem().mainTitleNode) return;
          this.currentOperation = n.MODIFY_NODE;
          t.setTitleAndInputTextStatus(!0);
          this.setImageSource(o, u.Edit);
          this.setImageCollapseSource(o, u.Edit);
          this.modifyNodeIndex = o;
          t.getNodeItem().inputText && (null != t.getNodeItem().imageCollapse ? t.getNodeItem()
                                                                                  .inputText
                                                                                  .rightMargin = {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_text_paragraph_margin_xs"],
            bundleName: "",
            moduleName: ""
          } : t.getNodeItem().inputText.rightMargin = {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_elements_margin_horizontal_m"],
            bundleName: "",
            moduleName: ""
          });
          this.notifyDataChange(this.loadedNodeIdAndIndexMap.get(e))
        }
        o = e;
        if (t === n.COMMIT_NODE) {
          let e = this.listNode[o];
          e.setTitleAndInputTextStatus(!1);
          e.setIsModify(!1);
          this.setImageSource(o, u.FinishEdit);
          this.setImageCollapseSource(o, u.FinishEdit);
          this.notificationNodeInfo(this.modifyNodeIndex, this.currentOperation);
          this.notifyDataChange(this.loadedNodeIdAndIndexMap.get(e.getCurrentNodeId()))
        }
      }
    }

    setPopUpInfo(e, t, o, i) {
      let s = this.listNode[i];
      s.setPopUpIsShow(o);
      let a = this.loadedNodeIdAndIndexMap.get(s.getCurrentNodeId());
      if (o) {
        if (e === l.HINTS) {
          if (null != s.getNodeItem().mainTitleNode) s.setPopUpText(s.getNodeItem().mainTitleNode.title); else {
            s.setPopUpText("");
            s.setPopUpIsShow(!1)
          }
          s.setPopUpEnableArrow(!1);
          s.setPopUpColor({
            id: -1,
            type: 10001,
            params: ["sys.color.ohos_id_color_background"],
            bundleName: "",
            moduleName: ""
          });
          s.setPopUpTextColor({
            id: -1,
            type: 10001,
            params: ["sys.color.ohos_id_color_text_secondary"],
            bundleName: "",
            moduleName: ""
          })
        } else if (e === l.WARNINGS && null != s.getNodeItem().inputText) {
          t === h.INVALID_ERROR ? s.setPopUpText("invalid error") : t === h.LENGTH_ERROR && s.setPopUpText("length error");
          s.setPopUpEnableArrow(!0);
          s.setPopUpColor({
            id: -1,
            type: 10001,
            params: ["sys.color.ohos_id_color_help_tip_bg"],
            bundleName: "",
            moduleName: ""
          });
          s.setPopUpTextColor({
            id: -1,
            type: 10001,
            params: ["sys.color.ohos_id_color_text_hint_contrary"],
            bundleName: "",
            moduleName: ""
          })
        }
        this.notifyDataChange(a)
      } else this.notifyDataChange(a)
    }

    setShowPopUpTimeout(e, t) {
      null != this.listNode[t].getNodeItem().mainTitleNode && (this.listNode[t].getNodeItem()
        .mainTitleNode
        .popUpTimeout = e);
      let o = this.loadedNodeIdAndIndexMap.get(this.listNode[t].getCurrentNodeId());
      this.notifyDataChange(o)
    }

    setMainTitleNameOnEdit(e, t) {
      this.modifyNodeIndex = e;
      if (null != this.listNode[e].getNodeItem().mainTitleNode) {
        this.listNode[e].getNodeItem().mainTitleNode.title = t;
        let o = this.loadedNodeIdAndIndexMap.get(this.listNode[e].getCurrentNodeId());
        this.notifyDataChange(o)
      }
    }

    get ListNode() {
      return this.listNode
    }

    totalCount() {
      let e = 0;
      let t = 0;
      this.loadedNodeIdAndIndexMap.clear();
      for (let o = 0;o < this.listNode.length; o++) if (this.listNode[o].getNodeIsShow()) {
        this.loadedNodeIdAndIndexMap.set(this.listNode[o].getCurrentNodeId(), t++);
        e++
      }
      return e
    }

    getData(e) {
      let t = 0;
      for (let o = 0;o < this.listNode.length; o++) if (this.listNode[o].getNodeIsShow()) {
        if (e == t) return this.listNode[o];
        t++
      }
      return null
    }

    addData(e, t) {
      this.listNode.splice(e, 0, t);
      this.notifyDataAdd(e)
    }

    pushData(e) {
      this.listNode.push(e);
      this.notifyDataAdd(this.listNode.length - 1)
    }

    setIsInnerDrag(e) {
      this.isInnerDrag = e
    }

    getIsInnerDrag() {
      return this.isInnerDrag
    }

    setIsDrag(e) {
      this.isDrag = e
    }

    getIsDrag() {
      return this.isDrag
    }

    setCurrentNodeInfo(e) {
      this.currentNodeInfo = e
    }

    getCurrentNodeInfo() {
      return this.currentNodeInfo
    }

    setDraggingParentNodeId(e) {
      this.draggingParentNodeId = e
    }

    getDraggingParentNodeId() {
      return this.draggingParentNodeId
    }

    getDraggingCurrentNodeId() {
      return this.draggingCurrentNodeId
    }

    setDraggingCurrentNodeId(e) {
      this.draggingCurrentNodeId = e
    }

    setListItemOpacity(e) {
      this.listItemOpacity = e
    }

    getListItemOpacity(e) {
      return e.getCurrentNodeId() == this.getDraggingCurrentNodeId() ? this.listItemOpacity : 1
    }

    getDragPopupPara() {
      return this.DRAG_POPUP
    }

    setLastPassIndex(e) {
      this.lastPassIndex = e
    }

    getLastPassIndex() {
      return this.lastPassIndex
    }

    getIsParentOfInsertNode(e) {
      let t = this.currentNodeInfo.getNodeInfoNode();
      let o = !1;
      this.listNodeUtils.traverseNodeDF((function (t) {
        if (t.currentNodeId == e) {
          o = !0;
          return !0
        }
        return !1
      }), t);
      return o
    }

    setPassIndex(e) {
      this.thisPassIndex = e
    }

    getPassIndex() {
      return this.thisPassIndex
    }

    clearTimeOutAboutDelayHighLightAndExpand(e) {
      if (this.lastPassId != this.INITIAL_INVALID_VALUE && this.loadedNodeIdAndIndexMap.has(this.lastPassId)) {
        let e = this.loadedNodeIdAndIndexMap.get(this.lastPassId);
        let t = this;
        this.ListNode.forEach((function (e) {
          e.getNodeCurrentNodeId() == t.lastPassId && e.setCanShowFlagLine(!1)
        }));
        this.notifyDataChange(e)
      }
      if (this.lastTimeoutHighLightId != this.INITIAL_INVALID_VALUE && this.clearTimeoutHighLightId != this.lastTimeoutHighLightId) {
        clearTimeout(this.lastTimeoutHighLightId);
        if (this.lastDelayHighLightIndex != this.INITIAL_INVALID_VALUE) {
          this.clearHighLight(this.lastDelayHighLightIndex);
          let e = this.loadedNodeIdAndIndexMap.get(this.listNode[this.lastDelayHighLightIndex].getCurrentNodeId());
          this.notifyDataChange(e)
        }
        this.clearTimeoutHighLightId = this.lastTimeoutHighLightId
      }
      this.lastTimeoutHighLightId = this.timeoutHighLightId;
      this.lastDelayHighLightIndex = e;
      if (this.lastTimeoutExpandId != this.INITIAL_INVALID_VALUE && this.clearTimeoutExpandId != this.lastTimeoutExpandId) {
        clearTimeout(this.lastTimeoutExpandId);
        this.clearTimeoutExpandId = this.lastTimeoutExpandId
      }
      this.lastTimeoutExpandId = this.timeoutExpandId;
      this.lastDelayExpandIndex = this.INITIAL_INVALID_VALUE
    }

    clearHighLight(e) {
      this.changeNodeColor(e, this.listNode[e].getNodeStatus().normal);
      this.changeNodeHighLightColor(e,!1);
      this.setImageSource(e, u.FinishDragInsert);
      this.setImageCollapseSource(e, u.FinishDragInsert);
      this.listNode[e].setIsHighLight(!1)
    }

    changeNodeHighLightColor(e, t) {
      this.listNode[e].getNodeItem()
        .mainTitleNode && this.listNode[e].getIsShowTitle() && this.listNode[e].getNodeItem()
        .mainTitleNode
        .setMainTitleHighLight(t)
    }

    setVisibility(e, t, o) {
      let i = this.thisPassIndex != t || this.flag != e;
      this.thisPassIndex = t;
      if ((i || o) && this.isInnerDrag) {
        this.flag = e;
        let o = this.getData(t).getCurrentNodeId();
        let i = this.expandAndCollapseInfo.get(o) == I.Expand && this.flag == g.DOWN_FLAG ? this.getData(t)
                                                                                              .getNodeLevel() + 1 : this.getData(t)
                                                                                                                      .getNodeLevel();
        if (this.lastPassId != this.INITIAL_INVALID_VALUE && this.loadedNodeIdAndIndexMap.has(this.lastPassId)) {
          let e = this.loadedNodeIdAndIndexMap.get(this.lastPassId);
          let t = this;
          this.ListNode.forEach((function (e) {
            e.getNodeCurrentNodeId() == t.lastPassId && e.setCanShowFlagLine(!1)
          }));
          this.notifyDataChange(e)
        }
        if (this.flag == g.DOWN_FLAG && t < this.totalCount() - 1) {
          this.getData(t).setCanShowFlagLine(!1);
          this.getData(t + 1).setCanShowFlagLine(!0);
          this.getData(t).setCanShowBottomFlagLine(!1);
          this.getData(t + 1).setFlagLineLeftMargin(i);
          this.notifyDataChange(t);
          this.notifyDataChange(t + 1);
          this.lastPassId = this.getData(t + 1).getNodeCurrentNodeId()
        } else if (this.flag == g.UP_FLAG && t < this.totalCount() - 1) {
          this.getData(t).setCanShowFlagLine(!0);
          this.getData(t + 1).setCanShowFlagLine(!1);
          this.getData(t).setCanShowBottomFlagLine(!1);
          this.getData(t).setFlagLineLeftMargin(i);
          this.notifyDataChange(t);
          this.notifyDataChange(t + 1);
          this.lastPassId = this.getData(t).getNodeCurrentNodeId()
        } else if (t >= this.totalCount() - 1) {
          if (this.flag == g.DOWN_FLAG) {
            this.getData(t).setCanShowFlagLine(!1);
            this.getData(t).setCanShowBottomFlagLine(!0)
          } else {
            this.getData(t).setCanShowFlagLine(!0);
            this.getData(t).setCanShowBottomFlagLine(!1)
          }
          this.getData(t).setFlagLineLeftMargin(i);
          this.notifyDataChange(t);
          this.lastPassId = this.getData(t).getNodeCurrentNodeId()
        }
      }
    }

    delayHighLightAndExpandNode(e, t, o) {
      let i = e != this.lastDelayExpandIndex;
      let s = this.getData(o).getIsOverBorder();
      this.lastDelayExpandIndex = s ? this.INITIAL_INVALID_VALUE : e;
      if (s || i) {
        let i = this;
        if (!s && (!this.isInnerDrag || this.expandAndCollapseInfo.get(t) == I.Collapse && this.isInnerDrag || !this.expandAndCollapseInfo.has(t) && this.listNode[e].getIsFolder())) {
          this.changeNodeColor(e, this.listNode[e].getNodeStatus().hover);
          this.notifyDataChange(o);
          let t = this.isInnerDrag ? 1e3 : 0;
          this.timeoutHighLightId = setTimeout((function () {
            i.delayHighLight(e)
          }), t)
        }
        if (s || this.lastTimeoutHighLightId != this.INITIAL_INVALID_VALUE && this.clearTimeoutHighLightId != this.lastTimeoutHighLightId) {
          clearTimeout(this.lastTimeoutHighLightId);
          if (this.lastDelayHighLightIndex != this.INITIAL_INVALID_VALUE) {
            this.clearHighLight(this.lastDelayHighLightIndex);
            this.notifyDataReload()
          }
          this.clearTimeoutHighLightId = this.lastTimeoutHighLightId
        }
        this.lastTimeoutHighLightId = this.timeoutHighLightId;
        this.lastDelayHighLightIndex = e;
        if (!s && this.expandAndCollapseInfo.get(t) == I.Collapse) {
          let t = this.getData(o).getNodeInfoNode().children[0].currentNodeId;
          let s = 2e3;
          this.timeoutExpandId = setTimeout((function () {
            i.clearHighLight(i.lastDelayHighLightIndex);
            i.alterFlagLineAndExpandNode(e, t)
          }), s)
        }
        if (s || this.lastTimeoutExpandId != this.INITIAL_INVALID_VALUE && this.clearTimeoutExpandId != this.lastTimeoutExpandId) {
          clearTimeout(this.lastTimeoutExpandId);
          this.clearTimeoutExpandId = this.lastTimeoutExpandId
        }
        this.lastTimeoutExpandId = this.timeoutExpandId
      }
    }

    delayHighLight(e) {
      let t = this;
      this.ListNode.forEach((function (e) {
        if (e.getNodeCurrentNodeId() == t.lastPassId) {
          e.setCanShowFlagLine(!1);
          e.setCanShowBottomFlagLine(!1)
        }
      }));
      this.changeNodeColor(e, this.listNode[e].getNodeStatus().highLight);
      this.listNode[e].setIsHighLight(!0);
      this.changeNodeHighLightColor(e,!0);
      this.setImageSource(e, u.DragInsert);
      this.setImageCollapseSource(e, u.DragInsert);
      this.notifyDataReload()
    }

    alterFlagLineAndExpandNode(e, t) {
      let o = this;
      this.ListNode.forEach((function (e) {
        if (e.getNodeCurrentNodeId() == o.lastPassId) {
          e.setCanShowFlagLine(!1);
          e.setCanShowBottomFlagLine(!1)
        }
      }));
      this.ListNode.forEach((function (e) {
        o.isInnerDrag && e.getNodeCurrentNodeId() == t && e.setCanShowFlagLine(!0)
      }));
      this.changeNodeStatus(e);
      this.handleExpandAndCollapse(e);
      this.lastPassId = t
    }

    hideLastLine() {
      if (this.lastPassId != this.INITIAL_INVALID_VALUE && this.loadedNodeIdAndIndexMap.has(this.lastPassId)) {
        let e = this;
        this.ListNode.forEach((function (t) {
          if (t.getNodeCurrentNodeId() == e.lastPassId) {
            t.setCanShowFlagLine(!1);
            t.setCanShowBottomFlagLine(!1)
          }
        }));
        let t = this.loadedNodeIdAndIndexMap.get(this.lastPassId);
        this.notifyDataChange(t)
      }
    }

    clearLastTimeoutHighLight() {
      if (this.lastTimeoutHighLightId != this.INITIAL_INVALID_VALUE && this.clearTimeoutHighLightId != this.lastTimeoutHighLightId) {
        clearTimeout(this.lastTimeoutHighLightId);
        this.lastDelayHighLightIndex != this.INITIAL_INVALID_VALUE && this.clearHighLight(this.lastDelayHighLightIndex)
      }
    }

    clearLastTimeoutExpand() {
      this.lastTimeoutExpandId != this.INITIAL_INVALID_VALUE && this.clearTimeoutExpandId != this.lastTimeoutExpandId && clearTimeout(this.lastTimeoutExpandId)
    }

    getSubtitle(e) {
      return this.nodeIdAndSubtitleMap.has(e) ? "number" == typeof this.nodeIdAndSubtitleMap.get(e) ? this.nodeIdAndSubtitleMap.get(e)
                                                                                                        .toString() : this.nodeIdAndSubtitleMap.get(e) : ""
    }

    hasSubtitle(e) {
      return this.nodeIdAndSubtitleMap.has(e)
    }

    initialParameterAboutDelayHighLightAndExpandIndex() {
      this.lastDelayHighLightIndex = this.INITIAL_INVALID_VALUE;
      this.lastDelayExpandIndex = this.INITIAL_INVALID_VALUE;
      this.lastPassIndex = this.INITIAL_INVALID_VALUE;
      this.draggingCurrentNodeId = this.INITIAL_INVALID_VALUE;
      this.flag = g.NONE
    }

    refreshSubtitle(e) {
      this.nodeIdAndSubtitleMap.set(this.selectedParentNodeId, this.selectedParentNodeSubtitle);
      this.nodeIdAndSubtitleMap.set(e, this.insertNodeSubtitle);
      this.notifyDataChange(this.loadedNodeIdAndIndexMap.get(this.selectedParentNodeId));
      this.notifyDataChange(this.loadedNodeIdAndIndexMap.get(e))
    }

    setNodeSubtitlePara(e, t, o) {
      this.selectedParentNodeId = e;
      this.selectedParentNodeSubtitle = t;
      this.insertNodeSubtitle = o
    }

    getInsertNodeSubtitle() {
      return this.insertNodeSubtitle
    }

    getExpandAndCollapseInfo(e) {
      return this.expandAndCollapseInfo.get(e)
    }

    getLastDelayHighLightId() {
      return this.lastDelayHighLightId
    }

    setLastDelayHighLightId() {
      this.ListNode.forEach(((e, t) => {
        t == this.lastDelayHighLightIndex && (this.lastDelayHighLightId = e.getCurrentNodeId())
      }))
    }

    setLastPassId(e) {
      this.lastPassId = e
    }

    setLastDelayHighLightIndex(e) {
      this.lastDelayHighLightIndex = e
    }

    alterDragNode(e, t, o, i, a, d) {
      let r = [];
      let n = e;
      let l = a;
      let h = d.getNodeInfoData();
      let c = null;
      let N = d.getNodeInfoNode();
      let u = !1;
      let p = this.INITIAL_INVALID_VALUE;
      let m = this.INITIAL_INVALID_VALUE;
      let f = this.flag == g.DOWN_FLAG;
      m = this.getChildIndex(i, a);
      p = this.getChildIndex(e, t);
      p = e != i ? f ? p + 1 : p : p > m ? f ? p : p - 1 : f ? p + 1 : p;
      for (let e = 0;e < this.listNode.length; e++) if (this.listNode[e].getCurrentNodeId() == t) {
        u = this.listNode[e].getIsHighLight();
        if (this.flag == g.DOWN_FLAG && this.expandAndCollapseInfo.get(t) == I.Expand) {
          n = t;
          p = 0
        } else if (this.flag == g.UP_FLAG && this.expandAndCollapseInfo.get(t) == I.Expand && 0 == this.listNode[e].getCanShowFlagLine()) {
          n = t;
          p = 0
        } else if (u) {
          n = t;
          p = 0
        }
        break
      }
      let S = { currentNodeId: l, parentNodeId: n, childIndex: p };
      this.appEventBus.emit(s.NODE_MOVE, [S]);
      r.push({ parentId: n, currentId: l, data: h });
      let C = null;
      this.listNodeUtils.dragTraverseNodeDF((function (e, t) {
        if (e) {
          C = e;
          n = C.parentNodeId;
          l = C.currentNodeId;
          for (let e = 0;e < t.length; e++) if (t[e].getNodeCurrentNodeId() == l) {
            c = t[e];
            break
          }
          h = c.getNodeInfoData();
          n != i && r.push({ parentId: n, currentId: l, data: h });
          return !1
        }
        return !1
      }), N, this.listNode);
      this.listNodeUtils.removeNode(a, i, this.listNodeUtils.traverseNodeBF);
      let D = t;
      let _ = f;
      if (this.expandAndCollapseInfo.get(t) == I.Expand) {
        _ = !1;
        this.listNode.forEach((e => {
          e.getCurrentNodeId() == t && 0 == e.getCanShowFlagLine() && (D = e.getNodeInfoNode()
                                                                             .children
                                                                             .length ? e.getNodeInfoNode()
                                                                                         .children[0]
                                                                                         .currentNodeId : this.INITIAL_INVALID_VALUE)
        }))
      } else !this.expandAndCollapseInfo.get(t) && u && this.expandAndCollapseInfo.set(t, I.Expand);
      this.listNodeUtils.addDragNode(r[0].parentId, r[0].currentId, D, _, r[0].data);
      for (let e = 1;e < r.length; e++) this.listNodeUtils.addNode(r[e].parentId, r[e].currentId, r[e].data);
      for (let e = 0;e < this.listNode.length; e++) if (this.listNode[e].getCurrentNodeId() == i && null == this.listNode[e].getNodeInfoNode()
        .getNodeItem()
        .imageCollapse) {
        this.listNode[e].handleImageCollapseAfterAddNode(!1);
        this.expandAndCollapseInfo.delete(i);
        break
      }
      let T = [...this.listNode];
      this.reloadListNode(this.listNodeUtils, T)
    }

    reloadListNode(e, t) {
      let o = 0;
      this.listNode = [];
      this.listNodeUtils = e;
      this.loadedNodeIdAndIndexMap.clear();
      this.listNodeUtils.traverseNodeDF((e => {
        if (e.currentNodeId >= 0) {
          var i = new S(e);
          this.listNode.push(i);
          this.expandAndCollapseInfo.get(e.currentNodeId) == I.Expand ? i.getNodeItem()
                                                                          .imageCollapse
                                                                          .changeImageCollapseSource(I.Expand) : this.expandAndCollapseInfo.get(e.currentNodeId) == I.Collapse && i.getNodeItem()
            .imageCollapse
            .changeImageCollapseSource(I.Collapse);
          for (let e = 0;e < t.length; e++) if (t[e].getCurrentNodeId() == i.getCurrentNodeId()) {
            i.setNodeIsShow(t[e].getNodeIsShow());
            i.setListItemHeight(t[e].getListItemHeight());
            i.getNodeItem().mainTitleNode && i.getIsShowTitle() && (i.getNodeItem()
              .mainTitleNode
              .title = t[e].getNodeItem().mainTitleNode.title);
            break
          }
          i.getNodeIsShow() && this.loadedNodeIdAndIndexMap.set(i.getCurrentNodeId(), o++)
        }
        return !1
      }))
    }

    getFlagLine() {
      return this.FLAG_LINE
    }

    getVisibility(e) {
      let t = this.loadedNodeIdAndIndexMap.get(e.getCurrentNodeId()) - 1;
      if (t > this.INITIAL_INVALID_VALUE) {
        let o = this.getData(t);
        return 1 != e.getCanShowFlagLine() || e.getIsHighLight() || o.getIsHighLight() ? Visibility.Hidden : Visibility.Visible
      }
      return 1 != e.getCanShowFlagLine() || e.getIsHighLight() ? Visibility.Hidden : Visibility.Visible
    }

    getSubTitlePara() {
      return this.subTitle
    }

    getIsFolder(e) {
      return!!this.loadedNodeIdAndIndexMap.has(e) && this.getData(this.loadedNodeIdAndIndexMap.get(e)).getIsFolder()
    }

    getSubTitleFontColor(e) {
      return e ? this.subTitle.highLightFontColor : this.subTitle.normalFontColor
    }

    getChildIndex(e, t) {
      let o = this.INITIAL_INVALID_VALUE;
      this.listNodeUtils.traverseNodeBF((function (i) {
        if (i.getCurrentNodeId() == e) {
          i.children.forEach(((e, i) => {
            e.getCurrentNodeId() == t && (o = i)
          }));
          return !0
        }
        return !1
      }));
      return o
    }

    setCurrentFocusNodeId(e) {
      this.currentFocusNodeId = e
    }

    getCurrentFocusNodeId() {
      return this.currentFocusNodeId
    }

    setLastFocusNodeId(e) {
      this.lastFocusNodeId = e
    }

    getLastFocusNodeId() {
      return this.lastFocusNodeId
    }

    getAddFocusNodeId() {
      return this.addFocusNodeId
    }

    setFlag(e) {
      this.flag = e
    }
  }

  e.ListNodeDataSource = D;

  function _(e) {
    let t = 0;
    this.listNodeDataSource.ListNode.forEach((function (o, i) {
      o.getNodeCurrentNodeId() == e && (t = i)
    }));
    return t
  }

  class T extends ViewPU {
    constructor(e, t, o, i = -1) {
      super(e, o, i);
      this.listNodeDataSource = void 0;
      this.treeController = void 0;
      this.__dropSelectedIndex = new ObservedPropertySimplePU(0, this, "dropSelectedIndex");
      this.listTreeViewMenu = null;
      this.__listTreeViewWidth = new SynchedPropertySimpleOneWayPU(t.listTreeViewWidth, this, "listTreeViewWidth");
      this.__listTreeViewHeight = new SynchedPropertySimpleOneWayPU(t.listTreeViewHeight, this, "listTreeViewHeight");
      this.MAX_CN_LENGTH = 254;
      this.MAX_EN_LENGTH = 255;
      this.INITIAL_INVALID_VALUE = -1;
      this.MAX_TOUCH_DOWN_COUNT = 0;
      this.isMultiPress = !1;
      this.touchDownCount = this.INITIAL_INVALID_VALUE;
      this.appEventBus = a.getInstance().getTreeListener();
      this.itemPadding = {
        left: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_card_margin_middle"],
          bundleName: "",
          moduleName: ""
        },
        right: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_card_margin_middle"],
          bundleName: "",
          moduleName: ""
        },
        top: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_margin_vertical"],
          bundleName: "",
          moduleName: ""
        },
        bottom: {
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_margin_vertical"],
          bundleName: "",
          moduleName: ""
        }
      };
      this.textInputPadding = { left: "0vp", right: "0vp", top: "0vp", bottom: "0vp" };
      this.setInitiallyProvidedValue(t)
    }

    setInitiallyProvidedValue(e) {
      void 0 !== e.listNodeDataSource && (this.listNodeDataSource = e.listNodeDataSource);
      void 0 !== e.treeController && (this.treeController = e.treeController);
      void 0 !== e.dropSelectedIndex && (this.dropSelectedIndex = e.dropSelectedIndex);
      void 0 !== e.listTreeViewMenu && (this.listTreeViewMenu = e.listTreeViewMenu);
      void 0 !== e.MAX_CN_LENGTH && (this.MAX_CN_LENGTH = e.MAX_CN_LENGTH);
      void 0 !== e.MAX_EN_LENGTH && (this.MAX_EN_LENGTH = e.MAX_EN_LENGTH);
      void 0 !== e.INITIAL_INVALID_VALUE && (this.INITIAL_INVALID_VALUE = e.INITIAL_INVALID_VALUE);
      void 0 !== e.MAX_TOUCH_DOWN_COUNT && (this.MAX_TOUCH_DOWN_COUNT = e.MAX_TOUCH_DOWN_COUNT);
      void 0 !== e.isMultiPress && (this.isMultiPress = e.isMultiPress);
      void 0 !== e.touchDownCount && (this.touchDownCount = e.touchDownCount);
      void 0 !== e.appEventBus && (this.appEventBus = e.appEventBus);
      void 0 !== e.itemPadding && (this.itemPadding = e.itemPadding);
      void 0 !== e.textInputPadding && (this.textInputPadding = e.textInputPadding)
    }

    updateStateVars(e) {
      this.__listTreeViewWidth.reset(e.listTreeViewWidth);
      this.__listTreeViewHeight.reset(e.listTreeViewHeight)
    }

    purgeVariableDependenciesOnElmtId(e) {
      this.__dropSelectedIndex.purgeDependencyOnElmtId(e);
      this.__listTreeViewWidth.purgeDependencyOnElmtId(e);
      this.__listTreeViewHeight.purgeDependencyOnElmtId(e)
    }

    aboutToBeDeleted() {
      this.__dropSelectedIndex.aboutToBeDeleted();
      this.__listTreeViewWidth.aboutToBeDeleted();
      this.__listTreeViewHeight.aboutToBeDeleted();
      SubscriberManager.Get().delete(this.id__());
      this.aboutToBeDeletedInternal()
    }

    get dropSelectedIndex() {
      return this.__dropSelectedIndex.get()
    }

    set dropSelectedIndex(e) {
      this.__dropSelectedIndex.set(e)
    }

    get listTreeViewWidth() {
      return this.__listTreeViewWidth.get()
    }

    set listTreeViewWidth(e) {
      this.__listTreeViewWidth.set(e)
    }

    get listTreeViewHeight() {
      return this.__listTreeViewHeight.get()
    }

    set listTreeViewHeight(e) {
      this.__listTreeViewHeight.set(e)
    }

    aboutToAppear() {
      this.listTreeViewWidth = void 0 === this.listTreeViewWidth ? 200 : this.listTreeViewWidth;
      this.listNodeDataSource = this.treeController.getListNodeDataSource()
    }

    checkInvalidPattern(e) {
      return /[\\\/:*?"<>|]/.test(e)
    }

    checkIsAllCN(e) {
      return /^[\u4e00-\u9fa5]+$/.test(e)
    }

    popupForShowTitle(e, t, o, i = null) {
      this.observeComponentCreation(((e, o) => {
        ViewStackProcessor.StartGetAccessRecordingFor(e);
        Row.create();
        Row.backgroundColor(t);
        Row.border({
          radius: {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_elements_margin_horizontal_l"],
            bundleName: "",
            moduleName: ""
          }
        });
        Row.padding({
          left: {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_elements_margin_horizontal_l"],
            bundleName: "",
            moduleName: ""
          },
          right: {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_elements_margin_horizontal_l"],
            bundleName: "",
            moduleName: ""
          },
          top: {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_card_margin_middle"],
            bundleName: "",
            moduleName: ""
          },
          bottom: {
            id: -1,
            type: 10002,
            params: ["sys.float.ohos_id_card_margin_middle"],
            bundleName: "",
            moduleName: ""
          }
        });
        o || Row.pop();
        ViewStackProcessor.StopGetAccessRecording()
      }));
      this.observeComponentCreation(((t, i) => {
        ViewStackProcessor.StartGetAccessRecordingFor(t);
        Text.create(e);
        Text.fontSize({
          id: -1,
          type: 10002,
          params: ["sys.float.ohos_id_text_size_body2"],
          bundleName: "",
          moduleName: ""
        });
        Text.fontWeight("regular");
        Text.fontColor(o);
        i || Text.pop();
        ViewStackProcessor.StopGetAccessRecording()
      }));
      Text.pop();
      Row.pop()
    }

    builder(e = null) {
      this.listTreeViewMenu.bind(this)()
    }

    draggingPopup(e, o = null) {
      this.observeComponentCreation(((e, t) => {
        ViewStackProcessor.StartGetAccessRecordingFor(e);
        Row.create();
        Row.constraintSize({
          minWidth: this.listNodeDataSource.getDragPopupPara().floorConstraintSize.minWidth,
          maxWidth: this.listNodeDataSource.getDragPopupPara().floorConstraintSize.maxWidth
        });
        Row.height(this.listNodeDataSource.getDragPopupPara().height);
        Row.backgroundColor(this.listNodeDataSource.getDragPopupPara().backgroundColor);
        Row.padding({
          left: this.listNodeDataSource.getDragPopupPara().padding.left,
          right: this.listNodeDataSource.getDragPopupPara().padding.right
        });
        Row.shadow({
          radius: this.listNodeDataSource.getDragPopupPara().shadow.radius,
          color: this.listNodeDataSource.getDragPopupPara().shadow.color,
          offsetY: this.listNodeDataSource.getDragPopupPara().shadow.offsetY
        });
        Row.borderRadius(this.listNodeDataSource.getDragPopupPara().borderRadius);
        t || Row.pop();
        ViewStackProcessor.StopGetAccessRecording()
      }));
      this.observeComponentCreation(((o, i) => {
        ViewStackProcessor.StartGetAccessRecordingFor(o);
        If.create();
        e.getNodeItem().imageNode ? this.ifElseBranchUpdateFunction(0, (() => {
          this.observeComponentCreation(((o, i) => {
            ViewStackProcessor.StartGetAccessRecordingFor(o);
            Row.create();
            Row.backgroundColor(t);
            Row.margin({ right: e.getNodeItem().imageNode.itemRightMargin });
            Row.height(e.getNodeItem().imageNode.itemHeight);
            Row.width(e.getNodeItem().imageNode.itemWidth);
            i || Row.pop();
            ViewStackProcessor.StopGetAccessRecording()
          }));
          this.observeComponentCreation(((t, o) => {
            ViewStackProcessor.StartGetAccessRecordingFor(t);
            Image.create(e.getNodeItem().imageNode.normalSource);
            Image.objectFit(ImageFit.Contain);
            Image.height(e.getNodeItem().imageNode.itemHeight);
            Image.width(e.getNodeItem().imageNode.itemWidth);
            Image.opacity(this.listNodeDataSource.getDragPopupPara().imageOpacity);
            o || Image.pop();
            ViewStackProcessor.StopGetAccessRecording()
          }));
          Row.pop()
        })) : If.branchId(1);
        i || If.pop();
        ViewStackProcessor.StopGetAccessRecording()
      }));
      If.pop();
      this.observeComponentCreation(((t, o) => {
        ViewStackProcessor.StartGetAccessRecordingFor(t);
        Row.create();
        Row.constraintSize({
          minWidth: e.getNodeItem().imageNode ? this.listNodeDataSource.getDragPopupPara()
                                                  .textConstraintSize
                                                  .minWidth1 : this.listNodeDataSource.getDragPopupPara()
                                                                 .textConstraintSize
                                                                 .minWidth2,
          maxWidth: e.getNodeItem().imageNode ? this.listNodeDataSource.getDragPopupPara()
                                                  .textConstraintSize
                                                  .maxWidth1 : this.listNodeDataSource.getDragPopupPara()
                                                                 .textConstraintSize
                                                                 .maxWidth2
        });
        o || Row.pop();
        ViewStackProcessor.StopGetAccessRecording()
      }));
      this.observeComponentCreation(((t, o) => {
        ViewStackProcessor.StartGetAccessRecordingFor(t);
        If.create();
        e.getNodeItem().mainTitleNode && e.getIsShowTitle() ? this.ifElseBranchUpdateFunction(0, (() => {
          this.observeComponentCreation(((t, o) => {
            ViewStackProcessor.StartGetAccessRecordingFor(t);
            Text.create(e.getNodeItem().mainTitleNode.title);
            Text.maxLines(1);
            Text.fontSize(e.getNodeItem().mainTitleNode.size);
            Text.fontColor(this.listNodeDataSource.getDragPopupPara().fontColor);
            Text.fontWeight(this.listNodeDataSource.getDragPopupPara().fontWeight);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            o || Text.pop();
            ViewStackProcessor.StopGetAccessRecording()
          }));
          Text.pop()
        })) : If.branchId(1);
        o || If.pop();
        ViewStackProcessor.StopGetAccessRecording()
      }));
      If.pop();
      Row.pop();
      Row.pop()
    }

    initialRender() {
      this.observeComponentCreation(((e, t) => {
        ViewStackProcessor.StartGetAccessRecordingFor(e);
        List.create({});
        List.width(this.listTreeViewWidth);
        List.height(this.listTreeViewHeight);
        List.onDragMove((e => {
          if (this.isMultiPress) {
            console.error("drag error, a item has been dragged");
            return
          }
          let t = Math.floor(e.getY() / 24) % 2 ? g.DOWN_FLAG : g.UP_FLAG;
          let o = Math.floor(e.getY() / 48);
          let i = !1;
          if (o >= this.listNodeDataSource.totalCount()) {
            t = g.DOWN_FLAG;
            o = this.listNodeDataSource.totalCount() - 1;
            this.listNodeDataSource.getData(o).setIsOverBorder(!0);
            i = !0
          } else this.listNodeDataSource.getData(o).setIsOverBorder(!1);
          let s = this.listNodeDataSource.getData(o).getCurrentNodeId();
          if (o != this.listNodeDataSource.getLastPassIndex() && this.listNodeDataSource.getIsInnerDrag()) {
            if (this.listNodeDataSource.getIsParentOfInsertNode(s)) {
              this.listNodeDataSource.setPassIndex(o);
              let e = this;
              this.listNodeDataSource.clearTimeOutAboutDelayHighLightAndExpand(_.call(e, s));
              this.listNodeDataSource.setFlag(g.NONE);
              return
            }
          }
          this.listNodeDataSource.setLastPassIndex(o);
          this.listNodeDataSource.setVisibility(t, o, i);
          if (s != this.listNodeDataSource.getDraggingCurrentNodeId()) {
            let e = this;
            this.listNodeDataSource.delayHighLightAndExpandNode(_.call(e, s), s, o)
          }
        }));
        List.onDragEnter(((e, t) => {
          if (this.listNodeDataSource.getIsInnerDrag()) {
            this.listNodeDataSource.setIsDrag(!0);
            let e = .4;
            this.listNodeDataSource.setListItemOpacity(e)
          }
        }));
        List.onDragLeave(((e, t) => {
          this.listNodeDataSource.hideLastLine();
          this.listNodeDataSource.clearLastTimeoutHighLight();
          this.listNodeDataSource.clearLastTimeoutExpand();
          this.listNodeDataSource.setListItemOpacity(1);
          this.listNodeDataSource.setIsDrag(!1);
          this.listNodeDataSource.notifyDataReload()
        }));
        List.onDrop(((e, t) => {
          this.listNodeDataSource.clearLastTimeoutExpand();
          this.listNodeDataSource.setListItemOpacity(1);
          let o = this.listNodeDataSource.getPassIndex();
          let i = this.dropSelectedIndex;
          if (i - 1 > this.listNodeDataSource.totalCount() || null == i) {
            console.error("drag error, currentNodeIndex is not found");
            this.listNodeDataSource.setIsDrag(!1);
            return
          }
          if (o == this.listNodeDataSource.totalCount()) {
            console.log("need to insert into the position of the last line, now insertNodeIndex = insertNodeIndex - 1");
            o -= 1
          }
          let s = this.listNodeDataSource.getData(o);
          let a = s.getNodeCurrentNodeId();
          if (!this.listNodeDataSource.getIsDrag() || !this.listNodeDataSource.getIsInnerDrag()) {
            this.listNodeDataSource.clearLastTimeoutHighLight();
            this.listNodeDataSource.setIsInnerDrag(!1);
            this.listNodeDataSource.hideLastLine();
            this.listNodeDataSource.initialParameterAboutDelayHighLightAndExpandIndex();
            this.listNodeDataSource.refreshSubtitle(a);
            this.listNodeDataSource.notifyDataReload();
            return
          }
          let d = this.listNodeDataSource.getCurrentNodeInfo();
          let n = s.getNodeParentNodeId();
          let l = this.listNodeDataSource.getDraggingCurrentNodeId();
          let h = this.listNodeDataSource.getDraggingParentNodeId();
          if (this.listNodeDataSource.getIsParentOfInsertNode(a)) {
            this.listNodeDataSource.clearLastTimeoutHighLight();
            this.listNodeDataSource.setIsInnerDrag(!1);
            this.listNodeDataSource.hideLastLine();
            this.listNodeDataSource.notifyDataChange(o);
            this.listNodeDataSource.initialParameterAboutDelayHighLightAndExpandIndex();
            this.listNodeDataSource.setIsDrag(!1);
            let e = this;
            let t = _.call(e, l);
            this.listNodeDataSource.setClickIndex(t);
            this.listNodeDataSource.handleEvent(r.DRAG, t);
            return
          }
          if (this.listNodeDataSource.getExpandAndCollapseInfo(l) == I.Expand) {
            let e = this;
            this.listNodeDataSource.expandAndCollapseNode(_.call(e, l))
          }
          if (this.listNodeDataSource.getExpandAndCollapseInfo(a) == I.Collapse) {
            let e = this;
            let t = _.call(e, a);
            this.listNodeDataSource.ListNode[t].getIsHighLight() && this.listNodeDataSource.expandAndCollapseNode(t)
          }
          this.listNodeDataSource.setLastDelayHighLightId();
          if (l != a) {
            this.listNodeDataSource.alterDragNode(n, a, s, h, l, d);
            this.listNodeDataSource.hideLastLine()
          } else {
            this.listNodeDataSource.hideLastLine();
            this.listNodeDataSource.setLastPassId(l);
            this.listNodeDataSource.hideLastLine()
          }
          let g = _.call(this, this.listNodeDataSource.getLastDelayHighLightId());
          this.listNodeDataSource.setLastDelayHighLightIndex(g);
          this.listNodeDataSource.clearLastTimeoutHighLight();
          this.listNodeDataSource.initialParameterAboutDelayHighLightAndExpandIndex();
          this.listNodeDataSource.setIsDrag(!1);
          let c = _.call(this, l);
          this.listNodeDataSource.setClickIndex(c);
          this.listNodeDataSource.handleEvent(r.DRAG, c);
          this.listNodeDataSource.setIsInnerDrag(!1);
          this.listNodeDataSource.notifyDataReload()
        }));
        t || List.pop();
        ViewStackProcessor.StopGetAccessRecording()
      }));
      {
        const e = e => {
          const i = e;
          {
            const e = void 0 !== globalThis.__lazyForEachItemGenFunction && !0;
            const a = (t, o) => {
              ViewStackProcessor.StartGetAccessRecordingFor(t);
              ListItem.create(g, e);
              ListItem.width("100%");
              ListItem.height(i.getListItemHeight());
              ListItem.padding({ left: this.itemPadding.left, right: this.itemPadding.right });
              ListItem.align(Alignment.Start);
              ListItem.onDragStart(((e, t) => {
                if (this.listNodeDataSource.getIsDrag() || this.listNodeDataSource.getIsInnerDrag() || this.isMultiPress) {
                  console.error("drag error, a item has been dragged");
                  return
                }
                this.dropSelectedIndex = JSON.parse(t).selectedIndex;
                let o = JSON.parse(t).selectedIndex;
                let s = this.listNodeDataSource.getData(o);
                let a = i.getNodeCurrentNodeId();
                if (o >= this.listNodeDataSource.totalCount() || null == o) {
                  console.error("drag error, currentNodeIndex is not found in onDragStart");
                  return
                }
                this.listNodeDataSource.setIsInnerDrag(!0);
                this.listNodeDataSource.setIsDrag(!0);
                this.listNodeDataSource.setCurrentNodeInfo(s);
                this.listNodeDataSource.setDraggingCurrentNodeId(s.getNodeCurrentNodeId());
                this.listNodeDataSource.setDraggingParentNodeId(s.getNodeParentNodeId());
                this.listNodeDataSource.setListItemOpacity(.4);
                this.listNodeDataSource.notifyDataChange(o);
                if (a == s.getNodeCurrentNodeId()) return { builder: () => {
                  this.draggingPopup.call(this, s)
                } };
                console.error("drag is too fast,it attribute a fault to OH");
                this.listNodeDataSource.setIsDrag(!1)
              }));
              o || ListItem.pop();
              ViewStackProcessor.StopGetAccessRecording()
            };
            const d = () => {
              this.observeComponentCreation(a);
              this.observeComponentCreation(((e, a) => {
                ViewStackProcessor.StartGetAccessRecordingFor(e);
                If.create();
                i.getNodeIsShow() ? this.ifElseBranchUpdateFunction(0, (() => {
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Column.create();
                    Column.focusable(!0);
                    Column.onMouse((e => {
                      let t = this;
                      let o = _.call(t, i.getNodeCurrentNodeId());
                      if (e.button == MouseButton.Right) {
                        t.listNodeDataSource.handleEvent(r.MOUSE_BUTTON_RIGHT, _.call(t, i.getNodeCurrentNodeId()));
                        this.listTreeViewMenu = i.getMenu();
                        t.listNodeDataSource.setClickIndex(o);
                        t.listNodeDataSource.setPopUpInfo(l.HINTS, h.NONE,!1, o);
                        clearTimeout(i.getNodeItem().mainTitleNode.popUpTimeout)
                      }
                      e.stopPropagation()
                    }));
                    Column.padding({ top: this.itemPadding.top, bottom: this.itemPadding.bottom });
                    Column.bindPopup(i.getPopUpInfo().popUpIsShow, {
                      builder: { builder: () => {
                        this.popupForShowTitle.call(this, i.getPopUpInfo().popUpText, i.getPopUpInfo()
                          .popUpColor, i.getPopUpInfo().popUpTextColor)
                      } },
                      placement: Placement.BottomLeft,
                      placementOnTop: !1,
                      popupColor: i.getPopUpInfo().popUpColor,
                      autoCancel: !0,
                      enableArrow: i.getPopUpInfo().popUpEnableArrow
                    });
                    t || Column.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Divider.create();
                    Divider.height(this.listNodeDataSource.getFlagLine().flagLineHeight);
                    Divider.color(this.listNodeDataSource.getFlagLine().flagLineColor);
                    Divider.visibility(this.listNodeDataSource.getVisibility(i));
                    Divider.lineCap(LineCapStyle.Round);
                    Divider.margin({ left: i.getFlagLineLeftMargin() });
                    Divider.markAnchor({
                      x: this.listNodeDataSource.getFlagLine().xOffset,
                      y: this.listNodeDataSource.getFlagLine().yTopOffset
                    });
                    t || Divider.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Row.create({});
                    Row.opacity(this.listNodeDataSource.getListItemOpacity(i));
                    Row.markAnchor({
                      x: this.listNodeDataSource.getFlagLine().xOffset,
                      y: this.listNodeDataSource.getFlagLine().yBasePlateOffset
                    });
                    t || Row.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Row.create({});
                    Row.width("100%");
                    Row.onTouch((e => {
                      let t = this;
                      let o = _.call(t, i.getNodeCurrentNodeId());
                      let a = i.getNodeCurrentNodeId();
                      t.listNodeDataSource.setClickIndex(o);
                      if (e.type === TouchType.Down) {
                        this.touchDownCount++;
                        this.isMultiPress = this.touchDownCount > this.MAX_TOUCH_DOWN_COUNT;
                        this.listNodeDataSource.getIsTouchDown() || t.listNodeDataSource.handleEvent(r.TOUCH_DOWN, o)
                      }
                      if (e.type === TouchType.Up) {
                        this.touchDownCount--;
                        this.touchDownCount < this.MAX_TOUCH_DOWN_COUNT && (this.isMultiPress = !1);
                        let e = { currentNodeId: a };
                        this.appEventBus.emit(s.NODE_CLICK, [e]);
                        t.listNodeDataSource.handleEvent(r.TOUCH_UP, o)
                      }
                    }));
                    Row.onHover((e => {
                      let t = this;
                      let o = _.call(t, i.getNodeCurrentNodeId());
                      e ? t.listNodeDataSource.handleEvent(r.HOVER, o) : t.listNodeDataSource.getIsTouchDown() || t.listNodeDataSource.handleEvent(r.HOVER_OVER, o)
                    }));
                    Gesture.create(GesturePriority.Low);
                    TapGesture.create({ count: 2 });
                    TapGesture.onAction((e => {
                      this.listNodeDataSource.expandAndCollapseNode(_.call(this, i.getNodeCurrentNodeId()))
                    }));
                    TapGesture.pop();
                    Gesture.pop();
                    Row.height(i.getNodeHeight());
                    Row.padding({ left: i.getNodeLeftPadding() });
                    Row.backgroundColor(i.getNodeItem().mainTitleNode && i.getNodeItem()
                      .inputText && i.getIsShowInputText() ? i.getNodeItem().inputText.editColor : i.getNodeColor());
                    Row.border({
                      width: i.getNodeBorder().borderWidth,
                      color: i.getNodeBorder().borderColor,
                      radius: i.getNodeBorder().borderRadius
                    });
                    Row.bindContextMenu({ builder: this.builder.bind(this) }, ResponseType.RightClick);
                    t || Row.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, o) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().imageNode ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, o) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.backgroundColor(t);
                        Row.margin({ right: i.getNodeItem().imageNode.itemRightMargin });
                        Row.height(i.getNodeItem().imageNode.itemHeight);
                        Row.width(i.getNodeItem().imageNode.itemWidth);
                        o || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Image.create(i.getNodeItem().imageNode.source);
                        Image.objectFit(ImageFit.Contain);
                        Image.height(i.getNodeItem().imageNode.itemHeight);
                        Image.width(i.getNodeItem().imageNode.itemWidth);
                        Image.opacity(i.getIsSelected() || i.getIsHighLight() ? i.getNodeItem()
                                                                                  .imageNode
                                                                                  .noOpacity : i.getNodeItem()
                                                                                                 .imageNode
                                                                                                 .opacity);
                        Image.focusable(null == i.getNodeItem().mainTitleNode);
                        Image.onFocus((() => {
                          this.listNodeDataSource.handleEvent(r.FOCUS, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        Image.onBlur((() => {
                          this.listNodeDataSource.handleEvent(r.BLUR, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        t || Image.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Row.pop()
                    })) : If.branchId(1);
                    o || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Row.create();
                    Row.layoutWeight(1);
                    t || Row.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().mainTitleNode && i.getIsShowTitle() ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Text.create(i.getNodeItem().mainTitleNode.title);
                        Text.maxLines(1);
                        Text.fontSize(i.getNodeItem().mainTitleNode.size);
                        Text.fontColor(i.getNodeItem().mainTitleNode.color);
                        Text.margin({ right: i.getNodeItem().mainTitleNode.itemRightMargin });
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.fontWeight(i.getNodeItem().mainTitleNode.weight);
                        Text.focusable(!0);
                        Text.onFocus((() => {
                          this.listNodeDataSource.handleEvent(r.FOCUS, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        Text.onBlur((() => {
                          this.listNodeDataSource.handleEvent(r.BLUR, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        t || Text.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Text.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().mainTitleNode && i.getNodeItem()
                      .inputText && i.getIsShowInputText() ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.backgroundColor(i.getNodeItem().inputText.backgroundColor);
                        Row.borderRadius(i.getNodeItem().inputText.borderRadius);
                        Row.margin({ right: i.getNodeItem().inputText.itemRightMargin });
                        t || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        TextInput.create({ text: i.getNodeItem().mainTitleNode.title });
                        TextInput.height(i.getNodeItem().inputText.itemHeight);
                        TextInput.fontSize(i.getNodeItem().inputText.size);
                        TextInput.fontColor(i.getNodeItem().inputText.color);
                        TextInput.borderRadius(i.getNodeItem().inputText.borderRadius);
                        TextInput.backgroundColor(i.getNodeItem().inputText.backgroundColor);
                        TextInput.enterKeyType(EnterKeyType.Done);
                        TextInput.padding({
                          left: this.textInputPadding.left,
                          right: this.textInputPadding.right,
                          top: this.textInputPadding.top,
                          bottom: this.textInputPadding.bottom
                        });
                        TextInput.onChange((e => {
                          let t = this;
                          var o = _.call(t, i.getNodeCurrentNodeId());
                          let s = "";
                          let a = !1;
                          let d = !1;
                          if (t.checkInvalidPattern(e)) {
                            for (let o = 0;o < e.length; o++) t.checkInvalidPattern(e[o]) || (s += e[o]);
                            a = !0;
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.INVALID_ERROR,!0, o)
                          } else {
                            s = e;
                            a = !1;
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.INVALID_ERROR,!1, o)
                          }
                          if (t.checkIsAllCN(s) && s.length > this.MAX_CN_LENGTH || !t.checkIsAllCN(s) && s.length > this.MAX_EN_LENGTH) {
                            s = t.checkIsAllCN(s) ? s.substr(0, this.MAX_CN_LENGTH) : s.substr(0, this.MAX_EN_LENGTH);
                            d = !0;
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.LENGTH_ERROR,!0, o)
                          } else d = !1;
                          if (!d && !a) {
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.LENGTH_ERROR,!1, o);
                            t.listNodeDataSource.setMainTitleNameOnEdit(o, s)
                          }
                        }));
                        TextInput.onSubmit((e => {
                          let t = this;
                          var o = _.call(t, i.getNodeCurrentNodeId());
                          t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.NONE,!1, o);
                          t.listNodeDataSource.setItemVisibilityOnEdit(o, n.COMMIT_NODE)
                        }));
                        t || TextInput.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Row.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Blank.create();
                    t || Blank.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  Blank.pop();
                  Row.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    this.listNodeDataSource.hasSubtitle(i.getCurrentNodeId()) ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.margin({
                          left: this.listNodeDataSource.getSubTitlePara().margin.left,
                          right: i.getNodeItem().imageCollapse ? 0 : this.listNodeDataSource.getSubTitlePara()
                                                                       .margin
                                                                       .right
                        });
                        t || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Text.create(this.listNodeDataSource.getSubtitle(i.getCurrentNodeId()));
                        Text.fontSize(this.listNodeDataSource.getSubTitlePara().fontSize);
                        Text.fontColor(this.listNodeDataSource.getSubTitleFontColor(i.getIsHighLight() || i.getIsModify()));
                        Text.fontWeight(this.listNodeDataSource.getSubTitlePara().fontWeight);
                        t || Text.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Text.pop();
                      Row.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, s) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().imageCollapse ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, o) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.backgroundColor(t);
                        Row.height(i.getNodeItem().imageCollapse.itemHeight);
                        Row.width(i.getNodeItem().imageCollapse.itemWidth);
                        o || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, s) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Image.create(i.getNodeItem().imageCollapse.collapseSource);
                        Image.fillColor(i.getNodeItem().imageCollapse.isCollapse ? t : o);
                        Image.align(Alignment.End);
                        Image.objectFit(ImageFit.Contain);
                        Image.height(i.getNodeItem().imageCollapse.itemHeight);
                        Image.width(i.getNodeItem().imageCollapse.itemWidth);
                        Image.opacity(i.getIsHighLight() ? i.getNodeItem().imageCollapse.noOpacity : i.getNodeItem()
                                                                                                       .imageCollapse
                                                                                                       .opacity);
                        Image.onTouch((e => {
                          if (e.type === TouchType.Down) {
                            let e = this;
                            e.listNodeDataSource.expandAndCollapseNode(_.call(e, i.getNodeCurrentNodeId()));
                            this.listNodeDataSource.setCurrentFocusNodeId(i.getCurrentNodeId())
                          }
                          e.stopPropagation()
                        }));
                        s || Image.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Row.pop()
                    })) : If.branchId(1);
                    s || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  Row.pop();
                  Row.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getCanShowBottomFlagLine() ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        If.create();
                        this.listNodeDataSource.getPassIndex() != this.listNodeDataSource.totalCount() - 1 || i.getIsHighLight() ? If.branchId(1) : this.ifElseBranchUpdateFunction(0, (() => {
                          this.observeComponentCreation(((e, t) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(e);
                            Divider.create();
                            Divider.height(this.listNodeDataSource.getFlagLine().flagLineHeight);
                            Divider.color(this.listNodeDataSource.getFlagLine().flagLineColor);
                            Divider.visibility(Visibility.Visible);
                            Divider.lineCap(LineCapStyle.Round);
                            Divider.margin({ left: i.getFlagLineLeftMargin() });
                            Divider.markAnchor({
                              x: this.listNodeDataSource.getFlagLine().xOffset,
                              y: this.listNodeDataSource.getFlagLine().yBottomOffset
                            });
                            t || Divider.pop();
                            ViewStackProcessor.StopGetAccessRecording()
                          }))
                        }));
                        t || If.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      If.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  Column.pop()
                })) : If.branchId(1);
                a || If.pop();
                ViewStackProcessor.StopGetAccessRecording()
              }));
              If.pop();
              ListItem.pop()
            };
            const g = (e, d) => {
              a(e, d);
              this.updateFuncByElmtId.set(e, a);
              this.observeComponentCreation(((e, a) => {
                ViewStackProcessor.StartGetAccessRecordingFor(e);
                If.create();
                i.getNodeIsShow() ? this.ifElseBranchUpdateFunction(0, (() => {
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Column.create();
                    Column.focusable(!0);
                    Column.onMouse((e => {
                      let t = this;
                      let o = _.call(t, i.getNodeCurrentNodeId());
                      if (e.button == MouseButton.Right) {
                        t.listNodeDataSource.handleEvent(r.MOUSE_BUTTON_RIGHT, _.call(t, i.getNodeCurrentNodeId()));
                        this.listTreeViewMenu = i.getMenu();
                        t.listNodeDataSource.setClickIndex(o);
                        t.listNodeDataSource.setPopUpInfo(l.HINTS, h.NONE,!1, o);
                        clearTimeout(i.getNodeItem().mainTitleNode.popUpTimeout)
                      }
                      e.stopPropagation()
                    }));
                    Column.padding({ top: this.itemPadding.top, bottom: this.itemPadding.bottom });
                    Column.bindPopup(i.getPopUpInfo().popUpIsShow, {
                      builder: { builder: () => {
                        this.popupForShowTitle.call(this, i.getPopUpInfo().popUpText, i.getPopUpInfo()
                          .popUpColor, i.getPopUpInfo().popUpTextColor)
                      } },
                      placement: Placement.BottomLeft,
                      placementOnTop: !1,
                      popupColor: i.getPopUpInfo().popUpColor,
                      autoCancel: !0,
                      enableArrow: i.getPopUpInfo().popUpEnableArrow
                    });
                    t || Column.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Divider.create();
                    Divider.height(this.listNodeDataSource.getFlagLine().flagLineHeight);
                    Divider.color(this.listNodeDataSource.getFlagLine().flagLineColor);
                    Divider.visibility(this.listNodeDataSource.getVisibility(i));
                    Divider.lineCap(LineCapStyle.Round);
                    Divider.margin({ left: i.getFlagLineLeftMargin() });
                    Divider.markAnchor({
                      x: this.listNodeDataSource.getFlagLine().xOffset,
                      y: this.listNodeDataSource.getFlagLine().yTopOffset
                    });
                    t || Divider.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Row.create({});
                    Row.opacity(this.listNodeDataSource.getListItemOpacity(i));
                    Row.markAnchor({
                      x: this.listNodeDataSource.getFlagLine().xOffset,
                      y: this.listNodeDataSource.getFlagLine().yBasePlateOffset
                    });
                    t || Row.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Row.create({});
                    Row.width("100%");
                    Row.onTouch((e => {
                      let t = this;
                      let o = _.call(t, i.getNodeCurrentNodeId());
                      let a = i.getNodeCurrentNodeId();
                      t.listNodeDataSource.setClickIndex(o);
                      if (e.type === TouchType.Down) {
                        this.touchDownCount++;
                        this.isMultiPress = this.touchDownCount > this.MAX_TOUCH_DOWN_COUNT;
                        this.listNodeDataSource.getIsTouchDown() || t.listNodeDataSource.handleEvent(r.TOUCH_DOWN, o)
                      }
                      if (e.type === TouchType.Up) {
                        this.touchDownCount--;
                        this.touchDownCount < this.MAX_TOUCH_DOWN_COUNT && (this.isMultiPress = !1);
                        let e = { currentNodeId: a };
                        this.appEventBus.emit(s.NODE_CLICK, [e]);
                        t.listNodeDataSource.handleEvent(r.TOUCH_UP, o)
                      }
                    }));
                    Row.onHover((e => {
                      let t = this;
                      let o = _.call(t, i.getNodeCurrentNodeId());
                      e ? t.listNodeDataSource.handleEvent(r.HOVER, o) : t.listNodeDataSource.getIsTouchDown() || t.listNodeDataSource.handleEvent(r.HOVER_OVER, o)
                    }));
                    Gesture.create(GesturePriority.Low);
                    TapGesture.create({ count: 2 });
                    TapGesture.onAction((e => {
                      this.listNodeDataSource.expandAndCollapseNode(_.call(this, i.getNodeCurrentNodeId()))
                    }));
                    TapGesture.pop();
                    Gesture.pop();
                    Row.height(i.getNodeHeight());
                    Row.padding({ left: i.getNodeLeftPadding() });
                    Row.backgroundColor(i.getNodeItem().mainTitleNode && i.getNodeItem()
                      .inputText && i.getIsShowInputText() ? i.getNodeItem().inputText.editColor : i.getNodeColor());
                    Row.border({
                      width: i.getNodeBorder().borderWidth,
                      color: i.getNodeBorder().borderColor,
                      radius: i.getNodeBorder().borderRadius
                    });
                    Row.bindContextMenu({ builder: this.builder.bind(this) }, ResponseType.RightClick);
                    t || Row.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, o) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().imageNode ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, o) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.backgroundColor(t);
                        Row.margin({ right: i.getNodeItem().imageNode.itemRightMargin });
                        Row.height(i.getNodeItem().imageNode.itemHeight);
                        Row.width(i.getNodeItem().imageNode.itemWidth);
                        o || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Image.create(i.getNodeItem().imageNode.source);
                        Image.objectFit(ImageFit.Contain);
                        Image.height(i.getNodeItem().imageNode.itemHeight);
                        Image.width(i.getNodeItem().imageNode.itemWidth);
                        Image.opacity(i.getIsSelected() || i.getIsHighLight() ? i.getNodeItem()
                                                                                  .imageNode
                                                                                  .noOpacity : i.getNodeItem()
                                                                                                 .imageNode
                                                                                                 .opacity);
                        Image.focusable(null == i.getNodeItem().mainTitleNode);
                        Image.onFocus((() => {
                          this.listNodeDataSource.handleEvent(r.FOCUS, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        Image.onBlur((() => {
                          this.listNodeDataSource.handleEvent(r.BLUR, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        t || Image.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Row.pop()
                    })) : If.branchId(1);
                    o || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Row.create();
                    Row.layoutWeight(1);
                    t || Row.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().mainTitleNode && i.getIsShowTitle() ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Text.create(i.getNodeItem().mainTitleNode.title);
                        Text.maxLines(1);
                        Text.fontSize(i.getNodeItem().mainTitleNode.size);
                        Text.fontColor(i.getNodeItem().mainTitleNode.color);
                        Text.margin({ right: i.getNodeItem().mainTitleNode.itemRightMargin });
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.fontWeight(i.getNodeItem().mainTitleNode.weight);
                        Text.focusable(!0);
                        Text.onFocus((() => {
                          this.listNodeDataSource.handleEvent(r.FOCUS, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        Text.onBlur((() => {
                          this.listNodeDataSource.handleEvent(r.BLUR, _.call(this, i.getNodeCurrentNodeId()))
                        }));
                        t || Text.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Text.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().mainTitleNode && i.getNodeItem()
                      .inputText && i.getIsShowInputText() ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.backgroundColor(i.getNodeItem().inputText.backgroundColor);
                        Row.borderRadius(i.getNodeItem().inputText.borderRadius);
                        Row.margin({ right: i.getNodeItem().inputText.itemRightMargin });
                        t || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        TextInput.create({ text: i.getNodeItem().mainTitleNode.title });
                        TextInput.height(i.getNodeItem().inputText.itemHeight);
                        TextInput.fontSize(i.getNodeItem().inputText.size);
                        TextInput.fontColor(i.getNodeItem().inputText.color);
                        TextInput.borderRadius(i.getNodeItem().inputText.borderRadius);
                        TextInput.backgroundColor(i.getNodeItem().inputText.backgroundColor);
                        TextInput.enterKeyType(EnterKeyType.Done);
                        TextInput.padding({
                          left: this.textInputPadding.left,
                          right: this.textInputPadding.right,
                          top: this.textInputPadding.top,
                          bottom: this.textInputPadding.bottom
                        });
                        TextInput.onChange((e => {
                          let t = this;
                          var o = _.call(t, i.getNodeCurrentNodeId());
                          let s = "";
                          let a = !1;
                          let d = !1;
                          if (t.checkInvalidPattern(e)) {
                            for (let o = 0;o < e.length; o++) t.checkInvalidPattern(e[o]) || (s += e[o]);
                            a = !0;
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.INVALID_ERROR,!0, o)
                          } else {
                            s = e;
                            a = !1;
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.INVALID_ERROR,!1, o)
                          }
                          if (t.checkIsAllCN(s) && s.length > this.MAX_CN_LENGTH || !t.checkIsAllCN(s) && s.length > this.MAX_EN_LENGTH) {
                            s = t.checkIsAllCN(s) ? s.substr(0, this.MAX_CN_LENGTH) : s.substr(0, this.MAX_EN_LENGTH);
                            d = !0;
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.LENGTH_ERROR,!0, o)
                          } else d = !1;
                          if (!d && !a) {
                            t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.LENGTH_ERROR,!1, o);
                            t.listNodeDataSource.setMainTitleNameOnEdit(o, s)
                          }
                        }));
                        TextInput.onSubmit((e => {
                          let t = this;
                          var o = _.call(t, i.getNodeCurrentNodeId());
                          t.listNodeDataSource.setPopUpInfo(l.WARNINGS, h.NONE,!1, o);
                          t.listNodeDataSource.setItemVisibilityOnEdit(o, n.COMMIT_NODE)
                        }));
                        t || TextInput.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Row.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    Blank.create();
                    t || Blank.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  Blank.pop();
                  Row.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    this.listNodeDataSource.hasSubtitle(i.getCurrentNodeId()) ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.margin({
                          left: this.listNodeDataSource.getSubTitlePara().margin.left,
                          right: i.getNodeItem().imageCollapse ? 0 : this.listNodeDataSource.getSubTitlePara()
                                                                       .margin
                                                                       .right
                        });
                        t || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Text.create(this.listNodeDataSource.getSubtitle(i.getCurrentNodeId()));
                        Text.fontSize(this.listNodeDataSource.getSubTitlePara().fontSize);
                        Text.fontColor(this.listNodeDataSource.getSubTitleFontColor(i.getIsHighLight() || i.getIsModify()));
                        Text.fontWeight(this.listNodeDataSource.getSubTitlePara().fontWeight);
                        t || Text.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Text.pop();
                      Row.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  this.observeComponentCreation(((e, s) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getNodeItem().imageCollapse ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, o) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Row.create();
                        Row.backgroundColor(t);
                        Row.height(i.getNodeItem().imageCollapse.itemHeight);
                        Row.width(i.getNodeItem().imageCollapse.itemWidth);
                        o || Row.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      this.observeComponentCreation(((e, s) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        Image.create(i.getNodeItem().imageCollapse.collapseSource);
                        Image.fillColor(i.getNodeItem().imageCollapse.isCollapse ? t : o);
                        Image.align(Alignment.End);
                        Image.objectFit(ImageFit.Contain);
                        Image.height(i.getNodeItem().imageCollapse.itemHeight);
                        Image.width(i.getNodeItem().imageCollapse.itemWidth);
                        Image.opacity(i.getIsHighLight() ? i.getNodeItem().imageCollapse.noOpacity : i.getNodeItem()
                                                                                                       .imageCollapse
                                                                                                       .opacity);
                        Image.onTouch((e => {
                          if (e.type === TouchType.Down) {
                            let e = this;
                            e.listNodeDataSource.expandAndCollapseNode(_.call(e, i.getNodeCurrentNodeId()));
                            this.listNodeDataSource.setCurrentFocusNodeId(i.getCurrentNodeId())
                          }
                          e.stopPropagation()
                        }));
                        s || Image.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      Row.pop()
                    })) : If.branchId(1);
                    s || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  Row.pop();
                  Row.pop();
                  this.observeComponentCreation(((e, t) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(e);
                    If.create();
                    i.getCanShowBottomFlagLine() ? this.ifElseBranchUpdateFunction(0, (() => {
                      this.observeComponentCreation(((e, t) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(e);
                        If.create();
                        this.listNodeDataSource.getPassIndex() != this.listNodeDataSource.totalCount() - 1 || i.getIsHighLight() ? If.branchId(1) : this.ifElseBranchUpdateFunction(0, (() => {
                          this.observeComponentCreation(((e, t) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(e);
                            Divider.create();
                            Divider.height(this.listNodeDataSource.getFlagLine().flagLineHeight);
                            Divider.color(this.listNodeDataSource.getFlagLine().flagLineColor);
                            Divider.visibility(Visibility.Visible);
                            Divider.lineCap(LineCapStyle.Round);
                            Divider.margin({ left: i.getFlagLineLeftMargin() });
                            Divider.markAnchor({
                              x: this.listNodeDataSource.getFlagLine().xOffset,
                              y: this.listNodeDataSource.getFlagLine().yBottomOffset
                            });
                            t || Divider.pop();
                            ViewStackProcessor.StopGetAccessRecording()
                          }))
                        }));
                        t || If.pop();
                        ViewStackProcessor.StopGetAccessRecording()
                      }));
                      If.pop()
                    })) : If.branchId(1);
                    t || If.pop();
                    ViewStackProcessor.StopGetAccessRecording()
                  }));
                  If.pop();
                  Column.pop()
                })) : If.branchId(1);
                a || If.pop();
                ViewStackProcessor.StopGetAccessRecording()
              }));
              If.pop();
              ListItem.pop()
            };
            e ? (() => {
              this.observeComponentCreation(a);
              ListItem.pop()
            })() : d()
          }
        };
        const i = e => JSON.stringify(e);
        LazyForEach.create("1", this, this.listNodeDataSource, e, i);
        LazyForEach.pop()
      }
      List.pop()
    }

    rerender() {
      this.updateDirtyElements()
    }
  }

  __decorate([], T.prototype, "popupForShowTitle", null);
  __decorate([], T.prototype, "builder", null);
  __decorate([], T.prototype, "draggingPopup", null);
  e.TreeView = T;
  e.TreeController = class {
    constructor() {
      this.ROOT_NODE_ID = -1;
      this.nodeIdList = [];
      this.listNodeUtils = new C;
      this.listNodeDataSource = new D
    }

    getListNodeDataSource() {
      return this.listNodeDataSource
    }

    getClickNodeChildrenInfo() {
      let e = this.listNodeDataSource.getClickNodeId();
      return this.listNodeUtils.getClickNodeChildrenInfo(e)
    }

    getChildrenId() {
      let e = this.listNodeDataSource.getClickNodeId();
      return this.listNodeUtils.getClickChildId(e)
    }

    removeNode() {
      let e = this.listNodeDataSource.getClickNodeId();
      let t = this.listNodeUtils.findParentNodeId(e);
      let o = this.listNodeUtils.removeNode(e, t, this.listNodeUtils.traverseNodeBF);
      this.listNodeDataSource.refreshData(this.listNodeUtils, n.REMOVE_NODE, t, o);
      this.nodeIdList.splice(this.nodeIdList.indexOf(e), 1)
    }

    modifyNode() {
      let e = this.listNodeDataSource.getClickNodeId();
      this.listNodeDataSource.setItemVisibilityOnEdit(e, n.MODIFY_NODE)
    }

    add() {
      let e = this.listNodeDataSource.getClickNodeId();
      if (e == this.listNodeDataSource.ROOT_NODE_ID || !this.listNodeDataSource.getIsFolder(e)) return;
      let t = {
        isFolder: !0,
        icon: null,
        selectedIcon: null,
        editIcon: null,
        menu: null,
        secondaryTitle: ""
      };
      t = this.listNodeUtils.getNewNodeInfo(e);
      this.nodeIdList.push(this.nodeIdList[this.nodeIdList.length-1] + 1);
      let o = this.nodeIdList[this.nodeIdList.length-1];
      this.listNodeUtils.addNewNodeId = o;
      this.listNodeUtils.addNode(e, o, {
        isFolder: t.isFolder,
        icon: t.icon,
        selectedIcon: t.selectedIcon,
        editIcon: t.editIcon,
        primaryTitle: "新建文件夹",
        menu: t.menu,
        secondaryTitle: t.secondaryTitle
      });
      this.listNodeDataSource.refreshData(this.listNodeUtils, n.ADD_NODE, e, [o])
    }

    addNodeParam(e) {
      if (null != e.primaryTitle && !this.listNodeUtils.checkMainTitleIsValid(e.primaryTitle)) throw new Error('ListTreeNode[addNode]: The directory name cannot contain the following characters /: *? "< > | or exceeds the maximum length.');
      if (null == e.primaryTitle && null == e.icon) throw new Error("ListTreeNode[addNode]: The icon and directory name cannot be empty at the same time.");
      if (e.currentNodeId === this.ROOT_NODE_ID || null === e.currentNodeId) throw new Error("ListTreeNode[addNode]: currentNodeId can not be -1 or null.");
      this.nodeIdList.push(e.currentNodeId);
      this.listNodeUtils.addNode(e.parentNodeId, e.currentNodeId, e);
      return this
    }

    addNode(e) {
      if (null != e) {
        if (null != e.primaryTitle && !this.listNodeUtils.checkMainTitleIsValid(e.primaryTitle)) throw new Error('ListTreeNode[addNode]: The directory name cannot contain the following characters /: *? "< > | or exceeds the maximum length.');
        if (null == e.primaryTitle && null == e.icon) throw new Error("ListTreeNode[addNode]: The icon and directory name cannot be empty at the same time.");
        if (e.currentNodeId === this.ROOT_NODE_ID || null === e.currentNodeId) throw new Error("ListTreeNode[addNode]: currentNodeId can not be -1 or null.");
        this.nodeIdList.push(e.currentNodeId);
        this.listNodeUtils.addNode(e.parentNodeId, e.currentNodeId, e);
        return this
      }
      this.add()
    }

    buildDone() {
      this.listNodeDataSource.init(this.listNodeUtils);
      this.nodeIdList.sort(((e, t) => e - t))
    }

    refreshNode(e, t = "", o = "") {
      this.listNodeDataSource.setNodeSubtitlePara(e, t, o)
    }
  }
}(TreeView || (TreeView = {}));

export default TreeView