import React from 'react';
import { RARITY_COLORS } from '../game/items.js';
import { applyItemToHero } from '../game/items.js';

export default function InventoryScreen({ hero, onHeroUpdate, onClose }) {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [message, setMessage] = React.useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2500);
  };

  const handleEquipOrUse = (item, index) => {
    if (item.type === 'consumable') {
      const updated = applyItemToHero(hero, item);
      const newInventory = [...hero.inventory];
      newInventory.splice(index, 1);
      onHeroUpdate({ ...updated, inventory: newInventory });
      showMessage(`✅ Used ${item.name}!`);
      setSelectedItem(null);
    } else {
      const updated = applyItemToHero(hero, item);
      showMessage(`⚔️ Equipped ${item.name}! Stats boosted.`);
      const newInventory = [...hero.inventory];
      newInventory.splice(index, 1);
      onHeroUpdate({ ...updated, inventory: newInventory });
      setSelectedItem(null);
    }
  };

  const handleDrop = (index) => {
    const newInventory = [...hero.inventory];
    const dropped = newInventory.splice(index, 1)[0];
    const goldGain = Math.floor(dropped.value * 0.4);
    onHeroUpdate({ ...hero, inventory: newInventory, gold: hero.gold + goldGain });
    showMessage(`🗑️ Dropped ${dropped.name} for ${goldGain} gold.`);
    setSelectedItem(null);
  };

  return (
    <div className="inventory-screen">
      <div className="inventory-header">
        <h2 className="inventory-title">⚔️ Inventory</h2>
        <div className="inventory-meta">
          <span className="inv-gold">💰 {hero.gold} Gold</span>
          <span className="inv-count">{hero.inventory.length}/20 slots</span>
        </div>
        <button className="inv-close-btn" onClick={onClose}>✕</button>
      </div>

      {message && (
        <div className="inv-message">{message}</div>
      )}

      {hero.inventory.length === 0 ? (
        <div className="inv-empty">
          <span className="inv-empty-icon">🎒</span>
          <p>Your bag is empty. Defeat enemies to collect loot!</p>
        </div>
      ) : (
        <div className="inv-grid">
          {hero.inventory.map((item, i) => (
            <div
              key={i}
              className={`inv-item ${selectedItem === i ? 'inv-item--selected' : ''}`}
              style={{ '--rarity-color': RARITY_COLORS[item.rarity] || '#95a5a6' }}
              onClick={() => setSelectedItem(selectedItem === i ? null : i)}
            >
              <div className="inv-item__rarity-bar" />
              <div className="inv-item__emoji">{item.emoji}</div>
              <div className="inv-item__name">{item.name}</div>
              <div className="inv-item__rarity" style={{ color: RARITY_COLORS[item.rarity] }}>
                {item.rarity}
              </div>
              <div className="inv-item__type">{item.type}</div>
            </div>
          ))}
        </div>
      )}

      {/* Item detail panel */}
      {selectedItem !== null && hero.inventory[selectedItem] && (
        <div className="inv-detail" style={{ '--rarity-color': RARITY_COLORS[hero.inventory[selectedItem].rarity] }}>
          <div className="inv-detail__header">
            <span className="inv-detail__emoji">{hero.inventory[selectedItem].emoji}</span>
            <div>
              <p className="inv-detail__name">{hero.inventory[selectedItem].name}</p>
              <p className="inv-detail__rarity" style={{ color: RARITY_COLORS[hero.inventory[selectedItem].rarity] }}>
                {hero.inventory[selectedItem].rarity.toUpperCase()} · {hero.inventory[selectedItem].type}
              </p>
            </div>
          </div>
          <p className="inv-detail__desc">{hero.inventory[selectedItem].desc}</p>
          <div className="inv-detail__actions">
            <button
              className="inv-btn inv-btn--use"
              onClick={() => handleEquipOrUse(hero.inventory[selectedItem], selectedItem)}
            >
              {hero.inventory[selectedItem].type === 'consumable' ? '🧪 Use' : '⚔️ Equip'}
            </button>
            <button className="inv-btn inv-btn--drop" onClick={() => handleDrop(selectedItem)}>
              🗑️ Drop (+{Math.floor(hero.inventory[selectedItem].value * 0.4)}g)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
