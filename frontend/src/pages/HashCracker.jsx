import React, { useState, useRef } from 'react';
import { Lock, Hash, Search, Zap, ExternalLink, Activity, Terminal as TerminalIcon, Upload, Download, FileText } from 'lucide-react';
import { runTool } from '../utils/api';
import Terminal from '../components/Terminal';

const HashCracker = () => {
  const [hashInput, setHashInput] = useState('');
  const [hashType, setHashType] = useState('auto');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [identifiedType, setIdentifiedType] = useState('');
  const [customWordlist, setCustomWordlist] = useState(null);
  const [useCustomWordlist, setUseCustomWordlist] = useState(false);
  const [customWords, setCustomWords] = useState('');
  const [wordlistMode, setWordlistMode] = useState('default'); // 'default' | 'rockyou' | 'custom' | 'paste'
  const wordlistInputRef = useRef(null);

  const identifyHash = (hash) => {
    if (/^[a-f0-9]{32}$/i.test(hash)) return 'MD5';
    if (/^[a-f0-9]{40}$/i.test(hash)) return 'SHA-1';
    if (/^[a-f0-9]{64}$/i.test(hash)) return 'SHA-256';
    if (/^\$2[ayb]\$.{56}$/.test(hash)) return 'BCrypt';
    return 'Unknown';
  };

  const handleIdentify = () => {
    if (!hashInput) return;
    const type = identifyHash(hashInput.trim());
    setIdentifiedType(type);
    setOutput(`[SYSTEM] Analyzing hash: ${hashInput}\n[SUCCESS] Identified Pattern: ${type}`);
  };

  const handleWordlistFile = (e) => {
    if (e.target.files[0]) {
      setCustomWordlist(e.target.files[0]);
      setWordlistMode('custom');
      setOutput(`[SYSTEM] Custom wordlist loaded: ${e.target.files[0].name}\n[SIZE] ${Math.round(e.target.files[0].size / 1024)} KB\n[STATUS] Ready to crack with custom wordlist.`);
    }
  };

  const handleCrack = async (tool) => {
    if (!hashInput) {
      alert("Enter a hash first!");
      return;
    }
    setLoading(true);

    let wordlistInfo = '[WORDLIST] Using default wordlist';
    let extraArgs = `--hash ${hashInput} --wordlist default`;

    if (wordlistMode === 'custom' && customWordlist) {
      wordlistInfo = `[WORDLIST] Using custom: ${customWordlist.name}`;
      extraArgs = `--hash ${hashInput} --wordlist custom`;
    } else if (wordlistMode === 'paste' && customWords.trim()) {
      wordlistInfo = `[WORDLIST] Using pasted custom word list (${customWords.trim().split('\n').length} words)`;
      extraArgs = `--hash ${hashInput} --wordlist paste`;
    } else if (wordlistMode === 'rockyou') {
      wordlistInfo = `[WORDLIST] rockyou.txt selected — upload to backend/bin/ for full cracking`;
      extraArgs = `--hash ${hashInput} --wordlist rockyou`;
    }

    setOutput(
      `[INITIALIZING] Starting ${tool.toUpperCase()} attack...\n` +
      `[TARGET] ${hashInput}\n` +
      wordlistInfo + '\n' +
      `[WAIT] Processing wordlists...`
    );

    // Build form data — send custom wordlist blob if applicable
    let fileToSend = null;
    if (wordlistMode === 'custom' && customWordlist) {
      fileToSend = customWordlist;
    } else if (wordlistMode === 'paste' && customWords.trim()) {
      // Convert pasted text to a Blob so we can send it as a file
      const blob = new Blob([customWords.trim()], { type: 'text/plain' });
      fileToSend = new File([blob], 'custom_paste.txt', { type: 'text/plain' });
    }

    const res = await runTool(tool, 'CRACKING', extraArgs, fileToSend);

    if (res.success) {
      setOutput(res.output || "[SYSTEM] No result found in wordlist.");
    } else {
      setOutput(`[ERROR] ${res.error}\n\n${res.output}`);
    }
    setLoading(false);
  };

  return (
    <div className="flicker">
      <h1 className="section-title neon-text">HASH_CRACKING_LAB</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        {/* ── Left Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Hash Input Card */}
          <div className="glass-card hacker-border" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent-cyan)', marginBottom: '10px', letterSpacing: '2px' }}>INPUT_HASH_STRING</label>
              <input
                type="text"
                className="monospace"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '15px',
                  color: 'var(--accent-green)',
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn-cyber" style={{ flex: 1 }} onClick={handleIdentify}>
                <Search size={16} /> IDENTIFY
              </button>
              <button className="btn-cyber" style={{ flex: 1, borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }} onClick={() => handleCrack('john')}>
                <Zap size={16} /> JOHN_RIPPER
              </button>
            </div>

            <div style={{ padding: '20px', background: 'rgba(57, 255, 20, 0.03)', borderRadius: '4px', borderLeft: '3px solid var(--accent-green)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>IDENTIFIED_TYPE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '5px' }}>
                {identifiedType || '___'}
              </div>
            </div>
          </div>

          {/* ── Custom Wordlist Builder ── */}
          <div className="glass-card hacker-border" style={{ padding: '28px' }}>
            <h4 style={{ color: 'var(--accent-pink)', marginBottom: '18px', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <FileText size={16} /> WORDLIST_CONFIG
            </h4>

            {/* Mode Selector */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
              {[
                { key: 'default', label: 'DEFAULT' },
                { key: 'rockyou', label: 'ROCKYOU.TXT' },
                { key: 'custom',  label: 'UPLOAD FILE' },
                { key: 'paste',   label: 'PASTE WORDS' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setWordlistMode(key)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    borderRadius: '3px',
                    border: wordlistMode === key ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.12)',
                    background: wordlistMode === key ? 'rgba(0,255,255,0.08)' : 'transparent',
                    color: wordlistMode === key ? 'var(--accent-cyan)' : 'var(--text-dim)',
                    transition: 'all 0.2s'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* DEFAULT */}
            {wordlistMode === 'default' && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                Built-in wordlist with common passwords will be used by John the Ripper.
              </div>
            )}

            {/* ROCKYOU */}
            {wordlistMode === 'rockyou' && (
              <div style={{ padding: '14px', background: 'rgba(255,200,0,0.04)', borderRadius: '4px', border: '1px solid rgba(255,200,0,0.15)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-yellow)', marginBottom: '10px' }}>
                  RockYou is the most popular password wordlist (14M+ passwords, ~133 MB).
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                  Download and place as <code style={{ color: 'var(--accent-green)' }}>backend/bin/rockyou.txt</code> to enable local cracking.
                </div>
                <a
                  href="https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255,200,0,0.1)',
                    border: '1px solid var(--accent-yellow)',
                    color: 'var(--accent-yellow)',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '3px',
                    letterSpacing: '1px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,200,0,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,200,0,0.1)'}
                >
                  <Download size={13} /> DOWNLOAD_ROCKYOU.TXT
                </a>
              </div>
            )}

            {/* UPLOAD FILE */}
            {wordlistMode === 'custom' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="file"
                  accept=".txt,.lst,.dic"
                  ref={wordlistInputRef}
                  onChange={handleWordlistFile}
                  style={{ display: 'none' }}
                  id="wordlistUpload"
                />
                <button
                  className="btn-cyber"
                  onClick={() => wordlistInputRef.current.click()}
                  style={{ borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}
                >
                  <Upload size={14} /> SELECT_WORDLIST_FILE
                </button>
                {customWordlist && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', padding: '10px', background: 'rgba(57,255,20,0.04)', borderRadius: '4px', border: '1px solid rgba(57,255,20,0.15)' }}>
                    ✓ Loaded: <b>{customWordlist.name}</b> ({Math.round(customWordlist.size / 1024)} KB)
                  </div>
                )}
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  Accepts .txt / .lst / .dic — will be used as John's --wordlist
                </div>
              </div>
            )}

            {/* PASTE WORDS */}
            {wordlistMode === 'paste' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
                  ENTER_ONE_PASSWORD_PER_LINE
                </label>
                <textarea
                  className="monospace"
                  value={customWords}
                  onChange={(e) => setCustomWords(e.target.value)}
                  placeholder={"password123\nadmin@2024\niloveyou\nletmein"}
                  rows={6}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--accent-green)',
                    padding: '12px',
                    outline: 'none',
                    resize: 'vertical',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}
                />
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  {customWords.trim() ? `${customWords.trim().split('\n').filter(l => l.trim()).length} words ready` : 'Type your custom wordlist above'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Engines & External Tools ── */}
        <div className="glass-card hacker-border" style={{ padding: '30px' }}>
          <h4 style={{ color: 'var(--accent-yellow)', marginBottom: '20px', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={18} /> CRACKING_ENGINE
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ToolRow name="Hashcat" status="READY" onClick={() => handleCrack('hashcat')} />
            <ToolRow name="RainbowCrack" status="OFFLINE" onClick={() => {}} />
            <ToolRow name="CrackStation" status="EXTERNAL" onClick={() => window.open('https://crackstation.net/', '_blank')} isLink />
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <p>[INFO] John the Ripper — CPU-based cracking. Supports custom wordlists.</p>
            <p style={{ marginTop: '5px' }}>[INFO] Hashcat — GPU-accelerated, fastest for MD5/SHA attacks.</p>
            <p style={{ marginTop: '5px' }}>[TIP] Upload rockyou.txt as custom wordlist for maximum coverage.</p>
          </div>

          {/* Wordlist status indicator */}
          <div style={{ marginTop: '18px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '2px', marginBottom: '8px' }}>ACTIVE_WORDLIST</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: wordlistMode === 'custom' && customWordlist ? 'var(--accent-green)' : wordlistMode === 'paste' && customWords ? 'var(--accent-pink)' : wordlistMode === 'rockyou' ? 'var(--accent-yellow)' : 'var(--text-dim)' }}>
              {wordlistMode === 'custom' && customWordlist
                ? `✓ ${customWordlist.name}`
                : wordlistMode === 'paste' && customWords.trim()
                ? `✓ Custom (${customWords.trim().split('\n').filter(l => l.trim()).length} words)`
                : wordlistMode === 'rockyou'
                ? '⚡ rockyou.txt (place in backend/bin/)'
                : '[ default wordlist ]'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Terminal output={output} status={loading ? 'cracking' : 'idle'} title="CRACK_SESSION_OUTPUT" />
      </div>
    </div>
  );
};

const ToolRow = ({ name, status, onClick, isLink }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.05)'
  }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{name}</span>
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: `1px solid ${status === 'READY' ? 'var(--accent-green)' : status === 'EXTERNAL' ? 'var(--accent-cyan)' : '#444'}`,
        color: status === 'READY' ? 'var(--accent-green)' : status === 'EXTERNAL' ? 'var(--accent-cyan)' : '#444',
        padding: '4px 10px',
        fontSize: '0.7rem',
        cursor: 'pointer',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      {status} {isLink && <ExternalLink size={10} />}
    </button>
  </div>
);

export default HashCracker;
