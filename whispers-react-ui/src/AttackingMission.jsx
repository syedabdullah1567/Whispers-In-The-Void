import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AttackingMission = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [showSplash, setShowSplash] = useState(true);

    // DEBUG: Check if state actually arrived
    console.log("MISSION_STATE_RECEIVED:", state);

    const { location, sessionId } = state || {};

    const [entities, setEntities] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [view, setView] = useState('entity'); 
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedArtifact, setSelectedArtifact] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2500);

        if (!location?.location_id) {
            console.error("CRITICAL: No location_id found in state.");
            return () => clearTimeout(timer);
        }

        const fetchEntities = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/locations/${location.location_id}/entities`
                );
                console.log("ENTITIES_FETCHED:", res.data);
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
            // STEP 1: Update the backend log with the specific Entity ID
            // Hits procedure: sp_addingentity_for_attack
            await axios.post('http://localhost:3000/api/combat/assign-entity', {
                sessionId: Number(sessionId),
                entityId: Number(entity.entity_id),
                locationId: Number(location.location_id)
            });
            
            setSelectedEntity(entity);
            toast.success(`TARGET_LOCKED: ${entity.entity_name}`);
            
            // STEP 2: Fetch artifacts NOW that the entity is locked in the DB
            // Hits procedure: Get_Artifacts_At_Location_GamsPlay
            const artRes = await axios.get(`http://localhost:3000/api/gameplay/artifacts/${sessionId}`);
            
            setArtifacts(artRes.data);
            setView('artifact');
        } catch (err) {
            toast.error("DATABASE_LINK_FAILURE: TARGET NOT REGISTERED");
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
                artifactId: Number(selectedArtifact.ID), 
                riddleSolved: 1
            });

            toast.success("SYSTEM_SYNC: LOADOUT REGISTERED");
            
            // Crucial: Passing EVERYTHING to the next screen
            navigate('/combat-resolution', { 
                state: { 
                    sessionId, 
                    location, 
                    selectedEntity, 
                    selectedArtifact 
                } 
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
                        <div className="location-ping">DEPLOYING TO: {location?.location_name || 'UNKNOWN COORDINATES'}</div>
                        <div className="scan-bar"></div>
                        <div className="bottom-line">SCANNING FOR ENTITY SIGNATURES...</div>
                    </div>
                </div>
            )}
            
            <ToastContainer theme="dark" position="bottom-right" />
            
            <div className="header-ui">
                <div className="status-tag">SESSION: {sessionId}</div>
                <div className="status-tag">LOC: {location?.location_name}</div>
                {selectedEntity && (
                    <div className="status-tag" style={{borderColor: '#ff4d4d', color: '#ff4d4d'}}>
                        LOCKED: {selectedEntity.entity_name}
                    </div>
                )}
            </div>

            {view === 'entity' ? (
                <div className="section">
                    <h2 className="glitch">TARGET ACQUISITION</h2>
                    {entities.length === 0 ? (
                        <div className="no-data">NO ENTITIES DETECTED IN THIS SECTOR</div>
                    ) : (
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
                    )}
                </div>
            ) : (
                <div className="section">
                    <h2 className="glitch" style={{ color: '#00d2ff' }}>ARTIFACT LOADOUT</h2>
                    <div className="grid">
                        {artifacts.map((art) => (
                            <div
                                key={art.ID}
                                className={`card artifact-card ${selectedArtifact?.ID === art.ID ? 'selected' : ''}`}
                                onClick={() => setSelectedArtifact(art)}
                            >
                                <div className="category-badge">{art.Classification || 'RELIC'}</div>
                                <div className="artifact-info">
                                    <div className="name">{art["Artifact Name"]}</div>
                                    <div className="origin">ORIGIN: {art["Origin Point"]}</div>
                                </div>
                                <div className="artifact-footer">
                                    <div className="status-row">
                                        <span>POWER_LEVEL</span>
                                        <span className="val">{art["Current Status"]}</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className={`fill ${selectedArtifact?.ID === art.ID ? 'active' : ''}`}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="engage-btn" onClick={handleFinalEngagement}>
                        INITIALIZE ENGAGEMENT
                    </button>
                </div>
            )}
            
            <style>{`
                /* Add this to your existing style block for better visibility */
                .no-data { padding: 40px; border: 1px dashed #333; text-align: center; color: #555; }
                .artifact-card.selected { border-color: #ff4d4d !important; background: #1a0505 !important; }
            `}</style>
        </div>
    );
};

export default AttackingMission;