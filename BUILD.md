# 即搜 PDF 工具箱：构建说明

本仓库是 [BentoPDF](https://github.com/alam00000/bentopdf)（AGPL-3.0）的修改版，
用于深圳即搜科技有限公司网站上的「PDF 工具箱」（部署在 `/pdf/` 路径下）。
按 AGPL-3.0 第 13 条，我们公开修改后的完整源代码。

修改内容见 [UPSTREAM.md](./UPSTREAM.md)。

## 构建

```bash
npm ci
export BASE_URL=/pdf/ SIMPLE_MODE=true VITE_DEFAULT_LANGUAGE=zh COMPRESSION_MODE=o
export VITE_BRAND_NAME="你的品牌名" VITE_BRAND_LOGO="images/你的logo.png" SITE_URL="https://你的域名"
node scripts/generate-blog.mjs && node scripts/generate-static-tool-links.mjs && npx tsc && npx vite build \
  && node scripts/enhance-seo-pages.mjs && node scripts/generate-i18n-pages.mjs \
  && node scripts/generate-sitemap.mjs && node scripts/generate-security-headers.mjs
# 构建后把页面里的上游品牌名替换成自己的品牌名
node toolmart-build/rebrand-pdf.mjs dist toolmart-build/brand.example.json
```

运行时还会读取同域名下的几个地址（由我们网站的其他部分提供，不属于本仓库）：

| 地址 | 作用 | 没有时的表现 |
|---|---|---|
| `/pdf/gate.json` | 哪些工具需要登录 | 所有工具免登录 |
| `/pdf/config.json` | 下架的工具 | 全部工具可用 |
| `/api/auth/session` | 当前登录状态 | 视为未登录 |
| `/menu.json` | 顶部「工具箱」菜单 | 不显示菜单 |

即搜科技的商标、Logo 等品牌素材不包含在本仓库中，也不在 AGPL 授权范围内。
