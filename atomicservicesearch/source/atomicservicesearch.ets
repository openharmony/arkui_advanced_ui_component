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
import { LengthMetrics, SelectOptions, OperationOption } from '@kit.ArkUI';

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
const DIVIDER_OPACITY: number = 0.6;
const DIVIDER_MARGIN_LEFT: number = 2;
const DIVIDER_MARGIN_RIGHT: number = -2;
const ATOMIC_SERVICE_SEARCH_HEIGHT: number = 40;
const ATMOIC_SELECT_HEIGHT: number = 36;
const ATOMIC_SELECT_BORDER_RADIUS: number = 20;
const ATOMIC_DIVIDER_HEIGHT: number = 20;
const ICON_WIDTH_AND_HEIGTH: number = 24;
const OPERATION_ITEM1_MARGIN_RIGHT: number = 2;
const OPERATION_ITEM2_MARGIN_LEFT: number = 8;

interface InputFilterOptions {
  value: ResourceStr,
  error?: Callback<string>
}

interface SearchButtonParams {
  value: string,
  option?: SearchButtonOptions
}

interface MenuAlignOption {
  alignType: MenuAlignType,
  offset?: Offset
}

interface SelectStyles {
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

interface SearchEvents {
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

interface SearchStyle {
  componentBackgroundColor?: ResourceColor;
  pressBackgroundColor?: ResourceColor;
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
  selectionMenuHidden?: boolean;
  keyboardAvoidance?: boolean;
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
}

@Component
export struct AtomicServiceSearch {
  @State private isFunction1Pressed: boolean = false;
  @State private isFunction2Pressed: boolean = false;
  @State private isSearchPressed: boolean = false;
  @State private showImage: boolean = true;
  @Prop @Watch('onParamsChange') value: string = '';
  @Prop placeholder?: ResourceStr = 'Search';
  controller: SearchController = new SearchController();
  selectItems?: SelectOptions;
  @Prop selectStyle?: SelectStyles = {
    font:{
      size: TEXT_SIZE_BODY1,
    },
    fontColor: TEXT_COLOR_PRIMARY
  };
  searchEvents?: SearchEvents;
  @Prop searchStyle?: SearchStyle = {
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
  };
  operationItem1?: OperationOption;
  operationItem2?: OperationOption;

  aboutToAppear(): void {
    this.showImage = this.value.length === 0 ? true : false;
    this.initSelectStyle();
    this.initSearchStyle();
  }

  private initSelectStyle(): void {
    if (typeof this.selectStyle !== 'undefined') {
      if (typeof this.selectStyle.font === 'undefined') {
        this.selectStyle.font =  { size: TEXT_SIZE_BODY1 };
      }
      if (typeof this.selectStyle.fontColor !== 'undefined') {
        this.selectStyle.fontColor = TEXT_COLOR_PRIMARY;
      }
    }

  }

