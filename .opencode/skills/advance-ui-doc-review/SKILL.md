---
name: advance-ui-doc-review
description: Use when reviewing OpenHarmony ArkUI atomicservice/advanced component documentation PRs, standalone .md docs in arkui-ts/, or when user mentions 原子化服务高阶组件/atomicservice/advanced documentation review/文档检视/PR检视.
---

# Advance UI Documentation Review

---

## 一、检视范围

| 输入类型 | 文件匹配规则 |
|---------|------------|
| PR 变更检视 | 筛选 `ohos-atomicservice-*.md`、`ohos-arkui-advanced-*.md`、路径含 `arkui-ts/` |
| 完整文档检视 | 按文件名或 URL 指定，路径含 `arkui-ts/` 即在范围内 |

> 不在上述范围内的文件，skill 仍可执行基本检视，但不保证覆盖组件特有的检查项。

---

## 二、输入获取

### GitCode PR

```
1. 获取 PR 详情
   curl -k https://gitcode.com/api/v5/repos/openharmony/docs/pulls/{PR_NUMBER}
2. 获取变更文件
   curl -k https://gitcode.com/api/v5/repos/openharmony/docs/pulls/{PR_NUMBER}/files
3. 筛选目标文件（仅保留 arkui-ts/ 目录下的 atomicservice/advanced 组件文档）
4. 提取 diff 变更内容
```

### 独立文档 URL

优先级：Gitee raw（优先）→ GitCode API → git show

| 优先级 | 方式 | 路径规则 |
|--------|------|---------|
| 1 | **Gitee raw** | `https://gitee.com/openharmony/docs/raw/master/zh-cn/...` |
| 2 | GitCode API | `curl -k https://gitcode.com/api/v5/repos/openharmony/docs/raw/master/{path}` |
| 3 | git show | `git show origin/master:{path}`（需已 clone） |

> GitCode 是 SPA，`web_fetch` 返回空 `<div id="app"></div>`，不可用。

**完整性验证：** 检查文件末尾是否闭合、代码块 ``` 是否完整、文件大小是否合理。

---

## 三、检视流程

### 步骤1：经验模式预检（始终执行）

读取 `references/pr-history-analysis.md` §三，与变更内容逐一匹配 P1~P13 模式。

> 模式表见 pr-history-analysis.md §三，此处不重复。匹配到的模式记录到报告"发现问题"中。

### 步骤2：规范映射检查（始终执行）

> 必须完整阅读 `references/atomicservice-normspec-mapping.md`，按其章节顺序执行。

| 子项 | mapping 引用 | 核心检查点 |
|------|-------------|-----------|
| ① G1~G15 通用项 | §三 | 元数据、章节存在性、参数标题、表格格式、默认值、原子化服务标注、链接格式 |
| ② 签名-表格一致性 | §六（**强制**） | 签名 `?` 参数 vs 参数表"必填"列，逐参数比对并输出结果表 |
| ③ SDK 一致性检验 | §六.2（**强制**） | 文档描述与 SDK .d.ets 签名和注释是否一致 |
| ④ 组件参数规格 | §二.13 | String 长度/格式、Number 边界值、Bool true/false 场景、默认值类型匹配 |
| ⑤ 参数 9 要素 | §二.12 | 取值范围、单位、默认值、生效机制、边界值 |
| ⑥ 约束限制 | §二.14 | 权限无超出/遗漏、设备品类差异描述正确 |
| ⑦ 示例代码 | §二.8 | 文件头 `// xxx.ets`、无 JS 包装类型、无 `any`/`as`、有效果图（`figures/`） |
| ⑧ 错误码 | §二.15 | 链接格式正确、步骤明确可执行 |

**template 文件加载时机：** 执行步骤2时，若 mapping §二 中的引用需要查看原始模板规范（如"高级组件模板 §文件命名"），按需读取：
- `references/advanced-ts-template.md` — 高阶组件模板规范
- `references/basic-ts-template.md` — ArkTS 基础组件模板规范
- `references/dstags-overview.md` — d.ts 标签总览

**SDK 一致性检验时机：** 执行步骤2 ③时，必须通过 CodeHub API 获取对应 SDK .d.ets 文件，逐项比对文档描述与 SDK 签名和注释。

