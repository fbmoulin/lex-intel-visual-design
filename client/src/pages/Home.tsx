import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, ArrowRight, BarChart3, Palette } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Logo Section - Centralizada em card preto como na referência */}
        <section className="container py-12">
          <div className="flex justify-center">
            <div className="bg-black rounded-2xl px-12 py-10 shadow-2xl border border-primary/20">
              <img 
                src="/images/logo-lex-retangular.jpeg" 
                alt="Lex Intelligentia" 
                className="h-32 md:h-40 lg:h-48 object-contain"
              />
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="container py-12 relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Petições Jurídicas Modernas</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Transforme suas petições com{" "}
              <span className="lex-gradient-text">Visual Law</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Crie petições jurídicas profissionais com design moderno, elementos visuais e clareza excepcional.
              Baseado nas melhores práticas internacionais de Legal Design.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/templates">
                <Button size="lg" className="lex-button gap-2">
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" className="lex-button-outline">Ver Exemplos</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-4">
              <span className="lex-gradient-text">Recursos Principais</span>
            </h3>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Ferramentas profissionais para criar petições que se destacam
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="lex-card border-0 transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg lex-gradient flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-foreground">Templates Especializados</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Modelos prontos para diferentes áreas do direito: civil, trabalhista, criminal, tributário e consumidor.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="lex-card border-0 transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg lex-gradient flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-foreground">Visual Law</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Timelines, gráficos e elementos visuais que facilitam a compreensão e reduzem o tempo de análise.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="lex-card border-0 transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg lex-gradient flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-foreground">Design Profissional</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Paleta de cores estratégica, tipografia otimizada e layouts modernos que transmitem credibilidade.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16">
          <div className="max-w-3xl mx-auto">
            <Card className="lex-card border-0 lex-glow">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Pronto para modernizar suas petições?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Junte-se aos advogados que já estão usando Visual Law para criar petições mais eficazes.
                </p>
                <Link href="/templates">
                  <Button size="lg" className="lex-button">Criar Primeira Petição</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
