// ==========================================
// ДВИЖОК ПЕРСОНАЛЬНЫХ РЕКОМЕНДАЦИЙ
// ==========================================

import {
  UserProfile,
  HealthMetrics,
  NutritionRecommendations,
  Recommendation,
  Macronutrients,
  FoodCategory,
} from '../types';

/**
 * Движок генерации персональных рекомендаций по питанию
 * Учитывает все данные пользователя для создания индивидуального плана
 */
export class RecommendationEngine {
  private profile: UserProfile;
  private metrics: HealthMetrics;

  constructor(profile: UserProfile, metrics: HealthMetrics) {
    this.profile = profile;
    this.metrics = metrics;
  }

  /**
   * Генерация полного набора рекомендаций
   */
  generate(): NutritionRecommendations {
    return {
      generalTips: this.generateGeneralTips(),
      macros: this.calculateMacros(),
      macroRatio: this.calculateMacroRatio(),
      dailyCalories: this.metrics.targetCalories,
      recommendedFoods: this.getRecommendedFoods(),
      restrictedFoods: this.getRestrictedFoods(),
      dailyWaterIntake: this.calculateWaterIntake(),
      supplements: this.getSuggestedSupplements(),
    };
  }

  /**
   * Генерация общих рекомендаций на основе профиля
   */
  private generateGeneralTips(): Recommendation[] {
    const tips: Recommendation[] = [];
    const { profile, metrics } = this;

    // === РЕКОМЕНДАЦИИ ПО BMI ===
    
    if (metrics.bmiCategory === 'underweight') {
      tips.push({
        id: 'bmi-gain',
        category: 'nutrition',
        priority: 'high',
        title: 'Набор массы тела',
        description: `Ваш BMI ${metrics.bmi} указывает на недостаточный вес. Увеличьте калорийность на 300-500 ккал, добавьте больше белка и полезных жиров.`,
      });
    } else if (metrics.bmiCategory === 'overweight') {
      tips.push({
        id: 'bmi-loss',
        category: 'nutrition',
        priority: 'high',
        title: 'Снижение веса',
        description: `Ваш BMI ${metrics.bmi} указывает на избыточный вес. Создайте умеренный дефицит калорий (300-500 ккал) и увеличьте физическую активность.`,
      });
    } else if (metrics.bmiCategory === 'obese') {
      tips.push({
        id: 'bmi-critical',
        category: 'medical',
        priority: 'high',
        title: 'Контроль веса',
        description: 'Рекомендуется консультация с диетологом и эндокринологом для составления безопасной программы снижения веса.',
      });
    }

    // === РЕКОМЕНДАЦИИ ПО ЦЕЛИ ===
    
    switch (profile.goal) {
      case 'weight_loss':
        tips.push({
          id: 'goal-loss',
          category: 'nutrition',
          priority: 'high',
          title: 'Стратегия похудения',
          description: 'Сфокусируйтесь на белке (1.6-2г на кг веса), уменьшите быстрые углеводы, ешьте больше овощей и клетчатки.',
        });
        tips.push({
          id: 'sugar-reduce',
          category: 'nutrition',
          priority: 'high',
          title: 'Снизить потребление сахара',
          description: 'Исключите добавленный сахар, сладкие напитки, выпечку. Замените на фрукты и ягоды.',
        });
        break;
      case 'weight_gain':
        tips.push({
          id: 'goal-gain',
          category: 'nutrition',
          priority: 'high',
          title: 'Стратегия набора массы',
          description: 'Увеличьте частоту приёмов пищи до 5-6 раз, добавьте калорийные но полезные продукты: орехи, авокадо, оливковое масло.',
        });
        tips.push({
          id: 'protein-up',
          category: 'nutrition',
          priority: 'high',
          title: `Увеличьте белок до ${Math.round(profile.weight * 1.8)}г в день`,
          description: 'Для набора мышечной массы необходимо 1.6-2г белка на кг веса. Распределите равномерно между приёмами пищи.',
        });
        break;
      case 'health':
        tips.push({
          id: 'goal-health',
          category: 'nutrition',
          priority: 'medium',
          title: 'Сбалансированное питание',
          description: 'Придерживайтесь разнообразного рациона: много овощей, цельнозерновые, качественный белок, полезные жиры.',
        });
        break;
      case 'energy':
        tips.push({
          id: 'goal-energy',
          category: 'nutrition',
          priority: 'medium',
          title: 'Питание для энергии',
          description: 'Ешьте регулярно каждые 3-4 часа. Выбирайте сложные углеводы для стабильной энергии. Избегайте скачков сахара.',
        });
        break;
    }

    // === РЕКОМЕНДАЦИИ ПО ЗАБОЛЕВАНИЯМ ===
    
    if (profile.medicalConditions.diabetes) {
      tips.push({
        id: 'diabetes',
        category: 'medical',
        priority: 'high',
        title: 'Контроль углеводов при диабете',
        description: 'Выбирайте продукты с низким гликемическим индексом (<55). Распределяйте углеводы равномерно. Избегайте простых сахаров.',
      });
      tips.push({
        id: 'diabetes-fiber',
        category: 'nutrition',
        priority: 'high',
        title: 'Увеличьте клетчатку',
        description: 'Клетчатка замедляет всасывание глюкозы. Цель: 25-30г в день. Источники: овощи, бобовые, цельнозерновые.',
      });
    }

    if (profile.medicalConditions.hypertension) {
      tips.push({
        id: 'hypertension',
        category: 'medical',
        priority: 'high',
        title: 'Снижение соли при гипертонии',
        description: 'Ограничьте натрий до 1500-2000мг в день. Избегайте консервов, полуфабрикатов, соленых снеков.',
      });
      tips.push({
        id: 'hypertension-potassium',
        category: 'nutrition',
        priority: 'medium',
        title: 'Увеличьте калий',
        description: 'Калий помогает контролировать давление. Источники: бананы, картофель, шпинат, авокадо.',
      });
    }

    if (profile.medicalConditions.highCholesterol) {
      tips.push({
        id: 'cholesterol',
        category: 'medical',
        priority: 'high',
        title: 'Снижение холестерина',
        description: 'Ограничьте насыщенные жиры (<7% калорий). Увеличьте омега-3 (рыба, орехи). Добавьте растворимую клетчатку.',
      });
    }

    if (profile.medicalConditions.digestiveIssues) {
      tips.push({
        id: 'digestive',
        category: 'medical',
        priority: 'high',
        title: 'Щадящее питание для ЖКТ',
        description: 'Избегайте острого, жареного, жирного. Ешьте часто и небольшими порциями. Готовьте на пару или варите.',
      });
    }

    if (profile.medicalConditions.heartDisease) {
      tips.push({
        id: 'heart',
        category: 'medical',
        priority: 'high',
        title: 'Кардиозащитная диета',
        description: 'Следуйте средиземноморской диете: много рыбы, оливковое масло, овощи, орехи. Минимум красного мяса.',
      });
    }

    // === РЕКОМЕНДАЦИИ ПО ОБРАЗУ ЖИЗНИ ===
    
    if (profile.activityLevel === 'sedentary') {
      tips.push({
        id: 'activity',
        category: 'lifestyle',
        priority: 'medium',
        title: 'Увеличьте активность',
        description: 'Низкая активность замедляет метаболизм. Начните с 30 минут ходьбы в день, постепенно увеличивая нагрузку.',
      });
    }

    if (profile.activityLevel === 'very_active' || profile.activityLevel === 'active') {
      tips.push({
        id: 'active-protein',
        category: 'nutrition',
        priority: 'high',
        title: 'Повышенная потребность в белке',
        description: `При вашем уровне активности нужно ${Math.round(profile.weight * 1.6)}-${Math.round(profile.weight * 2)}г белка в день для восстановления мышц.`,
      });
    }

    if (profile.sleepHours < 7) {
      tips.push({
        id: 'sleep',
        category: 'lifestyle',
        priority: 'medium',
        title: 'Улучшите качество сна',
        description: 'Недостаток сна повышает аппетит и тягу к сладкому. Старайтесь спать 7-9 часов. Избегайте кофеина после 14:00.',
      });
    }

    if (profile.stressLevel === 'high') {
      tips.push({
        id: 'stress',
        category: 'lifestyle',
        priority: 'medium',
        title: 'Управление стрессом',
        description: 'Стресс провоцирует переедание. Практикуйте осознанное питание, медитацию. Магний помогает при стрессе.',
      });
    }

    // === ОБЩИЕ РЕКОМЕНДАЦИИ ===
    
    tips.push({
      id: 'vegetables',
      category: 'nutrition',
      priority: 'medium',
      title: 'Добавьте больше овощей',
      description: 'Цель: минимум 400г овощей в день. Они богаты клетчаткой, витаминами и низкокалорийны.',
    });

    tips.push({
      id: 'water',
      category: 'nutrition',
      priority: 'medium',
      title: `Пейте ${this.calculateWaterIntake()} л воды в день`,
      description: 'Достаточное количество воды улучшает метаболизм и помогает контролировать аппетит.',
    });

    // Сортируем по приоритету
    return tips.sort((a, b) => {
      const priority = { high: 0, medium: 1, low: 2 };
      return priority[a.priority] - priority[b.priority];
    });
  }