**SDK 获取方式：**
```
项目：OpenSourceCenter_CR/openharmony/interface_sdk-js (ID: 100001628)
分支：huawei/EMUI/HarmonyOS/hmos_trunk/OpenHarmony-Trunk
路径：api/@ohos.{atomicservice|arkui.advanced}.{ComponentName}.d.ets
工具：Codehub-Mcp-Server_get_repo_file
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

**SDK 一致性检验范围（不限于签名，必须覆盖注释）：**
1. **接口/参数/方法签名** — 类型、可选性、参数名是否与 SDK 完全一致
2. **功能描述** — 文档对接口/参数/方法的描述是否与 SDK JSDoc 注释语义一致，不能有明显偏差
3. **枚举值描述** — 每个枚举值的文档描述是否与 SDK 注释一致
4. **回调/事件说明** — 回调参数含义、触发条件是否与 SDK 注释一致
5. **错误码** — SDK 中 @throws 声明的错误码是否在文档中完整体现
6. **@since 版本** — 文档中的起始版本号是否与 SDK @since 标签一致
7. **@default 默认值** — SDK 中标注的 @default 值是否在文档中正确体现

**PR 变更检视 vs 完整文档检视：** PR 变更检视只检查 diff 涉及的部分，但签名-表格一致性核对需覆盖构造函数全部参数，SDK 一致性检验需覆盖变更涉及的全部接口。

### 步骤3：规范文件兜底（仅步骤2 无法覆盖时）

| 文件 | 覆盖范围 |
|------|---------|
| `references/oh-writing-standards.md` | 文件命名/结构/表格/代码/链接/版本/错误码 |
| `references/oh-quality-assessment.md` | 参数 9 要素、18 项自检清单 |

---

## 四、输出模板

### 有问题时

```markdown
## 文档检视报告

**对象：** {文档名 / PR #xxx 变更文件}
**范围：** {PR变更检视 / 完整文档检视}
**时间：** {YYYY-MM-DD HH:mm:ss}

### 检视覆盖
**文件：** {实际检视的文件列表}
**组件：** {涉及的组件名称}
**规范：** {引用的规范文件}
**要点：** {实际执行的检查内容}

### 发现问题
| # | 问题 | 规范依据 | 严重程度 | 位置 |
|---|------|---------|---------|------|
| 1 | {问题简述} | {具体条款} | Major | {文件名}:L{行号} |

### 详细说明
## [分类] 问题描述
**规范：** {引用条款}
**建议：** {修改建议}
```

### 无问题时

```markdown
## 文档检视通过 ✓

**对象：** {文档名 / PR #xxx 变更文件}
**范围：** {PR变更检视 / 完整文档检视}
**时间：** {YYYY-MM-DD HH:mm:ss}

### 检视覆盖
**文件：** {实际检视的文件列表}
**组件：** {涉及的组件名称}
**规范：** {引用的规范文件}
**要点：** {实际执行的检查内容}

### 检查项覆盖
| 检查项 | 涉及内容 | 证据（实际找到的原文/值） | 规范依据 | 结果 |
|--------|---------|------------------------|---------|------|
| {逐项填写} | {具体参数/章节} | {必须附上文档中实际找到的原文片段，不可留空} | {具体条款} | ✅ |

### 结论
文档符合 OpenHarmony ArkUI 高阶组件 API 参考文档编写规范，未发现问题。
```

> **证据列强制要求：** 检查项覆盖表的"证据"列**不可留空**，必须附上文档中实际找到的原文片段。若证据列为空，说明该检查项未实际执行。

---

## 五、支持文件

```
references/
├── pr-history-analysis.md            # P1~P13 经验模式（步骤1，始终）
├── atomicservice-normspec-mapping.md # G1~G17 + 组件章节（步骤2，始终）
├── sdk-baseline.md                   # 10 个组件 SDK 基线签名（步骤2 ③ 强制）
├── advanced-ts-template.md           # 高阶组件模板（步骤2，按需）
├── basic-ts-template.md              # 基础组件模板（步骤2，按需）
├── dstags-overview.md                # d.ts 标签总览（步骤2，按需）
├── oh-writing-standards.md           # 编写规范（步骤3兜底）
└── oh-quality-assessment.md          # 质量评估（步骤3兜底）
```

---

## 六、知识库更新（仅用户明确要求时）

**触发条件：** 用户提供 merged PR 链接 + 明确表达更新意图（仅「检视一下」不触发更新）。

**更新流程：**
1. GitCode API 确认 merged
2. 筛选目标文件（`ohos-atomicservice-*.md` / `ohos-arkui-advanced-*.md`）
3. 与 pr-history-analysis.md P1~P13 模式匹配（详见该文件 §六 更新位置说明）
4. 按需更新对应参考文件
5. 自检确认

**更新目标：**

| 发现内容 | 更新目标 |
|---------|---------|
| P1~P13 之外的新问题模式 | pr-history-analysis.md |
| 映射表覆盖空白 | atomicservice-normspec-mapping.md |
| 检视流程改进 | SKILL.md |
| formal 规范新要求 | oh-writing-standards.md / oh-quality-assessment.md |