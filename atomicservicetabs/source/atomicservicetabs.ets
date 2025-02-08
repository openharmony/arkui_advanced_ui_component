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

const DEFAULT_BAR_WIDTH: number = 96;
const DEFAULT_BAR_HEIGHT: number = 48;
const TEXT_WIDTH_HEIGHT_SIZE: number = 24;
const TEXT_FONT_WEIGHT: number = 500;
const TEXT_LIGHT_HEIGHT: number = 14;

@Component
export struct AtomicServiceTabs {
  @BuilderParam tabContents?: [TabContentBuilder?,
                              TabContentBuilder?,
                              TabContentBuilder?,
                              TabContentBuilder?,
                              TabContentBuilder?];
  @Prop tabBarOptionsArray: [TabBarOptions, TabBarOptions, TabBarOptions?, TabBarOptions?, TabBarOptions?];
  @Prop @Watch('barPositionChangeBySingleMode') tabBarPosition?: TabBarPosition = TabBarPosition.BOTTOM;
  @Prop barBackgroundColor?: ResourceColor = Color.Transparent;
  @Prop index?: number | undefined = 0;
  @Prop barOverlap?: boolean = true;
  @Prop layoutMode?: LayoutMode = LayoutMode.VERTICAL;
  controller?: TabsController = new TabsController();
  onChange?: Callback<number>;
  onTabBarClick?: Callback<number>;
  onContentWillChange?: OnContentWillChangeCallback;
  @State private selectedIndex: number = 0;
  @State private barModeStatus?: BarMode = BarMode.Fixed;
  @State private tabBarHeight?: Length = undefined;
  private isIconTextExist: boolean = false;

  aboutToAppear(): void {
    if (this.tabBarOptionsArray[0].icon && this.tabBarOptionsArray[0].text) {
      this.isIconTextExist = true;
    }
    this.barPositionChangeBySingleMode();
  }

  /**
   *单图标或文本场景下监听位置变化影响tabbar高度布局样式
   */
  barPositionChangeBySingleMode(): void {
    if (this.isIconTextExist) {
      return;
    }
    if (this.tabBarPosition === TabBarPosition.LEFT) {
      this.tabBarHeight = (50 / this.tabBarOptionsArray.length + '%');
      this.barModeStatus = BarMode.Scrollable;
    } else {
      this.barModeStatus = BarMode.Fixed;
      this.tabBarHeight = undefined;
    }
  }

  @Builder
  TabBuilder(item: TabBarOptions, index: number) {
    Flex({
      alignItems: ItemAlign.Center,
      justifyContent: FlexAlign.Center
    }){
      if (item.icon) {
        Image(item.icon as ResourceStr)
          .width(TEXT_WIDTH_HEIGHT_SIZE)
          .height(TEXT_WIDTH_HEIGHT_SIZE)
          .objectFit(ImageFit.Contain)
          .fillColor(this.selectedIndex === index ? item.selectedColor : item.unselectedColor)
          .backgroundColor(Color.Transparent)
          .flexShrink(0)
      } else {
        Text(item.text)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .maxLines(1)
          .fontColor(this.selectedIndex === index ? item.selectedColor : item.unselectedColor)
          .maxFontSize($r('sys.float.ohos_id_text_size_button3'))
          .minFontSize(9)
          .fontWeight(TEXT_FONT_WEIGHT)
          .lineHeight(TEXT_LIGHT_HEIGHT)
          .textAlign(TextAlign.Center)
          .focusOnTouch(true)
          .backgroundColor(Color.Transparent)
      }
    }
    .height(this.tabBarHeight)
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
            this.isIconTextExist ?
            BottomTabBarStyle.of(item.icon, item.text).layoutMode(this.layoutMode)
              .labelStyle({ unselectedColor: item.unselectedColor, selectedColor: item.selectedColor })
              .iconStyle({ unselectedColor: item.unselectedColor, selectedColor: item.selectedColor }) :
            this.TabBuilder(item, index)
          )
          .width((!this.tabContents && this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%')
          .height((!this.tabContents && this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%')
        }
      })
    }
    .safeAreaPadding({
      // barHeight设置具体高度时，tabBar的背景色不会延伸到底部安全区，需要新增该属性值使tabBar和安全区背景色一致
      bottom: 0
    })
    .animationDuration(0) // 切换页签时，tabBar有默认的动画效果，设置该属性取消动画效果
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
    .barWidth(this.isIconTextExist ? undefined :
      (this.tabBarPosition === TabBarPosition.LEFT) ? DEFAULT_BAR_WIDTH : '100%')
    .barHeight(this.isIconTextExist ? undefined :
      (this.tabBarPosition === TabBarPosition.BOTTOM) ? DEFAULT_BAR_HEIGHT : '100%')
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