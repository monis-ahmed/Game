// ============================================================
// CHRONOQUEST: Antigravity Agent
// Primary Antigravity orchestrator — drives all game logic
// ============================================================

import { generateEnemy } from '../game/enemies.js';
import { generateLoot } from '../game/items.js';

/**
 * AntigravityAgent
 *
 * This is the core Antigravity agent. It:
 * 1. Analyzes player behavior and session state
 * 2. Decides difficulty adjustments
 * 3. Selects/generates enemies
 * 4. Creates narrative context
 * 5. Determines loot quality
 * 6. Shows structured reasoning to the player
 */
export class AntigravityAgent {
  constructor() {
    this.sessionMemory = [];
    this.playerProfile = {
      prefersAttack: false,
      prefersDefense: false,
      prefersSpecial: false,
      avgHpLostPerFight: 0,
      fightsAnalyzed: 0,
    };
  }

  /**
   * Analyze player's combat history and update profile
   */
  analyzePlayerBehavior(hero) {
    const t = hero.tacticsUsed || { attack: 0, defend: 0, special: 0 };
    const total = Math.max(1, t.attack + t.defend + t.special);
    this.playerProfile = {
      prefersAttack: t.attack / total > 0.5,
      prefersDefense: t.defend / total > 0.3,
      prefersSpecial: t.special / total > 0.4,
      avgHpLostPerFight: this.playerProfile.avgHpLostPerFight,
      fightsAnalyzed: hero.totalKills,
    };
    return this.playerProfile;
  }

  /**
   * Calculate adaptive difficulty score
   * Returns a multiplier (0.7 to 2.0) and CoT trace
   */
  calculateDifficulty(hero, currentDifficulty) {
    let score = currentDifficulty;
    const trace = [];

    trace.push(`[UNDERSTANDING] Subject ${hero.name} (${hero.class}) on Floor ${hero.floor}. Metrics -> Kills: ${hero.totalKills}, Streak: ${hero.winStreak}/${hero.lossStreak}, Tactics: ${this.playerProfile.prefersAttack ? 'Aggressive' : 'Balanced'}.`);

    let diffChange = 0;
    const reasoning = [];
    const simulations = [];

    // Win streak
    if (hero.winStreak >= 3) {
      diffChange += 0.15;
      reasoning.push(`High win streak (${hero.winStreak}) indicates current threat level is trivial.`);
      simulations.push(`If diff +0.0 -> Player boredom highly probable. If diff +0.15 -> Optimal engagement friction.`);
    }

    // Loss streak
    if (hero.lossStreak >= 2) {
      diffChange -= 0.2;
      reasoning.push(`High loss streak (${hero.lossStreak}) detected.`);
      simulations.push(`If diff unmodified -> Player churn likely. If diff -0.2 -> Encourages recovery loop.`);
    }

    // Player always attacks
    if (this.playerProfile.prefersAttack) {
      diffChange += 0.05;
      reasoning.push(`Subject relies heavily on aggression.`);
      simulations.push(`If enemy DEF unmodified -> Hack-and-slash loop persists. If enemy DEF +20% -> Forces tactical pivoting.`);
    }

    // Floor-based natural scaling
    const floorBonus = (hero.floor - 1) * 0.08;
    diffChange += floorBonus;

    score = Math.max(0.7, Math.min(2.0, score + diffChange));

    if (reasoning.length > 0) {
      trace.push(`[REASONING] ` + reasoning.join(' '));
      trace.push(`[SIMULATION] ` + simulations.join(' '));
    } else {
      trace.push(`[REASONING] Metrics within nominal parameters. No extreme interventions required.`);
    }

    return { score: parseFloat(score.toFixed(2)), trace };
  }

