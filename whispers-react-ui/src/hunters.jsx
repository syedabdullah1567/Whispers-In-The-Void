import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const Hunters = () => {
    const [hunters, setHunters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHunters = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/hunters");
                setHunters(response.data.hunterData);
            } catch (error) {
                console.error("TERMINAL ERROR: FAILED TO FETCH ASSETS", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHunters();
    }, []);

    if (loading) return (
        <div className="main-content">
            <div className="glitch-text" style={{ textAlign: 'center', marginTop: '20%' }}>
                ACCESSING PERSONNEL FILES...
            </div>
        </div>
    );

    return (
        <div className="main-content">
            {/* Topbar consistent with Dashboard.jsx */}
            <div className="topbar">
                <div>
                    <div className="topbar-title">Personnel Roster</div>
                    <div className="topbar-sub">Authorized Assets // Encrypted Database</div>
                </div>
                <span className="status-pill">Alpha-4 Clearance</span>
            </div>

            {/* Grid using the same spacing as the Terror Signatures card */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '15px' 
            }}>
                {hunters.map(h => (
                    <div key={h.hunter_id} className="stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Header: Rank */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span className="stat-lbl" style={{ color: '#000', background: '#ff4d4d', padding: '2px 8px', fontWeight: 'bold' }}>
                                RK_{h.rank}
                            </span>
                            <div className="status-light pulse"></div>
                        </div>

                        {/* Profile Area - Inherits darkness from stat-card */}
                        <div className="asset-profile-img">
                            <div className="noise-overlay"></div>
                            <span className="id-overlay">ID_{h.hunter_id}</span>
                            <div className="scanline"></div>
                        </div>

                        {/* Info Section - Using Dashboard text styles */}
                        <div style={{ marginTop: '15px' }}>
                            <div className="stat-val" style={{ fontSize: '18px', textTransform: 'uppercase' }}>
                                {h.hunter_name}
                            </div>
                            <div className="stat-lbl" style={{ marginTop: '2px', color: '#555' }}>
                                {h.type} // SECTOR_OP
                            </div>
                        </div>

                        {/* Tactical Footer - Styled like the Terror Signatures bars */}
                        <div style={{ 
                            marginTop: '20px', 
                            paddingTop: '12px', 
                            borderTop: '1px solid #111', 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px'
                        }}>
                            <div>
                                <div style={{ fontSize: '9px', color: '#333', textTransform: 'uppercase' }}>Protocol</div>
                                <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 'bold' }}>
                                    {h.type === 'Scout' ? 'RECON' : h.type === 'Collector' ? 'RETRIEVAL' : 'COMBAT'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '9px', color: '#333', textTransform: 'uppercase' }}>State</div>
                                <div style={{ fontSize: '11px', color: '#00ff00', fontWeight: 'bold' }}>READY</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .asset-profile-img {
                    height: 120px;
                    background: #050505; /* Matches the deep body color */
                    position: relative;
                    border: 1px solid #111;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .asset-profile-img::after {
                    content: '👤';
                    font-size: 3rem;
                    opacity: 0.03;
                }

                .status-light {
                    width: 8px;
                    height: 8px;
                    background: #00ff00;
                    box-shadow: 0 0 8px #00ff00;
                    border-radius: 50%;
                }

                .pulse { animation: pulse-animation 2s infinite; }
                @keyframes pulse-animation {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }

                .id-overlay {
                    position: absolute;
                    bottom: 6px;
                    right: 8px;
                    font-size: 9px;
                    color: #222;
                }
            `}</style>
        </div>
    );
};

export default Hunters;