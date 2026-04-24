import React, { useEffect, useRef } from 'react';

const Terminal = ({ output, title = "System Terminal", status = "idle" }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal-window glass-card hacker-border" style={{ marginTop: '0px', overflow: 'hidden' }}>
      <div className="terminal-header" style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="dot" style={{ background: '#ff5f56', width: 10, height: 10, borderRadius: '50%' }}></div>
          <div className="dot" style={{ background: '#ffbd2e', width: 10, height: 10, borderRadius: '50%' }}></div>
          <div className="dot" style={{ background: '#27c93f', width: 10, height: 10, borderRadius: '50%' }}></div>
        </div>
        <div style={{ 
          fontSize: '0.65rem', 
          color: 'var(--text-dim)', 
          fontFamily: 'var(--font-mono)', 
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{title}</span>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: status === 'idle' ? 'var(--text-dim)' : 'var(--accent-green)' }}>
            STATUS_{status.toUpperCase()}
          </span>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="terminal-body terminal-scroll" 
        style={{ 
          background: 'rgba(0,0,0,0.4)', 
          minHeight: '300px', 
          maxHeight: '400px', 
          overflowY: 'auto',
          padding: '25px',
          position: 'relative'
        }}
      >
        <div className="scanline" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }}></div>
        
        {output ? (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all', 
              color: 'var(--accent-green)', 
              fontFamily: 'var(--font-mono)',
              lineHeight: '1.5',
              fontSize: '0.85rem'
            }}>
              {output}
              <span className="flicker" style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--accent-green)', marginLeft: '4px', verticalAlign: 'middle' }}></span>
            </pre>
          </div>
        ) : (
          <div style={{ color: 'rgba(57, 255, 20, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            [SYSTEM] Waiting for process initialization...
            <span className="flicker" style={{ display: 'inline-block', width: '8px', height: '14px', background: 'rgba(57, 255, 20, 0.2)', marginLeft: '4px', verticalAlign: 'middle' }}></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
