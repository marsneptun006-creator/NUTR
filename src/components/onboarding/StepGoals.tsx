import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CardSelect } from '../ui/Select';
import { useStore } from '../../store/useStore';
import { Goal } from '../../types';

export const StepGoals = () => {
  const { profile, updateProfile, nextStep, prevStep } = useStore();

  const goalOptions = [
    { 
      value: 'weight_loss', 
      label: 'Похудение', 
      icon: '⚖️',
      description: 'Снизить вес безопасно' 
    },
    { 
      value: 'weight_gain', 
      label: 'Набор массы', 
      icon: '💪',
      description: 'Набрать мышечную массу' 
    },
    { 
      value: 'maintain', 
      label: 'Поддержание', 
      icon: '⚡',
      description: 'Сохранить текущий вес' 
    },
    { 
      value: 'health', 
      label: 'Здоровье', 
      icon: '❤️',
      description: 'Улучшить общее здоровье' 
    },
    { 
      value: 'energy', 
      label: 'Энергия', 
      icon: '🔋',
      description: 'Повысить энергию' 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ваши цели
        </h2>
        <p className="text-gray-600">
          Что вы хотите достичь с помощью питания?
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <CardSelect
          options={goalOptions}
          value={profile.goal}
          onChange={(value) => updateProfile({ goal: value as Goal })}
          columns={2}
        />
      </div>

      {/* Goal description */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-3xl">
            {goalOptions.find(g => g.value === profile.goal)?.icon}
          </span>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">
              {goalOptions.find(g => g.value === profile.goal)?.label}
            </h4>
            <p className="text-sm text-gray-600">
              {profile.goal === 'weight_loss' && (
                'Мы создадим умеренный дефицит калорий и подберём продукты для комфортного похудения без голодания.'
              )}
              {profile.goal === 'weight_gain' && (
                'Увеличим калорийность и белок для здорового набора массы. Подберём питательные продукты.'
              )}
              {profile.goal === 'maintain' && (
                'Рассчитаем точную норму калорий для поддержания веса и сбалансированный рацион.'
              )}
              {profile.goal === 'health' && (
                'Сфокусируемся на разнообразном питании с достаточным количеством витаминов и минералов.'
              )}
              {profile.goal === 'energy' && (
                'Подберём продукты для стабильной энергии в течение дня без скачков сахара.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Рассчитать
        </Button>
      </div>
    </motion.div>
  );
};
