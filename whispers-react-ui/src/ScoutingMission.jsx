import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const ScoutingMission = () => {
    const [locations, setLocations] = useState([]);
    const [status, setStatus] = useState('IDLE'); // IDLE, SCANNING, SUCCESS, ERROR
    const [loading, setLoading] = useState(true);

    // Fetch locations to know which sectors can be scouted
    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/locations");
                setLocations(res.data.locationData);
            } catch (err) {
                console.error("DATA_LINK_SEVERED", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSectors();
    }, []);

    const initiateScouting = async (locationID) => {
        setStatus('SCANNING');
        
        try {
            // Calling the Node.js endpoint we just created
            const response = await axios.post('http://localhost:3000/api/missions/scout', { 
                locationId: locationID 
            });

            if (response.data.success) {
                setStatus('SUCCESS');
                // Reset to idle after 3 seconds to allow more scouting
                setTimeout(() => setStatus('IDLE'), 3000);
            }
        } catch (error) {
            console.error("SCOUTING_CRITICAL_FAILURE", error);
            setStatus('ERROR');
            setTimeout(() => setStatus('IDLE'), 5000);
        }
    };

    if (loading) return <div className="glitch-text" style={{textAlign: 'center', marginTop: '20%'}}>LOCALIZING SECTORS...</div>;

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title">Scouting Protocol</div>
                    <div className="topbar-sub">Artifact Activation // Signal Injection</div>
                </div>
                <span className={`status-pill ${status === 'SCANNING' ? 'pulse' : ''}`}>
                    {status}
                </span>
            </div>

            {status === 'SCANNING' && (
                <div className="scanning-overlay">
                    <div className="glitch-text">TRANSMITTING SIGNAL TO SATELLITE...</div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill"></div>
                    </div>
                </div>
            )}

            <div className="grid-container" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '20px' 
            }}>
                {locations.map(loc => (
                    <div key={loc.location_id} className="stat-card">
                        <div className="stat-lbl">SECTOR_{loc.location_id}</div>
                        <div className="stat-val" style={{fontSize: '20px'}}>{loc.location_name}</div>
                        <div className="stat-lbl" style={{color: '#444', marginBottom: '15px'}}>{loc.location_type}</div>
                        
                        <button 
                            className="terminal-btn"
                            disabled={status === 'SCANNING'}
                            onClick={() => initiateScouting(loc.location_id)}
                            style={{ width: '100%', marginTop: 'auto' }}
                        >
                            INITIATE SCOUT
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                .scanning-overlay {
                    background: rgba(0,0,0,0.9);
                    border: 1px solid #ff4d4d;
                    padding: 20px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .progress-bar-container {
                    height: 2px;
                    background: #111;
                    margin-top: 15px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #ff4d4d;
                    width: 30%;
                    animation: loading-bar 2s infinite linear;
                }
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
                .terminal-btn {
                    background: transparent;
                    border: 1px solid #ff4d4d;
                    color: #ff4d4d;
                    padding: 10px;
                    font-family: 'JetBrains Mono', monospace;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .terminal-btn:hover:not(:disabled) {
                    background: #ff4d4d;
                    color: #000;
                    box-shadow: 0 0 15px #ff4d4d;
                }
                .terminal-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default ScoutingMission;