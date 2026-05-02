import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FloatingDock from './FloatingDock';
import Dashboard from './Dashboard'; 
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
import LandingPage from './LandingPage'; // Your new intro component
import './App.css';

// 1. Unified Layout for the Internal Dashboard
const DashboardLayout = ({ children }) => (
  <div className="app-root">
    <FloatingDock />
    <main className="main-content">
      {children}
    </main>
  </div>
);

export default function App() {
  // 2. State to track if we have finished the intro and started the game
  const [gameStarted, setGameStarted] = useState(false);

  // 3. If game hasn't started, show the intro sequence
  // We pass setGameStarted to the LandingPage so the 'Start' button can trigger it
  if (!gameStarted) {
    return (
      <div className="App">
        <LandingPage onStartGame={() => setGameStarted(true)} />
      </div>
    );
  }

  // 4. Once gameStarted is true, the full routing system becomes active
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Dashboard Screens */}
        <Route path="/" element={<Homepage />} />
        <Route path="/entities" element={<DashboardLayout><EntityRegistry /></DashboardLayout>} />
        <Route path="/artifacts" element={<DashboardLayout><ArtifactVault /></DashboardLayout>} />
        <Route path="/ops-log" element={<DashboardLayout><OpsLog /></DashboardLayout>} />
        <Route path="/bloodlines" element={<DashboardLayout><Bloodlines /></DashboardLayout>} />
        <Route path="/weaknesses" element={<DashboardLayout><WeaknessIntel /></DashboardLayout>} />
        <Route path="/hunters" element={<DashboardLayout><Hunters /></DashboardLayout>} />
        <Route path="/locations" element={<DashboardLayout><Locations /></DashboardLayout>} />
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />

        {/* Operation Flows */}
        <Route path="/send-operation" element={<Homepage />} />
        <Route path="/hunter-select" element={<HunterSelection />} />
        <Route path="/location-select" element={<LocationSelection />} />
        <Route path="/op-authorize" element={<Authorize />} />
        <Route path="/initialize" element={<AuthSequence />} />

        {/* Mission Screens */}
        <Route path="/scout-operation" element={<DashboardLayout><ScoutingMission /></DashboardLayout>} />
        <Route path="/collect-operation" element={<DashboardLayout><CollectionMission /></DashboardLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}