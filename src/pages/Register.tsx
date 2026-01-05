import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Infinity, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, password);
      if (success) {
        toast.success('Conta criada com sucesso!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Crie metas personalizadas',
    'Acompanhe progresso diário',
    'Visualize com heatmaps',
    'Estatísticas detalhadas',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-secondary">
        <div className="max-w-lg space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Comece sua jornada</h2>
            <p className="text-muted-foreground text-lg">
              Transforme hábitos em conquistas com visualizações poderosas 
              e acompanhamento inteligente.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="p-2 rounded-xl gradient-primary">
                <Infinity className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold gradient-text">Continuum</span>
            </Link>
            <h1 className="text-3xl font-bold">Criar conta</h1>
            <p className="text-muted-foreground mt-2">
              Comece a rastrear suas metas hoje
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar conta'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
