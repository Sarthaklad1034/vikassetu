import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useGeoLocation from '../../hooks/useGeoLocation';
import { 
  Upload,
  MapPin,
  AlertCircle,
  Send,
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

const GrievanceSubmission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location: geoLocation, error: geoError } = useGeoLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: {
      type: 'Point',
      coordinates: [],
      address: {
        village: '',
        district: '',
        state: '',
        pincode: ''
      }
    },
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  // Categories from the schema
  const categories = [
    'infrastructure',
    'public-services',
    'welfare-schemes',
    'corruption',
    'administration',
    'other'
  ];

  useEffect(() => {
    if (geoLocation) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: [geoLocation.longitude, geoLocation.latitude]
        }
      }));
    }
  }, [geoLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: {
            ...prev.location.address,
            [addressField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const uploadFiles = async () => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('File upload failed');
      const data = await response.json();
      return data.fileUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Upload files first if any
      const fileUrls = files.length > 0 ? await uploadFiles() : [];

      // Prepare the submission data
      const submissionData = {
        ...formData,
        attachments: fileUrls.map(fileUrl => ({
          type: 'image',
          fileUrl
        }))
      };

      // Submit the grievance
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit grievance');
      }

      const data = await response.json();
      navigate(`/grievances/${data.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit Grievance</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                placeholder="Brief title of your grievance"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                maxLength={1000}
                rows={4}
                className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                placeholder="Detailed description of your grievance"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700">
                Location Details <span className="text-red-500">*</span>
              </h3>
              
              {geoError && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Unable to get your location automatically. Please enter manually.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.village"
                  value={formData.location.address.village}
                  onChange={handleInputChange}
                  required
                  placeholder="Village/Town"
                  className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                />
                <input
                  type="text"
                  name="address.district"
                  value={formData.location.address.district}
                  onChange={handleInputChange}
                  required
                  placeholder="District"
                  className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.location.address.state}
                  onChange={handleInputChange}
                  required
                  placeholder="State"
                  className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                />
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.location.address.pincode}
                  onChange={handleInputChange}
                  required
                  placeholder="Pincode"
                  className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* File Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Attachments (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark">
                      <span>Upload files</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </div>
              </div>
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/grievances')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>Submit Grievance</span>
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default GrievanceSubmission;