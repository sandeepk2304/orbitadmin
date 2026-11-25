# OrbitAdmin — Premium SaaS Admin Dashboard Template

> A premium, production-quality React admin dashboard built for startups, SaaS products, CRM systems, and internal enterprise tools. Built with React 19, TypeScript, Tailwind CSS v4, and Recharts.

---

## 🚀 OrbitAdmin Premium Experience

OrbitAdmin is designed as a developer-friendly starter kit and a state-of-the-art administrative portal. It includes a custom local storage database service to ensure all CRUD mutations are fully persisted across page reloads.

### Key Visual & UX Polish
- **Sleek Glassmorphic Aesthetics**: Modern dark mode support, harmonized HSL color tokens, curated Google Fonts (Outfit & Plus Jakarta Sans), and smooth transition micro-animations.
- **Root Landing Page**: Fully responsive landing page highlighting core features, interactive animations, and dark/light toggles.
- **Roles & Permission Matrix**: A custom checklist grid to map individual access scopes across roles in real-time.
- **Projects & Tasks Workflow**: Tasks are linked to project cards with automatic progress calculations updating the dashboard overview metrics.
- **Dynamic Ledger & Reports**: Beautiful interactive Area and Bar charts displaying annual transaction counts, intakes, and operating yields.

---

## 🛠️ Tech Stack

| Layer | Library / Tool |
|---|---|
| **UI Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Routing** | React Router v7 |
| **Forms & Validation** | React Hook Form + Zod |
| **Charts** | Recharts 3 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |

---

## ✨ Enterprise Features

- **Authentication** — Sandbox login (`admin@orbitadmin.com` / `admin123`) with protected routes and context session states.
- **Local Storage Database Service** — Complete mockup SaaS database seeding users, roles, permissions, projects, tasks, settings, and logs on first boot.
- **Custom Hooks Integration** — Fully isolated hooks (`useUsers`, `useRoles`, `useProjects`, `useTasks`, `useSettings`, `useNotifications`, `useDashboardData`) keeping views strictly rendering visual elements.
- **Reusable Foundation UI** — Modular typed wrappers for `DataTable` (with sorting and pagination), `FormBuilder` (mapping Zod validators directly to HTML inputs), `ConfirmDialog`, `Modal`, `StatusBadge`, and `PageHeader`.
- **Persisted Dark Mode** — Clean class-based dark mode toggle synced with system preferences and cached in storage.

---

## 📁 Directory Structure

```
src/
├── components/          # Reusable foundation UI components
│   ├── ConfirmDialog.tsx # Destruction verification modal
│   ├── DataTable.tsx     # Generic table with search, sorting, pagination
│   ├── FormBuilder.tsx   # Dynamic form renderer powered by React Hook Form + Zod
│   ├── Layout.tsx        # Branded layout sidebar and header
│   ├── Modal.tsx         # Overlay container
│   ├── OrbitLogo.tsx     # Gradient SVG Orbit logo component
│   ├── PageHeader.tsx    # Standardized section banner
│   ├── ProtectedRoute.tsx # Route authentication check
│   └── StatusBadge.tsx   # State badge resolver (e.g. Active, High, Done)
├── context/
│   ├── auth.ts           # useAuth hook and context
│   ├── AuthContext.tsx   # Session provider
│   ├── theme.ts          # useTheme hook and context
│   └── ThemeContext.tsx  # Theme provider
├── hooks/                # Isolated CRUD and mutation hooks
│   ├── useDashboardData.ts
│   ├── useNotifications.ts
│   ├── usePermissions.ts
│   ├── useProjects.ts
│   ├── useRoles.ts
│   ├── useSettings.ts
│   ├── useTasks.ts
│   └── useUsers.ts
├── pages/                # High-fidelity dashboard views
│   ├── Dashboard.tsx
│   ├── Landing.tsx       # Marketing landing page
│   ├── Login.tsx         # Rebranded sandbox login
│   ├── Notifications.tsx # Audit log notifications list
│   ├── Projects.tsx      # Project budget and checklist ledger
│   ├── Reports.tsx       # Recharts comparative graphs
│   ├── RolesPermissions.tsx # Role creator and checklist matrix
│   ├── Settings.tsx      # Tabbed parameters (general, profile, security, notifications)
│   └── Users.tsx         # Team roster data table and drawers
├── services/
│   └── storageService.ts # Local Storage CRUD mock database engine
├── types/
│   └── index.ts          # Unified TS interface types
├── utils/
│   ├── csv.ts            # CSV text and download
│   └── progress.ts       # Project progress, calculated from its tasks
├── App.tsx               # Route mapping, one lazy chunk per screen
└── index.css             # Tailwind v4 configuration, font family setup, scrollbars
```

---

## ⚙️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
npm run preview
```

---

## 🔐 Sandbox Credentials

Use the following credentials on the login screen to access the admin panel:
- **Email:** `admin@orbitadmin.com`
- **Password:** `admin123`

---

## 📄 License

[MIT](LICENSE). Free to use as a starting template or reference for SaaS applications.
