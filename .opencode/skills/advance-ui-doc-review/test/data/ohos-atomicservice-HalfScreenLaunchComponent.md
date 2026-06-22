# 半屏启动原子化服务组件

半屏启动原子化服务组件，提供半屏启动原子化服务的能力。

> **说明：**
> 该组件从API version 18开始支持。后续版本如有新增内容，则采用上角标单独标记该内容的起始版本。

## 导入模块

```ts
import { HalfScreenLaunchComponent } from '@kit.ArkUI';
```

## HalfScreenLaunchComponent

HalfScreenLaunchComponent({content: Callback\<void\>, appId: string, options?: AtomicServiceOptions, onError?: ErrorCallback, onTerminated?: Callback\<TerminationInfo\>, onReceive<sup>20+<sup>?: Callback\<Record\<string, Object\>>})

**装饰器类型：** @Component

**原子化服务API：** 从API version 18开始支持。

| 名称 | 类型 | 必填 | 装饰器类型 | 说明 |
|------|------|------|------------|------|
| content | Callback\<void\> | 是 | @BuilderParam | 设置组件内容。 |
| appId | string | 是 | - | 原子化服务的应用标识。 |
| options | AtomicServiceOptions | 否 | - | 原子化服务启动选项。 |
| onError | ErrorCallback | 否 | - | 启动的ExtensionAbility运行发生错误时触发的回调。 |
| onTerminated | Callback\<TerminationInfo\> | 否 | - | EmbeddableUIAbility终止时触发的回调。 |
| onReceive | Callback\<Record\<string, Object\>\> | 否 | - | 接收数据的回调。 |

## InterstitialDialogAction

提供插屏弹框能力。

### show

show(): void

显示插屏弹框。

### InterstitialDialogActionExample

```ts
// xxx.ets
@Entry
@Component
struct InterstitialDialogExample {
  dialogUIContext: DialogUIContext | null = null

  build() {
    Column() {
      Button('Show Dialog')
        .onClick(() => {
          if (this.dialogUIContext === null) {
            console.info('dialogUIContext is null')
            return
          }
          this.dialogUIContext.show()
        })
    }
  }
}
```

## AtomicServiceSearch

提供搜索能力。

### SearchParams

| 名称 | 类型 | 只读 | 可选 | 说明 |
|------|------|------|------|------|
| hint | String | 否 | 是 | 搜索框提示文本。 |
| selected | Number | 否 | 是 | 当前选中项索引。 |
| enableHighlight | Boolean | 否 | 是 | 是否高亮显示。 |

## 示例

```ts
// xxx.ets
@Entry
@Component
struct AtomicServiceSearchExample {
  build() {
    Column() {
      Text('Search Component')
    }
  }
}
```