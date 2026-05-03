import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const bootLines = [
    { text: '> INITIALIZING SECURE CHANNEL...', color: '#555' },
    { text: '> LOADING ENCRYPTED WEAKNESS DATABASE...', color: '#555' },
    { text: '> SCANNING FOR UNAUTHORIZED ACCESS...', color: '#555' },
    { text: '> VERIFYING HUNTER CLEARANCE LEVEL...', color: '#555' },
    { text: '> ESTABLISHING CIPHER PROTOCOL v4.2...', color: '#555' },
    { text: '> ──────────────────────────────────────', color: '#1a0000' },
    { text: '> WARNING: 3 FAILED ATTEMPTS = SYSTEM PENALTY', color: '#ff4d4d' },
    { text: '> PENALTY TYPE 1: ARTIFACT RESET TO UNLOCATED', color: '#ba7517' },
    { text: '> PENALTY TYPE 2: NEW ENTITY SPAWNED IN FIELD', color: '#ba7517' },
    { text: '> PENALTY TYPE 3: NEUTRALIZED ENTITY RESURRECTED', color: '#ba7517' },
    { text: '> ──────────────────────────────────────', color: '#1a0000' },
    { text: '> ALL WEAKNESSES ARE CAESAR CIPHER ENCRYPTED', color: '#555' },
    { text: '> DETERMINE THE SHIFT KEY TO UNLOCK INTEL', color: '#555' },
    { text: '> ──────────────────────────────────────', color: '#1a0000' },
    { text: '> SYSTEM READY — CIPHER TERMINAL UNLOCKED ✓', color: '#4caf7d' },
]

const WeaknessInitialize = () => {
    const [lines, setLines] = useState([]);
    const [done, setDone] = useState(false);
    const [showBtn, setShowBtn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootLines.length) {
                setLines(prev => [...prev, bootLines[i]])
                i++
            } else {
                clearInterval(interval)
                setTimeout(() => setDone(true), 500)
                setTimeout(() => setShowBtn(true), 1000)
            }
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{
            background: '#000',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            padding: 40
        }}>
            <div style={{
                fontSize: 13,
                color: '#d60202',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginBottom: 8,
                textAlign: 'center'
            }}>
                S.O.M.O.D CLASSIFIED SYSTEM
            </div>
            <div style={{
                fontSize: 11,
                color: '#494848',
                letterSpacing: '0.2em',
                marginBottom: 40,
                textAlign: 'center'
            }}>
                WEAKNESS INTEL TERMINAL // AUTHORIZED ACCESS ONLY
            </div>

            <div style={{
                width: '100%',
                maxWidth: 680,
                background: '#121111',
                border: '1px solid #1a0000',
                padding: 32,
                minHeight: 380,
                position: 'relative'
            }}>
                {/* Scanline effect */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.01) 2px, rgba(255,0,0,0.01) 4px)',
                    pointerEvents: 'none'
                }} />

                {lines.filter(Boolean).map((line, i) => (
                    <div key={i} style={{
                        fontSize: 14,
                        color: line.color,
                        marginBottom: 10,
                        letterSpacing: '0.05em',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        {line.text}
                        {i === lines.length - 1 && !done && (
                            <span style={{ animation: 'blink 0.8s infinite' }}>█</span>
                        )}
                    </div>
                ))}
            </div>

            {showBtn && (
                <button
                    onClick={() => navigate('/weaknesses/species')}
                    style={{
                        marginTop: 40,
                        padding: '16px 56px',
                        background: '#0a0000',
                        border: '1px solid #800000',
                        color: '#ff4d4d',
                        fontSize: 15,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        cursor: 'pointer',
                        animation: 'pulseBtn 2s infinite'
                    }}
                >
                    [ ACCESS CIPHER TERMINAL ]
                </button>
            )}

            <style>{`
                @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulseBtn {
                    0%,100%{box-shadow:0 0 0 0 rgba(255,77,77,0.3)}
                    50%{box-shadow:0 0 20px rgba(255,77,77,0.15)}
                }
                button:hover { border-color: #ff4d4d !important; }
            `}</style>
        </div>
    )
}

export default WeaknessInitialize;