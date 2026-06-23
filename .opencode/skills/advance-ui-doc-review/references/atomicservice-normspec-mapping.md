# 原子化服务高阶组件检视规范映射表

> **使用说明：**
> - **模板是规范**：本文件的检查要求全部来源于 `advanced-ts-template.md`、`ts-template.md`、`oh-writing-standards.md`、`oh-quality-assessment.md`
> - **文档是对象**：10 个高阶组件文档仅定义检视范围，不作为规范依据
> - **模板优先**：当文档内容与模板要求不一致时，以模板为准

---

## 一、检视范围

本 skill 专用于 ArkUI 高阶组件 API 参考文档检视。

**文件匹配规则：**
- 路径含 `zh-cn/application-dev/reference/apis-arkui/arkui-ts/`
- 文件名符合 `ohos-atomicservice-*.md` 或 `ohos-arkui-advanced-*.md`
- 系统接口文档需额外检查标题/标注格式（见 §二.3）

**当前主要覆盖的组件类型：**
| 类型 | 命名特征 | 特有检查项 |
|------|---------|-----------|
| 高级组件 | `ohos-arkui-advanced-*` | EmbeddableUIAbility 约束说明 |
| 原子化服务组件 | `ohos-atomicservice-*` | 原子化服务API标注 |
| 系统接口 | `*-sys.md` | 系统接口标注 + Stage 模型约束 |

> 注：10 个示例文件（FullScreenLaunchComponent、AtomicServiceNavigation 等）仅定义示例检视范围，不限制 skill 的适用边界。

---

## 二、模板要求与文档内容映射

以下将模板的规范要求映射到文档应包含的内容类型。10 个文档中出现的内容类型仅作为参考，不代表合规。

### 2.1 文件命名（advanced-ts-template.md §文件命名）

| 模板要求 | 检查项 | 规范依据 |
|---------|--------|---------|
| 与 d.ets 同名，`.` → `-` | 文件名是否将 `.` 转换为 `-` | 高级组件模板 |
| 系统接口文档 | 文件名后缀 `-sys.md` | oh-writing-standards §十 |

**示例：**
- `ohos.arkui.advanced.FullScreenLaunchComponent` → `ohos-arkui-advanced-FullScreenLaunchComponent.md`
- 系统接口文件：`xxx-sys.md`

### 2.2 文档结构（advanced-ts-template.md §文档结构）

| 模板要求 | 必须项 | 规范依据 |
|---------|--------|---------|
| 1. 模块说明 | ✅ 必选 |
| 2. 起始版本说明 | ✅ 必选 |
| 3. 导入模块 | ✅ 必选 |
| 4. 子组件 | ✅ 必选（无则写"无"） |
| 5. 属性 | ✅ 必选（不支持通用属性时需说明） |
| 6. 事件 | ✅ 必选（不支持通用事件时需说明） |
| 7. 结构体 | 可选 |
| 8. 方法 | 可选 |
| 9. Class | 可选 |
| 10. 枚举 | 可选 |
| 11. Type | 可选 |
| 12. 示例 | ✅ 必选 |

> 注：10 个文档中并非每个都包含全部章节（如 AtomicServiceSearch 缺少子组件章节），需按实际设计判断是否合规

### 2.3 文档标题规范（advanced-ts-template.md §文档标题规范）

| 模板要求 | 检查项 | 规范依据 |
|---------|--------|---------|
| 一级标题为中文短语 | 标题是否为中文功能描述（如"全屏启动原子化服务组件"） | 高级组件模板 |
| 系统接口标题加后缀 | 系统接口文档标题应为 `# 模块名（系统接口）` | oh-writing-standards §十 |
| 起始版本使用引用语法 | `>` 包含版本说明 | 高级组件模板 |

**模板句式：**
```
> **说明：**
> 该组件从API version X开始支持。后续版本如有新增内容，则采用上角标单独标记该内容的起始版本。
```

### 2.4 模块描述固定句式（advanced-ts-template.md §模块描述固定句式）

