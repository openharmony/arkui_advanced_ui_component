# PR 变更内容示例

以下为 OpenHarmony docs 仓库 PR #148137 的变更内容（原子化服务导航组件文档）。

## 变更文件 1: ohos-atomicservice-AtomicServiceNavigation.md

### 变更前 (before)

```markdown
## AtomicServiceNavigation

AtomicServiceNavigation({navPathStack?: NavPathStack, navigationContent?: Callback\<void\>, title?: ResourceStr})

| 名称 | 类型 | 必填 | 装饰器类型 | 说明 |
|------|------|------|------------|------|
| navPathStack | NavPathStack | 是 | @State | 导航路径栈。 |
| navigationContent | Callback\<void\> | 是 | @BuilderParam | 导航内容区域。 |
| title | ResourceStr | 否 | @Prop | 导航栏标题。 |
```

### 变更后 (after)

```markdown
## AtomicServiceNavigation

AtomicServiceNavigation({navPathStack?: NavPathStack, navigationContent?: Callback\<void\>, title?: ResourceStr, titleOptions?: TitleOptions})

**原子化服务API：** 从API version 12开始支持。

| 名称 | 类型 | 必填 | 装饰器类型 | 说明 |
|------|------|------|------------|------|
| navPathStack | NavPathStack | 是 | @State | 导航路径栈。 |
| navigationContent | Callback\<void\> | 是 | @BuilderParam | 导航内容区域。 |
| title | ResourceStr | 否 | @Prop | 导航栏标题。 |
| titleOptions | TitleOptions | 否 | @Prop | 标题栏选项。 |

### 新增参数说明

**titleOptions:** 标题栏选项，用于配置标题栏的扩展属性。

| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| subtitle | ResourceStr | 否 | 副标题文本。 |
| backgroundColor | ResourceColor | 否 | 标题栏背景色。 |
```