import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FloatingDock from './FloatingDock'; // Removed /components/
import Dashboard from './Dashboard';       // Removed /pages/
import Homepage from './homepage';         // Removed /pages/
import Hunters from './hunters';           // Removed /pages/
import Locations from './locations';       // Removed /pages/
import Authorize from './authorize';       // Removed /pages/
import AuthSequence from './AuthSequence';
import HunterSelection from './HunterSelection';
import LocationSelection from './LocationSelection';
import {
  EntityRegistry, ArtifactVault,
  OpsLog, Bloodlines,
  WeaknessIntel,
} from './stubs'; // Removed /pages/
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
        {/* <Route path="/hunters" element={<DashboardLayout><Hunters viewOnly={true} /></DashboardLayout>} /> */}

        {/* --- FIELD TERMINAL / GAME LOOP (Horror UI) --- */}
        {/* We enter this 'mode' via the Send Operation button */}
        <Route path="/send-operation" element={<Homepage />} />
        
        {/* The step-by-step mission deployment */}
        <Route path="/hunter-select" element={<HunterSelection />} />
        <Route path="/location-select" element={<LocationSelection />} />
        <Route path="/op-authorize" element={<Authorize />} />

        <Route path="/initialize" element={<AuthSequence />} />

        

        {/* Catch-all to redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};