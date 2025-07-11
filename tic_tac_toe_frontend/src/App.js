import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';

// Placeholder pages (replace with real ones in further development)
function LoginPage() {
  return <div>Login Page</div>;
}
function SignupPage() {
  return <div>Signup Page</div>;
}
function LobbyPage() {
  return <div>Lobby Page</div>;
}
function GamePage() {
  return <div>Game Page</div>;
}
function LeaderboardPage() {
  return <div>Leaderboard Page</div>;
}

// PRIVATE: For protecting routes that require login
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            {/* Navigation bar placeholder */}
            {/* TODO: Add Link components here */}
          </header>
          <Routes>
            <Route path="/" element={<Navigate to="/lobby" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/lobby" element={
              <PrivateRoute>
                <LobbyPage />
              </PrivateRoute>
            }/>
            <Route path="/game/:gameId" element={
              <PrivateRoute>
                <GamePage />
              </PrivateRoute>
            }/>
            <Route path="/leaderboard" element={
              <PrivateRoute>
                <LeaderboardPage />
              </PrivateRoute>
            }/>
            <Route path="*" element={<div>404: Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
