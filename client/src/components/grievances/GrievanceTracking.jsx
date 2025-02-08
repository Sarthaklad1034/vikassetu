import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  MessageCircle,
  AlertCircle,
  ArrowUpCircle,
  BarChart3,
  MapPin,
  Tag,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GrievanceTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [grievance, setGrievance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateComment, setUpdateComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGrievance = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/grievances/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grievance details');
      }

      const data = await response.json();
      setGrievance(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievance();
  }, [id]);

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Clock className="h-5 w-5 text-yellow-500" />,
      'in-progress': <BarChart3 className="h-5 w-5 text-blue-500" />,
      'resolved': <CheckCircle2 className="h-5 w-5 text-green-500" />,
      'rejected': <XCircle className="h-5 w-5 text-red-500" />
    };
    return icons[status] || <Clock className="h-5 w-5 text-gray-500" />;
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineIcon = (status) => {
    const icons = {
      'pending': Clock,
      'in-progress': BarChart3,
      'resolved': CheckCircle2,
      'rejected': XCircle,
      'escalated': ArrowUpCircle
    };
    const IconComponent = icons[status] || MessageCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!updateComment.trim()) {
      setError('Please add a comment for the status update');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/grievances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          comment: updateComment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update grievance status');
      }

      const data = await response.json();
      setGrievance(data.data);
      setUpdateComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!grievance) {
    return (
      <Alert className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Grievance not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{grievance.title}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(grievance.priority)}`}>
              {grievance.priority}
            </span>
            <div className="flex items-center space-x-2 text-gray-500">
              <Tag className="h-4 w-4" />
              <span>{grievance.category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>
                {`${grievance.location.address.village}, ${grievance.location.address.district}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {grievance.description}
              </p>
            </CardContent>
          </Card>

          {/* Attachments */}
          {grievance.attachments && grievance.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {grievance.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate">
                        Attachment {index + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {grievance.timeline.map((event, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTimelineIcon(event.status)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">
                          Status changed to {event.status}
                        </p>
                        <span className="text-sm text-gray-500">
                          {formatDate(event.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{event.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(grievance.status)}
                <span className="font-medium text-gray-900">
                  {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* SLA Status */}
          <Card>
            <CardHeader>
              <CardTitle>SLA Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Deadline</span>
                  <span className="font-medium">
                    {formatDate(grievance.sla.deadline)}
                  </span>
                </div>
                {grievance.sla.isBreached && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>SLA Breached</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          {grievance.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Sentiment</span>
                    <p className="font-medium">{grievance.aiAnalysis.sentiment}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Urgency Score</span>
                    <p className="font-medium">{(grievance.aiAnalysis.urgencyScore * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Update Status */}
          {user && (grievance.status !== 'resolved' && grievance.status !== 'rejected') && (
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    value={updateComment}
                    onChange={(e) => setUpdateComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  />
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleStatusUpdate('in-progress')}
                      disabled={isSubmitting || grievance.status === 'in-progress'}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('resolved')}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrievanceTracking;