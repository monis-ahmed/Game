import React from 'react';

export default function DungeonMap({ rooms, currentRoomIndex, hero, onEnterRoom }) {
  const getEmoji = (room) => {
    const map = { combat: '⚔️', boss: '💀', shop: '🏪', treasure: '💰', rest: '🏕️' };
    return map[room.type] || '❓';
  };

  const getRoomLabel = (room) => {
    const map = { combat: 'Enemy', boss: 'BOSS', shop: 'Shop', treasure: 'Chest', rest: 'Rest' };
    return map[room.type] || '?';
  };

  const getRoomBg = (room, isActive, isCleared) => {
    if (isCleared) return 'rgba(39,174,96,0.15)';
    if (isActive) return 'rgba(255,255,255,0.12)';
    if (room.type === 'boss') return 'rgba(231,76,60,0.1)';
    if (room.type === 'shop') return 'rgba(243,156,18,0.1)';
    if (room.type === 'treasure') return 'rgba(241,196,15,0.1)';
    return 'rgba(255,255,255,0.05)';
  };

  const getRoomBorder = (room, isActive, isCleared) => {
    if (isCleared) return '#27ae60';
    if (isActive) return '#e2b96e';
    if (room.type === 'boss') return '#e74c3c';
    if (room.type === 'shop') return '#f39c12';
    if (room.type === 'treasure') return '#f1c40f';
    return 'rgba(255,255,255,0.12)';
  };

  return (
    <div className="dungeon-map">
      {/* Floor header */}
      <div className="dungeon-map__header">
        <div className="dungeon-floor-badge">
          <span className="dungeon-floor-icon">🏰</span>
          <span className="dungeon-floor-text">Floor {hero.floor}</span>
        </div>
        <div className="dungeon-progress">
          {rooms.filter(r => r.cleared).length}/{rooms.length} cleared
        </div>
      </div>

      {/* Path visualization */}
      <div className="dungeon-path">
        {rooms.map((room, i) => {
          const isActive = i === currentRoomIndex;
          const isCleared = room.cleared;
          const isLocked = i > currentRoomIndex;
          const canEnter = i === currentRoomIndex && !room.cleared;

          return (
            <React.Fragment key={room.id}>
              {/* Connector line */}
              {i > 0 && (
                <div className={`path-connector ${rooms[i-1].cleared ? 'path-connector--open' : ''}`} />
              )}

              {/* Room node */}
              <div
                className={`dungeon-room
                  ${isActive ? 'dungeon-room--active' : ''}
                  ${isCleared ? 'dungeon-room--cleared' : ''}
                  ${isLocked ? 'dungeon-room--locked' : ''}
                  ${room.type === 'boss' ? 'dungeon-room--boss' : ''}
                `}
                style={{
                  background: getRoomBg(room, isActive, isCleared),
                  borderColor: getRoomBorder(room, isActive, isCleared),
                }}
                onClick={() => canEnter && onEnterRoom(room, i)}
              >
                {/* Glow for active */}
                {isActive && !isCleared && <div className="dungeon-room__pulse" />}

                <div className="dungeon-room__icon">
                  {isCleared ? '✅' : isLocked ? '🔒' : getEmoji(room)}
                </div>
                <div className="dungeon-room__label">{getRoomLabel(room)}</div>

                {/* Enemy preview */}
                {room.enemy && !isCleared && (
                  <div className="dungeon-room__preview">
                    <span className="preview-enemy">{room.enemy.emoji}</span>
                    {room.enemy.isBoss && (
                      <span className="boss-tag">BOSS</span>
                    )}
                  </div>
                )}

                {/* Room number */}
                <div className="dungeon-room__num">{i + 1}</div>

                {/* Locked overlay */}
                {isLocked && <div className="dungeon-room__locked-overlay" />}

                {/* Enter button */}
                {canEnter && (
                  <button
                    className={`dungeon-enter-btn ${room.type === 'boss' ? 'dungeon-enter-btn--boss' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onEnterRoom(room, i); }}
                  >
                    {room.type === 'boss' ? '⚔️ FIGHT BOSS' :
                     room.type === 'shop' ? '🏪 Enter Shop' :
                     room.type === 'treasure' ? '💰 Open Chest' :
                     '▶ Enter Room'}
                  </button>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Floor boss warning */}
      {rooms[currentRoomIndex]?.type === 'boss' && !rooms[currentRoomIndex].cleared && (
        <div className="boss-warning">
          <span className="boss-warning__icon">⚠️</span>
          <div>
            <p className="boss-warning__title">BOSS ROOM AHEAD</p>
            <p className="boss-warning__sub">Prepare all items and abilities before entering!</p>
          </div>
        </div>
      )}
    </div>
  );
}
