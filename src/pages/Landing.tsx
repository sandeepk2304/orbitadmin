import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Shield, FolderKanban, CheckSquare, BarChart2, Settings,
  ArrowRight, ChevronDown, Code2, Check, Copy, KeyRound,
} from 'lucide-react';
import OrbitLogo from '../components/OrbitLogo';
import ThemeToggle from '../components/ThemeToggle';

/**
 * Landing page.
 *
 * Rewritten around one idea: show the product. The previous version made its
 * case entirely in adjectives — "premium", "feature-packed",
 * "production-ready" — above a page with no picture of the thing being sold.
 * Anyone evaluating an admin template wants to see the tables and the charts
 * before they read a word, so the screenshots are now the hero, captured from
 * the running app rather than drawn, and every module tile deep-links into
 * the live demo instead of describing it.
 *
 * The other change is honesty. The demo is a front end against mock data;
 * saying so on the page costs nothing and saves the first fifteen minutes of
 * anyone's evaluation.
 */

const SHOTS = [
  { src: '/screenshots/dashboard.webp', label: 'Dashboard', caption: 'KPI cards, revenue trend and an activity feed.' },
  { src: '/screenshots/users.webp', label: 'Users', caption: 'Sortable, searchable table with row actions.' },
  { src: '/screenshots/tasks.webp', label: 'Tasks', caption: 'Workflow board with priorities and assignees.' },
  { src: '/screenshots/reports.webp', label: 'Reports', caption: 'Revenue against expenses, exportable.' },
];

const FEATURES = [
  { icon: <LayoutDashboard size={20} />, title: 'Dashboard that earns its space', desc: 'KPI tiles, a 12-month revenue area chart, quick actions and a live activity feed — not four empty cards.' },
  { icon: <Shield size={20} />, title: 'Roles and a permission matrix', desc: 'A grid of roles against capabilities, toggled per cell, ready to wire to whatever your API calls a scope.' },
  { icon: <FolderKanban size={20} />, title: 'Projects with real columns', desc: 'Owners, due dates, budgets and progress derived from the data rather than hard-coded.' },
  { icon: <CheckSquare size={20} />, title: 'Task board', desc: 'Todo, In Progress, Review, Done, with priority and assignee, and empty states that say something useful.' },
  { icon: <BarChart2 size={20} />, title: 'Reports and CSV export', desc: 'Recharts graphs with abbreviated axes, and a download path your finance person will actually use.' },
  { icon: <Settings size={20} />, title: 'Settings in four panes', desc: 'General, profile, security and notification thresholds, each a plain form with validation.' },
];

const MODULES = [
  { name: 'Dashboard', route: '/dashboard', desc: 'Business overview' },
  { name: 'Users', route: '/dashboard/users', desc: 'Accounts and status' },
  { name: 'Roles & permissions', route: '/dashboard/roles-permissions', desc: 'Access matrix' },
  { name: 'Projects', route: '/dashboard/projects', desc: 'Progress and budgets' },
  { name: 'Tasks', route: '/dashboard/tasks', desc: 'Workflow board' },
  { name: 'Reports', route: '/dashboard/reports', desc: 'Charts and exports' },
  { name: 'Notifications', route: '/dashboard/notifications', desc: 'Inbox and read state' },
  { name: 'Settings', route: '/dashboard/settings', desc: 'Four configuration panes' },
];

const STACK = [
  ['React 19', 'with the new compiler-friendly patterns'],
  ['TypeScript', 'strict mode, no implicit any'],
  ['Tailwind CSS v4', 'tokens in CSS variables, themeable per brand'],
  ['React Router 7', 'nested routes, protected sections, real 404s'],
  ['TanStack Query', 'caching, retries and loading states'],
  ['MIT licence', 'use it commercially, no attribution required'],
];

const FAQS = [
  {
    q: 'Is the demo backed by a real server?',
    a: 'No, and that is deliberate. The demo signs in against two constants in AuthContext and reads mock data, so you can click through every screen without provisioning anything. Swapping in your own API is a single file: point the client at your base URL and delete the mock module.',
  },
  {
    q: 'How do I connect my own backend?',
    a: 'Each screen takes its data from a hook rather than calling the network itself, so the change is confined to the data layer: replace the mock client with a typed client against your REST or GraphQL endpoint, keep the hook signatures, and every screen keeps working.',
  },
  {
    q: 'Can I restyle it for my brand?',
    a: 'The palette lives in CSS variables, so a brand swap is a token change rather than a search-and-replace across components. Dark mode is built in and persists in localStorage.',
  },
  {
    q: 'What is not included?',
    a: 'No backend, no database, no auth provider, no payment integration, no email. It is the front end of an admin panel — the part that is tedious to build and easy to get wrong — and it expects you to bring the rest.',
  },
  {
    q: 'What are the licence terms?',
    a: 'MIT. Modify it, ship it inside a commercial product, sell dashboards built with it. No attribution required.',
  },
];

