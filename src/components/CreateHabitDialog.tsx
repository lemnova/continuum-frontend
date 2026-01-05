import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Target } from 'lucide-react';
import { HabitCreateDTO } from '@/lib/api';
import { format } from 'date-fns';

interface CreateHabitDialogProps {
  onCreateHabit: (dto: HabitCreateDTO) => void;
}

const CreateHabitDialog: React.FC<CreateHabitDialogProps> = ({ onCreateHabit }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    initDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dto: HabitCreateDTO = {
      name: formData.name,
      initDate: formData.initDate,
      metadataJson: JSON.stringify({ description: formData.description }),
    };
    
    onCreateHabit(dto);
    
    setFormData({
      name: '',
      description: '',
      initDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Hábito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Criar Novo Hábito</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Hábito</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Exercício diário, Leitura..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva seu hábito em detalhes..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initDate">Data de Início</Label>
            <Input
              id="initDate"
              type="date"
              value={formData.initDate}
              onChange={(e) => setFormData({ ...formData, initDate: e.target.value })}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Hábito
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHabitDialog;
