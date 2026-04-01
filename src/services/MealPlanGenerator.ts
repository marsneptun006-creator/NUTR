// ==========================================
// ГЕНЕРАТОР ПЛАНА ПИТАНИЯ
// ==========================================

import {
  UserProfile,
  NutritionRecommendations,
  Meal,
  MealType,
  FoodItem,
  DailyMealPlan,
  WeeklyMealPlan,
  Macronutrients,
  ShoppingItem,
} from '../types';

/**
 * База данных продуктов и блюд
 */
interface MealTemplate {
  id: string;
  name: string;
  type: MealType;
  foods: FoodItem[];
  tags: string[];
  recipe?: string;
  prepTime?: number;
}

/**
 * Генератор персонализированного плана питания
 */
export class MealPlanGenerator {
  private profile: UserProfile;
  private recommendations: NutritionRecommendations;
  private mealDatabase: MealTemplate[];

  constructor(profile: UserProfile, recommendations: NutritionRecommendations) {
    this.profile = profile;
    this.recommendations = recommendations;
    this.mealDatabase = this.initializeMealDatabase();
  }

  /**
   * Генерация плана питания на 1 день
   */
  generateDailyPlan(date: string = new Date().toISOString().split('T')[0]): DailyMealPlan {
    const targetCalories = this.recommendations.dailyCalories;
    const targetMacros = this.recommendations.macros;

    // Распределение калорий по приёмам пищи
    const calorieDistribution = {
      breakfast: 0.25, // 25%
      lunch: 0.35,     // 35%
      dinner: 0.25,    // 25%
      snacks: 0.15,    // 15%
    };

    // Генерируем каждый приём пищи
    const breakfast = this.generateMeal('breakfast', targetCalories * calorieDistribution.breakfast);
    const lunch = this.generateMeal('lunch', targetCalories * calorieDistribution.lunch);
    const dinner = this.generateMeal('dinner', targetCalories * calorieDistribution.dinner);
    const snacks = [this.generateMeal('snack', targetCalories * calorieDistribution.snacks)];

    // Подсчёт итогов
    const totalCalories = breakfast.totalCalories + lunch.totalCalories + 
                          dinner.totalCalories + snacks.reduce((sum, s) => sum + s.totalCalories, 0);
    
    const totalMacros: Macronutrients = {
      protein: breakfast.totalProtein + lunch.totalProtein + dinner.totalProtein + snacks.reduce((s, m) => s + m.totalProtein, 0),
      carbs: breakfast.totalCarbs + lunch.totalCarbs + dinner.totalCarbs + snacks.reduce((s, m) => s + m.totalCarbs, 0),
      fat: breakfast.totalFat + lunch.totalFat + dinner.totalFat + snacks.reduce((s, m) => s + m.totalFat, 0),
      fiber: targetMacros.fiber,
    };

    return {
      date,
      breakfast,
      lunch,
      dinner,
      snacks,
      totalCalories: Math.round(totalCalories),
      totalMacros,
    };
  }

  /**
   * Генерация плана питания на неделю
   */
  generateWeeklyPlan(): WeeklyMealPlan {
    const days: DailyMealPlan[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Добавляем случайность для разнообразия
      days.push(this.generateDailyPlan(dateStr));
    }

    const shoppingList = this.generateShoppingList(days);

    return {
      startDate: days[0].date,
      endDate: days[6].date,
      days,
      shoppingList,
    };
  }

