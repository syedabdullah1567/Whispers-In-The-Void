import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added for routing

const ArtifactVault = () => {
    const { state } = useLocation(); // Catch the data passed from Locations.jsx
    const navigate = useNavigate();
    
    // Safely extract the location data from state
    const targetLocationId = state?.locationId;
    const targetLocationName = state?.locationName || "UNKNOWN SECTOR";

    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch if we actually have a locationId from the state
        if (!targetLocationId) {
            setLoading(false);
            return;
        }

        console.log(`useEffect triggered for Sector: ${targetLocationId}`);

        fetch(`http://localhost:3000/api/artifacts/${targetLocationId}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
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
    }, [targetLocationId]); // Re-run if targetLocationId changes

    // --- GATEKEEPER: If user arrives here without a location selection ---
    if (!targetLocationId && !loading) {
        return (
            <div className="main-content" style={{ textAlign: 'center', marginTop: '15%' }}>
                <div className="glitch-text" style={{ color: '#ff4d4d', fontSize: '24px' }}>ACCESS DENIED</div>
                <p style={{ color: '#555', margin: '20px 0' }}>No sector targeted for relic retrieval.</p>
                <button 
                    onClick={() => navigate('/locations')}
                    style={{ background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', padding: '10px 20px', cursor: 'pointer' }}
                >
                    RETURN TO TACTICAL MAP
                </button>
            </div>
        );
    }

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
                    {/* Displaying the name of the location we clicked on */}
                    <div className="topbar-sub">Sector: {targetLocationName} // Classification Access</div>
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
                                    {a.lifecycleState || (a['Current Status'] === 'Active' ? 'OPERATIONAL' : 'ARCHIVED')}
                                </div>
                            </div>
                        </div>

                    </div>
                )) : (
                    <div className="stat-card" style={{ textAlign: 'center', padding: '40px', color: '#444' }}>
                        NO ARTIFACTS FOUND FOR THIS SECTOR.
                    </div>
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