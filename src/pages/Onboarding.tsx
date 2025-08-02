import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { saveUserProfile } from '../utils/localStorage';

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    industries: [] as string[],
    jobType: 'full-time' as 'intern' | 'full-time' | 'part-time' | 'remote',
    preferredLocations: [] as string[],
  });
  const [resume, setResume] = useState<File | null>(null);

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Design', 'Consulting', 'Engineering', 'Sales', 'Operations'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
    'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Singapore', 
    'Kuala Lumpur, Malaysia', 'Remote'
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || formData.industries.length === 0 || formData.preferredLocations.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...formData,
      resume
    };

    saveUserProfile(user);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Jame</h1>
          <p className="text-xl text-gray-600">Find your perfect job match</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Upload
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industries of Interest * (Select at least one)
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Locations * (Select at least one)
              </label>
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
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Finding Jobs
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;