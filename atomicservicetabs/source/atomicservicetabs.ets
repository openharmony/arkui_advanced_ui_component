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
import { display, mediaquery } from "@kit.ArkUI";

const DEFAULT_BAR_WIDTH: number = 96;
const DEFAULT_BAR_HEIGHT: number = 48;
const TEXT_WIDTH_HEIGHT_SIZE: number = 24;
const TEXT_FONT_WEIGHT: number = 500;
const TEXT_LIGHT_HEIGHT: number = 14;
const MARGIN_HORIZONTAL_VP: number = 8
const MARGIN_VERTICAL_VP: number = 4;
const TEXT_SELECTED_COLOR: ResourceColor = $r('sys.color.ohos_id_color_bottom_tab_text_on');
const TEXT_UNSELECTED_COLOR: ResourceColor = $r('sys.color.ohos_id_color_bottom_tab_text_off');
const ICON_SELECTED_COLOR: ResourceColor = $r('sys.color.ohos_id_color_bottom_tab_icon');
const ICON_UNSELECTED_COLOR: ResourceColor = $r('sys.color.ohos_id_color_bottom_tab_icon_off');

@Component
export struct AtomicServiceTabs {
  @BuilderParam tabContents?: [TabContentBuilder?,
    TabContentBuilder?,
    TabContentBuilder?,
    TabContentBuilder?,
    TabContentBuilder?];
  @Prop tabBarOptionsArray: [TabBarOptions, TabBarOptions, TabBarOptions?, TabBarOptions?, TabBarOptions?];
  @Prop tabBarPosition?: TabBarPosition = TabBarPosition.BOTTOM;
  @Prop barBackgroundColor?: ResourceColor = Color.Transparent;
  @Prop index?: number | undefined = 0;
  @Prop barOverlap?: boolean = true;
  @Prop layoutMode?: LayoutMode = LayoutMode.VERTICAL;
  controller?: TabsController = new TabsController();
  onChange?: Callback<number>;
  onTabBarClick?: Callback<number>;
  onContentWillChange?: OnContentWillChangeCallback;
  @State selectedIndex: number = 0;
  @State layoutModelStatue: boolean = false;
  @State widthFlag: boolean = false;
  @State landStatus: boolean = false;
  @State barHeight?: Length = undefined;
  @State barModeStatus: BarMode = BarMode.Fixed;
  @State iconTextStatus: boolean = false;
  @State directionStatus: FlexDirection = FlexDirection.Column;
  @State textMarginTop?: number = undefined;
  @State textMarginLeft?: number = undefined;
  @State tabMargin?: number = undefined;
  @State tabPadding?: number = MARGIN_VERTICAL_VP;
  listener: mediaquery.MediaQueryListener =
    this.getUIContext().getMediaQuery().matchMediaSync('(orientation: landscape)');

  aboutToAppear() {
    this.initBarWidthAndHeight()
    if (this.iconTextStatus && this.layoutMode === LayoutMode.AUTO && this.tabBarPosition === TabBarPosition.BOTTOM) {
      this.landStatus = this.listener.matches;
      this.foldListener();
      this.startListener();
    }
  }

  aboutToDisappear(): void {
    this.listener.off('change');
    display.off('foldDisplayModeChange');
  }

  initBarWidthAndHeight() {
    this.layoutModelStatue = (this.layoutMode === LayoutMode.HORIZONTAL) ? true : false;
    if (this.tabBarOptionsArray[0].icon && this.tabBarOptionsArray[0].text) {
      this.iconTextStatus = true;
    }
    if (this.tabBarPosition === TabBarPosition.LEFT) {
      this.barModeStatus = BarMode.Scrollable;
      this.barHeight = (50 / this.tabBarOptionsArray.length + '%');
    }
    this.buildTab();
  }

  getScreenInfo() {
    const screenWidth = px2vp(display.getDefaultDisplaySync().width);
    this.widthFlag = screenWidth / this.tabBarOptionsArray.length > 104 ? true : false;
  }

  foldListener() {
    if (display.isFoldable()) {
      display.on('foldDisplayModeChange', (data: display.FoldDisplayMode) => {
        this.getScreenInfo();
        this.initLayoutStatus();
      });
    }
  }

  startListener() {
    this.listener.on('change', (mediaQueryResult: mediaquery.MediaQueryResult) => {
      this.landStatus = mediaQueryResult.matches;
      this.getScreenInfo();
      this.initLayoutStatus();
    });
  }

  initLayoutStatus() {
    this.layoutModelStatue = (this.landStatus || this.widthFlag) ? true : false;
    this.buildTab();
  }

