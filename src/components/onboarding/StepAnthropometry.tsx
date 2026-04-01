import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Input';
import { useStore } from '../../store/useStore';
import { HealthCalculator } from '../../services/HealthCalculator';

export const StepAnthropometry = () => {
  const { profile, updateProfile, nextStep, prevStep } = useStore();

  // Расчёт BMI в реальном времени
  const bmi = HealthCalculator.calculateBMI(profile.weight, profile.height);
  const bmiCategory = HealthCalculator.getBMICategory(bmi);
  const bmiColor = HealthCalculator.getBMICategoryColor(bmiCategory);
  const bmiLabel = HealthCalculator.getBMICategoryLabel(bmiCategory);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">📏</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Антропометрия
        </h2>
        <p className="text-gray-600">
          Ваши физические параметры
        </p>
      </div>

      <div className="space-y-8 mb-8">
        {/* Height slider */}
        <Slider
          label="Рост"
          value={profile.height}
          onChange={(value) => updateProfile({ height: value })}
          min={140}
          max={220}
          unit=" см"
        />

        {/* Weight slider */}
        <Slider
          label="Вес"
          value={profile.weight}
          onChange={(value) => updateProfile({ weight: value })}
          min={40}
          max={180}
          step={0.5}
          unit=" кг"
        />

        {/* Target weight (optional) */}
        <div>
          <Slider
            label="Целевой вес (опционально)"
            value={profile.targetWeight || profile.weight}
            onChange={(value) => updateProfile({ targetWeight: value })}
            min={40}
            max={180}
            step={0.5}
            unit=" кг"
          />
          <p className="text-xs text-gray-400 mt-1">
            Оставьте текущий вес, если не планируете его менять
          </p>
        </div>
      </div>

      {/* BMI Preview */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Ваш ИМТ (BMI)</p>
            <p className="text-2xl font-bold" style={{ color: bmiColor }}>
              {bmi.toFixed(1)}
            </p>
          </div>
          <div 
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${bmiColor}20`, 
              color: bmiColor 
            }}
          >
            {bmiLabel}
          </div>
        </div>

        {/* BMI Scale */}
        <div className="mt-4">
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-yellow-400" />
            <div className="flex-1 bg-green-400" />
            <div className="flex-1 bg-orange-400" />
            <div className="flex-1 bg-red-400" />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{"<18.5"}</span>
            <span>18.5-25</span>
            <span>25-30</span>
            <span>{">30"}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Продолжить
        </Button>
      </div>
    </motion.div>
  );
};