  /**
   * Generate a dungeon floor with rooms
   */
  generateFloor(floor, hero, difficultyScore) {
    const roomCount = 3 + Math.min(floor, 4); // 3–7 rooms per floor
    const rooms = [];

    for (let i = 0; i < roomCount; i++) {
      const isBossRoom = i === roomCount - 1;
      const isShopRoom = i === Math.floor(roomCount / 2) && floor > 1;
      const isTreasureRoom = !isBossRoom && !isShopRoom && Math.random() < 0.15;

      if (isBossRoom) {
        const bossType = floor >= 8 ? 'lich' : floor >= 6 ? 'dragon' : null;
        rooms.push({
          type: 'boss',
          id: i,
          cleared: false,
          enemy: generateEnemy(floor, hero.level, difficultyScore * 1.3, bossType),
          emoji: '💀',
          label: 'Boss Chamber',
        });
      } else if (isShopRoom) {
        rooms.push({
          type: 'shop',
          id: i,
          cleared: false,
          emoji: '🏪',
          label: 'Merchant Component',
          items: [generateLoot(floor, hero.class, difficultyScore),
                  generateLoot(floor, hero.class, difficultyScore),
                  generateLoot(floor, hero.class, difficultyScore)],
        });
      } else if (isTreasureRoom) {
        rooms.push({
          type: 'treasure',
          id: i,
          cleared: false,
          emoji: '💰',
          label: 'Resource Cache',
          loot: generateLoot(floor, hero.class, difficultyScore),
        });
      } else {
        rooms.push({
          type: 'combat',
          id: i,
          cleared: false,
          emoji: '⚔️',
          label: `Node ${i + 1}`,
          enemy: generateEnemy(floor, hero.level, difficultyScore),
        });
      }
    }

    return rooms;
  }

  /**
   * Primary orchestration method — called before each encounter
   * Returns AI decision with reasoning
   */
  orchestrate(hero, currentDifficulty) {
    this.analyzePlayerBehavior(hero);
    const { score, trace } = this.calculateDifficulty(hero, currentDifficulty);

    const decisions = [...trace];

    // Enemy selection decision
    if (this.playerProfile.prefersAttack && hero.floor >= 2) {
      decisions.push(`[DECISION] Environmental Generation: Deploying high-defense entity matrix. Difficulty adjusted to ${score}.`);
    } else if (this.playerProfile.prefersDefense) {
      decisions.push(`[DECISION] Environmental Generation: Deploying high-agility entity matrix to bypass guard. Difficulty adjusted to ${score}.`);
    } else {
      decisions.push(`[DECISION] Environmental Generation: Standard balanced node matrix. Difficulty adjusted to ${score}.`);
    }

    return {
      difficultyScore: score,
      aiDecisions: decisions,
      playerProfile: { ...this.playerProfile },
    };
  }

  /**
   * Real-time Combat Interventions
   */
  combatIntervention(hero, enemy, currentAction) {
    let trace = [];
    let modifiedEnemy = { ...enemy };

    const t = hero.tacticsUsed || { attack: 0, defend: 0, special: 0 };
    const total = Math.max(1, t.attack + t.defend + t.special);
    const prefersAttack = t.attack / total > 0.6;
    const prefersDefend = t.defend / total > 0.4;

    if (currentAction === 'attack' && prefersAttack && hero.totalKills > 2 && Math.random() < 0.4) {
      trace.push(`[UNDERSTANDING] Subject executing repeated 'ATTACK' protocols (Action ${t.attack} of ${total}).`);
      trace.push(`[REASONING] Static strategy detected. Subject is ignoring MP/Special resource mechanics.`);
      trace.push(`[SIMULATION] If no intervention -> Encounter resolved in ${Math.ceil(enemy.hp / hero.attack)} turns. Action economy unoptimized.`);
      trace.push(`[DECISION] Executing real-time parameter shift. Target entity DEF increased by 20%.`);
      modifiedEnemy.defense = Math.floor(modifiedEnemy.defense * 1.2);
    } else if (currentAction === 'defend' && prefersDefend && Math.random() < 0.4) {
      trace.push(`[UNDERSTANDING] Subject relies heavily on 'DEFEND' protocols.`);
      trace.push(`[REASONING] Turtle strategy detected. Modifying environmental pressure to force offensive action.`);
      trace.push(`[SIMULATION] If entity ATK remains constant -> Subject out-heals/out-blocks indefinitely.`);
      trace.push(`[DECISION] Elevating entity aggression parameters. Target entity ATK increased by 15%.`);
      modifiedEnemy.attack = Math.floor(modifiedEnemy.attack * 1.15);
    }

    return { trace, modifiedEnemy };
  }

  /**
   * Post-combat analysis — updates memory
   */
  recordCombatResult(won, hero, hpLost) {
    this.sessionMemory.push({ won, floor: hero.floor, hpLost, timestamp: Date.now() });
    const prev = this.playerProfile.avgHpLostPerFight;
    const n = this.playerProfile.fightsAnalyzed;
    this.playerProfile.avgHpLostPerFight = (prev * n + hpLost) / (n + 1);
  }
}

export const antigravityAgent = new AntigravityAgent();
