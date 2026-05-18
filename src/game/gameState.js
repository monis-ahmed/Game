// ============================================================
// CHRONOQUEST: THE AGENTIC REALM
// Central Game State Management
// ============================================================

export const SCREENS = {
  START: 'start',
  HERO_SELECT: 'hero_select',
  DUNGEON_MAP: 'dungeon_map',
  COMBAT: 'combat',
  NARRATIVE: 'narrative',
  INVENTORY: 'inventory',
  REWARD: 'reward',
  GAME_OVER: 'game_over',
  LEADERBOARD: 'leaderboard',
};

export const HERO_CLASSES = {
  WARRIOR: 'Warrior',
  MAGE: 'Mage',
  ROGUE: 'Rogue',
};

export const COMBAT_ACTIONS = {
  ATTACK: 'attack',
  DEFEND: 'defend',
  SPECIAL: 'special',
  ITEM: 'item',
  FLEE: 'flee',
};

export const createInitialHero = (heroClass) => {
  const bases = {
    [HERO_CLASSES.WARRIOR]: {
      name: 'Warrior',
      emoji: '⚔️',
      color: '#e05c5c',
      maxHp: 120,
      hp: 120,
      maxMp: 40,
      mp: 40,
      attack: 18,
      defense: 12,
      speed: 8,
      specialName: 'Blade Storm',
      specialDesc: 'Unleash a flurry of strikes dealing 3x damage',
      specialCost: 20,
      specialMultiplier: 3.0,
    },
    [HERO_CLASSES.MAGE]: {
      name: 'Mage',
      emoji: '🔮',
      color: '#9b59b6',
      maxHp: 75,
      hp: 75,
      maxMp: 100,
      mp: 100,
      attack: 25,
      defense: 6,
      speed: 12,
      specialName: 'Arcane Surge',
      specialDesc: 'Channel arcane energy for massive AOE damage',
      specialCost: 35,
      specialMultiplier: 4.0,
    },
    [HERO_CLASSES.ROGUE]: {
      name: 'Rogue',
      emoji: '🗡️',
      color: '#27ae60',
      maxHp: 90,
      hp: 90,
      maxMp: 60,
      mp: 60,
      attack: 22,
      defense: 8,
      speed: 18,
      specialName: 'Shadow Strike',
      specialDesc: 'Vanish and strike from shadows, ignoring defense',
      specialCost: 25,
      specialMultiplier: 2.5,
    },
  };
  return {
    ...bases[heroClass],
    class: heroClass,
    level: 1,
    xp: 0,
    xpToNext: 100,
    gold: 50,
    floor: 1,
    totalKills: 0,
    tacticsUsed: { attack: 0, defend: 0, special: 0 },
    inventory: [],
    statusEffects: [],
    defendingNextTurn: false,
    winStreak: 0,
    lossStreak: 0,
    sessionsWon: 0,
  };
};

export const createInitialGameState = () => ({
  screen: SCREENS.START,
  hero: null,
  currentEnemy: null,
  currentNarrative: '',
  narrativeType: 'intro',
  dungeonRooms: [],
  currentRoomIndex: 0,
  combatLog: [],
  rewards: null,
  leaderboard: JSON.parse(localStorage.getItem('cq_leaderboard') || '[]'),
  difficultyScore: 1.0,    // AI-adjusted multiplier
  sessionId: Date.now(),
  aiThinking: false,
  aiDecision: null,         // Shows AI reasoning to player
  floorCleared: false,
});

export const saveLeaderboard = (entry) => {
  const board = JSON.parse(localStorage.getItem('cq_leaderboard') || '[]');
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const top10 = board.slice(0, 10);
  localStorage.setItem('cq_leaderboard', JSON.stringify(top10));
  return top10;
};

export const calculateXpGain = (enemy, hero) => {
  const base = enemy.xpReward || 30;
  const levelBonus = Math.max(1, enemy.level - hero.level + 1);
  return Math.floor(base * levelBonus);
};

export const calculateGoldGain = (enemy, difficultyScore) => {
  const base = enemy.goldReward || 15;
  return Math.floor(base * (0.8 + Math.random() * 0.4) * difficultyScore);
};

export const levelUpHero = (hero) => {
  if (hero.xp < hero.xpToNext) return hero;
  const newLevel = hero.level + 1;
  const isWarrior = hero.class === HERO_CLASSES.WARRIOR;
  const isMage = hero.class === HERO_CLASSES.MAGE;
  return {
    ...hero,
    level: newLevel,
    xp: hero.xp - hero.xpToNext,
    xpToNext: Math.floor(hero.xpToNext * 1.5),
    maxHp: hero.maxHp + (isWarrior ? 15 : isMage ? 8 : 10),
    hp: hero.hp + (isWarrior ? 15 : isMage ? 8 : 10),
    maxMp: hero.maxMp + (isMage ? 15 : 5),
    mp: Math.min(hero.maxMp, hero.mp + (isMage ? 15 : 5)),
    attack: hero.attack + (isMage ? 4 : isWarrior ? 3 : 3),
    defense: hero.defense + (isWarrior ? 2 : 1),
  };
};
