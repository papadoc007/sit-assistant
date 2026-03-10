import React, { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import GuidedProcess from './components/GuidedProcess'

const TABS = [
  { id: 'chat', label: 'צ\'אט חופשי', icon: '💬' },
  { id: 'guided', label: 'תהליך מובנה', icon: '🧭' }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
              💡
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SIT - חשיבה המצאתית</h1>
              <p className="text-xs text-slate-400">פתרון בעיות בשיטת Systematic Inventive Thinking</p>
            </div>
          </div>

          {/* Tab Switch */}
          <div className="flex bg-slate-900 rounded-lg p-1 gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="ml-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? <ChatInterface /> : <GuidedProcess />}
      </main>
    </div>
  )
}
