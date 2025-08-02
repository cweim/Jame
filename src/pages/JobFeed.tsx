import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { Job } from '../types';
import { getJobs, mockJobs } from '../services/mockData';
import { fetchJobsFromGitHub } from '../services/githubJobScraper';
import { saveApplication, getApplicationStatus } from '../utils/localStorage';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import Navigation from '../components/Navigation';

const JobFeed = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const allJobs = await getJobs();
      const filteredJobs = allJobs.filter(job => !getApplicationStatus(job.id));
      setJobs(filteredJobs);
      setCurrentJobIndex(0);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      // Fallback to mock jobs
      const filteredJobs = mockJobs.filter(job => !getApplicationStatus(job.id));
      setJobs(filteredJobs);
    } finally {
      setIsLoading(false);
    }
  };

  const syncFromGitHub = async () => {
    setIsSyncing(true);
    try {
      const githubJobs = await fetchJobsFromGitHub();
      if (githubJobs && githubJobs.length > 0) {
        const filteredJobs = githubJobs.filter(job => !getApplicationStatus(job.id));
        setJobs(filteredJobs);
        setCurrentJobIndex(0);
        alert(`✅ Synced ${githubJobs.length} fresh jobs from GitHub!`);
      } else {
        alert('⚠️ No jobs found on GitHub. Using cached data.');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      alert('❌ Failed to sync from GitHub. Check your connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSwipe = async (direction: 'left' | 'right', jobId: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    // Wait for animation to complete
    setTimeout(() => {
      const status = direction === 'right' ? 'interested' : 'not_interested';
      
      saveApplication({
        jobId,
        status,
        appliedAt: new Date()
      });

      setCurrentJobIndex(prev => prev + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 400); // Animation duration
  };

  const handleDragEnd = (event: any, info: PanInfo, job: Job) => {
    const threshold = 80;
    const { offset, velocity } = info;
    const swipeThreshold = Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500;

    if (swipeThreshold) {
      if (offset.x > 0) {
        handleSwipe('right', job.id);
      } else {
        handleSwipe('left', job.id);
      }
    }
  };


  const currentJob = jobs[currentJobIndex];

  if (currentJobIndex >= jobs.length) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 You've seen all available jobs!
            </h2>
            <p className="text-gray-600 mb-6">
              New opportunities are added daily. Check back soon or review your applications.
            </p>
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Your Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4">
        {/* Header with Sync Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <p className="text-sm text-gray-600 mb-1">
              👈 Swipe left to pass • Swipe right if interested 👉
            </p>
            {isAnimating && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-medium"
                style={{
                  color: swipeDirection === 'right' ? '#22c55e' : '#ef4444'
                }}
              >
                {swipeDirection === 'right' ? '✨ Added to interested!' : '😐 Passed on this one'}
              </motion.p>
            )}
            <p className="text-xs text-gray-500">
              {currentJobIndex + 1} of {jobs.length} opportunities
            </p>
          </div>
          <button
            onClick={syncFromGitHub}
            disabled={isSyncing}
            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 ml-4"
          >
            {isSyncing ? '🔄' : '🔄 Sync'}
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-180px)]">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <p className="text-gray-600">Loading fresh jobs from GitHub...</p>
            </div>
          </div>
        ) : (
          /* Centered Full-Screen Card Container */
          <div className="flex justify-center items-center min-h-[calc(100vh-180px)]">
            <div className="relative w-full max-w-md px-2">
            {/* Background preview card */}
            {jobs[currentJobIndex + 1] && (
              <div className="absolute top-3 left-3 right-3 z-0 opacity-40 transform scale-95">
                <JobCard
                  job={jobs[currentJobIndex + 1]}
                  onReadMore={() => {}}
                  onApply={() => {}}
                  onIgnore={() => {}}
                  isPreview
                />
              </div>
            )}

            {/* Main current card */}
            <AnimatePresence mode="wait">
              {currentJob && (
                <motion.div
                  key={currentJob.id}
                  drag={!isAnimating ? "x" : false}
                  dragConstraints={{ left: -50, right: 50 }}
                  onDragEnd={(event, info) => handleDragEnd(event, info, currentJob)}
                  whileDrag={{ 
                    rotate: (info: any) => info.offset.x * 0.1,
                    scale: 1.02
                  }}
                  animate={swipeDirection ? {
                    x: swipeDirection === 'right' ? 400 : -400,
                    rotate: swipeDirection === 'right' ? 30 : -30,
                    opacity: 0,
                    scale: 0.8
                  } : {
                    x: 0,
                    rotate: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  initial={{
                    x: 0,
                    rotate: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    x: swipeDirection === 'right' ? 400 : -400,
                    rotate: swipeDirection === 'right' ? 30 : -30,
                    opacity: 0,
                    scale: 0.8
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  className="relative z-10 cursor-grab active:cursor-grabbing"
                  style={{
                    background: isAnimating && swipeDirection === 'right' ? 
                      'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))' :
                      isAnimating && swipeDirection === 'left' ?
                      'linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2))' :
                      'transparent',
                    borderRadius: '12px'
                  }}
                >
                  <JobCard
                    job={currentJob}
                    onReadMore={() => {
                      if (!isAnimating) {
                        setSelectedJob(currentJob);
                        setIsModalOpen(true);
                      }
                    }}
                    onApply={() => !isAnimating && handleSwipe('right', currentJob.id)}
                    onIgnore={() => !isAnimating && handleSwipe('left', currentJob.id)}
                  />
                  
                  {/* Swipe feedback overlay */}
                  {isAnimating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg"
                    >
                      <div className={`text-6xl ${
                        swipeDirection === 'right' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {swipeDirection === 'right' ? '👍' : '👎'}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        )}
      </div>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          onApply={() => {
            handleSwipe('right', selectedJob.id);
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default JobFeed;