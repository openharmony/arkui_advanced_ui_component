/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
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

if (!('finalizeConstruction' in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, 'finalizeConstruction', () => { });
}

const LengthMetrics = requireNapi('arkui.node').LengthMetrics;

const TEXT_SIZE_BODY1 = { 'id': -1, 'type': -1, params: [`sys.float.ohos_id_text_size_body1`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const COLOR_TEXT_SECONDARY = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_text_secondary`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const ICON_COLOR_SECONDARY = { 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_secondary'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const ATOMIC_SERVICE_SEARCH_BG_COLOR = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_text_field_sub_bg`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const TEXT_COLOR_PRIMARY = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_text_primary`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const FUNCTION_ICON_COLOR = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_primary`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const EFFECT_COLOR = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_click_effect`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const ICON_SIZE = 16;
const SELECT_PADDING_LEFT = 6;
const SELECT_MARGIN_LEFT = 2;
const FLEX_SHRINK = 0;
const DIVIDER_OPACITY = 0.6;
const DIVIDER_MARGIN_LEFT = 2;
const DIVIDER_MARGIN_RIGHT = -2;
const ATOMIC_SERVICE_SEARCH_HEIGHT = 40;
const ATMOIC_SELECT_HEIGHT = 36;
const ATOMIC_SELECT_BORDER_RADIUS = 20;
const ATOMIC_DIVIDER_HEIGHT = 20;
const ICON_WIDTH_AND_HEIGTH = 24;
const OPERATION_ITEM1_MARGIN_RIGHT = 2;
const OPERATION_ITEM2_MARGIN_LEFT = 8;

export class AtomicServiceSearch extends ViewPU {

    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === 'function') {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isFunction1Pressed = new ObservedPropertySimplePU(false, this, 'isFunction1Pressed');
        this.__isFunction2Pressed = new ObservedPropertySimplePU(false, this, 'isFunction2Pressed');
        this.__isSearchPressed = new ObservedPropertySimplePU(false, this, 'isSearchPressed');
        this.__showImage = new ObservedPropertySimplePU(true, this, 'showImage');
        this.__value = new SynchedPropertySimpleOneWayPU(params.value, this, 'value');
        this.__placeholder = new SynchedPropertyObjectOneWayPU(params.placeholder, this, 'placeholder');
        this.controller = new SearchController();
        this.selectItems = undefined;
        this.__selectStyle = new SynchedPropertyObjectOneWayPU(params.selectStyle, this, 'selectStyle');
        this.searchEvents = undefined;
        this.__searchStyle = new SynchedPropertyObjectOneWayPU(params.searchStyle, this, 'searchStyle');
        this.operationItem1 = undefined;
        this.operationItem2 = undefined;
        this.setInitiallyProvidedValue(params);
        this.declareWatch('value', this.onParamsChange);
        this.finalizeConstruction();
    }

    setInitiallyProvidedValue(params) {
        if (params.isFunction1Pressed !== undefined) {
            this.isFunction1Pressed = params.isFunction1Pressed;
        }
        if (params.isFunction2Pressed !== undefined) {
            this.isFunction2Pressed = params.isFunction2Pressed;
        }
        if (params.isSearchPressed !== undefined) {
            this.isSearchPressed = params.isSearchPressed;
        }
        if (params.showImage !== undefined) {
            this.showImage = params.showImage;
        }
        if (params.value === undefined) {
            this.__value.set('');
        }
        if (params.placeholder === undefined) {
            this.__placeholder.set('Search');
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.selectItems !== undefined) {
            this.selectItems = params.selectItems;
        }
        if (params.selectStyle === undefined) {
            this.__selectStyle.set({
                font: {
                    size: TEXT_SIZE_BODY1,
                },
                fontColor: TEXT_COLOR_PRIMARY
            });
        }
        if (params.searchEvents !== undefined) {
            this.searchEvents = params.searchEvents;
        }
        if (params.searchStyle === undefined) {
            this.__searchStyle.set({
                componentBackgroundColor: ATOMIC_SERVICE_SEARCH_BG_COLOR,
                placeholderFont: {
                    size: TEXT_SIZE_BODY1,
                },
                placeholderColor: COLOR_TEXT_SECONDARY,
                textFont: {
                    size: TEXT_SIZE_BODY1,
                },
                fontColor: COLOR_TEXT_SECONDARY,
                searchIcon: {
                    size: ICON_SIZE,
                    color: ICON_COLOR_SECONDARY,
                },
                pressBackgroundColor: EFFECT_COLOR
            });
        }
        if (params.operationItem1 !== undefined) {
            this.operationItem1 = params.operationItem1;
        }
        if (params.operationItem2 !== undefined) {
            this.operationItem2 = params.operationItem2;
        }
    }

    updateStateVars(params) {
        this.__value.reset(params.value);
        this.__placeholder.reset(params.placeholder);
        this.__selectStyle.reset(params.selectStyle);
        this.__searchStyle.reset(params.searchStyle);
    }

    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isFunction1Pressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isFunction2Pressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isSearchPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__showImage.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__placeholder.purgeDependencyOnElmtId(rmElmtId);
        this.__selectStyle.purgeDependencyOnElmtId(rmElmtId);
        this.__searchStyle.purgeDependencyOnElmtId(rmElmtId);
    }

    aboutToBeDeleted() {
        this.__isFunction1Pressed.aboutToBeDeleted();
        this.__isFunction2Pressed.aboutToBeDeleted();
        this.__isSearchPressed.aboutToBeDeleted();
        this.__showImage.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        this.__selectStyle.aboutToBeDeleted();
        this.__searchStyle.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }

    get isFunction1Pressed() {
        return this.__isFunction1Pressed.get();
    }

    set isFunction1Pressed(newValue) {
        this.__isFunction1Pressed.set(newValue);
    }

    get isFunction2Pressed() {
        return this.__isFunction2Pressed.get();
    }

    set isFunction2Pressed(newValue) {
        this.__isFunction2Pressed.set(newValue);
    }

    get isSearchPressed() {
        return this.__isSearchPressed.get();
    }

    set isSearchPressed(newValue) {
        this.__isSearchPressed.set(newValue);
    }

    get showImage() {
        return this.__showImage.get();
    }

    set showImage(newValue) {
        this.__showImage.set(newValue);
    }

    get value() {
        return this.__value.get();
    }

    set value(newValue) {
        this.__value.set(newValue);
    }

    get placeholder() {
        return this.__placeholder.get();
    }

    set placeholder(newValue) {
        this.__placeholder.set(newValue);
    }

    get selectStyle() {
        return this.__selectStyle.get();
    }

    set selectStyle(newValue) {
        this.__selectStyle.set(newValue);
    }

    get searchStyle() {
        return this.__searchStyle.get();
    }

    set searchStyle(newValue) {
        this.__searchStyle.set(newValue);
    }

    aboutToAppear() {
        this.showImage = this.value.length === 0 ? true : false;
        this.initSelectStyle();
        this.initSearchStyle();
    }

    initSelectStyle() {
        if (typeof this.selectStyle !== 'undefined') {
            if (typeof this.selectStyle.font === 'undefined') {
                this.selectStyle.font = { size: TEXT_SIZE_BODY1 };
            }
            if (typeof this.selectStyle.fontColor !== 'undefined') {
                this.selectStyle.fontColor = TEXT_COLOR_PRIMARY;
            }
        }
    }

    initSearchStyle() {
        if (typeof this.searchStyle !== 'undefined') {
            if (typeof this.searchStyle.componentBackgroundColor === 'undefined') {
                this.searchStyle.componentBackgroundColor = ATOMIC_SERVICE_SEARCH_BG_COLOR;
            }
            if (typeof this.searchStyle.placeholderFont === 'undefined') {
                this.searchStyle.placeholderFont = { size: TEXT_SIZE_BODY1 };
            }
            if (typeof this.searchStyle.placeholderColor === 'undefined') {
                this.searchStyle.placeholderColor = COLOR_TEXT_SECONDARY;
            }
            if (typeof this.searchStyle.textFont === 'undefined') {
                this.searchStyle.textFont = { size: TEXT_SIZE_BODY1 };
            }
            if (typeof this.searchStyle.fontColor === 'undefined') {
                this.searchStyle.fontColor = COLOR_TEXT_SECONDARY;
            }
            if (typeof this.searchStyle.searchIcon === 'undefined') {
                this.searchStyle.searchIcon = {
                    size: ICON_SIZE,
                    color: ICON_COLOR_SECONDARY,
                };
            }
            if (typeof this.searchStyle.pressBackgroundColor === 'undefined') {
                this.searchStyle.pressBackgroundColor = EFFECT_COLOR;
            }
        }
    }

    onParamsChange() {
        this.showImage = this.value.length === 0 ? true : false;
    }

    renderSelect(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.selectItems !== 'undefined' && this.selectItems.options.length !== 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.flexShrink(FLEX_SHRINK);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Select.create(this.selectItems?.options);
                        Select.value(this.selectItems?.value);
                        Select.selected(this.selectItems?.selected);
                        Select.onSelect(this.selectItems?.onSelect);
                        Select.controlSize(this.selectStyle?.controlSize);
                        Select.menuItemContentModifier.bind(this)(this.selectStyle?.menuItemContentModifier);
                        Select.divider(this.selectStyle?.divider);
                        Select.font(this.selectStyle?.font);
                        Select.fontColor(this.selectStyle?.fontColor);
                        Select.selectedOptionBgColor(this.selectStyle?.selectedOptionBgColor);
                        Select.selectedOptionFont(this.selectStyle?.selectedOptionFont);
                        Select.selectedOptionFontColor(this.selectStyle?.selectedOptionFontColor);
                        Select.optionBgColor(this.selectStyle?.optionBgColor);
                        Select.optionFont(this.selectStyle?.optionFont);
                        Select.optionFontColor(this.selectStyle?.optionFontColor);
                        Select.space(this.selectStyle?.space);
                        Select.arrowPosition(this.selectStyle?.arrowPosition);
                        Select.menuAlign(this.selectStyle?.menuAlign?.alignType, this.selectStyle?.menuAlign?.offset);
                        Select.optionWidth(this.selectStyle?.optionWidth);
                        Select.optionHeight(this.selectStyle?.optionHeight);
                        Select.menuBackgroundColor(this.selectStyle?.menuBackgroundColor);
                        Select.menuBackgroundBlurStyle(this.selectStyle?.menuBackgroundBlurStyle);
                        Select.height(ATMOIC_SELECT_HEIGHT);
                        Select.borderRadius(ATOMIC_SELECT_BORDER_RADIUS);
                        Select.constraintSize({ minHeight: ATMOIC_SELECT_HEIGHT });
                        Select.padding({ start: LengthMetrics.vp(SELECT_PADDING_LEFT) });
                        Select.margin({ start: LengthMetrics.vp(SELECT_MARGIN_LEFT) });
                        Select.backgroundColor(Color.Transparent);
                    }, Select);
                    Select.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }

    renderDivider(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.selectItems !== 'undefined' && this.selectItems.options.length !== 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.vertical(true);
                        Divider.color(Color.Black);
                        Divider.height(ATOMIC_DIVIDER_HEIGHT);
                        Divider.opacity(DIVIDER_OPACITY);
                        Divider.margin({
                            start: LengthMetrics.vp(DIVIDER_MARGIN_LEFT),
                            end: LengthMetrics.vp(DIVIDER_MARGIN_RIGHT)
                        });
                    }, Divider);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }

    renderSearch(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Search.create({
                value: this.value,
                placeholder: this.placeholder,
                controller: this.controller
            });
            Search.backgroundColor(Color.Transparent);
            Search.searchButton(this.searchStyle?.searchButton?.value, this.searchStyle?.searchButton?.option);
            Search.placeholderColor(this.searchStyle?.placeholderColor);
            Search.placeholderFont(this.searchStyle?.placeholderFont);
            Search.textFont(this.searchStyle?.textFont);
            Search.textAlign(this.searchStyle?.textAlign);
            Search.copyOption(this.searchStyle?.copyOption);
            Search.searchIcon(this.searchStyle?.searchIcon);
            Search.cancelButton({ icon: this.searchStyle?.cancelIcon });
            Search.fontColor(this.searchStyle?.fontColor);
            Search.caretStyle(this.searchStyle?.caretStyle);
            Search.enableKeyboardOnFocus(this.searchStyle?.enableKeyboardOnFocus);
            Search.selectionMenuHidden(this.searchStyle?.selectionMenuHidden);
            Search.customKeyboard(null, { supportAvoidance: this.searchStyle?.keyboardAvoidance });
            Search.type(this.searchStyle?.type);
            Search.maxLength(this.searchStyle?.maxLength);
            Search.enterKeyType(this.searchStyle?.enterKeyType);
            Search.decoration(this.searchStyle?.decoration);
            Search.letterSpacing(this.searchStyle?.letterSpacing);
            Search.fontFeature(this.searchStyle?.fontFeature);
            Search.selectedBackgroundColor(this.searchStyle?.selectedBackgroundColor);
            Search.inputFilter(this.searchStyle?.inputFilter?.value, this.searchStyle?.inputFilter?.error);
            Search.textIndent(this.searchStyle?.textIndent);
            Search.minFontSize(this.searchStyle?.minFontSize);
            Search.maxFontSize(this.searchStyle?.maxFontSize);
            Search.editMenuOptions(this.searchStyle?.editMenuOptions);
            Search.enablePreviewText(this.searchStyle?.enablePreviewText);
            Search.enableHapticFeedback(this.searchStyle?.enableHapticFeedback);
            Search.placeholderFont(this.searchStyle?.placeholderFont);
            Search.textFont(this.searchStyle?.textFont);
            Search.searchIcon(this.searchStyle?.searchIcon);
            Search.fontColor(this.searchStyle?.fontColor);
            Search.onCut(this.searchEvents?.onCut);
            Search.onCopy(this.searchEvents?.onCopy);
            Search.onPaste(this.searchEvents?.onPaste);
            Search.onSubmit(this.searchEvents?.onSubmit);
            Search.onDidInsert(this.searchEvents?.onDidInsert);
            Search.onDidDelete(this.searchEvents?.onDidDelete);
            Search.onEditChange(this.searchEvents?.onEditChange);
            Search.onWillInsert(this.searchEvents?.onWillInsert);
            Search.onWillDelete(this.searchEvents?.onWillDelete);
            Search.onContentScroll(this.searchEvents?.onContentScroll);
            Search.onTextSelectionChange(this.searchEvents?.onTextSelectionChange);
            Search.onChange((value, previewText) => {
                if (typeof this.searchEvents?.onChange !== 'undefined') {
                    this.searchEvents?.onChange(value, previewText);
                }
                this.value = value;
            });
            Search.onTouch((event) => {
                if (event && event.type === TouchType.Down) {
                    this.isSearchPressed = true;
                }
                else if (event && event.type === TouchType.Up) {
                    this.isSearchPressed = false;
                }
            });
        }, Search);
        Search.pop();
    }

    renderOperationItem1(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.operationItem1 !== 'undefined' && this.showImage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.onClick(this.operationItem1?.action);
                        Row.flexShrink(FLEX_SHRINK);
                        Row.borderRadius(ATOMIC_SELECT_BORDER_RADIUS);
                        Row.alignItems(VerticalAlign.Center);
                        Row.justifyContent(FlexAlign.Center);
                        Row.width(ATMOIC_SELECT_HEIGHT);
                        Row.height(ATMOIC_SELECT_HEIGHT);
                        Row.margin({ right: OPERATION_ITEM1_MARGIN_RIGHT });
                        Row.backgroundColor(this.isFunction1Pressed ? this.searchStyle?.pressBackgroundColor : Color.Transparent);
                        Row.onTouch((event) => {
                            if (event && event.type === TouchType.Down) {
                                this.isFunction1Pressed = true;
                            }
                            else if (event && event.type === TouchType.Up) {
                                this.isFunction1Pressed = false;
                            }
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.operationItem1?.value);
                        Image.objectFit(ImageFit.Contain);
                        Image.fillColor(FUNCTION_ICON_COLOR);
                        Image.width(ICON_WIDTH_AND_HEIGTH);
                        Image.height(ICON_WIDTH_AND_HEIGTH);
                    }, Image);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }

    renderOperationItem2(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.operationItem2 !== 'undefined') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.onClick(this.operationItem2?.action);
                        Row.flexShrink(FLEX_SHRINK);
                        Row.borderRadius(ATOMIC_SELECT_BORDER_RADIUS);
                        Row.alignItems(VerticalAlign.Center);
                        Row.justifyContent(FlexAlign.Center);
                        Row.width(ATOMIC_SERVICE_SEARCH_HEIGHT);
                        Row.height(ATOMIC_SERVICE_SEARCH_HEIGHT);
                        Row.margin(OPERATION_ITEM2_MARGIN_LEFT);
                        Row.backgroundColor(this.isFunction2Pressed ? this.searchStyle?.pressBackgroundColor :
                            this.searchStyle?.componentBackgroundColor);
                        Row.onTouch((event) => {
                            if (event && event.type === TouchType.Down) {
                                this.isFunction2Pressed = true;
                            }
                            else if (event && event.type === TouchType.Up) {
                                this.isFunction2Pressed = false;
                            }
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.operationItem2?.value);
                        Image.objectFit(ImageFit.Contain);
                        Image.fillColor(FUNCTION_ICON_COLOR);
                        Image.width(ICON_WIDTH_AND_HEIGTH);
                        Image.height(ICON_WIDTH_AND_HEIGTH);
                    }, Image);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }

    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height(ATOMIC_SERVICE_SEARCH_HEIGHT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: FlexDirection.Row,
                alignItems: ItemAlign.Center,
                justifyContent: FlexAlign.Start
            });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.alignContent(Alignment.End);
            Stack.borderRadius(ATOMIC_SELECT_BORDER_RADIUS);
            Stack.backgroundColor(this.isSearchPressed ?
                this.searchStyle?.pressBackgroundColor : this.searchStyle?.componentBackgroundColor);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: FlexDirection.Row,
                alignItems: ItemAlign.Center,
                justifyContent: FlexAlign.Start
            });
        }, Flex);
        this.renderSelect.bind(this)();
        this.renderDivider.bind(this)();
        this.renderSearch.bind(this)();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.searchStyle?.searchButton === 'undefined') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.renderOperationItem1.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.renderOperationItem2.bind(this)();
        Flex.pop();
        Row.pop();
    }
    
    rerender() {
        this.updateDirtyElements();
    }
}

export default { AtomicServiceSearch };
