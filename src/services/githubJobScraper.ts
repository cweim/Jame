import { Job } from '../types';

const GITHUB_API_URL = 'https://api.github.com/repos/speedyapply/2026-SWE-College-Jobs/contents';

interface GitHubFile {
  name: string;
  download_url: string;
  content?: string;
}

export interface ParsedJobEntry {
  company: string;
  position: string;
  location: string;
  salary?: string;
  link: string;
  age?: string;
}

// Parse markdown table rows into job objects
const parseMarkdownTable = (content: string): ParsedJobEntry[] => {
  const jobs: ParsedJobEntry[] = [];
  const lines = content.split('\n');
  
  let inTable = false;
  let headerParsed = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if we're starting a table
    if (trimmedLine.startsWith('|') && trimmedLine.includes('Company')) {
      inTable = true;
      headerParsed = false;
      continue;
    }
    
    // Skip header separator line
    if (inTable && !headerParsed && trimmedLine.includes('---')) {
      headerParsed = true;
      continue;
    }
    
    // Parse job data rows
    if (inTable && headerParsed && trimmedLine.startsWith('|')) {
      const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell);
      
      if (cells.length >= 4) {
        // Extract company name (remove markdown links if present)
        const company = cells[0].replace(/\[([^\]]+)\].*/, '$1').trim();
        
        // Extract position (remove markdown links if present)
        const position = cells[1].replace(/\[([^\]]+)\].*/, '$1').trim();
        
        // Location
        const location = cells[2].trim();
        
        // Handle salary (might be in different columns)
        let salary = '';
        let link = '';
        let age = '';
        
        if (cells.length >= 5) {
          // Check if cell looks like salary (contains $ or numbers)
          if (cells[3].includes('$') || /\d+k/i.test(cells[3])) {
            salary = cells[3].trim();
            link = cells[4]?.replace(/\[.*\]\((.*)\)/, '$1').trim() || '';
            age = cells[5]?.trim() || '';
          } else {
            link = cells[3]?.replace(/\[.*\]\((.*)\)/, '$1').trim() || '';
            age = cells[4]?.trim() || '';
          }
        } else {
          link = cells[3]?.replace(/\[.*\]\((.*)\)/, '$1').trim() || '';
        }
        
        // Only add valid jobs
        if (company && position && company !== 'Company' && position !== 'Position') {
          jobs.push({
            company,
            position,
            location,
            salary: salary || undefined,
            link,
            age
          });
        }
      }
    }
    
    // Stop if we hit a non-table line after being in a table
    if (inTable && headerParsed && !trimmedLine.startsWith('|') && trimmedLine !== '') {
      inTable = false;
      headerParsed = false;
    }
  }
  
  return jobs;
};

// Fallback descriptions for different job types
const getJobDescription = (company: string, position: string, isIntern: boolean): string => {
  const descriptions = [
    `Join ${company} and work on innovative software solutions that impact millions of users. You'll collaborate with experienced engineers, contribute to high-quality code, and learn cutting-edge technologies in a fast-paced environment.`,
    
    `${company} is looking for talented ${isIntern ? 'interns' : 'engineers'} to join our dynamic team. You'll work on scalable systems, participate in code reviews, and contribute to products that shape the future of technology.`,
    
    `Be part of ${company}'s mission to revolutionize the industry through technology. This role offers hands-on experience with modern development practices, mentorship from senior engineers, and the opportunity to make a real impact.`,
    
    `${company} offers an exciting opportunity to work on challenging problems with a team of passionate engineers. You'll develop your skills in software engineering while contributing to products used by thousands of customers.`,
    
    `Join ${company} and help build the next generation of software products. You'll work in an agile environment, collaborate with cross-functional teams, and gain valuable experience in enterprise-level software development.`
  ];
  
  // Rotate through descriptions based on company name for variety
  const index = company.length % descriptions.length;
  return descriptions[index];
};

// Fallback company descriptions
const getCompanyDescription = (company: string, primaryTag: string): string => {
  const companyTypes = [
    'innovative technology company',
    'leading software company',
    'fast-growing startup',
    'established tech leader',
    'cutting-edge technology firm'
  ];
  
  const descriptions = [
    `${company} is an ${companyTypes[company.length % companyTypes.length]} focused on delivering exceptional software solutions. We're committed to fostering innovation, supporting our team's growth, and creating products that make a difference.`,
    
    `At ${company}, we believe in the power of technology to transform industries. Our team of talented engineers works on challenging problems while maintaining a culture of collaboration, learning, and excellence.`,
    
    `${company} combines technical excellence with a mission-driven approach to software development. We offer a supportive environment where engineers can grow their skills and contribute to meaningful projects.`,
    
    `Join ${company} and be part of a company that values innovation, quality, and teamwork. We're building the future of technology while providing our team with opportunities for professional development and career growth.`,
    
    `${company} is dedicated to creating world-class software products through cutting-edge technology and engineering best practices. We foster an inclusive environment where creativity and technical excellence thrive.`
  ];
  
  const index = (company.length + primaryTag.length) % descriptions.length;
  return descriptions[index];
};

