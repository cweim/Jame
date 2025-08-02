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

const getSystemPrompt = (job?: Job): string => {
  const basePrompt = `You are an expert career consultant and resume specialist with 15+ years of experience helping candidates land their dream jobs at top companies. You provide professional, actionable advice that gets results.

Your expertise includes:
- Resume optimization and ATS optimization
- Cover letter writing and personalization
- Interview preparation and behavioral questions
- Salary negotiation strategies
- Professional networking and outreach
- Career path planning and development
- Job search strategies and market insights
- LinkedIn profile optimization
- Professional skill development advice

You provide specific, actionable advice tailored to each user's situation and always maintain a professional, encouraging tone.`;

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

Use this job information as context for your advice when relevant.`;
  }

  return `${basePrompt}${jobContext}

Always be specific, actionable, and professional in your responses.`;
};

export const sendChatMessage = async (
  messages: ChatMessage[],
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
      content: getSystemPrompt(selectedJob)
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Updated model that's currently supported
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

// Test function to verify GROQ API key is working
export const testGroqConnection = async (): Promise<ChatResponse> => {
  return sendChatMessage([
    {
      role: 'user',
      content: 'Hello, can you confirm that you are working as a career expert? Please respond with a brief introduction.'
    }
  ]);
};