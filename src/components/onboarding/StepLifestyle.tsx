import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CardSelect, Select } from '../ui/Select';
import { Slider } from '../ui/Input';
import { Toggle } from '../ui/Checkbox';
import { useStore } from '../../store/useStore';
import { ActivityLevel, StressLevel, SleepQuality } from '../../types';

export const StepLifestyle = () => {
  const { profile, updateProfile, nextStep, prevStep } = useStore();

  const activityOptions = [
    { value: 'sedentary', label: 'Сидячий', icon: '🪑', description: 'Офисная работа' },
    { value: 'light', label: 'Лёгкая', icon: '🚶', description: '1-3 раза в неделю' },
    { value: 'moderate', label: 'Умеренная', icon: '🏃', description: '3-5 раз в неделю' },
    { value: 'active', label: 'Высокая', icon: '💪', description: '6-7 раз в неделю' },
    { value: 'very_active', label: 'Очень высокая', icon: '🏋️', description: '2 раза в день' },
  ];

  const stressOptions = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
  ];

  const sleepQualityOptions = [
    { value: 'poor', label: 'Плохое' },
    { value: 'average', label: 'Среднее' },
    { value: 'good', label: 'Хорошее' },
    { value: 'excellent', label: 'Отличное' },
  ];

  const alcoholOptions = [
    { value: 'none', label: 'Не употребляю' },
    { value: 'occasional', label: 'Иногда' },
    { value: 'regular', label: 'Регулярно' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🏃‍♂️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Образ жизни
        </h2>
        <p className="text-gray-600">
          Расскажите о вашей активности и привычках
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Activity level */}
        <CardSelect
          label="Уровень активности"
          options={activityOptions}
          value={profile.activityLevel}
          onChange={(value) => updateProfile({ activityLevel: value as ActivityLevel })}
          columns={3}
        />

        {/* Sleep */}
        <div className="grid grid-cols-2 gap-4">
          <Slider
            label="Часов сна"
            value={profile.sleepHours}
            onChange={(value) => updateProfile({ sleepHours: value })}
            min={4}
            max={12}
            step={0.5}
            unit=" ч"
          />
          <Select
            label="Качество сна"
            options={sleepQualityOptions}
            value={profile.sleepQuality}
            onChange={(e) => updateProfile({ sleepQuality: e.target.value as SleepQuality })}
          />
        </div>

        {/* Stress */}
        <Select
          label="Уровень стресса"
          options={stressOptions}
          value={profile.stressLevel}
          onChange={(e) => updateProfile({ stressLevel: e.target.value as StressLevel })}
        />

        {/* Water intake */}
        <Slider
          label="Потребление воды"
          value={profile.habits.waterIntake}
          onChange={(value) => updateProfile({ 
            habits: { ...profile.habits, waterIntake: value } 
          })}
          min={0.5}
          max={4}
          step={0.1}
          unit=" л/день"
        />

        {/* Habits */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Привычки</p>
          
          <Toggle
            label="Курение"
            checked={profile.habits.smoking}
            onChange={(checked) => updateProfile({
              habits: { ...profile.habits, smoking: checked }
            })}
          />

          <Select
            label="Алкоголь"
            options={alcoholOptions}
            value={profile.habits.alcohol}
            onChange={(e) => updateProfile({
              habits: { ...profile.habits, alcohol: e.target.value as 'none' | 'occasional' | 'regular' }
            })}
          />
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
