import React from 'react';

export type ChecklistItem = {
  label: string;
  checked: boolean;
  optional?: boolean;
};

export function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <div className="pl-2 mt-6" style={{ marginTop: 25 }}>
      <div className="text-xs font-semibold text-gray-500 mb-2">Steps</div>
      <ul className="space-y-2">
        {items.map((item, idx) => {
          // Determine color classes for border and text
          let borderColor = 'border-gray-300';
          let textColor = 'text-gray-500 font-normal';
          let checkColor = 'text-green-600';
          if (item.checked && item.optional) {
            borderColor = 'border-blue-300';
            textColor = 'text-blue-500 font-normal';
            checkColor = 'text-blue-500';
          } else if (item.checked) {
            borderColor = 'border-green-600';
            textColor = 'text-green-700 font-medium';
            checkColor = 'text-green-600';
          }
          return (
            <li key={idx} className="flex items-center text-sm select-none">
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full border mr-2 bg-transparent ${borderColor}`}
                style={{ pointerEvents: 'none' }}
              >
                {item.checked && (
                  <svg
                    className={checkColor}
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10.5L10 13.5L15 8.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className={textColor}>
                {item.label}
                {item.optional && <span className="ml-1 text-xs">(optional)</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 