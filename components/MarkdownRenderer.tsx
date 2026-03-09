import React, { useMemo, useState } from 'react';
import { CodePreviewModal } from './CodePreviewModal';

interface MarkdownRendererProps {
  content: string;
}

// Simple regex-based syntax highlighter to avoid heavy dependencies
const highlightCode = (code: string, lang: string) => {
  let highlighted = code
    // Escape HTML tags to prevent rendering
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Basic tokens for JS/TS/Python/etc
  const patterns = [
    { regex: /(\/\/.*)/g, type: 'token-comment' }, // Single line comments
    { regex: /(['"`])(.*?)\1/g, type: 'token-string' }, // Strings
    { regex: /\b(const|let|var|function|return|if|else|for|while|import|export|from|class|interface|type|async|await|def|print|class|public|private|DOCTYPE|html|body|head|div|span|style|script)\b/g, type: 'token-keyword' }, // Keywords
    { regex: /\b(true|false|null|undefined)\b/g, type: 'token-operator' }, // Booleans/Null
    { regex: /\b(\d+)\b/g, type: 'token-number' }, // Numbers
    { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g, type: 'token-class' }, // PascalCase (Classes/Types)
    { regex: /\b([a-zA-Z0-9_]+)(?=\()/g, type: 'token-function' }, // Functions calls
  ];

  patterns.forEach(({ regex, type }) => {
    highlighted = highlighted.replace(regex, (match) => `<span class="${type}">${match}</span>`);
  });

  return highlighted;
};

const CodeBlock: React.FC<{ language: string; content: string }> = ({ language, content }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const highlightedContent = useMemo(() => {
    return highlightCode(content, language);
  }, [content, language]);

  // Determine if code is previewable (HTML)
  const isPreviewable = language === 'html' || language === 'xml';

  return (
    <>
      <div className="my-4 rounded-xl overflow-hidden border border-dark-border bg-[#1e222a] shadow-lg group">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#282c34] border-b border-black/20">
          <div className="flex items-center space-x-2">
             <div className="flex space-x-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
             </div>
             <span className="ml-2 text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">{language || 'text'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isPreviewable && (
              <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-1 text-xs text-leera-400 hover:text-leera-300 transition-colors py-1 px-3 rounded-md hover:bg-leera-500/10 border border-leera-500/30 group/btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 group-hover/btn:fill-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold tracking-wide">Preview</span>
              </button>
            )}

            <button 
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors py-1 px-2 rounded hover:bg-white/10"
              title="Copy code"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Code Body */}
        <div className="p-4 overflow-x-auto bg-[#1e222a]">
          <pre className="font-mono text-sm leading-relaxed text-[#abb2bf]">
            <code dangerouslySetInnerHTML={{ __html: highlightedContent }} />
          </pre>
        </div>
      </div>

      <CodePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} code={content} />
    </>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parts = useMemo(() => {
    const regex = /```(\w*)([\s\S]*?)```/g;
    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        });
      }

      result.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim(),
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      result.push({
        type: 'text',
        content: content.slice(lastIndex),
      });
    }

    return result;
  }, [content]);

  return (
    <div className="space-y-2 break-words text-sm md:text-base leading-relaxed">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} language={part.language} content={part.content} />;
        }
        
        return (
          <div key={index} className="whitespace-pre-wrap">
             {part.content.split(/(Leera|Maleesha Dewshan|ලීරා)/g).map((subPart, i) => 
                (subPart === 'Leera' || subPart === 'Maleesha Dewshan' || subPart === 'ලීරා') 
                ? <span key={i} className="text-leera-300 font-semibold">{subPart}</span> 
                : subPart
             )}
          </div>
        );
      })}
    </div>
  );
};