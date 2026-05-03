import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const IntelArchive = () => {
    const [weaknesses, setWeaknesses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/api/weaknesses/decrypted')
            .then(res => setWeaknesses(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div style={{ color: '#4caf7d', fontFamily: 'monospace', fontSize: 16, letterSpacing: '0.2em', animation: 'flicker 1.5s infinite' }}>
                LOADING INTEL ARCHIVE...
            </div>
            <style>{`@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        </div>
    )

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title" style={{ fontSize: 20 }}>Intel Archive</div>
                    <div className="topbar-sub">Decrypted Weakness Data // Classified Records</div>
                </div>
                <span className="status-pill" style={{ color: '#4caf7d', borderColor: '#1a3a1a', fontSize: 13 }}>
                    {weaknesses.length} RECORDS UNLOCKED
                </span>
            </div>

            <div style={{ padding: 24 }}>
                {weaknesses.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                        gap: 16
                    }}>
                        <div style={{ fontSize: 48 }}>🔒</div>
                        <div style={{ fontSize: 18, color: '#222', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            NO INTEL UNLOCKED
                        </div>
                        <div style={{ fontSize: 13, color: '#1a1a1a', fontFamily: 'monospace' }}>
                            Complete decryption challenges to populate this archive
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                        {weaknesses.map((w, i) => (
                            <div key={i} style={{
                                background: '#050505',
                                border: '1px solid #1a3a1a',
                                borderLeft: '4px solid #4caf7d',
                                borderRadius: 6,
                                padding: 24,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Glow */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'radial-gradient(circle at 0% 50%, rgba(76,175,125,0.04) 0%, transparent 60%)',
                                    pointerEvents: 'none'
                                }} />

                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div style={{
                                        fontSize: 9,
                                        color: '#4caf7d',
                                        fontFamily: 'monospace',
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase'
                                    }}>
                                        ✓ DECRYPTED // RECORD_{w.weakness_id}
                                    </div>
                                    <div style={{
                                        width: 8, height: 8,
                                        borderRadius: '50%',
                                        background: '#4caf7d',
                                        boxShadow: '0 0 8px #4caf7d'
                                    }} />
                                </div>

                                {/* Weakness name */}
                                <div style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: 8,
                                    fontFamily: 'monospace'
                                }}>
                                    {w.weakness_name}
                                </div>

                                {/* Entity type */}
                                <div style={{
                                    fontSize: 12,
                                    color: '#444',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: 16,
                                    fontFamily: 'monospace'
                                }}>
                                    AFFECTS: <span style={{ color: '#ff4d4d' }}>{w.entity_type}</span>
                                </div>

                                {/* Description */}
                                <div style={{
                                    fontSize: 13,
                                    color: '#555',
                                    lineHeight: 1.8,
                                    marginBottom: 16,
                                    fontStyle: 'italic'
                                }}>
                                    {w.description}
                                </div>

                                {/* Divider */}
                                <div style={{ height: 1, background: '#0a2a0a', marginBottom: 14 }} />

                                {/* Artifact info */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: 11, color: '#333', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                                        ARTIFACT: <span style={{ color: '#ba7517' }}>{w.artifact_name || 'UNKNOWN'}</span>
                                    </div>
                                    <div style={{
                                        fontSize: 9,
                                        padding: '3px 8px',
                                        background: '#0a1a0a',
                                        border: '1px solid #1a3a1a',
                                        color: '#2a5a2a',
                                        fontFamily: 'monospace',
                                        textTransform: 'uppercase'
                                    }}>
                                        {w.artifact_status || 'UNLOCATED'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default IntelArchive;