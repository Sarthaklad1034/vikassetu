import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProjectSubmission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 3,
    budget: {
      estimated: '',
    },
    timeline: {
      estimatedStart: '',
      estimatedCompletion: ''
    },
    location: {
      village: '',
      district: '',
      state: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    beneficiaries: {
      estimated: '',
      categories: []
    },
    documents: []
  });

  const categories = [
    'roads',
    'water-supply',
    'sanitation',
    'education',
    'healthcare',
    'agriculture',
    'other'
  ];

  const beneficiaryCategories = ['general', 'sc', 'st', 'obc', 'minority'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBeneficiaryCategories = (category) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: {
        ...prev.beneficiaries,
        categories: prev.beneficiaries.categories.includes(category)
          ? prev.beneficiaries.categories.filter(c => c !== category)
          : [...prev.beneficiaries.categories, category]
      }
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      title: file.name,
      file: file,
      uploadedAt: new Date()
    }));

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          formData.documents.forEach(doc => {
            formDataToSend.append('documents', doc.file);
          });
        } else if (typeof formData[key] === 'object') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to submit project');
      }

      const data = await response.json();
      navigate(`/projects/${data.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit New Project</h1>
        <p className="text-gray-600">Fill in the project details to submit for approval</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5].map(level => (
                    <option key={level} value={level}>
                      Priority {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Budget (₹)</label>
              <input
                type="number"
                name="budget.estimated"
                value={formData.budget.estimated}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Start Date</label>
                <input
                  type="date"
                  name="timeline.estimatedStart"
                  value={formData.timeline.estimatedStart}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Completion Date</label>
                <input
                  type="date"
                  name="timeline.estimatedCompletion"
                  value={formData.timeline.estimatedCompletion}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Village</label>
                <input
                  type="text"
                  name="location.village"
                  value={formData.location.village}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="text"
                  name="location.coordinates.latitude"
                  value={formData.location.coordinates.latitude}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="text"
                  name="location.coordinates.longitude"
                  value={formData.location.coordinates.longitude}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Number of Beneficiaries</label>
              <input
                type="number"
                name="beneficiaries.estimated"
                value={formData.beneficiaries.estimated}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiary Categories</label>
              <div className="flex flex-wrap gap-3">
                {beneficiaryCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleBeneficiaryCategories(category)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      formData.beneficiaries.categories.includes(category)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Documents</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary file:text-white
                  hover:file:cursor-pointer hover:file:bg-primary-dark"
              />
            </div>

            {formData.documents.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
                <ul className="space-y-2">
                  {formData.documents.map((doc, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Upload className="h-4 w-4" />
                      <span>{doc.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectSubmission;