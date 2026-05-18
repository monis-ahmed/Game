import React from 'react';

export default function StartScreen({ onStart, onLeaderboard }) {
  const [particles] = React.useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 4,
    }))
  );

  return (
    <div className="start-screen">
      {/* Animated background particles */}
      <div className="start-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Logo / Title */}
      <div className="start-logo">
        <div className="start-logo__emblem">
          <span className="emblem-icon">⚔️</span>
          <div className="emblem-ring emblem-ring--1" />
          <div className="emblem-ring emblem-ring--2" />
          <div className="emblem-ring emblem-ring--3" />
        </div>
        <h1 className="start-title">
          <span className="title-chrono">Chrono</span>
          <span className="title-quest">Quest</span>
        </h1>
        <p className="start-subtitle">The Agentic Realm</p>
        <div className="start-divider" />
        <p className="start-tagline">
          An AI Dungeon Master watches every move.<br />
          <em>No two runs are ever the same.</em>
        </p>
      </div>

      {/* Feature highlights */}
      <div className="start-features">
        <div className="feature-chip">🤖 AI Dungeon Master</div>
        <div className="feature-chip">⚡ Dynamic Difficulty</div>
        <div className="feature-chip">∞ Infinite Dungeons</div>
        <div className="feature-chip">🎯 Adaptive Enemies</div>
      </div>

      {/* CTA Buttons */}
      <div className="start-actions">
        <button className="btn-start" onClick={onStart}>
          <span className="btn-start__glow" />
          <span>⚔️ Begin Your Quest</span>
        </button>
        <button className="btn-leaderboard" onClick={onLeaderboard}>
          🏆 Leaderboard
        </button>
      </div>

      {/* AI Badge */}
      <div className="start-ai-badge">
        <span className="ai-dot" />
        Powered by Google Antigravity · Agentic AI
      </div>

      <div className="start-version">v1.0.0 · Challenge 4 Entry</div>
    </div>
  );
}
