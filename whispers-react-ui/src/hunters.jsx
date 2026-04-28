import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Hunters = () => {
    const [huntersArr, setHunters] = useState([]);
    const [selectedHunter, setSelectedHunter] = useState(null);
    const navigate = useNavigate();
    const API_URL = "http://localhost:3000/api/hunters";

    const fetchHunters = async () => {
        try {
            const response = await axios.get(API_URL);
            setHunters(response.data.hunterData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch administrative records.");
        }
    };

    useEffect(() => {
        fetchHunters();
    }, []);

    const handleProceed = () => {
        if (!selectedHunter) {
            toast.warn("Administrative Error: No hunter selected for deployment.");
            return;
        }
        // Navigate to authorization/operation page and pass the selected hunter's data
        navigate("/location", { state: { hunter: selectedHunter } });
    };

    return (
        <div className="container mt-5 bg-dark text-light p-5 rounded">
            <ToastContainer theme="dark" />
            <h1 className="mb-4 text-uppercase">Personnel Selection</h1>
            <p className="text-muted">Select an asset for field operation. Outcome is data-dependent.</p>
            
            <table className="table table-dark table-hover border-secondary">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rank</th>
                        <th>Type</th>
                        <th>Faction</th>
                    </tr>
                </thead>
                <tbody>
                    {huntersArr.map((hun) => (
                        <tr 
                            key={hun.hunter_id} 
                            onClick={() => setSelectedHunter(hun)}
                            style={{ cursor: 'pointer' }}
                            className={selectedHunter?.hunter_id === hun.hunter_id ? "table-active border-primary" : ""}
                        >
                            <td>{hun.hunter_name}</td>
                            <td>{hun.rank}</td>
                            <td>{hun.type}</td>
                            <td>{hun.faction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 d-flex justify-content-between align-items-center">
                <div>
                    {selectedHunter && (
                        <span className="text-info">Selected: {selectedHunter.hunter_name} ({selectedHunter.rank})</span>
                    )}
                </div>
                <button className="btn btn-outline-primary" onClick={handleProceed}>
                    PROCEED TO SELECTING LOCATION
                </button>
            </div>
        </div>
    );
};

export default Hunters;