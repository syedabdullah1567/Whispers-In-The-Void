import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';


const EntityRegistry = () => {
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/entities");
                setEntities(response.data);
            } catch (error) {
                console.error("TERMINAL ERROR: FAILED TO EXTRACT ENTITY DATA", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntities();
    }, []);

    if (loading) return (
        <div className="main-content">
            <div className="glitch-text" style={{ color: '#800000', textAlign: 'center', marginTop: '20%' }}>
                DECRYPTING ENTITY CODEX...
            </div>
        </div>
    );

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title">Entity Registry</div>
                    <div className="topbar-sub">All Supernatural Entities // Threat Classification</div>
                </div>
                <span className="status-pill" style={{ borderColor: '#800000', color: '#ff4d4d' }}>ENTITIES_TRACKED</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '15px'
            }}>
                {entities.map(e => (
                    <div key={e.entity_id} className="stat-card" style={{ borderLeft: '4px solid #800000' }}>
                        {/* Header: Species */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span className="stat-lbl" style={{ color: '#fff', background: '#4a0000', padding: '2px 8px', fontWeight: 'bold', fontSize: '9px', textTransform: 'uppercase' }}>
                                {e.entity_species || 'UNKNOWN SPECIES'}
                            </span>
                            
                        </div>

                        {/* Visual Profile */}
                        <div className="entity-profile-img">
                            <div className="blood-overlay"></div>
                            <span className="id-overlay">ENTITY_ID_{e.entity_id}</span>
                            <div className="pulse-circle"></div>
                        </div>

                        {/* Info Section */}
                        <div style={{ marginTop: '15px' }}>
                            <div className="stat-val" style={{ fontSize: '18px', textTransform: 'uppercase', color: '#ff4d4d' }}>
                                {e.true_name}
                            </div>
                            <div className="stat-lbl" style={{ marginTop: '2px', color: '#555' }}>
                                LOCATION: {e.location_name || 'UNKNOWN'}
                            </div>
                            <div className="stat-lbl" style={{ marginTop: '2px', color: '#555' }}>
                                BLOODLINE: {e.bloodline_name || 'UNKNOWN'}
                            </div>
                        </div>

                        {/* Tactical Footer */}
                        <div style={{
                            marginTop: '20px',
                            paddingTop: '12px',
                            borderTop: '1px solid #200'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <div style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase' }}>Terror Index</div>
                                <div style={{ fontSize: '9px', color: '#ff4d4d', fontWeight: 'bold' }}>{e.terror_index}/10</div>
                            </div>

                            <div style={{ height: '4px', background: '#1a0000' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${e.terror_index * 10}%`,
                                    background: e.terror_index >= 8 ? '#ff0000' : e.terror_index >= 5 ? '#800000' : '#4a0000',
                                    boxShadow: '0 0 8px #ff000044'
                                }}></div>
                            </div>

                            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '8px', color: '#222', letterSpacing: '1px' }}>
                                    STATUS: {e.existence_state.toUpperCase()}
                                </div>
                                <div style={{
                                    fontSize: '8px',
                                    color: e.existence_state === 'active' ? '#ff4d4d' : e.existence_state === 'neutralized' ? '#4caf7d' : '#888780',
                                    letterSpacing: '1px'
                                }}>
                                    {e.existence_state === 'active' ? '⚠ THREAT ACTIVE' : e.existence_state === 'neutralized' ? '✓ NEUTRALIZED' : '◼ ARCHIVED'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .entity-profile-img {
                    height: 120px;
                    background: #0a0000;
                    position: relative;
                    border: 1px solid #300;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .entity-profile-img::after {
                    content: '👁';
                    font-size: 2.5rem;
                    opacity: 0.05;
                }

                .entity-spinner {
                    width: 10px;
                    height: 10px;
                    border: 2px solid #800000;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { 100% { transform: rotate(360deg); } }

                .pulse-circle {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border: 1px solid #4a0000;
                    border-radius: 50%;
                    opacity: 0;
                    animation: pulse-out 4s infinite;
                }

                @keyframes pulse-out {
                    0% { transform: scale(0.5); opacity: 0.5; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .blood-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle, transparent 40%, #000 100%);
                    pointer-events: none;
                }

                .id-overlay {
                    position: absolute;
                    bottom: 6px;
                    right: 8px;
                    font-size: 8px;
                    color: #300;
                    font-family: 'JetBrains Mono', monospace;
                }
            `}</style>
        </div>
    );
};

export default EntityRegistry;