# Vue3 AI 模板优化计划

分支：`ui/layout-refresh`

目标：在不引入大框架、复杂抽象和额外永久 Skill 的前提下，继续提升模板对 AI 编程的友好度，同时保持“代码简单、Token 少、人易维护”的方向。

## 原则

- 只在当前 `ui/layout-refresh` 分支修改，不新建分支。
- 不引入 Monorepo、Schema Form、Schema Table、EventBus、Registry 框架、多布局系统。
- 不新增永久 Skill，优先通过项目地图、页面范式和组件目录降低 AI 搜索成本。
- 修改范围保持最小；每一项完成后更新本文件勾选状态。
- 最终以 ESLint、TypeScript、测试和构建结果作为完成依据。

## 执行清单

- [x] 1. 新增 `docs/PROJECT_MAP.md`
  - 汇总页面、组件、Composables、Utils、API、Store、Router 等已有能力。
  - 给 AI 一个低 Token 的“先看这里”入口。
  - 明确哪些能力应复用，哪些场景不要继续抽象。

- [x] 2. 新增 `docs/PAGE_PATTERNS.md`
  - 建立“需求类型 → 推荐参考页面”索引。
  - 覆盖 CRUD、普通列表、权限按钮、上传下载、登录等现有样板。
  - 页面 Skill 优先读索引，找不到再搜索仓库。

- [x] 3. 新增 `docs/COMPONENTS.md`
  - 记录 `CustomTable`、`CustomDialog`、`Screenfull` 的适用边界。
  - 明确特殊需求可以直接使用 Element Plus 原生组件。
  - 防止 AI 把轻量组件继续扩展成复杂框架。

- [x] 4. 明确自动生成代码边界
  - 在 `AGENTS.md` 中列出 API Generator 管理的生成区域。
  - 明确 `constants/registry.ts` 是生成聚合文件，不代表业务允许新增 Registry。
  - 避免 AI 把生成器内部结构当作业务设计范例。

- [x] 5. 收敛 `AGENTS.md`
  - 保留最高优先级原则、目录边界、禁止事项和验证规则。
  - 将组件、页面范式、Composables、Utils 等细节指向对应 docs。
  - 增加 git diff / 修改范围自检规则，限制 AI “顺手重构”。

- [x] 6. 简化 Layout 跳转层级
  - 将唯一的 `layouts/modes/LeftMode.vue` 合并到 `layouts/index.vue`。
  - 删除已经没有多布局意义的 `modes` 中间层。
  - 保持现有视觉和响应式行为不变。

- [x] 7. 更新 AI 工作流文档与页面 Skill
  - `v3-generate-page` 优先读取 `PAGE_PATTERNS.md` 和 `PROJECT_MAP.md`。
  - `docs/AI_SKILLS.md` 补充项目地图/页面范式/组件目录的职责。
  - 不增加新的 `v3-use-utils` / `v3-use-composables` Skill。

- [x] 8. 最终验证
  - 检查改动是否只覆盖本计划范围。
  - 运行/确认 ESLint、TypeScript、Vitest、Build。
  - 修复本次修改引入的问题。
  - 全部完成后将本清单全部勾选。

## 不在本轮范围

- 新增多主题、多布局。
- 引入 Schema Form / Schema Table。
- 引入 EventBus。
- 引入新的 Service / Repository / Manager / Registry 层。
- 增加 Mock 框架。
- 将项目改成 Monorepo。
- 新增更多永久 Agent Skill。


## 本轮验证结果

验证基准提交：`8b651e9c07bafc8d948df3f0d312f4c90c79993f`

GitHub Actions：`Quality Check #192`

- [x] Install dependencies
- [x] ESLint + TypeScript typecheck
- [x] Vitest
- [x] Vite build
- [x] 本轮 diff 仅包含计划范围内文件
- [x] `src/layouts/modes/LeftMode.vue` 已删除，合并后的布局通过构建检查

> 本验证之后仅更新本计划文档的勾选与验证记录，不影响应用代码。


## 第二阶段：Skill 去重瘦身

目标：5 个 Skill 只保留“任务触发 + 执行步骤 + 本 Skill 独有规则”，全局原则统一引用 `AGENTS.md`，页面/组件/项目能力统一引用 docs，避免重复消耗上下文。

- [x] 9. 精简 `v3-generate-page`
  - 删除与 `AGENTS.md`、`PAGE_PATTERNS.md`、`COMPONENTS.md` 重复的编码规则。
  - 只保留页面任务入口、参考顺序、关联 Skill 和完成步骤。

- [x] 10. 精简 `v3-connect-api`
  - 修正旧请求层路径和过时约定。
  - 保留 Swagger、特殊接口、上传/下载、全局 request 修改门槛等接口专属规则。
  - 删除通用架构/编码原则重复描述。

- [ ] 11. 精简 `v3-upsert-route`
  - 保留路由放置位置、权限语义、菜单图标联动和路由检查。
  - 删除已由 `AGENTS.md` 统一约束的通用禁止项。

- [ ] 12. 精简 `v3-upsert-store`
  - 保留“是否需要 Store”的判断和 setup 外访问规则。
  - 删除重复的架构和代码风格说明。

- [ ] 13. 精简 `v3-use-icons`
  - 保留 Iconify / 本地 SVG 选择与路由 safelist 规则。
  - 删除重复禁止项和冗长示例。

- [ ] 14. 第二阶段最终验证
  - 对比 5 个 Skill 前后总大小。
  - 检查 Skill 间职责是否仍有明显重复。
  - 确认没有新增 Skill。
  - GitHub Actions 中 lint / typecheck / test / build 全部通过。
