import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation

const Locations = () => {
    const [locationsArr, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const hunter = state?.hunter;

    const API_URL = "http://localhost:3000/api/locations";

    const fetchLocations = async () => {
        try {
            const response = await axios.get(API_URL);
            setLocations(response.data.locationData); 
        } catch (error) {
            toast.error("Failed to fetch location records.");
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleProceed = () => {
        if (!selectedLocation) {
            toast.warn("Administrative Error: No location selected.");
            return;
        }
        navigate("/authorize", { state: { hunter: hunter, location: selectedLocation } });
    };

    return (
        <div className="container mt-5 bg-dark text-light p-5 rounded">
            <ToastContainer theme="dark" />
            <h1 className="mb-4 text-uppercase">Area of Operation</h1>
            <p className="text-muted">Deploying Asset: {hunter?.hunter_name || "Unknown"}</p>
            
            <table className="table table-dark table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Risk Level</th>
                    </tr>
                </thead>
                <tbody>
                    {locationsArr.map((loc) => (
                        <tr 
                            key={loc.location_id} 
                            onClick={() => setSelectedLocation(loc)}
                            style={{ cursor: 'pointer' }}
                            className={selectedLocation?.location_id === loc.location_id ? "table-active border-primary" : ""}
                        >
                            <td>{loc.location_name}</td>
                            <td>{loc.location_type}</td>
                            <td>{loc.risk_level}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="btn btn-outline-primary mt-4" onClick={handleProceed}>
                CONFIRM DEPLOYMENT ZONE
            </button>
        </div>
    );
};

export default Locations;