| 部分 | 说明 | 是否必选 |
|------|------|---------|
| 模块介绍 | xxx是xxx | 可选 |
| 功能描述 | 提供xxx能力，包括xxx、xxx等 | **必选** |
| 使用场景 | 当需要xxx时，使用本组件 | 可选 |
| 使用建议 | 本组件可与xxx联合使用…… | 可选 |

### 2.5 导入模块（advanced-ts-template.md §导入模块）

| 模板要求 | 检查项 |
|---------|--------|
| 必须存在 `## 导入模块` 章节 | 所有 10 个文档均包含 |
| 格式：`import { 组件名 } from '@kit.ArkUI';` | 检查 import 路径是否正确 |

### 2.6 属性/事件说明（advanced-ts-template.md §属性/事件说明）

| 模板要求 | 检查项 |
|---------|--------|
| 需明确说明是否支持通用属性 | 不支持时写"不支持[通用属性](ts-component-general-attributes.md)" |
| 需明确说明是否支持通用事件 | 不支持时写"不支持[通用事件](ts-component-general-events.md)" |

### 2.7 结构体/Class 写作（advanced-ts-template.md §结构体写作 + ts-template.md §接口示例）

| 内容 | 模板要求 | 检查项 |
|------|---------|--------|
| 装饰器类型 | `@Component` 组件需标注 `**装饰器类型：** @Component` | 有装饰器的参数需在装饰器类型列标注 |
| 构造函数参数表 | 5 列：名称/类型/必填/装饰器类型/说明 | 检查表头格式 |
| 子对象参数表 | 5 列：名称/类型/只读/可选/说明 | 检查表头格式 |
| 方法参数表 | 4 列：参数名/类型/必填/说明 | 检查表头格式 |
| 系统接口标注 | 需标注 `**系统接口：** 此接口为系统接口。` | 仅 -sys 文档 |
| 原子化服务API标注 | 构造函数自身及含原子化服务API的参数/方法需标注 | 检查是否完整 |

### 2.8 示例代码要求（advanced-ts-template.md §示例代码要求 + oh-writing-standards.md §十一）

| 模板要求 | 检查项 | 规范依据 |
|---------|--------|---------|
| 文件头标记 `// xxx.ets` | 代码块首行必须有 | oh-writing-standards §六 |
| 添加语言标记 `ts` | ```ts 格式 | oh-writing-standards §六 |
| 可编译运行 | 代码放入 DevEco Studio 可正常编译 | oh-writing-standards §十一 |
| 效果图 | UI 组件必须提供 `figures/` 下截图 | oh-quality-assessment §二.3 |
| 注释精简突出要点 | `//注释` 不带开头空格 | oh-writing-standards §六 |
| 变量声明完整 | 使用到的变量必须声明 | 高级组件模板 |
| 无 JS 包装类型 | 禁止 `Number`/`String`/`Boolean`，用 `number`/`string`/`boolean` | P13 |

### 2.9 d.ts 标签与文档字段映射（oh-writing-standards.md §三）

| d.ts 标签 | 文档应有字段 |
|-----------|------------|
| @since | `**起始版本**：x.x.x` 或 `<sup>x+</sup>` |
| @atomicservice | `**原子化服务API：** 从 API version X 开始支持` |
| @systemapi | `> **说明：** 本模块接口为系统接口。` |
| @syscap | `**系统能力**：SystemCapability.ArkUI.ArkUI.Full` |
| @permission | `**需要权限**：ohos.permission.xxx` |
| @StageModelOnly | `**模型约束**：此接口仅可在Stage模型下使用。` |
| @装饰器 | `**装饰器类型**：@装饰器名称` |

### 2.10 版本标注规范（oh-writing-standards.md §七）

| 模板要求 | 检查项 |
|---------|--------|
| 两段式（API 26.0.0 前）使用 `>` | `> **说明：** 本模块首批接口从 API version X 开始支持……` |
| 新增接口用上标 | `<sup>版本+</sup>` 必须闭合（`</sup>`） |
| 错误：`onError<sup>18+<sup>` | 正确：`onError<sup>18+</sup>` |

