import React from 'react';

export default function GameOver({ hero, score, onRestart, onLeaderboard }) {
  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <div className="game-over-skull">💀</div>
        <h2 className="game-over-title">You Fell...</h2>
        <p className="game-over-subtitle">
          The Agentic Realm has claimed another soul.<br />
          But your legend lives on.
        </p>

        <div className="game-over-stats">
          <div className="go-stat">
            <div className="go-stat__val">{hero.level}</div>
            <div className="go-stat__label">Level Reached</div>
          </div>
          <div className="go-stat">
            <div className="go-stat__val">{hero.floor}</div>
            <div className="go-stat__label">Floor Reached</div>
          </div>
          <div className="go-stat">
            <div className="go-stat__val">{hero.totalKills}</div>
            <div className="go-stat__label">Enemies Slain</div>
          </div>
          <div className="go-stat">
            <div className="go-stat__val">{hero.gold}</div>
            <div className="go-stat__label">Gold Earned</div>
          </div>
        </div>

        <div className="go-score">
          <div className="go-score__label">Final Score</div>
          <div className="go-score__val">{score.toLocaleString()}</div>
        </div>

        <div className="go-hero-preview">
          <span className="go-hero-emoji">{hero.emoji}</span>
          <div>
            <p className="go-hero-name">{hero.name}</p>
            <p className="go-hero-class">{hero.class} · {hero.sessionsWon} victories</p>
          </div>
        </div>

        <div className="go-actions">
          <button className="btn-restart" onClick={onRestart}>
            ⚔️ Try Again
          </button>
          <button className="btn-go-leaderboard" onClick={onLeaderboard}>
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