const FOOTER_LINKS: Array<{
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    title: 'Product',
    links: [
      { label: 'Live demo', href: '/login' },
      { label: 'Screens', href: '#screens' },
      { label: 'Features', href: '#features' },
      { label: 'Tech stack', href: '#stack' },
    ],
  },
  {
    title: 'Modules',
    links: [
      { label: 'Dashboard', href: '/login?next=%2Fdashboard' },
      { label: 'Users', href: '/login?next=%2Fdashboard%2Fusers' },
      { label: 'Roles & permissions', href: '/login?next=%2Fdashboard%2Froles-permissions' },
      { label: 'Reports', href: '/login?next=%2Fdashboard%2Freports' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/sandeepk2304/orbitadmin', external: true },
      { label: 'Report an issue', href: 'https://github.com/sandeepk2304/orbitadmin/issues', external: true },
      { label: 'Questions', href: '#faq' },
      { label: 'MIT licence', href: 'https://opensource.org/licenses/MIT', external: true },
      { label: 'Built by Sandeep', href: 'https://www.hisandeep.com/', external: true },
    ],
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [shot, setShot] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyCredentials = async () => {
    try {
      await navigator.clipboard.writeText('admin@orbitadmin.com / admin123');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked outside a secure context; the credentials are
      // printed beside the button anyway, so there is nothing to recover from.
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d14] text-slate-900 dark:text-slate-100 transition-colors font-sans">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-colors dark:border-white/5 dark:bg-[#0d0d14]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <OrbitLogo showText />

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400 md:flex">
            <a href="#screens" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Screens</a>
            <a href="#features" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Features</a>
            <a href="#stack" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Stack</a>
            <a href="#faq" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Hidden on a phone: "Live demo" goes to the same place, and at
                390px the two buttons together wrapped "Sign in" onto a second
                line inside the header. */}
            <button
              onClick={() => navigate('/login')}
              className="hidden cursor-pointer px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 sm:block"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-700"
            >
              Live demo <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-28 pb-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
            Open source admin template · MIT
          </span>

          <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[3.25rem]">
            The admin panel,
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              already built
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[34rem] text-[17px] leading-[1.65] text-slate-500 dark:text-slate-400">
            Eight working screens — tables, forms, charts, a permission matrix and a task
            board — on React 19, TypeScript and Tailwind v4. Bring your API; the tedious
            half is done.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Open the live demo <ArrowRight size={16} />
            </button>
            <a
              href="https://github.com/sandeepk2304/orbitadmin"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:bg-[#1a1a27] dark:text-slate-200"
            >
              <Code2 size={16} /> Source on GitHub
            </a>
          </div>

          {/* The demo credentials, on the page rather than in the source. */}
          <button
            onClick={copyCredentials}
            className="mx-auto mt-6 flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200/70 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:border-white/5 dark:bg-white/5 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            {copied ? <Check size={13} /> : <KeyRound size={13} />}
            admin@orbitadmin.com · admin123
            {copied ? <span className="text-indigo-500">copied</span> : <Copy size={13} />}
          </button>
        </div>

        {/* ── The product itself ─────────────────────────────────────────── */}
        <div id="screens" className="relative z-10 mx-auto mt-14 max-w-6xl scroll-mt-20">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {SHOTS.map((item, i) => (
              <button
                key={item.label}
                onClick={() => setShot(i)}
                aria-current={shot === i}
                className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  shot === i
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:text-indigo-600 dark:bg-[#1a1a27] dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* A browser frame, so the screenshot reads as a product and not as
              a decorative image floating on the page. */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#1a1a27] dark:shadow-black/40">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-white/5 dark:bg-[#15151f]">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 truncate rounded bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-400 dark:bg-[#0d0d14]">
                orbitadmin{MODULES[shot]?.route ?? '/dashboard'}
              </span>
            </div>
            <img
              src={SHOTS[shot].src}
              alt={`${SHOTS[shot].label} screen: ${SHOTS[shot].caption}`}
              width={1440}
              height={900}
              loading="eager"
              className="block w-full"
            />
          </div>
          <p className="mt-3 text-center text-sm text-slate-400">{SHOTS[shot].caption}</p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 border-t border-slate-100 px-6 py-20 dark:border-white/5">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-[1.75rem] font-semibold md:text-[2rem]">What is in the box</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-500 dark:text-slate-400">
            Every screen below is in the demo. Nothing here is a mock-up or a roadmap item.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200/70 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-white/5 dark:bg-[#1a1a27] dark:hover:border-indigo-500/30"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules: every one a link into the demo ──────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-20 dark:border-white/5 dark:bg-[#11111a]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-[1.75rem] font-semibold md:text-[2rem]">Jump straight in</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-500 dark:text-slate-400">
            Each tile opens that screen in the demo. No sign-up — the credentials are
            filled for you.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((module) => (
              <button
                key={module.route}
                onClick={() => navigate(`/login?next=${encodeURIComponent(module.route)}`)}
                className="group cursor-pointer rounded-xl border border-slate-200/70 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-300 dark:border-white/5 dark:bg-[#1a1a27] dark:hover:border-indigo-500/40"
              >
                <span className="flex items-center justify-between text-[15px] font-semibold">
                  {module.name}
                  <ArrowRight
                    size={14}
                    className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500"
                  />
                </span>
                <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                  {module.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack ────────────────────────────────────────────────────────── */}
      <section id="stack" className="scroll-mt-20 border-t border-slate-100 px-6 py-20 dark:border-white/5">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-[1.75rem] font-semibold md:text-[2rem]">Built on what you already use</h2>
            <p className="mt-4 leading-relaxed text-slate-500 dark:text-slate-400">
              No bespoke framework, no proprietary component layer to learn and no runtime
              you have to keep up with. If you have shipped a React app, you can read every
              file in this one.
            </p>

            <ul className="mt-8 space-y-3">
              {STACK.map(([name, detail]) => (
                <li key={name} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-sm">
                    <span className="font-semibold">{name}</span>
                    <span className="text-slate-500 dark:text-slate-400"> — {detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shows the one change a developer actually has to make. */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#11111a] shadow-xl dark:border-white/10">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-[11px] font-medium text-slate-500">src/api/client.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-slate-300">
              <code>{`// Point it at your own API and the mock data is gone.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// One interceptor refreshes an expired token
// and replays the request that hit the 401.
api.interceptors.response.use(ok, refreshOnce);

export default api;`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-t border-slate-100 bg-slate-50 px-6 py-20 dark:border-white/5 dark:bg-[#11111a]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-[1.75rem] font-semibold md:text-[2rem]">Questions</h2>

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, i) => {
              const open = activeFaq === i;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-xl border border-slate-200/70 bg-white dark:border-white/5 dark:bg-[#1a1a27]"
                >
                  <button
                    onClick={() => setActiveFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold"
                  >
                    {faq.q}
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 px-6 py-20 text-center dark:border-white/5">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[1.75rem] font-semibold md:text-[2rem]">Have a look around</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-500 dark:text-slate-400">
            The demo is the whole template, running. Click through it before you decide
            whether it saves you a fortnight.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mx-auto mt-8 flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Open the live demo <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/*
        A real footer, not a copyright line.
        
        Two jobs: catch the people who scrolled the whole page without
        clicking anything — which is most of them — and answer the questions
        that decide an evaluation. Nothing here is invented: every link goes
        to a route that exists or an anchor on this page, because a footer
        full of dead links is worse than a short one.
      */}
      <footer className="border-t border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#11111a]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="max-w-xs">
              <OrbitLogo showText />
              <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                An open-source admin front end: eight working screens on React 19,
                TypeScript and Tailwind v4. Bring your own API.
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {['React 19', 'TypeScript', 'Tailwind v4', 'MIT'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-400 dark:ring-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {FOOTER_LINKS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-900 dark:text-white">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('#') || link.external ? (
                        <a
                          href={link.href}
                          {...(link.external
                            ? { target: '_blank', rel: 'noreferrer' }
                            : {})}
                          className="text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <button
                          onClick={() => navigate(link.href)}
                          className="cursor-pointer text-left text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        >
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-400 dark:border-white/5 sm:flex-row">
            <p>
              © {new Date().getFullYear()} OrbitAdmin. MIT licensed — use it commercially,
              no attribution required.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Demo runs on mock data
              </p>
              {/* The person who built it, named and linked. */}
              <a
                href="https://www.hisandeep.com/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Designed &amp; built by
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Sandeep
                </span>
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
