import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { getUserProfile, saveUserProfile } from '../utils/localStorage';
import Navigation from '../components/Navigation';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    linkedIn: '',
    portfolio: '',
    industries: [] as string[],
    jobType: 'full-time' as 'intern' | 'full-time' | 'part-time' | 'remote',
    preferredLocations: [] as string[],
  });
  const [isEditing, setIsEditing] = useState(false);

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Design', 'Consulting', 'Engineering', 'Sales', 'Operations'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
    'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Singapore', 
    'Kuala Lumpur, Malaysia', 'Remote'
  ];

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setUser(profile);
      setFormData({
        email: profile.email,
        linkedIn: profile.linkedIn || '',
        portfolio: profile.portfolio || '',
        industries: profile.industries,
        jobType: profile.jobType,
        preferredLocations: profile.preferredLocations,
      });
    } else {
      navigate('/onboarding');
    }
  }, [navigate]);

  const handleIndustryToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location]
    }));
  };

  const handleSave = () => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      ...formData
    };

    saveUserProfile(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!user) return;
    
    setFormData({
      email: user.email,
      linkedIn: user.linkedIn || '',
      portfolio: user.portfolio || '',
      industries: user.industries,
      jobType: user.jobType,
      preferredLocations: user.preferredLocations,
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your profile and preferences</p>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  <p className="text-gray-900">{user.linkedIn || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                ) : (
                  <p className="text-gray-900">{user.portfolio || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900">
                    {user.resume ? user.resume.name : 'No resume uploaded'}
                  </span>
                  {isEditing && (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="text-sm text-gray-500"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="intern"
                        checked={formData.jobType === 'intern'}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value as 'intern' | 'full-time' | 'part-time' | 'remote' }))}
                        className="mr-2"
                      />
                      Internship
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="full-time"
                        checked={formData.jobType === 'full-time'}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value as 'intern' | 'full-time' | 'part-time' | 'remote' }))}
                        className="mr-2"
                      />
                      Full-time
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="part-time"
                        checked={formData.jobType === 'part-time'}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value as 'intern' | 'full-time' | 'part-time' | 'remote' }))}
                        className="mr-2"
                      />
                      Part-time
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="remote"
                        checked={formData.jobType === 'remote'}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value as 'intern' | 'full-time' | 'part-time' | 'remote' }))}
                        className="mr-2"
                      />
                      Remote
                    </label>
                  </div>
                ) : (
                  <p className="text-gray-900 capitalize">{user.jobType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industries of Interest
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {industries.map(industry => (
                      <label key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.industries.includes(industry)}
                          onChange={() => handleIndustryToggle(industry)}
                          className="mr-2"
                        />
                        {industry}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.industries.map(industry => (
                      <span
                        key={industry}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Locations
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {locations.map(location => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.preferredLocations.includes(location)}
                          onChange={() => handleLocationToggle(location)}
                          className="mr-2"
                        />
                        {location}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.preferredLocations.map(location => (
                      <span
                        key={location}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;