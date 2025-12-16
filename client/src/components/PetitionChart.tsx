import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

export interface ChartData {
  name: string;
  value: number;
}

interface PetitionChartProps {
  data: ChartData[];
  title: string;
  description?: string;
}

// Cores do gradiente laranja da Lex Intelligentia
const COLORS = ['#ff6b00', '#ff7a00', '#ff8c00', '#ff9a00', '#ffa500'];

export function PetitionChart({ data, title, description }: PetitionChartProps) {
  return (
    <Card className="lex-card border-0">
      <CardHeader>
        <CardTitle className="lex-gradient-text">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b00" stopOpacity={1} />
                <stop offset="50%" stopColor="#ff8c00" stopOpacity={1} />
                <stop offset="100%" stopColor="#ffa500" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 140, 0, 0.1)" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 140, 0, 0.3)' }}
              tickLine={{ stroke: 'rgba(255, 140, 0, 0.3)' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 140, 0, 0.3)' }}
              tickLine={{ stroke: 'rgba(255, 140, 0, 0.3)' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255, 140, 0, 0.3)',
                borderRadius: '0.5rem',
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(255, 140, 0, 0.2)'
              }}
              labelStyle={{ color: '#ff8c00', fontWeight: 'bold' }}
              itemStyle={{ color: '#ffffff' }}
              cursor={{ fill: 'rgba(255, 140, 0, 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ color: '#a0a0a0' }}
            />
            <Bar 
              dataKey="value" 
              fill="url(#barGradient)" 
              radius={[8, 8, 0, 0]}
              name="Valor (R$)"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
