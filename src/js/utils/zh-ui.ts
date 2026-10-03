// 工具超市：上游不少工具页的按钮、选项、提示写死了英文，没有接入翻译。
// 页面是简体中文时，按词典把这些文字换成中文（含上传文件后才出现的界面、弹窗）。
// 不改动上游的页面文件，方便以后合并上游更新。词典：zh-ui-dict.json（只有中文页面才加载）。
import i18next from 'i18next';

const ZH: Record<string, string> = {
  'Add Attachments': '添加附件',
  'Add Blank Pages': '插入空白页',
  'Add Header & Footer': '添加页眉页脚',
  'Add Page Numbers': '添加页码',
  'Add Watermark': '添加水印',
  'Apply Bates Numbers': '添加 Bates 编号',
  'Apply Rotations': '应用旋转',
  'Change Background Color': '修改背景颜色',
  'Change Permissions': '修改权限',
  'Change Text Color': '修改文字颜色',
  'Combine Pages': '合并为单页',
  'Compress PDF': '压缩 PDF',
  'Convert to CSV': '转换为 CSV',
  'Convert to DOCX': '转换为 Word',
  'Convert to Excel': '转换为 Excel',
  'Convert to Greyscale': '转换为灰度',
  'Convert to Markdown': '转换为 Markdown',
  'Convert to Outlines': '文字转为轮廓',
  'Convert to PDF': '转换为 PDF',
  'Convert to PDF/A': '转换为 PDF/A',
  'Convert to SVG': '转换为 SVG',
  'Create N-Up PDF': '生成多页合一 PDF',
  'Create ZIP Archive': '打包为 ZIP',
  'Decrypt PDF': '解除密码',
  'Delete Pages & Download': '删除页面并下载',
  'Deskew PDF': '自动纠偏',
  'Divide Pages': '分割页面',
  'Encrypt PDF': '加密 PDF',
  'Extract & Download ZIP': '提取并下载 ZIP',
  'Extract Attachments': '提取附件',
  'Extract Images': '提取图片',
  'Extract Tables': '提取表格',
  'Extract for AI': '整理成 AI 可读格式',
  'Fix Page Size': '统一页面尺寸',
  'Flatten PDF(s)': '扁平化 PDF',
  'Invert Colors': '反转颜色',
  'Linearize PDF(s)': '优化网页加载（线性化）',
  'Load Layers': '读取图层',
  'Merge PDFs': '合并 PDF',
  'Mix Pages': '交替合并页面',
  'Posterize PDF': '拆分为海报拼贴',
  'Rasterize PDF': '转换为图片版 PDF',
  'Remove All Metadata': '删除全部元数据',
  'Remove Annotations': '删除批注',
  'Remove Restrictions': '解除限制',
  'Remove Selected Blank Pages': '删除选中的空白页',
  'Reverse Pages': '倒序排列页面',
  'Sanitize PDF': '清理隐私信息',
  'Save & Download Filled Form': '保存并下载填好的表单',
  'Save & Download Signed PDF': '保存并下载已签名的 PDF',
  'Save Changes': '保存修改',
  'Save Metadata': '保存元数据',
  'Split PDF': '拆分 PDF',
};

// 用户自己的内容不翻：PDF 预览文字层、可编辑区域、输入框、Markdown 编辑器和预览、代码、图表
const SKIP =
  'script,style,code,pre,svg,[contenteditable],.textLayer,.annotationLayer,' +
  '#markdown-editor-container,#simple-mode-lang-switcher,[data-no-zh]';
const ATTRS = ['placeholder', 'title', 'aria-label'] as const;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

let dict: Record<string, string> = ZH;

function translateText(node: Text): void {
  const raw = node.nodeValue;
  if (!raw || !/[A-Za-z]/.test(raw)) return;
  const zh = dict[norm(raw)];
  if (!zh) return;
  const parent = node.parentElement;
  if (!parent || parent.tagName === 'TEXTAREA' || parent.closest(SKIP)) return; // 文本框里是用户输入的内容
  // 保留原来前后的空白，排版不变
  node.nodeValue = raw.match(/^\s*/)![0] + zh + raw.match(/\s*$/)![0];
}

function translateAttrs(el: Element): void {
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    const zh = v && dict[norm(v)];
    if (zh && !el.closest(SKIP)) el.setAttribute(a, zh);
  }
}

function translateTree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) return translateText(root as Text);
  if (!(root instanceof Element)) return;
  if (root.closest(SKIP)) return;
  translateAttrs(root);
  root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(translateAttrs);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) translateText(n as Text);
}

let started = false;

async function start(): Promise<void> {
  if (started) return;
  started = true;
  translateTree(document.body); // 先用内置的按钮词典，马上生效
  try {
    const full = (await import('./zh-ui-dict.json')).default as Record<string, string>;
    dict = { ...full, ...ZH };
  } catch {
    // 词典加载失败就只翻按钮
  }
  translateTree(document.body);
  // 之后页面上新出现的内容（上传文件后的设置、弹窗、提示）也翻译
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'childList') r.addedNodes.forEach(translateTree);
      else if (r.type === 'characterData') translateText(r.target as Text);
      else if (r.type === 'attributes') translateAttrs(r.target as Element);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS],
  });
}

// 中文页面（/pdf/zh/，<html lang="zh">）一加载就开始翻译，不等其他初始化，避免先闪一下英文
if (/^zh(?!-TW)/i.test(document.documentElement.lang)) void start();

// 语言初始化完成后再确认一次（例如用户在页面里切换成了简体中文）
export async function applyZhButtonText(): Promise<void> {
  if (!i18next.language?.startsWith('zh') || i18next.language === 'zh-TW') return;
  await start();
}
