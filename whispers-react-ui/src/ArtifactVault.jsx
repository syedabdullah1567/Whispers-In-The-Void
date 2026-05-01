import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArtifactVault = () => {
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // This runs as soon as the "Artifact Vault" page opens
    useEffect(() => {
        // Replace '1' with a dynamic ID based on user selection if needed
        const locationId = 1; 

        fetch(`http://localhost:5000/api/artifacts/${locationId}`)
            .then(res => res.json())
            .then(data => {
                setArtifacts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Vault access denied:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="page-content">
            <div className="topbar">
                <div className="topbar-title">Artifact Vault</div>
            </div>
            
            <div className="card">
                {loading ? (
                    <p>Decrypting artifact records...</p>
                ) : (
                    <div className="artifact-list">
                        {artifacts.map(art => (
                            <div key={art.ID} className="artifact-entry">
                                <h3>{art['Artifact Name']}</h3>
                                <p>{art.Classification} — Origin: {art['Origin Point']}</p>
                                <span className={`status-${art['Current Status']}`}>
                                    {art['Current Status']}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtifactVault;