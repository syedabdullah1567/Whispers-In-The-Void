import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const OperationLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/operation-log");
                // Accessing the data key based on our previous pattern
                if (response.data.success) {
                    setLogs(response.data.operationData);
                } else {
                    setLogs(response.data); // Fallback if not wrapped in success object
                }
            } catch (error) {
                console.error("UPLINK ERROR: FAILED TO RETRIEVE OPERATIONAL HISTORY", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return (
        <div className="main-content">
            <div className="glitch-text" style={{ color: '#ba7517', textAlign: 'center', marginTop: '20%' }}>
                RETRIEVING MISSION ARCHIVES...
            </div>
        </div>
    );

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title">Operational Logs</div>
                    <div className="topbar-sub">Mission History // Deployment Records</div>
                </div>
                <span className="status-pill" style={{ borderColor: '#ba7517', color: '#ba7517' }}>DATABASE_SYNC_OK</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '15px'
            }}>
                {logs.length > 0 ? logs.map(log => (
                    <div key={log.operation_id} className="stat-card" style={{ borderLeft: '4px solid #ba7517' }}>
                        
                        {/* Header: Date and ID */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontSize: '9px', color: '#444', letterSpacing: '1px' }}>
                                LOG_REF_{log.operation_id.toString().padStart(4, '0')}
                            </span>
                            <span style={{ fontSize: '10px', color: '#ba7517', fontWeight: 'bold' }}>
                                {new Date(log.operation_date).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Mission Visualizer */}
                        <div className="mission-profile-img">
                            <div className="scan-overlay"></div>
                            <div className="grid-background"></div>
                            <span className="id-overlay">LOC_ID_{log.location_id}</span>
                        </div>

                        {/* Mission Details */}
                        <div style={{ marginTop: '15px' }}>
                            <div className="stat-val" style={{ fontSize: '18px', textTransform: 'uppercase', color: '#eee' }}>
                                {'Sector ' + log.location_id || 'Classified Location'}
                            </div>
                            <div className="stat-lbl" style={{ marginTop: '5px', color: '#ba7517', fontSize: '11px', fontWeight: 'bold' }}>
                                OPERATIVE: {log.hunter_name || `UNIT_${log.hunter_id}`}
                            </div>
                        </div>

                        {/* Tactical Metadata */}
                        <div style={{
                            marginTop: '20px',
                            paddingTop: '12px',
                            borderTop: '1px solid #222'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontSize: '9px', color: '#555', textTransform: 'uppercase' }}>Objective Result</div>
                                <div style={{ 
                                    fontSize: '9px', 
                                    color: log.outcome === 'neutralized' ? '#4caf7d' : '#ba7517', 
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}>
                                    {log.outcome}
                                </div>
                            </div>

                            <div style={{ fontSize: '10px', color: '#444', fontStyle: 'italic' }}>
                                {log.entity_name ? `Target: ${log.entity_name}` : "General Reconnaissance / Scouting Mission"}
                            </div>

                            <div style={{ marginTop: '12px', textAlign: 'right' }}>
                                <span style={{ 
                                    fontSize: '8px', 
                                    padding: '2px 6px', 
                                    background: '#111', 
                                    color: '#555',
                                    border: '1px solid #222'
                                }}>
                                    ENCRYPTED_LOG_V1.0.4
                                </span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ color: '#444', textAlign: 'center', gridColumn: '1/-1', marginTop: '50px' }}>
                        NO OPERATIONAL RECORDS FOUND IN THIS CYCLE.
                    </div>
                )}
            </div>

            <style>{`
                .mission-profile-img {
                    height: 100px;
                    background: #0a0a0a;
                    position: relative;
                    border: 1px solid #1a1a1a;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .mission-profile-img::before {
                    content: '🛰';
                    font-size: 2rem;
                    opacity: 0.1;
                    z-index: 1;
                }

                .grid-background {
                    position: absolute;
                    inset: 0;
                    background-size: 20px 20px;
                    background-image: 
                        linear-gradient(to right, #111 1px, transparent 1px),
                        linear-gradient(to bottom, #111 1px, transparent 1px);
                    opacity: 0.3;
                }

                .scan-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: rgba(186, 117, 23, 0.3);
                    box-shadow: 0 0 10px #ba7517;
                    animation: scan-move 3s linear infinite;
                    z-index: 2;
                }

                @keyframes scan-move {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }

                .id-overlay {
                    position: absolute;
                    bottom: 6px;
                    right: 8px;
                    font-size: 8px;
                    color: #333;
                    font-family: 'JetBrains Mono', monospace;
                }
            `}</style>
        </div>
    );
};

export default OperationLogs;