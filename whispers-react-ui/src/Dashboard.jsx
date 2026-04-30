import './App.css'

const stats = [
  { val: 7,  lbl: 'Entities on record',   sub: '4 still active',    subColor: '#a32d2d' },
  { val: 5,  lbl: 'Operations logged',    sub: 'this cycle',         subColor: '#888780' },
  { val: 3,  lbl: 'Hunters deployed',     sub: '4 locations',        subColor: '#888780' },
  { val: 4,  lbl: 'Artifacts catalogued', sub: '2 found',            subColor: '#854f0b' },
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
  if (t >= 8) return '#e24b4a'
  if (t >= 4) return '#ba7517'
  return '#639922'
}

export default function Dashboard() {
  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Dashboard</div>
          <div className="topbar-sub">Last sync 2026-04-28 · Clearance: Hunter Active</div>
        </div>
        <span className="status-pill">System Online</span>
      </div>

      <div className="page-content">
        {/* Stat cards */}
        <div className="stat-grid">
          {stats.map((s) => (
            <div key={s.lbl} className="stat-card">
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-sub" style={{ color: s.subColor }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Hunter + Ops row */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, marginBottom: 12 }}>
          {/* Hunter card */}
          <div className="card">
            <div className="card-label">your hunter</div>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#eeedfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#3c3489' }}>ZM</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 8 }}>Zane Miller</div>
            <div style={{ fontSize: 12, color: '#888780' }}>Rookie · Vanguard · Tracking</div>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888780', marginBottom: 4 }}>
                <span>XP</span><span>340/500</span>
              </div>
              <div style={{ height: 5, background: '#f1efe8', borderRadius: 3 }}>
                <div style={{ height: 5, width: '68%', background: '#7f77dd', borderRadius: 3 }} />
              </div>
            </div>
            <div className="card-label" style={{ marginTop: 14 }}>abilities</div>
            {['True Sight', 'Banishment'].map((a) => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', fontSize: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7f77dd', flexShrink: 0 }} />{a}
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d3d1c7', flexShrink: 0 }} />
              <span style={{ color: '#888780' }}>Flame Burst (locked)</span>
            </div>
          </div>

          {/* Recent ops */}
          <div className="card">
            <div className="card-label">recent operations</div>
            {recentOps.map((op) => (
              <div key={op.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{op.name} — {op.type}</div>
                  <div style={{ fontSize: 11, color: '#888780' }}>{op.location} · {op.date}</div>
                </div>
                <span className={`badge badge-${op.outcome}`}>{op.outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active threats */}
        <div className="card">
          <div className="card-label">active threats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {threats.map((t) => (
              <div key={t.name} style={{ background: '#f9f8f4', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>{t.type} · {t.location}</div>
                <div style={{ height: 4, background: '#e8e6df', borderRadius: 2, marginTop: 8 }}>
                  <div style={{ height: 4, width: `${t.terror * 10}%`, background: terrorColor(t.terror), borderRadius: 2 }} />
                </div>
                <span className={`badge badge-${t.state}`} style={{ marginTop: 6 }}>{t.state} · terror {t.terror}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
