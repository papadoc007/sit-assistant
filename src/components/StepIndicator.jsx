import React from 'react'

const STEPS = [
  { num: 1, label: 'תיאור הבעיה' },
  { num: 2, label: 'העולם הסגור' },
  { num: 3, label: 'שרשרת תל"ר' },
  { num: 4, label: 'שינוי איכותי + פעולות' },
  { num: 5, label: 'הפעלת כלים' },
  { num: 6, label: 'פיתוח ותיעוד' },
]

export default function StepIndicator({ currentStep, onStepClick }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 px-1">
      {STEPS.map((step, i) => {
        const isActive = step.num === currentStep
        const isDone = step.num < currentStep
        return (
          <React.Fragment key={step.num}>
            <button
              onClick={() => onStepClick(step.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isDone
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-white/20' : isDone ? 'bg-green-500/20' : 'bg-slate-700'
              }`}>
                {isDone ? '✓' : step.num}
              </span>
              {step.label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-4 h-0.5 flex-shrink-0 ${isDone ? 'bg-green-500/50' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
