// ==========================================
// КАЛЬКУЛЯТОР ПОКАЗАТЕЛЕЙ ЗДОРОВЬЯ
// ==========================================

import {
  UserProfile,
  HealthMetrics,
  BMICategory,
  RiskFactor,
  ActivityLevel,
} from '../types';

/**
 * Сервис для расчёта метрик здоровья пользователя
 */
export class HealthCalculator {
  
  /**
   * Рассчитать все метрики здоровья
   */
  static calculateAll(profile: UserProfile): HealthMetrics {
    const bmi = this.calculateBMI(profile.weight, profile.height);
    const bmiCategory = this.getBMICategory(bmi);
    const bmr = this.calculateBMR(profile);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    const targetCalories = this.calculateTargetCalories(tdee, profile.goal);
    const riskFactors = this.assessRiskFactors(profile, bmi);
    const healthScore = this.calculateHealthScore(profile, bmi, riskFactors);

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      healthScore: Math.round(healthScore),
      riskFactors,
    };
  }

  /**
   * Расчёт индекса массы тела (BMI)
   * Формула: вес (кг) / рост (м)²
   */
  static calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  /**
   * Определение категории BMI
   */
  static getBMICategory(bmi: number): BMICategory {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  /**
   * Расчёт базального метаболизма (BMR)
   * Формула Миффлина-Сан Жеора
   */
  static calculateBMR(profile: UserProfile): number {
    const { weight, height, age, gender } = profile;
    
    if (gender === 'male') {
      // Мужчины: BMR = 10 × вес + 6.25 × рост − 5 × возраст + 5
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      // Женщины: BMR = 10 × вес + 6.25 × рост − 5 × возраст − 161
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  /**
   * Расчёт суточного расхода энергии (TDEE)
   * TDEE = BMR × коэффициент активности
   */
  static calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,      // Сидячий образ жизни
      light: 1.375,        // Лёгкая активность (1-3 дня в неделю)
      moderate: 1.55,      // Умеренная активность (3-5 дней)
      active: 1.725,       // Высокая активность (6-7 дней)
      very_active: 1.9,    // Очень высокая активность
    };

    return bmr * activityMultipliers[activityLevel];
  }

  /**
   * Расчёт целевых калорий в зависимости от цели
   */
  static calculateTargetCalories(tdee: number, goal: UserProfile['goal']): number {
    switch (goal) {
      case 'weight_loss':
        // Дефицит 20% для похудения
        return tdee * 0.8;
      case 'weight_gain':
        // Профицит 15% для набора массы
        return tdee * 1.15;
      case 'maintain':
      case 'health':
      case 'energy':
      default:
        return tdee;
    }
  }

  /**
   * Оценка факторов риска
   */
  static assessRiskFactors(profile: UserProfile, bmi: number): RiskFactor[] {
    const risks: RiskFactor[] = [];

    // Риск по BMI
    if (bmi < 18.5) {
      risks.push({
        id: 'underweight',
        name: 'Недостаточный вес',
        severity: 'medium',
        description: 'Рекомендуется набрать вес для поддержания здоровья',
      });
    } else if (bmi >= 25 && bmi < 30) {
      risks.push({
        id: 'overweight',
        name: 'Избыточный вес',
        severity: 'medium',
        description: 'Рекомендуется снизить вес для профилактики заболеваний',
      });
    } else if (bmi >= 30) {
      risks.push({
        id: 'obesity',
        name: 'Ожирение',
        severity: 'high',
        description: 'Необходимо снизить вес под контролем специалиста',
      });
    }

    // Риск по медицинским показаниям
    const { medicalConditions } = profile;
    
    if (medicalConditions.diabetes) {
      risks.push({
        id: 'diabetes',
        name: 'Сахарный диабет',
        severity: 'high',
        description: 'Требуется контроль углеводов и гликемического индекса',
      });
    }

    if (medicalConditions.hypertension) {
      risks.push({
        id: 'hypertension',
        name: 'Гипертония',
        severity: 'high',
        description: 'Необходимо ограничить потребление соли и жидкости',
      });
    }

    if (medicalConditions.highCholesterol) {
      risks.push({
        id: 'cholesterol',
        name: 'Повышенный холестерин',
        severity: 'medium',
        description: 'Рекомендуется снизить насыщенные жиры',
      });
    }

    if (medicalConditions.heartDisease) {
      risks.push({
        id: 'heart',
        name: 'Сердечно-сосудистые заболевания',
        severity: 'high',
        description: 'Требуется кардиозащитная диета',
      });
    }

    if (medicalConditions.digestiveIssues) {
      risks.push({
        id: 'digestive',
        name: 'Проблемы с ЖКТ',
        severity: 'medium',
        description: 'Рекомендуется щадящее питание',
      });
    }

    // Риск по образу жизни
    if (profile.sleepHours < 6) {
      risks.push({
        id: 'sleep',
        name: 'Недостаток сна',
        severity: 'medium',
        description: 'Недосып влияет на метаболизм и аппетит',
      });
    }

    if (profile.stressLevel === 'high') {
      risks.push({
        id: 'stress',
        name: 'Высокий уровень стресса',
        severity: 'medium',
        description: 'Стресс влияет на пищевое поведение',
      });
    }

    if (profile.habits.smoking) {
      risks.push({
        id: 'smoking',
        name: 'Курение',
        severity: 'high',
        description: 'Курение снижает усвоение питательных веществ',
      });
    }

    if (profile.activityLevel === 'sedentary') {
      risks.push({
        id: 'sedentary',
        name: 'Низкая активность',
        severity: 'medium',
        description: 'Рекомендуется увеличить физическую активность',
      });
    }

    return risks;
  }

  /**
   * Расчёт общего показателя здоровья (Health Score)
   * Шкала от 0 до 100
   */
  static calculateHealthScore(
    profile: UserProfile,
    bmi: number,
    riskFactors: RiskFactor[]
  ): number {
    let score = 100;

    // Штраф за BMI
    if (bmi < 18.5) {
      score -= 15;
    } else if (bmi >= 25 && bmi < 30) {
      score -= 10;
    } else if (bmi >= 30) {
      score -= 20;
    }

    // Штраф за факторы риска
    for (const risk of riskFactors) {
      switch (risk.severity) {
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    }

    // Бонус за хороший сон
    if (profile.sleepHours >= 7 && profile.sleepHours <= 9) {
      score += 5;
    }
    if (profile.sleepQuality === 'excellent') {
      score += 5;
    }

    // Бонус за активность
    if (profile.activityLevel === 'active' || profile.activityLevel === 'very_active') {
      score += 10;
    } else if (profile.activityLevel === 'moderate') {
      score += 5;
    }

    // Бонус за отсутствие вредных привычек
    if (!profile.habits.smoking && profile.habits.alcohol === 'none') {
      score += 5;
    }

    // Бонус за достаточное потребление воды
    if (profile.habits.waterIntake >= 2) {
      score += 5;
    }

    // Ограничиваем диапазон
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Получить текстовое описание BMI категории
   */
  static getBMICategoryLabel(category: BMICategory): string {
    const labels: Record<BMICategory, string> = {
      underweight: 'Недостаточный вес',
      normal: 'Нормальный вес',
      overweight: 'Избыточный вес',
      obese: 'Ожирение',
    };
    return labels[category];
  }

  /**
   * Получить цвет для BMI категории
   */
  static getBMICategoryColor(category: BMICategory): string {
    const colors: Record<BMICategory, string> = {
      underweight: '#fbbf24', // yellow
      normal: '#22c55e',      // green
      overweight: '#f97316',  // orange
      obese: '#ef4444',       // red
    };
    return colors[category];
  }

  /**
   * Получить цвет для Health Score
   */
  static getHealthScoreColor(score: number): string {
    if (score >= 80) return '#22c55e';  // green
    if (score >= 60) return '#84cc16';  // lime
    if (score >= 40) return '#fbbf24';  // yellow
    if (score >= 20) return '#f97316';  // orange
    return '#ef4444';                    // red
  }

  /**
   * Получить описание Health Score
   */
  static getHealthScoreLabel(score: number): string {
    if (score >= 80) return 'Отличное';
    if (score >= 60) return 'Хорошее';
    if (score >= 40) return 'Удовлетворительное';
    if (score >= 20) return 'Требует внимания';
    return 'Критическое';
  }
}
