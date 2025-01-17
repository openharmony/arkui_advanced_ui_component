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

if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
const display = requireNapi('display');
const DEFAULT_BAR_WIDTH = 96;
const DEFAULT_BAR_HEIGHT = 48;
const TEXT_WIDTH_HEIGHT_SIZE = 24;
const TEXT_FONT_WEIGHT = 500;
const TEXT_LIGHT_HEIGHT = 14;
const MARGIN_HORIZONTAL_VP = 8;
const MARGIN_VERTICAL_VP = 4;
export class AtomicServiceTabs extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.tabContents = undefined;
        this.__tabBarOptionsArray = new SynchedPropertyObjectOneWayPU(params.tabBarOptionsArray, this, "tabBarOptionsArray");
        this.__tabBarPosition = new SynchedPropertySimpleOneWayPU(params.tabBarPosition, this, "tabBarPosition");
        this.__barBackgroundColor = new SynchedPropertyObjectOneWayPU(params.barBackgroundColor, this, "barBackgroundColor");
        this.__index = new SynchedPropertyObjectOneWayPU(params.index, this, "index");
        this.__barOverlap = new SynchedPropertySimpleOneWayPU(params.barOverlap, this, "barOverlap");
        this.__layoutMode = new SynchedPropertySimpleOneWayPU(params.layoutMode, this, "layoutMode");
        this.controller = new TabsController();
        this.onChange = undefined;
        this.onTabBarClick = undefined;
        this.onContentWillChange = undefined;
        this.__selectedIndex = new ObservedPropertySimplePU(0, this, "selectedIndex");
        this.__isHorizontal = new ObservedPropertySimplePU(false, this, "isHorizontal");
        this.__barModeStatus = new ObservedPropertySimplePU(BarMode.Fixed, this, "barModeStatus");
        this.__directionStatus = new ObservedPropertySimplePU(FlexDirection.Column, this, "directionStatus");
        this.__textMarginTop = new ObservedPropertySimplePU(undefined, this, "textMarginTop");
        this.__textMarginLeft = new ObservedPropertySimplePU(undefined, this, "textMarginLeft");
        this.__tabMargin = new ObservedPropertySimplePU(undefined, this, "tabMargin");
        this.__tabPadding = new ObservedPropertySimplePU(MARGIN_VERTICAL_VP, this, "tabPadding");
        this.isIconAndText = false;
        this.barHeight = undefined;
        this.isListener = false;
        this.isFold = false;
        this.listener = this.getUIContext().getMediaQuery().matchMediaSync('(orientation: landscape)');
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params) {
        if (params.tabContents !== undefined) {
            this.tabContents = params.tabContents;
        }
        if (params.tabBarPosition === undefined) {
            this.__tabBarPosition.set(TabBarPosition.BOTTOM);
        }
        if (params.barBackgroundColor === undefined) {
            this.__barBackgroundColor.set(Color.Transparent);
        }
        if (params.index === undefined) {
            this.__index.set(0);
        }
        if (params.barOverlap === undefined) {
            this.__barOverlap.set(true);
        }
        if (params.layoutMode === undefined) {
            this.__layoutMode.set(LayoutMode.VERTICAL);
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.onChange !== undefined) {
            this.onChange = params.onChange;
        }
        if (params.onTabBarClick !== undefined) {
            this.onTabBarClick = params.onTabBarClick;
        }
        if (params.onContentWillChange !== undefined) {
            this.onContentWillChange = params.onContentWillChange;
        }
        if (params.selectedIndex !== undefined) {
            this.selectedIndex = params.selectedIndex;
        }
        if (params.isHorizontal !== undefined) {
            this.isHorizontal = params.isHorizontal;
        }
        if (params.barModeStatus !== undefined) {
            this.barModeStatus = params.barModeStatus;
        }
        if (params.directionStatus !== undefined) {
            this.directionStatus = params.directionStatus;
        }
        if (params.textMarginTop !== undefined) {
            this.textMarginTop = params.textMarginTop;
        }
        if (params.textMarginLeft !== undefined) {
            this.textMarginLeft = params.textMarginLeft;
        }
        if (params.tabMargin !== undefined) {
            this.tabMargin = params.tabMargin;
        }
        if (params.tabPadding !== undefined) {
            this.tabPadding = params.tabPadding;
        }
        if (params.isIconAndText !== undefined) {
            this.isIconAndText = params.isIconAndText;
        }
        if (params.barHeight !== undefined) {
            this.barHeight = params.barHeight;
        }
        if (params.isListener !== undefined) {
            this.isListener = params.isListener;
        }
        if (params.isFold !== undefined) {
            this.isFold = params.isFold;
        }
        if (params.listener !== undefined) {
            this.listener = params.listener;
        }
    }
    updateStateVars(params) {
        this.__tabBarOptionsArray.reset(params.tabBarOptionsArray);
        this.__tabBarPosition.reset(params.tabBarPosition);
        this.__barBackgroundColor.reset(params.barBackgroundColor);
        this.__index.reset(params.index);
        this.__barOverlap.reset(params.barOverlap);
        this.__layoutMode.reset(params.layoutMode);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tabBarOptionsArray.purgeDependencyOnElmtId(rmElmtId);
        this.__tabBarPosition.purgeDependencyOnElmtId(rmElmtId);
        this.__barBackgroundColor.purgeDependencyOnElmtId(rmElmtId);
        this.__index.purgeDependencyOnElmtId(rmElmtId);
        this.__barOverlap.purgeDependencyOnElmtId(rmElmtId);
        this.__layoutMode.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isHorizontal.purgeDependencyOnElmtId(rmElmtId);
        this.__barModeStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__directionStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__textMarginTop.purgeDependencyOnElmtId(rmElmtId);
        this.__textMarginLeft.purgeDependencyOnElmtId(rmElmtId);
        this.__tabMargin.purgeDependencyOnElmtId(rmElmtId);
        this.__tabPadding.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tabBarOptionsArray.aboutToBeDeleted();
        this.__tabBarPosition.aboutToBeDeleted();
        this.__barBackgroundColor.aboutToBeDeleted();
        this.__index.aboutToBeDeleted();
        this.__barOverlap.aboutToBeDeleted();
        this.__layoutMode.aboutToBeDeleted();
        this.__selectedIndex.aboutToBeDeleted();
        this.__isHorizontal.aboutToBeDeleted();
        this.__barModeStatus.aboutToBeDeleted();
        this.__directionStatus.aboutToBeDeleted();
        this.__textMarginTop.aboutToBeDeleted();
        this.__textMarginLeft.aboutToBeDeleted();
        this.__tabMargin.aboutToBeDeleted();
        this.__tabPadding.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get tabBarOptionsArray() {
        return this.__tabBarOptionsArray.get();
    }
    set tabBarOptionsArray(newValue) {
        this.__tabBarOptionsArray.set(newValue);
    }
    get tabBarPosition() {
        return this.__tabBarPosition.get();
    }
    set tabBarPosition(newValue) {
        this.__tabBarPosition.set(newValue);
    }
    get barBackgroundColor() {
        return this.__barBackgroundColor.get();
    }
    set barBackgroundColor(newValue) {
        this.__barBackgroundColor.set(newValue);
    }
    get index() {
        return this.__index.get();
    }
    set index(newValue) {
        this.__index.set(newValue);
    }
    get barOverlap() {
        return this.__barOverlap.get();
    }
    set barOverlap(newValue) {
        this.__barOverlap.set(newValue);
    }
    get layoutMode() {
        return this.__layoutMode.get();
    }
    set layoutMode(newValue) {
        this.__layoutMode.set(newValue);
    }
    get selectedIndex() {
        return this.__selectedIndex.get();
    }
    set selectedIndex(newValue) {
        this.__selectedIndex.set(newValue);
    }
    get isHorizontal() {
        return this.__isHorizontal.get();
    }
    set isHorizontal(newValue) {
        this.__isHorizontal.set(newValue);
    }
    get barModeStatus() {
        return this.__barModeStatus.get();
    }
    set barModeStatus(newValue) {
        this.__barModeStatus.set(newValue);
    }
    get directionStatus() {
        return this.__directionStatus.get();
    }
    set directionStatus(newValue) {
        this.__directionStatus.set(newValue);
    }
    get textMarginTop() {
        return this.__textMarginTop.get();
    }
    set textMarginTop(newValue) {
        this.__textMarginTop.set(newValue);
    }
    get textMarginLeft() {
        return this.__textMarginLeft.get();
    }
    set textMarginLeft(newValue) {
        this.__textMarginLeft.set(newValue);
    }
    get tabMargin() {
        return this.__tabMargin.get();
    }
    set tabMargin(newValue) {
        this.__tabMargin.set(newValue);
    }
    get tabPadding() {
        return this.__tabPadding.get();
    }
    set tabPadding(newValue) {
        this.__tabPadding.set(newValue);
    }
    aboutToAppear() {
        this.initBarModeAndHeight();
        if (this.isIconAndText && this.layoutMode === LayoutMode.AUTO && this.tabBarPosition === TabBarPosition.BOTTOM) {
            this.isListener = true;
            this.startListener();
        }
    }
    aboutToDisappear() {
        if (this.isListener) {
            this.listener.off('change');
            if (this.isFold) {
                display.off('foldDisplayModeChange');
            }
        }
    }
    initBarModeAndHeight() {
        this.isHorizontal = (this.layoutMode === LayoutMode.HORIZONTAL) ? true : false;
        if (this.tabBarOptionsArray[0].icon && this.tabBarOptionsArray[0].text) {
            this.isIconAndText = true;
        }
        if (this.tabBarPosition === TabBarPosition.LEFT) {
            this.barModeStatus = BarMode.Scrollable;
            this.barHeight = (50 / this.tabBarOptionsArray.length + '%');
        }
        this.buildTab();
    }
    startListener() {
        if (canIUse('SystemCapability.Window.SessionManager')) {
            if (display.isFoldable()) {
                this.isFold = true;
                display.on('foldDisplayModeChange', (data) => {
                    this.initLayoutStatus();
                });
            }
        }
        this.listener.on('change', (mediaQueryResult) => {
            this.initLayoutStatus();
        });
    }
    initLayoutStatus() {
        const screenWidth = px2vp(display.getDefaultDisplaySync().width);
        const widthFlag = screenWidth / this.tabBarOptionsArray.length > 104 ? true : false;
        this.isHorizontal = widthFlag ? true : false;
        this.buildTab();
    }
    buildTab() {
        this.directionStatus = this.isHorizontal ? FlexDirection.Row : FlexDirection.Column;
        if (this.isIconAndText) {
            this.textMarginTop = this.isHorizontal ? undefined : MARGIN_VERTICAL_VP;
            this.textMarginLeft = this.isHorizontal ? MARGIN_HORIZONTAL_VP : undefined;
            this.tabPadding = this.isHorizontal ? undefined : MARGIN_VERTICAL_VP;
            this.tabMargin = this.isHorizontal ? MARGIN_HORIZONTAL_VP : undefined;
        }
    }
    getFontSize() {
        return this.isHorizontal ? { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_button3'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' } :
            (this.isIconAndText ? { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_caption'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' } : { 'id': -1, 'type': 10002, params: ['sys.float.ohos_id_text_size_button3'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' });
    }
    TabBuilder(item, index, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: this.directionStatus,
                alignItems: ItemAlign.Center,
                justifyContent: FlexAlign.Center
            });
            Flex.padding({ left: this.tabPadding, right: this.tabPadding });
            Flex.margin({ left: this.tabMargin, right: this.tabMargin });
            Flex.height(this.barHeight);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.icon) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(item.icon);
                        Image.width(TEXT_WIDTH_HEIGHT_SIZE);
                        Image.height(TEXT_WIDTH_HEIGHT_SIZE);
                        Image.objectFit(ImageFit.Contain);
                        Image.fillColor(this.selectedIndex === index ? item.selectedColor : item.unselectedColor);
                        Image.backgroundColor(Color.Transparent);
                        Image.flexShrink(0);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.text) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.text);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.maxLines(1);
                        Text.fontColor(this.selectedIndex === index ? item.selectedColor : item.unselectedColor);
                        Text.maxFontSize(this.getFontSize());
                        Text.minFontSize(9);
                        Text.fontWeight(TEXT_FONT_WEIGHT);
                        Text.lineHeight(TEXT_LIGHT_HEIGHT);
                        Text.textAlign(TextAlign.Center);
                        Text.focusOnTouch(true);
                        Text.backgroundColor(Color.Transparent);
                        Text.margin({
                            top: this.textMarginTop,
                            left: this.textMarginLeft
                        });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Flex.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({
                barPosition: this.tabBarPosition === TabBarPosition.LEFT ? BarPosition.Start : BarPosition.End,
                index: this.index,
                controller: this.controller
            });
            Tabs.safeAreaPadding({
                bottom: 0
            });
            Tabs.animationDuration(0);
            Tabs.barBackgroundColor(ObservedObject.GetRawObject(this.barBackgroundColor));
            Tabs.divider(null);
            Tabs.barMode(this.barModeStatus);
            Tabs.vertical(this.tabBarPosition === TabBarPosition.LEFT ? true : false);
            Tabs.scrollable(false);
            Tabs.barOverlap(this.barOverlap);
            Tabs.barBackgroundBlurStyle(BlurStyle.COMPONENT_THICK);
            Tabs.onChange((index) => {
                if (this.onChange) {
                    this.onChange(index);
                }
                this.selectedIndex = index;
            });
            Tabs.onTabBarClick(this.onTabBarClick);
            Tabs.onContentWillChange(this.onContentWillChange);
            Tabs.barWidth((this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%');
            Tabs.barHeight((this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%');
            Tabs.width((!this.tabContents && this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%');
            Tabs.height((!this.tabContents && this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%');
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (item) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TabContent.create(() => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (this.tabContents && this.tabContents[index]) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.tabContents[index]?.bind(this)?.();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                });
                                TabContent.tabBar({ builder: () => {
                                        this.TabBuilder.call(this, item, index);
                                    } });
                                TabContent.width((!this.tabContents && this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%');
                                TabContent.height((!this.tabContents && this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%');
                            }, TabContent);
                            TabContent.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabBarOptionsArray, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Tabs.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class TabBarOptions {
    constructor(icon, text, unselectedColor, selectedColor) {
        this.icon = icon;
        this.text = text;
        this.unselectedColor = unselectedColor;
        this.selectedColor = selectedColor;
    }
}
export var TabBarPosition;
(function (TabBarPosition) {
    TabBarPosition[TabBarPosition["LEFT"] = 0] = "LEFT";
    TabBarPosition[TabBarPosition["BOTTOM"] = 1] = "BOTTOM";
})(TabBarPosition || (TabBarPosition = {}));

export default { AtomicServiceTabs, TabBarOptions, TabBarPosition};