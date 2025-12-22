import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, Trash2, Copy, Check, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAIChat, ChatMessage } from '@/hooks/useAI';
import { cn } from '@/lib/utils';

interface AIChatProps {
  className?: string;
  category?: string;
  initialMessage?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

const QUICK_SUGGESTIONS = [
  'Quais são os requisitos para uma ação de despejo por falta de pagamento?',
  'Como calcular danos morais em ações de consumidor?',
  'Qual o prazo prescricional para ação trabalhista?',
  'Explique a diferença entre tutela antecipada e liminar',
  'Quais documentos são necessários para uma ação de alimentos?',
];

export function AIChat({ className, category, initialMessage, onSuggestionClick }: AIChatProps) {
  const { messages, isLoading, error, sendMessage, streamMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

    setInput('');
    setStreamingContent('');

    try {
      await streamMessage(
        messageContent,
        (token) => {
          setStreamingContent((prev) => prev + token);
        },
        { useRAG: true, category }
      );
      setStreamingContent('');
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) {
          return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(2)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h4 key={i} className="text-md font-semibold mt-3 mb-1">{line.slice(3)}</h4>;
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
        }
        if (line.startsWith('* ')) {
          return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\. /)) {
          return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="mb-2">{line}</p>;
      });
  };

  return (
    <Card className={cn('flex flex-col h-[600px] bg-zinc-900/50 border-zinc-800', className)}>
      <CardHeader className="border-b border-zinc-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20">
              <Scale className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-zinc-100">
                Assistente Jurídico IA
              </CardTitle>
              <p className="text-xs text-zinc-500">
                Powered by RAG + Gemini 2.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">
              <Sparkles className="h-3 w-3 mr-1" />
              RAG Ativo
            </Badge>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 && !streamingContent ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/10 mb-4">
                <Bot className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-200 mb-2">
                Como posso ajudar?
              </h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-md">
                Faça perguntas sobre direito brasileiro, peça sugestões para petições ou tire dúvidas sobre legislação.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {QUICK_SUGGESTIONS.map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-orange-500/50"
                    onClick={() => {
                      onSuggestionClick?.(suggestion);
                      handleSend(suggestion);
                    }}
                  >
                    {suggestion.length > 50 ? suggestion.slice(0, 50) + '...' : suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 h-fit">
                        <Bot className="h-4 w-4 text-orange-400" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-3 relative group',
                        message.role === 'user'
                          ? 'bg-orange-500/20 text-zinc-100'
                          : 'bg-zinc-800/50 text-zinc-200'
                      )}
                    >
                      <div className="text-sm prose prose-invert prose-sm max-w-none">
                        {formatMessage(message.content)}
                      </div>
                      {message.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(message.content, index)}
                        >
                          {copiedId === index ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-zinc-400" />
                          )}
                        </Button>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 p-2 rounded-lg bg-zinc-800 h-fit">
                        <User className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {streamingContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 h-fit">
                    <Bot className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-3 bg-zinc-800/50 text-zinc-200">
                    <div className="text-sm prose prose-invert prose-sm max-w-none">
                      {formatMessage(streamingContent)}
                    </div>
                    <span className="inline-block w-2 h-4 bg-orange-400 animate-pulse ml-1" />
                  </div>
                </motion.div>
              )}

              {isLoading && !streamingContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 h-fit">
                    <Bot className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="rounded-lg p-3 bg-zinc-800/50">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta jurídica..."
              className="min-h-[44px] max-h-[120px] resize-none bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIChat;
