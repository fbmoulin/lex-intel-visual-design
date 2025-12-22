import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  FileText, 
  Search, 
  Sparkles, 
  Scale, 
  BookOpen,
  Lightbulb,
  MessageSquare,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AIChat } from '@/components/ai/AIChat';

const features = [
  {
    icon: MessageSquare,
    title: 'Chat Jurídico',
    description: 'Converse com a IA sobre qualquer tema jurídico',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Search,
    title: 'Busca Semântica',
    description: 'Encontre jurisprudência e legislação relevante',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Análise de Documentos',
    description: 'Analise contratos e petições automaticamente',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Lightbulb,
    title: 'Sugestões de Petição',
    description: 'Receba sugestões para melhorar suas petições',
    color: 'from-green-500 to-emerald-500',
  },
];

const categories = [
  { id: 'civil', label: 'Civil', icon: Scale },
  { id: 'trabalhista', label: 'Trabalhista', icon: BookOpen },
  { id: 'criminal', label: 'Criminal', icon: Scale },
  { id: 'tributario', label: 'Tributário', icon: FileText },
  { id: 'consumidor', label: 'Consumidor', icon: Scale },
];

export default function AIAssistant() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                <Bot className="h-8 w-8 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Assistente Jurídico IA
                </h1>
                <p className="text-sm text-zinc-400">
                  Powered by RAG + Gemini 2.0 Flash
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Database className="h-3 w-3 mr-1" />
                RAG Conectado
              </Badge>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                <Sparkles className="h-3 w-3 mr-1" />
                Gemini 2.0
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-20 w-fit mb-3`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-zinc-100 mb-1">{feature.title}</h3>
                  <p className="text-xs text-zinc-500">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <AIChat category={selectedCategory} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Filter */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-200">
                  Filtrar por Área
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Selecione uma área para contextualizar as respostas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={!selectedCategory ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(undefined)}
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Todas as Áreas
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <cat.icon className="h-4 w-4 mr-2" />
                    {cat.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sobre o RAG
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-zinc-400 space-y-2">
                <p>
                  O sistema RAG (Retrieval-Augmented Generation) busca informações relevantes 
                  em nossa base de dados jurídica antes de gerar respostas.
                </p>
                <p>
                  Isso garante respostas mais precisas e fundamentadas na legislação 
                  e jurisprudência brasileira.
                </p>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-200">
                  Base de Conhecimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-zinc-800/50">
                    <div className="text-2xl font-bold text-orange-400">10M+</div>
                    <div className="text-xs text-zinc-500">Documentos</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-zinc-800/50">
                    <div className="text-2xl font-bold text-orange-400">5</div>
                    <div className="text-xs text-zinc-500">Áreas do Direito</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
