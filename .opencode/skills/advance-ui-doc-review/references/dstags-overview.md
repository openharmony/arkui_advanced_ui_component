# OpenHarmony文档写作规范总览

本文档汇总了OpenHarmony开发者文档的写作规范和模板，作为文档检视的参考标准。

## 文档类型概览

| 文档类型 | 模板文件 | 适用范围 |
|---------|---------|---------|
| 开发指南 | guide-template.md | Kit/方案/特性/功能/模块的开发指导 |
| ArkTS组件接口 | ts-template.md | 基础ArkTS组件API参考 |
| JavaScript API接口 | js-template.md | JS API接口参考 |
| 高级组件接口 | advanced-ts-template.md | 高级ArkUI组件API参考 |
| 教程 | tutorial-template.md | 复杂任务/功能/APP开发教程 |
| FAQ | faq-template.md | 常见问题解答 |
| 系统公共事件 | common-event-template.md | 系统公共事件定义 |
| 错误码 | errorcodes-template.md | 模块错误码说明 |
| 调试工具 | tools-template.md | 调试工具使用说明 |
| Native接口注释 | native-template.md | C/C++原生接口注释规范 |
| 开发板文档 | xxboard-template.md | 第三方开发板介绍 |
| README | README-template.md | 子系统/部件仓README |

## 通用写作原则

### 1. 写作定位
- **目标对象**：面向内、外部开发者（含产品经理、开发人员）
- **内容定位**：介绍"是什么(What)、能做什么(Why)、如何开发(How)"
- **用户视角**：始终以开发者视角，提供开发者关注的、可感知和使用的内容
- **面向任务**：聚焦开发者实际任务，完整、正确、易用

### 2. 内容要求
- 清晰易懂，避免模糊、晦涩、有歧义的表述
- 仅使用必要的术语、缩略语或专有名词，并给出解释
- 术语、缩略语全文保持一致
- 不要僵化使用模板，模板只是基础框架

### 3. 示例代码要求
- 逻辑/语法正确，书写规范
- 示例代码添加语言属性标记
- 涉及敏感信息（手机号、身份证、IP等）需打码处理
- 代码缩进使用4个空格，不用tab键
- 注释要精简、突出要点

### 4. 链接写法
- 格式：`[链接文字](链接内容)`
- 跨文件夹链接：`[指南](../../xxx/xxx.md)`，`../`表示上移一层
- 页面内链接：`[接口](#xxxa7)`，全小写无特殊符号

### 5. d.ts标签与文档字段对应

| d.ts标签 | 文档字段 |
|---------|---------|
| @since | 起始版本说明 |
| @deprecated | 废弃说明 |
| @FAModelOnly/@StageModelOnly | 模型约束 |
| @form | 卡片能力 |
| @systemapi | 系统接口 |
| @syscap | 系统能力 |
| @permission | 权限说明 |
| @extends | 继承说明 |
| @atomicservice | 原子化服务API |

### 6. 版本说明格式
- **API版本26.0.0+**：使用三段式版本号，句式`**起始版本：** 26.0.0`
- **API版本26.0.0之前**：使用引用语法`>`，新增接口使用`<sup>版本号+</sup>`