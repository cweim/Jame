import { User, JobApplication } from '../types';

const USER_KEY = 'jame_user_profile';
const APPLICATIONS_KEY = 'jame_applications';

export const saveUserProfile = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserProfile = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveApplication = (application: JobApplication): void => {
  const existing = getApplications();
  const updated = [...existing.filter(app => app.jobId !== application.jobId), application];
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
};

export const getApplications = (): JobApplication[] => {
  const stored = localStorage.getItem(APPLICATIONS_KEY);
  if (!stored) return [];
  
  const applications = JSON.parse(stored);
  return applications.map((app: any) => ({
    ...app,
    appliedAt: new Date(app.appliedAt)
  }));
};

export const getApplicationStatus = (jobId: string): JobApplication['status'] | null => {
  const applications = getApplications();
  const app = applications.find(app => app.jobId === jobId);
  return app ? app.status : null;
};