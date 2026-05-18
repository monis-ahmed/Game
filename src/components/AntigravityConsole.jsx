import React, { useEffect, useRef, useState } from 'react';

export default function AntigravityConsole({ traces = [], isVisible, onClose }) {
  const [displayedTraces, setDisplayedTraces] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedTraces([]);
      return;
    }

    if (traces.length === 0) return;

    setIsTyping(true);
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedTraces(prev => {
        if (currentIndex < traces.length) {
          const newArr = [...prev, traces[currentIndex]];
          currentIndex++;
          return newArr;
        }
        return prev;
      });

      if (currentIndex >= traces.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 400); // 400ms delay between lines to simulate processing

    return () => clearInterval(interval);
  }, [traces, isVisible]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedTraces]);

  const renderTraceText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[UNDERSTANDING\]|\[REASONING\]|\[SIMULATION\]|\[DECISION\])/g);
    return parts.map((part, i) => {
      if (part === '[UNDERSTANDING]') return <span key={i} style={{color: '#3498db', fontWeight: 'bold'}}>{part}</span>;
      if (part === '[REASONING]') return <span key={i} style={{color: '#f1c40f', fontWeight: 'bold'}}>{part}</span>;
      if (part === '[SIMULATION]') return <span key={i} style={{color: '#9b59b6', fontWeight: 'bold'}}>{part}</span>;
      if (part === '[DECISION]') return <span key={i} style={{color: '#2ecc71', fontWeight: 'bold'}}>{part}</span>;
      return <span key={i}>{part}</span>;
    });
  };

  if (!isVisible) return null;

  return (
    <div className="ag-console-overlay">
      <div className="ag-console">
        <div className="ag-console-header">
          <div className="ag-console-branding">
            <span className="ag-pulse-dot" />
            <span>ANTIGRAVITY // EXECUTION LOG</span>
          </div>
          {onClose && (
            <button className="ag-close-btn" onClick={onClose}>✕</button>
          )}
        </div>
        <div className="ag-console-body">
          {displayedTraces.map((trace, i) => (
            <div key={i} className="ag-trace-line">
              <span className="ag-trace-prefix">{'>'}</span>
              <span className="ag-trace-text">{renderTraceText(trace)}</span>
            </div>
          ))}
          {isTyping && (
            <div className="ag-trace-line">
              <span className="ag-trace-prefix">{'>'}</span>
              <span className="ag-cursor">█</span>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
