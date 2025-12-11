import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sale } from '@/types/finance';
import { cn } from '@/lib/utils';

interface SalesTableProps {
  sales: Sale[];
  onRemoveSale: (id: string) => void;
}

export function SalesTable({ sales, onRemoveSale }: SalesTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="glass rounded-xl p-6 border border-success/20 bg-gradient-to-br from-success/10 to-success/5 animate-fade-in">
      <h3 className="text-lg font-light text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success"></span>
        Vendas Confirmadas
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sales.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            Nenhuma venda registrada
          </p>
        ) : (
          sales.map((sale, index) => (
            <div
              key={sale.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30',
                'hover:bg-background/50 transition-all duration-200',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-light text-foreground">{sale.customerName}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {sale.source}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {sale.credits} créditos • {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-success font-light">
                  +{formatCurrency(sale.value)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveSale(sale.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