  /**
   * Расчёт макронутриентов
   */
  private calculateMacros(): Macronutrients {
    const calories = this.metrics.targetCalories;
    const { profile } = this;

    let proteinRatio = 0.25; // 25% от калорий
    let carbsRatio = 0.45;   // 45% от калорий
    let fatRatio = 0.30;     // 30% от калорий

    // Корректировка по цели
    switch (profile.goal) {
      case 'weight_loss':
        proteinRatio = 0.30;
        carbsRatio = 0.35;
        fatRatio = 0.35;
        break;
      case 'weight_gain':
        proteinRatio = 0.25;
        carbsRatio = 0.50;
        fatRatio = 0.25;
        break;
    }

    // Корректировка для диабета
    if (profile.medicalConditions.diabetes) {
      carbsRatio = Math.min(carbsRatio, 0.40);
      proteinRatio = 0.25;
      fatRatio = 1 - carbsRatio - proteinRatio;
    }

    // Корректировка для кето-диеты
    if (profile.dietType === 'keto') {
      carbsRatio = 0.05;
      fatRatio = 0.70;
      proteinRatio = 0.25;
    }

    // Корректировка для высокой активности
    if (profile.activityLevel === 'very_active' || profile.activityLevel === 'active') {
      proteinRatio = Math.max(proteinRatio, 0.28);
      carbsRatio = 0.45;
      fatRatio = 1 - proteinRatio - carbsRatio;
    }

    // Расчёт в граммах
    // Белок: 4 ккал/г, Углеводы: 4 ккал/г, Жиры: 9 ккал/г
    const protein = Math.round((calories * proteinRatio) / 4);
    const carbs = Math.round((calories * carbsRatio) / 4);
    const fat = Math.round((calories * fatRatio) / 9);

    // Клетчатка: минимум 25г, больше при похудении
    let fiber = 25;
    if (profile.goal === 'weight_loss') fiber = 30;
    if (profile.medicalConditions.diabetes) fiber = 35;

    return { protein, carbs, fat, fiber };
  }

