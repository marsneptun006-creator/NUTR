import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 appearance-none cursor-pointer',
            'focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
            'hover:border-gray-300',
            'bg-[url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Card Select for visual selection
interface CardSelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface CardSelectProps {
  label?: string;
  options: CardSelectOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
}

export const CardSelect = ({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: CardSelectProps) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className={cn('grid gap-3', gridCols[columns])}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-200 text-left',
              value === option.value
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
            )}
          >
            {option.icon && (
              <span className="text-2xl mb-2 block">{option.icon}</span>
            )}
            <span className={cn(
              'font-medium block',
              value === option.value ? 'text-emerald-700' : 'text-gray-900'
            )}>
              {option.label}
            </span>
            {option.description && (
              <span className="text-xs text-gray-500 mt-1 block">
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
