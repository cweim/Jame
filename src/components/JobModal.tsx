import { Job } from '../types';

interface JobModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const JobModal = ({ job, isOpen, onClose, onApply }: JobModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{job.title}</h2>
              <p className="text-base text-gray-700 mb-1">{job.company}</p>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl ml-4 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {job.salary && (
              <p className="text-lg font-semibold text-green-600 mb-3">{job.salary}</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">📝 Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">✅ Requirements</h3>
            <div className="space-y-1">
              {job.requirements.map((req, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 text-xs">•</span>
                  <span className="text-gray-700 text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">🏢 About {job.company}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {job.companyDescription || `${job.company} is a leading company in the ${job.tags[0]?.toLowerCase() || 'technology'} space, committed to innovation and excellence.`}
            </p>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            📅 Posted {job.postedDate.toLocaleDateString()}
          </div>

          <div className="flex gap-2 pb-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              👎 Not Interested
            </button>
            <button
              onClick={onApply}
              className="flex-1 bg-blue-600 text-white py-3 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              ⭐ Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;