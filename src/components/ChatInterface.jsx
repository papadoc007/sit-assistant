import React, { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../utils/api'
import MessageBubble, { TypingIndicator } from './MessageBubble'
import FileUpload from './FileUpload'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text && pendingFiles.length === 0) return

    // Build user message content for API
    const contentParts = []
    for (const f of pendingFiles) {
      if (f.type === 'image') {
        contentParts.push({
          type: 'image',
          source: { type: 'base64', media_type: f.mediaType, data: f.data }
        })
      } else {
        contentParts.push({
          type: 'text',
          text: `[תוכן קובץ: ${f.fileName}]\n${f.data}`
        })
      }
    }
    if (text) {
      contentParts.push({ type: 'text', text })
    }

    const userMsg = {
      role: 'user',
      content: contentParts,
      textContent: text,
      files: pendingFiles.map(f => ({ fileName: f.fileName, type: f.type }))
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setPendingFiles([])
    setLoading(true)

    try {
      // Build API messages (only role + content)
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content || m.textContent
      }))

      const data = await sendMessage(apiMessages)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        textContent: data.response
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'שגיאה: ' + err.message,
        textContent: 'שגיאה: ' + err.message
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-white mb-2">ברוכים הבאים ל-SIT Assistant</h2>
              <p className="text-slate-400 mb-6">תאר בעיה שאתה רוצה לפתור, ואני אדריך אותך באמצעות שיטת SIT</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'יש לי בעיה עם אנטנה שמצטבר עליה שלג',
                  'איך למנוע פנצ\'ר בגלגל?',
                  'בעיית תאורה באתר בנייה',
                  'איך לשמור על טריות דגים בספינה?'
                ].map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(ex)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Pending files */}
      {pendingFiles.length > 0 && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {pendingFiles.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs rounded-full px-3 py-1">
                📎 {f.fileName}
                <button onClick={() => setPendingFiles(prev => prev.filter((_, j) => j !== i))} className="mr-1 hover:text-red-400">✕</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <FileUpload
            onFileProcessed={(f) => setPendingFiles(prev => [...prev, f])}
            disabled={loading}
          />
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="תאר בעיה או שאל שאלה..."
              disabled={loading}
              rows={1}
              className="w-full resize-none rounded-xl bg-slate-900 border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || (!input.trim() && pendingFiles.length === 0)}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