// Enhanced requirements based on job type and level
const getJobRequirements = (position: string, isIntern: boolean): string[] => {
  const baseRequirements = [];
  
  if (isIntern) {
    baseRequirements.push(
      'Currently pursuing a degree in Computer Science, Engineering, or related field',
      'Strong programming fundamentals in one or more languages',
      'Passion for learning new technologies and solving complex problems',
      'Excellent communication and teamwork skills'
    );
  } else {
    baseRequirements.push(
      'Bachelor\'s degree in Computer Science, Engineering, or equivalent experience',
      'Strong programming skills in modern languages (Python, Java, JavaScript, etc.)',
      '0-2 years of professional software development experience',
      'Understanding of software engineering best practices'
    );
  }
  
  // Add role-specific requirements
  if (/frontend|front.end|ui|react/i.test(position)) {
    baseRequirements.push('Experience with modern frontend frameworks (React, Angular, Vue)');
    baseRequirements.push('Knowledge of HTML, CSS, and JavaScript');
  } else if (/backend|back.end|api|server/i.test(position)) {
    baseRequirements.push('Experience with backend technologies and databases');
    baseRequirements.push('Understanding of RESTful APIs and microservices');
  } else if (/full.?stack/i.test(position)) {
    baseRequirements.push('Experience with both frontend and backend technologies');
    baseRequirements.push('Knowledge of web development best practices');
  } else if (/mobile|ios|android/i.test(position)) {
    baseRequirements.push('Experience with mobile development frameworks');
    baseRequirements.push('Understanding of mobile app design principles');
  } else {
    baseRequirements.push('Experience with relevant programming languages and frameworks');
    baseRequirements.push('Strong problem-solving and analytical skills');
  }
  
  return baseRequirements;
};

// Convert parsed jobs to our Job interface
const convertToJobFormat = (parsedJobs: ParsedJobEntry[]): Job[] => {
  return parsedJobs.map((parsedJob, index) => {
    // Determine job type from position title
    const isIntern = /intern|internship/i.test(parsedJob.position);
    
    // Generate tags based on company and position
    const tags = [];
    if (isIntern) tags.push('Internship');
    else tags.push('New Grad');
    
    if (/software|swe|engineer/i.test(parsedJob.position)) tags.push('Software Engineering');
    if (/full.?stack/i.test(parsedJob.position)) tags.push('Full-stack');
    if (/frontend|front.end|ui|react/i.test(parsedJob.position)) tags.push('Frontend');
    if (/backend|back.end|api|server/i.test(parsedJob.position)) tags.push('Backend');
    if (/mobile|ios|android/i.test(parsedJob.position)) tags.push('Mobile');
    if (/data|analytics/i.test(parsedJob.position)) tags.push('Data');
    if (/remote/i.test(parsedJob.location)) tags.push('Remote');
    if (/machine.learning|ml|ai/i.test(parsedJob.position)) tags.push('AI/ML');
    
    return {
      id: `github-${index}-${Date.now()}`,
      title: parsedJob.position,
      company: parsedJob.company,
      location: parsedJob.location,
      type: isIntern ? 'intern' : 'full-time',
      description: getJobDescription(parsedJob.company, parsedJob.position, isIntern),
      requirements: getJobRequirements(parsedJob.position, isIntern),
      tags,
      salary: parsedJob.salary,
      postedDate: new Date(), // Use current date as we don't have exact posting dates
      companyDescription: getCompanyDescription(parsedJob.company, tags[0] || 'technology')
    } as Job;
  });
};

// Fetch jobs from specific markdown file
const fetchJobsFromFile = async (filename: string): Promise<Job[]> => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
    }
    
    const fileData = await response.json();
    const content = atob(fileData.content);
    
    const parsedJobs = parseMarkdownTable(content);
    return convertToJobFormat(parsedJobs);
  } catch (error) {
    console.error(`Error fetching jobs from ${filename}:`, error);
    return [];
  }
};

// Main function to fetch all jobs from GitHub
export const fetchJobsFromGitHub = async (): Promise<Job[]> => {
  const filesToFetch = [
    'README.md',
    'NEW_GRAD_USA.md',
    // 'INTERN_INTL.md',
    // 'NEW_GRAD_INTL.md'
  ];
  
  console.log('🔄 Fetching jobs from GitHub...');
  
  try {
    const allJobsPromises = filesToFetch.map(filename => fetchJobsFromFile(filename));
    const allJobsArrays = await Promise.all(allJobsPromises);
    
    // Flatten all job arrays into one
    const allJobs = allJobsArrays.flat();
    
    // Remove duplicates based on company + position
    const uniqueJobs = allJobs.filter((job, index, self) => 
      index === self.findIndex(j => j.company === job.company && j.title === job.title)
    );
    
    console.log(`✅ Successfully fetched ${uniqueJobs.length} jobs from GitHub`);
    return uniqueJobs;
    
  } catch (error) {
    console.error('❌ Failed to fetch jobs from GitHub:', error);
    return [];
  }
};

// Cache jobs in localStorage with timestamp
const CACHE_KEY = 'github_jobs_cache';
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export const getCachedJobs = (): Job[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { jobs, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      console.log('📦 Using cached GitHub jobs');
      return jobs.map((job: any) => ({
        ...job,
        postedDate: new Date(job.postedDate)
      }));
    } else {
      console.log('⏰ GitHub jobs cache expired');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  } catch (error) {
    console.error('Error reading GitHub jobs cache:', error);
    return null;
  }
};

export const cacheJobs = (jobs: Job[]): void => {
  try {
    const cacheData = {
      jobs,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cached GitHub jobs');
  } catch (error) {
    console.error('Error caching GitHub jobs:', error);
  }
};

// Main function with caching
export const getJobsFromGitHub = async (): Promise<Job[]> => {
  // Try to get from cache first
  const cachedJobs = getCachedJobs();
  if (cachedJobs && cachedJobs.length > 0) {
    return cachedJobs;
  }
  
  // Fetch fresh data if no cache
  const freshJobs = await fetchJobsFromGitHub();
  if (freshJobs.length > 0) {
    cacheJobs(freshJobs);
  }
  
  return freshJobs;
};