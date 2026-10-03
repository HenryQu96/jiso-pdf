import { createLanguageSwitcher } from '../i18n/language-switcher.js';

// Handle simple mode adjustments for tool pages
if (__SIMPLE_MODE__) {
  // 工具超市：按翻译标识判断要隐藏的区块（原来按英文标题文字判断，标题被翻译成中文后就隐藏不掉，整块英文说明会露出来）
  const sectionKeys = ['howItWorks.title', 'relatedTools.title', 'faq.sectionTitle'];
  const sectionsToHide = [
    'How It Works',
    'Related PDF Tools',
    'Related Tools',
    'Frequently Asked Questions',
  ];

  document.querySelectorAll('section').forEach((section) => {
    const h2 = section.querySelector('h2');
    if (h2) {
      const key = h2.getAttribute('data-i18n') || '';
      const heading = h2.textContent?.trim() || '';
      if (
        sectionKeys.includes(key) ||
        sectionsToHide.some((text) => heading.includes(text))
      ) {
        (section as HTMLElement).style.display = 'none';
      }
    }
  });

  const langContainer = document.getElementById('simple-mode-lang-switcher');
  if (langContainer) {
    const switcher = createLanguageSwitcher();
    const dropdown = switcher.querySelector('div[role="menu"]');
    if (dropdown) {
      dropdown.classList.remove('mt-2');
      dropdown.classList.add('bottom-full', 'mb-2');
    }
    langContainer.appendChild(switcher);
  }
}
