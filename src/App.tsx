import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataPage from './pages/DataPage';
import Settings from './pages/Settings';
import OrderDetail from './pages/OrderDetail';
import UserDetail from './pages/UserDetail';
import Payments from './pages/Payments';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="data" element={<DataPage />} />
        <Route path="data/new" element={<UserDetail />} />
        <Route path="data/:id" element={<OrderDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>
    </Routes>
  );
}

export default App;
