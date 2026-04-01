import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';

export const StepWelcome = () => {
  const nextStep = useStore((state) => state.nextStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center px-4 py-8"
    >
      {/* Hero illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <span className="text-6xl">🥗</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Добро пожаловать в
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
          NutriGuide
        </span>
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Ваш персональный помощник по здоровому питанию. 
        Получите индивидуальные рекомендации и план питания за 5 минут.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
        <div className="p-4 bg-emerald-50 rounded-xl">
          <span className="text-2xl mb-2 block">📊</span>
          <h3 className="font-semibold text-gray-900">Анализ здоровья</h3>
          <p className="text-sm text-gray-500">BMI, калории, риски</p>
        </div>
        <div className="p-4 bg-teal-50 rounded-xl">
          <span className="text-2xl mb-2 block">🎯</span>
          <h3 className="font-semibold text-gray-900">Рекомендации</h3>
          <p className="text-sm text-gray-500">Персональный подход</p>
        </div>
        <div className="p-4 bg-cyan-50 rounded-xl">
          <span className="text-2xl mb-2 block">🍽️</span>
          <h3 className="font-semibold text-gray-900">План питания</h3>
          <p className="text-sm text-gray-500">Готовое меню</p>
        </div>
      </div>

      {/* CTA */}
      <Button size="lg" onClick={nextStep} className="w-full md:w-auto">
        Начать путь к здоровью
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Button>

      {/* Time estimate */}
      <p className="text-sm text-gray-400 mt-4">
        ⏱️ Займёт около 5 минут
      </p>
    </motion.div>
  );
};
