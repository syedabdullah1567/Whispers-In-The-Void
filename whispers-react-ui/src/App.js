import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import FloatingDock from './FloatingDock';
import Dashboard from './Dashboard'; 
import LandingPage from './LandingPage';
import Homepage from './homepage';
import Hunters from './hunters';    
import Locations from './locations';    
import Authorize from './authorize';    
import AuthSequence from './AuthSequence';
import HunterSelection from './HunterSelection';
import LocationSelection from './LocationSelection';
import Bloodlines from './bloodlines';
import ScoutingMission from './ScoutingMission';
import CollectionMission from './CollectionMission';
import EntityRegistry from './EntityRegistry';
import ArtifactVault from './ArtifactVault';
import OpsLog from './OperationLogs';
import { WeaknessIntel } from './stubs';
import './App.css';

const AudioController = ({ audioRef, gameStarted }) => {
    const location = useLocation();

    useEffect(() => {
        const dashboardPaths = ["/", "/ops-log", "/entities", "/artifacts", "/bloodlines", "/hunters", "/locations"];
        
        if (audioRef.current) {
            // If we move to the Dashboard area, pause the horror music
            if (dashboardPaths.includes(location.pathname)) {
                audioRef.current.pause();
            } else if (gameStarted) {
                // Play music during Homepage and Selection sequences
                audioRef.current.play().catch(e => console.log("Audio waiting for user interaction"));
            }
        }
    }, [location, gameStarted, audioRef]);

    return null;
};

// 1. Unified Layout for the Internal Dashboard
const DashboardLayout = ({ children }) => (
    <div className="app-root">
        <FloatingDock />
        <main className="main-content">{children}</main>
    </div>
);

export default function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const audioRef = useRef(null);

    // If game hasn't started, show only the Landing Page
    if (!gameStarted) {
        return (
            <div className="App">
                <LandingPage onStartGame={() => setGameStarted(true)} />
            </div>
        );
    }

    // Once started, show the Router + Global Audio
    return (
        <BrowserRouter>
            <div className="App">
                {/* Global Audio Element */}
                <audio ref={audioRef} src="/assets/audio/castlevania.mp3" loop />
                
                {/* This helper stops the music when entering the Dashboard */}
                <AudioController audioRef={audioRef} gameStarted={gameStarted} />

                <Routes>
                    {/* ROOT is now HOMEPAGE (The Horror Terminal) */}
                    <Route path="/" element={<Homepage />} />
                    
                    {/* Dashboard explicitly moved to /dashboard */}
                    <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                    
                    {/* Other Layout-wrapped routes */}
                    <Route path="/entities" element={<DashboardLayout><EntityRegistry /></DashboardLayout>} />
                    <Route path="/artifacts" element={<DashboardLayout><ArtifactVault /></DashboardLayout>} />
                    <Route path="/ops-log" element={<DashboardLayout><OpsLog /></DashboardLayout>} />
                    <Route path="/hunters" element={<DashboardLayout><Hunters /></DashboardLayout>} />
                    <Route path="/locations" element={<DashboardLayout><Locations /></DashboardLayout>} />

                    {/* Operation Selection Sequences */}
                    <Route path="/hunter-select" element={<HunterSelection />} />
                    <Route path="/location-select" element={<LocationSelection />} />
                    <Route path="/op-authorize" element={<Authorize />} />
                    <Route path="/initialize" element={<AuthSequence />} />

                    {/* Missions */}
                    <Route path="/scout-operation" element={<DashboardLayout><ScoutingMission /></DashboardLayout>} />
                    <Route path="/collect-operation" element={<DashboardLayout><CollectionMission /></DashboardLayout>} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}