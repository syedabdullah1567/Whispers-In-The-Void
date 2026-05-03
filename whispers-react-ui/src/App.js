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

import AttackingMission from './AttackingMission'; 
import CombatResolution from './CombatResolution';

import WeaknessIntel from './WeaknessIntel'
import WeaknessInitialize from './WeaknessInitialize'
import WeaknessSpecies from './WeaknessSpecies'
import WeaknessCipher from './WeaknessCipher'

import './App.css';

const AudioController = ({ horrorRef, dashboardRef, gameStarted }) => {
    const location = useLocation();

    useEffect(() => {
        const dashboardPaths = [
            "/dashboard", 
            "/ops-log", 
            "/entities", 
            "/artifacts", 
            "/bloodlines", 
            "/hunters", 
            "/locations",
            "/scout-operation",
            "/collect-operation",
            "/weaknesses",
            "/weaknesses/initialize",
            "/weaknesses/species",
            "/weaknesses/cipher/Poltergeist",
            "/weaknesses/cipher/Vampire",
            "/weaknesses/cipher/Wraith",
            "/attacker-gameplay",
            "/combat-resolution"
        ];
        
        const isDashboardPath = dashboardPaths.includes(location.pathname);

        if (gameStarted) {
            if (isDashboardPath) {
                horrorRef.current?.pause();
                if (dashboardRef.current) {
                    dashboardRef.current.volume = 0.3;
                    dashboardRef.current.play().catch(e => console.log("Dashboard audio blocked"));
                }
            } else {
                dashboardRef.current?.pause();
                if (horrorRef.current) {
                    horrorRef.current.volume = 0.4;
                    horrorRef.current.play().catch(e => console.log("Horror audio blocked"));
                }
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
    // PERSISTENCE LOGIC: Check localStorage on load to see if session is active
    const [gameStarted, setGameStarted] = useState(() => {
        return localStorage.getItem('whispers_session_active') === 'true';
    });

    const horrorRef = useRef(null);
    const dashboardRef = useRef(null);

    const handleStartGame = () => {
        setGameStarted(true);
        localStorage.setItem('whispers_session_active', 'true');
    };

    return (
        <BrowserRouter>
            <div className="App">
                {/* GLOBAL AUDIO SOURCES - Always rendered so refs stay valid */}
                <audio ref={horrorRef} src="/assets/audio/castlevania.mp3" loop />
                <audio ref={dashboardRef} src="/assets/audio/nightmare.mp3" loop />
                
                {!gameStarted ? (
                    // Logic: If game hasn't started, show landing page
                    <LandingPage onStartGame={handleStartGame} />
                ) : (
                    <>
                        <AudioController 
                            horrorRef={horrorRef} 
                            dashboardRef={dashboardRef} 
                            gameStarted={gameStarted} 
                        />

                        <Routes>
                            {/* GAME FLOW */}
                            <Route path="/" element={<Homepage />} />
                            <Route path="/hunter-select" element={<HunterSelection />} />
                            <Route path="/location-select" element={<LocationSelection />} />
                            <Route path="/op-authorize" element={<Authorize />} />
                            <Route path="/initialize" element={<AuthSequence />} />

                            {/* DASHBOARD FLOW */}
                            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                            <Route path="/entities" element={<DashboardLayout><EntityRegistry /></DashboardLayout>} />
                            <Route path="/artifacts" element={<DashboardLayout><ArtifactVault /></DashboardLayout>} />
                            <Route path="/ops-log" element={<DashboardLayout><OpsLog /></DashboardLayout>} />
                            <Route path="/bloodlines" element={<DashboardLayout><Bloodlines /></DashboardLayout>} />
                            <Route path="/weaknesses" element={<DashboardLayout><WeaknessIntel /></DashboardLayout>} />
                            <Route path="/hunters" element={<DashboardLayout><Hunters /></DashboardLayout>} />
                            <Route path="/locations" element={<DashboardLayout><Locations /></DashboardLayout>} />
                            
                            {/* MISSION FLOWS */}
                            <Route path="/scout-operation" element={<DashboardLayout><ScoutingMission /></DashboardLayout>} />
                            <Route path="/collect-operation" element={<DashboardLayout><CollectionMission /></DashboardLayout>} />
                            
                            {/* ATTACK SEQUENCE MODULES */}
                            <Route path="/attacker-gameplay" element={<DashboardLayout><AttackingMission /></DashboardLayout>} />
                            <Route path="/combat-resolution" element={<DashboardLayout><CombatResolution /></DashboardLayout>} />

                            {/* WEAKNESS INTEL & CIPHERS */}
                            <Route path="/weaknesses/initialize" element={<WeaknessInitialize />} />
                            <Route path="/weaknesses/species" element={<WeaknessSpecies />} />
                            <Route path="/weaknesses/cipher/:species" element={<WeaknessCipher />} />

                            {/* REDIRECTS */}
                            <Route path="/send-operation" element={<Navigate to="/initialize" replace />} />
                            
                            {/* CATCH-ALL: If user is lost, go home */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </>
                )}
            </div>
        </BrowserRouter>
    );
}