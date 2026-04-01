import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CardSelect, Select } from '../ui/Select';
import { useStore } from '../../store/useStore';
import { DietType } from '../../types';

export const StepNutrition = () => {
  const { profile, updateProfile, nextStep, prevStep } = useStore();

  const dietOptions = [
    { value: 'none', label: 'Без ограничений', icon: '🍽️' },
    { value: 'vegetarian', label: 'Вегетарианство', icon: '🥗' },
    { value: 'vegan', label: 'Веганство', icon: '🌱' },
    { value: 'keto', label: 'Кето', icon: '🥑' },
    { value: 'paleo', label: 'Палео', icon: '🍖' },
    { value: 'mediterranean', label: 'Средиземноморская', icon: '🫒' },
    { value: 'halal', label: 'Халяль', icon: '☪️' },
    { value: 'kosher', label: 'Кошер', icon: '✡️' },
  ];

  const mealsOptions = [
    { value: '2', label: '2 приёма' },
    { value: '3', label: '3 приёма' },
    { value: '4', label: '4 приёма' },
    { value: '5', label: '5 приёмов' },
    { value: '6', label: '6 приёмов' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🥗</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Питание
        </h2>
        <p className="text-gray-600">
          Ваши предпочтения и ограничения в питании
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Diet type */}
        <CardSelect
          label="Тип питания"
          options={dietOptions}
          value={profile.dietType}
          onChange={(value) => updateProfile({ dietType: value as DietType })}
          columns={4}
        />

        {/* Meals per day */}
        <Select
          label="Количество приёмов пищи в день"
          options={mealsOptions}
          value={String(profile.mealsPerDay)}
          onChange={(e) => updateProfile({ mealsPerDay: parseInt(e.target.value) })}
        />
      </div>

      {/* Diet info */}
      {profile.dietType !== 'none' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <span className="text-xl">✅</span>
            <div>
              <h4 className="font-semibold text-emerald-800">
                {dietOptions.find(d => d.value === profile.dietType)?.label}
              </h4>
              <p className="text-sm text-emerald-700">
                Мы учтём это при составлении рекомендаций и меню
              </p>
            </div>
          </div>
        </div>
      )}

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
