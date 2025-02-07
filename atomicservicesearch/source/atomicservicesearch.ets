​/*
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
 
import { OperationType, SelectOptions, OperationOption } from '@ohos.arkui.advanced.SubHeader';
import { LengthMetrics } from '@kit.ArkUI';

const TEXT_SIZE_BODY1: Resource = $r(`sys.float.ohos_id_text_size_body1`);
const TEXT_COLOR_SECONDARY = $r(`sys.color.ohos_id_color_text_secondary`);
const ICON_COLOR_SECONDARY = $r('sys.color.ohos_id_color_secondary');
const TEXT_BOX_COLOR = $r(`sys.color.ohos_id_color_text_field_sub_bg`);
const TEXT_COLOR_PRIMARY = $r(`sys.color.ohos_id_color_text_primary`);
const FUNCTION_ICON_COLOR = $r(`sys.color.ohos_id_color_primary`);
const EFFECT_COLOR = $r(`sys.color.ohos_id_color_click_effect`);
const FONT_WEIGHT_PRIMARY: number = 500;
const FONT_WEIGHT_DEFAULT: number = 400;
const FONT_SIZE: number = 16;
const MENU_ALIGN_TYPE_START_X: number = 0;
const MENU_ALIGN_TYPE_START_Y: number = 0;
const SELECT_CONSTRAINT_SIZE_MIN_HEIGHT: number = 36;
const SELECT_HEIGHT: number = 36;
const SELECT_PADDING_LEFT: number = 6;
const SELECT_MARGIN_LEFT: number = 2;
const SELECT_SPACE: number = 2;
const DIVIDER_HEIGHT: number = 20;
const DIVIDER_OPACITY: number = 0.6;
const DIVIDER_MARGIN_LEFT: number = 2;
const DIVIDER_MARGIN_RIGHT: number = -2;
const FUNCTION_ICON_WIDTH_HEIGHT: number = 24;
const INDEPENDENT_FUNCTION_POSITION_OFFSET: number = 0;
const FUNCTION_POSITION_OFFSET: number = 2;
const INDEPENDENT_FUNCTION_WIDTH_HEIGHT: number = 40;
const FUNCTION_WIDTH_HEIGHT: number = 36;
const FLEX_SHRINK: number = 0;
const INDEPENDENT_FUNCTION_MARGIN: number = 0;
const FUNCTION_MARGIN_LEFT: number = 8;
const FUNCTION_MARGIN_RIGHT: number = 0;
const BORDER_RADIUS: number = 20;
const SEARCH_HEIGHT: number = 40;

export interface OnSearchEvent {
  onSubmit?: (value: string) => void;
  onChange?: EditableTextOnChangeCallback;
  onCopy?: (value: string) => void;
  onCut?: (value: string) => void;
  onPaste?: (value: string, event: PasteEvent) => void;
  onTextSelectionChange?: (selectionStart: number, selectionEnd: number) => void;
  onContentScroll?: (totalOffsetX: number, totalOffsetY: number) => void;
  onEditChange?: Callback<boolean>;
  onWillInsert?: Callback<InsertValue, boolean>;
  onDidInsert?: Callback<InsertValue>;
  onWillDelete?: Callback<DeleteValue, boolean>;
  onDidDelete?: Callback<DeleteValue>;
}

@Component
export struct AtomicServiceSearch {
  @Watch('onParamsChange') @Prop changeValue: string = '';
  @State private isFunction1Pressed: boolean = false;
  @State private isFunction2Pressed: boolean = false;
  @State private isSearchPressed: boolean = false;
  @State private showImage: boolean = true;
  @Prop hint?: ResourceStr = 'Search';
  @Prop operationType?: OperationType = OperationType.BUTTON;
  private controller: SearchController = new SearchController();
  operationItem?: Array<OperationOption>;
  select?: SelectOptions;
  onSearch?: OnSearchEvent;

  private onParamsChange(): void {
    this.showImage = this.changeValue.length === 0 ? true : false;
  }

  @Builder
  renderSearch() {
    Search({ value: this.changeValue, placeholder: this.hint, controller: this.controller })
      .backgroundColor(Color.Transparent)
      .placeholderFont({ size: TEXT_SIZE_BODY1, weight: FONT_WEIGHT_DEFAULT })
      .textFont({ size: TEXT_SIZE_BODY1, weight: FONT_WEIGHT_DEFAULT })
      .fontColor(TEXT_COLOR_SECONDARY)
      .searchIcon({ color: ICON_COLOR_SECONDARY })
      .onSubmit(this.onSearch?.onSubmit)
      .onChange((value: string, previewText?: PreviewText) => {
        if (typeof this.onSearch?.onChange !== 'undefined') {
          this.onSearch?.onChange(value, previewText);
        }
        this.changeValue = value;
      })
      .onCopy(this.onSearch?.onCopy)
      .onCut(this.onSearch?.onCut)
      .onPaste(this.onSearch?.onPaste)
      .onTextSelectionChange(this.onSearch?.onTextSelectionChange)
      .onContentScroll(this.onSearch?.onContentScroll)
      .onEditChange(this.onSearch?.onEditChange)
      .onWillInsert(this.onSearch?.onWillInsert)
      .onDidInsert(this.onSearch?.onDidInsert)
      .onWillDelete(this.onSearch?.onWillDelete)
      .onDidDelete(this.onSearch?.onDidDelete)
      .onTouch((event?: TouchEvent) => {
        if (event && event.type === TouchType.Down) {
          this.isSearchPressed = true;
        } else if (event && event.type === TouchType.Up) {
          this.isSearchPressed = false;
        }
      })
  }

  @Builder
  renderSelect() {
    if (typeof this.select !== 'undefined' && this.select.options.length !== 0) {
      Row() {
        Select(this.select?.options)
          .value(this.select?.value)
          .selected(this.select?.selected)
          .onSelect(this.select?.onSelect)
          .font({ size: TEXT_SIZE_BODY1, weight: FONT_WEIGHT_PRIMARY })
          .fontColor(TEXT_COLOR_PRIMARY)
          .selectedOptionFont({ size: FONT_SIZE, weight: FONT_WEIGHT_DEFAULT })
          .menuAlign(MenuAlignType.START, { dx: MENU_ALIGN_TYPE_START_X, dy: MENU_ALIGN_TYPE_START_Y })
          .optionFont({ size: FONT_SIZE, weight: FONT_WEIGHT_DEFAULT })
          .backgroundColor(Color.Transparent)
          .arrowPosition(ArrowPosition.END)
          .constraintSize({ minHeight: SELECT_CONSTRAINT_SIZE_MIN_HEIGHT })
          .padding({ start: LengthMetrics.vp(SELECT_PADDING_LEFT) })
          .margin({ start: LengthMetrics.vp(SELECT_MARGIN_LEFT) })
          .height(SELECT_HEIGHT)
          .space(SELECT_SPACE)
        this.renderDivider();
      }
      .flexShrink(FLEX_SHRINK)
    }
  }

  @Builder
  renderDivider() {
    Divider()
      .vertical(true)
      .height(DIVIDER_HEIGHT)
      .color(Color.Black)
      .opacity(DIVIDER_OPACITY)
      .margin({
        start: LengthMetrics.vp(DIVIDER_MARGIN_LEFT),
        end: LengthMetrics.vp(DIVIDER_MARGIN_RIGHT)
      })
  }

  @Builder
  renderFunction(item: OperationOption, independentOrNot: boolean) {
    Row() {
      Image(item.value)
        .width(FUNCTION_ICON_WIDTH_HEIGHT)
        .height(FUNCTION_ICON_WIDTH_HEIGHT)
        .fillColor(FUNCTION_ICON_COLOR)
        .objectFit(ImageFit.Contain)
    }
    .position(independentOrNot ?
      {
        top: LengthMetrics.vp(INDEPENDENT_FUNCTION_POSITION_OFFSET),
        end: LengthMetrics.vp(INDEPENDENT_FUNCTION_POSITION_OFFSET)
      } :
      { top: LengthMetrics.vp(FUNCTION_POSITION_OFFSET), end: LengthMetrics.vp(FUNCTION_POSITION_OFFSET) })
    .width(independentOrNot ? INDEPENDENT_FUNCTION_WIDTH_HEIGHT : FUNCTION_WIDTH_HEIGHT)
    .height(independentOrNot ? INDEPENDENT_FUNCTION_WIDTH_HEIGHT : FUNCTION_WIDTH_HEIGHT)
    .flexShrink(FLEX_SHRINK)
    .borderRadius(BORDER_RADIUS)
    .onClick(item.action)
    .alignItems(VerticalAlign.Center)
    .justifyContent(FlexAlign.Center)
    .margin(independentOrNot ?
      {
        start: LengthMetrics.vp(INDEPENDENT_FUNCTION_MARGIN),
      } :
      {
        start: LengthMetrics.vp(FUNCTION_MARGIN_LEFT),
        end: LengthMetrics.vp(FUNCTION_MARGIN_RIGHT)
      })
    .backgroundColor(independentOrNot ?
      (this.isFunction2Pressed ? EFFECT_COLOR : Color.Transparent) :
      (this.isFunction1Pressed ? EFFECT_COLOR : Color.Transparent)
    )
    .onTouch((event?: TouchEvent) => {
      if (event && event.type === TouchType.Down) {
        if (independentOrNot) {
          this.isFunction2Pressed = true;
        } else {
          this.isFunction1Pressed = true;
        }
      } else if (event && event.type === TouchType.Up) {
        if (independentOrNot) {
          this.isFunction2Pressed = false;
        } else {
          this.isFunction1Pressed = false;
        }
      }
    })
  }

  build() {
    Row() {
      Flex({
        direction: FlexDirection.Row,
        alignItems: ItemAlign.Center,
        justifyContent: FlexAlign.Start
      }) {
        if (typeof this.operationItem === 'undefined' || this.operationItem?.length === 0) {
          this.renderSelect();
          this.renderSearch();
        } else if (this.operationItem?.length === 1) {
          this.renderSelect();
          Stack() {
            this.renderSearch();
            if (this.showImage) {
              this.renderFunction(this.operationItem[0], false);
            }
          }
        } else if (this.operationItem?.length >= 2) {
          Flex({
            direction: FlexDirection.Row,
            alignItems: ItemAlign.Center,
            justifyContent: FlexAlign.SpaceBetween
          }) {
            this.renderSelect();
            Stack() {
              this.renderSearch();
              if (this.showImage) {
                this.renderFunction(this.operationItem[0], false);
              }
            }
          }
          .height(SEARCH_HEIGHT)
          .borderRadius(BORDER_RADIUS)
          .backgroundColor(this.isSearchPressed ? EFFECT_COLOR : TEXT_BOX_COLOR)

          Row() {
            this.renderFunction(this.operationItem[1], true);
          }
          .width(INDEPENDENT_FUNCTION_WIDTH_HEIGHT)
          .height(INDEPENDENT_FUNCTION_WIDTH_HEIGHT)
          .flexShrink(FLEX_SHRINK)
          .borderRadius(BORDER_RADIUS)
          .margin({ start: LengthMetrics.vp(FUNCTION_MARGIN_LEFT) })
          .backgroundColor(TEXT_BOX_COLOR)
        }
      }
      .height(SEARCH_HEIGHT)
      .borderRadius(BORDER_RADIUS)
      .backgroundColor((typeof this.operationItem !== 'undefined' && this.operationItem?.length >= 2) ?
      Color.Transparent : (this.isSearchPressed ? EFFECT_COLOR : TEXT_BOX_COLOR))
    }
  }
}
