import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity } from "lucide-react";

interface MovingAverageChartProps {
  data: Array<{ date: string; price: number; ma7: number; ma30: number }>;
}

const MovingAverageChart = ({ data }: MovingAverageChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50 shadow-xl">
          <p className="text-xs text-muted-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}:</span>
              <span className="text-sm font-semibold text-foreground">
                ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container h-[320px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-chart-purple/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-chart-purple" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Moving Averages</h3>
          <p className="text-xs text-muted-foreground">7-day and 30-day MA trends</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '10px',
              fontSize: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            name="Price"
            stroke="hsl(var(--foreground))"
            strokeWidth={1.5}
            dot={false}
            opacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="ma7"
            name="MA 7"
            stroke="hsl(var(--chart-green))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="ma30"
            name="MA 30"
            stroke="hsl(var(--chart-purple))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MovingAverageChart;