### 2.11 链接规范（oh-writing-standards.md §八）

| 模板要求 | 检查项 |
|---------|--------|
| 使用 Markdown 链接语法 | 禁止 `<a>` 标签 |
| 锚点指向具体段落 | 禁止指向章节标题 |
| 错误码链接格式 | `[ohos.router(页面路由)](../errorcode-router.md)错误码` |

**错误示例：**
- ❌ `[SymbolGlyphModifier](ts-universal-attributes-attribute-modifier.md#自定义modifier)`
- ✅ `[SymbolGlyphModifier](ts-universal-attributes-attribute-modifier.md)`

### 2.12 参数描述要求（ts-template.md §参数描述要求 + oh-quality-assessment.md §二）

**参数 9 要素：**
1. 含义与用途
2. 什么场景下使用
3. 选取建议
4. 参数间关联关系
5. 取值范围
6. 单位
7. 默认值
8. 取值原则
9. 边界值限制/异常场景

**Bool 类型专项：** 必须说明 true/false 各为何种场景（oh-quality-assessment §二.8）

### 2.13 API 规格加固要求（oh-writing-standards.md §十三）

| 类型 | 检查项 |
|------|--------|
| String | 长度范围、有效集合、特殊格式（邮箱/URL/JSON等） |
| Number | 边界值 |
| Object | 子参数规格 |
| Bool | true/false 场景 |
| 默认值 | 类型与参数类型匹配（如图标用 `sys.media`，不用 `sys.color`） |

### 2.14 约束限制完整性（oh-writing-standards.md §十四）

| 检查项 | 规范依据 |
|--------|---------|
| 权限说明：必要、无超出、无遗漏 | oh-writing-standards §十四 |
| 设备品类差异：不同设备支持/效果差异描述正确 | oh-writing-standards §十四 |
| EmbeddableUIAbility 继承要求（启动类组件） | 模板无强制要求，文档实际有说明 |

### 2.15 错误码规范（oh-writing-standards.md §十五）

| 模板要求 | 检查项 |
|---------|--------|
| 可执行 | 按步骤能正确解决问题 |
| 步骤明确 | 明确、具体、可执行 |
| 模板要素 | 错误信息、错误描述、可能原因（按可能性排序）、处理步骤 |

---

## 三、通用检查项（G1~G15）

所有高阶组件文档均需检查以下通用项。

| # | 检查项 | 模板来源 | 级别 |
|---|--------|---------|------|
| G1 | 元数据注释（Kit/Subsystem/Owner/Designer/Tester/Adviser） | 高级组件模板（模板本身无此要求，实际文档均包含） | S |
| G2 | 起始版本号（`>` 引用语法 + 句式正确） | ts-template §文档标题规范 | M |
| G3 | 导入模块（存在且路径正确） | 高级组件模板 §导入模块 | M |
| G4 | 子组件章节（必须，无则写"无"） | 高级组件模板 §文档结构 | M |
| G5 | 属性章节（存在或注明不支持） | 高级组件模板 §文档结构 | M |
| G6 | 事件章节（存在或注明不支持） | 高级组件模板 §文档结构 | M |
| G7 | `**参数：**` 标题（构造函数/方法/回调均需） | ts-template §接口示例 | M |
| G8 | 参数表格式（构造函数5列/方法4列/子对象5列，全文统一） | oh-writing-standards §四 | M |
| G9 | @BuilderParam 装饰器类型标注 | 高级组件模板 §结构体写作 | M |
| G10 | 默认值（每个参数必须说明） | ts-template §参数描述要求 | M |
| G11 | 原子化服务API标注（构造函数自身 + 含该能力的所有参数/方法） | 高级组件模板 + oh-writing-standards §三 | M |
| G12 | 系统能力标注（`SystemCapability.ArkUI.ArkUI.Full`） | oh-writing-standards §三 | M |
| G13 | sup 闭合（每个 `<sup>` 有 `</sup>`） | oh-writing-standards §七 | m |
| G14 | 链接锚点（指向具体段落而非章节标题） | oh-writing-standards §八 | m |
| G15 | 错误码链接格式（文本与目标标题一致） | oh-writing-standards §八 | m |
| G16 | SDK 一致性检验（签名与参数/接口/方法一致、文档描述与 SDK JSDoc 注释语义无显著偏差） | §六.2 | M |

