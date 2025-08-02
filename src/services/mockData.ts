import { Job } from '../types';
import { getJobsFromGitHub } from './githubJobScraper';

// Keep some fallback mock jobs in case GitHub fails
const fallbackMockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'Join our team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies. You\'ll work on user-facing features that impact millions of users.',
    requirements: ['React', 'TypeScript', 'CSS', '2+ years experience'],
    tags: ['Remote', 'React', 'Frontend'],
    salary: '$80k - $120k',
    postedDate: new Date('2025-01-15')
  },
  {
    id: '2',
    title: 'Software Engineer Intern',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'intern',
    description: 'Get hands-on experience building full-stack applications in a fast-paced startup environment. Perfect opportunity to learn and grow your technical skills.',
    requirements: ['JavaScript', 'Node.js', 'Database knowledge'],
    tags: ['Internship', 'Full-stack', 'Learning'],
    salary: '$25/hour',
    postedDate: new Date('2025-01-14')
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Austin, TX',
    type: 'full-time',
    description: 'Create beautiful and intuitive user experiences for our digital products. Work closely with product managers and engineers to bring designs to life.',
    requirements: ['Figma', 'Adobe Creative Suite', 'User Research'],
    tags: ['Design', 'Remote', 'Creative'],
    salary: '$70k - $100k',
    postedDate: new Date('2025-01-13')
  },
  {
    id: '4',
    title: 'Backend Developer',
    company: 'DataFlow Inc',
    location: 'Seattle, WA',
    type: 'full-time',
    description: 'Build scalable APIs and microservices that power our data processing platform. Work with cutting-edge cloud technologies and big data.',
    requirements: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    tags: ['Backend', 'Python', 'Cloud'],
    salary: '$90k - $130k',
    postedDate: new Date('2025-01-12')
  },
  {
    id: '5',
    title: 'Product Manager Intern',
    company: 'InnovateLabs',
    location: 'Boston, MA',
    type: 'intern',
    description: 'Support product strategy and roadmap development while learning about product management in a tech environment.',
    requirements: ['Communication', 'Analytics', 'Project Management'],
    tags: ['Product', 'Strategy', 'Internship'],
    salary: '$30/hour',
    postedDate: new Date('2025-01-11')
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'Remote',
    type: 'full-time',
    description: 'Analyze large datasets to extract insights and build predictive models that drive business decisions.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    tags: ['Remote', 'AI', 'Data'],
    salary: '$100k - $140k',
    postedDate: new Date('2025-01-10')
  },
  {
    id: '7',
    title: 'Mobile Developer',
    company: 'AppMakers',
    location: 'Los Angeles, CA',
    type: 'full-time',
    description: 'Develop native iOS and Android applications using React Native and modern mobile development practices.',
    requirements: ['React Native', 'iOS', 'Android', 'JavaScript'],
    tags: ['Mobile', 'React Native', 'Apps'],
    salary: '$85k - $125k',
    postedDate: new Date('2025-01-09')
  },
  {
    id: '8',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Denver, CO',
    type: 'full-time',
    description: 'Manage cloud infrastructure and CI/CD pipelines to ensure reliable and scalable software deployment.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'Linux'],
    tags: ['DevOps', 'Cloud', 'Infrastructure'],
    salary: '$95k - $135k',
    postedDate: new Date('2025-01-08')
  },
  {
    id: '9',
    title: 'Marketing Intern',
    company: 'GrowthCo',
    location: 'Chicago, IL',
    type: 'intern',
    description: 'Join our marketing team to learn about digital marketing, content creation, and growth strategies.',
    requirements: ['Social Media', 'Content Writing', 'Analytics'],
    tags: ['Marketing', 'Growth', 'Internship'],
    salary: '$20/hour',
    postedDate: new Date('2025-01-07')
  },
  {
    id: '10',
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'Washington, DC',
    type: 'full-time',
    description: 'Protect our systems and data by monitoring security threats and implementing security measures.',
    requirements: ['Security Tools', 'Network Security', 'Incident Response'],
    tags: ['Security', 'Analytics', 'Protection'],
    salary: '$80k - $110k',
    postedDate: new Date('2025-01-06')
  },
  {
    id: '11',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Portland, OR',
    type: 'full-time',
    description: 'Work on both frontend and backend development for our e-commerce platform using modern web technologies.',
    requirements: ['React', 'Node.js', 'MongoDB', 'Express'],
    tags: ['Full-stack', 'E-commerce', 'Web'],
    salary: '$75k - $115k',
    postedDate: new Date('2025-01-05')
  },
  {
    id: '12',
    title: 'Graphic Designer',
    company: 'Creative Agency',
    location: 'Miami, FL',
    type: 'full-time',
    description: 'Create visual content for digital and print media including logos, websites, and marketing materials.',
    requirements: ['Adobe Creative Suite', 'Branding', 'Print Design'],
    tags: ['Design', 'Creative', 'Visual'],
    salary: '$50k - $70k',
    postedDate: new Date('2025-01-04')
  },
  {
    id: '13',
    title: 'QA Engineer',
    company: 'TestPro',
    location: 'Atlanta, GA',
    type: 'full-time',
    description: 'Ensure software quality through manual and automated testing of web and mobile applications.',
    requirements: ['Testing', 'Selenium', 'Test Automation', 'Bug Tracking'],
    tags: ['QA', 'Testing', 'Quality'],
    salary: '$65k - $90k',
    postedDate: new Date('2025-01-03')
  },
  {
    id: '14',
    title: 'Content Writer',
    company: 'ContentHub',
    location: 'Remote',
    type: 'full-time',
    description: 'Create engaging content for blogs, websites, and social media to drive audience engagement.',
    requirements: ['Writing', 'SEO', 'Content Strategy', 'Research'],
    tags: ['Content', 'Writing', 'Remote'],
    salary: '$45k - $65k',
    postedDate: new Date('2025-01-02')
  },
  {
    id: '15',
    title: 'Sales Representative',
    company: 'SalesForce Pro',
    location: 'Dallas, TX',
    type: 'full-time',
    description: 'Drive revenue growth by building relationships with clients and closing deals in the B2B software space.',
    requirements: ['Sales Experience', 'CRM', 'Communication', 'Negotiation'],
    tags: ['Sales', 'B2B', 'Revenue'],
    salary: '$60k - $100k + commission',
    postedDate: new Date('2025-01-01')
  },
  {
    id: '16',
    title: 'Data Analyst Intern',
    company: 'Analytics Plus',
    location: 'San Diego, CA',
    type: 'intern',
    description: 'Learn to analyze business data and create reports that help drive strategic decision making.',
    requirements: ['Excel', 'SQL', 'Data Visualization', 'Statistics'],
    tags: ['Data', 'Analytics', 'Internship'],
    salary: '$22/hour',
    postedDate: new Date('2024-12-31')
  },
  {
    id: '17',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'Build and deploy machine learning models to solve complex business problems at scale.',
    requirements: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
    tags: ['ML', 'AI', 'Python'],
    salary: '$120k - $160k',
    postedDate: new Date('2024-12-30')
  },
  {
    id: '18',
    title: 'Customer Success Manager',
    company: 'SaaS Solutions',
    location: 'Nashville, TN',
    type: 'full-time',
    description: 'Help customers achieve success with our software platform through onboarding, training, and support.',
    requirements: ['Customer Service', 'SaaS Experience', 'Communication'],
    tags: ['Customer Success', 'SaaS', 'Support'],
    salary: '$55k - $75k',
    postedDate: new Date('2024-12-29')
  },
  {
    id: '19',
    title: 'Cloud Architect',
    company: 'Enterprise Cloud',
    location: 'New York, NY',
    type: 'full-time',
    description: 'Design and implement cloud infrastructure solutions for enterprise clients using AWS and Azure.',
    requirements: ['AWS', 'Azure', 'Cloud Architecture', 'Enterprise Solutions'],
    tags: ['Cloud', 'Architecture', 'Enterprise'],
    salary: '$130k - $170k',
    postedDate: new Date('2024-12-28')
  },
  {
    id: '20',
    title: 'UX Researcher',
    company: 'User Insights',
    location: 'Seattle, WA',
    type: 'full-time',
    description: 'Conduct user research to inform product design decisions and improve user experience.',
    requirements: ['User Research', 'Usability Testing', 'Data Analysis'],
    tags: ['UX', 'Research', 'Users'],
    salary: '$75k - $105k',
    postedDate: new Date('2024-12-27')
  },
  {
    id: '21',
    title: 'Blockchain Developer',
    company: 'CryptoTech',
    location: 'Austin, TX',
    type: 'full-time',
    description: 'Develop decentralized applications and smart contracts using blockchain technologies.',
    requirements: ['Solidity', 'Ethereum', 'Web3', 'Smart Contracts'],
    tags: ['Blockchain', 'Crypto', 'Web3'],
    salary: '$100k - $140k',
    postedDate: new Date('2024-12-26')
  },
  {
    id: '22',
    title: 'HR Intern',
    company: 'People First',
    location: 'Phoenix, AZ',
    type: 'intern',
    description: 'Support HR operations including recruiting, onboarding, and employee engagement initiatives.',
    requirements: ['Communication', 'Organization', 'MS Office'],
    tags: ['HR', 'People', 'Internship'],
    salary: '$18/hour',
    postedDate: new Date('2024-12-25')
  },
  {
    id: '23',
    title: 'Video Editor',
    company: 'Media Productions',
    location: 'Los Angeles, CA',
    type: 'full-time',
    description: 'Edit video content for social media, marketing campaigns, and corporate communications.',
    requirements: ['Adobe Premiere', 'After Effects', 'Video Editing'],
    tags: ['Video', 'Media', 'Creative'],
    salary: '$55k - $75k',
    postedDate: new Date('2024-12-24')
  },
  {
    id: '24',
    title: 'Business Analyst',
    company: 'Consulting Group',
    location: 'Boston, MA',
    type: 'full-time',
    description: 'Analyze business processes and requirements to help organizations improve efficiency and performance.',
    requirements: ['Business Analysis', 'Process Improvement', 'Documentation'],
    tags: ['Business', 'Analysis', 'Consulting'],
    salary: '$70k - $95k',
    postedDate: new Date('2024-12-23')
  },
  {
    id: '25',
    title: 'iOS Developer',
    company: 'Mobile First',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'Build native iOS applications using Swift and modern iOS development frameworks.',
    requirements: ['Swift', 'iOS SDK', 'Xcode', 'App Store'],
    tags: ['iOS', 'Mobile', 'Swift'],
    salary: '$90k - $130k',
    postedDate: new Date('2024-12-22')
  },
  {
    id: '26',
    title: 'Digital Marketing Specialist',
    company: 'Marketing Pro',
    location: 'Remote',
    type: 'full-time',
    description: 'Manage digital marketing campaigns across multiple channels to drive brand awareness and lead generation.',
    requirements: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics'],
    tags: ['Marketing', 'Digital', 'Remote'],
    salary: '$50k - $70k',
    postedDate: new Date('2024-12-21')
  },
  {
    id: '27',
    title: 'Network Engineer',
    company: 'NetSolutions',
    location: 'Chicago, IL',
    type: 'full-time',
    description: 'Design, implement, and maintain network infrastructure for enterprise clients.',
    requirements: ['Networking', 'Cisco', 'Network Security', 'Troubleshooting'],
    tags: ['Network', 'Infrastructure', 'Enterprise'],
    salary: '$75k - $105k',
    postedDate: new Date('2024-12-20')
  },
  {
    id: '28',
    title: 'Game Developer',
    company: 'GameStudio',
    location: 'Remote',
    type: 'full-time',
    description: 'Create engaging mobile and PC games using Unity and C# in a collaborative development environment.',
    requirements: ['Unity', 'C#', 'Game Design', 'Mobile Games'],
    tags: ['Gaming', 'Unity', 'Remote'],
    salary: '$70k - $100k',
    postedDate: new Date('2024-12-19')
  },
  {
    id: '29',
    title: 'Financial Analyst',
    company: 'Finance Corp',
    location: 'New York, NY',
    type: 'full-time',
    description: 'Analyze financial data and create reports to support investment and business decisions.',
    requirements: ['Financial Modeling', 'Excel', 'Accounting', 'Analysis'],
    tags: ['Finance', 'Analysis', 'Investment'],
    salary: '$65k - $90k',
    postedDate: new Date('2024-12-18')
  },
  {
    id: '30',
    title: 'Technical Writer',
    company: 'DocuTech',
    location: 'Austin, TX',
    type: 'full-time',
    description: 'Create clear and comprehensive technical documentation for software products and APIs.',
    requirements: ['Technical Writing', 'API Documentation', 'Markdown'],
    tags: ['Writing', 'Documentation', 'Technical'],
    salary: '$60k - $80k',
    postedDate: new Date('2024-12-17')
  },
  {
    id: '31',
    title: 'Operations Manager',
    company: 'Logistics Plus',
    location: 'Denver, CO',
    type: 'full-time',
    description: 'Oversee daily operations and optimize processes to improve efficiency and reduce costs.',
    requirements: ['Operations Management', 'Process Optimization', 'Leadership'],
    tags: ['Operations', 'Management', 'Leadership'],
    salary: '$75k - $100k',
    postedDate: new Date('2024-12-16')
  },
  {
    id: '32',
    title: 'Android Developer',
    company: 'Mobile Innovations',
    location: 'Seattle, WA',
    type: 'full-time',
    description: 'Develop native Android applications using Kotlin and modern Android development tools.',
    requirements: ['Kotlin', 'Android SDK', 'Android Studio', 'Play Store'],
    tags: ['Android', 'Mobile', 'Kotlin'],
    salary: '$85k - $120k',
    postedDate: new Date('2024-12-15')
  },
  {
    id: '33',
    title: 'Social Media Manager',
    company: 'Brand Builders',
    location: 'Miami, FL',
    type: 'full-time',
    description: 'Manage social media presence and create engaging content to build brand awareness and community.',
    requirements: ['Social Media', 'Content Creation', 'Community Management'],
    tags: ['Social Media', 'Marketing', 'Content'],
    salary: '$45k - $65k',
    postedDate: new Date('2024-12-14')
  },
  {
    id: '34',
    title: 'Database Administrator',
    company: 'DataSys',
    location: 'Dallas, TX',
    type: 'full-time',
    description: 'Manage and optimize database systems to ensure data integrity, performance, and security.',
    requirements: ['SQL', 'Database Management', 'Performance Tuning'],
    tags: ['Database', 'SQL', 'Administration'],
    salary: '$80k - $110k',
    postedDate: new Date('2024-12-13')
  },
  {
    id: '35',
    title: 'UI Developer',
    company: 'Interface Design',
    location: 'Portland, OR',
    type: 'full-time',
    description: 'Build responsive and interactive user interfaces using modern web technologies and design systems.',
    requirements: ['HTML', 'CSS', 'JavaScript', 'Design Systems'],
    tags: ['UI', 'Frontend', 'Design'],
    salary: '$70k - $95k',
    postedDate: new Date('2024-12-12')
  },
  {
    id: '36',
    title: 'Project Manager',
    company: 'Agile Solutions',
    location: 'Atlanta, GA',
    type: 'full-time',
    description: 'Lead cross-functional teams to deliver projects on time and within budget using Agile methodologies.',
    requirements: ['Project Management', 'Agile', 'Scrum', 'Leadership'],
    tags: ['PM', 'Agile', 'Leadership'],
    salary: '$80k - $110k',
    postedDate: new Date('2024-12-11')
  },
  {
    id: '37',
    title: 'Web Designer',
    company: 'Creative Web',
    location: 'San Diego, CA',
    type: 'full-time',
    description: 'Design beautiful and functional websites that provide excellent user experiences across all devices.',
    requirements: ['Web Design', 'Figma', 'Responsive Design', 'User Experience'],
    tags: ['Design', 'Web', 'UX'],
    salary: '$55k - $75k',
    postedDate: new Date('2024-12-10')
  },
  {
    id: '38',
    title: 'SEO Specialist',
    company: 'Search Experts',
    location: 'Remote',
    type: 'full-time',
    description: 'Improve website search engine rankings through on-page and off-page optimization strategies.',
    requirements: ['SEO', 'Google Analytics', 'Keyword Research', 'Content Optimization'],
    tags: ['SEO', 'Marketing', 'Remote'],
    salary: '$50k - $70k',
    postedDate: new Date('2024-12-09')
  },
  {
    id: '39',
    title: 'Software Architect',
    company: 'Tech Leaders',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'Design scalable software architecture and guide technical decisions for large-scale applications.',
    requirements: ['Software Architecture', 'System Design', 'Leadership', 'Technical Strategy'],
    tags: ['Architecture', 'Leadership', 'Enterprise'],
    salary: '$140k - $180k',
    postedDate: new Date('2024-12-08')
  },
  {
    id: '40',
    title: 'E-commerce Specialist',
    company: 'Online Retail',
    location: 'Nashville, TN',
    type: 'full-time',
    description: 'Manage and optimize e-commerce platforms to drive online sales and improve customer experience.',
    requirements: ['E-commerce', 'Shopify', 'Digital Marketing', 'Analytics'],
    tags: ['E-commerce', 'Retail', 'Online'],
    salary: '$55k - $75k',
    postedDate: new Date('2024-12-07')
  },
  {
    id: '41',
    title: 'Salesforce Developer',
    company: 'CRM Solutions',
    location: 'Chicago, IL',
    type: 'full-time',
    description: 'Customize and develop Salesforce solutions to meet business requirements and improve sales processes.',
    requirements: ['Salesforce', 'Apex', 'Lightning', 'CRM'],
    tags: ['Salesforce', 'CRM', 'Development'],
    salary: '$85k - $115k',
    postedDate: new Date('2024-12-06')
  },
  {
    id: '42',
    title: 'Legal Intern',
    company: 'Law Associates',
    location: 'Washington, DC',
    type: 'intern',
    description: 'Support legal research and document preparation in a fast-paced law firm environment.',
    requirements: ['Legal Research', 'Writing', 'Attention to Detail'],
    tags: ['Legal', 'Research', 'Internship'],
    salary: '$25/hour',
    postedDate: new Date('2024-12-05')
  },
  {
    id: '43',
    title: 'Brand Manager',
    company: 'Consumer Brands',
    location: 'Los Angeles, CA',
    type: 'full-time',
    description: 'Develop and execute brand strategies to increase market share and brand awareness.',
    requirements: ['Brand Management', 'Marketing Strategy', 'Consumer Research'],
    tags: ['Branding', 'Marketing', 'Strategy'],
    salary: '$70k - $95k',
    postedDate: new Date('2024-12-04')
  },
  {
    id: '44',
    title: 'Supply Chain Analyst',
    company: 'Global Logistics',
    location: 'Phoenix, AZ',
    type: 'full-time',
    description: 'Analyze supply chain data to optimize inventory levels and improve operational efficiency.',
    requirements: ['Supply Chain', 'Data Analysis', 'Inventory Management'],
    tags: ['Supply Chain', 'Analytics', 'Operations'],
    salary: '$60k - $80k',
    postedDate: new Date('2024-12-03')
  },
  {
    id: '45',
    title: 'WordPress Developer',
    company: 'Web Agency',
    location: 'Remote',
    type: 'full-time',
    description: 'Build custom WordPress websites and plugins for clients across various industries.',
    requirements: ['WordPress', 'PHP', 'MySQL', 'Custom Themes'],
    tags: ['WordPress', 'Web', 'Remote'],
    salary: '$55k - $75k',
    postedDate: new Date('2024-12-02')
  },
  {
    id: '46',
    title: 'Scrum Master',
    company: 'Agile Teams',
    location: 'Austin, TX',
    type: 'full-time',
    description: 'Facilitate Agile ceremonies and help teams improve their development processes and productivity.',
    requirements: ['Scrum', 'Agile Coaching', 'Team Facilitation', 'Continuous Improvement'],
    tags: ['Scrum', 'Agile', 'Coaching'],
    salary: '$75k - $100k',
    postedDate: new Date('2024-12-01')
  },
  {
    id: '47',
    title: 'Research Scientist',
    company: 'Innovation Labs',
    location: 'Boston, MA',
    type: 'full-time',
    description: 'Conduct research in artificial intelligence and machine learning to develop next-generation technologies.',
    requirements: ['PhD in CS/AI', 'Research Experience', 'Publications', 'Python'],
    tags: ['Research', 'AI', 'Science'],
    salary: '$120k - $150k',
    postedDate: new Date('2024-11-30')
  },
  {
    id: '48',
    title: 'Event Coordinator',
    company: 'Event Masters',
    location: 'Las Vegas, NV',
    type: 'full-time',
    description: 'Plan and execute corporate events, conferences, and trade shows from concept to completion.',
    requirements: ['Event Planning', 'Project Management', 'Vendor Management'],
    tags: ['Events', 'Planning', 'Coordination'],
    salary: '$45k - $60k',
    postedDate: new Date('2024-11-29')
  },
  {
    id: '49',
    title: 'API Developer',
    company: 'Integration Corp',
    location: 'Seattle, WA',
    type: 'full-time',
    description: 'Design and implement RESTful APIs and microservices to enable seamless system integrations.',
    requirements: ['REST APIs', 'Microservices', 'Node.js', 'API Security'],
    tags: ['API', 'Backend', 'Integration'],
    salary: '$80k - $110k',
    postedDate: new Date('2024-11-28')
  },
  {
    id: '50',
    title: 'Graphic Design Intern',
    company: 'Creative Studio',
    location: 'San Francisco, CA',
    type: 'intern',
    description: 'Create visual designs for digital and print media while learning from experienced designers.',
    requirements: ['Adobe Creative Suite', 'Design Fundamentals', 'Creativity'],
    tags: ['Design', 'Graphics', 'Internship'],
    salary: '$20/hour',
    postedDate: new Date('2024-11-27')
  }
];

// Main function to get jobs (GitHub first, fallback to mock)
export const getJobs = async (): Promise<Job[]> => {
  try {
    const githubJobs = await getJobsFromGitHub();
    if (githubJobs && githubJobs.length > 0) {
      return githubJobs;
    }
  } catch (error) {
    console.warn('Failed to fetch GitHub jobs, using fallback:', error);
  }
  
  return fallbackMockJobs;
};

// For backward compatibility, export the original mock jobs
export const mockJobs = fallbackMockJobs;