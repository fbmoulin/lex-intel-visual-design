import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main>
        <section className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Petições Jurídicas Modernas</span>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Transforme suas petições com Visual Law
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Crie petições jurídicas profissionais com design moderno, elementos visuais e clareza excepcional.
              Baseado nas melhores práticas internacionais de Legal Design.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/templates">
                <Button size="lg" className="gap-2">
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">Ver Exemplos</Button>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Recursos Principais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Templates Especializados</CardTitle>
                  <CardDescription>
                    Modelos prontos para diferentes áreas do direito: civil, trabalhista, criminal, tributário e consumidor.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Scale className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Visual Law</CardTitle>
                  <CardDescription>
                    Timelines, gráficos e elementos visuais que facilitam a compreensão e reduzem o tempo de análise.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Design Profissional</CardTitle>
                  <CardDescription>
                    Paleta de cores estratégica, tipografia otimizada e layouts modernos que transmitem credibilidade.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-4">Pronto para modernizar suas petições?</h3>
                <p className="text-muted-foreground mb-6">
                  Junte-se aos advogados que já estão usando Visual Law para criar petições mais eficazes.
                </p>
                <Link href="/templates">
                  <Button size="lg">Criar Primeira Petição</Button>
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
