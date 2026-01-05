export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export interface HabitMetadata {
  description?: string;
}

export interface ProgressEntry {
  date: string;
  completed: boolean;
  value?: number;
}

export interface Habit {
  id: number;
  name: string;
  initDate: string;
  isActive: boolean;
  metadataJson: string; // JSON string containing HabitMetadata
  progressJson: string; // JSON string containing ProgressEntry[]
}

export interface DashboardStats {
  totalHabits: number;
  completedHabits: number;
  averageProgress: number;
  currentStreak: number;
  longestStreak: number;
}

export type TrendType = 'improving' | 'stable' | 'declining';

export interface HabitStats {
  weeklyProgress: number;
  monthlyProgress: number;
  trend: TrendType;
  totalDays: number;
  completedDays: number;
}

// Helper functions to parse JSON fields
export const parseHabitMetadata = (json: string): HabitMetadata => {
  try {
    return JSON.parse(json || '{}');
  } catch {
    return {};
  }
};

export const parseProgressJson = (json: string): ProgressEntry[] => {
  try {
    return JSON.parse(json || '[]');
  } catch {
    return [];
  }
};
