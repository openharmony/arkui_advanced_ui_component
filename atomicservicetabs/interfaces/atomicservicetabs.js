/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to  in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import display from "@ohos.display";
const DEFAULT_BAR_WIDTH = 96;
const DEFAULT_BAR_HEIGHT = 48;
const TEXT_WIDTH_HEIGHT_SIZE = 24;
const TEXT_FONT_WEIGHT = 500;
const TEXT_LIGHT_HEIGHT = 14;
const MARGIN_HORIZONTAL_VP = 8;
const MARGIN_VERTICAL_VP = 4;
export class AtomicServiceTabs extends ViewPU {
    constructor(m1, n1, o1, p1 = -1, q1 = undefined, r1) {
        super(m1, o1, p1, r1);
        if (typeof q1 === "function") {
            this.paramsGenerator_ = q1;
        }
        this.tabContents = undefined;
        this.__tabBarOptionsArray = new SynchedPropertyObjectOneWayPU(n1.tabBarOptionsArray, this, "tabBarOptionsArray");
        this.__tabBarPosition = new SynchedPropertySimpleOneWayPU(n1.tabBarPosition, this, "tabBarPosition");
        this.__barBackgroundColor = new SynchedPropertyObjectOneWayPU(n1.barBackgroundColor, this, "barBackgroundColor");
        this.__index = new SynchedPropertyObjectOneWayPU(n1.index, this, "index");
        this.__barOverlap = new SynchedPropertySimpleOneWayPU(n1.barOverlap, this, "barOverlap");
        this.__layoutMode = new SynchedPropertySimpleOneWayPU(n1.layoutMode, this, "layoutMode");
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
        this.listener = this.getUIContext().getMediaQuery().matchMediaSync('(orientation: landscape)');
        this.setInitiallyProvidedValue(n1);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(l1) {
        if (l1.tabContents !== undefined) {
            this.tabContents = l1.tabContents;
        }
        if (l1.tabBarPosition === undefined) {
            this.__tabBarPosition.set(TabBarPosition.BOTTOM);
        }
        if (l1.barBackgroundColor === undefined) {
            this.__barBackgroundColor.set(Color.Transparent);
        }
        if (l1.index === undefined) {
            this.__index.set(0);
        }
        if (l1.barOverlap === undefined) {
            this.__barOverlap.set(true);
        }
        if (l1.layoutMode === undefined) {
            this.__layoutMode.set(LayoutMode.VERTICAL);
        }
        if (l1.controller !== undefined) {
            this.controller = l1.controller;
        }
        if (l1.onChange !== undefined) {
            this.onChange = l1.onChange;
        }
        if (l1.onTabBarClick !== undefined) {
            this.onTabBarClick = l1.onTabBarClick;
        }
        if (l1.onContentWillChange !== undefined) {
            this.onContentWillChange = l1.onContentWillChange;
        }
        if (l1.selectedIndex !== undefined) {
            this.selectedIndex = l1.selectedIndex;
        }
        if (l1.isHorizontal !== undefined) {
            this.isHorizontal = l1.isHorizontal;
        }
        if (l1.barModeStatus !== undefined) {
            this.barModeStatus = l1.barModeStatus;
        }
        if (l1.directionStatus !== undefined) {
            this.directionStatus = l1.directionStatus;
        }
        if (l1.textMarginTop !== undefined) {
            this.textMarginTop = l1.textMarginTop;
        }
        if (l1.textMarginLeft !== undefined) {
            this.textMarginLeft = l1.textMarginLeft;
        }
        if (l1.tabMargin !== undefined) {
            this.tabMargin = l1.tabMargin;
        }
        if (l1.tabPadding !== undefined) {
            this.tabPadding = l1.tabPadding;
        }
        if (l1.isIconAndText !== undefined) {
            this.isIconAndText = l1.isIconAndText;
        }
        if (l1.barHeight !== undefined) {
            this.barHeight = l1.barHeight;
        }
        if (l1.listener !== undefined) {
            this.listener = l1.listener;
        }
    }
    updateStateVars(k1) {
        this.__tabBarOptionsArray.reset(k1.tabBarOptionsArray);
        this.__tabBarPosition.reset(k1.tabBarPosition);
        this.__barBackgroundColor.reset(k1.barBackgroundColor);
        this.__index.reset(k1.index);
        this.__barOverlap.reset(k1.barOverlap);
        this.__layoutMode.reset(k1.layoutMode);
    }
    purgeVariableDependenciesOnElmtId(j1) {
        this.__tabBarOptionsArray.purgeDependencyOnElmtId(j1);
        this.__tabBarPosition.purgeDependencyOnElmtId(j1);
        this.__barBackgroundColor.purgeDependencyOnElmtId(j1);
        this.__index.purgeDependencyOnElmtId(j1);
        this.__barOverlap.purgeDependencyOnElmtId(j1);
        this.__layoutMode.purgeDependencyOnElmtId(j1);
        this.__selectedIndex.purgeDependencyOnElmtId(j1);
        this.__isHorizontal.purgeDependencyOnElmtId(j1);
        this.__barModeStatus.purgeDependencyOnElmtId(j1);
        this.__directionStatus.purgeDependencyOnElmtId(j1);
        this.__textMarginTop.purgeDependencyOnElmtId(j1);
        this.__textMarginLeft.purgeDependencyOnElmtId(j1);
        this.__tabMargin.purgeDependencyOnElmtId(j1);
        this.__tabPadding.purgeDependencyOnElmtId(j1);
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
    set tabBarOptionsArray(i1) {
        this.__tabBarOptionsArray.set(i1);
    }
    get tabBarPosition() {
        return this.__tabBarPosition.get();
    }
    set tabBarPosition(h1) {
        this.__tabBarPosition.set(h1);
    }
    get barBackgroundColor() {
        return this.__barBackgroundColor.get();
    }
    set barBackgroundColor(g1) {
        this.__barBackgroundColor.set(g1);
    }
    get index() {
        return this.__index.get();
    }
    set index(f1) {
        this.__index.set(f1);
    }
    get barOverlap() {
        return this.__barOverlap.get();
    }
    set barOverlap(e1) {
        this.__barOverlap.set(e1);
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
            this.startListener();
        }
    }
    aboutToDisappear() {
        this.listener.off('change');
        display.off('foldDisplayModeChange');
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
        if (display.isFoldable()) {
            display.on('foldDisplayModeChange', (data) => {
                this.initLayoutStatus();
            });
        }
        this.listener.on('change', (mediaQueryResult) => {
            this.initLayoutStatus();
        });
    }
    initLayoutStatus() {
        const screenWidth = px2vp(display.getDefaultDisplaySync().width);
        const widthFlag = screenWidth / this.tabBarOptionsArray.length > 104 ? true : false;
        console.log('widthFlag===  ', widthFlag);
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
        return this.isHorizontal ? { "id": -1, "type": 10002, params: ['sys.float.ohos_id_text_size_button3'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" } :
            (this.isIconAndText ? { "id": -1, "type": 10002, params: ['sys.float.ohos_id_text_size_caption'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" } : { "id": -1, "type": 10002, params: ['sys.float.ohos_id_text_size_button3'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" });
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
        this.observeComponentCreation2((c1, d1) => {
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
        this.observeComponentCreation2((h, i) => {
            ForEach.create();
            const j = (l, m) => {
                const n = l;
                this.observeComponentCreation2((p, q) => {
                    If.create();
                    if (n) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((u, v) => {
                                TabContent.create(() => {
                                    this.observeComponentCreation2((y, z) => {
                                        If.create();
                                        if (this.tabContents && this.tabContents[m]) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.tabContents[m]?.bind(this)?.(this);
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
            this.forEachUpdateFunction(h, this.tabBarOptionsArray, j, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Tabs.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class TabBarOptions {
    constructor(b, c, d, e) {
        this.icon = b;
        this.text = c;
        this.unselectedColor = d;
        this.selectedColor = e;
    }
}

export var TabBarPosition;
(function (a) {
    a[a["LEFT"] = 0] = "LEFT";
    a[a["BOTTOM"] = 1] = "BOTTOM";
})(TabBarPosition || (TabBarPosition = {}));

export default { AtomicServiceTabs, TabBarOptions, TabBarPosition};