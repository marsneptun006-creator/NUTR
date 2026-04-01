import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

export const StepAnalysis = () => {
  const { 
    calculateHealthMetrics, 
    generateRecommendations, 
    nextStep,
    profile
  } = useStore();
  
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    { icon: '📊', text: 'Анализируем данные...', duration: 800 },
    { icon: '🧮', text: 'Рассчитываем BMI и калории...', duration: 1000 },
    { icon: '🔍', text: 'Оцениваем факторы риска...', duration: 800 },
    { icon: '🎯', text: 'Генерируем рекомендации...', duration: 1200 },
    { icon: '🍽️', text: 'Подбираем продукты...', duration: 800 },
    { icon: '✨', text: 'Готово!', duration: 500 },
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runAnalysis = async () => {
      for (let i = 0; i < phases.length; i++) {
        await new Promise(resolve => {
          timeout = setTimeout(resolve, phases[i].duration);
        });
        setCurrentPhase(i + 1);

        // Выполняем реальные расчёты на определённых фазах
        if (i === 1) {
          calculateHealthMetrics();
        }
        if (i === 3) {
          generateRecommendations();
        }
      }

      setIsComplete(true);
      
      // Переходим к результатам
      await new Promise(resolve => {
        timeout = setTimeout(resolve, 1000);
      });
      nextStep();
    };

    runAnalysis();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-8 min-h-[60vh] flex flex-col items-center justify-center"
    >
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Анализируем ваши данные
        </h2>
        <p className="text-gray-600">
          Подождите, мы создаём персональный план для {profile.name || 'вас'}
        </p>
      </div>

      {/* Progress circle */}
      <div className="relative w-40 h-40 mb-8">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentPhase / phases.length }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              strokeDasharray: "440",
              strokeDashoffset: "0",
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentPhase}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-5xl"
            >
              {phases[Math.min(currentPhase, phases.length - 1)]?.icon}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Current phase text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg font-medium text-gray-700"
        >
          {phases[Math.min(currentPhase, phases.length - 1)]?.text}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-full max-w-xs mt-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentPhase / phases.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          {Math.round((currentPhase / phases.length) * 100)}%
        </p>
      </div>

      {/* Complete message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-emerald-600 font-semibold">
            Ваш персональный план готов!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
