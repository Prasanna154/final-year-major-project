import { ArrowUpRight, ArrowDownRight, DollarSign, BarChart3, Clock, Percent } from "lucide-react";

interface StatsCardsProps {
  stats: {
    high24h: number;
    low24h: number;
    volume: number;
    marketCap: number;
    lastUpdated: string;
    volatility: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const statItems = [
    {
      label: "24h High",
      value: `$${stats.high24h.toLocaleString()}`,
      icon: ArrowUpRight,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "24h Low",
      value: `$${stats.low24h.toLocaleString()}`,
      icon: ArrowDownRight,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "24h Volume",
      value: formatNumber(stats.volume),
      icon: BarChart3,
      color: "text-chart-blue",
      bgColor: "bg-chart-blue/10",
    },
    {
      label: "Market Cap",
      value: formatNumber(stats.marketCap),
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Volatility",
      value: `${stats.volatility.toFixed(1)}%`,
      icon: Percent,
      color: "text-chart-purple",
      bgColor: "bg-chart-purple/10",
    },
    {
      label: "Last Updated",
      value: stats.lastUpdated,
      icon: Clock,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((item, index) => (
        <div
          key={item.label}
          className="stat-card animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
          <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
