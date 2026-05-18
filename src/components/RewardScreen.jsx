import React from 'react';

export default function RewardScreen({ rewards, hero, leveledUp, onContinue }) {
  const [revealed, setRevealed] = React.useState(false);
  const [lootRevealed, setLootRevealed] = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 300);
    const t2 = setTimeout(() => setLootRevealed(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="reward-screen">
      <div className={`reward-content ${revealed ? 'reward-content--visible' : ''}`}>
        {/* Victory title */}
        <div className="reward-title-area">
          <div className="reward-trophy">🏆</div>
          <h2 className="reward-title">Victory!</h2>
          <p className="reward-subtitle">Combat resolved — Referee Seal: ✅ VERIFIED</p>
        </div>

        {/* Efficiency badge */}
        {rewards.efficiency && (
          <div className={`efficiency-badge efficiency-badge--${rewards.efficiency.toLowerCase()}`}>
            {rewards.efficiency === 'Excellent' ? '⚡' : rewards.efficiency === 'Good' ? '👍' : '⚔️'}
            &nbsp;{rewards.efficiency} Performance
            {rewards.turnsUsed && <span> · {rewards.turnsUsed} turns</span>}
          </div>
        )}

        {/* XP & Gold */}
        <div className={`reward-cards ${lootRevealed ? 'reward-cards--visible' : ''}`}>
          <div className="reward-card reward-card--xp">
            <div className="reward-card__icon">⭐</div>
            <div className="reward-card__amount">+{rewards.xp}</div>
            <div className="reward-card__label">Experience</div>
          </div>
          <div className="reward-card reward-card--gold">
            <div className="reward-card__icon">💰</div>
            <div className="reward-card__amount">+{rewards.gold}</div>
            <div className="reward-card__label">Gold</div>
          </div>
          {rewards.loot && (
            <div className="reward-card reward-card--loot">
              <div className="reward-card__icon">{rewards.loot.emoji}</div>
              <div className="reward-card__amount">{rewards.loot.name}</div>
              <div className="reward-card__label" style={{ textTransform: 'capitalize' }}>
                {rewards.loot.rarity} item
              </div>
            </div>
          )}
        </div>

        {/* Level up notification */}
        {leveledUp && (
          <div className="level-up-banner">
            <div className="level-up-stars">✨ ✨ ✨</div>
            <p className="level-up-text">LEVEL UP!</p>
            <p className="level-up-sub">You are now Level {hero.level}!</p>
          </div>
        )}

        {/* Current stats snapshot */}
        <div className="reward-stats-bar">
          <div className="reward-stat">
            <span>❤️</span>
            <div className="mini-bar">
              <div style={{ width: `${(hero.hp / hero.maxHp) * 100}%`, height: '100%', background: '#2ecc71', borderRadius: '4px' }} />
            </div>
            <span>{hero.hp}/{hero.maxHp}</span>
          </div>
          <div className="reward-stat">
            <span>🔷</span>
            <div className="mini-bar">
              <div style={{ width: `${(hero.mp / hero.maxMp) * 100}%`, height: '100%', background: '#3498db', borderRadius: '4px' }} />
            </div>
            <span>{hero.mp}/{hero.maxMp}</span>
          </div>
        </div>

        <button className="btn-continue" onClick={onContinue}>
          Continue ▶
        </button>
      </div>
    </div>
  );
}
