import React from 'react';

export default function HeroStats({ hero, compact = false }) {
  const hpPct = (hero.hp / hero.maxHp) * 100;
  const mpPct = (hero.mp / hero.maxMp) * 100;
  const xpPct = (hero.xp / hero.xpToNext) * 100;

  const hpColor = hpPct > 60 ? '#2ecc71' : hpPct > 30 ? '#f39c12' : '#e74c3c';

  if (compact) {
    return (
      <div className="hero-stats-compact">
        <div className="compact-top">
          <span className="compact-emoji">{hero.emoji}</span>
          <div className="compact-info">
            <span className="compact-name">{hero.name}</span>
            <span className="compact-level">Lv.{hero.level} · Floor {hero.floor}</span>
          </div>
          <div className="compact-gold">💰 {hero.gold}</div>
        </div>
        <div className="compact-bars">
          <div className="stat-bar-row">
            <span className="stat-bar-label">HP</span>
            <div className="stat-bar">
              <div className="stat-bar__fill" style={{ width: `${hpPct}%`, background: hpColor }} />
            </div>
            <span className="stat-bar-val">{hero.hp}/{hero.maxHp}</span>
          </div>
          <div className="stat-bar-row">
            <span className="stat-bar-label">MP</span>
            <div className="stat-bar">
              <div className="stat-bar__fill" style={{ width: `${mpPct}%`, background: '#3498db' }} />
            </div>
            <span className="stat-bar-val">{hero.mp}/{hero.maxMp}</span>
          </div>
          <div className="stat-bar-row">
            <span className="stat-bar-label">XP</span>
            <div className="stat-bar">
              <div className="stat-bar__fill" style={{ width: `${xpPct}%`, background: '#f1c40f' }} />
            </div>
            <span className="stat-bar-val">{hero.xp}/{hero.xpToNext}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-stats-full" style={{ '--hero-color': hero.color }}>
      <div className="stats-header">
        <div className="stats-avatar">
          <span className="stats-avatar__emoji">{hero.emoji}</span>
          <div className="stats-avatar__ring" />
        </div>
        <div className="stats-identity">
          <h2 className="stats-name">{hero.name}</h2>
          <p className="stats-class">{hero.class}</p>
          <div className="stats-badges">
            <span className="stats-badge">⚡ Lv.{hero.level}</span>
            <span className="stats-badge">🏰 Floor {hero.floor}</span>
            <span className="stats-badge">💀 {hero.totalKills} kills</span>
          </div>
        </div>
        <div className="stats-gold-box">
          <div className="gold-icon">💰</div>
          <div className="gold-amount">{hero.gold}</div>
          <div className="gold-label">Gold</div>
        </div>
      </div>

      {/* Vital Bars */}
      <div className="stats-bars">
        <div className="vital-row">
          <div className="vital-icon">❤️</div>
          <div className="vital-bar-wrap">
            <div className="vital-bar">
              <div className="vital-bar__fill" style={{ width: `${hpPct}%`, background: hpColor }} />
              <div className="vital-bar__shine" />
            </div>
            <div className="vital-nums">{hero.hp} / {hero.maxHp} HP</div>
          </div>
        </div>
        <div className="vital-row">
          <div className="vital-icon">🔷</div>
          <div className="vital-bar-wrap">
            <div className="vital-bar">
              <div className="vital-bar__fill" style={{ width: `${mpPct}%`, background: '#3498db' }} />
              <div className="vital-bar__shine" />
            </div>
            <div className="vital-nums">{hero.mp} / {hero.maxMp} MP</div>
          </div>
        </div>
        <div className="vital-row">
          <div className="vital-icon">⭐</div>
          <div className="vital-bar-wrap">
            <div className="vital-bar">
              <div className="vital-bar__fill" style={{ width: `${xpPct}%`, background: '#f1c40f' }} />
              <div className="vital-bar__shine" />
            </div>
            <div className="vital-nums">{hero.xp} / {hero.xpToNext} XP</div>
          </div>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="stats-grid">
        {[
          { label: 'ATK', value: hero.attack, icon: '⚔️' },
          { label: 'DEF', value: hero.defense, icon: '🛡️' },
          { label: 'SPD', value: hero.speed, icon: '💨' },
          { label: 'MAX HP', value: hero.maxHp, icon: '❤️' },
        ].map(s => (
          <div key={s.label} className="stat-cell">
            <span className="stat-cell__icon">{s.icon}</span>
            <span className="stat-cell__val">{s.value}</span>
            <span className="stat-cell__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tactics Tracker */}
      {hero.totalKills > 0 && (
        <div className="tactics-tracker">
          <p className="tactics-title">🤖 AI Combat Analysis</p>
          <div className="tactics-bars">
            {['attack', 'defend', 'special'].map(t => {
              const total = Math.max(1, hero.tacticsUsed.attack + hero.tacticsUsed.defend + hero.tacticsUsed.special);
              const pct = Math.round((hero.tacticsUsed[t] / total) * 100);
              const colors = { attack: '#e74c3c', defend: '#3498db', special: '#9b59b6' };
              return (
                <div key={t} className="tactic-row">
                  <span className="tactic-label">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                  <div className="tactic-bar">
                    <div className="tactic-fill" style={{ width: `${pct}%`, background: colors[t] }} />
                  </div>
                  <span className="tactic-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