> 级别：M=Major, m=Minor, S=Suggestion

---

## 四、高频问题模式（P1~P13）

来自 PR 历史的经验模式，检视时优先扫描。

| 模式 | 说明 | 级别 | 检查点 |
|------|------|------|--------|
| P1 | null 检查判断对象而非结果：`if (getDialogUIContext === null)` | **Fatal** | 示例代码 |
| P2 | `**参数：**` 标题缺失 | Major | 构造函数/方法/回调参数表前 |
| P3 | 参数签名 `?:` 与"必填/可选"列不一致 | Major | 签名-表格一致性 |
| P4 | `<sup>` 标签不闭合 | Minor | 版本上标 |
| P5 | 链接锚点指向章节标题 | Minor | 所有超链接 |
| P6 | 错误码链接文本与目标标题不一致 | Minor | 错误码链接 |
| P7 | 默认值被简化/删除 | Major | 参数说明 |
| P8 | 示例注释 `// 获取` 带开头空格 | Minor | 示例代码 |
| P9 | 参数签名变更未全量同步（签名+表格+说明+示例） | Major | 参数变更时 |
| P10 | 可选性变更但文档未同步 | Major | 可选参数检查 |
| P11 | UI 组件示例无效果图 | Minor | 示例代码 |
| P12 | 参数/枚举描述不精确（如"底色"应为"底色不透明度"） | Minor | 参数说明 |
| P13 | 示例代码使用 JS 包装类型（`Number`/`String`/`Boolean`） | Major | 示例代码 |

---

## 五、组件分类与检视重点

### 5.1 启动类组件（FullScreen / HalfScreen / InnerFullScreen）

| 分类 | 检视重点 |
|------|---------|
| FullScreenLaunchComponent | 参数签名一致性、EmbeddableUIAbility 说明、Wearable 设备限制 |
| InnerFullScreenLaunchComponent-sys | 系统接口标注格式、构造函数原子化服务API标注 |
| HalfScreenLaunchComponent | 参数签名一致性、EmbeddableUIAbility 说明 |

### 5.2 导航类组件（AtomicServiceNavigation / NavPushPathHelper）

| 组件 | 检视重点 |
|------|---------|
| AtomicServiceNavigation | 装饰器类型混用（@State/@Prop/@BuilderParam）、子对象默认值、回调 Bool 含义 |
| NavPushPathHelper | 方法参数表、错误码完整性、animated 默认值 |

### 5.3 Tab 组件（AtomicServiceTabs）

| 检视重点 |
|---------|
| 5 页签上限约束说明 |
| TabBarOptions constructor 参数必填性 |
| OnContentWillChangeCallback 返回值说明（boolean 含义） |
| layoutMode<sup>18+</sup> 上标闭合 |

### 5.4 搜索组件（AtomicServiceSearch）

| 检视重点 |
|---------|
| SelectParams selected 默认值 -1 描述精确性 |
| SearchParams Bool 属性 true/false 场景说明 |
| 子对象默认值完整性（SelectParams 21 + SearchParams 35 属性） |

### 5.5 弹框组件（InterstitialDialogAction）

| 检视重点 |
|---------|
| 枚举默认值（IconStyle/TitlePosition/BottomOffset） |
| vp 单位说明（88vp/44vp） |
| 示例 null 检查逻辑（P1） |

### 5.6 Web 组件（AtomicServiceWeb）

