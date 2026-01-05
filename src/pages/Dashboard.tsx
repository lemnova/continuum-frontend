import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import HabitCard from '@/components/HabitCard';
import Heatmap from '@/components/Heatmap';
import { Button } from '@/components/ui/button';
import { habitApi } from '@/lib/api';
import { Habit, ProgressEntry, parseProgressJson } from '@/types';
import { calculateHabitProgress, calculateStreak } from '@/lib/habitUtils';
import { Target, Flame, Trophy, TrendingUp, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user?.id) return;
      try {
        const data = await habitApi.listByUser(user.id);
        setHabits(data);
      } catch (error) {
        console.error('Error fetching habits:', error);
        toast.error('Erro ao carregar hábitos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHabits();
  }, [user?.id]);

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

  // Calculate dashboard stats
  const totalHabits = habits.length;
  const averageProgress = totalHabits > 0 
    ? Math.round(habits.reduce((acc, habit) => acc + calculateHabitProgress(habit), 0) / totalHabits)
    : 0;
  
  // Aggregate all progress for overall streak
  const allProgress: ProgressEntry[] = habits.flatMap(h => parseProgressJson(h.progressJson));
  const { current: currentStreak, longest: longestStreak } = calculateStreak(allProgress);

  // Get top 3 habits by progress
  const topHabits = [...habits]
    .sort((a, b) => calculateHabitProgress(b) - calculateHabitProgress(a))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Olá, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui está o resumo do seu progresso
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total de Hábitos"
            value={totalHabits}
            icon={Target}
            className="stagger-1"
          />
          <StatCard
            title="Progresso Geral"
            value={`${averageProgress}%`}
            subtitle="média de todos os hábitos"
            icon={TrendingUp}
            className="stagger-2"
          />
          <StatCard
            title="Sequência Atual"
            value={`${currentStreak} dias`}
            icon={Flame}
            trend={currentStreak >= 7 ? 'up' : currentStreak >= 3 ? 'neutral' : 'down'}
            trendValue={currentStreak >= 7 ? 'Excelente!' : currentStreak >= 3 ? 'Continue assim' : 'Vamos melhorar'}
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

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Habits section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Hábitos em Destaque
              </h2>
              <Link to="/habits">
                <Button variant="ghost" className="gap-2">
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            {topHabits.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-card border border-border">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Nenhum hábito ainda</h3>
                <p className="text-muted-foreground mb-4">Crie seu primeiro hábito para começar</p>
                <Link to="/habits">
                  <Button>Criar Hábito</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {topHabits.map((habit, i) => (
                  <Link key={habit.id} to={`/habits/${habit.id}`}>
                    <HabitCard 
                      habit={habit} 
                      className={`stagger-${i + 1}`}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activity heatmap */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Atividade Geral</h2>
            <div className="p-6 rounded-xl bg-card border border-border">
              {allProgress.length > 0 ? (
                <Heatmap 
                  progress={allProgress} 
                  className="animate-fade-in stagger-2"
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma atividade registrada
                </div>
              )}
            </div>
            
            {/* Quick actions */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h3 className="font-semibold">Ações Rápidas</h3>
              <div className="space-y-2">
                <Link to="/habits" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Target className="w-4 h-4" />
                    Gerenciar Hábitos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
