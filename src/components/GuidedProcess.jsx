import React, { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../utils/api'
import MessageBubble, { TypingIndicator } from './MessageBubble'
import FileUpload from './FileUpload'
import StepIndicator from './StepIndicator'
import ToolSelector from './ToolSelector'

const STEP_HINTS = {
  1: 'תאר את הבעיה בקצרה - מה קורה? מה המחיר? (בלי הצעות לפתרון)',
  2: 'נמפה את העולם הסגור - אילו רכיבים קשורים לבעיה ולסביבתה?',
  3: 'נבנה שרשרת תל"ר - "אז מה?" ו"למה?" לכל תופעה לא רצויה',
  4: 'נפעיל שינוי איכותי ונגדיר פעולות רצויות',
  5: 'בחר כלי SIT להפעלה על הבעיה',
  6: 'נפתח ונתעד את הפתרון'
}

export default function GuidedProcess() {
  const [step, setStep] = useState(1)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)
  const [pendingFiles, setPendingFiles] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Send initial step prompt when step changes
  useEffect(() => {
    if (messages.length === 0 && step === 1) {
      // Auto-send welcome for step 1
      const welcome = {
        role: 'assistant',
        content: 'שלום! בואו נתחיל את תהליך SIT.\n\n**שלב 1 - תיאור הבעיה**\n\nתאר את הבעיה שאתה רוצה לפתור. נסה לנסח:\n- תיאור עובדתי וקצר\n- בלי הצעות לפתרון\n- מה המחיר של הבעיה? (כסף, זמן, נזק)\n\nאפשר גם להעלות מסמך או תמונה שקשורים לבעיה.',
        textContent: 'שלום! בואו נתחיל את תהליך SIT.\n\n**שלב 1 - תיאור הבעיה**\n\nתאר את הבעיה שאתה רוצה לפתור. נסה לנסח:\n- תיאור עובדתי וקצר\n- בלי הצעות לפתרון\n- מה המחיר של הבעיה? (כסף, זמן, נזק)\n\nאפשר גם להעלות מסמך או תמונה שקשורים לבעיה.'
      }
      setMessages([welcome])
    }
  }, [])

  const handleSend = async () => {
    const text = input.trim()
    if (!text && pendingFiles.length === 0) return

    const contentParts = []
    for (const f of pendingFiles) {
      if (f.type === 'image') {
        contentParts.push({
          type: 'image',
          source: { type: 'base64', media_type: f.mediaType, data: f.data }
        })
      } else {
        contentParts.push({ type: 'text', text: `[תוכן קובץ: ${f.fileName}]\n${f.data}` })
      }
    }
    if (text) contentParts.push({ type: 'text', text })

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
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content || m.textContent
      }))

      const data = await sendMessage(apiMessages, step, selectedTool)
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

  const advanceStep = () => {
    if (step < 6) setStep(step + 1)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Step indicator */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <StepIndicator currentStep={step} onStepClick={setStep} />
        </div>
      </div>

      {/* Tool selector for step 5 */}
      {step === 5 && (
        <div className="bg-slate-800/30 border-b border-slate-700 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-slate-400 mb-2">בחר כלי SIT להפעלה:</p>
            <ToolSelector selectedTool={selectedTool} onSelect={setSelectedTool} />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
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

      {/* Input + step controls */}
      <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur px-4 py-3">
        <div className="max-w-3xl mx-auto">
          {/* Step hint */}
          <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
            <span>💡 {STEP_HINTS[step]}</span>
            {step < 6 && (
              <button
                onClick={advanceStep}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                לשלב הבא ←
              </button>
            )}
          </div>
          <div className="flex items-end gap-2">
            <FileUpload
              onFileProcessed={(f) => setPendingFiles(prev => [...prev, f])}
              disabled={loading}
            />
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={STEP_HINTS[step]}
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
    </div>
  )
}
