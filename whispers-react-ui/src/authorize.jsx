import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Authorize = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    const hunter = state?.hunter;
    const location = state?.location;

    const [operationType, setOperationType] = useState("");
    const [authResult, setAuthResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAuthorizationRequest = async () => {
        if (!hunter || !location) {
            toast.error("DATA CORRUPTION: MISSING PARAMETERS");
            return;
        }
        if (!operationType) {
            toast.warn("PROTOCOL ERROR: SELECT OPERATION TYPE");
            return;
        }

        setLoading(true);
        try {
            // 1. Primary Authorization Call
            const authResponse = await axios.post("http://localhost:3000/api/authorize", {
                hunterId: hunter.hunter_id,
                locationId: location.location_id,
                operationType: operationType
            });

            // Capture data locally to avoid issues with async state updates
            let finalData = authResponse.data;

            // 2. Automated Scouting Link (Triggers only if authorized and type is Scouting)
            if (finalData.authorized && operationType === "Scouting") {
                toast.info("UPLINK GRANTED: INITIALIZING SIGNAL INJECTION...");
            
                try {
                    await axios.post('http://localhost:3000/api/missions/scout', { 
                        locationId: Number(location.location_id),
                        hunterId: Number(hunter.hunter_id)
                    });
                    
                    // Modify the message locally to reflect success
                    finalData.message += " // SCOUTING_SATELLITE_UPLINK_LIVE";
                } catch (scoutErr) {
                    console.error("Scouting Mission Trigger Failed:", scoutErr);
                    finalData.message += " // SCOUT_AUTO_TRIGGER_ERROR";
                }
            }
            else if (finalData.authorized && operationType === "Recovery") {
                toast.info("UPLINK GRANTED: INITIALIZING SIGNAL INJECTION...");
            
                try {
                    await axios.post('http://localhost:3000/api/missions/collection', { 
                        locationId: Number(location.location_id),
                        hunterId: Number(hunter.hunter_id)
                    });
                    
                    // Modify the message locally to reflect success
                    finalData.message += " // RETRIEVAL_SATELLITE_UPLINK_LIVE";
                } catch (scoutErr) {
                    console.error("Retrieval Mission Trigger Failed:", scoutErr);
                    finalData.message += " // RETRIEVE_AUTO_TRIGGER_ERROR";
                }
            }
            else if (finalData.authorized && operationType === "Combat") {
                toast.info("UPLINK GRANTED: INITIALIZING SIGNAL INJECTION...");
            
                try {
                    await axios.post('http://localhost:3000/api/missions/collection', { 
                        locationId: Number(location.location_id),
                        hunterId: Number(hunter.hunter_id)
                    });
                    
                    // Modify the message locally to reflect success
                    finalData.message += " // RETRIEVAL_SATELLITE_UPLINK_LIVE";
                } catch (scoutErr) {
                    console.error("Retrieval Mission Trigger Failed:", scoutErr);
                    finalData.message += " // RETRIEVE_AUTO_TRIGGER_ERROR";
                }
            }

            setAuthResult(finalData);

        } catch (error) {
            console.error("Authorization Error:", error);
            toast.error("UPLINK LOST: AUTHORIZATION SERVER OFFLINE");
        } finally {
            setLoading(false);
        }
    };

    if (!hunter || !location) {
        return (
            <div className="auth-error-screen">
                <h1 className="glitch-text">ACCESS DENIED</h1>
                <p>NO DEPLOYMENT DATA DETECTED IN BUFFER</p>
                <button onClick={() => navigate("/")} className="terminal-btn">REBOOT SYSTEM</button>
            </div>
        );
    }

    return (
        <div className="auth-terminal-wrapper">
            <ToastContainer theme="dark" position="bottom-right" />
            
            <div className="terminal-header">
                <div className="header-top">DEPLOYMENT AUTHORIZATION TERMINAL</div>
                <div className="header-sub">ENCRYPTED UPLINK // SESSION_{Math.floor(Math.random() * 9000) + 1000}</div>
            </div>

            <div className="terminal-body">
                <div className="params-grid">
                    <div className="param-box">
                        <label>ASSET_ID</label>
                        <div className="val highlight">{hunter.hunter_name}</div>
                        <label>SPEC_CLASS</label>
                        <div className="val">{hunter.type}</div>
                    </div>
                    <div className="param-box separator">
                        <label>TARGET_ZONE</label>
                        <div className="val highlight">{location.location_name}</div>
                        <label>RISK_LEVEL</label>
                        <div className="val danger">{location.risk_level}</div>
                    </div>
                </div>

                <div className="protocol-selector">
                    <label>EXECUTION PROTOCOL</label>
                    <select 
                        className="terminal-select"
                        value={operationType}
                        onChange={(e) => setOperationType(e.target.value)}
                        disabled={authResult !== null}
                    >
                        <option value="">-- SELECT PROTOCOL --</option>
                        <option value="Scouting">SCOUTING (RECON)</option>
                        <option value="Recovery">RECOVERY (RETRIEVAL)</option>
                        <option value="Combat">COMBAT (NEUTRALIZATION)</option>
                    </select>
                </div>

                <div className="auth-action-area">
                    {!authResult ? (
                        <button 
                            className={`auth-btn ${loading ? 'loading' : ''}`} 
                            onClick={handleAuthorizationRequest}
                            disabled={loading}
                        >
                            {loading ? "COMMUNICATING..." : "REQUEST FINAL AUTHORIZATION"}
                        </button>
                    ) : (
                        <div className={`result-screen ${authResult.authorized ? 'granted' : 'denied'}`}>
                            <h2>{authResult.authorized ? ">>> ACCESS GRANTED" : ">>> ACCESS DENIED"}</h2>
                            
                            <p style={{ letterSpacing: '1px', fontSize: '14px' }}>{authResult.message}</p>

                            {authResult.authorized && operationType === "Scouting" && (
                                <div className="pulse" style={{ fontSize: '11px', color: '#00ff41', marginTop: '15px' }}>
                                    [!] ARTIFACT_SIGNAL_ACTIVE: SECTOR_{location.location_id}
                                </div>
                            )}

                            <button 
                                className="terminal-btn mt-20" 
                                onClick={() => {
                                    if (authResult.authorized) {
                                        navigate("/"); 
                                    } else {
                                        navigate("/hunter-select");
                                    }
                                }}
                            >
                                {authResult.authorized ? "PROCEED TO COMMAND" : "RE-EVALUATE ASSET"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .auth-terminal-wrapper {
                    min-height: 100vh;
                    background: #000;
                    color: #00ff41;
                    font-family: 'JetBrains Mono', monospace;
                    padding: 60px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .terminal-header { width: 100%; max-width: 700px; border-bottom: 2px solid #00ff41; padding-bottom: 10px; margin-bottom: 30px; }
                .header-top { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                .header-sub { font-size: 10px; color: #008f11; margin-top: 5px; }

                .terminal-body { width: 100%; max-width: 700px; background: rgba(0, 50, 0, 0.1); border: 1px solid #004400; padding: 30px; }
                
                .params-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                .param-box label { display: block; font-size: 10px; color: #008f11; margin-bottom: 5px; }
                .param-box .val { font-size: 18px; color: #eee; }
                .param-box .val.highlight { color: #00ff41; font-weight: bold; }
                .param-box .val.danger { color: #ff4d4d; font-weight: bold; }
                .separator { border-left: 1px solid #004400; padding-left: 40px; }

                .protocol-selector { margin-bottom: 40px; }
                .protocol-selector label { display: block; font-size: 10px; color: #008f11; margin-bottom: 10px; }
                .terminal-select { 
                    width: 100%; background: #000; border: 1px solid #00ff41; color: #00ff41; 
                    padding: 12px; font-family: inherit; outline: none; cursor: pointer;
                }

                .auth-btn {
                    width: 100%; padding: 20px; background: transparent; border: 1px solid #00ff41;
                    color: #00ff41; font-weight: bold; font-family: inherit; cursor: pointer;
                    transition: 0.3s; letter-spacing: 2px;
                }
                .auth-btn:hover:not(:disabled) { background: #00ff41; color: #000; box-shadow: 0 0 20px #00ff41; }
                .auth-btn:disabled { border-color: #004400; color: #004400; cursor: not-allowed; }

                .result-screen { padding: 30px; text-align: center; border: 2px solid; }
                .result-screen.granted { border-color: #00ff41; background: rgba(0, 255, 65, 0.05); }
                .result-screen.denied { border-color: #ff4d4d; background: rgba(255, 77, 77, 0.05); color: #ff4d4d; }
                .result-screen h2 { margin-bottom: 15px; }

                .terminal-btn { 
                    background: transparent; border: 1px solid currentColor; color: inherit; 
                    padding: 10px 25px; cursor: pointer; font-family: inherit; font-size: 11px;
                }
                .mt-20 { margin-top: 20px; }

                .pulse {
                    animation: pulse-green 2s infinite;
                    font-weight: bold;
                    text-shadow: 0 0 5px #00ff41;
                }

                @keyframes pulse-green {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }

                .loading { cursor: wait; opacity: 0.7; border-style: dashed !important; }
            `}</style>
        </div>
    );
};

export default Authorize;