  private initSearchStyle() : void {
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
        }
      }
      if (typeof this.searchStyle.pressBackgroundColor === 'undefined') {
        this.searchStyle.pressBackgroundColor = EFFECT_COLOR;
      }
    }
  }

  private onParamsChange(): void {
    this.showImage = this.value.length === 0 ? true : false;
  }

  @Builder
  renderSelect() {
    if (typeof this.selectItems !== 'undefined' && this.selectItems.options.length !== 0) {
      Row() {
        Select(this.selectItems?.options)
          .value(this.selectItems?.value)
          .selected(this.selectItems?.selected)
          .onSelect(this.selectItems?.onSelect)
          .controlSize(this.selectStyle?.controlSize)
          .menuItemContentModifier(this.selectStyle?.menuItemContentModifier)
          .divider(this.selectStyle?.divider)
          .font(this.selectStyle?.font)
          .fontColor(this.selectStyle?.fontColor)
          .selectedOptionBgColor(this.selectStyle?.selectedOptionBgColor)
          .selectedOptionFont(this.selectStyle?.selectedOptionFont)
          .selectedOptionFontColor(this.selectStyle?.selectedOptionFontColor)
          .optionBgColor(this.selectStyle?.optionBgColor)
          .optionFont(this.selectStyle?.optionFont)
          .optionFontColor(this.selectStyle?.optionFontColor)
          .space(this.selectStyle?.space)
          .arrowPosition(this.selectStyle?.arrowPosition)
          .menuAlign(this.selectStyle?.menuAlign?.alignType, this.selectStyle?.menuAlign?.offset)
          .optionWidth(this.selectStyle?.optionWidth)
          .optionHeight(this.selectStyle?.optionHeight)
          .menuBackgroundColor(this.selectStyle?.menuBackgroundColor)
          .menuBackgroundBlurStyle(this.selectStyle?.menuBackgroundBlurStyle)
          .height(ATMOIC_SELECT_HEIGHT)
          .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
          .constraintSize({ minHeight: ATMOIC_SELECT_HEIGHT })
          .padding({ start: LengthMetrics.vp(SELECT_PADDING_LEFT) })
          .margin({ start: LengthMetrics.vp(SELECT_MARGIN_LEFT) })
          .backgroundColor(Color.Transparent)
      }
      .flexShrink(FLEX_SHRINK)
    }
  }

  @Builder
  renderDivider() {
    if (typeof this.selectItems !== 'undefined' && this.selectItems.options.length !== 0) {
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
      value: this.value,
      placeholder: this.placeholder,
      controller: this.controller
    })
      .backgroundColor(Color.Transparent)
      .searchButton(this.searchStyle?.searchButton?.value, this.searchStyle?.searchButton?.option)
      .placeholderColor(this.searchStyle?.placeholderColor)
      .placeholderFont(this.searchStyle?.placeholderFont)
      .textFont(this.searchStyle?.textFont)
      .textAlign(this.searchStyle?.textAlign)
      .copyOption(this.searchStyle?.copyOption)
      .searchIcon(this.searchStyle?.searchIcon)
      .cancelButton({icon: this.searchStyle?.cancelIcon})
      .fontColor(this.searchStyle?.fontColor)
      .caretStyle(this.searchStyle?.caretStyle)
      .enableKeyboardOnFocus(this.searchStyle?.enableKeyboardOnFocus)
      .selectionMenuHidden(this.searchStyle?.selectionMenuHidden)
      .customKeyboard(null, {supportAvoidance: this.searchStyle?.keyboardAvoidance})
      .type(this.searchStyle?.type)
      .maxLength(this.searchStyle?.maxLength)
      .enterKeyType(this.searchStyle?.enterKeyType)
      .decoration(this.searchStyle?.decoration)
      .letterSpacing(this.searchStyle?.letterSpacing)
      .fontFeature(this.searchStyle?.fontFeature)
      .selectedBackgroundColor(this.searchStyle?.selectedBackgroundColor)
      .inputFilter(this.searchStyle?.inputFilter?.value, this.searchStyle?.inputFilter?.error)
      .textIndent(this.searchStyle?.textIndent)
      .minFontSize(this.searchStyle?.minFontSize)
      .maxFontSize(this.searchStyle?.maxFontSize)
      .editMenuOptions(this.searchStyle?.editMenuOptions)
      .enablePreviewText(this.searchStyle?.enablePreviewText)
      .enableHapticFeedback(this.searchStyle?.enableHapticFeedback)
      .placeholderFont(this.searchStyle?.placeholderFont)
      .textFont(this.searchStyle?.textFont)
      .searchIcon(this.searchStyle?.searchIcon)
      .fontColor(this.searchStyle?.fontColor)
      .onCut(this.searchEvents?.onCut)
      .onCopy(this.searchEvents?.onCopy)
      .onPaste(this.searchEvents?.onPaste)
      .onSubmit(this.searchEvents?.onSubmit)
      .onDidInsert(this.searchEvents?.onDidInsert)
      .onDidDelete(this.searchEvents?.onDidDelete)
      .onEditChange(this.searchEvents?.onEditChange)
      .onWillInsert(this.searchEvents?.onWillInsert)
      .onWillDelete(this.searchEvents?.onWillDelete)
      .onContentScroll(this.searchEvents?.onContentScroll)
      .onTextSelectionChange(this.searchEvents?.onTextSelectionChange)
      .onChange((value: string, previewText?: PreviewText) => {
        if (typeof this.searchEvents?.onChange !== 'undefined') {
          this.searchEvents?.onChange(value, previewText);
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
  renderOperationItem1() {
    if (typeof this.operationItem1 !== 'undefined' && this.showImage) {
      Row() {
        Image(this.operationItem1?.value)
          .objectFit(ImageFit.Contain)
          .fillColor(FUNCTION_ICON_COLOR)
          .width(ICON_WIDTH_AND_HEIGTH)
          .height(ICON_WIDTH_AND_HEIGTH)
      }
      .onClick(this.operationItem1?.action)
      .flexShrink(FLEX_SHRINK)
      .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(ATMOIC_SELECT_HEIGHT)
      .height(ATMOIC_SELECT_HEIGHT)
      .margin({ right: OPERATION_ITEM1_MARGIN_RIGHT })
      .backgroundColor(this.isFunction1Pressed ? this.searchStyle?.pressBackgroundColor : Color.Transparent)
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
  renderOperationItem2() {
    if (typeof this.operationItem2 !== 'undefined') {
      Row() {
        Image(this.operationItem2?.value)
          .objectFit(ImageFit.Contain)
          .fillColor(FUNCTION_ICON_COLOR)
          .width(ICON_WIDTH_AND_HEIGTH)
          .height(ICON_WIDTH_AND_HEIGTH)
      }
      .onClick(this.operationItem2?.action)
      .flexShrink(FLEX_SHRINK)
      .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(ATOMIC_SERVICE_SEARCH_HEIGHT)
      .height(ATOMIC_SERVICE_SEARCH_HEIGHT)
      .margin(OPERATION_ITEM2_MARGIN_LEFT)
      .backgroundColor(this.isFunction2Pressed ? this.searchStyle?.pressBackgroundColor :
        this.searchStyle?.componentBackgroundColor)
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
          }){
            this.renderSelect();
            this.renderDivider();
            this.renderSearch();
          }
          if (typeof this.searchStyle?.searchButton === 'undefined') {
            this.renderOperationItem1();
          }
        }
        .alignContent(Alignment.End)
        .borderRadius(ATOMIC_SELECT_BORDER_RADIUS)
        .backgroundColor(this.isSearchPressed ?
          this.searchStyle?.pressBackgroundColor : this.searchStyle?.componentBackgroundColor)

        this.renderOperationItem2();
      }
    }
    .height(ATOMIC_SERVICE_SEARCH_HEIGHT)
  }

}
