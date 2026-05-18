# ChronoQuest: The Agentic Realm 🏰⚔️

## Challenge 4 — Mobile App Alchemy: Agentic Game Quest

---

## What Is ChronoQuest?

**ChronoQuest: The Agentic Realm** is an AI-powered mobile RPG dungeon crawler where a **Google Antigravity-orchestrated AI Dungeon Master** drives every aspect of the game. No two runs are ever the same.

Players descend through procedurally-generated dungeon floors, battling enemies that **adapt to their exact playstyle**, collecting loot determined by an AI referee, and reading narrative text generated uniquely each session.

---

## 🎮 The Gameplay Hook

### Core Loop: Explore → Fight → Grow → Go Deeper

```
Choose Hero → Enter Floor → Read AI Narrative → Navigate Rooms
    ↓                                                    ↓
Level Up ← Collect Loot ← Defeat Enemy ← Combat Screen
    ↓
Next Floor (harder, AI-adjusted)
```

**Why you can't put it down:**
- Every fight feels different — enemies counter your tactics
- The AI DM shows you its reasoning, making victories feel earned
- Loot drops are exciting and unpredictable (common → legendary)
- Floor bosses create natural tension spikes
- XP, level-up, and score systems create constant micro-goals

---

## 🤖 Agentic AI Architecture

### Agent 1: The Dungeon Master (`DungeonMaster.js`)

The primary Antigravity orchestrator. It:

| Task | How |
|------|-----|
| **Behavior Analysis** | Tracks attack/defend/special usage ratios per session |
| **Dynamic Difficulty** | Adjusts enemy power 0.7×–2.0× based on win/loss streaks |
| **Floor Generation** | Creates 3–7 rooms per floor (combat, boss, shop, treasure) |
| **Enemy Selection** | Picks counters to your preferred tactics |
| **Decision Transparency** | Shows reasoning to player ("📈 Win streak detected — enemies scaling up") |

**Adaptive Difficulty Rules:**
- Win streak ≥ 3 → +0.15 difficulty multiplier
- Loss streak ≥ 2 → −0.20 (rubber banding to keep game fair)
- Attack-heavy player → enemies get higher defense
- Never uses specials → DM hints via combat tips

### Agent 2: The Combat Referee (`CombatReferee.js`)

Acts as game judge — ensures fair play at all times:

| Task | How |
|------|-----|
| **Damage Validation** | Applies variance (85%–115%), defense mitigation |
| **Critical Hits** | Speed-based crit chance (up to 35%) |
| **Special Moves** | MP cost enforced; ignores 50% of enemy defense |
| **Item Validation** | Prevents invalid item use (e.g. full MP, non-combat items) |
| **Flee Resolution** | Speed-based escape chance (10%–80%) |
| **Reward Verification** | Stamps rewards with `refereeSeal: 'VERIFIED'` |
| **Efficiency Scoring** | Rates combat: Excellent / Good / Survived |

### Agent 3: The Narrative Engine (`NarrativeEngine.js`)

Generates contextual story text:

- **Floor intros** — unique per depth level (8 distinct atmospheres)
- **Combat intros** — tailored to enemy tactics type (aggressive/balanced/boss etc.)
- **Victory/defeat lines** — unique pool with deduplication
- **AI DM commentary** — shown during decision log
- **Typewriter rendering** — text animates character-by-character

---

## 🏗️ Technical Architecture

```
src/
├── agents/
│   ├── DungeonMaster.js     ← Primary Antigravity orchestrator
│   ├── CombatReferee.js     ← Validates all actions & rewards
│   └── NarrativeEngine.js   ← AI story/dialogue generator
├── game/
│   ├── gameState.js         ← Central state, hero creation, XP/level system
│   ├── enemies.js           ← 9 enemy archetypes + AI scaling
│   └── items.js             ← 15 items, rarity system, loot generation
├── components/
│   ├── StartScreen.jsx      ← Animated particle title screen
│   ├── HeroSelect.jsx       ← 3-class hero picker with stat previews
│   ├── DungeonMap.jsx       ← Visual path with room nodes
│   ├── CombatScreen.jsx     ← Turn-based combat with floating damage
│   ├── NarrativePanel.jsx   ← Typewriter story + AI decision log
│   ├── HeroStats.jsx        ← Full stats + AI combat analysis tracker
│   ├── InventoryScreen.jsx  ← Item grid with use/equip/drop
│   ├── RewardScreen.jsx     ← Animated loot reveal
│   ├── Leaderboard.jsx      ← Persistent top-10 (localStorage)
│   └── GameOver.jsx         ← Final score breakdown
└── App.jsx                  ← Main orchestrator, screen routing
```

---

## 🎯 Heroes

| Hero | HP | MP | ATK | DEF | SPD | Special |
|------|----|----|-----|-----|-----|---------|
| ⚔️ Warrior | 120 | 40 | 18 | 12 | 8 | Blade Storm (3×) |
| 🔮 Mage | 75 | 100 | 25 | 6 | 12 | Arcane Surge (4×) |
| 🗡️ Rogue | 90 | 60 | 22 | 8 | 18 | Shadow Strike (2.5×) |

---

## 👹 Enemy Types

| Enemy | Floor | Tactics | Unique Mechanic |
|-------|-------|---------|-----------------|
| Goblin Scout | 1+ | Aggressive | Fast attacker |
| Bone Knight | 1+ | Balanced | Armored |
| Toxic Slime | 1+ | Defensive | High HP |
| Orc Berserker | 3+ | Berserker | Enrages at 50% HP |
| Blood Vampire | 3+ | Lifesteal | Heals on special |
| Stone Golem | 4+ | Tank | Massive defense |
| Dark Witch | 4+ | Spellcaster | Prefers specials |
| 🐉 Dragon Whelp | 6+ | Boss | Floor boss |
| ☠️ Lich King | 8+ | Boss | Ultimate boss |

---

## 🚀 Running the Game

```bash
cd f:/Game
npm install
npm run dev
```

Open **http://localhost:5173** — optimized for **390×844px** mobile viewport.

---

## 📱 Mobile-First Design

- Fixed 390×844 mobile frame centered on desktop
- All touch targets ≥ 44px
- No horizontal scroll — fully contained
- Glassmorphism dark theme with gold accents
- Cinzel serif for fantasy headings, Inter for UI text
- Smooth CSS animations throughout (no external libraries)

---

## 🏆 Scoring System

```
Score = (Level × 500) + (Kills × 100) + (Floor × 200) + Gold
```

Top 10 scores persist via `localStorage` across sessions.

---

## ✅ Challenge Requirements Met

| Requirement | Implementation |
|-------------|---------------|
| Dynamic Flow | DM adjusts difficulty 0.7×–2.0× per win/loss streak |
| Intelligent Mechanics | Enemy tactics adapt to player attack patterns |
| High Retention Loop | XP → Level Up → Deeper Floors → Boss Encounters |
| Agentic Workflow | 3 dedicated agents with transparent reasoning |
| Visual Feedback | Floating damage numbers, HP bars, shake animations |
| Validation & Fair Play | CombatReferee stamps every reward as VERIFIED |
| Infinite Variety | Procedural floors + scaled enemies = no two runs alike |

---

*Built with React + Vite · Google Antigravity Agentic AI · Challenge 4 Entry*
