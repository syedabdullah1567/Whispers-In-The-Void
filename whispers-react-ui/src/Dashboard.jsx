import React from 'react';
import './App.css';

const stats = [
  { val: 7,  lbl: 'Entities on record',   sub: '4 still active',    subColor: '#ff4d4d' },
  { val: 5,  lbl: 'Operations logged',    sub: 'this cycle',         subColor: '#555' },
  { val: 3,  lbl: 'Hunters deployed',     sub: '4 locations',        subColor: '#555' },
  { val: 4,  lbl: 'Artifacts catalogued', sub: '2 found',            subColor: '#ba7517' },
]

const recentOps = [
  { name: 'Xylo-Thul',          type: 'Void Horror',  location: 'Echoing Catacombs',  date: '2026-02-15', outcome: 'neutralized' },
  { name: 'Valerius the Cruel', type: 'Vampire',      location: 'Sunken Cathedral',   date: '2026-03-10', outcome: 'archived'    },
  { name: 'Whisper-in-Walls',   type: 'Poltergeist',  location: 'Sunken Cathedral',   date: '2026-03-12', outcome: 'recorded'    },
  { name: 'Morana Prime',       type: 'Lich',         location: 'Aether Lab 4',       date: '2026-03-18', outcome: 'neutralized' },
  { name: 'Glacia',             type: 'Wraith',       location: 'Echoing Catacombs',  date: '2026-03-22', outcome: 'recorded'    },
]

const threats = [
  { name: 'Xylo-Thul',          type: 'Void Horror', location: 'Sunken Cathedral',  terror:10, state: 'active'      },
  { name: 'Valerius the Cruel', type: 'Vampire',     location: 'Ironwood Forest',   terror: 7,  state: 'active'      },
  { name: 'Glacia',             type: 'Wraith',      location: 'Sector 7 Outpost',  terror: 9,  state: 'active'      },
  { name: 'Morana Prime',       type: 'Lich',        location: 'Echoing Catacombs', terror: 2,  state: 'neutralized' },
]

function terrorColor(t) {
  if (t >= 8) return '#ff4d4d'; 
  if (t >= 4) return '#ba7517'; 
  return '#639922'; 
}

export default function Dashboard() {
  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Central Command</div>
          <div className="topbar-sub">System Time: 2026-04-28 // Clearance: Alpha-4</div>
        </div>
        <span className="status-pill">Uplink Stable</span>
      </div>

      <div className="main-content" style={{ marginLeft: 0 }}> {/* Removed duplicate margin since it's in App.css */}
        {/* Stat cards */}
        <div className="stat-grid">
          {stats.map((s) => (
            <div key={s.lbl} className="stat-card">
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-sub" style={{ color: s.subColor, fontSize: '9px', textTransform: 'uppercase' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Hunter + Ops row */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 15, marginBottom: 15 }}>
          {/* Hunter card */}
          <div className="card">
            <div className="card-label">Active Operative</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                    width: 42, height: 42, 
                    borderRadius: '2px', 
                    background: '#ff4d4d', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 13, 
                    fontWeight: 'bold', 
                    color: '#000' 
                }}>ZM</div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>Zane Miller</div>
                    <div style={{ fontSize: 10, color: '#ff4d4d', textTransform: 'uppercase' }}>Vanguard / Rookie</div>
                </div>
            </div>
            
            <div style={{ marginTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555', marginBottom: 4, textTransform: 'uppercase' }}>
                <span>XP Progress</span><span>340/500</span>
              </div>
              <div style={{ height: 4, background: '#050505', border: '1px solid #1a1a1a' }}>
                <div style={{ height: '100%', width: '68%', background: '#ff4d4d', boxShadow: '0 0 8px rgba(255, 77, 77, 0.4)' }} />
              </div>
            </div>

            <div className="card-label" style={{ marginTop: 25 }}>Core Abilities</div>
            {['True Sight', 'Banishment'].map((a) => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid #111', fontSize: 11, color: '#aaa' }}>
                <div style={{ width: 4, height: 4, background: '#ff4d4d' }} /> {a}
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', fontSize: 11, color: '#333' }}>
              <div style={{ width: 4, height: 4, background: '#222' }} />
              <span>Flame Burst [LOCKED]</span>
            </div>
          </div>

          {/* Recent ops */}
          <div className="card">
            <div className="card-label">Operational Logs</div>
            <div style={{ maxHeight: '310px', overflowY: 'auto', paddingRight: '10px' }}>
                {recentOps.map((op) => (
                <div key={op.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', borderBottom: '1px solid #111' }}>
                    <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#fff' }}>
                        {op.name} <span style={{color: '#333', fontWeight: 'normal'}}>//</span> {op.type}
                    </div>
                    <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', marginTop: 2 }}>{op.location} • {op.date}</div>
                    </div>
                    <span className={`badge badge-${op.outcome}`}>{op.outcome}</span>
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* Active threats */}
        <div className="card">
          <div className="card-label">High-Priority Terror Signatures</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            {threats.map((t) => (
              <div key={t.name} style={{ 
                  background: '#050505', 
                  border: '1px solid #1a1a1a', 
                  padding: '15px',
                  position: 'relative',
                  overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>{t.name}</div>
                    <span style={{ fontSize: 10, color: terrorColor(t.terror), fontWeight: 'bold' }}>LVL {t.terror}</span>
                </div>
                <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.type} // {t.location}</div>
                
                <div style={{ height: 2, background: '#111', marginTop: 12 }}>
                  <div style={{ 
                      height: '100%', 
                      width: `${t.terror * 10}%`, 
                      background: terrorColor(t.terror), 
                      boxShadow: `0 0 10px ${terrorColor(t.terror)}44` 
                  }} />
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                    <span className={`badge badge-${t.state}`} style={{ fontSize: '8px' }}>{t.state}</span>
                    <span style={{ fontSize: '8px', color: '#222' }}>SIG_DETECTED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}