  /**
   * Расчёт соотношения макронутриентов в процентах
   */
  private calculateMacroRatio(): { protein: number; carbs: number; fat: number } {
    const macros = this.calculateMacros();
    const totalCalories = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;

    return {
      protein: Math.round((macros.protein * 4 / totalCalories) * 100),
      carbs: Math.round((macros.carbs * 4 / totalCalories) * 100),
      fat: Math.round((macros.fat * 9 / totalCalories) * 100),
    };
  }

  /**
   * Генерация списка рекомендуемых продуктов
   */
  private getRecommendedFoods(): FoodCategory[] {
    const { profile } = this;
    const foods: FoodCategory[] = [];

    // === БЕЛКИ ===
    const proteinSources: string[] = [];
    
    if (profile.dietType !== 'vegan') {
      if (!profile.allergies.eggs) proteinSources.push('Яйца');
      if (profile.dietType !== 'vegetarian') {
        proteinSources.push('Куриная грудка', 'Индейка');
        if (profile.dietType === 'halal') {
          proteinSources.push('Халяльная говядина');
        } else {
          proteinSources.push('Нежирная говядина');
        }
        if (!profile.allergies.seafood) {
          proteinSources.push('Лосось', 'Треска', 'Тунец', 'Креветки');
        }
      }
      if (!profile.allergies.lactose) {
        proteinSources.push('Творог', 'Греческий йогурт');
      }
    }
    
    // Веганские источники белка
    if (!profile.allergies.soy) {
      proteinSources.push('Тофу', 'Темпе', 'Соевое молоко');
    }
    if (!profile.allergies.nuts) {
      proteinSources.push('Миндаль', 'Грецкие орехи');
    }
    proteinSources.push('Чечевица', 'Нут', 'Фасоль', 'Киноа');

    if (proteinSources.length > 0) {
      foods.push({
        category: '🥩 Источники белка',
        items: proteinSources,
        reason: 'Необходимы для построения и восстановления тканей',
      });
    }

    // === УГЛЕВОДЫ ===
    const carbSources: string[] = [];
    
    if (!profile.allergies.gluten) {
      carbSources.push('Овсянка', 'Цельнозерновой хлеб', 'Булгур');
    }
    carbSources.push('Киноа', 'Гречка', 'Бурый рис');
    carbSources.push('Батат', 'Картофель');
    
    // Для диабета — только низкий ГИ
    if (!profile.medicalConditions.diabetes) {
      carbSources.push('Бананы', 'Виноград');
    }

    if (profile.dietType !== 'keto') {
      foods.push({
        category: '🌾 Сложные углеводы',
        items: carbSources,
        reason: 'Обеспечивают стабильную энергию',
      });
    }

    // === ОВОЩИ ===
    const vegetables = [
      'Брокколи', 'Шпинат', 'Капуста', 'Цветная капуста',
      'Огурцы', 'Помидоры', 'Болгарский перец', 'Морковь',
      'Кабачки', 'Баклажаны', 'Зелёный салат', 'Руккола'
    ];
    
    // При проблемах с ЖКТ — щадящие овощи
    if (profile.medicalConditions.digestiveIssues) {
      foods.push({
        category: '🥦 Овощи (приготовленные)',
        items: ['Морковь', 'Кабачки', 'Тыква', 'Цветная капуста', 'Картофель'],
        reason: 'Легко усваиваются при проблемах с ЖКТ',
      });
    } else {
      foods.push({
        category: '🥦 Овощи',
        items: vegetables,
        reason: 'Богаты клетчаткой, витаминами и минералами',
      });
    }

    // === ФРУКТЫ ===
    let fruits = ['Яблоки', 'Груши', 'Апельсины', 'Грейпфруты', 'Ягоды', 'Киви'];
    
    if (profile.medicalConditions.diabetes) {
      fruits = ['Яблоки', 'Груши', 'Ягоды', 'Грейпфруты', 'Вишня'];
    }
    
    foods.push({
      category: '🍎 Фрукты',
      items: fruits,
      reason: profile.medicalConditions.diabetes 
        ? 'Фрукты с низким гликемическим индексом'
        : 'Источник витаминов и антиоксидантов',
    });

    // === ЖИРЫ ===
    const fats: string[] = ['Оливковое масло', 'Авокадо', 'Льняное масло'];
    if (!profile.allergies.nuts) {
      fats.push('Орехи', 'Семена чиа', 'Семена льна');
    }
    if (!profile.allergies.seafood && profile.dietType !== 'vegan') {
      fats.push('Жирная рыба (омега-3)');
    }

    foods.push({
      category: '🥑 Полезные жиры',
      items: fats,
      reason: 'Необходимы для гормонов и усвоения витаминов',
    });

    // === НАПИТКИ ===
    const drinks = ['Вода', 'Зелёный чай', 'Травяные чаи'];
    if (!profile.allergies.lactose && profile.dietType !== 'vegan') {
      drinks.push('Кефир', 'Ряженка');
    }
    
    foods.push({
      category: '🥤 Напитки',
      items: drinks,
      reason: 'Поддержание водного баланса',
    });

    return foods;
  }

