import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-navy">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full h-11 px-4 rounded-lg border border-line
            bg-white text-navy placeholder:text-gray
            focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold
            transition-all duration-200
            ${error ? "border-red-500 focus:ring-red-200" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
