export interface User {
  id: string;
  email: string;
  linkedIn?: string;
  portfolio?: string;
  resume?: File | null;
  industries: string[];
  jobType: 'intern' | 'full-time';
  preferredLocations: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'intern' | 'full-time';
  description: string;
  requirements: string[];
  tags: string[];
  salary?: string;
  logo?: string;
  postedDate: Date;
  companyDescription?: string;
}

export interface JobApplication {
  jobId: string;
  status: 'applied' | 'interested' | 'not_interested';
  appliedAt: Date;
}