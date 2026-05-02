import React, { useState, useEffect } from 'react';

// Accept the onStartGame prop from App.js
const LandingPage = ({ onStartGame }) => {
    // Stages: 'ICON', 'STUDIO1', 'STUDIO2', 'TITLE'
    // Note: We removed 'GAME' stage here because App.js handles the switch now
    const [stage, setStage] = useState('ICON');
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        if (stage === 'STUDIO1' || stage === 'STUDIO2') {
            setOpacity(1);
            const timer = setTimeout(() => {
                setOpacity(0);
                setTimeout(() => {
                    setStage(prev => prev === 'STUDIO1' ? 'STUDIO2' : 'TITLE');
                }, 1500); 
            }, 3000); 
            return () => clearTimeout(timer);
        }
        if (stage === 'TITLE') {
            setOpacity(1);
        }
    }, [stage]);

    const handleStartIntro = () => {
        setStage('STUDIO1');
    };

    const handleExit = () => {
        window.close();
        window.location.href = "about:blank";
    };

    if (stage === 'ICON') {
        return (
            <div className="landing-wrapper">
                <div className="game-icon-launcher" onClick={handleStartIntro}>
                    <div className="icon-glow"></div>
                    {/* Add your actual image path here */}
                   <img src="/assets/icons/icon.avif" alt="Whispers in the Void" />
                    <span className="launch-text">CLICK TO INITIALIZE</span>
                </div>
            </div>
        );
    }

    return (
        <div className="landing-wrapper intro-bg">
            <div className="intro-content" style={{ opacity: opacity, transition: 'opacity 1.5s ease-in-out' }}>
                {stage === 'STUDIO1' && <h1 className="studio-text">AAA STUDIOS</h1>}
                {stage === 'STUDIO2' && <h1 className="studio-text">CRAZY INTERACTIVE LTD.</h1>}
                
                {stage === 'TITLE' && (
                    <div className="title-menu">
                        <h1 className="game-title">WHISPERS IN THE VOID</h1>
                        <div className="menu-buttons">
                            {/* NEW: This button calls the function passed from App.js */}
                            <button className="menu-btn start" onClick={onStartGame}>
                                START MISSION
                            </button>
                            
                            <button className="menu-btn exit" onClick={handleExit}>
                                TERMINATE SESSION
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;