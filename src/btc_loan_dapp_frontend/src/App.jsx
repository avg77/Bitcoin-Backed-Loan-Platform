import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './components/Dashboard';
import LoanActions from './components/LoanActions';
import LoanHistory from './components/LoanHistory';
import Layout from './components/Layout';
import { useAuth } from './auth/AuthProvider';
import './App.css';

function App() {
  const { isAuthenticated, login, logout, principal, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      login();
    }
  }, [isAuthenticated, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Unauthenticated Landing Page */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" />
              : <LandingPage onGetStarted={login} />
          }
        />

        {/* Authenticated Pages Wrapped with Layout */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <Dashboard principal={principal} />
              </Layout>
            ) : <Navigate to="/" />
          }
        />
        <Route
          path="/loan-actions"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <LoanActions />
              </Layout>
            ) : <Navigate to="/" />
          }
        />
        <Route
          path="/loan-history"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <LoanHistory />
              </Layout>
            ) : <Navigate to="/" />
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
