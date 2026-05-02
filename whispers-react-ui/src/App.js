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

const AudioController = ({ horrorRef, dashboardRef, gameStarted }) => {
    const location = useLocation();

    useEffect(() => {
        // List of paths that should use the Dashboard music (nightmare.mp3)
        const dashboardPaths = [
            "/dashboard", 
            "/ops-log", 
            "/entities", 
            "/artifacts", 
            "/bloodlines", 
            "/hunters", 
            "/locations",
            "/scout-operation",
            "/collect-operation"
        ];
        
        const isDashboardPath = dashboardPaths.includes(location.pathname);

        if (gameStarted) {
            if (isDashboardPath) {
                // Switch to Dashboard Music
                horrorRef.current?.pause();
                dashboardRef.current.volume = 0.3; // Dashboard music usually slightly quieter
                dashboardRef.current.play().catch(e => console.log("Dashboard audio blocked"));
            } else {
                // Switch to Horror/Game Music (Homepage & Selection)
                dashboardRef.current?.pause();
                horrorRef.current.volume = 0.4;
                horrorRef.current.play().catch(e => console.log("Horror audio blocked"));
            }
        }
    }, [location, gameStarted, horrorRef, dashboardRef]);

    return null;
};

const DashboardLayout = ({ children }) => (
    <div className="app-root">
        <FloatingDock />
        <main className="main-content">{children}</main>
    </div>
);

export default function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const horrorRef = useRef(null);
    const dashboardRef = useRef(null);

    if (!gameStarted) {
        return (
            <div className="App">
                <LandingPage onStartGame={() => setGameStarted(true)} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="App">
                {/* GLOBAL AUDIO SOURCES */}
                <audio ref={horrorRef} src="/assets/audio/castlevania.mp3" loop />
                <audio ref={dashboardRef} src="/assets/audio/nightmare.mp3" loop />
                
                {/* The brain that decides which music plays */}
                <AudioController 
                    horrorRef={horrorRef} 
                    dashboardRef={dashboardRef} 
                    gameStarted={gameStarted} 
                />

                <Routes>
                    {/* GAME FLOW (Horror Music) */}
                    <Route path="/" element={<Homepage />} />
                    <Route path="/hunter-select" element={<HunterSelection />} />
                    <Route path="/location-select" element={<LocationSelection />} />
                    <Route path="/op-authorize" element={<Authorize />} />
                    <Route path="/initialize" element={<AuthSequence />} />

                    {/* DASHBOARD FLOW (Nightmare Music) */}
                    <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                    <Route path="/entities" element={<DashboardLayout><EntityRegistry /></DashboardLayout>} />
                    <Route path="/artifacts" element={<DashboardLayout><ArtifactVault /></DashboardLayout>} />
                    <Route path="/ops-log" element={<DashboardLayout><OpsLog /></DashboardLayout>} />
                    <Route path="/bloodlines" element={<DashboardLayout><Bloodlines /></DashboardLayout>} />
                    <Route path="/weaknesses" element={<DashboardLayout><WeaknessIntel /></DashboardLayout>} />
                    <Route path="/hunters" element={<DashboardLayout><Hunters /></DashboardLayout>} />
                    <Route path="/locations" element={<DashboardLayout><Locations /></DashboardLayout>} />

                    {/* Missions (I included these in Dashboard Music as they use the Layout) */}
                    <Route path="/scout-operation" element={<DashboardLayout><ScoutingMission /></DashboardLayout>} />
                    <Route path="/collect-operation" element={<DashboardLayout><CollectionMission /></DashboardLayout>} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}