import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { Message } from './types';
import { sendMessageToLeera, resetSession } from './services/leeraService';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello. I am **Leera** (ලීරා). \n\nI was created by Maleesha Dewshan to assist you with advanced programming tasks and conversation. How can I help you build something today?",
      timestamp: Date.now()
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Reset textarea height
    if (inputRef.current) {
        inputRef.current.style.height = 'auto';
    }

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    // Prepare placeholder for model response
    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: Message = {
      id: modelMsgId,
      role: 'model',
      content: '',
      timestamp: Date.now() + 1,
      isStreaming: true
    };
    
    setMessages(prev => [...prev, modelMsg]);

    try {
      let accumulatedText = '';
      
      await sendMessageToLeera(userText, (chunk) => {
        accumulatedText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, content: accumulatedText }
            : msg
        ));
      });
      
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, content: "**System Error:** Connection interrupted. Please try again." }
          : msg
      ));
    } finally {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
      setIsStreaming(false);
    }
  }, [inputValue, isStreaming]);

  const handleClearChat = () => {
    resetSession();
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      content: "Memory cleared. I am ready for a new task.",
      timestamp: Date.now()
    }]);
    setIsSidebarOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex h-screen bg-dark-bg text-gray-100 overflow-hidden font-sans">
      <Sidebar 
        onClearChat={handleClearChat} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-dark-border bg-dark-bg/95 backdrop-blur z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-leera-400">Leera (ලීරා)</span>
          <div className="w-6"></div> {/* Spacer for center alignment */}
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 scroll-smooth">
          <div className="max-w-4xl mx-auto w-full">
             {messages.map(msg => (
               <MessageBubble key={msg.id} message={msg} />
             ))}
             {/* Dummy div to scroll to */}
             <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-dark-bg border-t border-dark-border">
          <div className="max-w-4xl mx-auto relative">
            <div className="relative flex items-end bg-dark-surface border border-dark-border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-leera-500/50 focus-within:border-leera-500 transition-all">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={adjustTextareaHeight}
                onKeyDown={handleKeyDown}
                placeholder="Ask Leera anything..."
                className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-sm md:text-base p-4 max-h-[120px] rounded-xl focus:outline-none resize-none font-mono"
                rows={1}
                disabled={isStreaming}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isStreaming}
                className={`
                   mb-2 mr-2 p-2 rounded-lg transition-all duration-200
                   ${!inputValue.trim() || isStreaming 
                     ? 'text-gray-600 bg-transparent cursor-not-allowed' 
                     : 'text-white bg-leera-600 hover:bg-leera-500 shadow-lg shadow-leera-600/20'
                   }
                `}
              >
                {isStreaming ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="text-center mt-2">
                <span className="text-[10px] text-gray-600">
                    Leera AI • Developed by Maleesha Dewshan • {new Date().getFullYear()}
                </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;