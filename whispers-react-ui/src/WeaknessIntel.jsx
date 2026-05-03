import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const WeaknessIntel = () => {
    const [penalties, setPenalties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/api/penalties')
            .then(res => setPenalties(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div style={{ color: '#800000', fontFamily: 'monospace', fontSize: 16, letterSpacing: '0.2em', animation: 'flicker 1.5s infinite' }}>
                LOADING BREACH LOG...
            </div>
            <style>{`@keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
    )

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title" style={{ fontSize: 20 }}>Weakness Intel</div>
                    <div className="topbar-sub">Classified Data // Authorization Required</div>
                </div>
                <span className="status-pill" style={{ color: '#ff4d4d', borderColor: '#800000', fontSize: 13 }}>
                    ⚠ ENCRYPTED
                </span>
            </div>

            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* Penalty History */}
                <div className="card" style={{ border: '1px solid #1a0000' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#ff4d4d', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'monospace' }}>
                        ☠ Breach Log // Penalty History
                    </div>
                    {penalties.length === 0 ? (
                        <div style={{ fontSize: 15, color: '#222', fontFamily: 'monospace', padding: '20px 0', textAlign: 'center', letterSpacing: '0.1em' }}>
                            NO BREACHES RECORDED
                        </div>
                    ) : (
                        penalties.map((p, i) => (
                            <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid #111' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <div style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: p.penalty_type === 'ArtifactLost' ? '#ba7517' :
                                               p.penalty_type === 'EntitySpawned' ? '#ff4d4d' : '#800000',
                                        textTransform: 'uppercase',
                                        fontFamily: 'monospace',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {p.penalty_type === 'ArtifactLost' ? '◈ ARTIFACT LOST' :
                                         p.penalty_type === 'EntitySpawned' ? '⚡ ENTITY SPAWNED' :
                                         '☠ ENTITY RESURRECTED'}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#333', fontFamily: 'monospace' }}>
                                        {new Date(p.penalty_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ fontSize: 12, color: '#555', fontFamily: 'monospace', marginBottom: 4 }}>
                                    HUNTER: {p.hunter_name} // TARGET_ID: {p.affected_id}
                                </div>
                                <div style={{ fontSize: 12, color: '#2a2a2a' }}>
                                    {p.penalty_description}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Initiate Card */}
                <div
                    onClick={() => navigate('/weaknesses/initialize')}
                    style={{
                        background: '#050505',
                        border: '1px solid #3a0000',
                        borderRadius: 8,
                        padding: 40,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 24,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'border-color 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#ff4d4d'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#3a0000'}
                >
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(255,0,0,0.06) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />

                    <div style={{
                        width: 100, height: 100,
                        borderRadius: '50%',
                        border: '2px solid #800000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 42,
                        animation: 'pulseRing 2s infinite'
                    }}>⚠</div>

                    <div style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: '#ff4d4d',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontFamily: 'monospace',
                        textAlign: 'center'
                    }}>
                        Initiate Decryption
                    </div>

                    <div style={{
                        fontSize: 13,
                        color: '#444',
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        lineHeight: 2
                    }}>
                        WARNING: Unauthorized access attempts<br />
                        will trigger system penalties<br />
                        <span style={{ color: '#800000' }}>Proceed with caution</span>
                    </div>

                    <div style={{
                        padding: '12px 32px',
                        background: '#1a0000',
                        border: '1px solid #800000',
                        color: '#ff4d4d',
                        fontSize: 13,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        animation: 'pulseRing 2s infinite'
                    }}>
                        [ ENTER SYSTEM ]
                    </div>

                    <style>{`
                        @keyframes pulseRing {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(255,77,77,0.4); }
                            50% { box-shadow: 0 0 0 20px rgba(255,77,77,0); }
                        }
                    `}</style>
                </div>
            </div>
        </div>
    )
}

export default WeaknessIntel;