import React from 'react';
import { Habit, parseHabitMetadata } from '@/types';
import { calculateHabitProgress, calculateHabitStats } from '@/lib/habitUtils';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Target, TrendingUp, TrendingDown, Minus, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface HabitCardProps {
  habit: Habit;
  onClick?: () => void;
  className?: string;
}

// Safe date formatting - never crashes on undefined/invalid dates
const formatSafeDate = (dateString: string | undefined | null, formatStr: string): string => {
  if (!dateString) return '—';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '—';
    return format(date, formatStr, { locale: ptBR });
  } catch {
    return '—';
  }
};

const HabitCard: React.FC<HabitCardProps> = ({ habit, onClick, className }) => {
  const progress = calculateHabitProgress(habit);
  const stats = calculateHabitStats(habit);
  const metadata = parseHabitMetadata(habit.metadataJson);
  
  const trendConfig = {
    improving: { icon: TrendingUp, color: 'text-success', label: 'Melhorando' },
    stable: { icon: Minus, color: 'text-warning', label: 'Estável' },
    declining: { icon: TrendingDown, color: 'text-destructive', label: 'Em queda' },
  };

  const TrendIcon = trendConfig[stats.trend].icon;

  return (
    <div 
      className={cn(
        "goal-card cursor-pointer group animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {habit.name}
            </h3>
            {metadata.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {metadata.description}
              </p>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatSafeDate(habit.initDate, "dd MMM")}
              </span>
            </div>
            <div className={cn("flex items-center gap-1.5 text-sm", trendConfig[stats.trend].color)}>
              <TrendIcon className="w-4 h-4" />
              <span>{trendConfig[stats.trend].label}</span>
            </div>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Semanal: </span>
            <span className="font-medium">{stats.weeklyProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
