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
import { LengthMetrics, OperationOption } from '@kit.ArkUI';

declare type OnSelectCallback = (index: number, value?: string) => void;
declare type OnPasteCallback = (value: string, event: PasteEvent) => void;
declare type OnTextSelectionChangeCallback = (selectionStart: number, selectionEnd: number) => void;
declare type OnContentScrollCallback = (totalOffsetX: number, totalOffsetY: number) => void;

const TEXT_SIZE_BODY1: Resource = $r(`sys.float.ohos_id_text_size_body1`);
const COLOR_TEXT_SECONDARY = $r(`sys.color.ohos_id_color_text_secondary`);
const ICON_COLOR_SECONDARY = $r('sys.color.ohos_id_color_secondary');
const ATOMIC_SERVICE_SEARCH_BG_COLOR = $r(`sys.color.ohos_id_color_text_field_sub_bg`);
const TEXT_COLOR_PRIMARY = $r(`sys.color.ohos_id_color_text_primary`);
const FUNCTION_ICON_COLOR = $r(`sys.color.ohos_id_color_primary`);
const EFFECT_COLOR = $r(`sys.color.ohos_id_color_click_effect`);
const ICON_SIZE: number = 16;
const SELECT_PADDING_LEFT: number = 6;
const SELECT_MARGIN_LEFT: number = 2;
const FLEX_SHRINK: number = 0;
const DIVIDER_OPACITY: number = 0.5;
const DIVIDER_MARGIN_LEFT: number = 2;
const DIVIDER_MARGIN_RIGHT: number = -2;
const ATOMIC_SERVICE_SEARCH_HEIGHT: number = 40;
const ATOMIC_SELECT_HEIGHT: number = 36;
const ATOMIC_SELECT_BORDER_RADIUS: number = 20;
const ATOMIC_DIVIDER_HEIGHT: number = 20;
const ICON_WIDTH_AND_HEIGTH: number = 24;
const OPERATION_ITEM1_MARGIN_RIGHT: number = 2;
const OPERATION_ITEM2_MARGIN_LEFT: number = 8;

export interface InputFilterOptions {
  value: ResourceStr,
  error?: Callback<string>
}

export interface SearchButtonParams {
  value: string,
  option?: SearchButtonOptions
}

export interface MenuAlignOption {
  alignType: MenuAlignType,
  offset?: Offset
}

export interface SelectOptions {
  options?: Array<SelectOption>;
  selected?: number;
  value?: string;
  onSelect?: OnSelectCallback;
  controlSize?: ControlSize;
  menuItemContentModifier?: ContentModifier<MenuItemConfiguration>;
  divider?: Optional<DividerOptions> | null;
  font?: Font;
  fontColor?: ResourceColor;
  selectedOptionBgColor?: ResourceColor;
  selectedOptionFont?: Font;
  selectedOptionFontColor?: ResourceColor;
  optionBgColor?: ResourceColor;
  optionFont?: Font;
  optionFontColor?: ResourceColor;
  optionWidth?: Dimension | OptionWidthMode;
  optionHeight?: Dimension;
  space?: Length;
  arrowPosition?: ArrowPosition;
  menuAlign?: MenuAlignOption;
  menuBackgroundColor?: ResourceColor;
  menuBackgroundBlurStyle?: BlurStyle;
}

export interface SearchOptions {
  componentBackgroundColor?: ResourceColor;
  pressedBackgroundColor?: ResourceColor;
  searchButton?: SearchButtonParams;
  placeholderColor?: ResourceColor;
  placeholderFont?: Font;
  textFont?: Font;
  textAlign?: TextAlign;
  copyOption?: CopyOptions;
  searchIcon?: IconOptions | SymbolGlyphModifier;
  cancelIcon?: IconOptions;
  fontColor?: ResourceColor;
  caretStyle?: CaretStyle;
  enableKeyboardOnFocus?: boolean;
  hideSelectionMenu?: boolean;
  avoidKeyboard?: boolean;
  type?: SearchType;
  maxLength?: number;
  enterKeyType?: EnterKeyType;
  decoration?: TextDecorationOptions;
  letterSpacing?: number | string | Resource;
  fontFeature?: string;
  selectedBackgroundColor?: ResourceColor;
  inputFilter?: InputFilterOptions;
  textIndent?: Dimension;
  minFontSize?: number | string | Resource;
  maxFontSize?: number | string | Resource;
  editMenuOptions?: EditMenuOptions;
  enablePreviewText?: boolean;
  enableHapticFeedback?: boolean;
  onSubmit?: Callback<string> | SearchSubmitCallback;
  onChange?: EditableTextOnChangeCallback;
  onCopy?: Callback<string>;
  onCut?: Callback<string>;
  onPaste?: OnPasteCallback;
  onTextSelectionChange?: OnTextSelectionChangeCallback;
  onContentScroll?: OnContentScrollCallback;
  onEditChange?: Callback<boolean>;
  onWillInsert?: Callback<InsertValue, boolean>;
  onDidInsert?: Callback<InsertValue>;
  onWillDelete?: Callback<DeleteValue, boolean>;
  onDidDelete?: Callback<DeleteValue>;
}

