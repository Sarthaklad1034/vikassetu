import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/common/PrivateRoute';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
// import PasswordReset from './components/auth/PasswordReset';

// Dashboard Components
import VillagerDashboard from './components/dashboard/VillagerDashboard';
import PanchayatDashboard from './components/dashboard/PanchayatDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Feature Components
import ProjectList from './components/projects/ProjectList';
import ProjectDetails from './components/projects/ProjectDetails';
import ProjectSubmission from './components/projects/ProjectSubmission';
import GrievanceList from './components/grievances/GrievanceList';
import GrievanceSubmission from './components/grievances/GrievanceSubmission';
import GrievanceTracking from './components/grievances/GrievanceTracking';
import CommunityForum from './components/community/CommunityForum';
import VotingSystem from './components/community/VotingSystem';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* <Route path="/reset-password" element={<PasswordReset />} /> */}

                  {/* Protected Routes - Dashboards */}
                  <Route path="/" element={<PrivateRoute />}>
                    <Route path="/villager-dashboard" element={<VillagerDashboard />} />
                    <Route path="/panchayat-dashboard" element={<PanchayatDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  </Route>

                  {/* Protected Routes - Features */}
                  <Route path="/" element={<PrivateRoute />}>
                    <Route path="/projects" element={<ProjectList />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/submit-project" element={<ProjectSubmission />} />
                    <Route path="/grievances" element={<GrievanceList />} />
                    <Route path="/submit-grievance" element={<GrievanceSubmission />} />
                    <Route path="/track-grievance/:id" element={<GrievanceTracking />} />
                    <Route path="/community-forum" element={<CommunityForum />} />
                    <Route path="/voting" element={<VotingSystem />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;