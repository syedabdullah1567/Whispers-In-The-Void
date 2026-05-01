import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FloatingDock from './components/FloatingDock'; // Removed /components/
import Dashboard from './pages/Dashboard';       // Removed /pages/
import Homepage from './pages/homepage';         // Removed /pages/
import Hunters from './pages/hunters';           // Removed /pages/
import Locations from './pages/locations';       // Removed /pages/
import Authorize from './pages/authorize';       // Removed /pages/
import AuthSequence from './pages/AuthSequence';
import HunterSelection from './pages/HunterSelection';
import LocationSelection from './pages/LocationSelection';
import Bloodlines from './pages/bloodlines';
import ScoutingMission from './pages/ScoutingMission';
import EntityRegistry from './pages/EntityRegistry';
import {
  ArtifactVault,
  OpsLog,
  WeaknessIntel,
} from './pages/stubs'; // Removed /pages/
import './App.css';

// Layout for the Strategic Dashboard (Command Center)
const DashboardLayout = ({ children }) => (
  <div className="app-root">
    <FloatingDock />
    <main className="main-content">
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- STRATEGIC COMMAND CENTER (Sleek UI) --- */}
        <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/entities" element={<DashboardLayout><EntityRegistry /></DashboardLayout>} />
        <Route path="/artifacts" element={<DashboardLayout><ArtifactVault /></DashboardLayout>} />
        <Route path="/ops-log" element={<DashboardLayout><OpsLog /></DashboardLayout>} />
        <Route path="/bloodlines" element={<DashboardLayout><Bloodlines /></DashboardLayout>} />
        <Route path="/weaknesses" element={<DashboardLayout><WeaknessIntel /></DashboardLayout>} />
        <Route path="/hunters" element={<DashboardLayout><Hunters /></DashboardLayout>} />
        <Route path="/locations" element={<DashboardLayout><Locations /></DashboardLayout>} />

        {/* --- FIELD TERMINAL / GAME LOOP (Horror UI) --- */}
        {/* We enter this 'mode' via the Send Operation button */}
        <Route path="/send-operation" element={<Homepage />} />
        
        {/* The step-by-step mission deployment */}
        <Route path="/hunter-select" element={<HunterSelection />} />
        <Route path="/location-select" element={<LocationSelection />} />
        <Route path="/op-authorize" element={<Authorize />} />

        <Route path="/initialize" element={<AuthSequence />} />

        {/* Missions */}

        <Route path="/scout-operation" element={<DashboardLayout><ScoutingMission /></DashboardLayout>} />

        {/* Catch-all to redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};