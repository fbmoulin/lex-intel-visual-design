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
      {/* Linha vertical conectora */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-6 items-start">
            {/* Marcador do evento */}
            <div className="relative z-10 flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <Circle className="w-3 h-3 fill-primary-foreground text-primary-foreground" />
              </div>
            </div>
            
            {/* Conteúdo do evento */}
            <div className="flex-1 pb-8">
              <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-primary">{event.date}</span>
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
