import React from 'react';

export default function NarrativePanel({ text, type = 'story', aiDecisions = [], onClose, onContinue }) {
  const [visibleChars, setVisibleChars] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // Typewriter effect
  React.useEffect(() => {
    setVisibleChars(0);
    setDone(false);
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleChars(i);
      if (i >= text.length) {
        setDone(true);
        clearInterval(timer);
      }
    }, 18);
    return () => clearInterval(timer);
  }, [text]);

  const skipTypewriter = () => {
    setVisibleChars(text?.length || 0);
    setDone(true);
  };

  const iconMap = {
    story: '📖',
    combat_intro: '⚔️',
    victory: '🏆',
    defeat: '💀',
    floor_complete: '🏰',
    merchant: '🏪',
    treasure: '💰',
    level_up: '✨',
    ai_dm: '🤖',
  };

  const colorMap = {
    story: '#e2b96e',
    combat_intro: '#e74c3c',
    victory: '#f1c40f',
    defeat: '#e74c3c',
    floor_complete: '#2ecc71',
    merchant: '#f39c12',
    treasure: '#f1c40f',
    level_up: '#9b59b6',
    ai_dm: '#3498db',
  };

  return (
    <div className="narrative-panel" style={{ '--nar-color': colorMap[type] || '#e2b96e' }}>
      <div className="narrative-panel__inner">
        {/* Top bar */}
        <div className="narrative-top">
          <div className="narrative-type-badge">
            <span>{iconMap[type] || '📖'}</span>
            <span>{type.replace('_', ' ').toUpperCase()}</span>
          </div>
          {onClose && (
            <button className="narrative-close" onClick={onClose}>✕</button>
          )}
        </div>

        {/* Text area */}
        <div className="narrative-text-box" onClick={!done ? skipTypewriter : undefined}>
          <p className="narrative-text">
            {text?.slice(0, visibleChars)}
            {!done && <span className="narrative-cursor">▌</span>}
          </p>
        </div>

        {/* Antigravity traces are now rendered globally via AntigravityConsole */}

        {/* Continue button */}
        {done && onContinue && (
          <button className="narrative-continue" onClick={onContinue}>
            {type === 'victory' ? '🏆 Collect Rewards' :
             type === 'floor_complete' ? '⬇ Descend Deeper' :
             type === 'merchant' ? '🏪 Open Shop' :
             type === 'treasure' ? '💰 Take Loot' :
             type === 'level_up' ? '✨ Continue' :
             'Continue ▶'}
          </button>
        )}

        {/* Tap to skip hint */}
        {!done && (
          <p className="narrative-skip-hint">Tap to skip...</p>
        )}
      </div>
    </div>
  );
}
