import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function terrorColor(t) {
  if (t >= 8) return '#ff4d4d'; 
  if (t >= 4) return '#ba7517'; 
  return '#639922'; 
}

export default function Dashboard() {

  const [stats, setStats] = useState([]);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/dashboard/stats");

      const d = res.data;

      setStats([
        { val: d.EntityCount, lbl: 'Entities on record', sub: `${d.ActiveEntity} still active`, subColor: '#ff4d4d' },
        { val: d.OpCount, lbl: 'Operations logged', sub: 'this cycle', subColor: '#555' },
        { val: d.CountDeployedHunters, lbl: 'Hunters deployed', sub: `${d.LocationExplored} locations`, subColor: '#555' },
        { val: d.TotalArtifacts, lbl: 'Artifacts catalogued', sub: `${d.ArtifactsUnlocked} found`, subColor: '#ba7517' },
      ]);

    } catch (err) {
      console.log(err);
    }
  };

  fetchStats();
}, []);


const [hunters, setHunters] = useState([])

useEffect(() => {
  axios.get('http://localhost:3000/api/hunter-activity')
    .then(res => setHunters(res.data))
    .catch(err => console.log(err))
}, [])


const [topThreat, setTopThreat] = useState(null)

useEffect(() => {
  axios.get('http://localhost:3000/api/top-threat')
    .then(res => setTopThreat(res.data))
    .catch(err => console.log(err))
}, [])




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

          {/* Hunter Activity Board */}
          <div className="card">
          <div className="card-label">Hunter Activity Board</div>
          <div style={{ maxHeight: '310px', overflowY: 'auto', paddingRight: '10px' }}>
            {hunters.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', borderBottom: '1px solid #111' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: i === 0 ? '#ff4d4d' : '#333', width: 24 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 'bold', color: '#fff' }}>
                    {h.hunter_name} <span style={{ color: '#333' }}>//</span> {h.rank}
                  </div>
                  <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', marginTop: 2 }}>
                    {h.faction}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#4caf7d' }}>{h.neutralized_count}</div>
                    <div style={{ fontSize: 8, color: '#333', textTransform: 'uppercase' }}>Kills</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#888780' }}>{h.archived_count}</div>
                    <div style={{ fontSize: 8, color: '#333', textTransform: 'uppercase' }}>Archived</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#d49132' }}>{h.total_operations}</div>
                    <div style={{ fontSize: 8, color: '#333', textTransform: 'uppercase' }}>Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Most Wanted Threat */}
{/* Most Wanted Threat */}
<div className="card">
  <div className="card-label">Most Wanted // Priority Target</div>
  {topThreat && topThreat[0] && (
    <div style={{
      background: '#050505',
      border: '1px solid #3a0000',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glowing background effect */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,0,0,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{
            fontSize: 9,
            color: '#ff4d4d',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 8,
            fontFamily: 'monospace'
          }}>
            ⚠ PRIORITY THREAT DETECTED
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textShadow: '0 0 20px rgba(255,77,77,0.3)'
          }}>
            {topThreat[0].true_name}
          </div>
          <div style={{
            fontSize: 11,
            color: '#555',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: 4
          }}>
            {topThreat[0].entity_species} // {topThreat[0].bloodline_name}
          </div>
        </div>

        {/* Terror index big number */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: '#ff4d4d',
            lineHeight: 1,
            textShadow: '0 0 30px rgba(255,77,77,0.6)',
            fontFamily: 'monospace'
          }}>
            {topThreat[0].terror_index}
          </div>
          <div style={{ fontSize: 8, color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Terror Index
          </div>
        </div>
      </div>

      {/* Terror bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ height: 6, background: '#0a0000', border: '1px solid #1a0000' }}>
          <div style={{
            height: '100%',
            width: `${topThreat[0].terror_index * 10}%`,
            background: 'linear-gradient(90deg, #4a0000, #ff4d4d)',
            boxShadow: '0 0 16px rgba(255,77,77,0.6)',
            transition: 'width 1s ease'
          }} />
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          LAST KNOWN LOCATION: <span style={{ color: '#ff4d4d' }}>{topThreat[0].location_name}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 9,
          color: '#ff4d4d',
          textTransform: 'uppercase'
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ff4d4d',
            boxShadow: '0 0 8px #ff4d4d',
            animation: 'pulse 1.5s infinite'
          }} />
          ACTIVE THREAT
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )}
</div>
      </div>
    </>
  )
}