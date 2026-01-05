import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import HabitCard from '@/components/HabitCard';
import CreateHabitDialog from '@/components/CreateHabitDialog';
import { habitApi, HabitCreateDTO } from '@/lib/api';
import { Habit } from '@/types';
import { calculateHabitProgress } from '@/lib/habitUtils';
import { Target, SortAsc, LayoutGrid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { parseHabitMetadata } from '@/types';

type SortOption = 'name' | 'progress' | 'date';
type ViewMode = 'grid' | 'list';

const Habits: React.FC = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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

  const handleCreateHabit = async (dto: HabitCreateDTO) => {
    if (!user?.id) return;
    try {
      const createdHabit = await habitApi.create(user.id, dto);
      setHabits([createdHabit, ...habits]);
      toast.success('Hábito criado com sucesso!');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Erro ao criar hábito');
    }
  };

  // Filter and sort habits
  const filteredHabits = habits
    .filter(habit => {
      const metadata = parseHabitMetadata(habit.metadataJson);
      return (
        habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (metadata.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return calculateHabitProgress(b) - calculateHabitProgress(a);
        case 'date':
          return new Date(b.initDate).getTime() - new Date(a.initDate).getTime();
        default:
          return 0;
      }
    });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Meus Hábitos
            </h1>
            <p className="text-muted-foreground mt-1">
              {habits.length} {habits.length === 1 ? 'hábito' : 'hábitos'} cadastrados
            </p>
          </div>
          
          <CreateHabitDialog onCreateHabit={handleCreateHabit} />
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl bg-card border border-border animate-fade-in">
          <div className="flex-1">
            <Input
              placeholder="Buscar hábitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[160px]">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Mais recentes</SelectItem>
                <SelectItem value="progress">Progresso</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-input rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Habits grid/list */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? 'Nenhum hábito encontrado' : 'Nenhum hábito criado'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Tente buscar com outros termos' 
                : 'Comece criando seu primeiro hábito para acompanhar seu progresso'
              }
            </p>
            {!searchTerm && (
              <CreateHabitDialog onCreateHabit={handleCreateHabit} />
            )}
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
              : "space-y-4"
          )}>
            {filteredHabits.map((habit, i) => (
              <Link key={habit.id} to={`/habits/${habit.id}`}>
                <HabitCard 
                  habit={habit}
                  className={`stagger-${(i % 5) + 1}`}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Habits;
