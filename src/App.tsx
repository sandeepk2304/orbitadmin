import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import RolesPermissions from './pages/RolesPermissions';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Console Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="roles-permissions" element={<RolesPermissions />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback to root landing page */}
      {/* A real 404, not a silent bounce to the landing page. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
