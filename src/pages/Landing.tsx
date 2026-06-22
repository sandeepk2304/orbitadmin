import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Shield, FolderKanban, CheckSquare, BarChart2, Settings,
  Check, ArrowRight, ExternalLink, ChevronDown, Moon, Sun
} from 'lucide-react';
import OrbitLogo from '../components/OrbitLogo';

// Feature items list
const FEATURES = [
  { icon: <LayoutDashboard size={22} />, title: 'SaaS Analytics Dashboard', desc: 'KPI cards, real-time revenue analytics charts, active project trackers, growth metrics, and quick actions.' },
  { icon: <Shield size={22} />, title: 'Roles & Permission Matrix', desc: 'Manage role assignments and toggles across a permission grid. Control feature authorization dynamically.' },
  { icon: <FolderKanban size={22} />, title: 'Project Management', desc: 'List active projects with due dates, budgets, team members, and automatic progress bars.' },
  { icon: <CheckSquare size={22} />, title: 'Kanban Tasks & Priorities', desc: 'Manage task workflow statuses (Todo, In Progress, Review, Done) and priorities (High, Medium, Low).' },
  { icon: <BarChart2 size={22} />, title: 'Financial & Growth Reports', desc: 'Aggregate revenue vs expenses charts and growth trajectory metrics, ready to export as CSV ledgers.' },
  { icon: <Settings size={22} />, title: 'Tabbed System Settings', desc: 'Four dedicated panes to configure General, Profile, Security, and email/push Notification thresholds.' },
];

const MODULES = [
  { name: 'Dashboard', route: '/dashboard', desc: 'High-level business intelligence overview' },
  { name: 'Users List', route: '/dashboard/users', desc: 'User accounts CRUD and status management' },
  { name: 'Permissions Matrix', route: '/dashboard/roles-permissions', desc: 'Role access controls and permissions grid' },
  { name: 'Projects Ledger', route: '/dashboard/projects', desc: 'Track progress, members, and budgets' },
  { name: 'Tasks board', route: '/dashboard/tasks', desc: 'Workflow board with priorities and assignees' },
  { name: 'Reports Overview', route: '/dashboard/reports', desc: 'Recharts-powered revenue/expense graphs' },
  { name: 'System Settings', route: '/dashboard/settings', desc: 'General, profile, security tabs' },
];

const FAQS = [
  {
    q: 'What is OrbitAdmin?',
    a: 'OrbitAdmin is a premium, developer-friendly admin dashboard built for startups, SaaS products, CRM systems, internal tools, and enterprise applications. It includes prebuilt modules and a generic design for speed.'
  },
  {
    q: 'Can I integrate it with a real backend?',
    a: 'Absolutely. OrbitAdmin is designed with clean architecture and SOLID principles. The business logic is separated from components in custom hooks (useUsers, useRoles, useProjects). You can swap out the local storage database service with actual NestJS/PostgreSQL REST API endpoints easily.'
  },
  {
    q: 'Does it support dark mode?',
    a: 'Yes, it has a built-in Dark & Light mode system styled using Tailwind CSS v4. The setting persists in localStorage across browser sessions.'
  },
  {
    q: 'What are the license terms?',
    a: 'OrbitAdmin is licensed under the MIT License. You are free to modify, build SaaS applications, or sell custom dashboards made with this template.'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleDemo = () => {
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d14] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      
      {/* Header NavBar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0d0d14]/75 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <OrbitLogo showText />
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#modules" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Modules</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg bg-slate-100 dark:bg-[#1a1a27] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => navigate('/login')} 
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={handleDemo} 
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              Live Demo <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Glowing backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6 tracking-wide border border-indigo-200/50 dark:border-indigo-500/20">
            🚀 Commercial-Grade Admin Dashboard Template
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            The Production-Ready Foundation<br />
            <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              For Your SaaS CRM & Apps
            </span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            OrbitAdmin is a premium, feature-packed admin template built on React, TypeScript, and Tailwind CSS. Skip weeks of boilerplate setup and launch your SaaS internal tools instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={handleDemo} 
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 cursor-pointer"
            >
              Launch Live Demo <ArrowRight size={16} />
            </button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-[#1a1a27] hover:bg-slate-50 dark:hover:bg-[#222235] text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-white/5 transition-all shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> View on GitHub
            </a>
          </div>

          {/* Quick specs badge */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-400 dark:text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5"><Check size={15} className="text-emerald-500" /> React + TypeScript</span>
            <span className="flex items-center gap-1.5"><Check size={15} className="text-emerald-500" /> Tailwind CSS v4</span>
            <span className="flex items-center gap-1.5"><Check size={15} className="text-emerald-500" /> Persisted Dark Mode</span>
            <span className="flex items-center gap-1.5"><Check size={15} className="text-emerald-500" /> MIT License</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-[#11111a] border-y border-slate-200/50 dark:border-white/5 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Premium Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Everything you need, built to scale</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">No placeholders. Fully interactive dashboards, user CRUD list, roles settings, permission matrix grid, and task workflow modules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-slate-100 dark:border-white/[0.03] bg-slate-50/50 dark:bg-[#1a1a27]/20 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all hover:shadow-md group"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Modules Section */}
      <section id="modules" className="py-20 px-6 bg-slate-50 dark:bg-[#0d0d14] transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text */}
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pre-Built Pages</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-6">Fully interactive SaaS dashboard modules</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                OrbitAdmin includes the core screens required for modern business portals. Manage users list, toggle statuses, change user roles, modify permissions matrix checkbox grid, organize project boards, and control Settings tabs.
              </p>
              
              <div className="space-y-3">
                {MODULES.slice(0, 4).map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{mod.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Code/UI card preview */}
            <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-xl p-8 transition-colors">
              <h3 className="text-lg font-bold mb-4">Module Routes Checklist</h3>
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {MODULES.map((mod, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{mod.name}</p>
                      <p className="text-xs text-slate-400 font-semibold">{mod.desc}</p>
                    </div>
                    <button 
                      onClick={() => navigate(mod.route)}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                    >
                      Inspect <ExternalLink size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-white dark:bg-[#11111a] border-t border-slate-200/50 dark:border-white/5 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Questions</span>
            <h2 className="text-3xl font-extrabold mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/30 dark:bg-[#1a1a27]/10 overflow-hidden transition-colors"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/20 dark:border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to enhance your development speed?
          </h2>
          <p className="text-indigo-200 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            Open the live demo portal, sign in with sandbox credentials, and check the code architecture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleDemo} 
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 font-extrabold rounded-xl hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer text-base"
            >
              Sign In to Sandbox
            </button>
            <button 
              onClick={handleDemo} 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-500/30 text-white font-bold rounded-xl border border-white/20 hover:bg-indigo-500/40 transition-colors cursor-pointer text-base"
            >
              Explore Sandbox Modules
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <OrbitLogo showText textColor="text-white" />
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#modules" className="hover:text-white transition-colors">Modules</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button onClick={handleDemo} className="hover:text-white transition-colors cursor-pointer">Live Demo</button>
          </div>
          
          <p className="text-sm">© {new Date().getFullYear()} OrbitAdmin. Released under the MIT License.</p>
        </div>
      </footer>

    </div>
  );
}
