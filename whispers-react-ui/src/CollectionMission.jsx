import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { useLocation } from 'react-router-dom';

const CollectionMission = () => {
    const { state } = useLocation(); // Hook into the navigation state
    const [locations, setLocations] = useState([]);
    const [status, setStatus] = useState('IDLE');
    const [loading, setLoading] = useState(true);

    // Grab the hunter from the state passed during navigation
    const activeHunter = state?.hunter;
    // Fetch locations to know which sectors can be scouted
    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/locations");
                // Ensure we access the correct data key from your backend
                setLocations(res.data.locationData || res.data); 
            } catch (err) {
                console.error("DATA_LINK_SEVERED", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSectors();
    }, []);

    const initiateCollection = async (locationID) => {
    setStatus('SCANNING');
    
        try {
            const response = await axios.post('http://localhost:3000/api/missions/collection', { 
                locationId: locationID,
                hunterId: activeHunter.hunter_id 
            });

            if (response.data.success) {
                setStatus('SUCCESS');
                
                // FIX: Re-fetch locations/artifacts immediately after success
                const refresh = await axios.get("http://localhost:3000/api/locations");
                setLocations(refresh.data.locationData || refresh.data);

                setTimeout(() => setStatus('IDLE'), 3000);
            }
        } catch (error) {
            setStatus('ERROR');
        }   
    };

    if (loading) return <div className="glitch-text" style={{textAlign: 'center', marginTop: '20%'}}>LOCALIZING SECTORS...</div>;

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title">Collection Protocol</div>
                    <div className="topbar-sub">Artifact Retrieval // Signal Injection</div>
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
                            onClick={() => initiateCollection(loc.location_id)}
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


export default CollectionMission;