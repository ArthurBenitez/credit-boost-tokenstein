import React from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TokenCard } from '@/components/TokenCard';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ReferralSection } from '@/components/ReferralSection';
import { TokenInventory } from '@/components/TokenInventory';
import { Button } from '@/components/ui/button';
import { tokens } from '@/data/tokens';

const Index = () => {
  return (
    <UserProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <HeroSection />
        
        {/* Estratégias de Marketing */}
        <section className="py-12 px-4 bg-gradient-card">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-bold mb-2">+ de 10.000 investidores</h3>
                <p className="text-sm text-muted-foreground">
                  Junte-se à maior comunidade de investidores em tokens imperiais do Brasil
                </p>
              </div>
              
              <div className="text-center p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  🔒
                </div>
                <h3 className="text-lg font-bold mb-2">100% Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Tecnologia blockchain e criptografia de ponta para proteger seus investimentos
                </p>
              </div>
              
              <div className="text-center p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  ⚡
                </div>
                <h3 className="text-lg font-bold mb-2">Retorno Imediato</h3>
                <p className="text-sm text-muted-foreground">
                  Receba pontos instantaneamente e converta em dinheiro quando quiser
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Token Inventory Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <TokenInventory />
          </div>
        </section>
        
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
        
        {/* Depoimentos e Confiança */}
        <section className="py-20 px-4 bg-gradient-card">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                O QUE NOSSOS{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  INVESTIDORES DIZEM
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-background p-6 rounded-lg border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Maria S.</p>
                    <p className="text-sm text-muted-foreground">Empresária</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Em 3 meses já recuperei meu investimento inicial. A plataforma é intuitiva e os resultados são consistentes!"
                </p>
                <div className="flex text-yellow-500 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                    J
                  </div>
                  <div>
                    <p className="font-semibold">João P.</p>
                    <p className="text-sm text-muted-foreground">Investidor</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Finalmente encontrei uma plataforma confiável para diversificar meus investimentos. Recomendo!"
                </p>
                <div className="flex text-yellow-500 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <p className="font-semibold">Ana L.</p>
                    <p className="text-sm text-muted-foreground">Professora</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Comecei com R$50 e já estou vendo resultados. O sistema de pontos é genial!"
                </p>
                <div className="flex text-yellow-500 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-4 bg-background p-4 rounded-lg border border-border">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    +1k
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Junte-se a mais de 10.000 investidores</p>
                  <p className="text-sm text-muted-foreground">que já estão lucrando com a Tokenstein</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                PRONTO PARA{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  MULTIPLICAR SEU DINHEIRO?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Comece agora mesmo com apenas R$3. Sem taxas ocultas, sem complicações.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-card p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-primary mb-2">R$ 3</div>
                  <p className="text-sm text-muted-foreground">Investimento mínimo</p>
                </div>
                <div className="bg-gradient-card p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-success mb-2">24h</div>
                  <p className="text-sm text-muted-foreground">Para sacar lucros</p>
                </div>
                <div className="bg-gradient-card p-4 rounded-lg border border-border">
                  <div className="text-2xl font-bold text-warning mb-2">0%</div>
                  <p className="text-sm text-muted-foreground">Taxa de entrada</p>
                </div>
              </div>
              
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-primary hover:opacity-90 h-11 rounded-md px-8 py-3">
                COMEÇAR AGORA - É GRÁTIS
              </button>
              
              <p className="text-sm text-muted-foreground mt-4">
                🔒 Seus dados estão seguros | ⚡ Ativação instantânea | 💰 Primeiros 20 créditos grátis
              </p>
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
