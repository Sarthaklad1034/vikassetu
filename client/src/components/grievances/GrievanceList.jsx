import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  Search,
  Filter,
  AlertCircle,
  Clock,
  MapPin,
  Tag,
  Plus,
  ChevronUp,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GrievanceList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });

  // Categories from the schema
  const categories = [
    'infrastructure',
    'public-services',
    'welfare-schemes',
    'corruption',
    'administration',
    'other'
  ];

  const priorities = ['urgent', 'high', 'medium', 'low'];
  const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];

  const fetchGrievances = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/grievances', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grievances');
      }

      const data = await response.json();
      setGrievances(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const filterGrievances = (grievance) => {
    return (
      (filters.status === 'all' || grievance.status === filters.status) &&
      (filters.priority === 'all' || grievance.priority === filters.priority) &&
      (filters.category === 'all' || grievance.category === filters.category) &&
      (grievance.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        grievance.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeRemaining = deadlineDate - now;

    if (timeRemaining <= 0) return 'SLA Breached';

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours remaining`;
    
    const days = Math.floor(hours / 24);
    return `${days} days remaining`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grievances</h1>
          <p className="text-gray-600">Track and manage citizen grievances</p>
        </div>
        <button
          onClick={() => navigate('/grievances/submit')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          <span>Submit Grievance</span>
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search grievances..."
            className="pl-10 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <select
          className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="all">All Priorities</option>
          {priorities.map(priority => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Grievance List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grievances.filter(filterGrievances).map((grievance) => (
            <Card key={grievance._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <a 
                        href={`/grievances/${grievance._id}`}
                        className="hover:text-primary"
                      >
                        {grievance.title}
                      </a>
                    </h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(grievance.priority)}`}>
                        {grievance.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grievance.status)}`}>
                        {grievance.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {grievance.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Tag className="h-4 w-4" />
                      <span>{grievance.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{grievance.location.address.village}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className={`text-sm ${
                        grievance.sla.isBreached ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formatTimeRemaining(grievance.sla.deadline)}
                      </span>
                    </div>
                    {grievance.sla.isBreached && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrievanceList;