import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  MapPin, 
  Users,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  const fetchProjects = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filterProjects = (project) => {
    return (
      (filters.status === 'all' || project.status === filters.status) &&
      (filters.category === 'all' || project.category === filters.category) &&
      (project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-red-100 text-red-800',
      'approved': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage and track all development projects</p>
        </div>
        {user.role !== 'VILLAGER' && (
          <a 
            href="/projects/new" 
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </a>
        )}
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search projects..."
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
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <select
          className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="education">Education</option>
          <option value="healthcare">Healthcare</option>
          <option value="agriculture">Agriculture</option>
        </select>
      </div>

      {/* Project Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.filter(filterProjects).map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <a href={`/projects/${project.id}`} className="hover:text-primary">
                        {project.title}
                      </a>
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{project.beneficiaries} beneficiaries</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{project.duration} months</span>
                    </div>
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

export default ProjectList;