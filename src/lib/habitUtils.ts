import { Habit, HabitStats, TrendType, ProgressEntry, parseProgressJson } from '@/types';
import { subDays, isWithinInterval, parseISO, isValid, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Safe parseISO that returns null for invalid dates
const safeParseDateString = (dateString: string | undefined | null): Date | null => {
  if (!dateString) return null;
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

export const getHabitProgress = (habit: Habit): ProgressEntry[] => {
  return parseProgressJson(habit.progressJson);
};

export const calculateHabitProgress = (habit: Habit): number => {
  const progress = getHabitProgress(habit);
  if (!progress.length) return 0;
  
  const completed = progress.filter(p => p.completed).length;
  return Math.round((completed / progress.length) * 100);
};

export const calculateHabitStats = (habit: Habit): HabitStats => {
  const progress = getHabitProgress(habit);
  const today = new Date();
  
  // Weekly progress
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weeklyEntries = progress.filter(p => {
    const date = safeParseDateString(p.date);
    return date && isWithinInterval(date, { start: weekStart, end: weekEnd });
  });
  const weeklyCompleted = weeklyEntries.filter(p => p.completed).length;
  const weeklyProgress = weeklyEntries.length > 0 
    ? Math.round((weeklyCompleted / weeklyEntries.length) * 100) 
    : 0;

  // Monthly progress
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthlyEntries = progress.filter(p => {
    const date = safeParseDateString(p.date);
    return date && isWithinInterval(date, { start: monthStart, end: monthEnd });
  });
  const monthlyCompleted = monthlyEntries.filter(p => p.completed).length;
  const monthlyProgress = monthlyEntries.length > 0 
    ? Math.round((monthlyCompleted / monthlyEntries.length) * 100) 
    : 0;

  // Calculate trend (compare last 2 weeks)
  const lastWeekStart = subDays(weekStart, 7);
  const lastWeekEnd = subDays(weekStart, 1);
  const lastWeekEntries = progress.filter(p => {
    const date = safeParseDateString(p.date);
    return date && isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd });
  });
  const lastWeekCompleted = lastWeekEntries.filter(p => p.completed).length;
  const lastWeekRate = lastWeekEntries.length > 0 ? lastWeekCompleted / lastWeekEntries.length : 0;
  const thisWeekRate = weeklyEntries.length > 0 ? weeklyCompleted / weeklyEntries.length : 0;

  let trend: TrendType = 'stable';
  if (thisWeekRate > lastWeekRate + 0.1) trend = 'improving';
  else if (thisWeekRate < lastWeekRate - 0.1) trend = 'declining';

  // Total stats
  const totalDays = progress.length;
  const completedDays = progress.filter(p => p.completed).length;

  return {
    weeklyProgress,
    monthlyProgress,
    trend,
    totalDays,
    completedDays,
  };
};

export const calculateStreak = (progress: ProgressEntry[]): { current: number; longest: number } => {
  if (!progress.length) return { current: 0, longest: 0 };

  // Filter out entries with invalid dates and sort by date descending
  const validProgress = progress.filter(p => safeParseDateString(p.date));
  if (!validProgress.length) return { current: 0, longest: 0 };

  const sorted = [...validProgress].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (from today backwards)
  for (const entry of sorted) {
    if (entry.completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  for (const entry of validProgress) {
    if (entry.completed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { current: currentStreak, longest: longestStreak };
};

export const getHeatmapColor = (completed: boolean, value?: number): string => {
  if (!completed) return 'bg-heatmap-empty';
  
  if (value !== undefined) {
    if (value >= 75) return 'bg-heatmap-level-4';
    if (value >= 50) return 'bg-heatmap-level-3';
    if (value >= 25) return 'bg-heatmap-level-2';
    return 'bg-heatmap-level-1';
  }
  
  return 'bg-heatmap-level-4';
};
