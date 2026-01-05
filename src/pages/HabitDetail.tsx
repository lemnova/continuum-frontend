import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Heatmap from '@/components/Heatmap';
import StatCard from '@/components/StatCard';
import { habitApi } from '@/lib/api';
import { Habit, parseHabitMetadata, parseProgressJson } from '@/types';
import { calculateHabitProgress, calculateHabitStats, calculateStreak, getHabitProgress } from '@/lib/habitUtils';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Target, Calendar, TrendingUp, TrendingDown, Minus, 
  Flame, Trophy, ArrowLeft, CheckCircle, Circle, Trash2, Edit, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const HabitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    const fetchHabit = async () => {
      if (!id || !user?.id) return;
      try {
        const data = await habitApi.getById(user.id, parseInt(id));
        setHabit(data);
        if (data) {
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const progress = parseProgressJson(data.progressJson);
          const todayEntry = progress.find(p => p.date === todayStr);
          setTodayCompleted(todayEntry?.completed || false);
        }
      } catch (error) {
        console.error('Error fetching habit:', error);
        toast.error('Erro ao carregar hábito');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHabit();
  }, [id, user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!habit) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Hábito não encontrado</h1>
            <Link to="/habits">
              <Button>Voltar para Hábitos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressValue = calculateHabitProgress(habit);
  const stats = calculateHabitStats(habit);
  const progressEntries = getHabitProgress(habit);
  const { current: currentStreak, longest: longestStreak } = calculateStreak(progressEntries);
  const metadata = parseHabitMetadata(habit.metadataJson);
  
  const initDate = parseISO(habit.initDate);
  const daysActive = differenceInDays(new Date(), initDate);

  const trendConfig = {
    improving: { icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', label: 'Melhorando' },
    stable: { icon: Minus, color: 'text-warning', bg: 'bg-warning/10', label: 'Estável' },
    declining: { icon: TrendingDown, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Em queda' },
  };

  const TrendIcon = trendConfig[stats.trend].icon;

  const handleToggleToday = async () => {
    if (!user?.id) return;
    
    const newValue = !todayCompleted;
    setTodayCompleted(newValue);
    
    try {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const updatedHabit = await habitApi.updateProgress(
        user.id, 
        habit.id, 
        habit.progressJson,
        todayStr, 
        newValue
      );
      setHabit(updatedHabit);
      toast.success(newValue ? 'Marcado como concluído!' : 'Desmarcado para hoje');
    } catch (error) {
      console.error('Error updating progress:', error);
      setTodayCompleted(!newValue); // Revert on error
      toast.error('Erro ao atualizar progresso');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/habits" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Hábitos
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl gradient-primary">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{habit.name}</h1>
                {metadata.description && (
                  <p className="text-muted-foreground">{metadata.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Início: {format(initDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                trendConfig[stats.trend].bg,
                trendConfig[stats.trend].color
              )}>
                <TrendIcon className="w-4 h-4" />
                {trendConfig[stats.trend].label}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Today's check-in */}
        <div 
          className={cn(
            "p-6 rounded-xl border mb-8 transition-all cursor-pointer animate-fade-in",
            todayCompleted 
              ? "bg-primary/5 border-primary/30 hover:bg-primary/10" 
              : "bg-card border-border hover:border-primary/30"
          )}
          onClick={handleToggleToday}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {todayCompleted ? (
                <CheckCircle className="w-8 h-8 text-primary" />
              ) : (
                <Circle className="w-8 h-8 text-muted-foreground" />
              )}
              <div>
                <h3 className="font-semibold text-lg">
                  {todayCompleted ? 'Concluído hoje!' : 'Marcar como concluído'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
            </div>
            <Button variant={todayCompleted ? "secondary" : "default"}>
              {todayCompleted ? 'Desmarcar' : 'Concluir'}
            </Button>
          </div>
        </div>

        {/* Progress overview */}
        <div className="p-6 rounded-xl bg-card border border-border mb-8 animate-fade-in stagger-1">
          <h2 className="text-xl font-semibold mb-4">Progresso Geral</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{stats.completedDays} de {stats.totalDays} dias</span>
              <span className="font-bold text-2xl gradient-text">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-4" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Progresso Semanal"
            value={`${stats.weeklyProgress}%`}
            icon={TrendingUp}
            className="stagger-1"
          />
          <StatCard
            title="Progresso Mensal"
            value={`${stats.monthlyProgress}%`}
            icon={Calendar}
            className="stagger-2"
          />
          <StatCard
            title="Sequência Atual"
            value={`${currentStreak} dias`}
            icon={Flame}
            iconClassName="bg-warning/10"
            className="stagger-3"
          />
          <StatCard
            title="Maior Sequência"
            value={`${longestStreak} dias`}
            icon={Trophy}
            iconClassName="bg-accent/10"
            className="stagger-4"
          />
        </div>

        {/* Heatmap */}
        <div className="p-6 rounded-xl bg-card border border-border animate-fade-in stagger-5">
          <h2 className="text-xl font-semibold mb-6">Histórico de Atividade</h2>
          <Heatmap progress={progressEntries} />
        </div>
      </main>
    </div>
  );
};

export default HabitDetail;
