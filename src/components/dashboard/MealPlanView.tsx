import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { DailyMealPlan, Meal, MealType } from '../../types';

export const MealPlanView = () => {
  const { 
    dailyMealPlan, 
    weeklyMealPlan, 
    generateDailyMealPlan, 
    generateWeeklyMealPlan,
    isLoading 
  } = useStore();
  
  const [planType, setPlanType] = useState<'daily' | 'weekly'>('daily');
  const [selectedDay, setSelectedDay] = useState(0);

  const handleGenerate = () => {
    if (planType === 'daily') {
      generateDailyMealPlan();
    } else {
      generateWeeklyMealPlan();
    }
  };

  const currentPlan = planType === 'daily' 
    ? dailyMealPlan 
    : weeklyMealPlan?.days[selectedDay];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">🍽️ План питания</h2>
        <p className="text-orange-100">
          Персонализированное меню с учётом ваших целей и ограничений
        </p>
      </div>

      {/* Plan Type Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setPlanType('daily')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            planType === 'daily'
              ? 'bg-white text-orange-600 shadow'
              : 'text-gray-600'
          }`}
        >
          📅 На день
        </button>
        <button
          onClick={() => setPlanType('weekly')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            planType === 'weekly'
              ? 'bg-white text-orange-600 shadow'
              : 'text-gray-600'
          }`}
        >
          📆 На неделю
        </button>
      </div>

      {/* Generate Button */}
      <Button 
        onClick={handleGenerate} 
        isLoading={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Генерируем...' : `🔄 Сгенерировать ${planType === 'daily' ? 'дневное' : 'недельное'} меню`}
      </Button>

      {/* Weekly Day Selector */}
      {planType === 'weekly' && weeklyMealPlan && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedDay === index
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Meal Plan Content */}
      {currentPlan ? (
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Summary */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {currentPlan.totalCalories}
                </p>
                <p className="text-xs text-gray-500">ккал</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">
                  {currentPlan.totalMacros.protein}г
                </p>
                <p className="text-xs text-gray-500">белок</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">
                  {currentPlan.totalMacros.carbs}г
                </p>
                <p className="text-xs text-gray-500">углеводы</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {currentPlan.totalMacros.fat}г
                </p>
                <p className="text-xs text-gray-500">жиры</p>
              </div>
            </div>
          </div>

          {/* Meals */}
          <MealCard meal={currentPlan.breakfast} icon="🌅" title="Завтрак" />
          <MealCard meal={currentPlan.lunch} icon="☀️" title="Обед" />
          <MealCard meal={currentPlan.dinner} icon="🌙" title="Ужин" />
          
          {currentPlan.snacks.map((snack, index) => (
            <MealCard 
              key={index} 
              meal={snack} 
              icon="🍎" 
              title={`Перекус ${index + 1}`} 
            />
          ))}
        </motion.div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <span className="text-6xl mb-4 block">🍽️</span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            План питания не создан
          </h3>
          <p className="text-gray-600 mb-4">
            Нажмите кнопку выше, чтобы сгенерировать персональное меню
          </p>
        </div>
      )}

      {/* Shopping List (for weekly) */}
      {planType === 'weekly' && weeklyMealPlan && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛒</span>
            Список покупок на неделю
          </h3>
          <div className="flex flex-wrap gap-2">
            {weeklyMealPlan.shoppingList.slice(0, 20).map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {item.name}
              </span>
            ))}
            {weeklyMealPlan.shoppingList.length > 20 && (
              <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                +{weeklyMealPlan.shoppingList.length - 20} ещё
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Meal Card Component
interface MealCardProps {
  meal: Meal;
  icon: string;
  title: string;
}

const MealCard = ({ meal, icon, title }: MealCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{icon}</span>
          <div className="text-left">
            <h4 className="font-bold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{meal.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-orange-600 font-bold">
            {meal.totalCalories} ккал
          </span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 border-t"
        >
          {/* Macros */}
          <div className="flex gap-4 py-3 text-sm">
            <span className="text-red-500">Б: {meal.totalProtein}г</span>
            <span className="text-yellow-500">У: {meal.totalCarbs}г</span>
            <span className="text-green-500">Ж: {meal.totalFat}г</span>
          </div>

          {/* Foods */}
          <div className="space-y-2">
            {meal.foods.map((food, index) => (
              <div 
                key={index}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{food.name}</p>
                  <p className="text-xs text-gray-500">{food.portion}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-700">{food.calories} ккал</p>
                  <p className="text-xs text-gray-400">
                    Б:{food.protein}г У:{food.carbs}г Ж:{food.fat}г
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recipe */}
          {meal.recipe && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-1">📝 Рецепт:</p>
              <p className="text-sm text-amber-700 whitespace-pre-line">{meal.recipe}</p>
            </div>
          )}

          {/* Prep time */}
          {meal.prepTime && (
            <p className="text-sm text-gray-500 mt-2">
              ⏱️ Время приготовления: {meal.prepTime} мин
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};