| 检视重点 |
|---------|
| `## 需要权限` 章节（ohos.permission.INTERNET） |
| @ObjectLink 装饰器类型 |
| Controller 方法错误码完整性 |
| setCustomUserAgent 说明块（建议在 onControllerAttached 中设置） |

### 5.7 菜单胶囊（AtomicServiceMenuBar-sys）

| 检视重点 |
|---------|
| 系统接口 + Stage 模型双重约束标注 |
| constructor 参数 uiContext 必填性 |
| 模型约束标注格式 |

---

## 六、强制步骤：签名-表格一致性核对

> **⚠️ 每个含构造函数签名的组件必须执行此步骤**

**目的：** 检测 P3 模式——参数签名 `?:` 与参数表"必填"列不一致

**操作步骤：**
1. 从构造函数签名提取带 `?` 的参数名 → 集合 A（签名可选）
2. 从参数表提取"必填=否"的参数名 → 集合 B（表格可选）
3. 从参数表提取"必填=是"的参数名 → 集合 C（表格必填）
4. 比对：
   - A ⊆ B？（签名有 `?` 但表格标"是"→ P3）
   - C 中是否有默认值说明？（必填参数不应有"默认值为空"）

**输出格式：**
```
### 签名-表格一致性核对
| 参数名 | 签名可选(?) | 表格必填 | 一致性 |
|--------|-----------|---------|--------|
| param1 | 否 | 是 | ✅ |
| param2 | 是 | 否 | ✅ |
| ... | ... | ... | ... |
```

---

## 六.2 强制步骤：SDK 一致性检验

> **⚠️ 每个组件文档必须与对应 SDK .d.ets 文件逐一比对，不限于签名，必须覆盖注释内容**

**原则：** 文档描述应严格与 SDK 代码中的 JSDoc 注释保持一致，不能出现文档介绍和 SDK 有明显偏差的地方。SDK 注释是接口行为的权威来源。

**SDK 获取方式：**
```
项目：OpenSourceCenter_CR/openharmony/interface_sdk-js (ID: 100001628)
分支：huawei/EMUI/HarmonyOS/hmos_trunk/OpenHarmony-Trunk
工具：Codehub-Mcp-Server_get_repo_file
参数：project_id=100001628, ref="huawei/EMUI/HarmonyOS/hmos_trunk/OpenHarmony-Trunk", file_path="api/@ohos.{atomicservice|arkui.advanced}.{ComponentName}.d.ets"
```

**10 个组件与 SDK 文件对照：**

| 文档 | SDK .d.ets 路径 |
|------|---------------|
| ohos-arkui-advanced-FullScreenLaunchComponent | api/@ohos.arkui.advanced.FullScreenLaunchComponent.d.ets |
| ohos-arkui-advanced-InnerFullScreenLaunchComponent | api/@ohos.arkui.advanced.InnerFullScreenLaunchComponent.d.ets |
| ohos-atomicservice-HalfScreenLaunchComponent | api/@ohos.atomicservice.HalfScreenLaunchComponent.d.ets |
| ohos-atomicservice-AtomicServiceNavigation | api/@ohos.atomicservice.AtomicServiceNavigation.d.ets |
| ohos-atomicservice-NavPushPathHelper | api/@ohos.atomicservice.NavPushPathHelper.d.ets |
| ohos-atomicservice-AtomicServiceTabs | api/@ohos.atomicservice.AtomicServiceTabs.d.ets |
| ohos-atomicservice-AtomicServiceSearch | api/@ohos.atomicservice.AtomicServiceSearch.d.ets |
| ohos-atomicservice-InterstitialDialogAction | api/@ohos.atomicservice.InterstitialDialogAction.d.ets |
| ohos-atomicservice-AtomicServiceWeb | api/@ohos.atomicservice.AtomicServiceWeb.d.ets |
| ohos-atomicservice-AtomicServiceMenuBar | api/@ohos.atomicservice.AtomicServiceMenuBar.d.ets |

**检验维度（7 项）：**

