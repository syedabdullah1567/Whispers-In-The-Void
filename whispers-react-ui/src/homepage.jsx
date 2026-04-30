import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);

    // Function to start audio (triggered by the container click or hover)
    const startAmbience = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
            audioRef.current.play().catch(e => console.log("Audio waiting for interaction"));
        }
    };

    return (
        <div 
            className="horror-root" 
            onClick={startAmbience}
            onMouseEnter={startAmbience}
        >
            {/* BACKGROUND AUDIO BOILERPLATE */}
            {/* Place your .mp3 file in the 'public/assets/audio/' folder */}
            <audio 
                ref={audioRef} 
                src="/assets/audio/void_ambience.mp3" 
                loop 
            />

            <div className="vignette"></div>
            <div className="scanlines"></div>

            <div className="terminal-frame">
                <div className="header-section">
                    <h1 className="main-title">WHISPERS</h1>
                    <h2 className="sub-title">IN THE VOID</h2>
                </div>
                
                <div className="content-body">
                    {/* System Log Block */}
                    <div className="log-block">
                        <p className="log-header">[LOG_RECOVERY_FAIL: 30.04.2026]</p>
                        <p className="log-text">
                            SIGNAL: <span className="glitch-text">PULSE_DETECTED_IN_VACUUM</span><br />
                            ARCHIVE: <span className="text-danger">94% CORRUPTED</span><br />
                            MORALE: <span className="strikethrough">EXTINGUISHED</span>
                        </p>
                    </div>

                    {/* The Warning */}
                    <div className="warning-box">
                        <p className="warning-label">REDACTED DIRECTIVE 0-00:</p>
                        <p className="warning-text">
                            If an asset returns with a different voice, <span className="highlight">do not open the airlock.</span>
                        </p>
                        <p className="warning-text footer-note">
                            The void does not mimic; <span className="blood-text">it replaces.</span> 
                            Selection is merely an act of sacrifice.
                        </p>
                    </div>
                </div>

                <div className="action-area">
                    <button 
                        className="init-button"
                        onClick={() => navigate('/initialize')}
                    >
                        INITIALIZE SELECTION
                    </button>
                    <div className="button-glitch"></div>
                </div>
            </div>

            <style>{`
                .horror-root {
                    background: #000;
                    color: #ff4d4d;
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                    overflow: hidden;
                    position: relative;
                }

                /* Deep shadows on edges */
                .vignette {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.9) 100%);
                    z-index: 2;
                    pointer-events: none;
                }

                .terminal-frame {
                    width: 90%;
                    max-width: 700px;
                    border: 1px solid #300;
                    padding: 40px;
                    background: rgba(10, 0, 0, 0.8);
                    z-index: 3;
                    position: relative;
                    box-shadow: 0 0 40px rgba(255, 0, 0, 0.05);
                }

                .main-title {
                    font-size: 5rem;
                    font-weight: 900;
                    margin: 0;
                    letter-spacing: -5px;
                    text-shadow: 3px 0px 0px rgba(255, 0, 0, 0.4);
                    animation: drift 5s infinite ease-in-out;
                }

                .sub-title {
                    font-size: 1.2rem;
                    letter-spacing: 12px;
                    opacity: 0.5;
                    margin-top: -10px;
                    margin-bottom: 40px;
                }

                .log-block {
                    border-left: 2px solid #ff4d4d;
                    padding-left: 20px;
                    margin-bottom: 30px;
                }

                .log-header { font-size: 0.7rem; font-weight: bold; margin-bottom: 5px; }
                .log-text { color: #aaa; font-size: 0.9rem; line-height: 1.4; }
                .strikethrough { text-decoration: line-through; opacity: 0.4; }

                .warning-box {
                    background: rgba(255, 0, 0, 0.03);
                    padding: 15px;
                    border: 1px solid rgba(255, 0, 0, 0.1);
                }

                .warning-label { font-size: 0.65rem; color: #600; margin-bottom: 8px; }
                .warning-text { color: #888; font-size: 0.85rem; font-style: italic; }
                .highlight { color: #eee; }
                .blood-text { color: #ff0000; font-weight: bold; text-shadow: 0 0 5px red; }

                .init-button {
                    background: transparent;
                    border: 1px solid #ff4d4d;
                    color: #ff4d4d;
                    padding: 15px 40px;
                    font-size: 1rem;
                    font-weight: bold;
                    letter-spacing: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 40px;
                    width: 100%;
                }

                .init-button:hover {
                    background: #ff4d4d;
                    color: #000;
                    box-shadow: 0 0 30px rgba(255, 0, 0, 0.4);
                }

                /* Animations */
                @keyframes drift {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }

                .scanlines {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
                    background-size: 100% 4px;
                    z-index: 4;
                    pointer-events: none;
                    opacity: 0.3;
                }

                .glitch-text {
                    animation: glitch 2s infinite;
                }

                @keyframes glitch {
                    0% { transform: skew(0deg); }
                    2% { transform: skew(10deg); color: #fff; }
                    4% { transform: skew(0deg); }
                }
            `}</style>
        </div>
    );
};

export default Homepage;