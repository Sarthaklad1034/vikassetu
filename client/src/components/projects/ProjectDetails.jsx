import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart,
  MessageSquare,
  Image,
  Paperclip
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

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Mock progress data - replace with actual API data
  const progressData = [
    { month: 'Jan', progress: 20 },
    { month: 'Feb', progress: 45 },
    { month: 'Mar', progress: 65 },
    { month: 'Apr', progress: 80 }
  ];

  const fetchProjectDetails = async () => {
    try {
      // Replace with actual API call
      const mockProject = {
        id,
        title: 'Rural Road Development Phase 2',
        description: 'Construction and repair of connecting roads in village areas',
        status: 'IN_PROGRESS',
        progress: 80,
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        budget: 1500000,
        location: {
          village: 'Rampur',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          coordinates: { lat: 25.3176, lng: 82.9739 }
        },
        stakeholders: {
          projectManager: 'Rajesh Kumar',
          contractor: 'ABC Construction Ltd',
          supervisors: ['Amit Singh', 'Priya Verma']
        },
        milestones: [
          { title: 'Planning and Survey', status: 'COMPLETED', date: '2024-01-30' },
          { title: 'Foundation Work', status: 'COMPLETED', date: '2024-02-28' },
          { title: 'Road Construction', status: 'IN_PROGRESS', date: '2024-04-30' },
          { title: 'Quality Testing', status: 'PENDING', date: '2024-05-30' },
          { title: 'Project Completion', status: 'PENDING', date: '2024-06-30' }
        ],
        documents: [
          { name: 'Project Proposal.pdf', type: 'pdf', size: '2.5MB' },
          { name: 'Technical Specifications.doc', type: 'doc', size: '1.8MB' },
          { name: 'Site Photos.zip', type: 'zip', size: '15MB' }
        ],
        updates: [
          { date: '2024-04-01', content: 'Road construction phase started', author: 'Amit Singh' },
          { date: '2024-03-15', content: 'Foundation work completed', author: 'Priya Verma' }
        ]
      };
      setProject(mockProject);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load project details');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      content: newComment,
      author: user.name,
      timestamp: new Date(),
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

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
      {/* Project Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location.village}, {project.location.district}
            </span>
            <span className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
            Edit Project
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Generate Report
          </button>
        </div>
      </div>

      {/* Project Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'milestones', 'documents', 'updates', 'comments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Project Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center">
                      <BarChart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Progress</p>
                      <p className="text-lg font-semibold">{project.progress}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="text-lg font-semibold">₹{project.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Team Members</p>
                      <p className="text-lg font-semibold">{project.stakeholders.supervisors.length + 2}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="progress" stroke="#10B981" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'milestones' && (
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {milestone.status === 'COMPLETED' ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : milestone.status === 'IN_PROGRESS' ? (
                        <Clock className="h-6 w-6 text-blue-500" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(milestone.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          milestone.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : milestone.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Paperclip className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm text-primary hover:text-primary-dark">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'updates' && (
          <Card>
            <CardHeader>
              <CardTitle>Project Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.updates.map((update, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{update.content}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Posted by {update.author}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'comments' && (
          <Card>
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="Add a comment..."
                  rows="3"
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Post Comment
                </button>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{comment.author}</p>
                      <span className="text-sm text-gray-500">
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;