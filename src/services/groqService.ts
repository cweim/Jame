import { Job } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

export type TaskType = 'resume' | 'cover-letter' | 'outreach-email' | 'interview-prep' | 'general';

const getSystemPrompt = (taskType: TaskType, job?: Job): string => {
  const basePrompt = `You are an expert career consultant and resume specialist with 15+ years of experience helping candidates land their dream jobs at top companies. You provide professional, actionable advice that gets results.`;

  const taskPrompts = {
    resume: `Focus on tailoring resumes to specific job descriptions. Provide specific suggestions for:
- Keywords to include from the job description
- Skills to highlight
- Experience to emphasize
- Quantifiable achievements to add
- Format improvements
- ATS optimization tips`,
    
    'cover-letter': `Specialize in creating compelling cover letters that:
- Address the specific role and company
- Highlight relevant experience and skills
- Show genuine interest and research about the company
- Include a strong opening and closing
- Maintain professional yet personable tone`,
    
    'outreach-email': `Expert in crafting professional outreach emails for:
- Networking with employees at target companies
- Following up on applications
- Requesting informational interviews
- Building professional relationships
- Cold outreach that gets responses`,
    
    'interview-prep': `Provide comprehensive interview preparation including:
- Common questions for the specific role
- STAR method examples
- Questions to ask the interviewer
- Company research insights
- Salary negotiation tips`,
    
    general: `Provide general career advice and answer any job-related questions.`
  };

  let jobContext = '';
  if (job) {
    jobContext = `

CURRENT JOB CONTEXT:
Position: ${job.title}
Company: ${job.company}
Location: ${job.location}
Type: ${job.type}
Description: ${job.description}
Requirements: ${job.requirements.join(', ')}
Tags: ${job.tags.join(', ')}
${job.salary ? `Salary: ${job.salary}` : ''}
${job.companyDescription ? `About Company: ${job.companyDescription}` : ''}

Use this job information as context for your advice.`;
  }

  return `${basePrompt}

${taskPrompts[taskType]}
${jobContext}

Always be specific, actionable, and professional in your responses.`;
};

export const sendChatMessage = async (
  messages: ChatMessage[],
  taskType: TaskType = 'general',
  selectedJob?: Job
): Promise<ChatResponse> => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return {
      message: 'Please configure your GROQ API key in the .env file to use AI chat functionality.',
      success: false,
      error: 'API key not configured'
    };
  }

  try {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: getSystemPrompt(taskType, selectedJob)
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768', // Fast and good for general tasks
        messages: [systemMessage, ...messages],
        max_tokens: 2048,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from GROQ API');
    }

    return {
      message: data.choices[0].message.content,
      success: true
    };

  } catch (error) {
    console.error('GROQ API error:', error);
    return {
      message: 'Sorry, I encountered an error. Please try again.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Pre-defined task templates
export const getTaskTemplate = (taskType: TaskType, job?: Job): string => {
  const templates = {
    resume: job ? 
      `I want to tailor my resume for the ${job.title} position at ${job.company}. Can you help me optimize it based on their job description and requirements?` :
      'I want to improve my resume. Can you provide general resume optimization tips?',
    
    'cover-letter': job ?
      `Please help me write a compelling cover letter for the ${job.title} position at ${job.company}.` :
      'I need help writing a cover letter for a job application.',
    
    'outreach-email': job ?
      `I want to write a networking email to someone at ${job.company} about the ${job.title} position. Can you help me craft a professional outreach message?` :
      'I need help writing a professional networking email.',
    
    'interview-prep': job ?
      `I have an interview for the ${job.title} position at ${job.company}. Can you help me prepare by providing potential questions and advice?` :
      'I need help preparing for a job interview.',
    
    general: 'I have a career-related question. Can you help me?'
  };

  return templates[taskType];
};