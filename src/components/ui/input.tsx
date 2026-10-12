"use client";

import * as React from "react";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[13px] font-medium text-[var(--muted-foreground)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[var(--input)] bg-[var(--background)] px-4 text-[15px] placeholder:text-[var(--muted-foreground)] transition-colors focus:outline-none focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--error)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[13px] text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
