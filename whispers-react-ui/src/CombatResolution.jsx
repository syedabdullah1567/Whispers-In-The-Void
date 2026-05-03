import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const CombatResolution = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { sessionId, location, selectedEntity, selectedArtifact } = state || {};

    const [combatResult, setCombatResult] = useState(null);
    const [isEngaging, setIsEngaging] = useState(false);

    // Auto-Return if no session
    useEffect(() => {
        if (!sessionId) {
            toast.error("SESSION LOST: REDIRECTING...");
            setTimeout(() => navigate('/'), 3000);
        }
    }, [sessionId, navigate]);

    const executeStrike = async () => {
        setIsEngaging(true);
        try {
            const res = await axios.post('http://localhost:3000/api/combat/launch', {
                sessionId: Number(sessionId)
            });
            
            console.log("COMBAT_RAW_RESULT:", res.data);

            setTimeout(() => {
                setCombatResult(res.data);
                setIsEngaging(false);
            }, 2500);

        } catch (err) {
            toast.error("CRITICAL ERROR: STRIKE FAILED TO INITIALIZE");
            setIsEngaging(false);
        }
    };

    // Robust check for victory (handles spaces/casing)
    const isVictory = combatResult?.Result?.toString().toUpperCase().includes('SUCCESS');

    return (
        <div className="resolution-terminal">
            <ToastContainer theme="dark" />
            
            <div className="header-ui">
                <div className="status-tag">OP_ID: {sessionId}</div>
                <div className="status-tag">TARGET: {selectedEntity?.entity_name}</div>
                <div className="status-tag">ARTIFACT: {selectedArtifact?.["Artifact Name"]}</div>
            </div>

            {!combatResult && !isEngaging && (
                <div className="pre-engagement-box">
                    <h2 className="warning-text">READY TO ENGAGE</h2>
                    <button className="strike-btn" onClick={executeStrike}>
                        EXECUTE STRIKE
                    </button>
                </div>
            )}

            {isEngaging && (
                <div className="engaging-container">
                    <div className="radar-spinner"></div>
                    <h2 className="glitch">ENGAGING TARGET...</h2>
                </div>
            )}

            {combatResult && (
                <div className={`outcome-container ${isVictory ? 'victory' : 'defeat'}`}>
                    <h1 className="outcome-title">{combatResult.Result}</h1>
                    <div className="stats-box">
                        <div className="stat-row">
                            <span>PROBABILITY OF SURVIVAL:</span>
                            <span className="value">{(combatResult.Win_Probability * 100).toFixed(2)}%</span>
                        </div>
                        <div className="stat-row">
                            <span>REPORT:</span>
                            <span className="value">{combatResult.Message}</span>
                        </div>
                    </div>
                    <button className="return-btn" onClick={() => navigate('/dashboard')}>RETURN TO BASE</button>
                </div>
            )}
        </div>
    );
};

export default CombatResolution;