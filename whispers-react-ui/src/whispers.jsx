import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Whispers = () => {
    const [huntersArr, setHunters] = useState([]);
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

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h1 className="mb-4">Displaying all hunters</h1>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rank</th>
                        <th>Specialization</th>
                        <th>Faction</th>
                    </tr>
                </thead>
                <tbody>
                    {huntersArr.map((hun) => (
                        <tr key={hun.hunter_id}>
                            <td>{hun.hunter_name}</td>
                            <td>{hun.rank}</td>
                            <td>{hun.specialization}</td>
                            <td>{hun.faction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Whispers;