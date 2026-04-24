import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Lock, 
  Globe, 
  History as HistoryIcon, 
  Terminal as TerminalIcon, 
  Menu, 
  X,
  Shield,
  Zap
} from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Forensics from './pages/Forensics';
import HashCracker from './pages/HashCracker';
import WebExploitation from './pages/WebExploitation';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`sidebar-link ${active ? 'active' : ''}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '14px 24px',
      textDecoration: 'none',
      color: active ? 'var(--accent-green)' : 'var(--text-dim)',
      borderLeft: `4px solid ${active ? 'var(--accent-green)' : 'transparent'}`,
      background: active ? 'rgba(57, 255, 20, 0.08)' : 'transparent',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '0.85rem',
      fontWeight: '600',
      letterSpacing: '1.5px'
    }}
  >
    <Icon size={18} style={{ filter: active ? 'drop-shadow(0 0 5px var(--accent-green-glow))' : 'none' }} />
    <span style={{ fontFamily: 'var(--font-mono)' }}>{label}</span>
  </Link>
);

const AppContent = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-darker)', position: 'relative' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: sidebarOpen ? '280px' : '0px', 
        background: 'var(--bg-dark)', 
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
        boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ padding: '35px 25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Shield className="neon-text" size={32} />
            <div style={{ position: 'absolute', top: -5, right: -5, width: 10, height: 10, background: 'var(--accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-green)' }}></div>
          </div>
          <h2 style={{ fontSize: '1.3rem', color: 'white', letterSpacing: '3px', fontWeight: '900', fontFamily: 'var(--font-mono)' }}>
            CTF_<span className="neon-text">KIT</span>
          </h2>
        </div>

        <nav style={{ flex: 1, marginTop: '30px' }}>
          <SidebarLink to="/" icon={LayoutDashboard} label="DASHBOARD" active={location.pathname === '/'} />
          <SidebarLink to="/forensics" icon={Search} label="FORENSICS" active={location.pathname === '/forensics'} />
          <SidebarLink to="/cracking" icon={Lock} label="HASH_LAB" active={location.pathname === '/cracking'} />
          <SidebarLink to="/web" icon={Globe} label="WEB_PROBE" active={location.pathname === '/web'} />
        </nav>

        <div style={{ padding: '25px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            color: 'var(--accent-green)', 
            fontSize: '0.75rem',
            background: 'rgba(57, 255, 20, 0.05)',
            padding: '10px 15px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div className="flicker" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }}></div>
            MAINFRAME_ONLINE
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '280px' : '0px',
        transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '0'
      }}>
        {/* Header */}
        <header style={{ 
          height: '70px', 
          background: 'rgba(5, 6, 8, 0.85)', 
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>ACTIVE_SESSION</div>
               <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold' }}>ADMIN@V_NODE_01</div>
             </div>
             <div style={{ width: 40, height: 40, borderRadius: '4px', background: '#111', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyItems: 'center', overflow: 'hidden' }}>
                <Zap size={20} className="neon-text-pink" style={{ margin: 'auto' }} />
             </div>
          </div>
        </header>

        <div className="content-area" style={{ padding: '50px 40px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/forensics" element={<Forensics />} />
            <Route path="/cracking" element={<HashCracker />} />
            <Route path="/web" element={<WebExploitation />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
