// 工具超市：默认所有工具免登录，只有 gate.json 里 loginTools 列出的高级工具需要登录。
// 这些工具都在浏览器本地运行，这里只是「软门槛」，目的是引导注册，
// 不是安全边界；真正要保护的服务端能力由网关做鉴权。
import { categories } from '../config/tools.js';
import { getToolIdFromPath } from './disabled-tools.js';
import { escapeHtml } from './helpers.js';

interface GateConfig {
  loginTools: string[];
  loginPath: string;
  sessionUrl: string;
}

let gate: GateConfig | null = null;
const loginOnly = new Set<string>();

// 只对真实存在的工具页设门槛，首页、关于页等不受影响
const knownTools = new Set<string>(
  categories.flatMap((c) =>
    c.tools
      .map((t: { href?: string }) => t.href?.match(/\/([^/]+)\.html$/)?.[1])
      .filter((id): id is string => !!id)
  )
);

export async function loadGateConfig(): Promise<void> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}gate.json`, {
      cache: 'no-cache',
    });
    if (!res.ok) return;
    if (!(res.headers.get('content-type') || '').includes('application/json'))
      return;
    const cfg = (await res.json()) as Partial<GateConfig>;
    gate = {
      loginTools: Array.isArray(cfg.loginTools) ? cfg.loginTools : [],
      loginPath: cfg.loginPath || '/login/',
      sessionUrl: cfg.sessionUrl || '/api/auth/session',
    };
    gate.loginTools.forEach((id) => loginOnly.add(id));
  } catch {
    gate = null; // 没有配置文件时不设门槛（例如本地单独开发 PDF 子站）
  }
}

export function requiresLogin(toolId: string | null): boolean {
  return !!gate && !!toolId && knownTools.has(toolId) && loginOnly.has(toolId);
}

export function loginBadge(): HTMLSpanElement {
  const badge = document.createElement('span');
  badge.className =
    'absolute top-2 right-2 text-[10px] leading-none px-1.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30';
  badge.textContent = '登录可用';
  return badge;
}

interface Session {
  loggedIn: boolean;
  user?: { name: string };
}

let sessionPromise: Promise<Session> | null = null;
function getSession(): Promise<Session> {
  sessionPromise ??= fetch(gate?.sessionUrl || '/api/auth/session', {
    credentials: 'same-origin',
  })
    .then((r) => (r.ok ? r.json() : { loggedIn: false }))
    .catch(() => ({ loggedIn: false }));
  return sessionPromise;
}

// 顶部导航右侧：显示登录用户，和主站一致
export async function renderAccount(): Promise<void> {
  const box = document.getElementById('tm-account');
  if (!box) return;
  const s = await getSession();
  if (!s.loggedIn || !s.user) return;
  box.innerHTML = '';
  const avatar = document.createElement('span');
  avatar.className =
    'grid h-8 w-8 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700';
  avatar.textContent = s.user.name.slice(0, 1);
  const name = document.createElement('span');
  name.className = 'ml-2 mr-3 max-w-32 truncate text-gray-300';
  name.textContent = s.user.name;
  const out = document.createElement('button');
  out.className = 'text-gray-500 hover:text-gray-300';
  out.textContent = '退出';
  out.onclick = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
    location.reload();
  };
  box.append(avatar, name, out);
}

export async function enforceLoginGate(): Promise<void> {
  const toolId = getToolIdFromPath();
  if (!requiresLogin(toolId)) return;
  if ((await getSession()).loggedIn) return;

  const next = encodeURIComponent(location.pathname + location.search);
  const title = escapeHtml(
    document.querySelector('h1')?.textContent?.trim() || '这个工具'
  );
  const overlay = document.createElement('div');
  overlay.id = 'login-gate';
  overlay.className =
    'fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/70 backdrop-blur-sm px-4';
  overlay.innerHTML = `
    <div class="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center shadow-2xl">
      <i class="ph ph-lock-key text-5xl text-amber-300"></i>
      <h2 class="mt-4 text-xl font-bold text-white">登录后免费使用「${title}」</h2>
      <p class="mt-3 text-sm text-gray-400 leading-relaxed">
        这是高级工具，用渡鸥AI、豹发GEO 等任一产品账号登录后同样免费。<br />
        文件始终在你的浏览器里处理，不会上传。
      </p>
      <a href="${gate!.loginPath}?next=${next}"
         class="mt-6 inline-block w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">去登录</a>
      <a href="/"
         class="mt-3 inline-block w-full py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700">看看免登录的工具</a>
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}
