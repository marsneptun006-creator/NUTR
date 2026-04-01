import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { HealthScoreCard } from './HealthScoreCard';
import { MacrosChart } from './MacrosChart';
import { RecommendationsList } from './RecommendationsList';
import { FoodLists } from './FoodLists';
import { MealPlanView } from './MealPlanView';
import { Button } from '../ui/Button';

type Tab = 'overview' | 'recommendations' | 'foods' | 'mealplan';

export const Dashboard = () => {
  const { profile, healthMetrics, recommendations, resetAll } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!healthMetrics || !recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Данные не найдены</p>
          <Button onClick={resetAll}>Начать заново</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Обзор', icon: '📊' },
    { id: 'recommendations' as Tab, label: 'Советы', icon: '💡' },
    { id: 'foods' as Tab, label: 'Продукты', icon: '🥗' },
    { id: 'mealplan' as Tab, label: 'Меню', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                NutriGuide
              </h1>
              <p className="text-sm text-gray-500">
                Привет, {profile.name || 'друг'}! 👋
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetAll}>
              Заново
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab 
              healthMetrics={healthMetrics} 
              recommendations={recommendations}
              profile={profile}
            />
          )}
          {activeTab === 'recommendations' && (
            <RecommendationsList recommendations={recommendations} />
          )}
          {activeTab === 'foods' && (
            <FoodLists recommendations={recommendations} />
          )}
          {activeTab === 'mealplan' && <MealPlanView />}
        </motion.div>
      </main>
    </div>
  );
};

// Overview Tab Component
import { HealthMetrics, NutritionRecommendations, UserProfile } from '../../types';

interface OverviewTabProps {
  healthMetrics: HealthMetrics;
  recommendations: NutritionRecommendations;
  profile: UserProfile;
}

const OverviewTab = ({ healthMetrics, recommendations, profile }: OverviewTabProps) => {
  if (!healthMetrics || !recommendations) return null;

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <HealthScoreCard metrics={healthMetrics} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="🔥"
          label="Калории"
          value={`${recommendations.dailyCalories}`}
          unit="ккал/день"
          color="orange"
        />
        <StatCard
          icon="🥩"
          label="Белок"
          value={`${recommendations.macros.protein}`}
          unit="г/день"
          color="red"
        />
        <StatCard
          icon="🍞"
          label="Углеводы"
          value={`${recommendations.macros.carbs}`}
          unit="г/день"
          color="yellow"
        />
        <StatCard
          icon="🥑"
          label="Жиры"
          value={`${recommendations.macros.fat}`}
          unit="г/день"
          color="green"
        />
      </div>

      {/* Macros Chart */}
      <MacrosChart macros={recommendations.macroRatio} />

      {/* Top Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Главные рекомендации
        </h3>
        <div className="space-y-3">
          {recommendations.generalTips.slice(0, 3).map((tip) => (
            <div
              key={tip.id}
              className={`p-4 rounded-xl border-l-4 ${
                tip.priority === 'high'
                  ? 'bg-red-50 border-red-400'
                  : tip.priority === 'medium'
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-blue-50 border-blue-400'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{tip.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Water & Supplements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">💧</span>
            <div>
              <p className="text-blue-100">Норма воды</p>
              <p className="text-2xl font-bold">{recommendations.dailyWaterIntake} л/день</p>
            </div>
          </div>
          <p className="text-sm text-blue-100 mt-2">
            Это {Math.round(recommendations.dailyWaterIntake * 4)} стаканов воды
          </p>
        </div>

        {recommendations.supplements.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>💊</span>
              Рекомендуемые добавки
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.supplements.map((supplement, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {supplement}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risk Factors */}
      {healthMetrics.riskFactors.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            Факторы риска
          </h3>
          <div className="space-y-2">
            {healthMetrics.riskFactors.map((risk) => (
              <div
                key={risk.id}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  risk.severity === 'high'
                    ? 'bg-red-50'
                    : risk.severity === 'medium'
                    ? 'bg-amber-50'
                    : 'bg-gray-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full mt-2 ${
                  risk.severity === 'high'
                    ? 'bg-red-500'
                    : risk.severity === 'medium'
                    ? 'bg-amber-500'
                    : 'bg-gray-400'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{risk.name}</p>
                  <p className="text-sm text-gray-600">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: 'orange' | 'red' | 'yellow' | 'green';
}

const StatCard = ({ icon, label, value, unit, color }: StatCardProps) => {
  const colors = {
    orange: 'from-orange-500 to-amber-500',
    red: 'from-red-500 to-pink-500',
    yellow: 'from-yellow-500 to-orange-500',
    green: 'from-emerald-500 to-teal-500',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
};
