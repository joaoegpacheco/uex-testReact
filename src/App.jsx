import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
  const isAuthenticated = !!localStorage.getItem('currentUser');

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/login" element={isAuthenticated ? <HomePage /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
