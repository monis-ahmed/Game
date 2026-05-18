// ============================================================
// CHRONOQUEST: Combat Referee Agent
// Validates all actions and ensures fair play
// ============================================================

/**
 * CombatReferee Agent
 *
 * Acts as the game's "judge" — ensures:
 * 1. All damage calculations are legitimate
 * 2. No exploits (e.g., using items mid-fight incorrectly)
 * 3. XP and gold rewards match what was earned
 * 4. Status effects are applied properly
 */
export class CombatReferee {
  /**
   * Validate and calculate player attack damage
   */
  resolvePlayerAttack(hero, enemy) {
    // Base damage with variance
    const variance = 0.85 + Math.random() * 0.3; // 85%–115%
    const rawDamage = hero.attack * variance;

    // Enemy defense reduction (diminishing returns)
    const defReduction = enemy.defense / (enemy.defense + 20);
    const mitigated = rawDamage * (1 - defReduction);

    // Critical hit check (speed-based)
    const critChance = Math.min(0.35, hero.speed / 100);
    const isCrit = Math.random() < critChance;
    const finalDamage = Math.max(1, Math.floor(isCrit ? mitigated * 1.8 : mitigated));

    return {
      damage: finalDamage,
      isCrit,
      blocked: Math.floor(rawDamage - mitigated),
      isValid: true,
    };
  }

  /**
   * Validate and calculate special ability damage
   */
  resolvePlayerSpecial(hero, enemy) {
    if (hero.mp < hero.specialCost) {
      return { damage: 0, isValid: false, reason: 'Not enough MP!' };
    }

    const variance = 0.9 + Math.random() * 0.2;
    const rawDamage = hero.attack * hero.specialMultiplier * variance;

    // Specials partially ignore defense
    const defReduction = (enemy.defense * 0.5) / (enemy.defense * 0.5 + 20);
    const finalDamage = Math.max(1, Math.floor(rawDamage * (1 - defReduction)));

    return {
      damage: finalDamage,
      isCrit: false,
      mpCost: hero.specialCost,
      isValid: true,
    };
  }

  /**
   * Validate enemy action and calculate damage
   */
  resolveEnemyAction(enemy, hero, action) {
    if (action === 'defend') {
      return { type: 'defend', damage: 0, isValid: true };
    }

    const isSpecial = action === 'special';
    const multiplier = isSpecial ? (enemy.specialMove?.multiplier || 1.5) : 1.0;
    const variance = 0.85 + Math.random() * 0.3;
    const rawDamage = enemy.attack * multiplier * variance;

    // Player defense (if defending, double defense)
    const effectiveDefense = hero.defendingNextTurn ? hero.defense * 2 : hero.defense;
    const defReduction = effectiveDefense / (effectiveDefense + 20);
    let finalDamage = Math.max(1, Math.floor(rawDamage * (1 - defReduction)));

    // Life steal mechanic
    let enemyHeal = 0;
    if (enemy.lifeSteal && isSpecial) {
      enemyHeal = Math.floor(finalDamage * 0.4);
    }

    return {
      type: isSpecial ? 'special' : 'attack',
      damage: finalDamage,
      enemyHeal,
      moveName: isSpecial ? enemy.specialMove?.name : 'Attack',
      isValid: true,
    };
  }

  /**
   * Validate and calculate rewards after combat
   * Referee ensures rewards match actual difficulty
   */
  calculateRewards(hero, enemy, turnsUsed, difficultyScore) {
    // Base rewards
    let xp = enemy.xpReward;
    let gold = enemy.goldReward;

    // Efficiency bonus — fewer turns = more XP
    if (turnsUsed <= 3) {
      xp = Math.floor(xp * 1.3);
      gold = Math.floor(gold * 1.2);
    }

    // Difficulty bonus
    xp = Math.floor(xp * (1 + (difficultyScore - 1) * 0.3));
    gold = Math.floor(gold * difficultyScore);

    // HP remaining bonus (risk vs reward)
    const hpBonus = hero.hp / hero.maxHp > 0.7 ? 1.15 : 1.0;
    xp = Math.floor(xp * hpBonus);

    // Referee seal — marks rewards as legitimate
    return {
      xp,
      gold,
      turnsUsed,
      efficiency: turnsUsed <= 3 ? 'Excellent' : turnsUsed <= 6 ? 'Good' : 'Survived',
      refereeSeal: 'VERIFIED',
      timestamp: Date.now(),
    };
  }

  /**
   * Validate item usage in combat
   */
  validateItemUse(item, hero) {
    if (!item.combatUsable) {
      return { isValid: false, reason: 'Cannot use this item in combat!' };
    }
    if (item.id === 'mana_crystal' && hero.mp >= hero.maxMp) {
      return { isValid: false, reason: 'MP is already full!' };
    }
    return { isValid: true };
  }

  /**
   * Check flee attempt (speed-based)
   */
  resolveFlee(hero, enemy) {
    const fleeChance = Math.min(0.8, Math.max(0.1, (hero.speed - enemy.speed) / 30 + 0.4));
    const success = Math.random() < fleeChance;
    return {
      success,
      chance: Math.floor(fleeChance * 100),
      message: success
        ? '💨 You escaped successfully!'
        : '❌ Escape failed! The enemy blocks your path.',
    };
  }
}

export const combatReferee = new CombatReferee();
