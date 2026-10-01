// 构建后处理 PDF 子站：把页面里的 BentoPDF 品牌名换成我们的品牌名。
// 只改展示用的 HTML/JSON/XML，不动 JS 代码；版权和许可证声明保留在 /source/ 页面和仓库 LICENSE 中。
// 带 data-keep 的元素（例如页脚的开源致谢「基于 BentoPDF 修改」）原样保留，不替换。
// 改过的文件如果有预压缩的 .br 版本，一并重新生成，避免 nginx 发出旧内容。
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { brotliCompressSync } from 'node:zlib';

const [, , distDir, brandFile] = process.argv;
const brand = JSON.parse(readFileSync(brandFile, 'utf8'));
const TEXT_EXT = new Set(['.html', '.json', '.xml', '.webmanifest', '.txt']);

let changed = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!TEXT_EXT.has(extname(name))) continue;
    const src = readFileSync(p, 'utf8');
    const kept = [];
    const out = src
      .replace(/<(\w+)[^>]*\bdata-keep\b[^>]*>[\s\S]*?<\/\1>/g, (m) => `\u0000KEEP${kept.push(m) - 1}\u0000`)
      .replaceAll('https://www.bentopdf.com', brand.siteUrl + '/pdf')
      .replaceAll('BentoPDF', brand.name)
      // 上游的推特、领英、GitHub 账号不是我们的，替换品牌名后会变成不存在的「@网站名」，直接去掉
      .replace(/[ \t]*<meta name="twitter:(site|creator)"[^>]*>\n?/g, '')
      .replace(/,\s*"sameAs":\s*\[[^\]]*\]/g, '')
      .replace(/\u0000KEEP(\d+)\u0000/g, (_, i) => kept[Number(i)]);
    if (out === src) continue;
    writeFileSync(p, out);
    if (existsSync(p + '.br')) writeFileSync(p + '.br', brotliCompressSync(out));
    changed++;
  }
}

walk(distDir);
console.log(`[rebrand] ${changed} files updated -> ${brand.name}`);
