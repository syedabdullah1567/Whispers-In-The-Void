import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FloatingDock from './components/FloatingDock';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage'; // Our horror landing page
import Hunters from './pages/Hunters';   // Our selection logic
import Locations from './pages/Locations'; // Our selection logic
import Authorize from './pages/Authorize'; // Our terminal logic
import {
  EntityRegistry, ArtifactVault,
  OpsLog, Bloodlines,
  WeaknessIntel,
} from './pages/stubs';
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
        <Route path="/hunters" element={<DashboardLayout><Hunters viewOnly={true} /></DashboardLayout>} />

        {/* --- FIELD TERMINAL / GAME LOOP (Horror UI) --- */}
        {/* We enter this 'mode' via the Send Operation button */}
        <Route path="/send-operation" element={<Homepage />} />
        
        {/* The step-by-step mission deployment */}
        <Route path="/op-select-hunter" element={<Hunters viewOnly={false} />} />
        <Route path="/op-select-location" element={<Locations />} />
        <Route path="/op-authorize" element={<Authorize />} />

        {/* Catch-all to redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};