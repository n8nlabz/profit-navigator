import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cost } from '@/types/finance';
import { cn } from '@/lib/utils';

interface CostsTableProps {
  costs: Cost[];
  onAddCost: (name: string, value: number) => void;
  onRemoveCost: (id: string) => void;
}

export function CostsTable({ costs, onAddCost, onRemoveCost }: CostsTableProps) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && value) {
      onAddCost(name.trim(), parseFloat(value));
      setName('');
      setValue('');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="glass rounded-xl p-6 border border-destructive/20 bg-gradient-to-br from-destructive/10 to-destructive/5 animate-fade-in">
      <h3 className="text-lg font-light text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-destructive"></span>
        Custos
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <Input
          placeholder="Nome do custo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
        />
        <Input
          type="number"
          placeholder="Valor (R$)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-32 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
          step="0.01"
          min="0"
        />
        <Button type="submit" variant="gradient" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {costs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            Nenhum custo adicionado
          </p>
        ) : (
          costs.map((cost, index) => (
            <div
              key={cost.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30',
                'hover:bg-background/50 transition-all duration-200',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div>
                <p className="text-sm font-light text-foreground">{cost.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(cost.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-destructive font-light">
                  -{formatCurrency(cost.value)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveCost(cost.id)}
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
