// 工具超市：PDF 子站顶部的「工具箱」二级菜单。数据来自主站构建出的 /menu.json，和主站菜单保持一致。
interface MenuTool {
  name: string;
  desc: string;
  href: string;
  login: boolean;
}
interface MenuGroup {
  id: string;
  title: string;
  href: string;
  intro: string;
  count: number;
  tools: MenuTool[];
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) => {
  const e = document.createElement(tag);
  e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

export async function setupToolboxMenu(): Promise<void> {
  const wrap = document.getElementById('tm-tb');
  const btn = document.getElementById('tm-tb-btn');
  const panel = document.getElementById('tm-tb-panel');
  if (!wrap || !btn || !panel) return;

  let groups: MenuGroup[] = [];
  try {
    groups = await fetch('/menu.json').then((r): Promise<MenuGroup[]> | MenuGroup[] => (r.ok ? r.json() : []));
  } catch {
    return;
  }
  if (!groups.length) return;

  // 左：分类列表；右：当前分类的工具
  const left = el('ul', 'tm-tb-groups');
  const right = el('div', 'tm-tb-tools');
  const panes = new Map<string, HTMLElement>();
  const items = new Map<string, HTMLElement>();
  for (const g of groups) {
    const li = el('li', '');
    const a = el('a', 'tm-tb-group');
    a.href = g.href;
    a.append(el('span', 'tm-tb-group-name', g.title), el('span', 'tm-tb-count', g.id === 'pdf' ? `${g.count}+` : String(g.count)));
    li.appendChild(a);
    left.appendChild(li);
    items.set(g.id, a);

    const pane = el('div', 'tm-tb-pane');
    pane.hidden = true;
    const head = el('div', 'tm-tb-head');
    const titles = el('div', '');
    titles.append(el('div', 'tm-tb-title', g.title), el('p', 'tm-tb-intro', g.intro));
    const more = el('a', 'tm-tb-more', g.id === 'pdf' ? '全部 PDF 工具 →' : `进入${g.title} →`);
    more.href = g.href;
    head.append(titles, more);
    const grid = el('div', 'tm-tb-grid');
    for (const t of g.tools) {
      const ta = el('a', 'tm-tb-tool');
      ta.href = t.href;
      const name = el('span', 'tm-tb-tool-name', t.name);
      if (t.login) name.appendChild(el('span', 'tm-tb-login', '登录'));
      ta.append(name, el('span', 'tm-tb-tool-desc', t.desc));
      grid.appendChild(ta);
    }
    pane.append(head, grid);
    right.appendChild(pane);
    panes.set(g.id, pane);

    const show = () => {
      items.forEach((x, id) => x.classList.toggle('is-on', id === g.id));
      panes.forEach((x, id) => (x.hidden = id !== g.id));
    };
    a.addEventListener('mouseenter', show);
    a.addEventListener('focus', show);
  }
  panel.append(left, right);
  // 默认显示 PDF 分类（当前就在 PDF 工具箱里）
  items.get('pdf')?.dispatchEvent(new Event('mouseenter'));

  let timer = 0;
  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };
  wrap.addEventListener('mouseenter', () => {
    clearTimeout(timer);
    setOpen(true);
  });
  wrap.addEventListener('mouseleave', () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => setOpen(false), 180);
  });
  btn.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target as Node)) setOpen(false);
  });
}
