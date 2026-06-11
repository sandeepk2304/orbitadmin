import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Users, CreditCard, BarChart2, PieChart,
  Shield, Zap, Smartphone, Moon, Check, ArrowRight, Star, Github, ExternalLink,
  ChevronRight,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: <LayoutDashboard size={22} />, title: 'E-Commerce Dashboard', desc: 'KPI cards, sales report with Today/Monthly/Annual chart, top products, store performance donut.' },
  { icon: <ShoppingCart size={22} />, title: 'Orders Management', desc: 'Stat cards, sortable table, payment method badges, order status pills, delete confirmation modal.' },
  { icon: <Users size={22} />, title: 'Customer Directory', desc: 'Avatar, country flag, phone, joined date, total spend. Sortable columns, bulk selection, CSV export.' },
  { icon: <CreditCard size={22} />, title: 'Payments & Transactions', desc: 'Success rate KPI, transaction ledger, method badges (Visa / PayPal / Stripe), status filters.' },
  { icon: <BarChart2 size={22} />, title: 'Financial Reports', desc: 'Revenue vs Expenses grouped bar chart and growth trajectory area chart side by side.' },
  { icon: <PieChart size={22} />, title: 'Statistics', desc: 'Sales-by-category donut, conversion rate, average order value, and traffic source breakdown.' },
  { icon: <Shield size={22} />, title: 'Auth & Protected Routes', desc: 'Login with Zod validation, session persistence, automatic redirect for unauthenticated users.' },
  { icon: <Moon size={22} />, title: 'Dark / Light Mode', desc: 'One-click toggle persisted to localStorage. Every page fully supports both themes.' },
  { icon: <Smartphone size={22} />, title: 'Fully Responsive', desc: 'Collapsible sidebar, overflow-safe tables, fluid grid. Tested down to 375 px.' },
  { icon: <Zap size={22} />, title: 'REST API + TanStack Query', desc: 'Real data from JSONPlaceholder. Loading skeletons, error banners, and query caching out of the box.' },
];

