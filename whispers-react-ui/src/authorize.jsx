import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Authorize = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    const hunter = state?.hunter;
    const location = state?.location;

    // State for the new operation type requirement
    const [operationType, setOperationType] = useState("");
    const [authResult, setAuthResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAuthorizationRequest = async () => {
        if (!hunter || !location) {
            toast.error("Data Corruption: Missing personnel or location parameters.");
            return;
        }

        if (!operationType) {
            toast.warn("Administrative Requirement: Select Operation Type.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/authorize", {
                hunterId: hunter.hunter_id,
                locationId: location.location_id,
                operationType: operationType // Sending the new parameter to server.js
            });

            setAuthResult(response.data);
            
            if (response.data.authorized) {
                toast.success("Clearance Granted.");
            } else {
                toast.error("Clearance Denied.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Terminal Error: Could not reach Authorization Server.");
        } finally {
            setLoading(false);
        }
    };

    if (!hunter || !location) {
        return (
            <div className="container mt-5 bg-dark text-danger p-5 rounded border border-danger">
                <h1>ACCESS RESTRICTED</h1>
                <p>No deployment data detected. Please restart selection process.</p>
                <button className="btn btn-outline-danger" onClick={() => navigate("/")}>
                    Return to Start
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5 bg-black text-success p-5 rounded border border-success shadow-lg">
            <ToastContainer theme="dark" />
            
            <h1 className="text-uppercase border-bottom border-success pb-3 mb-4">
                Deployment Authorization Terminal
            </h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h5 className="text-muted text-uppercase">Asset Details</h5>
                    <p className="mb-1"><strong>Name:</strong> {hunter.hunter_name}</p>
                    <p className="mb-1"><strong>Specialization:</strong> <span className="text-info">{hunter.type}</span></p>
                </div>
                <div className="col-md-6 border-start border-secondary">
                    <h5 className="text-muted text-uppercase">Target Parameters</h5>
                    <p className="mb-1"><strong>Sector:</strong> {location.location_name}</p>
                    <p className="mb-1"><strong>Risk Level:</strong> <span className="text-danger">{location.risk_level}</span></p>
                </div>
            </div>

            <hr className="border-secondary" />

            {/* NEW: Operation Type Selection */}
            <div className="my-4">
                <label className="form-label text-uppercase text-muted small">Specify Operation Type</label>
                <select 
                    className="form-select bg-dark text-success border-success"
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value)}
                    disabled={authResult !== null}
                >
                    <option value="">-- SELECT PROTOCOL --</option>
                    <option value="Scouting">Scouting (Requires Scout)</option>
                    <option value="Recovery">Recovery (Requires Collector)</option>
                    <option value="Combat">Combat (Requires Attacker)</option>
                </select>
            </div>

            <div className="text-center my-5">
                {!authResult ? (
                    <button 
                        className="btn btn-outline-success btn-lg px-5 py-3" 
                        onClick={handleAuthorizationRequest}
                        disabled={loading}
                    >
                        {loading ? "PROCESSING..." : "REQUEST FINAL AUTHORIZATION"}
                    </button>
                ) : (
                    <div className={`p-4 border ${authResult.authorized ? 'border-success bg-dark' : 'border-danger bg-dark'}`}>
                        <h2 className={authResult.authorized ? 'text-success' : 'text-danger'}>
                            {authResult.authorized ? ">>> STATUS: AUTHORIZED" : ">>> STATUS: DENIED"}
                        </h2>
                        <p className="fs-4 mt-3 text-white">"{authResult.message}"</p>
                        
                        <button className="btn btn-outline-secondary mt-4" onClick={() => navigate("/")}>
                            RESET TERMINAL
                        </button>
                    </div>
                )}
            </div>

            <p className="text-center text-muted x-small mt-5">
                SYSTEM LOG: Protocol {operationType || "NULL"} initialized for Asset_{hunter.hunter_id}.
            </p>
        </div>
    );
};

export default Authorize;