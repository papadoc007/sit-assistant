import React from 'react'

const TOOLS = [
  {
    id: 'unification',
    name: 'איחוד',
    nameEn: 'Task Unification',
    icon: '🔗',
    desc: 'הטלת תפקיד חדש על רכיב קיים',
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
  },
  {
    id: 'multiplication',
    name: 'הכפלה',
    nameEn: 'Multiplication',
    icon: '✖️',
    desc: 'יצירת עותק עם שינוי',
    color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
  },
  {
    id: 'subtraction',
    name: 'הסרה',
    nameEn: 'Subtraction',
    icon: '➖',
    desc: 'הסרת רכיב והפצת תפקידו',
    color: 'from-red-500/20 to-red-600/20 border-red-500/30'
  },
  {
    id: 'division',
    name: 'חלוקה',
    nameEn: 'Division',
    icon: '✂️',
    desc: 'חלוקה וסידור מחדש',
    color: 'from-green-500/20 to-green-600/20 border-green-500/30'
  },
  {
    id: 'attribute_dependency',
    name: 'הוספת מימד',
    nameEn: 'Attribute Dependency',
    icon: '📐',
    desc: 'קשר חדש בין משתנים',
    color: 'from-amber-500/20 to-amber-600/20 border-amber-500/30'
  }
]

export default function ToolSelector({ selectedTool, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {TOOLS.map(tool => (
        <button
          key={tool.id}
          onClick={() => onSelect(tool.id === selectedTool ? null : tool.id)}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedTool === tool.id
              ? `bg-gradient-to-br ${tool.color} ring-2 ring-blue-400/50 scale-[1.02]`
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="text-2xl mb-1">{tool.icon}</div>
          <div className="text-sm font-bold text-white">{tool.name}</div>
          <div className="text-[10px] text-slate-400">{tool.nameEn}</div>
          <div className="text-xs text-slate-500 mt-1">{tool.desc}</div>
        </button>
      ))}
    </div>
  )
}
