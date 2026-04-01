import { cn } from '../../utils/cn';
import { ONBOARDING_STEPS } from '../../types';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressBar = ({ currentStep, totalSteps = 10 }: ProgressBarProps) => {
  const progress = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-500">
          Шаг {currentStep + 1} из {totalSteps}
        </span>
        <span className="text-sm font-medium text-emerald-600">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

// Step indicators with dots
export const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {ONBOARDING_STEPS.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'w-2.5 h-2.5 rounded-full transition-all duration-300',
            index === currentStep && 'w-8 bg-emerald-500',
            index < currentStep && 'bg-emerald-400',
            index > currentStep && 'bg-gray-300'
          )}
        />
      ))}
    </div>
  );
};

// Circular progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export const CircularProgress = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = '#10b981',
  label,
  showValue = true,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold text-gray-900">{Math.round(value)}</span>
        )}
        {label && (
          <span className="text-xs text-gray-500">{label}</span>
        )}
      </div>
    </div>
  );
};
