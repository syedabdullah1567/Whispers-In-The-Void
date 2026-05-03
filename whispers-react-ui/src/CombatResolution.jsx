import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CombatResolution = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { sessionId, location, selectedEntity, selectedArtifact } = state || {};

    const [combatResult, setCombatResult] = useState(null);
    const [isEngaging, setIsEngaging] = useState(false);

    // Auto-Return if no session
    useEffect(() => {
        if (!sessionId) {
            toast.error("SESSION_LOST: REDIRECTING TO NEURAL_LINK...");
            setTimeout(() => navigate('/'), 3000);
        }
    }, [sessionId, navigate]);

    const executeStrike = async () => {
        setIsEngaging(true);
        try {
            const res = await axios.post('http://localhost:3000/api/combat/launch', {
                sessionId: Number(sessionId)
            });
            
            // Artificial delay to build tension (matching your previous UI style)
            setTimeout(() => {
                setCombatResult(res.data);
                setIsEngaging(false);
            }, 3000);

        } catch (err) {
            toast.error("CRITICAL_FAILURE: STRIKE_SEQUENCE_ABORTED");
            setIsEngaging(false);
        }
    };

    const isVictory = combatResult?.Result?.toString().toUpperCase().includes('SUCCESS');

    return (
        <div className="resolution-terminal">
            <ToastContainer theme="dark" position="bottom-right" />
            <div className="scanline-overlay"></div>

            {/* HEADER DATA BARS */}
            <header className="combat-header">
                <div className="telemetry-box">
                    <span className="label">OP_ID</span>
                    <span className="value">{sessionId}</span>
                </div>
                <div className="telemetry-box">
                    <span className="label">TARGET</span>
                    <span className="value">{selectedEntity?.true_name || "UNKNOWN_ENTITY"}</span>
                </div>
                <div className="telemetry-box">
                    <span className="label">PAYLOAD</span>
                    <span className="value">{selectedArtifact?.["Artifact Name"] || "NONE"}</span>
                </div>
            </header>

            <main className="combat-viewport">
                {!combatResult && !isEngaging && (
                    <div className="engagement-ready">
                        <div className="hazard-lines"></div>
                        <h2 className="breach-title">NEURAL LINK ESTABLISHED</h2>
                        <p className="sub-status">TARGET IN SIGHT. READY TO DISCHARGE ARTIFACT.</p>
                        <button className="strike-trigger" onClick={executeStrike}>
                            <span className="glitch-text">EXECUTE STRIKE</span>
                        </button>
                    </div>
                )}

                {isEngaging && (
                    <div className="engaging-screen">
                        <div className="radar-circle">
                            <div className="radar-sweep"></div>
                        </div>
                        <h2 className="glitch-active">CALCULATING TRAJECTORY...</h2>
                        <div className="loading-bar-container">
                            <div className="loading-bar-fill"></div>
                        </div>
                    </div>
                )}

                {combatResult && (
                    <div className={`outcome-module ${isVictory ? 'success-ui' : 'failure-ui'}`}>
                        <div className="outcome-header">
                            <h1 className="outcome-text">{combatResult.Result}</h1>
                        </div>
                        
                        <div className="report-body">
                            <div className="stat-grid">
                                <div className="stat-item">
                                    <span className="stat-label">SURVIVAL_PROBABILITY</span>
                                    <span className="stat-value">{(combatResult.Win_Probability * 100).toFixed(2)}%</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">LOCATION_STABILITY</span>
                                    <span className="stat-value">CRITICAL</span>
                                </div>
                            </div>
                            
                            <div className="report-text-box">
                                <p className="report-label">DEBRIEF_LOG:</p>
                                <p className="report-msg">{combatResult.Message}</p>
                            </div>
                        </div>

                        <button className="base-return-btn" onClick={() => navigate('/dashboard')}>
                            RETURN TO COMMAND BASE
                        </button>
                    </div>
                )}
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');

                :root {
                    --terminal-red: #ff4d4d;
                    --terminal-teal: #00d2ff;
                    --terminal-bg: #050505;
                }

                .resolution-terminal {
                    min-height: 100vh;
                    background: var(--terminal-bg);
                    color: white;
                    font-family: 'Share Tech Mono', monospace;
                    padding: 40px;
                    position: relative;
                    overflow: hidden;
                }

                /* CRT & Scanline Effects */
                .scanline-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%),
                                linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
                    background-size: 100% 4px, 3px 100%;
                    pointer-events: none; z-index: 100;
                }

                /* Header Telemetry */
                .combat-header {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 50px;
                }

                .telemetry-box {
                    border: 1px solid #222;
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.02);
                }

                .telemetry-box .label {
                    display: block; font-size: 0.7rem; color: #666; letter-spacing: 2px;
                }

                .telemetry-box .value {
                    color: var(--terminal-teal); font-size: 1.1rem; text-transform: uppercase;
                }

                /* Pre-Engagement UI */
                .engagement-ready {
                    text-align: center; margin-top: 10vh;
                    padding: 60px; border: 1px dashed #333;
                }

                .breach-title {
                    font-size: 2.5rem; color: #fff; margin: 0;
                    text-shadow: 0 0 10px rgba(255,255,255,0.3);
                }

                .sub-status { color: #888; margin-bottom: 40px; letter-spacing: 1px; }

                .strike-trigger {
                    background: transparent;
                    border: 2px solid var(--terminal-red);
                    color: var(--terminal-red);
                    padding: 20px 60px;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: 0.3s;
                    font-family: 'Rajdhani', sans-serif;
                    font-weight: bold;
                    position: relative;
                }

                .strike-trigger:hover {
                    background: var(--terminal-red);
                    color: #000;
                    box-shadow: 0 0 30px rgba(255, 77, 77, 0.4);
                }

                /* Engaging Radar UI */
                .engaging-screen { text-align: center; margin-top: 5vh; }

                .radar-circle {
                    width: 200px; height: 200px; border: 2px solid #222;
                    border-radius: 50%; margin: 0 auto 30px; position: relative;
                    background: radial-gradient(circle, #111 0%, #000 100%);
                }

                .radar-sweep {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: conic-gradient(from 0deg, transparent 80%, var(--terminal-teal) 100%);
                    border-radius: 50%; animation: sweep 2s linear infinite;
                }

                @keyframes sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                /* Outcome Module */
                .outcome-module {
                    max-width: 800px; margin: 0 auto;
                    border: 1px solid #333; animation: slideUp 0.5s ease-out;
                }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .success-ui { border-left: 8px solid var(--terminal-teal); }
                .failure-ui { border-left: 8px solid var(--terminal-red); }

                .outcome-header {
                    padding: 30px; background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid #222;
                }

                .outcome-text {
                    font-size: 3.5rem; margin: 0; font-family: 'Rajdhani', sans-serif;
                    letter-spacing: 10px;
                }

                .success-ui .outcome-text { color: var(--terminal-teal); text-shadow: 0 0 20px var(--terminal-teal); }
                .failure-ui .outcome-text { color: var(--terminal-red); text-shadow: 0 0 20px var(--terminal-red); }

                .report-body { padding: 30px; }

                .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                .stat-label { display: block; color: #555; font-size: 0.8rem; margin-bottom: 5px; }
                .stat-value { font-size: 1.5rem; color: #eee; }

                .report-text-box { background: #0a0a0a; padding: 20px; border: 1px solid #1a1a1a; }
                .report-label { color: #444; font-size: 0.7rem; margin-bottom: 10px; }
                .report-msg { line-height: 1.6; color: #ccc; font-size: 0.95rem; }

                .base-return-btn {
                    width: 100%; padding: 20px; background: transparent;
                    border: none; border-top: 1px solid #222; color: #666;
                    cursor: pointer; transition: 0.3s;
                }

                .base-return-btn:hover { background: #111; color: white; }

            `}</style>
        </div>
    );
};

export default CombatResolution;