import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import JobFeed from './pages/JobFeed';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import JobDetail from './pages/JobDetail';
import Settings from './pages/Settings';
import { getUserProfile } from './utils/localStorage';

function App() {
  const userProfile = getUserProfile();
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={userProfile ? <Navigate to="/feed" /> : <Navigate to="/onboarding" />} 
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/feed" element={<JobFeed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/job/:jobId" element={<JobDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
