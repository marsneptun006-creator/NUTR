import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface MacrosChartProps {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const MacrosChart = ({ macros }: MacrosChartProps) => {
  const data = [
    { name: 'Белки', value: macros.protein, color: '#ef4444' },
    { name: 'Углеводы', value: macros.carbs, color: '#f59e0b' },
    { name: 'Жиры', value: macros.fat, color: '#22c55e' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📊</span>
        Соотношение макронутриентов
      </h3>

      <div className="flex items-center justify-between">
        {/* Chart */}
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 ml-8 space-y-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Соотношение рассчитано индивидуально на основе ваших целей, 
          уровня активности и состояния здоровья.
        </p>
      </div>
    </div>
  );
};
