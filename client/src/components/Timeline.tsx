import { Circle } from "lucide-react";

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* Linha vertical conectora com gradiente */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff6b00] via-[#ff8c00] to-[#ffa500]" />
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-6 items-start animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
            {/* Marcador do evento com gradiente */}
            <div className="relative z-10 flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full lex-gradient shadow-lg shadow-primary/30">
                <Circle className="w-3 h-3 fill-black text-black" />
              </div>
            </div>
            
            {/* Conteúdo do evento */}
            <div className="flex-1 pb-8">
              <div className="lex-card border-0 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold lex-gradient-text">{event.date}</span>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-1">{event.title}</h4>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
