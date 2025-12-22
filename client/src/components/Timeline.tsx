import { Circle, Calendar } from "lucide-react";

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
    <div className="relative bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-amber-600" />
        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Cronologia dos Fatos</h4>
      </div>
      
      <div className="relative">
        {/* Linha vertical conectora com gradiente */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-400" />
        
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="relative flex gap-6 items-start">
              {/* Marcador do evento com gradiente */}
              <div className="relative z-10 flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                  <Circle className="w-3 h-3 fill-white text-white" />
                </div>
              </div>
              
              {/* Conteúdo do evento */}
              <div className="flex-1 pb-2">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-amber-600">{event.date}</span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
