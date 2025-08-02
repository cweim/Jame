import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onReadMore: () => void;
  onApply: () => void;
  onIgnore: () => void;
  isPreview?: boolean;
}

const getTagStyle = (tag: string) => {
  const tagLower = tag.toLowerCase();
  if (tagLower.includes('urgent') || tagLower.includes('hot')) {
    return 'chip chip-urgent';
  }
  if (tagLower.includes('intermediate') || tagLower.includes('mid')) {
    return 'chip chip-intermediate';
  }
  if (tagLower.includes('high') || tagLower.includes('senior')) {
    return 'chip chip-high-salary';
  }
  return 'chip chip-default';
};

const JobCard = ({ job, onReadMore, onApply, onIgnore, isPreview = false }: JobCardProps) => {
  return (
    <div className={`card card-elevated spacing-lg min-h-[520px] flex flex-col animate-fade-in ${isPreview ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex-1">
        {/* Company Badge */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">
                {job.company.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-body-medium font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {job.company}
              </p>
              <p className="text-body-small" style={{ color: 'var(--color-text-muted)' }}>
                🕒 {job.postedDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Job Title */}
        <div className="mb-4">
          <h2 className="text-heading-large mb-3" style={{ color: 'var(--color-text-primary)' }}>
            {job.title}
          </h2>
          <div className="flex items-center gap-4 text-body-small mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="flex items-center gap-1">
              📍 {job.location}
            </span>
            <span className="flex items-center gap-1">
              💼 {job.type === 'intern' ? 'Internship' : 'Full-time'}
            </span>
          </div>
          {job.salary && (
            <p className="text-body-medium font-semibold" style={{ color: 'var(--color-accent-green)' }}>
              💰 {job.salary}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={getTagStyle(tag)}>
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="chip chip-default">
                +{job.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-body-medium leading-relaxed" 
             style={{ 
               color: 'var(--color-text-secondary)',
               display: '-webkit-box',
               WebkitLineClamp: 4,
               WebkitBoxOrient: 'vertical',
               overflow: 'hidden'
             }}>
            {job.description}
          </p>
        </div>

        {/* Read More Link */}
        <button
          onClick={onReadMore}
          className="text-body-medium font-medium mb-6 flex items-center gap-1 hover:gap-2 transition-all"
          style={{ color: 'var(--color-primary)' }}
        >
          View Details
          <span className="text-sm">→</span>
        </button>
      </div>

      {/* Actions */}
      {!isPreview && (
        <div className="flex gap-3 mt-auto">
          <button
            onClick={onIgnore}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <span>👎</span>
            <span>Pass</span>
          </button>
          <button
            onClick={onApply}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <span>⭐</span>
            <span>Interested</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;