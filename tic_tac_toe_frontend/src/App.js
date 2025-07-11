import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Board from './components/Board';
import GameLobby from './components/GameLobby';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import api from './services/apiService';

// PRIVATE: Navigation Header
function NavBar({ onLogin, onSignup, onLogout, showLogout, user }) {
  return (
    <nav className="navbar" style={{background:"#1976D2",color:"white",padding:"0.8em 1.2em",display:'flex',alignItems:'center',justifyContent:'space-between',borderRadius:"0 0 24px 24px",fontWeight:"bold"}}>
      <span style={{fontSize:"1.13em",letterSpacing:"1px"}}>Tic Tac Toe</span>
      {showLogout ? (
        <span style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontWeight:500,fontSize:"0.99em"}}>👤 {user?.username}</span>
          <button style={{background:"#424242",color:"white",border:"none",borderRadius:8,padding:"5px 19px",fontWeight:600,cursor:"pointer"}} onClick={onLogout}>Log Out</button>
        </span>
      ) : (
        <span>
          <button style={{background:"#1976D2",color:"white",border:"none",borderRadius:8,padding:"7px 19px",fontWeight:600,cursor:"pointer"}} onClick={onLogin}>Login</button>
          <button style={{background:"#FFEB3B",color:"#1976D2",border:"none",borderRadius:8,padding:"7px 19px",fontWeight:600,marginLeft:"11px",cursor:"pointer"}} onClick={onSignup}>Sign Up</button>
        </span>
      )}
    </nav>
  );
}

// PRIVATE: For protecting routes that require login
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// LOBBY PAGE
function LobbyPage() {
  const nav = useNavigate();
  // For demo: onNewGame/onJoinGame use dummy navigation
  const joinGame = (gid) => nav(`/game/${gid}`);
  const newGame = () => nav(`/game/new`);
  return (
    <Layout>
      <GameLobby onJoinGame={joinGame} onNewGame={newGame} />
    </Layout>
  );
}

// GAME PAGE (core mechanics + board)
function GamePage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movePending, setMovePending] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    setLoading(true);
    api.fetchGame(gameId)
      .then(setGame)
      .finally(()=>setLoading(false));
  }, [gameId]);

  const makeMove = async (idx) => {
    if (!game || !game.myTurn || movePending) return;
    setMovePending(true);
    try {
      const res = await api.makeMove(game.id, { cell: idx });
      setGame(res); // Replace with new game state
    } catch (e) {}
    setMovePending(false);
  };

  if (loading) return <Layout><div>Loading…</div></Layout>;
  if (!game) return <Layout><div>Game Not Found.</div></Layout>;

  return (
    <Layout sidebar>
      <div className="game-main">
        <div className="game-meta">
          <div>Players: <b>{game.players?.join(" vs ")}</b></div>
          <div>Status: {game.winner ? (
            <span style={{color:"#1976D2"}}>Winner: {game.winner}</span>
          ) : game.draw ? (
            <span style={{color:"#B71C1C"}}>Draw</span>
          ) : (
            <span style={{color:"#424242"}}>{game.myTurn ? "Your turn" : "Opponent's turn"}</span>
          )}</div>
        </div>
        <Board
          board={game.board || Array(9).fill("")}
          isMyTurn={game.myTurn}
          onCellClick={makeMove}
          disabled={!game.myTurn || !!game.winner || !!game.draw || movePending}
          winnerLine={game?.winner_line}
        />
      </div>
    </Layout>
  );
}

// LAYOUT: Includes Nav, main, and Sidebar option
function Layout({children, sidebar}) {
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(()=>{
    api.fetchLeaderboard().then(l=>setLeaderboard(l)).catch(()=>{});
    api.fetchLobby().then(l=>setHistory((l && l.completed_games)||[])).catch(()=>{});
  },[]);
  return (
    <div style={{display:"flex",flexDirection:"row",alignItems:"flex-start",justifyContent:"center",gap:24,marginTop:38}}>
      <main style={{flex:"1 0 350px",minWidth:0}}>{children}</main>
      {sidebar &&
        <Sidebar
          history={history}
          leaderboard={leaderboard}
          onSelectGame={gid=>window.location.assign(`/game/${gid}`)}
        />
      }
    </div>
  );
}

// Leaderboard page
function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(()=>{
    api.fetchLeaderboard().then(setLeaderboard).catch(()=>{});
  },[]);
  return (
    <Layout>
      <Sidebar leaderboard={leaderboard} history={[]} onSelectGame={()=>{}}/>
    </Layout>
  );
}

// MAIN APP
function App() {
  const [theme, setTheme] = useState('light');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // If not authenticated and at /login or /signup, show modal.
  // Modal overlays for login/signup
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar
            onLogin={() => setShowLogin(true)}
            onSignup={() => setShowSignup(true)}
            onLogout={logout}
            showLogout={isAuthenticated}
            user={user}
          />
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{position:"fixed",top:16,right:18,zIndex:15}}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <AuthModal mode="login" open={showLogin} onClose={()=>setShowLogin(false)} />
          <AuthModal mode="signup" open={showSignup} onClose={()=>setShowSignup(false)} />
          <Routes>
            <Route path="/" element={<Navigate to="/lobby" replace />} />
            <Route path="/login" element={<div><AuthModal mode="login" open={true} onClose={()=>window.location.assign('/lobby')} /></div>} />
            <Route path="/signup" element={<div><AuthModal mode="signup" open={true} onClose={()=>window.location.assign('/lobby')} /></div>} />
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
