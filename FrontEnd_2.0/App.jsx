import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FloatingDock from './components/FloatingDock'
import Dashboard from './pages/Dashboard'
import {
  EntityRegistry, LocationMap, ArtifactVault,
  SendOperation, OpsLog, Bloodlines,
  WeaknessIntel, HunterRoster,
} from './pages/stubs'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <FloatingDock />
        <main className="main-content">
          <Routes>
            <Route path="/"                 element={<Dashboard />} />
            <Route path="/entities"         element={<EntityRegistry />} />
            <Route path="/locations"        element={<LocationMap />} />
            <Route path="/artifacts"        element={<ArtifactVault />} />
            <Route path="/send-operation"   element={<SendOperation />} />
            <Route path="/ops-log"          element={<OpsLog />} />
            <Route path="/bloodlines"       element={<Bloodlines />} />
            <Route path="/weaknesses"       element={<WeaknessIntel />} />
            <Route path="/hunters"          element={<HunterRoster />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
