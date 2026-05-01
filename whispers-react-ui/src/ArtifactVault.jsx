import React, { useState, useEffect } from 'react';

const ArtifactVault = () => {
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    console.log("useEffect triggered");
        const locationId = 1; 

        fetch(`http://localhost:3000/api/artifacts/${locationId}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                // Ensure data is an array before setting state
                if (Array.isArray(data)) {
                    setArtifacts(data);
                } else {
                    console.error("Data received is not an array:", data);
                    setArtifacts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Vault access denied:", err);
                setLoading(false);
            });
    }, []);

if (loading) return (
        <div className="main-content">
            <div className="glitch-text" style={{ color: '#004d40', textAlign: 'center', marginTop: '20%' }}>
                SCANNING RELICS DATABASE...
            </div>
        </div>
    );

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title">Artifact Vault</div>
                    <div className="topbar-sub">Relic Classification // Archive Access</div>
                </div>
                <span className="status-pill" style={{ borderColor: '#004d40', color: '#00ffcc' }}>
                    VAULT_SYNC_ACTIVE
                </span>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '15px' 
            }}>
                {artifacts.length > 0 ? artifacts.map(a => (
                    <div key={a.ID} className="stat-card" style={{ borderLeft: '4px solid #004d40' }}>
                        
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span className="stat-lbl" style={{ 
                                color: '#fff', 
                                background: '#00332d', 
                                padding: '2px 8px', 
                                fontWeight: 'bold', 
                                fontSize: '9px', 
                                textTransform: 'uppercase' 
                            }}>
                                {a.Classification}
                            </span>
                            <div className="artifact-spinner"></div>
                        </div>

                        {/* Visual */}
                        <div className="artifact-img">
                            <div className="artifact-overlay"></div>
                            <span className="id-overlay">ART_{a.ID}</span>
                            <div className="pulse-circle"></div>
                        </div>

                        {/* Info */}
                        <div style={{ marginTop: '15px' }}>
                            <div className="stat-val" style={{ 
                                fontSize: '18px', 
                                textTransform: 'uppercase', 
                                color: '#00ffcc' 
                            }}>
                                {a['Artifact Name']}
                            </div>

                            <div className="stat-lbl" style={{ marginTop: '2px', color: '#555' }}>
                                ORIGIN: {a['Origin Point']}
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div style={{ 
                            marginTop: '20px', 
                            paddingTop: '12px', 
                            borderTop: '1px solid #002'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <div style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase' }}>
                                    Status
                                </div>
                                <div style={{ fontSize: '9px', color: '#00ffcc', fontWeight: 'bold' }}>
                                    {a['Current Status']}
                                </div>
                            </div>

                            <div style={{ height: '4px', background: '#001a1a' }}>
                                <div style={{ 
                                    height: '100%',
                                    width: a['Current Status'] === 'Active' ? '100%' : '50%',
                                    background: '#004d40',
                                    boxShadow: '0 0 8px #00ffcc44'
                                }}></div>
                            </div>

                            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                <div style={{ fontSize: '8px', color: '#222', letterSpacing: '1px' }}>
                                    {a['Current Status'] === 'Active' ? 'OPERATIONAL' : 'ARCHIVED'}
                                </div>
                            </div>
                        </div>

                    </div>
                )) : (
                    <p>No artifacts found for this sector.</p>
                )}
            </div>

            <style>{`
                .artifact-img {
                    height: 120px;
                    background: #001a1a;
                    position: relative;
                    border: 1px solid #003;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .artifact-img::after {
                    content: '🧿';
                    font-size: 2.5rem;
                    opacity: 0.05;
                }

                .artifact-spinner {
                    width: 10px;
                    height: 10px;
                    border: 2px solid #004d40;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { 100% { transform: rotate(360deg); } }

                .pulse-circle {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border: 1px solid #004d40;
                    border-radius: 50%;
                    opacity: 0;
                    animation: pulse-out 4s infinite;
                }

                @keyframes pulse-out {
                    0% { transform: scale(0.5); opacity: 0.5; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .artifact-overlay {
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
                    color: #003;
                    font-family: 'JetBrains Mono', monospace;
                }
            `}</style>
        </div>
    );
};
export default ArtifactVault;