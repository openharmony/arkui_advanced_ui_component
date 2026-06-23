# 高级组件接口说明模板规范

高级组件指@ohos.arkui.advanced包下的组件，如Chip、EditableTitleBar等。

## 与基础组件模板的差异

### 文件命名
- 与d.ets名称保持一致，将链接符号`.`变更为`-`
- 示例：ohos-arkui-advanced-Chip.md

### 上传路径
- docs/zh-cn/application-dev/reference/apis-xxx-kit/

## 文档结构
1. 模块说明
2. 起始版本说明
3. 导入模块（必选）
4. 子组件
5. 属性（不支持通用属性时需说明）
6. 事件（不支持通用事件时需说明）
7. 结构体（可选）
8. 方法（可选）
9. Class（可选）
10. 枚举（可选）
11. Type（可选）
12. 示例（必选）

## 文档标题规范

- **一级标题**：中文短语概括组件功能
- **起始版本说明**：使用引用语法`>`

### 模块描述固定句式
```
（模块介绍，可选）xxx是xxx。
（功能描述，必选）提供xxx能力，包括xxx、xxx等。
（使用场景，可选）当需要xxx时，使用本模块xxx方法/本组件。
（使用建议或注意事项，可选）本模块可与xxx联合使用，以提升开发效率……
```

**示例：**
> @ohos.arkui.advanced.EditableTitleBar (编辑页面标题栏)
>
> 编辑型标题栏，适用于多选界面或者内容的编辑界面，一般采取左叉右勾的形式。

## 导入模块（必选）

```js
import { EditableTitleBar } from "@ohos.arkui.advanced.EditableTitleBar"
```

## 属性/事件说明

高级组件需明确说明是否支持通用属性/事件：

```
不支持通用属性。
不支持通用事件。
```

## 结构体写作

结构体参数被装饰器修饰时需说明"装饰器类型"：

```
ComposeListItem({contentItem?: ContentItem, operateItem?: OperateItem})

**装饰器类型：** @Component

| 名称 | 类型 | 必填 | 装饰器类型 | 说明 |
|------|------|------|------------|------|
| contentItem | ContentItem | 否 | @Prop | 定义左侧以及中间元素 |
```

## 示例代码要求

```ts
// xxx.ets 【必选，使用.ts语言标记】

// 1. 所有的示例代码需要进行自检
// 2. 不能出现缺符号、变量前后不一致等低错
// 3. 所有使用到的变量要进行声明
// 4. 不允许直接写参数名，必须是可使用、易替代的实际用例
// 5. 注释要精简、突出要点
// 6. 示例图布局清晰，配色简洁大方，图片有版权
```

## d.ts标签与文档字段对应

| d.ts标签 | 文档字段 |
|---------|---------|
| @since | 版本说明 |
| @deprecated | 废弃说明 |
| @FAModelOnly/@StageModelOnly | 模型约束 |
| @form | 卡片能力 |
| @systemapi | 系统接口 |
| @syscap | 系统能力 |
| @permission | 权限说明 |
| @extends | 继承说明 |