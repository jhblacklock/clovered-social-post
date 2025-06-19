import * as React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]) {
  return twMerge(clsx(inputs));
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  isGenerating?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isGenerating, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        `px-6 py-2 text-lg bg-[#2323ff] text-white border border-[#2323ff] rounded-lg
        hover:bg-[#2323ff] hover:border-[#2323ff] hover:text-white
        active:bg-[#2323ff] active:border-[#2323ff] active:text-white active:scale-95
        disabled:bg-transparent disabled:border-gray-300 disabled:text-gray-500 disabled:opacity-100 disabled:cursor-not-allowed
        ${isGenerating ? 'border-none' : ''}
        transition-colors transition-transform font-semibold cursor-pointer`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button"; 