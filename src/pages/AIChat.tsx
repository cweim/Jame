import { useState, useEffect, useRef } from 'react';
import { Job, JobApplication } from '../types';
import { getApplications } from '../utils/localStorage';
import { getJobs, mockJobs } from '../services/mockData';
import { sendChatMessage, ChatMessage, TaskType, getTaskTemplate } from '../services/groqService';
import Navigation from '../components/Navigation';

const AIChat = () => {
  const [interestedJobs, setInterestedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInterestedJobs();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInterestedJobs = async () => {
    try {
      const applications = getApplications();
      const interestedApps = applications.filter(app => app.status === 'interested');
      
      const jobs = await getJobs();
      setAllJobs(jobs);
      
      const interested = interestedApps.map(app => {
        return jobs.find(job => job.id === app.jobId) || mockJobs.find(job => job.id === app.jobId);
      }).filter(Boolean) as Job[];
      
      setInterestedJobs(interested);
    } catch (error) {
      console.error('Failed to load interested jobs:', error);
    }
  };


  const handleJobChange = (jobId: string) => {
    const job = interestedJobs.find(j => j.id === jobId);
    setSelectedJob(job || null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(newMessages, 'general', selectedJob || undefined);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Career Assistant</h1>
          <p className="text-gray-600">Get expert career advice tailored to your job applications</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="max-w-md">
            {/* Job Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💼 Select a job (optional)
              </label>
              <select
                value={selectedJob?.id || ''}
                onChange={(e) => handleJobChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No specific job</option>
                {interestedJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} at {job.company}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {interestedJobs.length === 0 
                  ? 'No interested jobs found. Mark jobs as interested first.'
                  : 'Select a job for personalized advice'
                }
              </p>
            </div>
          </div>

          {/* Selected Job Info */}
          {selectedJob && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Selected Job Context</h3>
              <div className="text-sm text-blue-800">
                <p><strong>{selectedJob.title}</strong> at <strong>{selectedJob.company}</strong></p>
                <p>{selectedJob.location} • {selectedJob.type}</p>
                {selectedJob.salary && <p>💰 {selectedJob.salary}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow flex flex-col h-[60vh]">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-900">Career Chat</h2>
              <p className="text-sm text-gray-600">AI Career Assistant</p>
            </div>
            <button
              onClick={clearChat}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              🗑️ Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg mb-2">👋 Hi! I'm your AI career assistant</p>
                <p className="text-sm">
                  Select a task type and optionally a job, then ask me anything about your career!
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin text-sm">⏳</div>
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;