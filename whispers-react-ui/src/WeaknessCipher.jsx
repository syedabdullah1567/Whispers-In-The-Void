import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const HUNTER_ID = 1;

const WeaknessCipher = () => {
    const { species } = useParams();
    const navigate = useNavigate();
    const [encryptedText, setEncryptedText] = useState('');
    const [guessInput, setGuessInput] = useState('');
    const [shiftKey, setShiftKey] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(true);
    const [locked, setLocked] = useState(false);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        axios.post('http://localhost:3000/api/weaknesses/generate', {
            hunter_id: HUNTER_ID,
            entity_species: species
        }).then(res => {
            console.log("FRONTEND RECEIVED DATA:", res.data);
            let d = Array.isArray(res.data) ? res.data[0] : res.data;
            if (!d) d = {};
            
            if (d.message && d.message.includes('LOCKED')) {
                setLocked(true);
                setMessage(d.message);
                setMessageType('breach');
            } else {
                setEncryptedText(d.encrypted_text || d.Encrypted_text || d.encryptedText || '');
                setShiftKey(
                    d.current_shift ??
                    d.shift ??
                    d.shift_hint ??
                    d.Shift ??
                    d.CURRENT_SHIFT ??
                    '?'
                    );
            }
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        })
    }, [species])

    const handleSubmit = async () => {
        if (!guessInput) return;
        try {
            const res = await axios.post('http://localhost:3000/api/weaknesses/decrypt', {
                hunter_id: HUNTER_ID,
                guess: guessInput,
                entity_species: species
            })
            const msg = res.data.message;
            if (msg.includes('SUCCESSFUL')) {
                setMessage(msg);
                setMessageType('success');
                setSolved(true);
            } else if (msg.includes('BREACH')) {
                setMessage(msg);
                setMessageType('breach');
                setLocked(true);
            } else {
                setMessage(msg);
                setMessageType('error');
                setGuessInput('');
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return (
        <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
            <div style={{ color: '#800000', fontSize: 16, letterSpacing: '0.2em', animation: 'flicker 1s infinite' }}>
                LOADING CIPHER...
            </div>
            <style>{`@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
        </div>
    )

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
            <div style={{ fontSize: 13, color: '#800000', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 8 }}>
                CIPHER TERMINAL // {species.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: '#2a2a2a', letterSpacing: '0.15em', marginBottom: 50, textTransform: 'uppercase' }}>
                Crack the shift key to reveal the weakness
            </div>

            <div style={{
                width: '100%',
                maxWidth: 620,
                background: '#050505',
                border: locked ? '1px solid #3a0000' : solved ? '1px solid #1a3a1a' : '1px solid #2a0000',
                padding: 48,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Scanline */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,0,0,0.01) 2px,rgba(255,0,0,0.01) 4px)',
                    pointerEvents: 'none'
                }} />

                {locked ? (
                    <div>
                        <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
                        <div style={{ fontSize: 18, color: '#ff4d4d', letterSpacing: '0.1em', marginBottom: 16 }}>
                            SYSTEM LOCKED
                        </div>
                        <div style={{ fontSize: 13, color: '#444', lineHeight: 2 }}>{message}</div>
                    </div>
                ) : solved ? (
                    <div>
                        <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
                        <div style={{ fontSize: 18, color: '#4caf7d', letterSpacing: '0.1em', marginBottom: 16 }}>
                            DECRYPTION SUCCESSFUL
                        </div>
                        <div style={{ fontSize: 14, color: '#2a5a2a', lineHeight: 2 }}>
                            {species.toUpperCase()} WEAKNESS UNLOCKED
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: 12, color: '#333', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Encrypted {species} Weakness Signal
                        </div>

                        <div style={{
                            fontSize: 38,
                            fontWeight: 'bold',
                            color: '#ff4d4d',
                            letterSpacing: '0.25em',
                            marginBottom: 24,
                            textShadow: '0 0 30px rgba(255,77,77,0.6)',
                            animation: 'flicker 4s infinite'
                        }}>
                            {encryptedText}
                        </div>

                        {shiftKey && (
                            <div style={{
                                fontSize: 11,
                                color: '#5a5a5a',
                                letterSpacing: '0.25em',
                                marginBottom: 40,
                                textTransform: 'uppercase',
                                padding: '6px 16px',
                                border: '1px dashed #2a0000',
                                display: 'inline-block',
                                background: '#0a0505'
                            }}>
                                SYS_OFFSET_PARAM // 0x0{shiftKey}
                            </div>
                        )}

                        <div style={{ fontSize: 13, color: '#333', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Enter Decrypted Signal
                        </div>

                        {/* Custom shift input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
                            <input
                                type="text"
                                value={guessInput}
                                onChange={(e) => setGuessInput(e.target.value.toUpperCase())}
                                placeholder="?"
                                style={{
                                    width: 200,
                                    height: 44,
                                    background: '#0a0000',
                                    border: '1px solid #3a0000',
                                    color: '#ff4d4d',
                                    fontSize: 22,
                                    fontFamily: 'monospace',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textShadow: '0 0 10px rgba(255,77,77,0.5)',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase'
                                }}
                            />

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                style={{
                                    background: '#1a0000',
                                    border: '1px solid #800000',
                                    color: '#ff4d4d',
                                    padding: '0 28px',
                                    height: 44,
                                    fontFamily: 'monospace',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#ff4d4d'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#800000'}
                            >
                                SUBMIT
                            </button>
                        </div>

                        {message && (
                            <div style={{
                                padding: '12px 20px',
                                background: '#050505',
                                border: `1px solid ${messageType === 'error' ? '#2a2000' : '#1a0000'}`,
                                color: messageType === 'error' ? '#ba7517' : '#ff4d4d',
                                fontSize: 14,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                animation: 'fadeIn 0.3s ease'
                            }}>
                                {message}
                            </div>
                        )}
                    </>
                )}
            </div>

            {(solved || locked) && (
                <button
                    onClick={() => navigate('/weaknesses')}
                    style={{
                        marginTop: 30,
                        padding: '12px 36px',
                        background: 'transparent',
                        border: '1px solid #1a1a1a',
                        color: '#333',
                        fontSize: 12,
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}
                >
                    ← RETURN TO INTEL
                </button>
            )}

            <style>{`
                @keyframes flicker{0%,100%{opacity:1}50%{opacity:0.6}}
                @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
                input:focus{outline:none;border-color:#ff4d4d !important;}
                input[type=number]::-webkit-inner-spin-button{opacity:1;}
            `}</style>
        </div>
    )
}

export default WeaknessCipher;