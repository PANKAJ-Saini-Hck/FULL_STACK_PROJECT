import React, { useState } from 'react';
import { Upload, Search, FileImage, FileAudio, FileVideo, Play, Info, Layers, ExternalLink } from 'lucide-react';
import { runTool } from '../utils/api';
import Terminal from '../components/Terminal';

const Forensics = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('IMAGE'); // IMAGE, AUDIO, VIDEO
  const [selectedTool, setSelectedTool] = useState('exiftool');
  const [args, setArgs] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = {
    IMAGE: [
      { id: 'exiftool', name: 'Exiftool', desc: 'Metadata/GPS Analysis' },
      { id: 'steghide', name: 'Steghide', desc: 'Extract data with password', defaultArgs: 'extract -p "" -sf' },
      { id: 'zsteg', name: 'zsteg', desc: 'LSB Stego (PNG/BMP)' },
      { id: 'stegsolve', name: 'Stegsolve', desc: 'Color Channel Analysis' },
      { id: 'binwalk', name: 'Binwalk', desc: 'Embedded File Scanner', defaultArgs: '-e' },
      { id: 'outguess', name: 'OutGuess', desc: 'Extract hidden text' },
      { id: 'openstego', name: 'OpenStego', desc: 'Watermarking/Stego' },
      { id: 'strings', name: 'Strings', desc: 'Deep Text Search' }
    ],
    AUDIO: [
      { id: 'ffmpeg', name: 'FFmpeg Spectrogram', desc: 'Generate Visual Audio Map', defaultArgs: '-i {{FILE}} -lavfi showspectrumpic=s=hd720 spectrogram.png' },
      { id: 'deepsound', name: 'DeepSound CLI', desc: 'Extract carrier data' },
      { id: 'strings', name: 'Strings', desc: 'Search for hidden flags' },
      { id: 'exiftool', name: 'Exiftool', desc: 'Audio Metadata' }
    ],
    VIDEO: [
      { id: 'ffmpeg', name: 'FFmpeg Frames', desc: 'Extract all frames', defaultArgs: '-i {{FILE}} -vf "select=eq(pict_type\\,I)" -fps_mode vfr frame_%03d.png' },
      { id: 'binwalk', name: 'Binwalk', desc: 'Nested Data Scanner' },
      { id: 'exiftool', name: 'Exiftool', desc: 'Video Meta/GPS' },
      { id: 'strings', name: 'Strings', desc: 'Code Injection Search' }
    ]
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setOutput(`[SYSTEM] Target loaded: ${e.target.files[0].name}\n[SIZE] ${Math.round(e.target.files[0].size / 1024)} KB\n[STATUS] Ready for analysis.`);
    }
  };

  const handleRun = async () => {
    if (!file) {
      alert("No target file loaded!");
      return;
    }
    setLoading(true);
    setOutput(`[INITIALIZING] Running ${selectedTool.toUpperCase()}...\n[CATEGORY] ${category}\n[TARGET] ${file.name}\n\n[STDOUT] Processing byte-stream...`);
    
    const res = await runTool(selectedTool, category, args, file);
    
    if (res.success) {
      setOutput(res.output || res.error || "[SYSTEM] Tool executed successfully. No text output returned.");
    } else {
      setOutput(`[FATAL_ERROR] ${res.error}\n\n[TRACE]\n${res.output}`);
    }
    setLoading(false);
  };

  return (
    <div className="flicker">
      <h1 className="section-title neon-text">FORENSIC_ANALYSIS_LAB</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        {/* Left: Input & Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Staging Area */}
          <div className="glass-card hacker-border" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px', opacity: 0.8 }}>
              {category === 'IMAGE' ? <FileImage size={64} className="neon-text-cyan" /> : 
               category === 'AUDIO' ? <FileAudio size={64} className="neon-text-pink" /> : 
               <FileVideo size={64} className="neon-text-cyan" />}
            </div>
            <h3 style={{ marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
              {file ? file.name : 'LOAD_TARGET_BUFFER'}
            </h3>
            <input type="file" id="forensicUpload" onChange={handleFileChange} style={{ display: 'none' }} />
            <button className="btn-cyber" onClick={() => document.getElementById('forensicUpload').click()}>
              SELECT_FILE
            </button>
          </div>

          {/* Tool Configuration */}
          <div className="glass-card hacker-border" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
              {['IMAGE', 'AUDIO', 'VIDEO'].map(cat => (
                <button 
                  key={cat}
                  className="btn-cyber"
                  style={{ flex: 1, fontSize: '0.7rem', filter: category === cat ? 'none' : 'grayscale(1)', opacity: category === cat ? 1 : 0.4 }}
                  onClick={() => { setCategory(cat); setSelectedTool(tools[cat][0].id); setArgs(tools[cat][0].defaultArgs || ''); }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--accent-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>ACTIVE_TOOLSET</label>
                <select 
                  className="monospace"
                  style={{ width: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px', outline: 'none' }}
                  value={selectedTool}
                  onChange={(e) => {
                    const toolId = e.target.value;
                    setSelectedTool(toolId);
                    const tool = tools[category].find(t => t.id === toolId);
                    setArgs(tool?.defaultArgs || '');
                  }}
                >
                  {tools[category].map(t => (
                    <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>
                  ))}
                </select>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  {tools[category].find(t => t.id === selectedTool)?.desc}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--accent-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>EXEC_PARAMETERS</label>
                <input 
                  type="text"
                  className="monospace"
                  style={{ width: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-green)', padding: '12px', outline: 'none' }}
                  value={args}
                  onChange={(e) => setArgs(e.target.value)}
                  placeholder="e.g. -p pass -sf"
                />
              </div>

              <button className="btn-cyber" style={{ width: '100%', marginTop: '10px' }} onClick={handleRun} disabled={loading}>
                {loading ? 'ANALYZING...' : 'INITIALIZE_SCAN'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Terminal output={output} status={loading ? 'scanning' : 'idle'} title={`${selectedTool.toUpperCase()}_REPORT`} />
          
          <div className="glass-card hacker-border" style={{ padding: '25px' }}>
            <h4 style={{ color: 'var(--accent-yellow)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Info size={16} /> FORENSIC_INTEL
            </h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
              <p>• {selectedTool === 'binwalk' ? 'Binwalk looks for file signatures. Use -e to extract found segments.' : 
                  selectedTool === 'zsteg' ? 'zsteg is the best for PNG/BMP pixel-based steganography (LSB).' : 
                  selectedTool === 'steghide' ? 'Steghide requires a password for extraction if one was used.' : 
                  'Metadata can often contain GPS coordinates and software signatures.'}</p>
              <div style={{ marginTop: '15px' }}>
                <div style={{ color: 'white', marginBottom: '5px' }}>CATEGORY_HINT</div>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid' }}>
                   Try running <b>strings</b> on any file first to catch low-hanging flags in plaintext.
                </div>
              </div>
            </div>

            {/* Aperisolve External Tool */}
            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '18px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '2px', marginBottom: '10px' }}>ONLINE_RESOURCES</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'white' }}>Aperisolve</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '3px' }}>Online Multi-Stego Analyzer</div>
                </div>
                <button
                  onClick={() => window.open('https://www.aperisolve.com/', '_blank')}
                  style={{
                    background: 'none',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    padding: '4px 10px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  EXTERNAL <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forensics;
