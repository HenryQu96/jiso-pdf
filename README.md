# 即搜 PDF 工具箱

深圳即搜科技有限公司网站上「PDF 工具箱」的源代码。所有 PDF 处理都在用户的浏览器里完成，文件不上传服务器。

本项目基于开源项目 [BentoPDF](https://github.com/alam00000/bentopdf) 修改，按 **GNU AGPL-3.0** 协议开源（见 [LICENSE](./LICENSE)）。
上游项目的英文原版说明见 [README.en.md](./README.en.md)。

## 功能

100 多个 PDF 工具，包括：

- **转换**：Word / Excel / PPT / 图片 / HEIC 转 PDF，PDF 转 Word / Excel / 图片 / Markdown
- **整理**：合并、拆分、删页、提取、排序、旋转、多页合一、小册子
- **编辑**：编辑器、加水印、页码、页眉页脚、签名、表单、裁剪、目录
- **安全**：加密、解密（需原密码）、数字签名、涂黑、清理隐私信息
- **其他**：压缩、修复、OCR、PDF/A、PDF 比对

## 我们做了哪些修改

详见 [UPSTREAM.md](./UPSTREAM.md)，主要有：

- 浅色主题（`src/css/toolmart-theme.css`），和即搜网站风格一致
- 顶部导航换成「工具箱」二级菜单（`src/js/utils/toolbox-menu.ts`）
- 部分高级工具需要登录后使用（`src/js/utils/login-gate.ts`）
- 中文界面文案调整、构建后替换品牌名（`toolmart-build/rebrand-pdf.mjs`）

## 构建

见 [BUILD.md](./BUILD.md)。

## 说明

- 即搜科技的商标、Logo 等品牌素材不包含在本仓库中，也不在 AGPL 授权范围内。
- 即搜网站的其他部分（主站、其他工具、账号服务）不属于本仓库。
- 原项目版权归 BentoPDF 作者所有，修改部分版权归深圳即搜科技有限公司所有。
