import React from 'react';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  maxStep: number;
  onStepClick?: (stepIdx: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, maxStep, onStepClick }) => {
  return (
    <nav id="step-indicator-bar" className="w-full flex justify-center items-center py-6 bg-[#071630] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <ol className="flex space-x-8">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isClickable = idx <= maxStep && idx !== currentStep && !!onStepClick;
          const showTooltip = isCompleted && idx < currentStep;
          return (
            <li key={step.label} className="flex flex-col items-center relative group">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick && onStepClick(idx)}
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-colors
                  ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400' : ''}
                  ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                `}
                aria-current={isCurrent ? 'step' : undefined}
                tabIndex={isClickable ? 0 : -1}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  idx + 1
                )}
              </button>
              {showTooltip && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-64 bg-gray-900 text-white text-xs rounded-lg px-4 py-2 border border-[#e3e3e3] shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                  If you go back and make changes, the rest of the steps will start over and you'll need to complete them again.
                </div>
              )}
              <span className={`mt-2 text-xs font-medium text-center ${isCurrent ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}; 