| # | 检验维度 | 说明 | 级别 |
|---|---------|------|------|
| S1 | 签名一致性 | 接口/参数/方法的类型、可选性(`?`)、参数名与 SDK 完全一致 | Major |
| S2 | 描述一致性 | 文档对接口/参数/方法的描述与 SDK JSDoc 注释语义一致，无明显偏差 | Major |
| S3 | 枚举值描述 | 每个枚举值的文档描述与 SDK 注释一致 | Major |
| S4 | 回调/事件说明 | 回调参数含义、触发条件与 SDK 注释一致 | Major |
| S5 | 错误码完整性 | SDK `@throws` 声明的错误码在文档中完整体现 | Major |
| S6 | @since 版本号 | 文档中的起始版本号与 SDK `@since` 标签一致 | Major |
| S7 | @default 默认值 | SDK 中标注的 `@default` 值在文档中正确体现 | Major |

**描述一致性（S2）检查要点：**
- SDK 注释描述了参数的核心语义（如"whether this bar is visible"），文档描述不能偏离此语义
- SDK 注释说明了触发条件（如"It is supported only when the atomic service runs in embedded mode"），文档必须包含此条件
- SDK 注释说明了参数关联关系（如 constructor 参数 uiContext 的含义），文档不能遗漏或曲解
- 不要求逐字翻译，但语义不能有明显偏差（如 SDK 说"opacity"文档不能说"color"，SDK 说"blending method"文档不能说"mixing ratio"）

**输出格式：**
```
### SDK 一致性检验
| 检验项 | SDK 原文（签名/注释） | 文档描述 | 一致性 |
|--------|-------------------|---------|--------|
| {接口/参数名} | {SDK 签名 + JSDoc 关键句} | {文档对应描述} | ✅/❌ |
```

---

## 八、质量自检清单（oh-quality-assessment.md §三）

| # | 检查项 | 归类 |
|---|--------|------|
| 1 | 描述和功能一致，无误/前后矛盾/歧义 | 正确性 |
| 2 | 文档与代码一致，无超出/遗漏 | 正确性 |
| 3 | 起始版本/入参/返回值与代码一致 | 正确性 |
| 4 | 无拼写错误 | 正确性 |
| 5 | String 类型：长度范围/有效集合/特殊格式正确 | 规格正确性 |
| 6 | Number 类型：边界值描述正确 | 规格正确性 |
| 7 | Bool 类型：true/false 场景描述正确 | 规格正确性 |
| 8 | 默认值描述正确 | 规格正确性 |
| 9 | 有单位的参数单位正确 | 规格正确性 |
| 10 | 参数描述含 9 要素 | 完整性 |
| 11 | 方法描述含 8 要素 | 完整性 |
| 12 | callback/Promise 按固定句式写作 | 规范性 |
| 13 | 返回值描述含枚举说明/值格式/使用说明 | 完整性 |
| 14 | 权限说明正确，无超出/遗漏 | 约束完整性 |
| 15 | 设备品类/地区差异描述正确 | 约束完整性 |
| 16 | 典型用法均提供示例，贴近真实场景 | 完整性 |
| 17 | 涉及 UI 的示例提供效果示意图 | 示例实用性 |
| 18 | 示例代码可编译/可运行/与描述一致 | 示例可用性 |

---

## 九、规范文件索引

| 文件 | 用途 |
|------|------|
| advanced-ts-template.md | 高级组件模板规范（@ohos.arkui.advanced） |
| ts-template.md | ArkTS 组件通用模板规范 |
| oh-writing-standards.md | 文档编写规范（文件命名/结构/表格/代码/链接/版本/错误码） |
| oh-quality-assessment.md | 质量评估规范（18 项自检清单） |
| pr-history-analysis.md | PR 历史问题模式（P1~P13） |
| dstags-overview.md | 文档写作规范总览 |
| atomicservice-normspec-mapping.md | **本文件**：规范要求与文档内容映射表 |
| sdk-baseline.md | 10 个组件 SDK 基线签名与注释（§六.2 强制核对用） |