import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { useStore } from '../../store/useStore';

export const StepConsent = () => {
  const { profile, updateProfile, nextStep, prevStep } = useStore();

  const canProceed = profile.consentDataProcessing && profile.consentMedicalDisclaimer;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Согласия и условия
        </h2>
        <p className="text-gray-600">
          Пожалуйста, ознакомьтесь и подтвердите условия использования
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <Checkbox
          label="Согласие на обработку данных"
          description="Я разрешаю обрабатывать мои персональные данные для создания персонализированных рекомендаций по питанию"
          checked={profile.consentDataProcessing}
          onChange={(e) => updateProfile({ consentDataProcessing: e.target.checked })}
        />

        <Checkbox
          label="Медицинский дисклеймер"
          description="Я понимаю, что данное приложение не заменяет консультацию врача. Рекомендации носят информационный характер"
          checked={profile.consentMedicalDisclaimer}
          onChange={(e) => updateProfile({ consentMedicalDisclaimer: e.target.checked })}
        />
      </div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div className="flex gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h4 className="font-semibold text-amber-800">Важно</h4>
            <p className="text-sm text-amber-700">
              Если у вас есть серьёзные заболевания, обязательно проконсультируйтесь 
              с врачом перед изменением рациона питания.
            </p>
          </div>
        </div>
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
