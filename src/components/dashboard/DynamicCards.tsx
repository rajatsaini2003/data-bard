import { useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Activity, BarChart3, Target, AlertCircle } from 'lucide-react';
import { DashboardCard } from '@/types';

interface DynamicCardsProps {
  cards: DashboardCard[];
  data: Record<string, unknown>[];
  className?: string;
}

const DynamicCards = ({ cards, data, className }: DynamicCardsProps) => {
  const calculateAggregation = useCallback((field: string, aggregation: string): number => {
    const values = data
      .map(item => item[field])
      .filter(value => value !== null && value !== undefined && !isNaN(Number(value)))
      .map(value => Number(value));

    if (values.length === 0) return 0;

    switch (aggregation) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'count':
        return values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      default:
        return 0;
    }
  }, [data]);

  const formatValue = (value: number, format?: string): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return value.toLocaleString();
    }
  };

  const getCardIcon = (variant?: string, trend?: string) => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    
    switch (variant) {
      case 'revenue':
      case 'currency':
        return DollarSign;
      case 'users':
      case 'customers':
        return Users;
      case 'performance':
      case 'efficiency':
        return Activity;
      case 'orders':
      case 'sales':
        return BarChart3;
      case 'target':
      case 'goal':
        return Target;
      default:
        return BarChart3;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderTooltip = (card: DashboardCard) => {
    if (!card.tooltip) return null;

    const tooltipContent = typeof card.tooltip === 'string' 
      ? card.tooltip 
      : card.tooltip.content || card.tooltip.title;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const cardValues = useMemo(() => {
    return cards.map(card => ({
      ...card,
      calculatedValue: calculateAggregation(card.valueField, card.aggregation)
    }));
  }, [cards, calculateAggregation]);

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(cards.length, 4)} gap-6 ${className}`}>
      {cardValues.map((card) => {
        const Icon = getCardIcon(card.variant, card.trend);
        const trendIcon = getTrendIcon(card.trend);
        const trendColorClass = getTrendColor(card.trend);

        return (
          <Card key={card.id} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                {renderTooltip(card)}
              </div>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatValue(card.calculatedValue, card.format)}
                </div>
                
                {(card.change || card.comparison) && (
                  <div className="flex items-center gap-2">
                    {trendIcon}
                    <p className={`text-xs ${trendColorClass}`}>
                      {card.change || card.comparison}
                    </p>
                  </div>
                )}

                {card.variant && (
                  <Badge variant="outline" className="text-xs">
                    {card.aggregation} of {card.valueField}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DynamicCards;