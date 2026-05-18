import React from 'react';
import { HERO_CLASSES, createInitialHero } from '../game/gameState.js';

const HEROES = [
  {
    class: HERO_CLASSES.WARRIOR,
    emoji: '⚔️',
    title: 'The Iron Warden',
    tagline: 'Unbreakable. Unstoppable. Pure steel.',
    color: '#e05c5c',
    gradientFrom: '#e05c5c',
    gradientTo: '#c0392b',
    stats: { HP: 120, MP: 40, ATK: 18, DEF: 12, SPD: 8 },
    special: 'Blade Storm',
    specialDesc: 'Unleash a flurry of 3x damage strikes',
    playstyle: 'Tank / Physical DPS',
    difficulty: 'Beginner',
    difficultyColor: '#27ae60',
    pros: ['High HP pool', 'Strong defense', 'Great for beginners'],
    cons: ['Low magic power', 'Slower speed'],
  },
  {
    class: HERO_CLASSES.MAGE,
    emoji: '🔮',
    title: 'The Arcane Oracle',
    tagline: 'Reality bends to the will of the Mage.',
    color: '#9b59b6',
    gradientFrom: '#9b59b6',
    gradientTo: '#6c3483',
    stats: { HP: 75, MP: 100, ATK: 25, DEF: 6, SPD: 12 },
    special: 'Arcane Surge',
    specialDesc: 'Massive 4x AOE damage burst',
    playstyle: 'Burst Mage / Glass Cannon',
    difficulty: 'Intermediate',
    difficultyColor: '#f39c12',
    pros: ['Highest damage output', 'AOE specials', 'Fast casting'],
    cons: ['Fragile — low HP', 'MP management critical'],
  },
  {
    class: HERO_CLASSES.ROGUE,
    emoji: '🗡️',
    title: 'The Shadow Walker',
    tagline: 'Strike from darkness. Leave no trace.',
    color: '#27ae60',
    gradientFrom: '#27ae60',
    gradientTo: '#1e8449',
    stats: { HP: 90, MP: 60, ATK: 22, DEF: 8, SPD: 18 },
    special: 'Shadow Strike',
    specialDesc: 'Bypass defense with 2.5x shadow damage',
    playstyle: 'Assassin / Speed DPS',
    difficulty: 'Advanced',
    difficultyColor: '#e74c3c',
    pros: ['Highest speed', 'Ignores defense', 'Critical hit master'],
    cons: ['Medium HP', 'Lower base attack'],
  },
];

export default function HeroSelect({ onSelect }) {
  const [selected, setSelected] = React.useState(null);
  const [hoveredStat, setHoveredStat] = React.useState(null);
  const [animating, setAnimating] = React.useState(false);

  const handleConfirm = () => {
    if (!selected || animating) return;
    setAnimating(true);
    setTimeout(() => onSelect(createInitialHero(selected)), 600);
  };

  const selectedHero = HEROES.find(h => h.class === selected);

  return (
    <div className="hero-select-screen">
      <div className="hero-select-header">
        <h1 className="hero-select-title">Choose Your Champion</h1>
        <p className="hero-select-subtitle">The Dungeon Master has prepared three destinies. Choose wisely.</p>
      </div>

      <div className="hero-cards-row">
        {HEROES.map(hero => (
          <div
            key={hero.class}
            className={`hero-card ${selected === hero.class ? 'hero-card--selected' : ''}`}
            style={{ '--hero-color': hero.color, '--hero-grad-from': hero.gradientFrom, '--hero-grad-to': hero.gradientTo }}
            onClick={() => setSelected(hero.class)}
          >
            <div className="hero-card__glow" />
            <div className="hero-card__emoji">{hero.emoji}</div>
            <div className="hero-card__class">{hero.class}</div>
            <div className="hero-card__title">{hero.title}</div>
            <div className="hero-card__tagline">"{hero.tagline}"</div>

            <div className="hero-card__stats">
              {Object.entries(hero.stats).map(([stat, val]) => (
                <div key={stat} className="hero-stat-row">
                  <span className="hero-stat-label">{stat}</span>
                  <div className="hero-stat-bar">
                    <div
                      className="hero-stat-fill"
                      style={{ width: `${Math.min(100, (val / 120) * 100)}%` }}
                    />
                  </div>
                  <span className="hero-stat-val">{val}</span>
                </div>
              ))}
            </div>

            <div className="hero-card__special">
              <span className="special-label">✨ Special</span>
              <span className="special-name">{hero.special}</span>
              <span className="special-desc">{hero.specialDesc}</span>
            </div>

            <div className="hero-card__badges">
              <span className="badge badge--playstyle">{hero.playstyle}</span>
              <span className="badge" style={{ background: hero.difficultyColor + '33', color: hero.difficultyColor, border: `1px solid ${hero.difficultyColor}55` }}>
                {hero.difficulty}
              </span>
            </div>

            {selected === hero.class && (
              <div className="hero-card__selected-ring" />
            )}
          </div>
        ))}
      </div>

      {selectedHero && (
        <div className="hero-pros-cons" style={{ '--hero-color': selectedHero.color }}>
          <div className="pros-col">
            {selectedHero.pros.map(p => <span key={p} className="pro-item">✅ {p}</span>)}
          </div>
          <div className="cons-col">
            {selectedHero.cons.map(c => <span key={c} className="con-item">⚠️ {c}</span>)}
          </div>
        </div>
      )}

      <button
        className={`btn-confirm-hero ${!selected ? 'btn-confirm-hero--disabled' : ''} ${animating ? 'btn-confirm-hero--animating' : ''}`}
        onClick={handleConfirm}
        disabled={!selected}
      >
        {animating ? '⚡ Entering the Dungeon...' : selected ? `Begin as ${selected}` : 'Select a Hero'}
      </button>
    </div>
  );
}
