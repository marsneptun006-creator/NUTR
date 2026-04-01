// ==========================================
// ТИПЫ ДАННЫХ ДЛЯ ПРИЛОЖЕНИЯ ЗДОРОВОГО ПИТАНИЯ
// ==========================================

// === ПОЛЬЗОВАТЕЛЬСКИЕ ДАННЫЕ ===

export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type StressLevel = 'low' | 'medium' | 'high';

export type SleepQuality = 'poor' | 'average' | 'good' | 'excellent';

export type Goal = 'weight_loss' | 'weight_gain' | 'maintain' | 'health' | 'energy';

export type DietType = 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'halal' | 'kosher';

// Заболевания
export interface MedicalConditions {
  diabetes: boolean;
  hypertension: boolean;
  highCholesterol: boolean;
  digestiveIssues: boolean;
  heartDisease: boolean;
  kidneyDisease: boolean;
  thyroidDisorder: boolean;
  other: string;
}

// Аллергии
export interface Allergies {
  gluten: boolean;
  lactose: boolean;
  nuts: boolean;
  seafood: boolean;
  eggs: boolean;
  soy: boolean;
  other: string;
}

// Привычки
export interface Habits {
  smoking: boolean;
  alcohol: 'none' | 'occasional' | 'regular';
  caffeine: 'none' | 'low' | 'moderate' | 'high';
  waterIntake: number; // литров в день
}

// Профиль пользователя
export interface UserProfile {
  // Базовые данные
  name: string;
  email: string;
  
  // Антропометрия
  gender: Gender;
  age: number;
  height: number; // см
  weight: number; // кг
  targetWeight?: number; // целевой вес
  
  // Образ жизни
  activityLevel: ActivityLevel;
  sleepHours: number;
  sleepQuality: SleepQuality;
  stressLevel: StressLevel;
  habits: Habits;
  
  // Медицинские данные
  medicalConditions: MedicalConditions;
  allergies: Allergies;
  medications: string;
  
  // Питание
  goal: Goal;
  dietType: DietType;
  mealsPerDay: number;
  
  // Согласия
  consentDataProcessing: boolean;
  consentMedicalDisclaimer: boolean;
  
  // Метаданные
  createdAt: Date;
  updatedAt: Date;
}

// === МЕТРИКИ ЗДОРОВЬЯ ===

export interface HealthMetrics {
  bmi: number;
  bmiCategory: BMICategory;
  bmr: number; // базальный метаболизм
  tdee: number; // суточный расход калорий
  targetCalories: number; // целевые калории
  healthScore: number; // 0-100
  riskFactors: RiskFactor[];
}

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface RiskFactor {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// === РЕКОМЕНДАЦИИ ===

export interface Macronutrients {
  protein: number; // граммы
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recommendation {
  id: string;
  category: 'nutrition' | 'lifestyle' | 'medical' | 'general';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  icon?: string;
}

export interface NutritionRecommendations {
  // Общие рекомендации
  generalTips: Recommendation[];
  
  // Макронутриенты
  macros: Macronutrients;
  macroRatio: {
    protein: number; // процент
    carbs: number;
    fat: number;
  };
  
  // Калории
  dailyCalories: number;
  
  // Продукты
  recommendedFoods: FoodCategory[];
  restrictedFoods: FoodCategory[];
  
  // Водный баланс
  dailyWaterIntake: number; // литры
  
  // Витамины и минералы
  supplements: string[];
}

export interface FoodCategory {
  category: string;
  items: string[];
  reason?: string;
}

// === ПЛАН ПИТАНИЯ ===

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  portion: string;
  category: string;
}

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  recipe?: string;
  prepTime?: number; // минуты
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DailyMealPlan {
  date: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
  totalMacros: Macronutrients;
}

export interface WeeklyMealPlan {
  startDate: string;
  endDate: string;
  days: DailyMealPlan[];
  shoppingList: ShoppingItem[];
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  category: string;
}

// === ONBOARDING ===

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 0, title: 'Добро пожаловать', description: 'Начните путь к здоровью', isCompleted: false },
  { id: 1, title: 'Согласия', description: 'Подтвердите условия', isCompleted: false },
  { id: 2, title: 'Основные данные', description: 'Расскажите о себе', isCompleted: false },
  { id: 3, title: 'Антропометрия', description: 'Ваши параметры тела', isCompleted: false },
  { id: 4, title: 'Образ жизни', description: 'Активность и привычки', isCompleted: false },
  { id: 5, title: 'Здоровье', description: 'Медицинские данные', isCompleted: false },
  { id: 6, title: 'Питание', description: 'Ваши предпочтения', isCompleted: false },
  { id: 7, title: 'Цели', description: 'Чего хотите достичь', isCompleted: false },
  { id: 8, title: 'Анализ', description: 'Расчёт показателей', isCompleted: false },
  { id: 9, title: 'Результаты', description: 'Ваш план здоровья', isCompleted: false },
];
