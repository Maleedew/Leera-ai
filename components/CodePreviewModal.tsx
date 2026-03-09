import React, { useState, useEffect } from 'react';

interface CodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({ isOpen, onClose, code }) => {
  const [key, setKey] = useState(0); // Force iframe re-render to reset state on re-open

  useEffect(() => {
    if (isOpen) {
      setKey(prev => prev + 1);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative bg-[#1e1e1e] w-full max-w-6xl h-full max-h-[85vh] rounded-xl flex flex-col shadow-2xl border border-[#333] overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333] shrink-0">
          <div className="flex items-center space-x-3">
             <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
             </div>
             <span className="text-gray-300 font-sans font-medium text-sm ml-2">Live Preview</span>
             <span className="hidden sm:inline text-xs text-gray-500 border-l border-gray-700 pl-3">Interactive Output</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#333] text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 relative bg-white">
           <iframe
             key={key}
             srcDoc={code}
             className="w-full h-full border-none block"
             title="Code Preview"
             sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
           />
        </div>
      </div>
    </div>
  );
};