const TECH = [
  { name: 'React 19',         color: 'bg-blue-100 text-blue-700' },
  { name: 'TypeScript',       color: 'bg-blue-100 text-blue-700' },
  { name: 'Vite 8',           color: 'bg-violet-100 text-violet-700' },
  { name: 'Tailwind CSS v4',  color: 'bg-cyan-100 text-cyan-700' },
  { name: 'React Router v7',  color: 'bg-orange-100 text-orange-700' },
  { name: 'TanStack Query v5',color: 'bg-red-100 text-red-700' },
  { name: 'Recharts 3',       color: 'bg-green-100 text-green-700' },
  { name: 'React Hook Form',  color: 'bg-pink-100 text-pink-700' },
  { name: 'Zod',              color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Axios',            color: 'bg-purple-100 text-purple-700' },
  { name: 'Lucide React',     color: 'bg-yellow-100 text-yellow-700' },
];

const SCREENSHOTS = [
  { label: 'Dashboard',    file: '/screenshots/dashboard.png' },
  { label: 'Orders',       file: '/screenshots/orders.png' },
  { label: 'Customers',    file: '/screenshots/customers.png' },
  { label: 'Payments',     file: '/screenshots/payments.png' },
  { label: 'Reports',      file: '/screenshots/reports.png' },
  { label: 'Statistics',   file: '/screenshots/statistics.png' },
  { label: 'Order Detail', file: '/screenshots/order-detail.png' },
  { label: 'Login',        file: '/screenshots/login.png' },
];

const FREE_FEATURES = [
  'All 8 pages included',
  'Dark & Light mode',
  'REST API integration',
  'TanStack Query caching',
  'Loading skeletons',
  'Responsive layout',
  'Login & protected routes',
  'MIT License',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Invoice page',
  'Calendar page',
  'Chat / Inbox page',
  'Multiple color themes',
  'Priority email support',
  'Figma design file',
  'Lifetime updates',
];

const TESTIMONIALS = [
  { name: 'Alex Turner', role: 'Full Stack Developer', text: 'Saved me 2 weeks of setup. The code quality is exactly what I needed for my SaaS project.', stars: 5 },
  { name: 'Priya Sharma', role: 'Freelance Developer', text: 'Used this as a base for a client project. Customization was straightforward and the dark mode works perfectly.', stars: 5 },
  { name: 'Marco Rossi', role: 'Frontend Engineer', text: 'Clean architecture, proper TypeScript, real API integration. Not just another pretty template.', stars: 5 },
];

// ─── Subcomponents ───────────────────────────────────────────────────────────

function NavBar({ onDemo, onLogin }: { onDemo: () => void; onLogin: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="text-lg font-black text-[#11191f] tracking-tight">MetoAdmin</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#screenshots" className="hover:text-indigo-600 transition-colors">Screenshots</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#tech" className="hover:text-indigo-600 transition-colors">Tech Stack</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin} className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5">
            Sign In
          </button>
          <button onClick={onDemo} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
            Live Demo <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onDemo, onGithub }: { onDemo: () => void; onGithub: () => void }) {
  return (
    <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6 uppercase tracking-widest">
          🚀 Open Source · MIT License
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-[#11191f] leading-tight mb-6">
          The Admin Dashboard<br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Built for Production
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          MetoAdmin is a full-featured React admin dashboard — ecommerce-focused, API-connected, dark mode ready, and mobile responsive. Skip weeks of setup and ship faster.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={onDemo} className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200">
            Open Live Demo <ArrowRight size={16} />
          </button>
          <button onClick={onGithub} className="flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-[#11191f] font-bold rounded-xl border border-gray-200 transition-colors shadow-sm">
            <Github size={16} /> View on GitHub
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400 font-semibold">
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> React 19 + TypeScript</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Tailwind CSS v4</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> 8 Pages included</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Dark mode</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> MIT License</span>
        </div>
      </div>

      {/* Hero screenshot */}
      <div className="max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100 border border-gray-200">
        <img src="/screenshots/dashboard.png" alt="MetoAdmin Dashboard" className="w-full object-cover" />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">What's Included</span>
          <h2 className="text-4xl font-black text-[#11191f] mt-2">Everything you need</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">No bloat. Just the pages and components a real admin panel needs, built clean and ready to customise.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-bold text-[#11191f] mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Screenshots({ onDemo }: { onDemo: () => void }) {
  return (
    <section id="screenshots" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Preview</span>
          <h2 className="text-4xl font-black text-[#11191f] mt-2">See every page</h2>
          <p className="text-gray-400 mt-3">8 fully built pages, all connected to a live API.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCREENSHOTS.map((s, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all">
              <div className="relative overflow-hidden">
                <img src={s.file} alt={s.label} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button onClick={onDemo} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#11191f] text-xs font-bold rounded-lg">
                    <ExternalLink size={12} /> Open Demo
                  </button>
                </div>
              </div>
              <div className="px-4 py-3 bg-white border-t border-gray-100">
                <p className="text-sm font-bold text-[#11191f]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section id="tech" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Built With</span>
        <h2 className="text-4xl font-black text-[#11191f] mt-2 mb-4">Modern Tech Stack</h2>
        <p className="text-gray-400 mb-12">No legacy dependencies. All libraries are on their latest major versions.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {TECH.map((t, i) => (
            <span key={i} className={`px-4 py-2 rounded-full text-sm font-bold ${t.color}`}>{t.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Reviews</span>
          <h2 className="text-4xl font-black text-[#11191f] mt-2">Devs love it</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="font-bold text-[#11191f] text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onDemo }: { onDemo: () => void }) {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Pricing</span>
          <h2 className="text-4xl font-black text-[#11191f] mt-2">Simple, honest pricing</h2>
          <p className="text-gray-400 mt-3">Free to use and customize. Pro version adds extra pages and assets.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="rounded-2xl border border-gray-200 p-8">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Free</p>
            <p className="text-5xl font-black text-[#11191f] mb-1">$0</p>
            <p className="text-sm text-gray-400 mb-8">Forever. MIT License.</p>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check size={15} className="text-emerald-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button onClick={onDemo} className="w-full py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              Open Demo <ChevronRight size={16} />
            </button>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-indigo-600 p-8 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
            <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">POPULAR</div>
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Pro</p>
            <p className="text-5xl font-black text-[#11191f] mb-1">$49</p>
            <p className="text-sm text-gray-400 mb-8">One-time payment. Lifetime access.</p>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check size={15} className="text-indigo-600 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
              Get Pro — $49 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black text-white mb-4">Ready to ship faster?</h2>
        <p className="text-indigo-200 mb-10 text-lg">Open the live demo and see MetoAdmin in action. No signup required.</p>
        <button onClick={onDemo} className="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-700 font-black rounded-xl hover:bg-indigo-50 transition-colors shadow-xl text-lg">
          Open Live Demo <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Footer({ onDemo }: { onDemo: () => void }) {
  return (
    <footer className="bg-[#11191f] text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs">M</div>
          <span className="text-white font-black tracking-tight">MetoAdmin</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#screenshots" className="hover:text-white transition-colors">Screenshots</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <button onClick={onDemo} className="hover:text-white transition-colors">Live Demo</button>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} MetoAdmin. MIT License.</p>
      </div>
    </footer>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();

  const openDemo  = () => navigate('/login');
  const openLogin = () => navigate('/login');
  const openGithub = () => window.open('https://github.com', '_blank');

  return (
    <div className="font-sans">
      <NavBar onDemo={openDemo} onLogin={openLogin} />
      <Hero onDemo={openDemo} onGithub={openGithub} />
      <Features />
      <Screenshots onDemo={openDemo} />
      <TechStack />
      <Testimonials />
      <Pricing onDemo={openDemo} />
      <CTA onDemo={openDemo} />
      <Footer onDemo={openDemo} />
    </div>
  );
}
