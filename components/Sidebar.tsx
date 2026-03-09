import React from 'react';

interface SidebarProps {
  onClearChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClearChat, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-dark-bg border-r border-dark-border transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="h-8 w-8 rounded bg-gradient-to-tr from-leera-500 to-purple-600 shadow-lg shadow-leera-500/20"></div>
            <h1 className="text-xl font-bold tracking-tight text-white font-mono">
              Leera <span className="text-leera-500">AI</span>
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              System Info
            </div>
            
            <div className="p-3 bg-dark-surface rounded-lg border border-dark-border space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Owner</span>
                <span className="text-leera-300 font-medium">Maleesha Dewshan</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">Operational</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Version</span>
                <span className="text-gray-300">Native-1.0</span>
              </div>
            </div>

            <div className="mt-8 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Actions
            </div>
            
            <button 
              onClick={onClearChat}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-dark-surface hover:text-white transition-colors flex items-center group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500 group-hover:text-leera-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Conversation
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-dark-border">
            <div className="text-[10px] text-gray-600 text-center">
              &copy; {new Date().getFullYear()} Maleesha Dewshan.<br/>All rights reserved.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};