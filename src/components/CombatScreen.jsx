import React from 'react';
import { COMBAT_ACTIONS } from '../game/gameState.js';
import { getEnemyAction } from '../game/enemies.js';
import { combatReferee } from '../agents/CombatReferee.js';
import { applyItemToHero } from '../game/items.js';
import { antigravityAgent } from '../agents/AntigravityAgent.js';
import AntigravityConsole from './AntigravityConsole.jsx';

export default function CombatScreen({ hero, enemy, onHeroUpdate, onVictory, onDefeat, onFlee }) {
  const [localHero, setLocalHero] = React.useState({ ...hero, defendingNextTurn: false });
  const [localEnemy, setLocalEnemy] = React.useState({ ...enemy });
  const [combatLog, setCombatLog] = React.useState([]);
  const [turnCount, setTurnCount] = React.useState(0);
  const [phase, setPhase] = React.useState('player');
  const [heroShake, setHeroShake] = React.useState(false);
  const [enemyShake, setEnemyShake] = React.useState(false);
  const [showItems, setShowItems] = React.useState(false);
  const [floatingText, setFloatingText] = React.useState(null);
  const [interventionTraces, setInterventionTraces] = React.useState([]);
  const logRef = React.useRef(null);

  const hpPct = (localHero.hp / localHero.maxHp) * 100;
  const mpPct = (localHero.mp / localHero.maxMp) * 100;
  const enemyHpPct = (localEnemy.hp / localEnemy.maxHp) * 100;
  const hpColor = hpPct > 60 ? '#2ecc71' : hpPct > 30 ? '#f39c12' : '#e74c3c';

  const addLog = (msg, type = 'info') => {
    setCombatLog(prev => [...prev.slice(-18), { msg, type, id: Date.now() + Math.random() }]);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 50);
  };

  const showFloat = (text, color, isHero) => {
    setFloatingText({ text, color, isHero, id: Date.now() });
    setTimeout(() => setFloatingText(null), 900);
  };

  const triggerEnemyTurn = React.useCallback((heroState, enemyState, newTurnCount) => {
    setPhase('animating');
    setTimeout(() => {
      const action = getEnemyAction(enemyState, heroState, newTurnCount);
      if (action === 'defend') {
        setLocalEnemy(e => ({ ...e, isDefending: true }));
        addLog(`🛡️ ${enemyState.name} braces itself!`, 'enemy');
        setPhase('player');
        return;
      }
      const result = combatReferee.resolveEnemyAction(enemyState, heroState, action);
      setHeroShake(true);
      setTimeout(() => setHeroShake(false), 450);
      showFloat(`-${result.damage}`, '#e74c3c', true);
      let updatedHero = { ...heroState, hp: Math.max(0, heroState.hp - result.damage), defendingNextTurn: false };
      if (result.enemyHeal > 0) {
        setLocalEnemy(e => ({ ...e, hp: Math.min(e.maxHp, e.hp + result.enemyHeal) }));
        addLog(`🩸 ${enemyState.name} heals ${result.enemyHeal} HP!`, 'enemy');
      }
      addLog(action === 'special'
        ? `💢 ${enemyState.name} uses ${enemyState.specialMove?.name}! ${result.damage} dmg!`
        : `👊 ${enemyState.name} attacks for ${result.damage} damage!`, action === 'special' ? 'enemy-special' : 'enemy');
      setLocalHero(updatedHero);
      if (updatedHero.hp <= 0) setTimeout(() => onDefeat(updatedHero, newTurnCount), 700);
      else setPhase('player');
    }, 700);
  }, [onDefeat]);

  const doPlayerAction = (action, itemIndex = null) => {
    if (phase !== 'player') return;
    setPhase('animating');
    let updatedHero = { ...localHero };
    let updatedEnemy = { ...localEnemy, isDefending: false };
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    if (action !== 'item' && action !== 'flee') {
      updatedHero = { ...updatedHero, tacticsUsed: { ...updatedHero.tacticsUsed, [action]: (updatedHero.tacticsUsed[action] || 0) + 1 } };
    }

    // Antigravity Intervention Check
    const intervention = antigravityAgent.combatIntervention(updatedHero, updatedEnemy, action);
    if (intervention.trace.length > 0) {
      updatedEnemy = intervention.modifiedEnemy;
      setInterventionTraces(intervention.trace);
      addLog(`🤖 ANTIGRAVITY INTERVENTION: Parameters modified!`, 'warning');
      // Hide trace after 4s
      setTimeout(() => setInterventionTraces([]), 4000);
    }

    if (action === COMBAT_ACTIONS.ATTACK) {
      const r = combatReferee.resolvePlayerAttack(updatedHero, updatedEnemy);
      updatedEnemy = { ...updatedEnemy, hp: Math.max(0, updatedEnemy.hp - r.damage) };
      setEnemyShake(true); setTimeout(() => setEnemyShake(false), 450);
      showFloat(r.isCrit ? `💥${r.damage}!` : `-${r.damage}`, r.isCrit ? '#f1c40f' : '#e74c3c', false);
      addLog(r.isCrit ? `💥 CRIT HIT! ${r.damage} damage!` : `⚔️ You strike for ${r.damage} damage.`, r.isCrit ? 'crit' : 'player');
    } else if (action === COMBAT_ACTIONS.SPECIAL) {
      const r = combatReferee.resolvePlayerSpecial(updatedHero, updatedEnemy);
      if (!r.isValid) { addLog(`❌ ${r.reason}`, 'warning'); setPhase('player'); return; }
      updatedHero = { ...updatedHero, mp: updatedHero.mp - r.mpCost };
      updatedEnemy = { ...updatedEnemy, hp: Math.max(0, updatedEnemy.hp - r.damage) };
      setEnemyShake(true); setTimeout(() => setEnemyShake(false), 450);
      showFloat(`✨${r.damage}!`, '#9b59b6', false);
      addLog(`✨ ${updatedHero.specialName}! ${r.damage} damage! (-${r.mpCost} MP)`, 'special');
    } else if (action === COMBAT_ACTIONS.DEFEND) {
      updatedHero = { ...updatedHero, defendingNextTurn: true };
      addLog(`🛡️ Defensive stance — defense doubled this turn.`, 'defend');
    } else if (action === COMBAT_ACTIONS.ITEM) {
      if (itemIndex === null || !updatedHero.inventory[itemIndex]) { setPhase('player'); return; }
      const item = updatedHero.inventory[itemIndex];
      const val = combatReferee.validateItemUse(item, updatedHero);
      if (!val.isValid) { addLog(`❌ ${val.reason}`, 'warning'); setPhase('player'); return; }
      const newInv = [...updatedHero.inventory]; newInv.splice(itemIndex, 1);
      updatedHero = { ...applyItemToHero(updatedHero, item), inventory: newInv };
      showFloat(`+HP`, '#2ecc71', true);
      addLog(`🧪 Used ${item.name}! ${item.desc}`, 'item');
      setShowItems(false);
    } else if (action === COMBAT_ACTIONS.FLEE) {
      const r = combatReferee.resolveFlee(updatedHero, updatedEnemy);
      addLog(r.message, r.success ? 'flee' : 'warning');
      if (r.success) { setTimeout(() => onFlee(updatedHero), 500); return; }
      setLocalHero(updatedHero); setPhase('player'); return;
    }

    setLocalHero(updatedHero); setLocalEnemy(updatedEnemy);
    if (updatedEnemy.hp <= 0) { setTimeout(() => onVictory(updatedHero, updatedEnemy, newTurn), 700); return; }
    triggerEnemyTurn(updatedHero, updatedEnemy, newTurn);
  };

  const consumables = localHero.inventory.filter(i => i.combatUsable);

  return (
    <div className="combat-screen">
      {/* Enemy area */}
      <div className="combat-enemy-area">
        <div className="combat-enemy-header">
          <span className="enemy-info__name">{localEnemy.name}</span>
          <span className="enemy-info__level">Lv.{localEnemy.level}</span>
          {localEnemy.isBoss && <span className="boss-crown">👑 BOSS</span>}
        </div>
        <div className="enemy-hp-bar-wrap">
          <div className="enemy-hp-bar">
            <div className="enemy-hp-fill" style={{ width: `${enemyHpPct}%` }} />
          </div>
          <span className="enemy-hp-text">{localEnemy.hp}/{localEnemy.maxHp}</span>
        </div>
        <div className={`enemy-sprite-wrap ${enemyShake ? 'shake' : ''}`}>
          <div className={`enemy-sprite ${localEnemy.isBoss ? 'enemy-sprite--boss' : ''}`}>{localEnemy.emoji}</div>
          {localEnemy.isDefending && <div className="enemy-defend-shield">🛡️</div>}
          {floatingText && !floatingText.isHero && (
            <div className="floating-text" style={{ color: floatingText.color }}>{floatingText.text}</div>
          )}
        </div>
        <div className="enemy-tip">💡 {localEnemy.weaknessTip}</div>
      </div>

      {/* Hero area */}
      <div className={`combat-hero-area ${heroShake ? 'shake' : ''}`}>
        <div className="hero-battle-card">
          <div className="hero-battle-left">
            <span className="hero-battle-emoji">{localHero.emoji}</span>
            {localHero.defendingNextTurn && <div className="hero-defend-indicator">🛡️</div>}
            {floatingText && floatingText.isHero && (
              <div className="floating-text floating-text--hero" style={{ color: floatingText.color }}>{floatingText.text}</div>
            )}
          </div>
          <div className="hero-battle-bars">
            <div className="battle-bar-row">
              <span>❤️</span>
              <div className="battle-bar"><div className="battle-bar__fill" style={{ width: `${hpPct}%`, background: hpColor }} /></div>
              <span className="battle-bar__num">{localHero.hp}/{localHero.maxHp}</span>
            </div>
            <div className="battle-bar-row">
              <span>🔷</span>
              <div className="battle-bar"><div className="battle-bar__fill" style={{ width: `${mpPct}%`, background: '#3498db' }} /></div>
              <span className="battle-bar__num">{localHero.mp}/{localHero.maxMp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Combat log */}
      <div className="combat-log" ref={logRef}>
        {combatLog.length === 0 && <p className="combat-log__empty">⚔️ Battle begins! Choose your action.</p>}
        {combatLog.map(e => <p key={e.id} className={`log-entry log-entry--${e.type}`}>{e.msg}</p>)}
      </div>

      {/* Action buttons */}
      {phase === 'player' && !showItems && (
        <div className="combat-actions">
          <button className="combat-btn combat-btn--attack" onClick={() => doPlayerAction(COMBAT_ACTIONS.ATTACK)}>
            <span className="cbtn-icon">⚔️</span><span className="cbtn-label">Attack</span>
          </button>
          <button className="combat-btn combat-btn--defend" onClick={() => doPlayerAction(COMBAT_ACTIONS.DEFEND)}>
            <span className="cbtn-icon">🛡️</span><span className="cbtn-label">Defend</span>
          </button>
          <button className={`combat-btn combat-btn--special ${localHero.mp < localHero.specialCost ? 'combat-btn--disabled' : ''}`}
            onClick={() => doPlayerAction(COMBAT_ACTIONS.SPECIAL)}>
            <span className="cbtn-icon">✨</span>
            <span className="cbtn-label">{localHero.specialName}</span>
            <span className="cbtn-cost">{localHero.specialCost}MP</span>
          </button>
          <button className={`combat-btn combat-btn--item ${consumables.length === 0 ? 'combat-btn--disabled' : ''}`}
            onClick={() => consumables.length > 0 && setShowItems(true)}>
            <span className="cbtn-icon">🧪</span><span className="cbtn-label">Items</span>
            <span className="cbtn-cost">{consumables.length}</span>
          </button>
          <button className="combat-btn combat-btn--flee" onClick={() => doPlayerAction(COMBAT_ACTIONS.FLEE)}>
            <span className="cbtn-icon">💨</span><span className="cbtn-label">Flee</span>
          </button>
        </div>
      )}

      {/* Item picker */}
      {showItems && phase === 'player' && (
        <div className="combat-item-picker">
          <div className="item-picker-header">
            <span>Choose Item</span>
            <button onClick={() => setShowItems(false)}>✕</button>
          </div>
          {consumables.map((item, idx) => {
            const realIdx = localHero.inventory.indexOf(item);
            return (
              <button key={idx} className="item-pick-btn" onClick={() => doPlayerAction(COMBAT_ACTIONS.ITEM, realIdx)}>
                <span>{item.emoji}</span>
                <div><p className="item-pick-name">{item.name}</p><p className="item-pick-desc">{item.desc}</p></div>
              </button>
            );
          })}
        </div>
      )}

      {phase === 'animating' && (
        <div className="combat-thinking">
          <span className="thinking-dot"/><span className="thinking-dot"/><span className="thinking-dot"/>
        </div>
      )}
      <div className="combat-turn-badge">Turn {turnCount + 1}</div>

      <AntigravityConsole traces={interventionTraces} isVisible={interventionTraces.length > 0} />
    </div>
  );
}
