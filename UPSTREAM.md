# 上游信息

- 上游：https://github.com/alam00000/bentopdf （AGPL-3.0）
- 基于提交：c10511203e7f5d3f2841c5073edf0c7a1b896e88（2026-10-01，v2.8.8）

## 我们的修改（合并上游更新时注意）

- 新增 `src/js/utils/login-gate.ts`：免登录名单 + 登录门槛 + 工具卡片上的「登录可用」标记
- `src/js/main.ts`：在 init 中调用 `loadGateConfig()` / `enforceLoginGate()`，渲染工具卡片时加标记
- 新增 `src/css/toolmart-theme.css`，在 `src/css/styles.css` 末尾 import：浅色主题
- `src/partials/navbar-simple.html`、`simple-index.html`：导航栏换成和主站一致的版本（含登录状态）
- `public/locales/zh/common.json`：`simpleMode` 标题文案
- 新增 `src/js/utils/toolbox-menu.ts`：顶部「工具箱」二级菜单，数据读主站的 `/menu.json`
- 新增 `src/js/utils/zh-ui.ts`：上游没接入翻译的 53 个主按钮，在中文界面下换成中文
- 品牌替换在构建后由 `deploy/rebrand-pdf.mjs` 完成，不改源码
