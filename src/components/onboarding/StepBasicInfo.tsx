import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CardSelect } from '../ui/Select';
import { useStore } from '../../store/useStore';

export const StepBasicInfo = () => {
  const { profile, updateProfile, nextStep, prevStep } = useStore();

  const genderOptions = [
    { value: 'male', label: 'Мужской', icon: '👨' },
    { value: 'female', label: 'Женский', icon: '👩' },
  ];

  const canProceed = profile.name.trim().length > 0 && profile.age > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Основные данные
        </h2>
        <p className="text-gray-600">
          Расскажите немного о себе
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <Input
          label="Ваше имя"
          placeholder="Введите ваше имя"
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
        />

        <Input
          label="Email (опционально)"
          type="email"
          placeholder="example@mail.com"
          value={profile.email}
          onChange={(e) => updateProfile({ email: e.target.value })}
        />

        <Input
          label="Возраст"
          type="number"
          placeholder="25"
          min={14}
          max={100}
          value={profile.age || ''}
          onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
        />

        <CardSelect
          label="Пол"
          options={genderOptions}
          value={profile.gender}
          onChange={(value) => updateProfile({ gender: value as 'male' | 'female' })}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={nextStep} 
          disabled={!canProceed}
          className="flex-1"
        >
          Продолжить
        </Button>
      </div>
    </motion.div>
  );
};
