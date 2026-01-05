import React from 'react';
import { ProgressEntry } from '@/types';
import { getHeatmapColor } from '@/lib/habitUtils';
import { format, parseISO, startOfYear, eachWeekOfInterval, eachDayOfInterval, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  progress: ProgressEntry[];
  className?: string;
}

const Heatmap: React.FC<HeatmapProps> = ({ progress, className }) => {
  const today = new Date();
  const yearStart = startOfYear(today);
  
  // Create a map for quick lookup
  const progressMap = new Map(progress.map(p => [p.date, p]));
  
  // Get all weeks of the year
  const weeks = eachWeekOfInterval(
    { start: yearStart, end: today },
    { weekStartsOn: 0 }
  );

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <TooltipProvider>
      <div className={cn("overflow-x-auto", className)}>
        <div className="min-w-fit">
          {/* Month labels */}
          <div className="flex mb-2 ml-10">
            {months.map((month, i) => (
              <span 
                key={month} 
                className="text-xs text-muted-foreground"
                style={{ width: `${100 / 12}%`, minWidth: '40px' }}
              >
                {month}
              </span>
            ))}
          </div>
          
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2">
              {weekDays.map((day, i) => (
                <span 
                  key={day} 
                  className="text-xs text-muted-foreground h-[13px] leading-[13px]"
                  style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {day}
                </span>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex gap-[3px]">
              {weeks.map((weekStart, weekIndex) => {
                const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
                const days = eachDayOfInterval({ 
                  start: weekStart, 
                  end: weekEnd > today ? today : weekEnd 
                });
                
                return (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const day = days.find(d => getDay(d) === dayIndex);
                      
                      if (!day || day > today) {
                        return (
                          <div 
                            key={dayIndex} 
                            className="w-[13px] h-[13px] rounded-sm bg-transparent"
                          />
                        );
                      }
                      
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const entry = progressMap.get(dateStr);
                      const colorClass = entry 
                        ? getHeatmapColor(entry.completed, entry.value)
                        : 'bg-heatmap-empty';
                      
                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div 
                              className={cn(
                                "w-[13px] h-[13px] heatmap-cell",
                                colorClass
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">
                              {format(day, "d 'de' MMMM", { locale: ptBR })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entry?.completed ? '✓ Concluído' : '○ Não concluído'}
                              {entry?.value !== undefined && ` (${entry.value}%)`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 ml-10">
            <span className="text-xs text-muted-foreground">Menos</span>
            <div className="w-[13px] h-[13px] rounded-sm bg-heatmap-empty" />
            <div className="w-[13px] h-[13px] rounded-sm bg-heatmap-level-1" />
            <div className="w-[13px] h-[13px] rounded-sm bg-heatmap-level-2" />
            <div className="w-[13px] h-[13px] rounded-sm bg-heatmap-level-3" />
            <div className="w-[13px] h-[13px] rounded-sm bg-heatmap-level-4" />
            <span className="text-xs text-muted-foreground">Mais</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Heatmap;
