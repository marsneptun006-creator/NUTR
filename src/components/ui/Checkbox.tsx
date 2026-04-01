import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, ...props }, ref) => {
    return (
      <label className={cn(
        'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
        checked 
          ? 'border-emerald-500 bg-emerald-50' 
          : 'border-gray-200 bg-white hover:border-gray-300',
        className
      )}>
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div className={cn(
            'w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
            checked 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'bg-white border-gray-300'
          )}>
            {checked && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        <div>
          <span className={cn(
            'font-medium block',
            checked ? 'text-emerald-700' : 'text-gray-900'
          )}>
            {label}
          </span>
          {description && (
            <span className="text-sm text-gray-500 mt-0.5 block">
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Toggle Switch
interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const Toggle = ({ label, checked, onChange, description }: ToggleProps) => {
  return (
    <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-all">
      <div>
        <span className="font-medium text-gray-900 block">{label}</span>
        {description && (
          <span className="text-sm text-gray-500 mt-0.5 block">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-emerald-500' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 mt-0.5',
            checked ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'
          )}
        />
      </button>
    </label>
  );
};