  /**
   * Генерация списка запрещённых/ограниченных продуктов
   */
  private getRestrictedFoods(): FoodCategory[] {
    const { profile } = this;
    const restricted: FoodCategory[] = [];

    // === ОБЩИЕ ОГРАНИЧЕНИЯ ===
    restricted.push({
      category: '🚫 Избегать',
      items: [
        'Фастфуд',
        'Сладкие газировки',
        'Чипсы и снеки',
        'Майонез',
        'Кондитерские изделия',
        'Полуфабрикаты',
      ],
      reason: 'Высококалорийные продукты с низкой питательной ценностью',
    });

    // === ОГРАНИЧЕНИЯ ПО ЗАБОЛЕВАНИЯМ ===
    
    if (profile.medicalConditions.diabetes) {
      restricted.push({
        category: '⚠️ При диабете',
        items: [
          'Сахар и сладости',
          'Белый хлеб',
          'Белый рис',
          'Картофельное пюре',
          'Соки',
          'Мёд',
          'Финики',
          'Бананы',
        ],
        reason: 'Продукты с высоким гликемическим индексом',
      });
    }

    if (profile.medicalConditions.hypertension) {
      restricted.push({
        category: '⚠️ При гипертонии',
        items: [
          'Соленья',
          'Копчёности',
          'Консервы',
          'Сыры (солёные)',
          'Колбасы',
          'Соевый соус',
          'Готовые соусы',
        ],
        reason: 'Продукты с высоким содержанием натрия',
      });
    }

    if (profile.medicalConditions.highCholesterol) {
      restricted.push({
        category: '⚠️ При повышенном холестерине',
        items: [
          'Жирное мясо',
          'Сливочное масло',
          'Сало',
          'Жирные сыры',
          'Яичные желтки (>2/день)',
          'Субпродукты',
          'Креветки',
        ],
        reason: 'Продукты с насыщенными жирами и холестерином',
      });
    }

    if (profile.medicalConditions.digestiveIssues) {
      restricted.push({
        category: '⚠️ При проблемах с ЖКТ',
        items: [
          'Острые специи',
          'Жареное',
          'Грибы',
          'Бобовые (в больших количествах)',
          'Капуста сырая',
          'Лук, чеснок (сырые)',
          'Цитрусовые (при изжоге)',
        ],
        reason: 'Продукты, раздражающие ЖКТ',
      });
    }

    // === АЛЛЕРГИИ ===
    const allergyItems: string[] = [];
    
    if (profile.allergies.gluten) {
      allergyItems.push('Пшеница', 'Рожь', 'Ячмень', 'Овёс (без маркировки)');
    }
    if (profile.allergies.lactose) {
      allergyItems.push('Молоко', 'Сыр', 'Сливки', 'Мороженое');
    }
    if (profile.allergies.nuts) {
      allergyItems.push('Все виды орехов', 'Арахис', 'Ореховые пасты');
    }
    if (profile.allergies.seafood) {
      allergyItems.push('Рыба', 'Морепродукты', 'Креветки', 'Икра');
    }
    if (profile.allergies.eggs) {
      allergyItems.push('Яйца', 'Майонез', 'Выпечка с яйцами');
    }
    if (profile.allergies.soy) {
      allergyItems.push('Соя', 'Тофу', 'Соевый соус', 'Соевое молоко');
    }

    if (allergyItems.length > 0) {
      restricted.push({
        category: '🚨 Ваши аллергены',
        items: allergyItems,
        reason: 'Исключить полностью из-за аллергии',
      });
    }

    // === ДИЕТИЧЕСКИЕ ОГРАНИЧЕНИЯ ===
    
    if (profile.dietType === 'vegan') {
      restricted.push({
        category: '🌱 Веганство',
        items: ['Мясо', 'Рыба', 'Яйца', 'Молочные продукты', 'Мёд'],
        reason: 'Исключены по типу питания',
      });
    } else if (profile.dietType === 'vegetarian') {
      restricted.push({
        category: '🥗 Вегетарианство',
        items: ['Мясо', 'Рыба', 'Морепродукты'],
        reason: 'Исключены по типу питания',
      });
    } else if (profile.dietType === 'halal') {
      restricted.push({
        category: '☪️ Халяль',
        items: ['Свинина', 'Алкоголь', 'Желатин (свиной)', 'Не-халяльное мясо'],
        reason: 'Исключены по религиозным требованиям',
      });
    } else if (profile.dietType === 'kosher') {
      restricted.push({
        category: '✡️ Кошер',
        items: ['Свинина', 'Морепродукты без чешуи', 'Смешение мяса и молока'],
        reason: 'Исключены по религиозным требованиям',
      });
    }

    return restricted;
  }

