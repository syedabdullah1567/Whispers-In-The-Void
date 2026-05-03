import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const species = [
    { name: 'Vampire', icon: '🧛', desc: 'Blood-drinking predators of the night. Ancient and cunning.', color: '#800000' },
    { name: 'Poltergeist', icon: '👻', desc: 'Spectral entities that manipulate the physical world.', color: '#4a0080' },
    { name: 'Wraith', icon: '💀', desc: 'Incorporeal beings bound to locations by dark energy.', color: '#003a5a' },
]

const WeaknessSpecies = () => {
    const [selected, setSelected] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const navigate = useNavigate();

    const handleSelect = (s) => {
        setSelected(s);
        setConfirming(false);
    }

    const handleConfirm = () => {
        setConfirming(true);
        setTimeout(() => {
            navigate(`/weaknesses/cipher/${selected.name}`);
        }, 1500)
    }

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
                color: '#800000',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginBottom: 8
            }}>
                CIPHER TERMINAL
            </div>
            <div style={{
                fontSize: 20,
                color: '#ff4d4d',
                letterSpacing: '0.1em',
                marginBottom: 8,
                fontWeight: 'bold'
            }}>
                SELECT TARGET SPECIES
            </div>
            <div style={{
                fontSize: 12,
                color: '#333',
                letterSpacing: '0.1em',
                marginBottom: 50,
                textTransform: 'uppercase'
            }}>
                Choose the entity type whose weakness you wish to decrypt
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
                {species.map(s => (
                    <div
                        key={s.name}
                        onClick={() => handleSelect(s)}
                        style={{
                            width: 200,
                            padding: '30px 20px',
                            background: selected?.name === s.name ? '#0a0000' : '#050505',
                            border: selected?.name === s.name ? `2px solid ${s.color}` : '1px solid #944c4c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.25s',
                            transform: selected?.name === s.name ? 'translateY(-8px)' : 'translateY(0)',
                            boxShadow: selected?.name === s.name ? `0 0 30px ${s.color}44` : 'none'
                        }}
                        onMouseEnter={e => {
                            if (selected?.name !== s.name) {
                                e.currentTarget.style.borderColor = s.color
                                e.currentTarget.style.transform = 'translateY(-4px)'
                            }
                        }}
                        onMouseLeave={e => {
                            if (selected?.name !== s.name) {
                                e.currentTarget.style.borderColor = '#944c4c'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>{s.icon}</div>
                        <div style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: selected?.name === s.name ? '#ff4d4d' : '#444',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 12
                        }}>
                            {s.name}
                        </div>
                        <div style={{
                            fontSize: 11,
                            color: '#333',
                            lineHeight: 1.8
                        }}>
                            {s.desc}
                        </div>
                    </div>
                ))}
            </div>

            {selected && !confirming && (
                <button
                    onClick={handleConfirm}
                    style={{
                        padding: '14px 48px',
                        background: '#1a0000',
                        border: '1px solid #800000',
                        color: '#ff4d4d',
                        fontSize: 14,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        cursor: 'pointer',
                        animation: 'pulseBtn 2s infinite'
                    }}
                >
                    [ DECRYPT {selected.name.toUpperCase()} WEAKNESS ]
                </button>
            )}

            {confirming && (
                <div style={{
                    fontSize: 16,
                    color: '#ff4d4d',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    animation: 'flicker 0.5s infinite'
                }}>
                    ACCESSING {selected.name.toUpperCase()} INTEL...
                </div>
            )}

            <button
                onClick={() => navigate('/weaknesses')}
                style={{
                    marginTop: 30,
                    background: 'transparent',
                    border: 'none',
                    color: '#222',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}
            >
                ← RETURN TO INTEL
            </button>

            <style>{`
                @keyframes pulseBtn {
                    0%,100%{box-shadow:0 0 0 0 rgba(255,77,77,0.3)}
                    50%{box-shadow:0 0 20px rgba(255,77,77,0.15)}
                }
                @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.3} }
            `}</style>
        </div>
    )
}

export default WeaknessSpecies;