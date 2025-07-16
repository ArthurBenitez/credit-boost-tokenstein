import React from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TokenCard } from '@/components/TokenCard';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ReferralSection } from '@/components/ReferralSection';
import { tokens } from '@/data/tokens';

const Index = () => {
  return (
    <UserProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <HeroSection />
        
        {/* Tokens Section */}
        <section id="tokens-section" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                CONHEÇA NOSSOS{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  TOKENS IMPERIAIS
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Escolha entre os tokens imperiais disponíveis, cada um com diferentes características e rendimentos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Portfolio Section */}
        <PortfolioSection />
        
        {/* How it works */}
        <section className="py-20 px-4 bg-gradient-card">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                COMO A{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  TOKENSTEIN
                </span>{' '}
                FUNCIONA
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Crie Sua Conta</h3>
                <p className="text-muted-foreground">
                  Registre-se em menos de 2 minutos e faça seu primeiro depósito a partir de R$3 via PIX.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Compre Tokens</h3>
                <p className="text-muted-foreground">
                  Escolha entre os tokens imperiais disponíveis, cada um com diferentes características e rendimentos.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Acompanhe os Lucros</h3>
                <p className="text-muted-foreground">
                  Receba rendimentos diários e saque quando quiser. Simples e transparente.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Referral Section */}
        <ReferralSection />
        
        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TOKENSTEIN
              </h3>
            </div>
            <p className="text-muted-foreground">
              Primeira tecnologia de arbitragem automatizada que gera retornos consistentes com liquidez diária
            </p>
          </div>
        </footer>
      </div>
    </UserProvider>
  );
};

export default Index;
