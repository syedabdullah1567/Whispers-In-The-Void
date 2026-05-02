import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; 

export default function AuthSequence() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  const bootSequence = [
    "> INITIALIZING UPLINK...",
    "> BYPASSING SECTOR 7 FIREWALL...",
    "> ACCESSING ENTITY REGISTRY...",
    "> DECRYPTING HUNTER DOSSIERS...",
    "> AUTHORIZATION GRANTED."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => navigate('/hunter-select'), 1000); // Transitions to hunters after boot
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="glitch-title" data-text="CRITICAL ACCESS">CRITICAL ACCESS</div>
        <div className="terminal-log">
          {logs.map((log, idx) => (
            <div key={idx} className="log-line">{log}</div>
          ))}
          <div className="cursor">_</div>
        </div>
      </div>

      <style>{`
        .auth-container {
          height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
        }
        .auth-box {
          width: 400px;
          border: 1px solid #ff4d4d;
          padding: 30px;
          box-shadow: 0 0 20px rgba(255, 77, 77, 0.2);
        }
        .glitch-title {
          color: #ff4d4d;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .terminal-log {
          color: #eee;
          font-size: 13px;
          min-height: 120px;
        }
        .log-line { margin-bottom: 8px; color: #888; }
        .log-line:last-child { color: #ff4d4d; font-weight: bold; }
        .cursor { display: inline-block; animation: blink 1s infinite; color: #ff4d4d; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}