export interface OperationOptions {
  auxiliaryItem?: OperationOption;
  independentItem?: OperationOption;
}

@Component
export struct AtomicServiceSearch {
  @State private isFunction1Pressed: boolean = false;
  @State private isFunction2Pressed: boolean = false;
  @State private isSearchPressed: boolean = false;
  @State private showImage: boolean = true;
  @Prop @Watch('onParamsChange') value?: ResourceStr = '';
  @Prop placeholder?: ResourceStr = 'Search';
  @Prop @Watch('onSelectChange') select?: SelectOptions = {};
  @Prop @Watch('onSearchChange') search?: SearchOptions = {
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
  };
  operation?: OperationOptions;
  controller?: SearchController = new SearchController();

  aboutToAppear(): void {
    this.showImage = this.value?.toString().length === 0 ? true : false;
    this.initSelectStyle();
    this.initSearchStyle();
  }

  private onParamsChange(): void {
    this.showImage = this.value?.toString().length === 0 ? true : false;
  }

  private onSelectChange(): void {
    this.initSelectStyle();
  }

  private onSearchChange(): void {
    this.initSearchStyle();
  }

  private initSelectStyle(): void {
    if (typeof this.select !== 'undefined') {
      if (typeof this.select.font === 'undefined') {
        this.select.font = { size: TEXT_SIZE_BODY1 };
      }
      if (typeof this.select.fontColor !== 'undefined') {
        this.select.fontColor = TEXT_COLOR_PRIMARY;
      }
    }
  }

