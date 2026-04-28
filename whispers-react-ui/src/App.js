import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './homepage'; // New import
import Hunters from './hunters';
import Locations from './locations';
import Authorize from './authorize';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/hunters" element={<Hunters />} />
          <Route path="/location" element={<Locations />} />
          <Route path="/authorize" element={<Authorize />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;