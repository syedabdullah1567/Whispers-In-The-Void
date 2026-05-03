import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reuse existing image URLs for icons/placeholders
const ENTITY_EYE_URL = "https://img.icons8.com/ios-filled/100/ff4d4d/visible.png";
const ARTIFACT_TARGET_URL = "https://img.icons8.com/ios/100/00d2ff/target.png";

const AttackingMission = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    // UI State
    const [showSplash, setShowSplash] = useState(true);
    const [view, setView] = useState('entity'); 
    
    // Data State
    const { location, sessionId, hunter } = state || {};
    const [entities, setEntities] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedArtifact, setSelectedArtifact] = useState(null);

    // 1. Splash Screen & Initial Data Fetch
    useEffect(() => {
        // Updated timer to 3 seconds for design requirement
        const timer = setTimeout(() => setShowSplash(false), 3000);

        if (!location?.location_id) {
            toast.error("SYSTEM_ERROR: LOCATION DATA MISSING");
            return () => clearTimeout(timer);
        }

        const fetchEntities = async () => {
            try {
                // Endpoint might need adjustment based on final backend routes
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

    // 2. Lock Target Logic
    const handleLockTarget = async (entity) => {
        try {
            await axios.post('http://localhost:3000/api/combat/assign-entity', {
                sessionId: Number(sessionId),
                entityId: Number(entity.entity_id),
                locationId: Number(location.location_id)
            });
            
            setSelectedEntity(entity);
            toast.success(`TARGET_LOCKED: ${entity.true_name}`);
            
            // Switch to Artifact Vault after locking target
            const artRes = await axios.get(`http://localhost:3000/api/gameplay/artifacts/${sessionId}`);
            // Filter to only 'Active' (usable) artifacts for combat
            const usableArtifacts = artRes.data.filter(art => art["Current Status"] === 'Active');
            setArtifacts(usableArtifacts);
            setView('artifact');
        } catch (err) {
            toast.error("DATABASE_LINK_FAILURE: TARGET NOT REGISTERED");
        }
    };

    // 3. Finalize Engagement
    const handleFinalEngagement = async () => {
        if (!selectedArtifact) {
            toast.warn("NO_ARTIFACT_LOADED: SELECT A RELIC TO PROCEED");
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/combat/confirm-loadout', {
                sessionId: Number(sessionId),
                artifactId: Number(selectedArtifact.ID), 
                // Set riddleSolved to 1 by default for now
                riddleSolved: 1
            });

            navigate('/combat-resolution', { 
                state: { sessionId, location, hunter, selectedEntity, selectedArtifact } 
            });
        } catch (err) {
            toast.error("CRITICAL_FAILURE: DATABASE LINK INTERRUPTED");
        }
    };

    // Splash Screen Overlay
    if (showSplash) {
        return (
            <div className="splash-overlay">
                {/* HORIZONTAL SCANNER LINE */}
                <div className="scanner-line-horizontal"></div>
                
                {/* Central Status text */}
                <div className="splash-content">
                    <h2 className="glitch-text" data-text="INITIALIZING_COMBAT_LINK">
                        INITIALIZING_COMBAT_LINK
                    </h2>
                    <p className="splash-subtext">
                        SYNCING SENSORS WITH {location?.location_name || 'UNKNOWN SECTOR'}...
                    </p>
                    <div className="loader-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="terminal-container">
            <ToastContainer theme="dark" position="bottom-right" />

            <header className="terminal-header">
                <div className="header-content">
                    <h1 className="header-title">
                        {view === 'entity' ? 'ENTITY REGISTRY' : 'ARTIFACT VAULT'}
                    </h1>
                    <p className="header-subtitle">
                        {view === 'entity' 
                            ? 'ALL SUPERNATURAL ENTITIES // THREAT CLASSIFICATION' 
                            : `SECTOR: ${location?.location_name || 'UNKNOWN'} // CLASSIFICATION ACCESS`}
                    </p>
                </div>
                <div className="header-status">
                    <div className="status-badge">
                        {view === 'entity' ? 'ENTITIES_TRACKED' : 'VAULT_SYNC_ACTIVE'}
                    </div>
                </div>
            </header>

            <main className="terminal-main">
                {view === 'entity' ? (
                    <div className="registry-grid">
                        {entities.map(ent => (
                            <div key={ent.entity_id} className="entity-card" onClick={() => handleLockTarget(ent)}>
                                <div className="card-accent-label">{ent.entity_species || 'UNKNOWN'}</div>
                                <div className="card-media-placeholder">
                                    <img src={ENTITY_EYE_URL} alt="Entity Scanner Icon" className="eye-icon-svg" />
                                    <span className="entity-id-label">ENTITY_ID_{ent.entity_id}</span>
                                </div>
                                <div className="card-body">
                                    <h2 className="entity-name-display">{ent.true_name}</h2>
                                    <div className="entity-meta">
                                        <p>LOCATION: {location?.location_name}</p>
                                        <p>BLOODLINE: {ent.bloodline_name || 'CLASSIFIED'}</p>
                                    </div>
                                    <div className="terror-index-container">
                                        <div className="terror-label-row">
                                            <span>TERROR INDEX</span>
                                            <span>{ent.terror_index}/10</span>
                                        </div>
                                        <div className="terror-bar">
                                            <div className="terror-fill" style={{ width: `${(ent.terror_index / 10) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="card-footer-row">
                                        <span className="status-active">STATUS: {ent.existence_state}</span>
                                        <span className="threat-active">⚠️ THREAT ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="vault-container">
                        <div className="artifact-grid">
                            {artifacts.map(art => (
                                <div 
                                    key={art.ID} 
                                    className={`artifact-card ${selectedArtifact?.ID === art.ID ? 'selected' : ''}`}
                                    onClick={() => setSelectedArtifact(art)}
                                >
                                    <div className="card-accent-label-teal">{art.Classification || 'UTILITY'}</div>
                                    <div className="card-media-placeholder-teal">
                                        <img src={ARTIFACT_TARGET_URL} alt="Artifact Target Icon" className="target-icon-svg" />
                                        <span className="art-id-label">ART_{art.ID}</span>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="artifact-name-display">{art["Artifact Name"]}</h2>
                                        <p className="artifact-origin">ORIGIN: {art["Origin Point"] || 'VANGUARD LABS'}</p>
                                        
                                        <div className="status-container-teal">
                                            <div className="status-label-row">
                                                <span>STATUS</span>
                                                <span className="status-text-active">{art["Current Status"]}</span>
                                            </div>
                                            <div className="status-bar-teal">
                                                <div className="status-fill-teal"></div>
                                            </div>
                                            <p className="ready-text">{art.lifecycleState}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="engagement-footer">
                            <button className="engage-button" onClick={handleFinalEngagement}>
                                INITIALIZE ENGAGEMENT_
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&family=Share+Tech+Mono&display=swap');

                :root {
                    --cmd-red: #FF4D4D;
                    --cmd-teal: #00D2FF;
                    --cmd-bg: #0A0A0A;
                    --card-bg: #111;
                }

                .terminal-container {
                    background-color: var(--cmd-bg);
                    min-height: 100vh;
                    color: white;
                    font-family: 'Rajdhani', sans-serif;
                    padding: 40px;
                }

                /* Splash Screen Styles */
                .splash-overlay {
                    background: black;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--cmd-red);
                    font-family: 'Share Tech Mono', monospace;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 9999;
                }

                .splash-content {
                    text-align: center;
                    position: relative;
                }

                /* UPDATED HORIZONTAL SCANNER LINE */
                .scanner-line-horizontal {
                    width: 0%;
                    height: 4px;
                    background: var(--cmd-red);
                    position: absolute;
                    top: 50%; /* Positioned centrally */
                    transform: translateY(-50%);
                    box-shadow: 0 0 20px var(--cmd-red), 0 0 5px white;
                    animation: scan-h 3s linear forwards; /* 3s duration, fills width */
                }

                @keyframes scan-h {
                    0% { width: 0%; left: 0; opacity: 0; }
                    5% { opacity: 1; }
                    100% { width: 100%; left: 0; opacity: 1; }
                }

                .splash-subtext {
                    color: #888;
                    font-size: 1rem;
                    margin-top: 10px;
                }

                .loader-dots span {
                    animation: blink 1.4s infinite both;
                    font-size: 2rem;
                }
                .loader-dots span:nth-child(2) { animation-delay: .2s; }
                .loader-dots span:nth-child(3) { animation-delay: .4s; }

                @keyframes blink {
                    0%, 80%, 100% { opacity: 0; }
                    40% { opacity: 1; }
                }

                /* Header & Grids */
                .terminal-header {
                    border: 1px solid #222;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 30px;
                    margin-bottom: 40px;
                    background: rgba(17,17,17,0.5);
                }

                .header-title { color: var(--cmd-red); font-size: 2rem; letter-spacing: 4px; margin: 0; text-transform: uppercase; }
                .header-subtitle { color: #666; margin: 5px 0 0 0; font-size: 0.9rem; text-transform: uppercase; }

                .status-badge {
                    border: 1px solid var(--cmd-red);
                    padding: 5px 15px;
                    color: var(--cmd-red);
                    font-size: 0.8rem;
                    box-shadow: inset 0 0 10px rgba(255, 77, 77, 0.2);
                    font-family: 'Share Tech Mono', monospace;
                }

                .registry-grid, .artifact-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                }

                /* Entity Card */
                .entity-card {
                    background: var(--card-bg);
                    border: 1px solid #222;
                    border-left: 3px solid var(--cmd-red);
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    padding: 10px;
                }
                .entity-card:hover { transform: translateY(-5px); border: 1px solid var(--cmd-red); border-left: 3px solid var(--cmd-red); box-shadow: 0 0 15px rgba(255, 77, 77, 0.2); }

                .card-accent-label {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: var(--cmd-red);
                    color: black;
                    padding: 2px 8px;
                    font-size: 0.7rem;
                    font-weight: bold;
                    z-index: 2;
                    text-transform: uppercase;
                }

                .card-media-placeholder {
                    background: #000;
                    height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    border: 1px solid #222;
                }

                .eye-icon-svg {
                    width: 60px;
                    height: 60px;
                    opacity: 0.8;
                }

                .entity-id-label {
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    color: #444;
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 0.7rem;
                }

                .entity-name-display { color: var(--cmd-red); text-transform: uppercase; margin: 15px 0 5px 0; font-size: 1.4rem; }
                .entity-meta p { margin: 0; color: #888; font-size: 0.9rem; text-transform: uppercase; }
                
                .terror-index-container { margin: 15px 0; }
                .terror-label-row { display: flex; justify-content: space-between; color: #666; font-size: 0.8rem; margin-bottom: 3px; }
                .terror-bar { background: #222; height: 6px; position: relative; }
                .terror-fill { background: var(--cmd-red); height: 100%; box-shadow: 0 0 10px var(--cmd-red); }

                .card-footer-row { display: flex; justify-content: space-between; font-size: 0.8rem; border-top: 1px solid #222; padding-top: 10px; margin-top: 10px;}
                .status-active { color: #888; text-transform: uppercase;}
                .threat-active { color: var(--cmd-red); font-weight: bold; animation: pulse 2s infinite; }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                /* Artifact Card */
                .artifact-card {
                    background: var(--card-bg);
                    border: 1px solid #222;
                    border-left: 3px solid var(--cmd-teal);
                    cursor: pointer;
                    padding: 10px;
                    position: relative;
                    transition: all 0.2s;
                }
                .artifact-card:not(.selected):hover { border: 1px solid rgba(0, 210, 255, 0.5); border-left: 3px solid var(--cmd-teal); }
                .artifact-card.selected { opacity: 1; border: 1px solid var(--cmd-teal); border-left: 3px solid var(--cmd-teal); box-shadow: 0 0 15px rgba(0, 210, 255, 0.3); }

                .card-accent-label-teal {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: var(--cmd-teal);
                    color: black;
                    padding: 2px 8px;
                    font-size: 0.7rem;
                    font-weight: bold;
                    z-index: 2;
                    text-transform: uppercase;
                }

                .card-media-placeholder-teal {
                    background: #000;
                    height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    border: 1px solid #222;
                }

                .target-icon-svg {
                    width: 60px;
                    height: 60px;
                    opacity: 0.8;
                }

                .art-id-label {
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    color: #444;
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 0.7rem;
                }

                .artifact-name-display { color: var(--cmd-teal); text-transform: uppercase; margin: 15px 0 5px 0; font-size: 1.4rem; }
                .artifact-origin { color: #888; margin: 0; font-size: 0.9rem; text-transform: uppercase; }

                .status-container-teal { margin-top: 15px; border-top: 1px solid #222; padding-top: 10px; }
                .status-label-row { display: flex; justify-content: space-between; color: #666; font-size: 0.8rem; margin-bottom: 3px; }
                .status-text-active { color: var(--cmd-teal); font-weight: bold; text-transform: uppercase; }
                .status-bar-teal { background: #222; height: 6px; }
                .status-fill-teal { background: var(--cmd-teal); height: 100%; box-shadow: 0 0 10px var(--cmd-teal); width: 100%; }
                .ready-text { color: #555; font-size: 0.8rem; margin: 5px 0 0 0; text-align: center; text-transform: uppercase;}

                /* Engagement Footer */
                .engagement-footer { margin-top: 50px; display: flex; justify-content: center; }
                .engage-button {
                    background: transparent; border: 1px solid var(--cmd-red);
                    color: var(--cmd-red); padding: 15px 40px; font-size: 1.2rem;
                    cursor: pointer; transition: all 0.3s; font-family: 'Rajdhani';
                    text-transform: uppercase; letter-spacing: 2px;
                }
                .engage-button:hover { background: var(--cmd-red); color: black; box-shadow: 0 0 20px rgba(255, 77, 77, 0.5); }
            `}</style>
        </div>
    );
};

export default AttackingMission;