import React, { useState, useEffect } from "react";
import api from "../services/apiService";

// PUBLIC_INTERFACE
export default function GameLobby({ onJoinGame, onNewGame }) {
  /**
   * Renders the lobby: shows available games (waiting, in-progress), lets user join or start new.
   */
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch lobby data once when mounted
    let mounted = true;
    setLoading(true);
    api.fetchLobby()
      .then(data => { if (mounted) setGames(data.games || []); })
      .catch(() => { if (mounted) setGames([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <h2>Game Lobby</h2>
        <button className="btn" onClick={onNewGame} style={{background:"#1976D2", color:"white"}}>
          + New Game
        </button>
      </div>
      {loading ? <p>Loading games…</p> : (
        <div className="lobby-list">
          {games.length === 0 ? <div className="empty">No open games.</div> : (
            <ul>
              {games.map(game => (
                <li key={game.id}>
                  <span className="gname">
                    <b>{game.status === "waiting" ? "🕑 Waiting" : "🕹️ Playing"}:</b>{" "}
                    {game.players?.join(" vs ") || game.id}
                  </span>
                  <button className="btn-flat" onClick={() => onJoinGame(game.id)} disabled={game.status !== "waiting"}>
                    Join
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
