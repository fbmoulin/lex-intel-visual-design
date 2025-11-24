import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Briefcase, Gavel, FileText, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const templates = [
  {
    id: "civil",
    title: "Petição Civil",
    description: "Template para ações cíveis, como cobrança, indenização e contratos",
    icon: Scale,
    color: "text-blue-600"
  },
  {
    id: "trabalhista",
    title: "Petição Trabalhista",
    description: "Template para ações trabalhistas e reclamações",
    icon: Briefcase,
    color: "text-green-600"
  },
  {
    id: "criminal",
    title: "Petição Criminal",
    description: "Template para ações penais e defesas criminais",
    icon: Gavel,
    color: "text-red-600"
  },
  {
    id: "tributaria",
    title: "Petição Tributária",
    description: "Template para ações fiscais e tributárias",
    icon: FileText,
    color: "text-purple-600"
  },
  {
    id: "consumidor",
    title: "Direito do Consumidor",
    description: "Template para ações consumeristas e CDC",
    icon: ShoppingCart,
    color: "text-orange-600"
  }
];

export default function Templates() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Escolha um Template</h2>
            <p className="text-xl text-muted-foreground">
              Selecione o tipo de petição que deseja criar com Visual Law
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-8 w-8 ${template.color}`} />
                      <CardTitle>{template.title}</CardTitle>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href={`/editor/${template.id}`} className="w-full">
                      <Button className="w-full">Usar Template</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
