import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobApplication, Job } from '../types';
import { getApplications, saveApplication } from '../utils/localStorage';
import { getJobs, mockJobs } from '../services/mockData';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'applied' | 'interested' | 'not_interested'>('interested');
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    setApplications(getApplications());
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const jobs = await getJobs();
      setAllJobs(jobs);
    } catch (error) {
      console.error('Failed to load jobs in dashboard:', error);
      setAllJobs(mockJobs);
    }
  };

  const refreshApplications = () => {
    setApplications(getApplications());
  };

  const getJobById = (jobId: string): Job | undefined => {
    return allJobs.find(job => job.id === jobId) || mockJobs.find(job => job.id === jobId);
  };

  const handleStatusChange = (jobId: string, newStatus: 'applied' | 'interested') => {
    const existingApp = applications.find(app => app.jobId === jobId);
    if (existingApp) {
      saveApplication({
        ...existingApp,
        status: newStatus,
        appliedAt: newStatus === 'applied' ? new Date() : existingApp.appliedAt
      });
      refreshApplications();
    }
  };

  const handleApplyAtCompany = (jobId: string, companyName: string) => {
    // Open company website in new tab
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName + ' careers jobs')}`;
    window.open(searchUrl, '_blank');
    
    // Don't auto-mark as applied - let user do it manually
  };

  const filteredApplications = applications.filter(app => app.status === activeTab);

  const stats = {
    applied: applications.filter(app => app.status === 'applied').length,
    interested: applications.filter(app => app.status === 'interested').length,
    not_interested: applications.filter(app => app.status === 'not_interested').length,
  };

  const tabs = [
    { key: 'interested' as const, label: 'Interested', count: stats.interested, color: 'blue' },
    { key: 'applied' as const, label: 'Applied', count: stats.applied, color: 'green' },
    { key: 'not_interested' as const, label: 'Not Interested', count: stats.not_interested, color: 'red' },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-background)' }}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-title-large mb-2" style={{ color: 'var(--color-text-primary)' }}>Job Tracker</h1>
          <p className="text-body-medium" style={{ color: 'var(--color-text-secondary)' }}>Manage your job interests and track applications</p>
        </div>


        <div className="card mb-6 animate-fade-in">
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-body-medium transition-all ${
                      isActive
                        ? 'border-current'
                        : 'border-transparent hover:border-current'
                    }`}
                    style={{
                      color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      borderColor: isActive ? 'var(--color-primary)' : 'transparent'
                    }}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="spacing-lg">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-heading-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>No {activeTab} jobs yet</p>
                <p className="text-body-medium" style={{ color: 'var(--color-text-muted)' }}>
                  {activeTab === 'applied' && 'Jobs you\'ve applied to will appear here'}
                  {activeTab === 'interested' && 'Jobs you\'re interested in will appear here'}
                  {activeTab === 'not_interested' && 'Jobs you passed on will appear here'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application, index) => {
                  const job = getJobById(application.jobId);
                  if (!job) return null;

                  const getStatusStyle = (status: string) => {
                    switch (status) {
                      case 'applied':
                        return { background: 'var(--color-accent-green)', color: 'white' };
                      case 'interested':
                        return { background: 'var(--color-primary-light)', color: 'var(--color-primary)' };
                      default:
                        return { background: 'var(--color-accent-red)', color: 'white' };
                    }
                  };

                  return (
                    <div key={application.jobId} className="card spacing-md animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {job.company.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-heading-medium" style={{ color: 'var(--color-text-primary)' }}>{job.title}</h3>
                              <p className="text-body-medium" style={{ color: 'var(--color-text-secondary)' }}>{job.company}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-body-small mb-3" style={{ color: 'var(--color-text-muted)' }}>
                            <span className="flex items-center gap-1">📍 {job.location}</span>
                            <span className="flex items-center gap-1">🕒 {application.appliedAt.toLocaleDateString()}</span>
                          </div>
                          
                          {job.salary && (
                            <p className="text-body-medium font-semibold mb-3" style={{ color: 'var(--color-accent-green)' }}>💰 {job.salary}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {job.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="chip chip-default">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span 
                            className="chip text-caption font-semibold"
                            style={getStatusStyle(application.status)}
                          >
                            {application.status === 'not_interested' ? 'Not Interested' : 
                             application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <Link
                          to={`/job/${application.jobId}`}
                          className="btn-secondary flex items-center justify-center gap-2 text-center"
                        >
                          <span>👁️</span>
                          <span>View Details</span>
                        </Link>
                        
                        {application.status === 'interested' && (
                          <>
                            <button
                              onClick={() => handleApplyAtCompany(application.jobId, job.company)}
                              className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                              <span>🚀</span>
                              <span>Apply at Company</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(application.jobId, 'applied')}
                              className="btn-secondary flex items-center justify-center gap-2"
                              style={{ 
                                background: 'var(--color-accent-green)', 
                                color: 'white',
                                borderColor: 'var(--color-accent-green)'
                              }}
                            >
                              <span>✅</span>
                              <span>Mark Applied</span>
                            </button>
                          </>
                        )}
                        
                        {application.status === 'applied' && (
                          <button
                            onClick={() => handleStatusChange(application.jobId, 'interested')}
                            className="btn-secondary flex items-center justify-center gap-2"
                            style={{ 
                              background: 'var(--color-accent-yellow)', 
                              color: '#B8860B',
                              borderColor: 'var(--color-accent-yellow)'
                            }}
                          >
                            <span>↩️</span>
                            <span>Mark as Interested</span>
                          </button>
                        )}

                        {application.status === 'not_interested' && (
                          <button
                            onClick={() => handleStatusChange(application.jobId, 'interested')}
                            className="btn-secondary flex items-center justify-center gap-2"
                          >
                            <span>⭐</span>
                            <span>Mark as Interested</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;