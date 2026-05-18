import React from 'react';
import { SCREENS, createInitialGameState, levelUpHero, calculateXpGain, calculateGoldGain, saveLeaderboard } from './game/gameState.js';
import { antigravityAgent } from './agents/AntigravityAgent.js';
import { narrativeEngine } from './agents/NarrativeEngine.js';
import { generateLoot } from './game/items.js';

import StartScreen from './components/StartScreen.jsx';
import HeroSelect from './components/HeroSelect.jsx';
import DungeonMap from './components/DungeonMap.jsx';
import CombatScreen from './components/CombatScreen.jsx';
import NarrativePanel from './components/NarrativePanel.jsx';
import HeroStats from './components/HeroStats.jsx';
import InventoryScreen from './components/InventoryScreen.jsx';
import RewardScreen from './components/RewardScreen.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import GameOver from './components/GameOver.jsx';
import AntigravityConsole from './components/AntigravityConsole.jsx';

export default function App() {
  const [gs, setGs] = React.useState(createInitialGameState());
  const [showStats, setShowStats] = React.useState(false);
  const [showInventory, setShowInventory] = React.useState(false);
  const [showAgConsole, setShowAgConsole] = React.useState(false);

  const go = (screen, extra = {}) => setGs(prev => ({ ...prev, screen, ...extra }));

  // ── Start game ──────────────────────────────────────────
  const handleStart = () => go(SCREENS.HERO_SELECT);

  // ── Hero selected ────────────────────────────────────────
  const handleHeroSelect = (hero) => {
    const { difficultyScore, aiDecisions } = antigravityAgent.orchestrate(hero, 1.0);
    const rooms = antigravityAgent.generateFloor(1, hero, difficultyScore);
    const intro = narrativeEngine.getFloorIntro(1);
    setGs(prev => ({
      ...prev,
      hero,
      dungeonRooms: rooms,
      currentRoomIndex: 0,
      difficultyScore,
      aiDecision: aiDecisions,
      screen: SCREENS.NARRATIVE,
      currentNarrative: narrativeEngine.getHeroIntroLine(hero.class) + '\n\n' + intro,
      narrativeType: 'story',
      pendingScreen: SCREENS.DUNGEON_MAP,
    }));
  };

  // ── Enter a dungeon room ─────────────────────────────────
  const handleEnterRoom = (room) => {
    if (room.type === 'combat' || room.type === 'boss') {
      const intro = narrativeEngine.getCombatIntro(room.enemy);
      setGs(prev => ({
        ...prev,
        currentEnemy: room.enemy,
        screen: SCREENS.NARRATIVE,
        currentNarrative: intro,
        narrativeType: room.type === 'boss' ? 'combat_intro' : 'combat_intro',
        pendingScreen: SCREENS.COMBAT,
      }));
    } else if (room.type === 'shop') {
      setGs(prev => ({
        ...prev,
        screen: SCREENS.NARRATIVE,
        currentNarrative: narrativeEngine.getMerchantLine(),
        narrativeType: 'merchant',
        pendingScreen: 'shop',
        shopItems: room.items,
      }));
    } else if (room.type === 'treasure') {
      const loot = room.loot;
      setGs(prev => {
        const updatedHero = { ...prev.hero, inventory: [...prev.hero.inventory, loot] };
        return {
          ...prev,
          hero: updatedHero,
          screen: SCREENS.NARRATIVE,
          currentNarrative: narrativeEngine.getTreasureLine() + `\n\nYou found: ${loot.emoji} ${loot.name}!`,
          narrativeType: 'treasure',
          pendingScreen: SCREENS.DUNGEON_MAP,
          dungeonRooms: prev.dungeonRooms.map((r, i) => i === prev.currentRoomIndex ? { ...r, cleared: true } : r),
          currentRoomIndex: prev.currentRoomIndex + 1,
        };
      });
    }
  };

  // ── Narrative continue ───────────────────────────────────
  const handleNarrativeContinue = () => {
    const { pendingScreen, shopItems } = gs;
    if (pendingScreen === 'shop') {
      go('shop_screen');
    } else {
      go(pendingScreen || SCREENS.DUNGEON_MAP);
    }
  };

  // ── Victory ──────────────────────────────────────────────
  const handleVictory = (updatedHero, defeatedEnemy, turns) => {
    const xpGain = calculateXpGain(defeatedEnemy, updatedHero);
    const goldGain = calculateGoldGain(defeatedEnemy, gs.difficultyScore);
    const lootRoll = Math.random() < 0.45;
    const loot = lootRoll ? generateLoot(updatedHero.floor, updatedHero.class, gs.difficultyScore) : null;
    const rewards = { xp: xpGain, gold: goldGain, loot, turnsUsed: turns, efficiency: turns <= 3 ? 'Excellent' : turns <= 6 ? 'Good' : 'Survived', refereeSeal: 'VERIFIED' };

    let heroAfter = { ...updatedHero, xp: updatedHero.xp + xpGain, gold: updatedHero.gold + goldGain, totalKills: updatedHero.totalKills + 1, winStreak: updatedHero.winStreak + 1, lossStreak: 0 };
    if (loot) heroAfter = { ...heroAfter, inventory: [...heroAfter.inventory, loot] };

    // Level up check
    let leveledUp = false;
    while (heroAfter.xp >= heroAfter.xpToNext) {
      heroAfter = levelUpHero(heroAfter);
      leveledUp = true;
    }

    antigravityAgent.recordCombatResult(true, heroAfter, 0);
    const { difficultyScore, aiDecisions } = antigravityAgent.orchestrate(heroAfter, gs.difficultyScore);

    // Mark room cleared, advance
    const updatedRooms = gs.dungeonRooms.map((r, i) => i === gs.currentRoomIndex ? { ...r, cleared: true } : r);
    const nextIdx = gs.currentRoomIndex + 1;
    const floorDone = nextIdx >= updatedRooms.length;

    setGs(prev => ({
      ...prev, hero: heroAfter, dungeonRooms: updatedRooms,
      currentRoomIndex: floorDone ? nextIdx : nextIdx,
      rewards, difficultyScore, aiDecision: aiDecisions,
      screen: SCREENS.REWARD, leveledUp, floorCleared: floorDone,
    }));
  };

  // ── Defeat ───────────────────────────────────────────────
  const handleDefeat = (updatedHero) => {
    antigravityAgent.recordCombatResult(false, updatedHero, updatedHero.maxHp);
    const score = updatedHero.level * 500 + updatedHero.totalKills * 100 + updatedHero.floor * 200 + updatedHero.gold;
    const entry = { heroName: updatedHero.name, heroClass: updatedHero.class, emoji: updatedHero.emoji, level: updatedHero.level, floor: updatedHero.floor, kills: updatedHero.totalKills, gold: updatedHero.gold, score, date: Date.now() };
    const newBoard = saveLeaderboard(entry);
    setGs(prev => ({ ...prev, hero: { ...updatedHero, lossStreak: updatedHero.lossStreak + 1 }, leaderboard: newBoard, gameOverScore: score, screen: SCREENS.GAME_OVER }));
  };

  // ── Flee ─────────────────────────────────────────────────
  const handleFlee = (updatedHero) => {
    setGs(prev => ({ ...prev, hero: updatedHero, screen: SCREENS.DUNGEON_MAP }));
  };

  // ── After reward → next room or floor ────────────────────
  const handleAfterReward = () => {
    if (gs.floorCleared) {
      const newFloor = gs.hero.floor + 1;
      const updatedHero = { ...gs.hero, floor: newFloor, winStreak: gs.hero.winStreak };
      const { difficultyScore, aiDecisions } = antigravityAgent.orchestrate(updatedHero, gs.difficultyScore);
      const newRooms = antigravityAgent.generateFloor(newFloor, updatedHero, difficultyScore);
      const floorNarr = narrativeEngine.getFloorCompleteLine() + '\n\n' + narrativeEngine.getFloorIntro(newFloor);
      setGs(prev => ({
        ...prev, hero: updatedHero, dungeonRooms: newRooms, currentRoomIndex: 0,
        difficultyScore, aiDecision: aiDecisions,
        screen: SCREENS.NARRATIVE, currentNarrative: floorNarr,
        narrativeType: 'floor_complete', pendingScreen: SCREENS.DUNGEON_MAP,
        floorCleared: false,
      }));
    } else {
      go(SCREENS.DUNGEON_MAP);
    }
  };

  // ── Update hero (inventory/stats) ────────────────────────
  const handleHeroUpdate = (updatedHero) => {
    setGs(prev => ({ ...prev, hero: updatedHero }));
  };

  const calculateScore = (hero) => hero.level * 500 + hero.totalKills * 100 + hero.floor * 200 + hero.gold;

  const { screen, hero, currentEnemy, currentNarrative, narrativeType, dungeonRooms, currentRoomIndex, rewards, leaderboard, aiDecision, leveledUp } = gs;

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        {/* ── Top HUD (shown during dungeon/combat) ── */}
        {hero && [SCREENS.DUNGEON_MAP, SCREENS.COMBAT, 'shop_screen'].includes(screen) && (
          <div className="top-hud">
            <button className="hud-btn" onClick={() => setShowStats(true)}>📊</button>
            <div className="hud-center">
              <span className="hud-hero">{hero.emoji} {hero.name}</span>
              <span className="hud-meta">Lv.{hero.level} · Fl.{hero.floor}</span>
            </div>
            <div className="hud-right" style={{display: 'flex', gap: '6px'}}>
              <button className="hud-btn ag-btn" onClick={() => setShowAgConsole(true)}>AG_LOG</button>
              <button className="hud-btn" onClick={() => setShowInventory(true)}>🎒 {hero.inventory.length}</button>
            </div>
          </div>
        )}

        {/* ── AI Decision Banner ── */}
        {hero && aiDecision && aiDecision.length > 0 && screen === SCREENS.DUNGEON_MAP && (
          <div className="ai-banner" onClick={() => setShowAgConsole(true)} style={{cursor: 'pointer'}}>
            <span className="ai-dot" />
            <span className="ai-banner-text">ANTIGRAVITY ACTIVE — Tap to view logic trace</span>
          </div>
        )}

        {/* ── Screens ── */}
        {screen === SCREENS.START && (
          <StartScreen onStart={handleStart} onLeaderboard={() => go(SCREENS.LEADERBOARD)} />
        )}
        {screen === SCREENS.HERO_SELECT && (
          <HeroSelect onSelect={handleHeroSelect} />
        )}
        {screen === SCREENS.NARRATIVE && (
          <NarrativePanel text={currentNarrative} type={narrativeType} aiDecisions={aiDecision || []} onContinue={handleNarrativeContinue} />
        )}
        {screen === SCREENS.DUNGEON_MAP && hero && (
          <DungeonMap rooms={dungeonRooms} currentRoomIndex={currentRoomIndex} hero={hero} onEnterRoom={handleEnterRoom} />
        )}
        {screen === SCREENS.COMBAT && hero && currentEnemy && (
          <CombatScreen hero={hero} enemy={currentEnemy} onHeroUpdate={handleHeroUpdate} onVictory={handleVictory} onDefeat={handleDefeat} onFlee={handleFlee} />
        )}
        {screen === SCREENS.REWARD && rewards && hero && (
          <RewardScreen rewards={rewards} hero={hero} leveledUp={leveledUp} onContinue={handleAfterReward} />
        )}
        {screen === SCREENS.GAME_OVER && hero && (
          <GameOver hero={hero} score={gs.gameOverScore || 0} onRestart={() => setGs(createInitialGameState())} onLeaderboard={() => go(SCREENS.LEADERBOARD)} />
        )}
        {screen === SCREENS.LEADERBOARD && (
          <Leaderboard entries={leaderboard} currentHero={hero} onBack={() => go(hero ? SCREENS.DUNGEON_MAP : SCREENS.START)} />
        )}

        {/* Shop screen (inline) */}
        {screen === 'shop_screen' && hero && gs.shopItems && (
          <div className="shop-screen">
            <div className="shop-header">
              <h2>🏪 Dungeon Merchant</h2>
              <span className="shop-gold">💰 {hero.gold} Gold</span>
              <button className="shop-close" onClick={() => {
                const updatedRooms = gs.dungeonRooms.map((r, i) => i === gs.currentRoomIndex ? { ...r, cleared: true } : r);
                setGs(prev => ({ ...prev, dungeonRooms: updatedRooms, currentRoomIndex: prev.currentRoomIndex + 1, screen: SCREENS.DUNGEON_MAP }));
              }}>Leave</button>
            </div>
            <p className="shop-flavor">{narrativeEngine.getMerchantLine()}</p>
            <div className="shop-items">
              {gs.shopItems.map((item, i) => {
                const price = item.value;
                const canAfford = hero.gold >= price;
                return (
                  <div key={i} className="shop-item">
                    <span className="shop-item-emoji">{item.emoji}</span>
                    <div className="shop-item-info">
                      <p className="shop-item-name">{item.name}</p>
                      <p className="shop-item-desc">{item.desc}</p>
                    </div>
                    <button
                      className={`shop-buy-btn ${!canAfford ? 'shop-buy-btn--disabled' : ''}`}
                      disabled={!canAfford}
                      onClick={() => {
                        if (!canAfford) return;
                        const newInv = [...hero.inventory, item];
                        const newItems = gs.shopItems.filter((_, j) => j !== i);
                        setGs(prev => ({ ...prev, hero: { ...prev.hero, gold: prev.hero.gold - price, inventory: newInv }, shopItems: newItems }));
                      }}
                    >
                      {canAfford ? `Buy ${price}g` : `${price}g`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Overlays ── */}
        {showStats && hero && (
          <div className="overlay" onClick={() => setShowStats(false)}>
            <div className="overlay-panel" onClick={e => e.stopPropagation()}>
              <HeroStats hero={hero} />
              <button className="overlay-close" onClick={() => setShowStats(false)}>Close ✕</button>
            </div>
          </div>
        )}
        {showInventory && hero && (
          <div className="overlay" onClick={() => setShowInventory(false)}>
            <div className="overlay-panel" onClick={e => e.stopPropagation()}>
              <InventoryScreen hero={hero} onHeroUpdate={heroAfter => { handleHeroUpdate(heroAfter); }} onClose={() => setShowInventory(false)} />
            </div>
          </div>
        )}
        <AntigravityConsole traces={aiDecision || []} isVisible={showAgConsole} onClose={() => setShowAgConsole(false)} />
      </div>
    </div>
  );
}