  /**
   * Расчёт дневной нормы воды
   */
  private calculateWaterIntake(): number {
    const baseWater = this.profile.weight * 0.033; // 33 мл на кг веса
    
    let adjustment = 0;
    
    // Корректировка по активности
    if (this.profile.activityLevel === 'active') adjustment += 0.5;
    if (this.profile.activityLevel === 'very_active') adjustment += 1;
    
    // Корректировка по цели (похудение — больше воды)
    if (this.profile.goal === 'weight_loss') adjustment += 0.3;
    
    return Math.round((baseWater + adjustment) * 10) / 10;
  }

  /**
   * Рекомендуемые добавки
   */
  private getSuggestedSupplements(): string[] {
    const supplements: string[] = [];
    const { profile } = this;

    // Веганам нужен B12
    if (profile.dietType === 'vegan') {
      supplements.push('Витамин B12');
      supplements.push('Омега-3 (из водорослей)');
    }

    // При недостатке солнца
    supplements.push('Витамин D3');

    // При стрессе
    if (profile.stressLevel === 'high') {
      supplements.push('Магний');
      supplements.push('Витамины группы B');
    }

    // При аллергии на молочные
    if (profile.allergies.lactose) {
      supplements.push('Кальций');
    }

    // При высокой активности
    if (profile.activityLevel === 'very_active' || profile.activityLevel === 'active') {
      supplements.push('Электролиты');
    }

    // При проблемах с ЖКТ
    if (profile.medicalConditions.digestiveIssues) {
      supplements.push('Пробиотики');
    }

    return supplements;
  }
}
