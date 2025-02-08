import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { 
  BarChart, 
  Users, 
  FileText, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Map,
  Settings
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeProjects: 0,
    pendingGrievances: 0,
    projectCompletion: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for charts - replace with actual API calls
  const projectTrends = [
    { month: 'Jan', completed: 45, ongoing: 30, planned: 25 },
    { month: 'Feb', completed: 50, ongoing: 35, planned: 20 },
    { month: 'Mar', completed: 55, ongoing: 32, planned: 28 },
    { month: 'Apr', completed: 60, ongoing: 38, planned: 22 },
  ];

  const fetchDashboardData = async () => {
    try {
      // Replace with actual API calls
      const mockData = {
        totalUsers: 1250,
        activeProjects: 45,
        pendingGrievances: 23,
        projectCompletion: 78,
        recentActivity: [
          { type: 'PROJECT_CREATED', description: 'New water project initiated in Village A', timestamp: new Date() },
          { type: 'GRIEVANCE_RESOLVED', description: 'Road maintenance issue resolved in District B', timestamp: new Date() },
          { type: 'USER_REGISTERED', description: '15 new users registered from Panchayat C', timestamp: new Date() }
        ]
      };
      setStatistics(mockData);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Here's what's happening across your jurisdiction</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <h3 className="text-2xl font-bold">{statistics.totalUsers.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-10 w-10 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <h3 className="text-2xl font-bold">{statistics.activeProjects}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-10 w-10 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Grievances</p>
                <h3 className="text-2xl font-bold">{statistics.pendingGrievances}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Activity className="h-10 w-10 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Project Completion</p>
                <h3 className="text-2xl font-bold">{statistics.projectCompletion}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#10B981" />
                  <Line type="monotone" dataKey="ongoing" stroke="#3B82F6" />
                  <Line type="monotone" dataKey="planned" stroke="#6B7280" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              Generate Reports
            </button>
            <button className="p-4 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              Manage Users
            </button>
            <button className="p-4 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              Review Projects
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;