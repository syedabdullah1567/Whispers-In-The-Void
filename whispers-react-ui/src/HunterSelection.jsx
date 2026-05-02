import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'; 

export default function HunterSelection() {
    const [hunters, setHunters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHunters = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/hunters");
                setHunters(response.data.hunterData);
            } catch (error) {
                console.error("Failed to fetch hunters", error);
            }
        };
        fetchHunters();
    }, []);

    return (
        <div className="selection-screen">
            <div className="selection-header">
                <h1 className="glitch-text">SELECT DEPLOYMENT ASSET</h1>
                <p>AUTHORIZED PERSONNEL ONLY // ALPHA-4 CLEARANCE</p>
            </div>

            <div className="card-container">
                {hunters.map(h => (
                    <div key={h.hunter_id} className="hunter-pokemon-card" 
                    onClick={() => navigate('/location-select', 
                    { state: { hunter: h } })
                    }>
                        <div className="card-inner">
                            {/* Rank from Schema */}
                            <div className="card-rank">RK_{h.rank}</div>
                            
                            <div className="card-image-area">
                                <div className="silhouette"></div>
                                <span className="id-tag">ID_{h.hunter_id}</span>
                                <div className="scan-line"></div>
                            </div>

                            <div className="card-info">
                                {/* Name and Type from Schema */}
                                <h2 className="hunter-name">{h.hunter_name}</h2>
                                <div className="hunter-type">{h.type}</div>
                                
                                <div className="hunter-stats">
                                    {/* Faction display from Schema */}
                                    <div className="stat-line">
                                        <span>FACTION</span>
                                        <span style={{ color: '#eee', fontSize: '10px' }}>{h.faction || 'UNAFFILIATED'}</span>
                                    </div>
                                    
                                    {/* Calculated Protocol Bar based on Type Schema */}
                                    <div className="stat-line">
                                        <span>SYNC_RATE</span>
                                        <div className="bar">
                                            <div className="fill" style={{
                                                width: h.type === 'Attacker' ? '90%' : h.type === 'Collector' ? '65%' : '40%'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .selection-screen {
                    min-height: 100vh;
                    background: radial-gradient(circle, #1a0505 0%, #000 100%);
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .selection-header { text-align: center; margin-bottom: 50px; color: #ff4d4d; }
                .card-container { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; }
                
                .hunter-pokemon-card {
                    width: 280px;
                    height: 400px;
                    background: #0f0f0f;
                    border: 2px solid #222;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 10px;
                }
                .hunter-pokemon-card:hover {
                    border-color: #ff4d4d;
                    transform: translateY(-10px) rotate(1deg);
                    box-shadow: 0 0 30px rgba(255, 77, 77, 0.3);
                }
                .card-inner { border: 1px solid #333; height: 100%; display: flex; flex-direction: column; }
                .card-rank { font-size: 10px; background: #ff4d4d; color: #000; font-weight: bold; padding: 2px 8px; align-self: flex-start; margin: 5px; text-transform: uppercase; }
                .card-image-area { flex: 1; background: #050505; margin: 5px; position: relative; overflow: hidden; border-bottom: 1px solid #222; }
                .silhouette { width: 100%; height: 100%; opacity: 0.1; background: url('https://www.transparenttextures.com/patterns/carbon-fibre.png'); }
                .id-tag { position: absolute; bottom: 5px; right: 8px; font-size: 9px; color: #444; font-family: monospace; }
                .scan-line { position: absolute; top: 0; width: 100%; height: 2px; background: rgba(255, 77, 77, 0.5); animation: scan 3s infinite linear; }
                
                .card-info { padding: 15px; background: #0a0a0a; }
                .hunter-name { font-size: 18px; color: #fff; margin-bottom: 0; text-transform: uppercase; }
                .hunter-type { font-size: 11px; color: #ff4d4d; margin-bottom: 15px; letter-spacing: 2px; }
                .stat-line { font-size: 9px; color: #888; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
                .bar { width: 60%; height: 4px; background: #222; }
                .fill { height: 100%; background: #ff4d4d; }
                .card-footer { font-size: 9px; text-align: center; color: #444; margin-top: 10px; border-top: 1px solid #222; padding-top: 5px; }

                @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
            `}</style>
        </div>
    );
}