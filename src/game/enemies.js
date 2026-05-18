// ============================================================
// CHRONOQUEST: Enemy Archetypes & AI Generation
// ============================================================

export const ENEMY_ARCHETYPES = [
  {
    id: 'goblin',
    name: 'Goblin Scout',
    emoji: '👺',
    color: '#2ecc71',
    baseHp: 35,
    baseAttack: 10,
    baseDefense: 3,
    speed: 14,
    xpReward: 25,
    goldReward: 10,
    minFloor: 1,
    tactics: 'aggressive',
    weaknessTip: 'Low defense — attack repeatedly!',
    specialMove: { name: 'Quick Jab', multiplier: 1.5, chance: 0.2 },
    lore: 'A nimble scavenger lurking in the upper dungeon.',
  },
  {
    id: 'skeleton',
    name: 'Bone Knight',
    emoji: '💀',
    color: '#bdc3c7',
    baseHp: 50,
    baseAttack: 13,
    baseDefense: 8,
    speed: 8,
    xpReward: 35,
    goldReward: 15,
    minFloor: 1,
    tactics: 'balanced',
    weaknessTip: 'Slow attacker — use specials between its turns.',
    specialMove: { name: 'Bone Crush', multiplier: 2.0, chance: 0.25 },
    lore: 'An ancient warrior reanimated by dark magic.',
  },
  {
    id: 'slime',
    name: 'Toxic Slime',
    emoji: '🟢',
    color: '#8bc34a',
    baseHp: 60,
    baseAttack: 8,
    baseDefense: 5,
    speed: 5,
    xpReward: 30,
    goldReward: 12,
    minFloor: 1,
    tactics: 'defensive',
    weaknessTip: 'High HP but weak attacks — grind it down.',
    specialMove: { name: 'Acid Spit', multiplier: 1.8, chance: 0.3 },
    lore: 'An oozing creature that corrodes everything it touches.',
  },
  {
    id: 'orc',
    name: 'Orc Berserker',
    emoji: '👹',
    color: '#e67e22',
    baseHp: 80,
    baseAttack: 20,
    baseDefense: 7,
    speed: 10,
    xpReward: 50,
    goldReward: 25,
    minFloor: 3,
    tactics: 'berserker',
    weaknessTip: 'Hits hard! Defend when it charges.',
    specialMove: { name: 'Berserker Rage', multiplier: 2.5, chance: 0.3 },
    lore: 'A war-hungry brute from the deep caverns.',
  },
  {
    id: 'vampire',
    name: 'Blood Vampire',
    emoji: '🧛',
    color: '#c0392b',
    baseHp: 70,
    baseAttack: 18,
    baseDefense: 10,
    speed: 16,
    xpReward: 55,
    goldReward: 30,
    minFloor: 3,
    tactics: 'lifesteal',
    weaknessTip: 'Heals on hit! Burst it down fast.',
    specialMove: { name: 'Life Drain', multiplier: 2.0, chance: 0.35 },
    lore: 'A immortal predator that feeds on the living.',
    lifeSteal: true,
  },
  {
    id: 'golem',
    name: 'Stone Golem',
    emoji: '🗿',
    color: '#7f8c8d',
    baseHp: 120,
    baseAttack: 22,
    baseDefense: 18,
    speed: 4,
    xpReward: 70,
    goldReward: 35,
    minFloor: 4,
    tactics: 'tank',
    weaknessTip: 'Massive defense — use specials and MP attacks.',
    specialMove: { name: 'Earthquake', multiplier: 3.0, chance: 0.2 },
    lore: 'An ancient guardian animated from solid stone.',
  },
  {
    id: 'witch',
    name: 'Dark Witch',
    emoji: '🧙‍♀️',
    color: '#8e44ad',
    baseHp: 65,
    baseAttack: 28,
    baseDefense: 6,
    speed: 12,
    xpReward: 60,
    goldReward: 40,
    minFloor: 4,
    tactics: 'spellcaster',
    weaknessTip: 'Glass cannon — burst before it curses you!',
    specialMove: { name: 'Hex Bolt', multiplier: 3.5, chance: 0.4 },
    lore: 'A cursed sorceress banished to the dungeon depths.',
  },
  {
    id: 'dragon',
    name: 'Dragon Whelp',
    emoji: '🐉',
    color: '#f39c12',
    baseHp: 140,
    baseAttack: 30,
    baseDefense: 15,
    speed: 14,
    xpReward: 100,
    goldReward: 60,
    minFloor: 6,
    tactics: 'boss',
    weaknessTip: 'Floor boss! Use all your items and specials.',
    specialMove: { name: 'Dragon Breath', multiplier: 4.0, chance: 0.35 },
    lore: "The dungeon's apex predator — fearsome and ancient.",
    isBoss: true,
  },
  {
    id: 'lich',
    name: 'Lich King',
    emoji: '☠️',
    color: '#2c3e50',
    baseHp: 160,
    baseAttack: 35,
    baseDefense: 20,
    speed: 10,
    xpReward: 150,
    goldReward: 100,
    minFloor: 8,
    tactics: 'boss',
    weaknessTip: 'Ultimate boss! Summons minions. Focus it!',
    specialMove: { name: 'Soul Rend', multiplier: 4.5, chance: 0.4 },
    lore: 'The immortal ruler of the Agentic Realm.',
    isBoss: true,
  },
];

