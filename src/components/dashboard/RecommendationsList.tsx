import { NutritionRecommendations, Recommendation } from '../../types';

interface RecommendationsListProps {
  recommendations: NutritionRecommendations;
}

export const RecommendationsList = ({ recommendations }: RecommendationsListProps) => {
  const groupedTips = recommendations.generalTips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  const categoryLabels: Record<string, { label: string; icon: string }> = {
    nutrition: { label: 'Питание', icon: '🥗' },
    lifestyle: { label: 'Образ жизни', icon: '🏃' },
    medical: { label: 'Медицинские', icon: '🏥' },
    general: { label: 'Общие', icon: '💡' },
  };

  const priorityStyles: Record<string, string> = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-amber-50 border-amber-200 text-amber-800',
    low: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const priorityLabels: Record<string, string> = {
    high: 'Важно',
    medium: 'Рекомендуется',
    low: 'Совет',
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">
          Ваши персональные рекомендации
        </h2>
        <p className="text-purple-100">
          {recommendations.generalTips.length} рекомендаций на основе анализа ваших данных
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {recommendations.generalTips.filter(t => t.priority === 'high').length}
          </p>
          <p className="text-xs text-red-500">Важных</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {recommendations.generalTips.filter(t => t.priority === 'medium').length}
          </p>
          <p className="text-xs text-amber-500">Рекомендуемых</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {recommendations.generalTips.filter(t => t.priority === 'low').length}
          </p>
          <p className="text-xs text-blue-500">Советов</p>
        </div>
      </div>

      {/* Grouped Recommendations */}
      {Object.entries(groupedTips).map(([category, tips]) => (
        <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>{categoryLabels[category]?.icon || '📌'}</span>
              {categoryLabels[category]?.label || category}
              <span className="ml-auto text-sm text-gray-400 font-normal">
                {tips.length} {tips.length === 1 ? 'совет' : 'советов'}
              </span>
            </h3>
          </div>
          
          <div className="p-4 space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className={`p-4 rounded-xl border ${priorityStyles[tip.priority]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold">{tip.title}</h4>
                    <p className="text-sm mt-1 opacity-80">{tip.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                    tip.priority === 'high' ? 'bg-red-200' :
                    tip.priority === 'medium' ? 'bg-amber-200' : 'bg-blue-200'
                  }`}>
                    {priorityLabels[tip.priority]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Additional Info */}
      <div className="bg-emerald-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">ℹ️</span>
          <div>
            <h4 className="font-bold text-emerald-800">Как использовать рекомендации</h4>
            <p className="text-sm text-emerald-700 mt-1">
              Начните с рекомендаций с высоким приоритетом. 
              Внедряйте изменения постепенно — по 1-2 новые привычки в неделю.
              Это поможет закрепить результат надолго.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
