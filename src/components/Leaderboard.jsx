import React from 'react';

export default function Leaderboard({ entries, currentHero, onBack }) {
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">🏆 Hall of Legends</h2>
        <p className="leaderboard-sub">Top adventurers of the Agentic Realm</p>
        <button className="lb-back-btn" onClick={onBack}>← Back</button>
      </div>

      {entries.length === 0 ? (
        <div className="lb-empty">
          <span className="lb-empty-icon">🏆</span>
          <p>No champions yet. Be the first to claim glory!</p>
        </div>
      ) : (
        <div className="lb-list">
          {entries.map((entry, i) => (
            <div
              key={i}
              className={`lb-entry ${i < 3 ? 'lb-entry--top' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="lb-rank">{medals[i] || `#${i + 1}`}</div>
              <div className="lb-hero-info">
                <span className="lb-hero-emoji">{entry.emoji}</span>
                <div>
                  <p className="lb-hero-name">{entry.heroName}</p>
                  <p className="lb-hero-meta">{entry.heroClass} · Floor {entry.floor} · Lv.{entry.level}</p>
                </div>
              </div>
              <div className="lb-score-col">
                <div className="lb-score">{entry.score.toLocaleString()}</div>
                <div className="lb-score-label">Score</div>
              </div>
              <div className="lb-stats-mini">
                <span className="lb-mini-stat">💀 {entry.kills}</span>
                <span className="lb-mini-stat">💰 {entry.gold}</span>
                <span className="lb-mini-stat">⭐ Lv.{entry.level}</span>
              </div>
              <div className="lb-date">{new Date(entry.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      {currentHero && (
        <div className="lb-current-run">
          <p className="lb-current-label">Current Run</p>
          <div className="lb-current-stats">
            <span>{currentHero.emoji} {currentHero.name}</span>
            <span>Lv.{currentHero.level}</span>
            <span>Floor {currentHero.floor}</span>
            <span>💀 {currentHero.totalKills} kills</span>
            <span>💰 {currentHero.gold}</span>
          </div>
        </div>
      )}
    </div>
  );
}
