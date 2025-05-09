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
const DIVIDER_OPACITY = 0.5;
const DIVIDER_MARGIN_LEFT = 2;
const DIVIDER_MARGIN_RIGHT = 0;
const ATOMIC_SERVICE_SEARCH_HEIGHT = 40;
const ATOMIC_SELECT_HEIGHT = 36;
const ATOMIC_SELECT_BORDER_RADIUS = 20;
const ATOMIC_DIVIDER_HEIGHT = 20;
const ICON_WIDTH_AND_HEIGTH = 24;
const OPERATION_ITEM1_MARGIN_RIGHT = 2;
const OPERATION_ITEM2_MARGIN_LEFT = 8;
const SEARCH_OFFSET_X = -5;

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
        this.__value = new SynchedPropertyObjectOneWayPU(params.value, this, 'value');
        this.__placeholder = new SynchedPropertyObjectOneWayPU(params.placeholder, this, 'placeholder');
        this.__select = new SynchedPropertyObjectOneWayPU(params.select, this, 'select');
        this.__search = new SynchedPropertyObjectOneWayPU(params.search, this, 'search');
        this.operation = undefined;
        this.controller = new SearchController();
        this.setInitiallyProvidedValue(params);
        this.declareWatch('value', this.onParamsChange);
        this.declareWatch('select', this.onSelectChange);
        this.declareWatch('search', this.onSearchChange);
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
        if (params.select === undefined) {
            this.__select.set({});
        }
        if (params.search === undefined) {
            this.__search.set({
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
                pressedBackgroundColor: EFFECT_COLOR
            });
        }
        if (params.operation !== undefined) {
            this.operation = params.operation;
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
    }

    updateStateVars(params) {
        this.__value.reset(params.value);
        this.__placeholder.reset(params.placeholder);
        this.__select.reset(params.select);
        this.__search.reset(params.search);
    }

    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isFunction1Pressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isFunction2Pressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isSearchPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__showImage.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__placeholder.purgeDependencyOnElmtId(rmElmtId);
        this.__select.purgeDependencyOnElmtId(rmElmtId);
        this.__search.purgeDependencyOnElmtId(rmElmtId);
    }

    aboutToBeDeleted() {
        this.__isFunction1Pressed.aboutToBeDeleted();
        this.__isFunction2Pressed.aboutToBeDeleted();
        this.__isSearchPressed.aboutToBeDeleted();
        this.__showImage.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        this.__select.aboutToBeDeleted();
        this.__search.aboutToBeDeleted();
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

    get select() {
        return this.__select.get();
    }

    set select(newValue) {
        this.__select.set(newValue);
    }

    get search() {
        return this.__search.get();
    }

    set search(newValue) {
        this.__search.set(newValue);
    }

    aboutToAppear() {
        this.showImage = this.value?.toString().length === 0 ? true : false;
        this.initSelectStyle();
        this.initSearchStyle();
    }

    onParamsChange() {
        this.showImage = this.value?.toString().length === 0 ? true : false;
    }

    onSelectChange() {
        this.initSelectStyle();
    }

    onSearchChange() {
        this.initSearchStyle();
    }

    initSelectStyle() {
        if (typeof this.select !== 'undefined') {
            if (typeof this.select.selected === 'undefined') {
                this.select.selected = -1;
            }
            if (typeof this.select.font === 'undefined') {
                this.select.font = { size: TEXT_SIZE_BODY1 };
            }
            if (typeof this.select.fontColor === 'undefined') {
                this.select.fontColor = TEXT_COLOR_PRIMARY;
            }
        }
    }

    initSearchStyle() {
        if (typeof this.search !== 'undefined') {
            if (typeof this.search.componentBackgroundColor === 'undefined') {
                this.search.componentBackgroundColor = ATOMIC_SERVICE_SEARCH_BG_COLOR;
            }
            if (typeof this.search.placeholderFont === 'undefined') {
                this.search.placeholderFont = { size: TEXT_SIZE_BODY1 };
            }
            if (typeof this.search.placeholderColor === 'undefined') {
                this.search.placeholderColor = COLOR_TEXT_SECONDARY;
            }
            if (typeof this.search.textFont === 'undefined') {
                this.search.textFont = { size: TEXT_SIZE_BODY1 };
            }
            if (typeof this.search.fontColor === 'undefined') {
                this.search.fontColor = COLOR_TEXT_SECONDARY;
            }
            if (typeof this.search.searchIcon === 'undefined') {
                this.search.searchIcon = {
                    size: ICON_SIZE,
                    color: ICON_COLOR_SECONDARY,
                };
            }
            if (typeof this.search.pressedBackgroundColor === 'undefined') {
                this.search.pressedBackgroundColor = EFFECT_COLOR;
            }
        }
    }

    renderSelect(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.select !== 'undefined' && typeof this.select.options !== 'undefined') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.flexShrink(FLEX_SHRINK);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Select.create(this.select?.options);
                        Select.value(this.select?.selectValue);
                        Select.selected(this.select?.selected);
                        Select.onSelect(this.select?.onSelect);
                        Select.menuItemContentModifier.bind(this)(this.select?.menuItemContentModifier);
                        Select.divider(this.select?.divider);
                        Select.font(this.select?.font);
                        Select.fontColor(this.select?.fontColor);
                        Select.selectedOptionBgColor(this.select?.selectedOptionBgColor);
                        Select.selectedOptionFont(this.select?.selectedOptionFont);
                        Select.selectedOptionFontColor(this.select?.selectedOptionFontColor);
                        Select.optionBgColor(this.select?.optionBgColor);
                        Select.optionFont(this.select?.optionFont);
                        Select.optionFontColor(this.select?.optionFontColor);
                        Select.space(this.select?.space);
                        Select.arrowPosition(this.select?.arrowPosition);
                        Select.menuAlign(this.select?.menuAlign?.alignType, this.select?.menuAlign?.offset);
                        Select.optionWidth(this.select?.optionWidth);
                        Select.optionHeight(this.select?.optionHeight);
                        Select.menuBackgroundColor(this.select?.menuBackgroundColor);
                        Select.menuBackgroundBlurStyle(this.select?.menuBackgroundBlurStyle);
                        Select.height(ATOMIC_SELECT_HEIGHT);
                        Select.borderRadius(ATOMIC_SELECT_BORDER_RADIUS);
                        Select.constraintSize({ minHeight: ATOMIC_SELECT_HEIGHT });
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
            if (typeof this.select !== 'undefined' && typeof this.select.options !== 'undefined') {
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
                value: this.value?.toString(),
                placeholder: this.placeholder,
                controller: this.controller
            });
            Search.key(this.search?.searchKey?.toString());
            Search.margin({ start: LengthMetrics.vp(SEARCH_OFFSET_X) });
            Search.backgroundColor(Color.Transparent);
            Search.searchButton(this.search?.searchButton?.searchButtonValue.toString(), this.search?.searchButton?.options);
            Search.placeholderColor(this.search?.placeholderColor);
            Search.placeholderFont(this.search?.placeholderFont);
            Search.textFont(this.search?.textFont);
            Search.textAlign(this.search?.textAlign);
            Search.copyOption(this.search?.copyOptions);
            Search.searchIcon(this.search?.searchIcon);
            Search.cancelButton({ icon: this.search?.cancelIcon });
            Search.fontColor(this.search?.fontColor);
            Search.caretStyle(this.search?.caretStyle);
            Search.enableKeyboardOnFocus(this.search?.enableKeyboardOnFocus);
            Search.selectionMenuHidden(this.search?.hideSelectionMenu);
            Search.type(this.search?.type);
            Search.maxLength(this.search?.maxLength);
            Search.enterKeyType(this.search?.enterKeyType);
            Search.decoration(this.search?.decoration);
            Search.letterSpacing(this.search?.letterSpacing);
            Search.fontFeature(this.search?.fontFeature?.toString());
            Search.selectedBackgroundColor(this.search?.selectedBackgroundColor);
            Search.inputFilter(this.search?.inputFilter?.inputFilterValue, this.search?.inputFilter?.error);
            Search.textIndent(this.search?.textIndent);
            Search.minFontSize(this.search?.minFontSize);
            Search.maxFontSize(this.search?.maxFontSize);
            Search.editMenuOptions(this.search?.editMenuOptions);
            Search.enablePreviewText(this.search?.enablePreviewText);
            Search.enableHapticFeedback(this.search?.enableHapticFeedback);
            Search.placeholderFont(this.search?.placeholderFont);
            Search.textFont(this.search?.textFont);
            Search.searchIcon(this.search?.searchIcon);
            Search.fontColor(this.search?.fontColor);
            Search.onCut(this.search?.onCut);
            Search.onCopy(this.search?.onCopy);
            Search.onPaste(this.search?.onPaste);
            Search.onSubmit(this.search?.onSubmit);
            Search.onDidInsert(this.search?.onDidInsert);
            Search.onDidDelete(this.search?.onDidDelete);
            Search.onEditChange(this.search?.onEditChange);
            Search.onWillInsert(this.search?.onWillInsert);
            Search.onWillDelete(this.search?.onWillDelete);
            Search.onContentScroll(this.search?.onContentScroll);
            Search.onTextSelectionChange(this.search?.onTextSelectionChange);
            Search.onChange((value, previewText) => {
                if (previewText?.value.length !== 0) {
                    this.value = previewText?.value;
                }
                else {
                    this.value = value;
                }
                if (typeof this.search?.onChange !== 'undefined') {
                    this.search?.onChange(value, previewText);
                }
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

    renderAuxiliaryItem(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.operation?.auxiliaryItem !== 'undefined' && this.showImage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.onClick(this.operation?.auxiliaryItem.action);
                        Row.flexShrink(FLEX_SHRINK);
                        Row.borderRadius(ATOMIC_SELECT_BORDER_RADIUS);
                        Row.alignItems(VerticalAlign.Center);
                        Row.justifyContent(FlexAlign.Center);
                        Row.width(ATOMIC_SELECT_HEIGHT);
                        Row.height(ATOMIC_SELECT_HEIGHT);
                        Row.margin({ end: LengthMetrics.vp(OPERATION_ITEM1_MARGIN_RIGHT) });
                        Row.backgroundColor(this.isFunction1Pressed ? this.search?.pressedBackgroundColor : Color.Transparent);
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
                        Image.create(this.operation?.auxiliaryItem?.value);
                        Image.objectFit(ImageFit.Contain);
                        Image.fillColor(FUNCTION_ICON_COLOR);
                        Image.width(ICON_WIDTH_AND_HEIGTH);
                        Image.height(ICON_WIDTH_AND_HEIGTH);
                        Image.draggable(false);
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

    renderIndependentItem(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.operation?.independentItem !== 'undefined') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.onClick(this.operation?.independentItem.action);
                        Row.flexShrink(FLEX_SHRINK);
                        Row.borderRadius(ATOMIC_SELECT_BORDER_RADIUS);
                        Row.alignItems(VerticalAlign.Center);
                        Row.justifyContent(FlexAlign.Center);
                        Row.width(ATOMIC_SERVICE_SEARCH_HEIGHT);
                        Row.height(ATOMIC_SERVICE_SEARCH_HEIGHT);
                        Row.margin({ start: LengthMetrics.vp(OPERATION_ITEM2_MARGIN_LEFT) });
                        Row.backgroundColor(this.isFunction2Pressed ?
                            this.search?.pressedBackgroundColor : this.search?.componentBackgroundColor);
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
                        Image.create(this.operation?.independentItem.value);
                        Image.objectFit(ImageFit.Contain);
                        Image.fillColor(FUNCTION_ICON_COLOR);
                        Image.width(ICON_WIDTH_AND_HEIGTH);
                        Image.height(ICON_WIDTH_AND_HEIGTH);
                        Image.draggable(false);
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
                this.search?.pressedBackgroundColor : this.search?.componentBackgroundColor);
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
            if (typeof this.search?.searchButton === 'undefined') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.renderAuxiliaryItem.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.renderIndependentItem.bind(this)();
        Flex.pop();
        Row.pop();
    }
    
    rerender() {
        this.updateDirtyElements();
    }

}

export default { AtomicServiceSearch };
