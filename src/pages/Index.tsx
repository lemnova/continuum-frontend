import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Infinity, Target, TrendingUp, Calendar, Flame, ArrowRight, CheckCircle } from 'lucide-react';

const Index: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Metas Personalizadas',
      description: 'Crie e gerencie metas adaptadas aos seus objetivos pessoais',
    },
    {
      icon: Calendar,
      title: 'Rastreamento Diário',
      description: 'Acompanhe seu progresso dia a dia com visualizações claras',
    },
    {
      icon: TrendingUp,
      title: 'Estatísticas Detalhadas',
      description: 'Analise tendências semanais, mensais e identifique padrões',
    },
    {
      icon: Flame,
      title: 'Sequências Motivadoras',
      description: 'Mantenha o foco com contadores de sequência e recordes',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg gradient-primary">
                <Infinity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">Continuum</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button className="gap-2">
                  Começar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transforme hábitos em{' '}
              <span className="gradient-text">conquistas contínuas</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Visualize seu progresso como nunca antes. Heatmaps estilo GitHub, 
              estatísticas inteligentes e motivação para manter a consistência.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="xl" className="gap-2 w-full sm:w-auto">
                  Começar gratuitamente
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Heatmap preview */}
          <div className="mt-16 max-w-4xl mx-auto animate-slide-up">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-2xl">
              <div className="grid grid-cols-12 gap-1.5">
                {Array.from({ length: 84 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`aspect-square rounded-sm transition-all duration-300 ${
                      Math.random() > 0.25 
                        ? `bg-heatmap-level-${Math.ceil(Math.random() * 4)}` 
                        : 'bg-heatmap-empty'
                    }`}
                    style={{ 
                      animationDelay: `${i * 15}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tudo que você precisa para{' '}
              <span className="gradient-text">evoluir</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas em uma interface simples e intuitiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-8 lg:p-12 rounded-2xl gradient-primary text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Junte-se a milhares de pessoas que já estão transformando seus hábitos
            </p>
            <Link to="/register">
              <Button size="xl" variant="secondary" className="gap-2">
                Criar conta gratuita
                <CheckCircle className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg gradient-primary">
                <Infinity className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold gradient-text">Continuum</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Continuum. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
