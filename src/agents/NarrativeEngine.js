// ============================================================
// CHRONOQUEST: Narrative Engine Agent
// Generates AI-driven story text and NPC dialogue
// ============================================================

const FLOOR_INTROS = [
  "Antigravity OS booted. Analyzing dungeon structure... Threat level: Minimal. Proceed.",
  "Environmental scan complete. Hostile entities detected in sector 2.",
  "Warning: Dimensional instability increasing. Antigravity shields holding.",
  "Data stream corrupted. The deeper you go, the more the matrix resists.",
  "Antigravity Agent: 'I have optimized your survival odds to 32.4%. Good luck.'",
  "The simulation grows denser. Agentic variables are shifting in real-time.",
  "Magic and code blur here. You are approaching the core logic cluster.",
  "Antigravity Agent: 'Warning. Approaching the Lich King's mainframe.'",
];

const COMBAT_INTROS = {
  aggressive: [
    "The {name} lunges at you with reckless fury! Antigravity recommends evasion.",
    "{name} snarls and charges without hesitation!",
    "With savage hunger, the {name} attacks on sight!",
  ],
  balanced: [
    "The {name} sizes you up, then advances cautiously.",
    "{name} circles you, calculating its first strike. Antigravity analyzing pattern...",
    "A battle-worn {name} steps from the shadows.",
  ],
  defensive: [
    "The {name} raises its guard, watching your every move.",
    "{name} hunches protectively. Antigravity flags high defense.",
    "The {name} lets out a gurgling hiss and holds its ground.",
  ],
  berserker: [
    "The {name} roars and enters a battle frenzy! Threat level elevated.",
    "Blood-rage fills the {name}'s eyes as it charges!",
  ],
  lifesteal: [
    "The {name} fixes its crimson eyes on your throat.",
    "An unholy hunger radiates from the {name}. Antigravity warns of drain attacks.",
  ],
  tank: [
    "The earth trembles as {name} lumbers toward you.",
    "{name} raises walls of stone — it won't go down easily.",
  ],
  spellcaster: [
    "Arcane energy crackles as the {name} begins an incantation!",
    "The {name} raises a gnarled staff. Magical anomaly detected.",
  ],
  boss: [
    "⚠️ Antigravity Alert: Massive entity detected in the chamber.",
    "⚠️ An ancient evil stirs. The {name} awakens from its slumber.",
    "⚠️ Boss encounter! The {name} regards you with contempt.",
  ],
};

const VICTORY_LINES = [
  "Entity neutralized. Antigravity logging combat metrics.",
  "With a final blow, the creature falls. You stand triumphant.",
  "Silence returns to the chamber. Another foe defeated.",
  "The monster collapses, its power fading. You claim your reward.",
  "Antigravity Agent: 'Combat efficiency optimal. Well done.'",
];

const DEFEAT_LINES = [
  "System failure. Subject terminated... but Antigravity has backed up your data.",
  "You fall, but legends don't die easily. Rebooting simulation...",
  "The dungeon claims another soul. Yet your story isn't over.",
];

const LEVEL_UP_LINES = [
  "✨ Power surges through your body — you've grown stronger!",
  "✨ Your skills sharpen. Antigravity has increased your parameter caps.",
  "✨ Level up! Your legend in the Agentic Realm deepens.",
];

const FLOOR_COMPLETE_LINES = [
  "Sector cleared. Antigravity generating next floor...",
  "You've mastered this level. The simulation prepares its next trial.",
  "Victory on this floor! The Antigravity Agent watches... and plans.",
];

const NPC_MERCHANT_LINES = [
  "Ah, a weary adventurer! My wares await — gold well spent!",
  "Antigravity assigned me to this node to sell supplies. Interested?",
  "I've survived these depths by selling, not fighting. Smart, no?",
];

const TREASURE_LINES = [
  "A hidden alcove reveals a glittering cache!",
  "Fortune smiles upon you — treasure in the darkness!",
  "Antigravity has spawned a high-tier loot cache in this room.",
];

const AI_DM_COMMENTARY = [
  "🤖 Antigravity: Your tactics have been noted. Adjusting...",
  "🤖 Antigravity: The simulation evolves to challenge you.",
  "🤖 Antigravity: I've studied your patterns. Time to test you.",
  "🤖 Antigravity: Every choice you make shapes the generated environment.",
];

/**
 * NarrativeEngine Agent
 * Generates contextual story text based on game state
 */
export class NarrativeEngine {
  constructor() {
    this.usedLines = new Set();
  }

  pickUnique(lines) {
    const available = lines.filter(l => !this.usedLines.has(l));
    const pool = available.length > 0 ? available : lines;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    this.usedLines.add(chosen);
    if (this.usedLines.size > 30) this.usedLines.clear();
    return chosen;
  }

  getFloorIntro(floor) {
    const idx = Math.min(floor - 1, FLOOR_INTROS.length - 1);
    return FLOOR_INTROS[idx];
  }

  getCombatIntro(enemy) {
    const lines = COMBAT_INTROS[enemy.tactics] || COMBAT_INTROS.balanced;
    const line = this.pickUnique(lines);
    return line.replace('{name}', enemy.name);
  }

  getVictoryLine() {
    return this.pickUnique(VICTORY_LINES);
  }

  getDefeatLine() {
    return this.pickUnique(DEFEAT_LINES);
  }

  getLevelUpLine() {
    return this.pickUnique(LEVEL_UP_LINES);
  }

  getFloorCompleteLine() {
    return this.pickUnique(FLOOR_COMPLETE_LINES);
  }

  getMerchantLine() {
    return this.pickUnique(NPC_MERCHANT_LINES);
  }

  getTreasureLine() {
    return this.pickUnique(TREASURE_LINES);
  }

  getAIDMCommentary() {
    return this.pickUnique(AI_DM_COMMENTARY);
  }

  /**
   * Generate contextual combat log message
   */
  getCombatActionNarrative(actor, action, result, heroName, enemyName) {
    if (actor === 'hero') {
      if (action === 'attack') {
        if (result.isCrit) return `💥 CRITICAL HIT! ${heroName} strikes for ${result.damage} damage!`;
        return `⚔️ ${heroName} attacks for ${result.damage} damage.`;
      }
      if (action === 'special') {
        return `✨ ${heroName} unleashes their special! ${result.damage} damage!`;
      }
      if (action === 'defend') {
        return `🛡️ ${heroName} takes a defensive stance.`;
      }
      if (action === 'item') {
        return `🧪 ${heroName} uses an item.`;
      }
    }

    if (actor === 'enemy') {
      if (action === 'defend') return `🛡️ ${enemyName} braces for impact!`;
      if (result.type === 'special') {
        return `💢 ${enemyName} uses ${result.moveName} for ${result.damage} damage!`;
      }
      return `👊 ${enemyName} attacks for ${result.damage} damage!`;
    }

    return '';
  }

  /**
   * Generate hero's opening quip based on class
   */
  getHeroIntroLine(heroClass) {
    const lines = {
      Warrior: "Steel in hand, the warrior descends. No beast shall stand long.",
      Mage: "Ancient words form on the mage's lips. Magic crackles at their fingertips.",
      Rogue: "Silent as shadow, the rogue vanishes into the dungeon's embrace.",
    };
    return lines[heroClass] || "The hero enters the dungeon with resolve.";
  }
}

export const narrativeEngine = new NarrativeEngine();
