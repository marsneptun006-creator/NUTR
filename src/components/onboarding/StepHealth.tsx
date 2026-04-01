import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Checkbox';
import { Input } from '../ui/Input';
import { useStore } from '../../store/useStore';

export const StepHealth = () => {
  const { profile, updateProfile, nextStep, prevStep } = useStore();

  const updateCondition = (key: keyof typeof profile.medicalConditions, value: boolean | string) => {
    updateProfile({
      medicalConditions: { ...profile.medicalConditions, [key]: value }
    });
  };

  const updateAllergy = (key: keyof typeof profile.allergies, value: boolean | string) => {
    updateProfile({
      allergies: { ...profile.allergies, [key]: value }
    });
  };

  const conditions = [
    { key: 'diabetes' as const, label: 'Сахарный диабет', icon: '🩺' },
    { key: 'hypertension' as const, label: 'Гипертония', icon: '❤️' },
    { key: 'highCholesterol' as const, label: 'Повышенный холестерин', icon: '🔬' },
    { key: 'digestiveIssues' as const, label: 'Проблемы с ЖКТ', icon: '🫃' },
    { key: 'heartDisease' as const, label: 'Заболевания сердца', icon: '💔' },
    { key: 'kidneyDisease' as const, label: 'Заболевания почек', icon: '🫘' },
    { key: 'thyroidDisorder' as const, label: 'Щитовидная железа', icon: '🦋' },
  ];

  const allergies = [
    { key: 'gluten' as const, label: 'Глютен', icon: '🌾' },
    { key: 'lactose' as const, label: 'Лактоза', icon: '🥛' },
    { key: 'nuts' as const, label: 'Орехи', icon: '🥜' },
    { key: 'seafood' as const, label: 'Морепродукты', icon: '🦐' },
    { key: 'eggs' as const, label: 'Яйца', icon: '🥚' },
    { key: 'soy' as const, label: 'Соя', icon: '🫘' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🏥</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Здоровье
        </h2>
        <p className="text-gray-600">
          Эта информация поможет учесть особенности вашего здоровья
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Medical conditions */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Заболевания</p>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <Toggle
                key={condition.key}
                label={`${condition.icon} ${condition.label}`}
                checked={profile.medicalConditions[condition.key] as boolean}
                onChange={(checked) => updateCondition(condition.key, checked)}
              />
            ))}
          </div>
          <Input
            label="Другие заболевания"
            placeholder="Укажите, если есть"
            value={profile.medicalConditions.other}
            onChange={(e) => updateCondition('other', e.target.value)}
            className="mt-3"
          />
        </div>

        {/* Allergies */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Аллергии и непереносимости</p>
          <div className="grid grid-cols-2 gap-2">
            {allergies.map((allergy) => (
              <Toggle
                key={allergy.key}
                label={`${allergy.icon} ${allergy.label}`}
                checked={profile.allergies[allergy.key] as boolean}
                onChange={(checked) => updateAllergy(allergy.key, checked)}
              />
            ))}
          </div>
          <Input
            label="Другие аллергии"
            placeholder="Укажите, если есть"
            value={profile.allergies.other}
            onChange={(e) => updateAllergy('other', e.target.value)}
            className="mt-3"
          />
        </div>

        {/* Medications */}
        <Input
          label="Принимаемые лекарства"
          placeholder="Перечислите лекарства, если принимаете"
          value={profile.medications}
          onChange={(e) => updateProfile({ medications: e.target.value })}
        />
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <div className="flex gap-3">
          <span className="text-xl">ℹ️</span>
          <p className="text-sm text-blue-700">
            Вся информация конфиденциальна и используется только 
            для персонализации рекомендаций.
          </p>
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
