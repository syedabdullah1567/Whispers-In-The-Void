import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Hunters = ({ viewOnly }) => {
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

    const handleSelect = (hunter) => {
        if (viewOnly) return; 
        // Navigate to the next step of the game loop
        navigate('/op-select-location', { state: { hunter } });
    };

    return (
        <div className={viewOnly ? "page-content" : "container mt-5 bg-black text-danger p-4 border border-danger"}>
            <h2 className="text-uppercase mb-4">{viewOnly ? "Personnel Roster" : "SELECT DEPLOYMENT ASSET"}</h2>
            <div className="row">
                {hunters.map(h => (
                    <div key={h.hunter_id} className="col-md-4 mb-3">
                        <div 
                            className={`card p-3 ${!viewOnly ? 'bg-dark text-danger border-danger cursor-pointer' : ''}`}
                            onClick={() => handleSelect(h)}
                            style={{ cursor: viewOnly ? 'default' : 'pointer' }}
                        >
                            <h5>{h.hunter_name}</h5>
                            <p className="small mb-1 text-muted">RANK: {h.rank}</p>
                            <p className="small mb-0 text-info">TYPE: {h.type}</p>
                            {!viewOnly && <div className="text-end mt-2"><small className="btn btn-sm btn-outline-danger">SELECT</small></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hunters;