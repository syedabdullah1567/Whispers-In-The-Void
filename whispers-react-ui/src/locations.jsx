import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/locations");
                setLocations(res.data.locationData);
            } catch (err) {
                console.error("MAP_DATA_OFFLINE", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    if (loading) return (
        <div className="main-content">
            <div className="glitch-text" style={{ textAlign: 'center', marginTop: '20%' }}>
                ESTABLISHING SATELLITE UPLINK...
            </div>
        </div>
    );

    return (
        <div className="main-content">
            <div className="topbar">
                <div>
                    <div className="topbar-title">Tactical Sector Map</div>
                    <div className="topbar-sub">Global Surveillance // Active Haunt Monitoring</div>
                </div>
                <span className="status-pill">Live Feed Active</span>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '15px' 
            }}>
                {locations.map(l => (
                    <div key={l.location_id} className="stat-card" style={{ position: 'relative' }}>
                        {/* Header: Sector ID and Risk */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '9px', color: '#444', letterSpacing: '1px' }}>
                                SECTOR_{l.location_id.toString().padStart(3, '0')}
                            </span>
                            <div style={{ 
                                fontSize: '10px', 
                                color: l.risk_level > 7 ? '#ff4d4d' : '#ba7517', 
                                fontWeight: 'bold' 
                            }}>
                                RISK: {l.risk_level}/10
                            </div>
                        </div>

                        {/* Location Title */}
                        <div className="stat-val" style={{ fontSize: '18px', marginBottom: '4px' }}>
                            {l.location_name}
                        </div>
                        <div className="stat-lbl" style={{ color: '#555', textTransform: 'uppercase', fontSize: '10px' }}>
                            Type: {l.location_type}
                        </div>

                        {/* Risk Meter Visual */}
                        <div style={{ height: '2px', background: '#111', marginTop: '15px', position: 'relative' }}>
                            <div style={{ 
                                height: '100%', 
                                width: `${l.risk_level * 10}%`, 
                                background: l.risk_level > 7 ? '#ff4d4d' : '#ba7517',
                                boxShadow: `0 0 10px ${l.risk_level > 7 ? '#ff4d4d' : '#ba7517'}66`
                            }} />
                        </div>

                        {/* Footer Info */}
                        <div style={{ 
                            marginTop: '15px', 
                            paddingTop: '10px', 
                            borderTop: '1px solid #111', 
                            display: 'flex', 
                            justifyContent: 'space-between' 
                        }}>
                            <span style={{ fontSize: '8px', color: '#222' }}>ENCRYPTED_SIG_V2</span>
                            <span style={{ 
                                fontSize: '8px', 
                                color: l.risk_level > 5 ? '#ff4d4d' : '#639922',
                                textTransform: 'uppercase'
                            }}>
                                {l.risk_level > 7 ? 'Critical Unrest' : 'Stable Field'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Locations;