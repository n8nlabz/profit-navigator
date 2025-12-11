import { Users } from 'lucide-react';
import { FinancialSummary } from '@/types/finance';

interface PartnerSplitProps {
  summary: FinancialSummary;
}

export function PartnerSplit({ summary }: PartnerSplitProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="glass rounded-xl p-6 border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 animate-fade-in">
      <h3 className="text-lg font-light text-foreground mb-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        Divisão entre Sócios (50/50)
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Partner 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-light text-primary">1</span>
            </div>
            <span className="text-sm text-muted-foreground">Sócio 1</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/30">
              <span className="text-xs text-muted-foreground">Custos</span>
              <span className="text-destructive font-light">
                -{formatCurrency(summary.costPerPartner)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-success/10 border border-success/20">
              <span className="text-xs text-muted-foreground">Lucro</span>
              <span className="text-success font-light text-lg">
                {formatCurrency(summary.profitPerPartner)}
              </span>
            </div>
          </div>
        </div>

        {/* Partner 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-sm font-light text-accent">2</span>
            </div>
            <span className="text-sm text-muted-foreground">Sócio 2</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-background/30">
              <span className="text-xs text-muted-foreground">Custos</span>
              <span className="text-destructive font-light">
                -{formatCurrency(summary.costPerPartner)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-success/10 border border-success/20">
              <span className="text-xs text-muted-foreground">Lucro</span>
              <span className="text-success font-light text-lg">
                {formatCurrency(summary.profitPerPartner)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
