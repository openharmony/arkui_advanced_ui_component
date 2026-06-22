# 普通按钮组件

提供按钮的基本功能，包括文本显示、点击事件和状态管理等。

> **说明：**
> 该组件从API version 4开始支持。

## 导入模块

```ts
import { Button } from '@kit.ArkUI';
```

## Button

Button(options?: {type?: ButtonType, stateEffect?: boolean})

**装饰器类型：** @Component

| 名称 | 类型 | 必填 | 装饰器类型 | 说明 |
|------|------|------|------------|------|
| options | object | 否 | - | 按钮选项。 |

## 示例

```ts
// xxx.ets
@Entry
@Component
struct ButtonExample {
  build() {
    Button('Click Me')
      .onClick(() => {
        console.info('Button clicked')
      })
  }
}
```