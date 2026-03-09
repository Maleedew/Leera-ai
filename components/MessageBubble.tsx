import React from 'react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} mb-6 group animate-fade-in-up`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] lg:max-w-[75%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-transform duration-200 hover:scale-105
          ${isModel 
            ? 'bg-gradient-to-br from-leera-600 to-leera-800 text-white mr-3 md:mr-4 border border-leera-500' 
            : 'bg-gray-700 text-gray-300 ml-3 md:ml-4'
          }`}>
          {isModel ? 'L' : 'U'}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} w-full min-w-0`}>
          
          <div className="flex items-baseline space-x-2 mb-1">
             <span className={`text-xs font-semibold ${isModel ? 'text-leera-400' : 'text-gray-400'}`}>
               {isModel ? 'Leera (ලීරා)' : 'You'}
             </span>
             {isModel && <span className="text-[10px] text-gray-600 font-mono hidden sm:inline-block">PRO</span>}
          </div>

          <div
            className={`relative px-5 py-3 md:px-6 md:py-4 rounded-2xl shadow-md text-left w-full
              ${isModel 
                ? 'bg-dark-surface border border-dark-border text-gray-100 rounded-tl-none' 
                : 'bg-leera-700 text-white rounded-tr-none'
              }
            `}
          >
            <MarkdownRenderer content={message.content} />
            {message.isStreaming && (
               <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-leera-400 animate-pulse"></span>
            )}
          </div>
          
          <div className="mt-1 text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};