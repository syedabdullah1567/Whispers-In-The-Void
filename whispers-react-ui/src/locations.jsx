import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Locations = () => {
    const { state } = useLocation(); // Receives the selected hunter
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/locations")
            .then(res => setLocations(res.data.locationData));
    }, []);

    const handleSelect = (loc) => {
        navigate('/op-authorize', { 
            state: { 
                hunter: state.hunter, 
                location: loc 
            } 
        });
    };

    return (
        <div className="container mt-5 bg-black text-success p-5 border border-success">
            <h2 className="text-uppercase mb-4">SELECT TARGET SECTOR</h2>
            <p className="text-muted small">ASSET: {state?.hunter?.hunter_name} READY FOR DEPLOYMENT</p>
            <div className="row">
                {locations.map(l => (
                    <div key={l.location_id} className="col-md-6 mb-3">
                        <div 
                            className="card bg-dark text-success border-success p-3" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSelect(l)}
                        >
                            <h4>{l.location_name}</h4>
                            <p className="mb-0 text-danger">RISK LEVEL: {l.risk_level}</p>
                            <p className="small text-muted">{l.location_type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Locations;