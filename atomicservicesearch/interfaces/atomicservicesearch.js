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
const OperationType = requireNapi('arkui.advanced.SubHeader');
const TEXT_SIZE_BODY1 = { 'id': -1, 'type': -1, params: [`sys.float.ohos_id_text_size_body1`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const TEXT_COLOR_SECONDARY = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_text_secondary`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const ICON_COLOR_SECONDARY = { 'id': -1, 'type': 10001, params: ['sys.color.ohos_id_color_secondary'], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const TEXT_BOX_COLOR = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_text_field_sub_bg`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const TEXT_COLOR_PRIMARY = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_text_primary`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const FUNCTION_ICON_COLOR = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_primary`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const EFFECT_COLOR = { 'id': -1, 'type': -1, params: [`sys.color.ohos_id_color_click_effect`], 'bundleName': '__harDefaultBundleName__', 'moduleName': '__harDefaultModuleName__' };
const FONT_WEIGHT_PRIMARY = 500;
const FONT_WEIGHT_DEFAULT = 400;
const FONT_SIZE = 16;
const MENU_ALIGN_TYPE_START_X = 0;
const MENU_ALIGN_TYPE_START_Y = 0;
const SELECT_CONSTRAINT_SIZE_MIN_HEIGHT = 36;
const SELECT_HEIGHT = 36;
const SELECT_PADDING_LEFT = 6;
const SELECT_MARGIN_LEFT = 2;
const SELECT_SPACE = 2;
const DIVIDER_HEIGHT = 20;
const DIVIDER_OPACITY = 0.6;
const DIVIDER_MARGIN_LEFT = 2;
const DIVIDER_MARGIN_RIGHT = -2;
const FUNCTION_ICON_WIDTH_HEIGHT = 24;
const INDEPENDENT_FUNCTION_POSITION_OFFSET = 0;
const FUNCTION_POSITION_OFFSET = 2;
const INDEPENDENT_FUNCTION_WIDTH_HEIGHT = 40;
const FUNCTION_WIDTH_HEIGHT = 36;
const FLEX_SHRINK = 0;
const INDEPENDENT_FUNCTION_MARGIN = 0;
const FUNCTION_MARGIN_LEFT = 8;
const FUNCTION_MARGIN_RIGHT = 0;
const BORDER_RADIUS = 20;
const SEARCH_HEIGHT = 40;

export class AtomicServiceSearch extends ViewPU {

    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === 'function') {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isFunction1Pressed = new ObservedPropertySimplePU(false, this, 'isFunction1Pressed');
        this.__isFunction2Pressed = new ObservedPropertySimplePU(false, this, 'isFunction2Pressed');
        this.__isSearchPressed = new ObservedPropertySimplePU(false, this, 'isSearchPressed');
        this.__changeValue = new SynchedPropertySimpleOneWayPU(params.changeValue, this, 'changeValue');
        this.__showImage = new ObservedPropertySimplePU(true, this, 'showImage');
        this.__hint = new SynchedPropertyObjectOneWayPU(params.hint, this, 'hint');
        this.select = undefined;
        this.__operationType = new SynchedPropertySimpleOneWayPU(params.operationType, this, 'operationType');
        this.operationItem = undefined;
        this.onSearch = undefined;
        this.controller = new SearchController();
        this.setInitiallyProvidedValue(params);
        this.declareWatch('changeValue', this.onParamsChange);
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
        if (params.changeValue === undefined) {
            this.__changeValue.set('');
        }
        if (params.showImage !== undefined) {
            this.showImage = params.showImage;
        }
        if (params.hint === undefined) {
            this.__hint.set('Search');
        }
        if (params.select !== undefined) {
            this.select = params.select;
        }
        if (params.operationType === undefined) {
            this.__operationType.set(OperationType.BUTTON);
        }
        if (params.operationItem !== undefined) {
            this.operationItem = params.operationItem;
        }
        if (params.onSearch !== undefined) {
            this.onSearch = params.onSearch;
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
    }

    updateStateVars(params) {
        this.__changeValue.reset(params.changeValue);
        this.__hint.reset(params.hint);
        this.__operationType.reset(params.operationType);
    }

    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isFunction1Pressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isFunction2Pressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isSearchPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__changeValue.purgeDependencyOnElmtId(rmElmtId);
        this.__showImage.purgeDependencyOnElmtId(rmElmtId);
        this.__hint.purgeDependencyOnElmtId(rmElmtId);
        this.__operationType.purgeDependencyOnElmtId(rmElmtId);
    }

    aboutToBeDeleted() {
        this.__isFunction1Pressed.aboutToBeDeleted();
        this.__isFunction2Pressed.aboutToBeDeleted();
        this.__isSearchPressed.aboutToBeDeleted();
        this.__changeValue.aboutToBeDeleted();
        this.__showImage.aboutToBeDeleted();
        this.__hint.aboutToBeDeleted();
        this.__operationType.aboutToBeDeleted();
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

    get changeValue() {
        return this.__changeValue.get();
    }

    set changeValue(newValue) {
        this.__changeValue.set(newValue);
    }

    get showImage() {
        return this.__showImage.get();
    }

    set showImage(newValue) {
        this.__showImage.set(newValue);
    }

    get hint() {
        return this.__hint.get();
    }

    set hint(newValue) {
        this.__hint.set(newValue);
    }

    get operationType() {
        return this.__operationType.get();
    }

    set operationType(newValue) {
        this.__operationType.set(newValue);
    }

    onParamsChange() {
        this.showImage = this.changeValue.length === 0 ? true : false;
    }

    renderSearch(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Search.create({ value: this.changeValue, placeholder: this.hint, controller: this.controller });
            Search.backgroundColor(Color.Transparent);
            Search.placeholderFont({ size: TEXT_SIZE_BODY1, weight: FONT_WEIGHT_DEFAULT });
            Search.textFont({ size: TEXT_SIZE_BODY1, weight: FONT_WEIGHT_DEFAULT });
            Search.fontColor(TEXT_COLOR_SECONDARY);
            Search.searchIcon({ color: ICON_COLOR_SECONDARY });
            Search.onSubmit(this.onSearch?.onSubmit);
            Search.onChange((value, previewText) => {
                if (typeof this.onSearch?.onChange !== 'undefined') {
                    this.onSearch?.onChange(value, previewText);
                }
                this.changeValue = value;
            });
            Search.onCopy(this.onSearch?.onCopy);
            Search.onCut(this.onSearch?.onCut);
            Search.onPaste(this.onSearch?.onPaste);
            Search.onTextSelectionChange(this.onSearch?.onTextSelectionChange);
            Search.onContentScroll(this.onSearch?.onContentScroll);
            Search.onEditChange(this.onSearch?.onEditChange);
            Search.onWillInsert(this.onSearch?.onWillInsert);
            Search.onDidInsert(this.onSearch?.onDidInsert);
            Search.onWillDelete(this.onSearch?.onWillDelete);
            Search.onDidDelete(this.onSearch?.onDidDelete);
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

    renderSelect(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.select !== 'undefined' && this.select.options.length !== 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.flexShrink(FLEX_SHRINK);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Select.create(this.select?.options);
                        Select.value(this.select?.value);
                        Select.selected(this.select?.selected);
                        Select.onSelect(this.select?.onSelect);
                        Select.font({ size: TEXT_SIZE_BODY1, weight: FONT_WEIGHT_PRIMARY });
                        Select.fontColor(TEXT_COLOR_PRIMARY);
                        Select.selectedOptionFont({ size: FONT_SIZE, weight: FONT_WEIGHT_DEFAULT });
                        Select.menuAlign(MenuAlignType.START, { dx: MENU_ALIGN_TYPE_START_X, dy: MENU_ALIGN_TYPE_START_Y });
                        Select.optionFont({ size: FONT_SIZE, weight: FONT_WEIGHT_DEFAULT });
                        Select.backgroundColor(Color.Transparent);
                        Select.arrowPosition(ArrowPosition.END);
                        Select.constraintSize({ minHeight: SELECT_CONSTRAINT_SIZE_MIN_HEIGHT });
                        Select.padding({ left: SELECT_PADDING_LEFT });
                        Select.margin({ left: SELECT_MARGIN_LEFT });
                        Select.height(SELECT_HEIGHT);
                        Select.space(SELECT_SPACE);
                    }, Select);
                    Select.pop();
                    this.renderDivider.bind(this)();
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
            Divider.create();
            Divider.vertical(true);
            Divider.height(DIVIDER_HEIGHT);
            Divider.color(Color.Black);
            Divider.opacity(DIVIDER_OPACITY);
            Divider.margin({ left: DIVIDER_MARGIN_LEFT, right: DIVIDER_MARGIN_RIGHT });
        }, Divider);
    }

    renderFunction(item, independentOrNot, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.position(independentOrNot ?
                { top: INDEPENDENT_FUNCTION_POSITION_OFFSET, right: INDEPENDENT_FUNCTION_POSITION_OFFSET } :
                { top: FUNCTION_POSITION_OFFSET, right: FUNCTION_POSITION_OFFSET });
            Row.width(independentOrNot ? INDEPENDENT_FUNCTION_WIDTH_HEIGHT : FUNCTION_WIDTH_HEIGHT);
            Row.height(independentOrNot ? INDEPENDENT_FUNCTION_WIDTH_HEIGHT : FUNCTION_WIDTH_HEIGHT);
            Row.flexShrink(FLEX_SHRINK);
            Row.borderRadius(BORDER_RADIUS);
            Row.onClick(item.action);
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.margin(independentOrNot ? INDEPENDENT_FUNCTION_MARGIN :
                { left: FUNCTION_MARGIN_LEFT, right: FUNCTION_MARGIN_RIGHT });
            Row.backgroundColor(independentOrNot ?
                (this.isFunction2Pressed ? EFFECT_COLOR : Color.Transparent) :
                (this.isFunction1Pressed ? EFFECT_COLOR : Color.Transparent));
            Row.onTouch((event) => {
                if (event && event.type === TouchType.Down) {
                    if (independentOrNot) {
                        this.isFunction2Pressed = true;
                    }
                    else {
                        this.isFunction1Pressed = true;
                    }
                }
                else if (event && event.type === TouchType.Up) {
                    if (independentOrNot) {
                        this.isFunction2Pressed = false;
                    }
                    else {
                        this.isFunction1Pressed = false;
                    }
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(item.value);
            Image.width(FUNCTION_ICON_WIDTH_HEIGHT);
            Image.height(FUNCTION_ICON_WIDTH_HEIGHT);
            Image.fillColor(FUNCTION_ICON_COLOR);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        Row.pop();
    }

    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: FlexDirection.Row,
                alignItems: ItemAlign.Center,
                justifyContent: FlexAlign.Start
            });
            Flex.height(SEARCH_HEIGHT);
            Flex.borderRadius(BORDER_RADIUS);
            Flex.backgroundColor((typeof this.operationItem !== 'undefined' && this.operationItem?.length >= 2) ?
                Color.Transparent : (this.isSearchPressed ? EFFECT_COLOR : TEXT_BOX_COLOR));
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (typeof this.operationItem === 'undefined' || this.operationItem?.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.renderSelect.bind(this)();
                    this.renderSearch.bind(this)();
                });
            } else if (this.operationItem?.length === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.renderSelect.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                    }, Stack);
                    this.renderSearch.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showImage) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.renderFunction.bind(this)(this.operationItem[0], false);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                });
            } else if (this.operationItem?.length >= 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Flex.create({
                            direction: FlexDirection.Row,
                            alignItems: ItemAlign.Center,
                            justifyContent: FlexAlign.SpaceBetween
                        });
                        Flex.height(SEARCH_HEIGHT);
                        Flex.borderRadius(BORDER_RADIUS);
                        Flex.backgroundColor(this.isSearchPressed ? EFFECT_COLOR : TEXT_BOX_COLOR);
                    }, Flex);
                    this.renderSelect.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                    }, Stack);
                    this.renderSearch.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showImage) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.renderFunction.bind(this)(this.operationItem[0], false);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                    Flex.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(INDEPENDENT_FUNCTION_WIDTH_HEIGHT);
                        Row.height(INDEPENDENT_FUNCTION_WIDTH_HEIGHT);
                        Row.flexShrink(FLEX_SHRINK);
                        Row.borderRadius(BORDER_RADIUS);
                        Row.margin({ left: FUNCTION_MARGIN_LEFT });
                        Row.backgroundColor(TEXT_BOX_COLOR);
                    }, Row);
                    this.renderFunction.bind(this)(this.operationItem[1], true);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                });
            }
        }, If);
        If.pop();
        Flex.pop();
        Row.pop();
    }
    
    rerender() {
        this.updateDirtyElements();
    }
}

export default { AtomicServiceSearch };
