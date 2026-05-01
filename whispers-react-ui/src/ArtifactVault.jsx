import React, { useState, useEffect } from 'react';

const ArtifactVault = () => {
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    console.log("useEffect triggered");
        const locationId = 1; 

        fetch(`http://localhost:3000/api/artifacts/${locationId}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                // Ensure data is an array before setting state
                if (Array.isArray(data)) {
                    setArtifacts(data);
                } else {
                    console.error("Data received is not an array:", data);
                    setArtifacts([]);
                }
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
                        {artifacts.length > 0 ? (
                            artifacts.map(art => (
                                <div key={art.ID} className="artifact-entry">
                                    <h3>{art['Artifact Name']}</h3>
                                    <p>{art.Classification} — Origin: {art['Origin Point']}</p>
                                    <span className={`status-${art['Current Status']}`}>
                                        {art['Current Status']}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>No artifacts found for this sector.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtifactVault;