// ==========================================
// ZUSTAND STORE - УПРАВЛЕНИЕ СОСТОЯНИЕМ
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  HealthMetrics,
  NutritionRecommendations,
  DailyMealPlan,
  WeeklyMealPlan,
  MedicalConditions,
  Allergies,
  Habits,
} from '../types';
import { HealthCalculator } from '../services/HealthCalculator';
import { RecommendationEngine } from '../services/RecommendationEngine';
import { MealPlanGenerator } from '../services/MealPlanGenerator';

// === НАЧАЛЬНОЕ СОСТОЯНИЕ ===

const initialMedicalConditions: MedicalConditions = {
  diabetes: false,
  hypertension: false,
  highCholesterol: false,
  digestiveIssues: false,
  heartDisease: false,
  kidneyDisease: false,
  thyroidDisorder: false,
  other: '',
};

const initialAllergies: Allergies = {
  gluten: false,
  lactose: false,
  nuts: false,
  seafood: false,
  eggs: false,
  soy: false,
  other: '',
};

const initialHabits: Habits = {
  smoking: false,
  alcohol: 'none',
  caffeine: 'moderate',
  waterIntake: 1.5,
};

const initialProfile: UserProfile = {
  name: '',
  email: '',
  gender: 'male',
  age: 30,
  height: 170,
  weight: 70,
  targetWeight: undefined,
  activityLevel: 'moderate',
  sleepHours: 7,
  sleepQuality: 'average',
  stressLevel: 'medium',
  habits: initialHabits,
  medicalConditions: initialMedicalConditions,
  allergies: initialAllergies,
  medications: '',
  goal: 'health',
  dietType: 'none',
  mealsPerDay: 3,
  consentDataProcessing: false,
  consentMedicalDisclaimer: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// === ИНТЕРФЕЙС STORE ===

interface AppState {
  // Текущий шаг onboarding
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Профиль пользователя
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;

  // Метрики здоровья
  healthMetrics: HealthMetrics | null;
  calculateHealthMetrics: () => void;

  // Рекомендации
  recommendations: NutritionRecommendations | null;
  generateRecommendations: () => void;

  // План питания
  dailyMealPlan: DailyMealPlan | null;
  weeklyMealPlan: WeeklyMealPlan | null;
  generateDailyMealPlan: () => void;
  generateWeeklyMealPlan: () => void;

  // Флаги состояния
  isLoading: boolean;
  error: string | null;
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: (value: boolean) => void;

  // Сброс
  resetAll: () => void;
}

// === СОЗДАНИЕ STORE ===

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // === ONBOARDING ===
      currentStep: 0,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 9) {
          set({ currentStep: currentStep + 1 });
        }
      },
      
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // === ПРОФИЛЬ ===
      profile: initialProfile,
      
      updateProfile: (updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
            updatedAt: new Date(),
          },
        }));
      },
      
      resetProfile: () => set({ profile: initialProfile }),

      // === МЕТРИКИ ЗДОРОВЬЯ ===
      healthMetrics: null,
      
      calculateHealthMetrics: () => {
        const { profile } = get();
        
        try {
          set({ isLoading: true, error: null });
          
          const metrics = HealthCalculator.calculateAll(profile);
          
          set({ 
            healthMetrics: metrics,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: 'Ошибка при расчёте показателей здоровья',
            isLoading: false,
          });
        }
      },

      // === РЕКОМЕНДАЦИИ ===
      recommendations: null,
      
      generateRecommendations: () => {
        const { profile, healthMetrics } = get();
        
        if (!healthMetrics) {
          set({ error: 'Сначала рассчитайте показатели здоровья' });
          return;
        }
        
        try {
          set({ isLoading: true, error: null });
          
          const engine = new RecommendationEngine(profile, healthMetrics);
          const recommendations = engine.generate();
          
          set({ 
            recommendations,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: 'Ошибка при генерации рекомендаций',
            isLoading: false,
          });
        }
      },

      // === ПЛАН ПИТАНИЯ ===
      dailyMealPlan: null,
      weeklyMealPlan: null,
      
      generateDailyMealPlan: () => {
        const { profile, recommendations } = get();
        
        if (!recommendations) {
          set({ error: 'Сначала сгенерируйте рекомендации' });
          return;
        }
        
        try {
          set({ isLoading: true, error: null });
          
          const generator = new MealPlanGenerator(profile, recommendations);
          const plan = generator.generateDailyPlan();
          
          set({ 
            dailyMealPlan: plan,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: 'Ошибка при генерации плана питания',
            isLoading: false,
          });
        }
      },
      
      generateWeeklyMealPlan: () => {
        const { profile, recommendations } = get();
        
        if (!recommendations) {
          set({ error: 'Сначала сгенерируйте рекомендации' });
          return;
        }
        
        try {
          set({ isLoading: true, error: null });
          
          const generator = new MealPlanGenerator(profile, recommendations);
          const plan = generator.generateWeeklyPlan();
          
          set({ 
            weeklyMealPlan: plan,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: 'Ошибка при генерации недельного плана',
            isLoading: false,
          });
        }
      },

      // === ФЛАГИ ===
      isLoading: false,
      error: null,
      isOnboardingComplete: false,
      
      setIsOnboardingComplete: (value) => set({ isOnboardingComplete: value }),

      // === СБРОС ===
      resetAll: () => set({
        currentStep: 0,
        profile: initialProfile,
        healthMetrics: null,
        recommendations: null,
        dailyMealPlan: null,
        weeklyMealPlan: null,
        isLoading: false,
        error: null,
        isOnboardingComplete: false,
      }),
    }),
    {
      name: 'nutrition-app-storage',
      partialize: (state) => ({
        profile: state.profile,
        healthMetrics: state.healthMetrics,
        recommendations: state.recommendations,
        dailyMealPlan: state.dailyMealPlan,
        isOnboardingComplete: state.isOnboardingComplete,
        currentStep: state.currentStep,
      }),
    }
  )
);

// === СЕЛЕКТОРЫ ===

export const useProfile = () => useStore((state) => state.profile);
export const useHealthMetrics = () => useStore((state) => state.healthMetrics);
export const useRecommendations = () => useStore((state) => state.recommendations);
export const useMealPlans = () => useStore((state) => ({
  daily: state.dailyMealPlan,
  weekly: state.weeklyMealPlan,
}));
export const useOnboarding = () => useStore((state) => ({
  currentStep: state.currentStep,
  isComplete: state.isOnboardingComplete,
  next: state.nextStep,
  prev: state.prevStep,
  setStep: state.setCurrentStep,
}));
