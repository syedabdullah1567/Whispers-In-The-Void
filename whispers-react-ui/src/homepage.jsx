import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container bg-black text-danger d-flex align-items-center justify-content-center vh-100">
            {/* Scanned Line Overlay Effect */}
            <div className="scanlines"></div>

            <div className="text-center p-5 border border-danger shadow-lg bg-dark bg-opacity-25" style={{maxWidth: '800px', zIndex: 1}}>
                <h1 className="display-1 fw-bold mb-0 tracking-tighter">WHISPERS</h1>
                <h2 className="display-6 mb-4 text-uppercase opacity-75">In The Void</h2>
                
                <hr className="border-danger opacity-50" />
                
                <div className="mb-5 font-monospace text-start" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {/* System Status Block */}
                    <div className="mb-4 p-2 border-start border-danger" style={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
                        <p className="mb-1 text-uppercase fw-bold" style={{ color: '#ff4d4d', letterSpacing: '2px' }}>
                            [LOG_RECOVERY_FAIL: 28.04.2026]
                        </p>
                        <p className="mb-0 text-white opacity-75">
                            SIGNAL: <span className="glitch-text">PULSE DETECTED IN VACUUM</span><br />
                            ARCHIVE: <span className="text-danger">94% CORRUPTED</span><br />
                            MORALE: <span className="text-decoration-line-through">EXTINGUISHED</span>
                        </p>
                    </div>

                    {/* The Cryptic Warning */}
                    <div className="ps-3" style={{ borderLeft: '1px solid #444' }}>
                        <p className="mb-2 text-danger fw-bold italic" style={{fontSize: '0.75rem'}}>REDACTED DIRECTIVE 0-00:</p>
                        <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                            If an asset returns with a different voice, <span className="text-white">do not open the airlock.</span>
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                            The void does not mimic; <span className="text-danger font-weight-bold">it replaces.</span> 
                            Selection is merely an act of sacrifice.
                        </p>
                    </div>
                </div>

                <button 
                    className="btn btn-outline-danger btn-lg px-5 py-3 text-uppercase fw-bold"
                    onClick={() => navigate('/initialize')}
                    style={{letterSpacing: '5px', transition: '0.3s'}}
                    onMouseOver={(e) => e.target.style.boxShadow = '0 0 20px #ff0000'}
                    onMouseOut={(e) => e.target.style.boxShadow = 'none'}
                >
                    Initialize Selection
                </button>
            </div>

            <style>{`
                @keyframes flicker {
                    0% { opacity: 0.9; }
                    5% { opacity: 0.8; }
                    10% { opacity: 0.9; }
                    100% { opacity: 1; }
                }
                @keyframes glitch {
                    0% { transform: translate(0); text-shadow: -2px 0 red, 2px 0 blue; }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); text-shadow: 2px 0 red, -2px 0 blue; }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .glitch-text {
                    display: inline-block;
                    animation: glitch 1.5s linear infinite;
                    color: #fff;
                }
                .homepage-container {
                    animation: flicker 0.1s infinite;
                    font-family: 'Courier New', Courier, monospace;
                    overflow: hidden;
                    position: relative;
                }
                .scanlines {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(
                        rgba(18, 16, 16, 0) 50%, 
                        rgba(0, 0, 0, 0.25) 50%
                    ), linear-gradient(
                        90deg, 
                        rgba(255, 0, 0, 0.06), 
                        rgba(0, 255, 0, 0.02), 
                        rgba(0, 0, 255, 0.06)
                    );
                    background-size: 100% 4px, 3px 100%;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default Homepage;