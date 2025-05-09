import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { currentUser } = useAuth();
const isAuthenticated = !!currentUser;

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Navigate to="/login" replace/> : <Navigate to="/dashboard" replace/>} />
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/login" element={isAuthenticated ? <HomePage /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
