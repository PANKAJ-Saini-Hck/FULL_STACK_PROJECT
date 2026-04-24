import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, ShieldAlert, Cpu, Terminal as TerminalIcon, Zap, Globe, Lock, Search } from 'lucide-react';
import { API_BASE } from '../utils/api';

const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE}/status`);
        setStatus(res.data.status);
      } catch (err) {
        console.error("Failed to fetch system status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const toolCategories = {
    "Forensics": ['steghide', 'zsteg', 'exiftool', 'binwalk', 'strings', 'stegsolve', 'openstego', 'outguess'],
    "Hash_Lab": ['hashcat', 'john'],
    "Web_Probe": ['curl', 'gobuster'],
    "Runtimes": ['python', 'ruby', 'go', 'ffmpeg']
  };

  return (
    <div className="flicker">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <div style={{ color: 'var(--accent-green)', fontSize: '0.75rem', letterSpacing: '4px', marginBottom: '10px' }}>MAINFRAME_STATUS</div>
          <h1 className="section-title neon-text" style={{ marginBottom: 0 }}>SYSTEM_DIAGNOSTICS_v2.0</h1>
        </div>
        <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          DB_UPLOADS: ACTIVE<br/>
          LOGGING: PERSISTENT
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {Object.entries(toolCategories).map(([cat, tools]) => (
          <div key={cat} className="glass-card hacker-border" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
               {cat === 'Forensics' ? <Search className="neon-text-cyan" size={20} /> : 
                cat === 'Hash_Lab' ? <Lock className="neon-text-pink" size={20} /> : 
                cat === 'Web_Probe' ? <Globe className="neon-text-cyan" size={20} /> : 
                <Cpu className="neon-text-green" size={20} />}
               <h3 style={{ fontSize: '1rem', color: 'white', letterSpacing: '2px' }}>{cat.toUpperCase()}</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {tools.map(tool => (
                <div key={tool} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-main)' }}>{tool}</span>
                  {loading ? (
                    <div className="flicker" style={{ color: '#444', fontSize: '0.7rem' }}>PROBING...</div>
                  ) : status?.[tool] ? (
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-green)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      <ShieldCheck size={14} style={{ marginRight: '6px' }} /> ONLINE
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#ff4d4d', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      <ShieldAlert size={14} style={{ marginRight: '6px' }} /> OFFLINE
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card hacker-border shadow-glow" style={{ marginTop: '40px', padding: '35px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '15px', opacity: 0.1 }}>
            <Activity size={100} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap className="neon-text-yellow" size={24} /> MISSION_DIRECTIVE
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', maxWidth: '800px', lineHeight: '1.8' }}>
              This toolkit is a unified interface for low-level forensic and exploitation utilities. 
              Ensure all binaries are in your system PATH for proper execution. 
              <span style={{ color: 'var(--accent-green)' }}> Use the Hash Lab for brute-force operations and Web Probe for reconnaissance.</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
