import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { CandlestickChart as CandlestickIcon } from "lucide-react";

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
}

const CandlestickChart = ({ data }: CandlestickChartProps) => {
  // Transform data for bar chart representation of candlesticks
  const transformedData = data.map(item => ({
    ...item,
    // Body of the candle (open to close)
    body: [Math.min(item.open, item.close), Math.max(item.open, item.close)],
    // Full range (low to high)
    range: [item.low, item.high],
    isGreen: item.close >= item.open,
    bodyHeight: Math.abs(item.close - item.open),
    bodyStart: Math.min(item.open, item.close),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = data.find(d => d.date === label);
      if (!item) return null;
      
      const isGreen = item.close >= item.open;
      
      return (
        <div className="glass-card p-3 border border-border/50 shadow-xl">
          <p className="text-xs text-muted-foreground mb-2">{label}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-muted-foreground">Open:</span>
            <span className="text-foreground font-medium">${item.open.toLocaleString()}</span>
            <span className="text-muted-foreground">High:</span>
            <span className="text-foreground font-medium">${item.high.toLocaleString()}</span>
            <span className="text-muted-foreground">Low:</span>
            <span className="text-foreground font-medium">${item.low.toLocaleString()}</span>
            <span className="text-muted-foreground">Close:</span>
            <span className={`font-medium ${isGreen ? 'text-success' : 'text-destructive'}`}>
              ${item.close.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;

  return (
    <div className="chart-container h-[320px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CandlestickIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Candlestick Chart</h3>
          <p className="text-xs text-muted-foreground">OHLC price visualization</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart data={transformedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            domain={[minPrice, maxPrice]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Wicks (high-low lines) */}
          {transformedData.map((entry, index) => (
            <ReferenceLine
              key={`wick-${index}`}
              segment={[
                { x: entry.date, y: entry.low },
                { x: entry.date, y: entry.high }
              ]}
              stroke={entry.isGreen ? 'hsl(var(--chart-green))' : 'hsl(var(--chart-red))'}
              strokeWidth={1}
            />
          ))}
          
          {/* Candle bodies */}
          <Bar 
            dataKey="bodyHeight" 
            fill="hsl(var(--chart-green))"
            radius={[2, 2, 2, 2]}
          >
            {transformedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isGreen ? 'hsl(var(--chart-green))' : 'hsl(var(--chart-red))'}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
