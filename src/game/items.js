// ============================================================
// CHRONOQUEST: Items & Loot System
// ============================================================

export const ITEM_TYPES = {
  CONSUMABLE: 'consumable',
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
};

export const ALL_ITEMS = [
  // ── Consumables ──────────────────────────────────────────
  {
    id: 'health_potion',
    name: 'Health Potion',
    emoji: '🧪',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: 'common',
    desc: 'Restores 40 HP',
    effect: (hero) => ({ ...hero, hp: Math.min(hero.maxHp, hero.hp + 40) }),
    value: 15,
    combatUsable: true,
  },
  {
    id: 'mega_potion',
    name: 'Mega Potion',
    emoji: '💊',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: 'uncommon',
    desc: 'Restores 80 HP',
    effect: (hero) => ({ ...hero, hp: Math.min(hero.maxHp, hero.hp + 80) }),
    value: 30,
    combatUsable: true,
  },
  {
    id: 'mana_crystal',
    name: 'Mana Crystal',
    emoji: '💎',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: 'uncommon',
    desc: 'Restores 40 MP',
    effect: (hero) => ({ ...hero, mp: Math.min(hero.maxMp, hero.mp + 40) }),
    value: 20,
    combatUsable: true,
  },
  {
    id: 'elixir',
    name: 'Elixir of Power',
    emoji: '⚗️',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: 'rare',
    desc: 'Restores 50 HP and 30 MP',
    effect: (hero) => ({
      ...hero,
      hp: Math.min(hero.maxHp, hero.hp + 50),
      mp: Math.min(hero.maxMp, hero.mp + 30),
    }),
    value: 50,
    combatUsable: true,
  },
  {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    emoji: '🔥',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: 'epic',
    desc: 'Fully restores HP and MP',
    effect: (hero) => ({ ...hero, hp: hero.maxHp, mp: hero.maxMp }),
    value: 120,
    combatUsable: true,
  },
  // ── Weapons ──────────────────────────────────────────────
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    emoji: '⚔️',
    type: ITEM_TYPES.WEAPON,
    rarity: 'common',
    desc: '+5 Attack',
    statBonus: { attack: 5 },
    value: 40,
    combatUsable: false,
  },
  {
    id: 'flame_blade',
    name: 'Flame Blade',
    emoji: '🔥',
    type: ITEM_TYPES.WEAPON,
    rarity: 'rare',
    desc: '+12 Attack, +3 Speed',
    statBonus: { attack: 12, speed: 3 },
    value: 90,
    combatUsable: false,
  },
  {
    id: 'arcane_staff',
    name: 'Arcane Staff',
    emoji: '🪄',
    type: ITEM_TYPES.WEAPON,
    rarity: 'rare',
    desc: '+10 Attack, +20 Max MP',
    statBonus: { attack: 10, maxMp: 20, mp: 20 },
    value: 85,
    combatUsable: false,
  },
  {
    id: 'shadow_dagger',
    name: 'Shadow Dagger',
    emoji: '🗡️',
    type: ITEM_TYPES.WEAPON,
    rarity: 'uncommon',
    desc: '+8 Attack, +5 Speed',
    statBonus: { attack: 8, speed: 5 },
    value: 60,
    combatUsable: false,
  },
  // ── Armor ────────────────────────────────────────────────
  {
    id: 'leather_vest',
    name: 'Leather Vest',
    emoji: '🦺',
    type: ITEM_TYPES.ARMOR,
    rarity: 'common',
    desc: '+4 Defense',
    statBonus: { defense: 4 },
    value: 35,
    combatUsable: false,
  },
  {
    id: 'chain_mail',
    name: 'Chain Mail',
    emoji: '🛡️',
    type: ITEM_TYPES.ARMOR,
    rarity: 'uncommon',
    desc: '+8 Defense, +10 Max HP',
    statBonus: { defense: 8, maxHp: 10 },
    value: 70,
    combatUsable: false,
  },
  {
    id: 'dragon_scale',
    name: 'Dragon Scale Armor',
    emoji: '🐉',
    type: ITEM_TYPES.ARMOR,
    rarity: 'epic',
    desc: '+18 Defense, +30 Max HP',
    statBonus: { defense: 18, maxHp: 30 },
    value: 150,
    combatUsable: false,
  },
  // ── Accessories ───────────────────────────────────────────
  {
    id: 'speed_ring',
    name: 'Ring of Swiftness',
    emoji: '💍',
    type: ITEM_TYPES.ACCESSORY,
    rarity: 'uncommon',
    desc: '+8 Speed',
    statBonus: { speed: 8 },
    value: 55,
    combatUsable: false,
  },
  {
    id: 'amulet_power',
    name: 'Amulet of Power',
    emoji: '📿',
    type: ITEM_TYPES.ACCESSORY,
    rarity: 'rare',
    desc: '+6 Attack, +6 Defense',
    statBonus: { attack: 6, defense: 6 },
    value: 100,
    combatUsable: false,
  },
];

export const RARITY_COLORS = {
  common: '#95a5a6',
  uncommon: '#27ae60',
  rare: '#2980b9',
  epic: '#8e44ad',
  legendary: '#f39c12',
};

export const RARITY_WEIGHTS = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
};

/**
 * AI Dungeon Master calls this to generate loot
 * based on floor depth and hero behavior
 */
export const generateLoot = (floor, heroClass, difficultyScore) => {
  const roll = Math.random() * 100;
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);

  // Higher floors = better loot
  const rarityBoost = Math.min(floor * 2, 25);

  let rarity;
  const adjustedRoll = roll - rarityBoost;
  if (adjustedRoll > 75) rarity = 'common';
  else if (adjustedRoll > 45) rarity = 'uncommon';
  else if (adjustedRoll > 20) rarity = 'rare';
  else if (adjustedRoll > 5) rarity = 'epic';
  else rarity = 'legendary';

  const eligible = ALL_ITEMS.filter(i => i.rarity === rarity);
  if (eligible.length === 0) return ALL_ITEMS[0]; // fallback

  return eligible[Math.floor(Math.random() * eligible.length)];
};

export const applyItemToHero = (hero, item) => {
  if (item.effect) {
    return item.effect(hero);
  }
  if (item.statBonus) {
    const updated = { ...hero };
    Object.entries(item.statBonus).forEach(([stat, val]) => {
      updated[stat] = (updated[stat] || 0) + val;
    });
    return updated;
  }
  return hero;
};
