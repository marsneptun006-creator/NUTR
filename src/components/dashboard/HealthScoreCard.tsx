import { HealthMetrics } from '../../types';
import { HealthCalculator } from '../../services/HealthCalculator';
import { CircularProgress } from '../ui/ProgressBar';

interface HealthScoreCardProps {
  metrics: HealthMetrics;
}

export const HealthScoreCard = ({ metrics }: HealthScoreCardProps) => {
  const scoreColor = HealthCalculator.getHealthScoreColor(metrics.healthScore);
  const scoreLabel = HealthCalculator.getHealthScoreLabel(metrics.healthScore);
  const bmiLabel = HealthCalculator.getBMICategoryLabel(metrics.bmiCategory);
  const bmiColor = HealthCalculator.getBMICategoryColor(metrics.bmiCategory);

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20">
      <div className="flex items-center justify-between">
        {/* Health Score */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <CircularProgress
              value={metrics.healthScore}
              max={100}
              size={100}
              strokeWidth={8}
              color="#fff"
              showValue={false}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{metrics.healthScore}</span>
              <span className="text-xs text-emerald-100">из 100</span>
            </div>
          </div>
          
          <div>
            <p className="text-emerald-100 text-sm">Health Score</p>
            <p className="text-2xl font-bold">{scoreLabel}</p>
            <p className="text-emerald-100 text-sm mt-1">состояние здоровья</p>
          </div>
        </div>

        {/* BMI */}
        <div className="text-right">
          <p className="text-emerald-100 text-sm">ИМТ (BMI)</p>
          <p className="text-3xl font-bold">{metrics.bmi}</p>
          <div 
            className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-1"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
            }}
          >
            {bmiLabel}
          </div>
        </div>
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-400/30">
        <div>
          <p className="text-emerald-100 text-xs">Базовый метаболизм</p>
          <p className="text-lg font-bold">{metrics.bmr} ккал</p>
        </div>
        <div>
          <p className="text-emerald-100 text-xs">Суточный расход</p>
          <p className="text-lg font-bold">{metrics.tdee} ккал</p>
        </div>
        <div>
          <p className="text-emerald-100 text-xs">Целевые калории</p>
          <p className="text-lg font-bold">{metrics.targetCalories} ккал</p>
        </div>
      </div>
    </div>
  );
};
