import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { 
  FileText, 
  AlertCircle, 
  Users, 
  BarChart2,
  Clock,
  Check,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PanchayatDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    projectStats: {
      total: 0,
      ongoing: 0,
      completed: 0,
      delayed: 0
    },
    grievanceStats: {
      total: 0,
      pending: 0,
      resolved: 0,
      critical: 0
    },
    budgetUtilization: [],
    pendingApprovals: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/panchayat/dashboard');
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await fetch(`/api/panchayat/approvals/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Refresh dashboard data
      const response = await fetch('/api/panchayat/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to update approval status');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
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
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Panchayat Dashboard
        </h1>
        <p className="text-gray-600">
          {user.village} Panchayat, {user.district} District
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Project Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.projectStats.total}</div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Ongoing: {dashboardData.projectStats.ongoing}</span>
              <span>Completed: {dashboardData.projectStats.completed}</span>
            </div>
          </CardContent>
        </Card>

        {/* Grievance Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grievances</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.grievanceStats.total}</div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Pending: {dashboardData.grievanceStats.pending}</span>
              <span>Critical: {dashboardData.grievanceStats.critical}</span>
            </div>
          </CardContent>
        </Card>

        {/* Budget Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.budgetUtilization}>
                  <Bar dataKey="amount" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingApprovals.length}</div>
            <p className="text-xs text-gray-500">Requires your attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.pendingApprovals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.type} • Submitted by {item.submittedBy}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproval(item.id, 'approved')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleApproval(item.id, 'rejected')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanchayatDashboard;