import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AttackingMission = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [showSplash, setShowSplash] = useState(true);

    const { location, sessionId } = state || {};

    const [entities, setEntities] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [view, setView] = useState('entity'); // 'entity' or 'artifact'
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedArtifact, setSelectedArtifact] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2500);

        if (!location?.location_id) return () => clearTimeout(timer);

        const fetchEntities = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/locations/${location.location_id}/entities`
                );
                setEntities(res.data);
            } catch (err) {
                toast.error("SCAN_ERROR: ENTITY SIGNATURES NOT DETECTED");
            }
        };

        fetchEntities();
        return () => clearTimeout(timer);
    }, [location]);

    const handleLockTarget = async (entity) => {
        try {
            await axios.post('http://localhost:3000/api/combat/assign-entity', {
                sessionId: Number(sessionId),
                entityId: Number(entity.entity_id),
                locationId: Number(location.location_id)
            });
            
            setSelectedEntity(entity);
            toast.success(`TARGET_LOCKED: ${entity.entity_name}`);
            fetchLocationArtifacts();
        } catch (err) {
            toast.error("DATABASE_LINK_FAILURE: TARGET NOT REGISTERED");
        }
    };

    const fetchLocationArtifacts = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/gameplay/artifacts/${sessionId}`);
            setArtifacts(res.data);
            setView('artifact');
        } catch (err) {
            toast.error("ARTIFACT_ARCHIVE_ACCESS_DENIED");
        }
    };

    const handleFinalEngagement = async () => {
        if (!selectedArtifact) {
            toast.warn("NO_ARTIFACT_LOADED: SELECT A RELIC TO PROCEED");
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/combat/confirm-loadout', {
                sessionId: Number(sessionId),
                artifactId: Number(selectedArtifact.ID) // Matches your artifact object property
            });

            toast.success("SYSTEM_SYNC: LOADOUT REGISTERED");
            navigate('/combat-resolution', { 
                state: { ...state, selectedEntity, selectedArtifact } 
            });
        } catch (err) {
            toast.error("CRITICAL_FAILURE: DATABASE LINK INTERRUPTED");
        }
    };

    return (
        <div className="mission-terminal">
            {showSplash && (
                <div className="mission-splash">
                    <div className="splash-content">
                        <div className="top-line">SYSTEM_INITIALIZED // SESSION_{sessionId}</div>
                        <h1 className="mission-title">MISSION STARTED</h1>
                        <div className="location-ping">DEPLOYING TO: {location?.location_name}</div>
                        <div className="scan-bar"></div>
                        <div className="bottom-line">SCANNING FOR ENTITY SIGNATURES...</div>
                    </div>
                </div>
            )}
            
            <ToastContainer theme="dark" />
            
            <div className="header-ui">
                <div className="status-tag">SESSION: {sessionId}</div>
                <div className="status-tag">LOC: {location?.location_name}</div>
                {selectedEntity && (
                    <div className="status-tag" style={{borderColor: '#ff4d4d'}}>
                        LOCKED: {selectedEntity.entity_name}
                    </div>
                )}
            </div>

            {view === 'entity' ? (
                <div className="section">
                    <h2 className="glitch">TARGET ACQUISITION</h2>
                    <div className="grid">
                        {entities.map(ent => (
                            <div key={ent.entity_id} className="card target-card" onClick={() => handleLockTarget(ent)}>
                                <div className="label">ENTITY_TYPE</div>
                                <div className="name">{ent.entity_name}</div>
                                <div className="threat">THREAT_LVL: {ent.threat_level}</div>
                                <div className="action-hint">CLICK TO LOCK SIGNATURE</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (<div className="section">
                    <h2 className="glitch" style={{ color: '#00d2ff' }}>ARTIFACT LOADOUT</h2>
                    
                    <div className="grid">
                        {artifacts.map((art) => {
                            // Check if this card is the one currently in the selection state
                            // Ensure art.ID matches the property name coming from your API
                            const isSelected = selectedArtifact?.ID === art.ID;

                            return (
                                <div
                                    key={art.ID}
                                    className={`card artifact-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedArtifact(art)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="category-badge">
                                        {isSelected ? '[ LOADED ]' : (art.Classification || 'RELIC')}
                                    </div>
                                    
                                    <div className="artifact-visual">
                                        <div className="glow-circle"></div>
                                    </div>
                                    
                                    <div className="artifact-info">
                                        <div className="name">{art["Artifact Name"]}</div>
                                        <div className="origin">ORIGIN: {art["Origin Point"]}</div>
                                    </div>
                                    
                                    <div className="artifact-footer">
                                        <div className="status-row">
                                            <span>STATUS</span>
                                            <span className="val">{art["Current Status"]}</span>
                                        </div>
                                        <div className="progress-track">
                                            <div className={`fill ${isSelected ? 'active' : ''}`}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Use the handleFinalEngagement function we created to ensure the DB updates before navigating */}
                    <button className="engage-btn" onClick={handleFinalEngagement}>
                        INITIALIZE ENGAGEMENT
                    </button>
                </div>
            )}
            <style>{`
                .mission-terminal { 
                    background: #0d0d0d; color: #888; min-height: 100vh; padding: 40px; 
                    font-family: 'JetBrains Mono', monospace; 
                }
                
                .header-ui { display: flex; gap: 20px; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 40px; }
                
                .status-tag { 
                    font-size: 11px; background: #111; padding: 6px 14px; border: 1px solid #333;
                    border-left: 3px solid #ff4d4d; color: #eee; text-transform: uppercase; letter-spacing: 2px;
                }

                .glitch { color: #ff4d4d; text-transform: uppercase; letter-spacing: 5px; font-size: 24px; margin-bottom: 30px; }

                .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }

                /* TARGET CARDS (image_a38686.png Style) */
                .target-card { 
                    background: #151515; padding: 30px; border-left: 4px solid #ff4d4d; cursor: pointer; transition: 0.2s;
                }
                .target-card:hover { background: #1c1c1c; transform: translateX(5px); }
                .target-card .label { font-size: 10px; color: #ff4d4d; margin-bottom: 8px; }
                .target-card .name { font-size: 24px; color: #fff; margin-bottom: 10px; }
                .target-card .threat { color: #666; font-size: 12px; }
                .target-card .action-hint { font-size: 9px; margin-top: 15px; color: #444; }

                /* ARTIFACT CARDS (image_a325fe.png Style) */
                .artifact-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 0; position: relative; }
                .artifact-card.selected { border-color: #ff4d4d; }
                .category-badge { 
                    background: rgba(0, 210, 255, 0.1); border: 1px solid #00d2ff; 
                    color: #00d2ff; font-size: 10px; padding: 4px 10px; margin: 15px; display: inline-block;
                }
                .artifact-visual { 
                    height: 120px; background: radial-gradient(circle, #00d2ff10 0%, #000 100%); 
                    margin: 0 15px; border: 1px solid #1a1a1a; position: relative; overflow: hidden;
                }
                .glow-circle {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 40px; height: 40px; border: 2px solid #00d2ff20; border-radius: 50%;
                }
                .artifact-info { padding: 20px 15px; }
                .artifact-info .name { color: #00d2ff; font-size: 18px; }
                .artifact-info .origin { font-size: 10px; color: #555; }
                .artifact-footer { padding: 15px; border-top: 1px solid #1a1a1a; }
                .status-row { display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 5px; }
                .status-row .val { color: #00d2ff; }
                .progress-track { height: 3px; background: #111; width: 100%; margin: 5px 0; }
                .progress-track .fill { height: 100%; background: #00d2ff; width: 60%; box-shadow: 0 0 10px #00d2ff; }
                .avail-text { font-size: 8px; color: #333; text-align: right; margin-top: 5px; }

                /* SPLASH SCREEN */
                .mission-splash {
                    position: fixed; inset: 0; background: #0a0a0a; display: flex;
                    justify-content: center; align-items: center; z-index: 9999;
                    animation: fadeOut 0.4s ease 2.2s forwards;
                }
                .splash-content {
                    width: 450px; padding: 40px; border-left: 8px solid #ff4d4d; background: #111; position: relative;
                }
                .mission-title { font-size: 32px; color: #ff4d4d; letter-spacing: 4px; margin: 10px 0; }
                .top-line { color: #eee; font-size: 12px; }
                .location-ping { color: #fff; font-size: 18px; margin: 10px 0; }
                .scan-bar { 
                    height: 2px; background: #ff4d4d; width: 100%; position: absolute; 
                    left: 0; bottom: 0; animation: scanline 2s linear infinite; 
                }

                .engage-btn { 
                    width: 100%; margin-top: 30px; padding: 20px; background: #ff4d4d; 
                    color: #fff; border: none; font-weight: bold; cursor: pointer; 
                    text-transform: uppercase; letter-spacing: 3px;
                }

                @keyframes scanline { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-100px); opacity: 0; } }
                @keyframes fadeOut { to { opacity: 0; visibility: hidden; } }
           
                .artifact-card { 
                    background: #0a0a0a; 
                    border: 1px solid #1a1a1a; 
                    padding: 0; 
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); /* Smooth easing */
                    overflow: hidden;
                }

                .artifact-card:hover {
                    border-color: #333;
                    background: #0f0f0f;
                }

                /* THE SELECTION STATE */
                .artifact-card.selected { 
                    border-color: #ff4d4d; 
                    background: #140a0a; /* Slight red tint to background */
                    box-shadow: 0 0 25px rgba(255, 77, 77, 0.15), inset 0 0 10px rgba(255, 77, 77, 0.05);
                    transform: translateY(-5px) scale(1.02); /* Lift effect */
                    z-index: 2;
                }

                /* Badge Transition */
                .category-badge {
                    transition: all 0.3s ease;
                }

                .artifact-card.selected .category-badge {
                    background: rgba(255, 77, 77, 0.2);
                    border-color: #ff4d4d;
                    color: #ff4d4d;
                    letter-spacing: 1px;
                }

                /* Visual Glow Animation */
                .artifact-visual {
                    transition: background 0.5s ease;
                }

                .artifact-card.selected .artifact-visual {
                    background: radial-gradient(circle, rgba(255, 77, 77, 0.2) 0%, #000 100%);
                }

                .artifact-card.selected .glow-circle {
                    border-color: rgba(255, 77, 77, 0.5);
                    transform: translate(-50%, -50%) scale(1.5);
                    transition: all 0.6s ease;
                }

                /* Progress Bar "Charging" Animation */
                .progress-track .fill {
                    width: 0%; 
                    transition: width 0.8s cubic-bezier(0.65, 0, 0.35, 1), background 0.3s ease;
                }

                .artifact-card.selected .fill {
                    background: #ff4d4d !important;
                    width: 100% !important;
                    box-shadow: 0 0 15px #ff4d4d;
                    animation: pulseGlow 2s infinite;
                }

                /* Keyframes for a "living" UI feel */
                @keyframes pulseGlow {
                    0% { opacity: 0.8; box-shadow: 0 0 5px #ff4d4d; }
                    50% { opacity: 1; box-shadow: 0 0 15px #ff4d4d; }
                    100% { opacity: 0.8; box-shadow: 0 0 5px #ff4d4d; }
                }

           `}</style>
        </div>
    );
};

export default AttackingMission;