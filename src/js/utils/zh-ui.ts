// 工具超市：上游有 50 多个工具页的主按钮没有接入翻译（写死英文）。
// 页面是中文时，把这些按钮文字换成中文；不改动上游的页面文件，方便以后合并上游更新。
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

export function applyZhButtonText(): void {
  if (!i18next.language?.startsWith('zh') || i18next.language === 'zh-TW') return;
  document.querySelectorAll<HTMLButtonElement>('button').forEach((btn) => {
    const walker = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const key = n.nodeValue?.trim();
      if (key && ZH[key]) n.nodeValue = n.nodeValue!.replace(key, ZH[key]);
    }
  });
}
