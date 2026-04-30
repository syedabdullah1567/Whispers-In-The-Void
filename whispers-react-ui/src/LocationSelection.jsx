import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LocationSelection() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hunter = state?.hunter;

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // Fetching from your local API
                const response = await axios.get("http://localhost:3000/api/locations");
                // Assuming the API returns { locations: [...] } or an array directly
                // If it's wrapped like the hunters one, use response.data.locationData or similar
                const data = response.data.locationData || response.data;
                setLocations(data);
            } catch (error) {
                console.error("UPLINK ERROR: Could not retrieve sector data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const handleSelectLocation = (loc) => {
        navigate('/op-authorize', { 
            state: { 
                hunter: hunter, 
                location: {
                    location_id: loc.location_id,
                    location_name: loc.location_name,
                    risk_level: loc.risk_level
                } 
            } 
        });
    };

    if (loading) {
        return (
            <div className="selection-screen">
                <div className="glitch-text" style={{marginTop: '20vh'}}>SCANNING SECTORS...</div>
            </div>
        );
    }

    return (
        <div className="selection-screen">
            <div className="selection-header">
                <h1 className="glitch-text">CHOOSE STRIKE ZONE</h1>
                <p>DEPLOYING: <span style={{color: '#fff'}}>{hunter?.hunter_name || 'UNKNOWN'}</span></p>
            </div>

            <div className="card-container">
                {locations.length > 0 ? (
                    locations.map(loc => (
                        <div key={loc.location_id} className="location-card" onClick={() => handleSelectLocation(loc)}>
                            <div className="loc-risk">{loc.risk_level} RISK</div>
                            <div className="loc-visual">
                                <div className="noise-overlay"></div>
                            </div>
                            <div className="loc-info">
                                <h3>{loc.location_name}</h3>
                                <p>{loc.description || 'No detailed intel available for this sector.'}</p>
                                <button className="deploy-btn">INITIATE DROP</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-danger">NO ACTIVE STRIKE ZONES DETECTED</div>
                )}
            </div>

            <style>{`
                .selection-screen {
                    min-height: 100vh;
                    background: radial-gradient(circle, #1a0505 0%, #000 100%);
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: 'JetBrains Mono', monospace;
                }
                .selection-header { text-align: center; margin-bottom: 50px; color: #ff4d4d; }
                .glitch-text { font-size: 32px; font-weight: bold; letter-spacing: 4px; text-shadow: 2px 2px #550000; }
                
                .card-container { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 1200px; }
                
                .location-card {
                    width: 300px;
                    background: #050505;
                    border: 1px solid #222;
                    transition: 0.3s;
                    cursor: pointer;
                    position: relative;
                }
                .location-card:hover { border-color: #ff4d4d; transform: translateY(-5px); box-shadow: 0 0 25px rgba(255, 0, 0, 0.2); }
                
                .loc-risk { font-size: 10px; padding: 6px; background: #1a0505; color: #ff4d4d; text-align: center; font-weight: bold; border-bottom: 1px solid #222; letter-spacing: 1px; }
                .loc-visual { height: 120px; background: #111; position: relative; overflow: hidden; }
                .noise-overlay { position: absolute; inset: 0; background: url('https://media.giphy.com/media/oEI9uWUznW3QI/giphy.gif'); opacity: 0.05; pointer-events: none; }
                
                .loc-info { padding: 20px; border-top: 1px solid #222; }
                .loc-info h3 { color: #fff; font-size: 16px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
                .loc-info p { color: #666; font-size: 11px; line-height: 1.4; height: 40px; overflow: hidden; }
                
                .deploy-btn { 
                    width: 100%; background: transparent; border: 1px solid #444; color: #888; 
                    padding: 10px; margin-top: 15px; font-size: 10px; font-weight: bold; cursor: pointer; transition: 0.3s;
                }
                .location-card:hover .deploy-btn { border-color: #ff4d4d; color: #ff4d4d; background: rgba(255, 0, 0, 0.05); }
            `}</style>
        </div>
    );
}