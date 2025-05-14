import React, { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ModelAIChatProps {
  modelName?: string;
  modelDescription?: string;
  modelComponents?: any[];
}

const ModelAIChat: React.FC<ModelAIChatProps> = ({
  modelName,
  modelDescription,
  modelComponents
}) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ prompt: string; response: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: 'Empty Prompt',
        description: 'Please enter a question or request for the AI assistant.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await apiRequest('POST', '/api/ai/chat', {
        prompt,
        modelContext: {
          name: modelName,
          description: modelDescription,
          components: modelComponents
        }
      });
      
      const data = await result.json();
      
      if (data.success && data.response) {
        // Add to chat history
        setHistory([...history, { prompt, response: data.response }]);
        setResponse(data.response);
        setPrompt('');
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI assistant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <svg 
          className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
          />
        </svg>
        AI Modeling Assistant
      </h3>
      
      {/* Chat history */}
      <div className="bg-white dark:bg-gray-800 rounded-md p-3 mb-4 h-60 overflow-y-auto">
        {history.length === 0 && !response ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            <p>Ask the AI for modeling advice, material suggestions, or design feedback</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You:</p>
                  <p className="text-gray-800 dark:text-gray-200">{item.prompt}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Assistant:</p>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{item.response}</p>
                </div>
              </div>
            ))}
            
            {/* Current response if not in history yet */}
            {response && history.length === 0 && (
              <div className="space-y-2">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You:</p>
                  <p className="text-gray-800 dark:text-gray-200">{prompt}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Assistant:</p>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{response}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about materials, design, manufacturing..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wait
            </>
          ) : (
            'Ask'
          )}
        </button>
      </form>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <p>Powered by OpenAI for model design and manufacturing guidance</p>
      </div>
    </div>
  );
};

export default ModelAIChat;