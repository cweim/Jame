import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Job, JobApplication } from '../types';
import { getApplications, saveApplication } from '../utils/localStorage';
import { getJobs, mockJobs } from '../services/mockData';
import Navigation from '../components/Navigation';

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'requirements' | 'company'>('details');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    if (!jobId) {
      navigate('/dashboard');
      return;
    }

    setIsLoading(true);
    try {
      const jobs = await getJobs();
      const allJobs = [...jobs, ...mockJobs];
      const foundJob = allJobs.find(j => j.id === jobId);
      
      if (!foundJob) {
        navigate('/dashboard');
        return;
      }

      setJob(foundJob);
      
      // Get application status
      const applications = getApplications();
      const existingApp = applications.find(app => app.jobId === jobId);
      setApplication(existingApp || null);
    } catch (error) {
      console.error('Failed to load job details:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (newStatus: 'applied' | 'interested') => {
    if (!job) return;

    const updatedApp: JobApplication = {
      jobId: job.id,
      status: newStatus,
      appliedAt: newStatus === 'applied' ? new Date() : (application?.appliedAt || new Date())
    };

    saveApplication(updatedApp);
    setApplication(updatedApp);
  };

  const handleApplyAtCompany = () => {
    if (!job) return;

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(job.company + ' careers jobs')}`;
    window.open(searchUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <Navigation />
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <Navigation />
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Job not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'details' as const, label: 'Details', icon: '📝' },
    { key: 'requirements' as const, label: 'Requirements', icon: '✅' },
    { key: 'company' as const, label: 'Company', icon: '🏢' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Track
          </button>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-lg text-gray-700 mb-1">{job.company}</p>
                <p className="text-gray-600">{job.location}</p>
                {job.salary && (
                  <p className="text-green-600 font-semibold mt-2 text-lg">{job.salary}</p>
                )}
              </div>
              
              {application && (
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    application.status === 'applied' 
                      ? 'bg-green-100 text-green-800'
                      : application.status === 'interested'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {application.status === 'not_interested' ? 'Not Interested' : 
                     application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {application.appliedAt.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Job Type:</span>
                      <p className="text-gray-900 capitalize">{job.type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Posted:</span>
                      <p className="text-gray-900">{job.postedDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements Tab */}
            {activeTab === 'requirements' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Requirements</h3>
                <div className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-500 mr-3 text-lg flex-shrink-0">•</span>
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company}</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {job.companyDescription || `${job.company} is a leading company in the ${job.tags[0]?.toLowerCase() || 'technology'} space, committed to innovation and excellence.`}
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Industry:</span>
                      <p className="text-gray-900">{job.tags[0] || 'Technology'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Location:</span>
                      <p className="text-gray-900">{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {(!application || application.status === 'interested') && (
              <>
                <button
                  onClick={handleApplyAtCompany}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  🚀 Apply at Company
                </button>
                <button
                  onClick={() => handleStatusChange('applied')}
                  className="bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
                >
                  ✅ Mark as Applied
                </button>
              </>
            )}
            
            {application?.status === 'applied' && (
              <button
                onClick={() => handleStatusChange('interested')}
                className="bg-yellow-100 text-yellow-700 py-3 px-4 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
              >
                ↩️ Mark as Interested
              </button>
            )}

            {(!application || application.status !== 'interested') && (
              <button
                onClick={() => handleStatusChange('interested')}
                className="bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors"
              >
                ⭐ Mark as Interested
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;