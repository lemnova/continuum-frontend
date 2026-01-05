import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Infinity, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
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
            <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mt-2">
              Entre para continuar sua jornada
            </p>
          </div>

          {/* Demo credentials */}
          <div className="p-4 rounded-lg bg-secondary border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Demo:</strong> demo@continuum.com / demo123
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

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-secondary">
        <div className="max-w-lg text-center space-y-6 animate-slide-up">
          <div className="w-64 h-64 mx-auto rounded-3xl gradient-primary opacity-20 blur-3xl absolute" />
          <div className="relative">
            <div className="grid grid-cols-7 gap-1.5 mb-8">
              {Array.from({ length: 49 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-6 h-6 rounded-sm ${
                    Math.random() > 0.3 
                      ? `bg-heatmap-level-${Math.ceil(Math.random() * 4)}` 
                      : 'bg-heatmap-empty'
                  }`}
                  style={{ animationDelay: `${i * 20}ms` }}
                />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold">Acompanhe seu progresso</h2>
          <p className="text-muted-foreground">
            Visualize suas metas como nunca antes. Heatmaps inspirados no GitHub 
            para você ver exatamente onde está evoluindo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
