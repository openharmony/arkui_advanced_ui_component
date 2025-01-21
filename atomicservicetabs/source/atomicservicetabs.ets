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
import hilog from '@ohos.hilog';

const DEFAULT_BAR_WIDTH: number = 96;
const DEFAULT_BAR_HEIGHT: number = 48;
const TEXT_WIDTH_HEIGHT_SIZE: number = 24;
const TEXT_FONT_WEIGHT: number = 500;
const TEXT_LIGHT_HEIGHT: number = 14;
const MARGIN_HORIZONTAL_VP: number = 8
const MARGIN_VERTICAL_VP: number = 4;


@Component
export struct AtomicServiceTabs {
  @BuilderParam tabContents?: [TabContentBuilder?,
    TabContentBuilder?,
    TabContentBuilder?,
    TabContentBuilder?,
    TabContentBuilder?];
  @Prop tabBarOptionsArray: [TabBarOptions, TabBarOptions, TabBarOptions?, TabBarOptions?, TabBarOptions?];
  @Prop @Watch('tabBarPositionWatch') tabBarPosition?: TabBarPosition = TabBarPosition.BOTTOM;
  @Prop barBackgroundColor?: ResourceColor = Color.Transparent;
  @Prop index?: number | undefined = 0;
  @Prop barOverlap?: boolean = true;
  @Prop @Watch('layoutModeWatch') layoutMode?: LayoutMode = LayoutMode.VERTICAL;
  controller?: TabsController = new TabsController();
  onChange?: Callback<number>;
  onTabBarClick?: Callback<number>;
  onContentWillChange?: OnContentWillChangeCallback;
  @State private selectedIndex: number = 0;
  @State private isHorizontal: boolean = false;
  @State private barModeStatus: BarMode = BarMode.Fixed;
  @State private textMarginTop?: number = undefined;
  @State private textMarginLeft?: number = undefined;
  @State private tabMargin?: number = undefined;
  @State private tabPadding?: number = MARGIN_VERTICAL_VP;
  @State private barHeight?: Length = undefined;
  private isIconAndText: boolean = false;
  private isListener: boolean = false;
  private isFold: boolean = false;
  listener: mediaquery.MediaQueryListener =
    this.getUIContext().getMediaQuery().matchMediaSync('(orientation: landscape)');

  aboutToAppear(): void {
    this.initBarModeAndHeight();
    if (this.isIconAndText && this.layoutMode === LayoutMode.AUTO && this.tabBarPosition === TabBarPosition.BOTTOM) {
      this.isListener = true;
      this.startListener();
    }
  }

  aboutToDisappear(): void {
    if (this.isListener) {
      this.listener.off('change');
      if (this.isFold) {
        display.off('foldDisplayModeChange');
      }
    }
  }

  tabBarPositionWatch(): void {
    if (this.tabBarPosition === TabBarPosition.BOTTOM) {
      this.barModeStatus = BarMode.Fixed;
      this.barHeight = undefined;
    } else {
      this.barModeStatus = BarMode.Scrollable;
      this.barHeight = (50 / this.tabBarOptionsArray.length + '%');
    }
    this.buildTab();
  }

  layoutModeWatch(): void {
    if (this.layoutMode === LayoutMode.AUTO) {
      this.initLayoutStatus();
    } else {
      this.isHorizontal = (this.layoutMode === LayoutMode.HORIZONTAL) ? true : false;
      this.buildTab();
    }
  }

  initBarModeAndHeight(): void {
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

  startListener(): void {
    try {
      this.isFold = canIUse('SystemCapability.Window.SessionManager') ? display.isFoldable() : false;
      if (this.isFold) {
        display.on('foldDisplayModeChange', (data: display.FoldDisplayMode) => {
          this.initLayoutStatus();
        });
      }
    } catch (err) {
      hilog.error(0x0000, 'AtomicServiceTabs', 'fail to get display isFoldable', JSON.stringify(err));
    }
    this.listener.on('change', (mediaQueryResult: mediaquery.MediaQueryResult) => {
      this.initLayoutStatus();
    });
  }

  initLayoutStatus(): void {
    const screenWidth = px2vp(display.getDefaultDisplaySync().width);
    const widthFlag = screenWidth / this.tabBarOptionsArray.length > 104 ? true : false;
    this.isHorizontal = widthFlag ? true : false;
    this.buildTab();
  }

  buildTab(): void {
    if (this.isIconAndText) {
      this.textMarginTop = this.isHorizontal ? undefined : MARGIN_VERTICAL_VP;
      this.textMarginLeft = this.isHorizontal ? MARGIN_HORIZONTAL_VP : undefined;
      this.tabPadding = this.isHorizontal ? undefined : MARGIN_VERTICAL_VP;
      this.tabMargin = this.isHorizontal ? MARGIN_HORIZONTAL_VP : undefined;
    }
  }

  getFontSize(): Resource {
    return this.isHorizontal ? $r('sys.float.ohos_id_text_size_button3') :
      (this.isIconAndText ? $r('sys.float.ohos_id_text_size_caption') :
      $r('sys.float.ohos_id_text_size_button3'));
  }

  @Builder
  TabBuilder(item: TabBarOptions, index: number, flex: FlexDirection) {
    Flex({
      direction: flex,
      alignItems: ItemAlign.Center,
      justifyContent: FlexAlign.Center
    }) {
      if (item.icon) {
        Image(item.icon as ResourceStr)
          .width(TEXT_WIDTH_HEIGHT_SIZE)
          .height(TEXT_WIDTH_HEIGHT_SIZE)
          .objectFit(ImageFit.Contain)
          .fillColor(this.selectedIndex === index ? item.selectedColor : item.unselectedColor)
          .backgroundColor(Color.Transparent)
          .flexShrink(0)
      }
      if (item.text) {
        Text(item.text)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .maxLines(1)
          .fontColor(this.selectedIndex === index ? item.selectedColor : item.unselectedColor)
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
            this.isHorizontal ? this.TabBuilder(item, index, FlexDirection.Row) :
            this.TabBuilder(item, index, FlexDirection.Column)
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