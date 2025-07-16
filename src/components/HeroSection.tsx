import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, TrendingUp, Zap, Shield } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToTokens = () => {
    const tokensSection = document.getElementById('tokens-section');
    tokensSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent)] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent)] pointer-events-none animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-1 h-1 bg-primary rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-accent rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 animate-glow-pulse">
          💰 COMECE COM APENAS R$3
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
          Invista em{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Ativos de Tokens
          </span>
          <br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Imperiais
          </span>{' '}
          e Potencialize{' '}
          <br />
          Seus Rendimentos
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          Primeira tecnologia de arbitragem automatizada que gera retornos consistentes com liquidez diária
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-scale-in">
          <Button 
            onClick={scrollToTokens}
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-4 text-lg shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            VER TOKENS DISPONÍVEIS
          </Button>
          <Button 
            onClick={scrollToTokens}
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
          >
            COMO FUNCIONA
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
          <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="h-8 w-8 text-primary animate-float" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">R$3</div>
            <div className="text-muted-foreground">Depósito mínimo</div>
          </div>
          
          <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-3">
              <Zap className="h-8 w-8 text-primary animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">12,5%</div>
            <div className="text-muted-foreground">Retorno médio garantido</div>
          </div>
          
          <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-3">
              <Shield className="h-8 w-8 text-primary animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">24h</div>
            <div className="text-muted-foreground">Atendemos assim que possível</div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};