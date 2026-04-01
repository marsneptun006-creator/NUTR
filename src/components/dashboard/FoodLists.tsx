import { useState } from 'react';
import { NutritionRecommendations, FoodCategory } from '../../types';

interface FoodListsProps {
  recommendations: NutritionRecommendations;
}

export const FoodLists = ({ recommendations }: FoodListsProps) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'restricted'>('recommended');

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'recommended'
              ? 'bg-white text-emerald-600 shadow'
              : 'text-gray-600'
          }`}
        >
          ✅ Рекомендуемые
        </button>
        <button
          onClick={() => setActiveTab('restricted')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'restricted'
              ? 'bg-white text-red-600 shadow'
              : 'text-gray-600'
          }`}
        >
          🚫 Ограниченные
        </button>
      </div>

      {/* Content */}
      {activeTab === 'recommended' ? (
        <RecommendedFoods foods={recommendations.recommendedFoods} />
      ) : (
        <RestrictedFoods foods={recommendations.restrictedFoods} />
      )}
    </div>
  );
};

const RecommendedFoods = ({ foods }: { foods: FoodCategory[] }) => (
  <div className="space-y-4">
    <div className="bg-emerald-50 rounded-xl p-4 mb-6">
      <p className="text-emerald-800">
        <span className="font-bold">💡 Совет:</span> Старайтесь включать продукты из каждой категории 
        в ваш ежедневный рацион для получения всех необходимых нутриентов.
      </p>
    </div>

    {foods.map((category, index) => (
      <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
          <h3 className="font-bold text-white">{category.category}</h3>
          {category.reason && (
            <p className="text-emerald-100 text-sm mt-1">{category.reason}</p>
          )}
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {category.items.map((item, itemIndex) => (
              <span
                key={itemIndex}
                className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RestrictedFoods = ({ foods }: { foods: FoodCategory[] }) => (
  <div className="space-y-4">
    <div className="bg-amber-50 rounded-xl p-4 mb-6">
      <p className="text-amber-800">
        <span className="font-bold">⚠️ Внимание:</span> Эти продукты следует ограничить или исключить 
        в соответствии с вашими целями и состоянием здоровья.
      </p>
    </div>

    {foods.map((category, index) => (
      <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className={`px-6 py-4 ${
          category.category.includes('аллерген') 
            ? 'bg-gradient-to-r from-red-500 to-pink-500'
            : 'bg-gradient-to-r from-amber-500 to-orange-500'
        }`}>
          <h3 className="font-bold text-white">{category.category}</h3>
          {category.reason && (
            <p className="text-white/80 text-sm mt-1">{category.reason}</p>
          )}
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {category.items.map((item, itemIndex) => (
              <span
                key={itemIndex}
                className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);