  /**
   * Генерация одного приёма пищи
   */
  private generateMeal(type: MealType, targetCalories: number): Meal {
    const availableMeals = this.filterMealsByRestrictions(
      this.mealDatabase.filter(m => m.type === type)
    );

    if (availableMeals.length === 0) {
      // Если нет подходящих блюд, создаём дефолтное
      return this.createDefaultMeal(type, targetCalories);
    }

    // Выбираем случайное блюдо с учётом калорийности
    const selectedMeals = availableMeals.filter(m => {
      const mealCalories = m.foods.reduce((sum, f) => sum + f.calories, 0);
      return mealCalories >= targetCalories * 0.7 && mealCalories <= targetCalories * 1.3;
    });

    const meal = selectedMeals.length > 0
      ? selectedMeals[Math.floor(Math.random() * selectedMeals.length)]
      : availableMeals[Math.floor(Math.random() * availableMeals.length)];

    // Масштабируем порции под целевые калории
    const scaledFoods = this.scaleFoodsToCalories(meal.foods, targetCalories);

    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: meal.name,
      foods: scaledFoods,
      totalCalories: Math.round(scaledFoods.reduce((sum, f) => sum + f.calories, 0)),
      totalProtein: Math.round(scaledFoods.reduce((sum, f) => sum + f.protein, 0)),
      totalCarbs: Math.round(scaledFoods.reduce((sum, f) => sum + f.carbs, 0)),
      totalFat: Math.round(scaledFoods.reduce((sum, f) => sum + f.fat, 0)),
      recipe: meal.recipe,
      prepTime: meal.prepTime,
    };
  }

  /**
   * Создание дефолтного блюда
   */
  private createDefaultMeal(type: MealType, targetCalories: number): Meal {
    const defaultMeals: Record<MealType, { name: string; foods: FoodItem[] }> = {
      breakfast: {
        name: 'Базовый завтрак',
        foods: [
          this.createFood('Овсянка', 150, 5, 27, 3, '100г'),
          this.createFood('Ягоды', 40, 0.5, 10, 0.3, '50г'),
          this.createFood('Мёд', 60, 0, 15, 0, '1 ст.л.'),
        ],
      },
      lunch: {
        name: 'Базовый обед',
        foods: [
          this.createFood('Курица отварная', 165, 31, 0, 3.6, '100г'),
          this.createFood('Бурый рис', 110, 2.5, 23, 0.8, '100г'),
          this.createFood('Овощи на пару', 50, 2, 10, 0.5, '150г'),
        ],
      },
      dinner: {
        name: 'Базовый ужин',
        foods: [
          this.createFood('Рыба запечённая', 150, 25, 0, 5, '150г'),
          this.createFood('Салат овощной', 80, 2, 12, 3, '200г'),
          this.createFood('Оливковое масло', 45, 0, 0, 5, '0.5 ст.л.'),
        ],
      },
      snack: {
        name: 'Перекус',
        foods: [
          this.createFood('Орехи', 150, 5, 5, 13, '30г'),
          this.createFood('Яблоко', 52, 0.3, 14, 0.2, '1 шт'),
        ],
      },
    };

    const defaultMeal = defaultMeals[type];
    const scaledFoods = this.scaleFoodsToCalories(defaultMeal.foods, targetCalories);

    return {
      id: `${type}-default-${Date.now()}`,
      type,
      name: defaultMeal.name,
      foods: scaledFoods,
      totalCalories: Math.round(scaledFoods.reduce((sum, f) => sum + f.calories, 0)),
      totalProtein: Math.round(scaledFoods.reduce((sum, f) => sum + f.protein, 0)),
      totalCarbs: Math.round(scaledFoods.reduce((sum, f) => sum + f.carbs, 0)),
      totalFat: Math.round(scaledFoods.reduce((sum, f) => sum + f.fat, 0)),
    };
  }

  /**
   * Вспомогательный метод создания продукта
   */
  private createFood(
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    portion: string
  ): FoodItem {
    return {
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      calories,
      protein,
      carbs,
      fat,
      fiber: 0,
      portion,
      category: 'general',
    };
  }

  /**
   * Фильтрация блюд по ограничениям пользователя
   */
  private filterMealsByRestrictions(meals: MealTemplate[]): MealTemplate[] {
    const { profile } = this;

    return meals.filter(meal => {
      // Проверка аллергий
      if (profile.allergies.gluten && meal.tags.includes('gluten')) return false;
      if (profile.allergies.lactose && meal.tags.includes('dairy')) return false;
      if (profile.allergies.nuts && meal.tags.includes('nuts')) return false;
      if (profile.allergies.seafood && meal.tags.includes('seafood')) return false;
      if (profile.allergies.eggs && meal.tags.includes('eggs')) return false;
      if (profile.allergies.soy && meal.tags.includes('soy')) return false;

      // Проверка диетических ограничений
      if (profile.dietType === 'vegan' && !meal.tags.includes('vegan')) return false;
      if (profile.dietType === 'vegetarian' && meal.tags.includes('meat')) return false;
      if (profile.dietType === 'halal' && meal.tags.includes('pork')) return false;
      if (profile.dietType === 'kosher' && meal.tags.includes('pork')) return false;
      if (profile.dietType === 'keto' && meal.tags.includes('high-carb')) return false;

      // Проверка медицинских ограничений
      if (profile.medicalConditions.diabetes && meal.tags.includes('high-sugar')) return false;
      if (profile.medicalConditions.digestiveIssues && meal.tags.includes('spicy')) return false;

      return true;
    });
  }

  /**
   * Масштабирование продуктов под целевые калории
   */
  private scaleFoodsToCalories(foods: FoodItem[], targetCalories: number): FoodItem[] {
    const currentCalories = foods.reduce((sum, f) => sum + f.calories, 0);
    
    if (currentCalories === 0) return foods;
    
    const scale = targetCalories / currentCalories;

    return foods.map(food => ({
      ...food,
      id: `${food.id}-scaled`,
      calories: Math.round(food.calories * scale),
      protein: Math.round(food.protein * scale * 10) / 10,
      carbs: Math.round(food.carbs * scale * 10) / 10,
      fat: Math.round(food.fat * scale * 10) / 10,
    }));
  }

  /**
   * Генерация списка покупок
   */
  private generateShoppingList(days: DailyMealPlan[]): ShoppingItem[] {
    const itemsMap = new Map<string, { quantity: number; category: string }>();

    // Собираем все продукты из всех дней
    for (const day of days) {
      const allMeals = [day.breakfast, day.lunch, day.dinner, ...day.snacks];
      
      for (const meal of allMeals) {
        for (const food of meal.foods) {
          const existing = itemsMap.get(food.name);
          if (existing) {
            existing.quantity += 1;
          } else {
            itemsMap.set(food.name, { quantity: 1, category: food.category });
          }
        }
      }
    }

    // Преобразуем в массив
    return Array.from(itemsMap.entries()).map(([name, data]) => ({
      name,
      quantity: data.quantity > 1 ? `${data.quantity} порции` : '1 порция',
      category: data.category,
    }));
  }

  /**
   * Инициализация базы данных блюд
   */
  private initializeMealDatabase(): MealTemplate[] {
    return [
      // === ЗАВТРАКИ ===
      {
        id: 'breakfast-1',
        name: 'Овсянка с ягодами и орехами',
        type: 'breakfast',
        tags: ['vegetarian', 'gluten', 'nuts'],
        foods: [
          { id: 'oat-1', name: 'Овсянка', calories: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4, portion: '50г (сухая)', category: 'grains' },
          { id: 'berries-1', name: 'Ягоды (микс)', calories: 50, protein: 0.7, carbs: 12, fat: 0.3, fiber: 3, portion: '100г', category: 'fruits' },
          { id: 'nuts-1', name: 'Грецкие орехи', calories: 100, protein: 2.5, carbs: 2, fat: 10, fiber: 1, portion: '15г', category: 'nuts' },
          { id: 'honey-1', name: 'Мёд', calories: 30, protein: 0, carbs: 8, fat: 0, fiber: 0, portion: '10г', category: 'sweets' },
        ],
        recipe: '1. Сварите овсянку на воде или молоке\n2. Добавьте ягоды и орехи\n3. Полейте мёдом',
        prepTime: 10,
      },
      {
        id: 'breakfast-2',
        name: 'Творог с фруктами',
        type: 'breakfast',
        tags: ['vegetarian', 'dairy'],
        foods: [
          { id: 'cottage-1', name: 'Творог 5%', calories: 120, protein: 17, carbs: 3, fat: 5, fiber: 0, portion: '150г', category: 'dairy' },
          { id: 'banana-1', name: 'Банан', calories: 90, protein: 1, carbs: 23, fat: 0.3, fiber: 2.6, portion: '1 шт', category: 'fruits' },
          { id: 'honey-2', name: 'Мёд', calories: 30, protein: 0, carbs: 8, fat: 0, fiber: 0, portion: '10г', category: 'sweets' },
        ],
        recipe: '1. Выложите творог в миску\n2. Нарежьте банан\n3. Добавьте мёд',
        prepTime: 5,
      },
      {
        id: 'breakfast-3',
        name: 'Омлет с овощами',
        type: 'breakfast',
        tags: ['vegetarian', 'eggs', 'low-carb'],
        foods: [
          { id: 'eggs-1', name: 'Яйца', calories: 180, protein: 14, carbs: 1, fat: 12, fiber: 0, portion: '2 шт', category: 'protein' },
          { id: 'tomato-1', name: 'Помидоры', calories: 20, protein: 1, carbs: 4, fat: 0.2, fiber: 1.2, portion: '100г', category: 'vegetables' },
          { id: 'pepper-1', name: 'Болгарский перец', calories: 15, protein: 0.5, carbs: 3, fat: 0.1, fiber: 1, portion: '50г', category: 'vegetables' },
          { id: 'cheese-1', name: 'Сыр', calories: 80, protein: 6, carbs: 0.5, fat: 6, fiber: 0, portion: '20г', category: 'dairy' },
        ],
        recipe: '1. Взбейте яйца\n2. Добавьте нарезанные овощи\n3. Готовьте на сковороде\n4. Посыпьте сыром',
        prepTime: 15,
      },
      {
        id: 'breakfast-4',
        name: 'Гречневая каша с яйцом',
        type: 'breakfast',
        tags: ['vegetarian', 'eggs', 'gluten-free'],
        foods: [
          { id: 'buckwheat-1', name: 'Гречка', calories: 130, protein: 5, carbs: 25, fat: 1, fiber: 4, portion: '50г (сухая)', category: 'grains' },
          { id: 'egg-2', name: 'Яйцо варёное', calories: 78, protein: 6, carbs: 0.5, fat: 5, fiber: 0, portion: '1 шт', category: 'protein' },
          { id: 'butter-1', name: 'Масло сливочное', calories: 37, protein: 0, carbs: 0, fat: 4, fiber: 0, portion: '5г', category: 'fats' },
        ],
        recipe: '1. Отварите гречку\n2. Сварите яйцо\n3. Добавьте масло в кашу\n4. Подавайте с яйцом',
        prepTime: 20,
      },
      {
        id: 'breakfast-5',
        name: 'Смузи-боул',
        type: 'breakfast',
        tags: ['vegan', 'gluten-free'],
        foods: [
          { id: 'banana-2', name: 'Банан замороженный', calories: 90, protein: 1, carbs: 23, fat: 0.3, fiber: 2.6, portion: '1 шт', category: 'fruits' },
          { id: 'berries-2', name: 'Ягоды', calories: 40, protein: 0.5, carbs: 10, fat: 0.2, fiber: 2, portion: '80г', category: 'fruits' },
          { id: 'almond-milk', name: 'Миндальное молоко', calories: 30, protein: 1, carbs: 2, fat: 2.5, fiber: 0, portion: '150мл', category: 'dairy-alt' },
          { id: 'granola-1', name: 'Гранола', calories: 120, protein: 3, carbs: 20, fat: 4, fiber: 2, portion: '30г', category: 'grains' },
        ],
        recipe: '1. Взбейте банан и ягоды с молоком\n2. Выложите в миску\n3. Украсьте гранолой',
        prepTime: 10,
      },

      // === ОБЕДЫ ===
      {
        id: 'lunch-1',
        name: 'Курица с рисом и овощами',
        type: 'lunch',
        tags: ['meat', 'gluten-free'],
        foods: [
          { id: 'chicken-1', name: 'Куриная грудка', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, portion: '150г', category: 'protein' },
          { id: 'rice-1', name: 'Бурый рис', calories: 130, protein: 3, carbs: 27, fat: 1, fiber: 2, portion: '60г (сухой)', category: 'grains' },
          { id: 'broccoli-1', name: 'Брокколи', calories: 35, protein: 3, carbs: 7, fat: 0.4, fiber: 2.6, portion: '100г', category: 'vegetables' },
          { id: 'olive-oil-1', name: 'Оливковое масло', calories: 45, protein: 0, carbs: 0, fat: 5, fiber: 0, portion: '5мл', category: 'fats' },
        ],
        recipe: '1. Отварите рис\n2. Запеките курицу с травами\n3. Приготовьте брокколи на пару\n4. Заправьте маслом',
        prepTime: 35,
      },
      {
        id: 'lunch-2',
        name: 'Лосось с киноа и салатом',
        type: 'lunch',
        tags: ['seafood', 'gluten-free'],
        foods: [
          { id: 'salmon-1', name: 'Лосось', calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, portion: '150г', category: 'protein' },
          { id: 'quinoa-1', name: 'Киноа', calories: 120, protein: 4, carbs: 21, fat: 2, fiber: 2.5, portion: '50г (сухая)', category: 'grains' },
          { id: 'salad-1', name: 'Салат микс', calories: 20, protein: 2, carbs: 3, fat: 0.3, fiber: 2, portion: '100г', category: 'vegetables' },
          { id: 'lemon-1', name: 'Лимонный сок', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0, portion: '15мл', category: 'other' },
        ],
        recipe: '1. Запеките лосось с лимоном\n2. Отварите киноа\n3. Подготовьте салат\n4. Сервируйте вместе',
        prepTime: 30,
      },
      {
        id: 'lunch-3',
        name: 'Суп-пюре из тыквы с чечевицей',
        type: 'lunch',
        tags: ['vegan', 'gluten-free'],
        foods: [
          { id: 'pumpkin-1', name: 'Тыква', calories: 45, protein: 1, carbs: 10, fat: 0.1, fiber: 2, portion: '200г', category: 'vegetables' },
          { id: 'lentils-1', name: 'Чечевица красная', calories: 115, protein: 9, carbs: 20, fat: 0.4, fiber: 4, portion: '50г (сухая)', category: 'legumes' },
          { id: 'coconut-milk', name: 'Кокосовое молоко', calories: 60, protein: 0.5, carbs: 1, fat: 6, fiber: 0, portion: '50мл', category: 'dairy-alt' },
          { id: 'bread-1', name: 'Хлеб цельнозерновой', calories: 70, protein: 3, carbs: 12, fat: 1, fiber: 2, portion: '30г', category: 'grains' },
        ],
        recipe: '1. Сварите тыкву и чечевицу\n2. Добавьте кокосовое молоко\n3. Пробейте блендером\n4. Подавайте с хлебом',
        prepTime: 40,
      },
      {
        id: 'lunch-4',
        name: 'Боул с индейкой и авокадо',
        type: 'lunch',
        tags: ['meat', 'gluten-free'],
        foods: [
          { id: 'turkey-1', name: 'Филе индейки', calories: 150, protein: 30, carbs: 0, fat: 2, fiber: 0, portion: '150г', category: 'protein' },
          { id: 'avocado-1', name: 'Авокадо', calories: 80, protein: 1, carbs: 4, fat: 7, fiber: 3, portion: '50г', category: 'fruits' },
          { id: 'bulgur-1', name: 'Булгур', calories: 85, protein: 3, carbs: 18, fat: 0.3, fiber: 4, portion: '50г (сухой)', category: 'grains' },
          { id: 'cucumber-1', name: 'Огурец', calories: 10, protein: 0.5, carbs: 2, fat: 0.1, fiber: 0.5, portion: '100г', category: 'vegetables' },
          { id: 'tomato-2', name: 'Помидоры черри', calories: 15, protein: 0.7, carbs: 3, fat: 0.1, fiber: 1, portion: '80г', category: 'vegetables' },
        ],
        recipe: '1. Отварите булгур\n2. Запеките индейку\n3. Нарежьте овощи и авокадо\n4. Соберите боул',
        prepTime: 30,
      },

      // === УЖИНЫ ===
      {
        id: 'dinner-1',
        name: 'Треска с овощами на пару',
        type: 'dinner',
        tags: ['seafood', 'gluten-free', 'low-carb'],
        foods: [
          { id: 'cod-1', name: 'Треска', calories: 120, protein: 26, carbs: 0, fat: 1, fiber: 0, portion: '180г', category: 'protein' },
          { id: 'zucchini-1', name: 'Кабачок', calories: 25, protein: 1.5, carbs: 5, fat: 0.3, fiber: 1.5, portion: '150г', category: 'vegetables' },
          { id: 'carrot-1', name: 'Морковь', calories: 30, protein: 0.7, carbs: 7, fat: 0.2, fiber: 2, portion: '80г', category: 'vegetables' },
          { id: 'dill-1', name: 'Укроп', calories: 3, protein: 0.2, carbs: 0.5, fat: 0.1, fiber: 0.3, portion: '10г', category: 'herbs' },
        ],
        recipe: '1. Подготовьте рыбу с травами\n2. Нарежьте овощи\n3. Готовьте на пару 20 минут\n4. Посыпьте укропом',
        prepTime: 25,
      },
      {
        id: 'dinner-2',
        name: 'Салат с тунцом',
        type: 'dinner',
        tags: ['seafood', 'gluten-free', 'low-carb'],
        foods: [
          { id: 'tuna-1', name: 'Тунец консервированный', calories: 120, protein: 26, carbs: 0, fat: 1, fiber: 0, portion: '100г', category: 'protein' },
          { id: 'lettuce-1', name: 'Латук', calories: 15, protein: 1.5, carbs: 2, fat: 0.2, fiber: 1.5, portion: '100г', category: 'vegetables' },
          { id: 'egg-3', name: 'Яйцо варёное', calories: 78, protein: 6, carbs: 0.5, fat: 5, fiber: 0, portion: '1 шт', category: 'protein' },
          { id: 'olive-2', name: 'Оливки', calories: 35, protein: 0.3, carbs: 1, fat: 3, fiber: 1, portion: '20г', category: 'vegetables' },
          { id: 'olive-oil-2', name: 'Оливковое масло', calories: 45, protein: 0, carbs: 0, fat: 5, fiber: 0, portion: '5мл', category: 'fats' },
        ],
        recipe: '1. Смешайте листья салата\n2. Добавьте тунец и нарезанное яйцо\n3. Украсьте оливками\n4. Заправьте маслом',
        prepTime: 15,
      },
      {
        id: 'dinner-3',
        name: 'Куриные котлеты с салатом',
        type: 'dinner',
        tags: ['meat', 'low-carb'],
        foods: [
          { id: 'chicken-patty', name: 'Куриные котлеты', calories: 180, protein: 22, carbs: 5, fat: 8, fiber: 0.5, portion: '150г', category: 'protein' },
          { id: 'salad-mix', name: 'Салат микс', calories: 20, protein: 2, carbs: 3, fat: 0.3, fiber: 2, portion: '100г', category: 'vegetables' },
          { id: 'tomato-3', name: 'Помидоры', calories: 20, protein: 1, carbs: 4, fat: 0.2, fiber: 1.2, portion: '100г', category: 'vegetables' },
          { id: 'yogurt-sauce', name: 'Соус йогуртовый', calories: 40, protein: 2, carbs: 3, fat: 2, fiber: 0, portion: '30г', category: 'dairy' },
        ],
        recipe: '1. Запеките котлеты в духовке\n2. Подготовьте салат\n3. Подавайте с йогуртовым соусом',
        prepTime: 30,
      },
      {
        id: 'dinner-4',
        name: 'Тофу с овощами стир-фрай',
        type: 'dinner',
        tags: ['vegan', 'soy', 'gluten-free'],
        foods: [
          { id: 'tofu-1', name: 'Тофу', calories: 150, protein: 16, carbs: 3, fat: 8, fiber: 1, portion: '180г', category: 'protein' },
          { id: 'bok-choy', name: 'Бок-чой', calories: 15, protein: 1.5, carbs: 2, fat: 0.2, fiber: 1, portion: '100г', category: 'vegetables' },
          { id: 'pepper-2', name: 'Болгарский перец', calories: 20, protein: 0.7, carbs: 5, fat: 0.2, fiber: 1.5, portion: '70г', category: 'vegetables' },
          { id: 'sesame-oil', name: 'Кунжутное масло', calories: 45, protein: 0, carbs: 0, fat: 5, fiber: 0, portion: '5мл', category: 'fats' },
        ],
        recipe: '1. Обжарьте тофу до корочки\n2. Добавьте овощи\n3. Заправьте кунжутным маслом\n4. Подавайте горячим',
        prepTime: 20,
      },

      // === ПЕРЕКУСЫ ===
      {
        id: 'snack-1',
        name: 'Орехи с сухофруктами',
        type: 'snack',
        tags: ['vegan', 'gluten-free', 'nuts'],
        foods: [
          { id: 'almonds-1', name: 'Миндаль', calories: 100, protein: 4, carbs: 3, fat: 9, fiber: 2, portion: '20г', category: 'nuts' },
          { id: 'dates-1', name: 'Финики', calories: 70, protein: 0.5, carbs: 18, fat: 0, fiber: 2, portion: '25г', category: 'fruits' },
        ],
        prepTime: 0,
      },
      {
        id: 'snack-2',
        name: 'Греческий йогурт с ягодами',
        type: 'snack',
        tags: ['vegetarian', 'dairy', 'gluten-free'],
        foods: [
          { id: 'greek-yogurt', name: 'Греческий йогурт', calories: 100, protein: 10, carbs: 4, fat: 5, fiber: 0, portion: '150г', category: 'dairy' },
          { id: 'berries-3', name: 'Ягоды', calories: 40, protein: 0.5, carbs: 10, fat: 0.2, fiber: 2, portion: '80г', category: 'fruits' },
        ],
        prepTime: 2,
      },
      {
        id: 'snack-3',
        name: 'Хумус с овощами',
        type: 'snack',
        tags: ['vegan', 'gluten-free'],
        foods: [
          { id: 'hummus-1', name: 'Хумус', calories: 100, protein: 5, carbs: 10, fat: 5, fiber: 3, portion: '50г', category: 'legumes' },
          { id: 'carrots-sticks', name: 'Морковные палочки', calories: 25, protein: 0.5, carbs: 6, fat: 0.1, fiber: 2, portion: '70г', category: 'vegetables' },
          { id: 'cucumber-sticks', name: 'Огуречные палочки', calories: 10, protein: 0.4, carbs: 2, fat: 0.1, fiber: 0.5, portion: '70г', category: 'vegetables' },
        ],
        prepTime: 5,
      },
      {
        id: 'snack-4',
        name: 'Яблоко с арахисовой пастой',
        type: 'snack',
        tags: ['vegan', 'gluten-free', 'nuts'],
        foods: [
          { id: 'apple-1', name: 'Яблоко', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, portion: '1 шт', category: 'fruits' },
          { id: 'peanut-butter', name: 'Арахисовая паста', calories: 95, protein: 4, carbs: 3, fat: 8, fiber: 1, portion: '15г', category: 'nuts' },
        ],
        prepTime: 2,
      },
      {
        id: 'snack-5',
        name: 'Протеиновый шейк',
        type: 'snack',
        tags: ['vegetarian', 'dairy', 'gluten-free'],
        foods: [
          { id: 'protein-powder', name: 'Протеин', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, portion: '30г', category: 'supplements' },
          { id: 'milk-1', name: 'Молоко 1.5%', calories: 45, protein: 3, carbs: 5, fat: 1.5, fiber: 0, portion: '200мл', category: 'dairy' },
          { id: 'banana-3', name: 'Банан', calories: 90, protein: 1, carbs: 23, fat: 0.3, fiber: 2.6, portion: '1 шт', category: 'fruits' },
        ],
        recipe: 'Смешайте все ингредиенты в блендере',
        prepTime: 5,
      },
    ];
  }
}