  buildTab() {
    this.directionStatus = this.layoutModelStatue ? FlexDirection.Row : FlexDirection.Column;
    if (this.iconTextStatus) {
      this.textMarginTop = this.layoutModelStatue ? undefined : MARGIN_VERTICAL_VP;
      this.textMarginLeft = this.layoutModelStatue ? MARGIN_HORIZONTAL_VP : undefined;
      this.tabPadding = this.layoutModelStatue ? undefined : MARGIN_VERTICAL_VP;
      this.tabMargin = this.layoutModelStatue ? MARGIN_HORIZONTAL_VP : undefined;
    }
  }

  getColor(userColor: ResourceColor, defaultColor: ResourceColor): ResourceColor {
    return userColor ? userColor : defaultColor;
  }

  getFontSize(): Resource {
    return this.layoutModelStatue ? $r('sys.float.ohos_id_text_size_button3') :
      (this.iconTextStatus ? $r('sys.float.ohos_id_text_size_caption') :
      $r('sys.float.ohos_id_text_size_button3'));
  }

  @Builder
  TabBuilder(item: TabBarOptions, index: number) {
    Flex({
      direction: this.directionStatus,
      alignItems: ItemAlign.Center,
      justifyContent: FlexAlign.Center
    }) {
      if (item.icon) {
        Image(item.icon as ResourceStr)
          .width(TEXT_WIDTH_HEIGHT_SIZE)
          .height(TEXT_WIDTH_HEIGHT_SIZE)
          .objectFit(ImageFit.Contain)
          .fillColor(this.selectedIndex === index ? this.getColor(item.selectedColor, ICON_SELECTED_COLOR)
            : this.getColor(item.unselectedColor, ICON_UNSELECTED_COLOR))
          .backgroundColor(Color.Transparent)
          .flexShrink(0)
      }
      if (item.text) {
        Text(item.text)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .maxLines(1)
          .fontColor(this.selectedIndex === index ? this.getColor(item.selectedColor, TEXT_SELECTED_COLOR)
            : this.getColor(item.unselectedColor, TEXT_UNSELECTED_COLOR))
          .maxFontSize(this.getFontSize())
          .minFontSize(9)
          .fontWeight(TEXT_FONT_WEIGHT)
          .lineHeight(TEXT_LIGHT_HEIGHT)
          .textAlign(TextAlign.Center)
          .focusOnTouch(true)
          .backgroundColor(Color.Transparent)
          .margin({
            top: this.textMarginTop,
            left: this.textMarginLeft
          })
      }
    }
    .padding({ left: this.tabPadding, right: this.tabPadding })
    .margin({ left: this.tabMargin, right: this.tabMargin })
    .height(this.barHeight)
  }

  build() {
    Tabs({
      barPosition: this.tabBarPosition === TabBarPosition.LEFT ? BarPosition.Start : BarPosition.End,
      index: this.index,
      controller: this.controller
    }) {
      ForEach(this.tabBarOptionsArray, (item: TabBarOptions, index: number) => {
        if (item) {
          TabContent() {
            if (this.tabContents && this.tabContents[index]) {
              this.tabContents[index]?.()
            }
          }
          .tabBar(
            this.TabBuilder(item, index)
          )
          .width((!this.tabContents && this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%')
          .height((!this.tabContents && this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%')
        }
      })
    }
    .safeAreaPadding({
      bottom: 0
    })
    .animationDuration(0)
    .barBackgroundColor(this.barBackgroundColor)
    .divider(null)
    .barMode(this.barModeStatus)
    .vertical(this.tabBarPosition === TabBarPosition.LEFT ? true : false)
    .scrollable(false)
    .barOverlap(this.barOverlap)
    .barBackgroundBlurStyle(BlurStyle.COMPONENT_THICK)
    .onChange((index: number) => {
      if (this.onChange) {
        this.onChange(index);
      }
      this.selectedIndex = index;
    })
    .onTabBarClick(this.onTabBarClick)
    .onContentWillChange(this.onContentWillChange)
    .barWidth((this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%')
    .barHeight((this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%')
    .width((!this.tabContents && this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%')
    .height((!this.tabContents && this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%')
  }
}

export class TabBarOptions {
  public icon: ResourceStr | TabBarSymbol;
  public text: ResourceStr;
  public unselectedColor?: ResourceColor;
  public selectedColor?: ResourceColor;

  constructor(icon: ResourceStr | TabBarSymbol, text: ResourceStr,
              unselectedColor?: ResourceColor, selectedColor?: ResourceColor) {
    this.icon = icon;
    this.text = text;
    this.unselectedColor = unselectedColor;
    this.selectedColor = selectedColor;
  }
}

export enum TabBarPosition {
  LEFT = 0,
  BOTTOM = 1
}

export type TabContentBuilder = () => void;
export type OnContentWillChangeCallback = (currentIndex: number, comingIndex: number) => boolean;