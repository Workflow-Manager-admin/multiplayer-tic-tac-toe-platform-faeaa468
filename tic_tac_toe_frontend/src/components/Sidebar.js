import React from "react";
import "./Sidebar.css";

// PUBLIC_INTERFACE
export default function Sidebar({ history, leaderboard, onSelectGame }) {
  /**
   * Sidebar shows tabbed match history and leaderboard.
   */
  const [tab, setTab] = React.useState("history");
  return (
    <aside className="sidebar">
      <nav>
        <button className={tab==="history"?"active":""} onClick={()=>setTab("history")}>Match History</button>
        <button className={tab==="leaderboard"?"active":""} onClick={()=>setTab("leaderboard")}>Leaderboard</button>
      </nav>
      <div className="sidebar-content">
        {tab === "history" ? (
          <HistoryList history={history} onSelectGame={onSelectGame}/>
        ) : (
          <Leaderboard leaderboard={leaderboard}/>
        )}
      </div>
    </aside>
  );
}

function HistoryList({ history, onSelectGame }) {
  return !history?.length ? <div className="empty">No previous games.</div> : (
    <ul className="history-list">
      {history.map((game,i) => (
        <li key={game.id}>
          <button className="link" onClick={() => onSelectGame(game.id)}>
            <span className="date">{(game.ended_at || game.started_at)?.slice(0,10)}</span>
            <span className="summary">{game.players?.join(" vs ")||""} 
            {game.winner ? ` — Winner: ${game.winner}` : ""}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Leaderboard({ leaderboard }) {
  return !leaderboard?.length ? <div className="empty">No rankings yet.</div> : (
    <ol className="leaderboard">
      {leaderboard.map((entry, i) => (
        <li key={entry.user}>
          <span>{i+1}.</span>
          <span className="uname">{entry.user}</span>
          <span className="score">{entry.score}</span>
        </li>
      ))}
    </ol>
  );
}
