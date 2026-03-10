import React from 'react'
import ReactMarkdown from 'react-markdown'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? '' : 'flex-row-reverse'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
            isUser ? 'bg-blue-600' : 'bg-purple-600'
          }`}>
            {isUser ? '👤' : '💡'}
          </div>
          <span className="text-xs text-slate-500">
            {isUser ? 'אתה' : 'SIT Assistant'}
          </span>
        </div>

        {/* Message */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50'
            : 'bg-slate-800 border border-slate-700 text-slate-200'
        }`}>
          {/* Show attached files */}
          {message.files && message.files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {message.files.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-slate-700/50 text-xs rounded-full px-2 py-1">
                  📎 {f.fileName}
                </span>
              ))}
            </div>
          )}

          {/* Text content */}
          {message.textContent && (
            <div className="message-content text-sm leading-relaxed">
              <ReactMarkdown>{message.textContent || ''}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[85%]">
        <div className="flex items-center gap-2 mb-1 flex-row-reverse">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm bg-purple-600">💡</div>
          <span className="text-xs text-slate-500">SIT Assistant</span>
        </div>
        <div className="rounded-2xl px-4 py-3 bg-slate-800 border border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
