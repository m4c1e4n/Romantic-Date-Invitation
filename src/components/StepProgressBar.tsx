import React from 'react';
import { Calendar, Utensils, MapPin, Ticket } from 'lucide-react';
import { DatePageStep } from '../types';

interface StepProgressBarProps {
  currentStep: DatePageStep;
  onStepClick?: (step: DatePageStep) => void;
}

const STEPS: { id: DatePageStep; label: string; number: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'question-day', label: 'Day & Time', number: '1', icon: Calendar },
  { id: 'question-food', label: 'Cravings', number: '2', icon: Utensils },
  { id: 'question-place', label: 'Place', number: '3', icon: MapPin },
  { id: 'ticket', label: 'VIP Pass', number: '4', icon: Ticket },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, onStepClick }) => {
  const getStepIndex = (step: DatePageStep) => {
    switch (step) {
      case 'question-day':
        return 0;
      case 'question-food':
        return 1;
      case 'question-place':
        return 2;
      case 'letter':
      case 'paywall':
      case 'ticket':
        return 3;
      default:
        return -1;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  if (currentIndex === -1) {
    return null; // Don't show on proposal or celebration pages
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
      <div className="bg-white/90 backdrop-blur-md rounded-full p-1.5 sm:p-2 border border-rose-100 shadow-xs flex items-center justify-between gap-1 sm:gap-1.5">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick && onStepClick(step.id)}
              disabled={!onStepClick || index > currentIndex}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1.5 sm:px-3 min-h-[40px] sm:min-h-[44px] rounded-full text-xs font-bold transition-all touch-manipulation ${
                isCurrent
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200 cursor-default'
                  : isCompleted
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer active:scale-95'
                  : 'text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                isCurrent
                  ? 'bg-white text-rose-500 font-extrabold'
                  : isCompleted
                  ? 'bg-rose-200 text-rose-800'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {isCompleted ? '✓' : step.number}
              </span>
              <span className="hidden sm:inline truncate">{step.label}</span>
              <Icon className="w-3.5 h-3.5 sm:hidden shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