  private initSearchStyle(): void {
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
        }
      }
      if (typeof this.search.pressedBackgroundColor === 'undefined') {
        this.search.pressedBackgroundColor = EFFECT_COLOR;
      }
    }
  }

  @Builder
  renderSelect() {
    if (typeof this.select !== 'undefined' && typeof this.select.options !== 'undefined') {
      Row() {
        Select(this.select?.options)
          .value(this.select?.value)
          .selected(this.select?.selected)
          .onSelect(this.select?.onSelect)
          .controlSize(this.select?.controlSize)
          .menuItemContentModifier(this.select?.menuItemContentModifier)
          .divider(this.select?.divider)
          .font(this.select?.font)
          .fontColor(this.select?.fontColor)
          .selectedOptionBgColor(this.select?.selectedOptionBgColor)
          .selectedOptionFont(this.select?.selectedOptionFont)
          .selectedOptionFontColor(this.select?.selectedOptionFontColor)
          .optionBgColor(this.select?.optionBgColor)
          .optionFont(this.select?.optionFont)
          .optionFontColor(this.select?.optionFontColor)
          .space(this.select?.space)
          .arrowPosition(this.select?.arrowPosition)
          .menuAlign(this.select?.menuAlign?.alignType, this.select?.menuAlign?.offset)
          .optionWidth(this.select?.optionWidth)
          .optionHeight(this.select?.optionHeight)
          .menuBackgroundColor(this.select?.menuBackgroundColor)
          .menuBackgroundBlurStyle(this.select?.menuBackgroundBlurStyle)
          .height(ATOMIC_SELECT_HEIGHT)
          .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
          .constraintSize({ minHeight: ATOMIC_SELECT_HEIGHT })
          .padding({ start: LengthMetrics.vp(SELECT_PADDING_LEFT) })
          .margin({ start: LengthMetrics.vp(SELECT_MARGIN_LEFT) })
          .backgroundColor(Color.Transparent)
      }
      .flexShrink(FLEX_SHRINK)
    }
  }

  @Builder
  renderDivider() {
    if (typeof this.select !== 'undefined' && typeof this.select.options !== 'undefined') {
      Divider()
        .vertical(true)
        .color(Color.Black)
        .height(ATOMIC_DIVIDER_HEIGHT)
        .opacity(DIVIDER_OPACITY)
        .margin({
          start: LengthMetrics.vp(DIVIDER_MARGIN_LEFT),
          end: LengthMetrics.vp(DIVIDER_MARGIN_RIGHT)
        })
    }
  }

  @Builder
  renderSearch() {
    Search({
      value: this.value?.toString(),
      placeholder: this.placeholder,
      controller: this.controller
    })
      .backgroundColor(Color.Transparent)
      .searchButton(this.search?.searchButton?.value, this.search?.searchButton?.option)
      .placeholderColor(this.search?.placeholderColor)
      .placeholderFont(this.search?.placeholderFont)
      .textFont(this.search?.textFont)
      .textAlign(this.search?.textAlign)
      .copyOption(this.search?.copyOption)
      .searchIcon(this.search?.searchIcon)
      .cancelButton({ icon: this.search?.cancelIcon })
      .fontColor(this.search?.fontColor)
      .caretStyle(this.search?.caretStyle)
      .enableKeyboardOnFocus(this.search?.enableKeyboardOnFocus)
      .selectionMenuHidden(this.search?.hideSelectionMenu)
      .customKeyboard(null, { supportAvoidance: this.search?.avoidKeyboard })
      .type(this.search?.type)
      .maxLength(this.search?.maxLength)
      .enterKeyType(this.search?.enterKeyType)
      .decoration(this.search?.decoration)
      .letterSpacing(this.search?.letterSpacing)
      .fontFeature(this.search?.fontFeature)
      .selectedBackgroundColor(this.search?.selectedBackgroundColor)
      .inputFilter(this.search?.inputFilter?.value, this.search?.inputFilter?.error)
      .textIndent(this.search?.textIndent)
      .minFontSize(this.search?.minFontSize)
      .maxFontSize(this.search?.maxFontSize)
      .editMenuOptions(this.search?.editMenuOptions)
      .enablePreviewText(this.search?.enablePreviewText)
      .enableHapticFeedback(this.search?.enableHapticFeedback)
      .placeholderFont(this.search?.placeholderFont)
      .textFont(this.search?.textFont)
      .searchIcon(this.search?.searchIcon)
      .fontColor(this.search?.fontColor)
      .onCut(this.search?.onCut)
      .onCopy(this.search?.onCopy)
      .onPaste(this.search?.onPaste)
      .onSubmit(this.search?.onSubmit)
      .onDidInsert(this.search?.onDidInsert)
      .onDidDelete(this.search?.onDidDelete)
      .onEditChange(this.search?.onEditChange)
      .onWillInsert(this.search?.onWillInsert)
      .onWillDelete(this.search?.onWillDelete)
      .onContentScroll(this.search?.onContentScroll)
      .onTextSelectionChange(this.search?.onTextSelectionChange)
      .onChange((value: string, previewText?: PreviewText) => {
        if (typeof this.search?.onChange !== 'undefined') {
          this.search?.onChange(value, previewText);
        }
        this.value = value;
      })
      .onTouch((event?: TouchEvent) => {
        if (event && event.type === TouchType.Down) {
          this.isSearchPressed = true;
        } else if (event && event.type === TouchType.Up) {
          this.isSearchPressed = false;
        }
      })
  }

  @Builder
  renderAuxiliaryItem() {
    if (typeof this.operation?.auxiliaryItem !== 'undefined' && this.showImage) {
      Row() {
        Image(this.operation?.auxiliaryItem?.value)
          .objectFit(ImageFit.Contain)
          .fillColor(FUNCTION_ICON_COLOR)
          .width(ICON_WIDTH_AND_HEIGTH)
          .height(ICON_WIDTH_AND_HEIGTH)
      }
      .onClick(this.operation?.auxiliaryItem.action)
      .flexShrink(FLEX_SHRINK)
      .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(ATOMIC_SELECT_HEIGHT)
      .height(ATOMIC_SELECT_HEIGHT)
      .margin({ right: OPERATION_ITEM1_MARGIN_RIGHT })
      .backgroundColor(this.isFunction1Pressed ? this.search?.pressedBackgroundColor : Color.Transparent)
      .onTouch((event?: TouchEvent) => {
        if (event && event.type === TouchType.Down) {
          this.isFunction1Pressed = true;
        } else if (event && event.type === TouchType.Up) {
          this.isFunction1Pressed = false;
        }
      })
    }
  }

  @Builder
  renderIndependentItem() {
    if (typeof this.operation?.independentItem !== 'undefined') {
      Row() {
        Image(this.operation?.independentItem.value)
          .objectFit(ImageFit.Contain)
          .fillColor(FUNCTION_ICON_COLOR)
          .width(ICON_WIDTH_AND_HEIGTH)
          .height(ICON_WIDTH_AND_HEIGTH)
      }
      .onClick(this.operation?.independentItem.action)
      .flexShrink(FLEX_SHRINK)
      .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(ATOMIC_SERVICE_SEARCH_HEIGHT)
      .height(ATOMIC_SERVICE_SEARCH_HEIGHT)
      .margin(OPERATION_ITEM2_MARGIN_LEFT)
      .backgroundColor(this.isFunction2Pressed ?
        this.search?.pressedBackgroundColor : this.search?.componentBackgroundColor)
      .onTouch((event?: TouchEvent) => {
        if (event && event.type === TouchType.Down) {
          this.isFunction2Pressed = true;
        } else if (event && event.type === TouchType.Up) {
          this.isFunction2Pressed = false;
        }
      })
    }
  }

  build() {
    Row() {
      Flex({
        direction: FlexDirection.Row,
        alignItems: ItemAlign.Center,
        justifyContent: FlexAlign.Start
      }) {
        Stack() {
          Flex({
            direction: FlexDirection.Row,
            alignItems: ItemAlign.Center,
            justifyContent: FlexAlign.Start
          }) {
            this.renderSelect();
            this.renderDivider();
            this.renderSearch();
          }

          if (typeof this.search?.searchButton === 'undefined') {
            this.renderAuxiliaryItem();
          }
        }
        .alignContent(Alignment.End)
        .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
        .backgroundColor(this.isSearchPressed ?
          this.search?.pressedBackgroundColor : this.search?.componentBackgroundColor)

        this.renderIndependentItem();
      }
    }
    .height(ATOMIC_SERVICE_SEARCH_HEIGHT)
  }
}
