# 全屏启动原子化服务组件

全屏启动原子化服务组件，提供全屏启动原子化服务的能力，包括启动、通信和生命周期管理等功能。

> **说明：**
> 该组件从API version 12开始支持。后续版本如有新增内容，则采用上角标单独标记该内容的起始版本。

## 导入模块

```ts
import { FullScreenLaunchComponent } from '@kit.ArkUI';
```

## 子组件

无

## 属性

不支持通用属性。

## 事件

不支持通用事件。

## FullScreenLaunchComponent

FullScreenLaunchComponent({content: Callback\<void\>, appId: string, options?: AtomicServiceOptions, onError?: ErrorCallback, onTerminated?: Callback\<TerminationInfo\>, onReceive?: Callback\<Record\<string, Object\>>})

**装饰器类型：** @Component

**原子化服务API：** 从API version 12开始支持。

| 名称 | 类型 | 必填 | 装饰器类型 | 说明 |
|------|------|------|------------|------|
| content | Callback\<void\> | 是 | @BuilderParam | 设置组件内容。 |
| appId | string | 是 | - | 原子化服务的应用标识。 |
| options | AtomicServiceOptions | 否 | - | 原子化服务启动选项。 |
| onError | ErrorCallback | 否 | - | 启动的ExtensionAbility运行发生错误时触发的回调。 |
| onTerminated | Callback\<TerminationInfo\> | 否 | - | EmbeddableUIAbility终止时触发的回调。 |
| onReceive | Callback\<Record\<string, Object\>\> | 否 | - | 接收数据的回调。<sup>20+</sup> |

## AtomicServiceOptions

**原子化服务API：** 从API version 12开始支持。

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sessionId | string | 否 | 会话标识。 |

## 示例

```ts
// xxx.ets
@Entry
@Component
struct FullScreenLaunchComponentExample {
  build() {
    Column() {
      FullScreenLaunchComponent({
        content: () => {
          Text('Launch Content')
        },
        appId: 'com.example.atomicservice'
      })
    }
  }
}
```

![FullScreenLaunchComponentDemo](figures/FullScreenLaunchComponentDemo.png)