/**
 * AI Dungeon Master calls this to generate a scaled enemy
 * based on hero level + floor + difficulty multiplier
 */
export const generateEnemy = (floor, heroLevel, difficultyScore, forcedType = null) => {
  const eligible = ENEMY_ARCHETYPES.filter(e => e.minFloor <= floor);
  const archetype = forcedType
    ? ENEMY_ARCHETYPES.find(e => e.id === forcedType) || eligible[eligible.length - 1]
    : eligible[Math.floor(Math.random() * eligible.length)];

  const scaleFactor = 1 + (floor - 1) * 0.15 * difficultyScore;
  const levelBonus = 1 + (heroLevel - 1) * 0.08;

  return {
    ...archetype,
    level: Math.max(1, Math.floor(floor * 0.8 + heroLevel * 0.3)),
    hp: Math.floor(archetype.baseHp * scaleFactor * levelBonus),
    maxHp: Math.floor(archetype.baseHp * scaleFactor * levelBonus),
    attack: Math.floor(archetype.baseAttack * scaleFactor * levelBonus),
    defense: Math.floor(archetype.baseDefense * scaleFactor),
    xpReward: Math.floor(archetype.xpReward * scaleFactor),
    goldReward: Math.floor(archetype.goldReward * scaleFactor),
    instanceId: Date.now() + Math.random(),
    statusEffects: [],
    isDefending: false,
  };
};

/**
 * AI enemy decides its next action based on tactics type
 */
export const getEnemyAction = (enemy, hero, turnCount) => {
  const hpPercent = enemy.hp / enemy.maxHp;
  const heroHpPercent = hero.hp / hero.maxHp;
  const willUseSpecial = Math.random() < (enemy.specialMove?.chance || 0.25);

  switch (enemy.tactics) {
    case 'aggressive':
      return willUseSpecial ? 'special' : 'attack';

    case 'balanced':
      if (hpPercent < 0.3) return 'special';
      return willUseSpecial ? 'special' : 'attack';

    case 'defensive':
      if (turnCount % 3 === 0) return 'defend';
      return willUseSpecial ? 'special' : 'attack';

    case 'berserker':
      // Goes berserk under 50% HP
      if (hpPercent < 0.5) return 'special';
      return 'attack';

    case 'lifesteal':
      return willUseSpecial ? 'special' : 'attack';

    case 'tank':
      if (turnCount % 4 === 0) return 'defend';
      return willUseSpecial ? 'special' : 'attack';

    case 'spellcaster':
      // Spellcasters prefer specials
      return Math.random() < 0.5 ? 'special' : 'attack';

    case 'boss':
      if (hpPercent < 0.4 && Math.random() < 0.5) return 'special';
      if (turnCount % 2 === 0) return willUseSpecial ? 'special' : 'attack';
      return 'attack';

    default:
      return 'attack';
  }
};
