import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSale: (source: string, value: number, credits: number, customerName: string) => void;
}

const SALE_SOURCES = [
  { value: 'abacate_pay', label: 'Abacate Pay' },
  { value: 'pix', label: 'PIX Direto' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'outros', label: 'Outros' },
];

export function AddSaleModal({ isOpen, onClose, onAddSale }: AddSaleModalProps) {
  const [source, setSource] = useState('');
  const [value, setValue] = useState('');
  const [credits, setCredits] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source && value && credits && customerName.trim()) {
      onAddSale(source, parseFloat(value), parseInt(credits), customerName.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setSource('');
    setValue('');
    setCredits('');
    setCustomerName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative glass rounded-2xl p-8 w-full max-w-md border border-primary/20 shadow-2xl animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <h2 className="text-2xl font-light text-foreground mb-6 gradient-text">
          Adicionar Venda
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-sm text-muted-foreground">
              Nome do Cliente
            </Label>
            <Input
              id="customerName"
              placeholder="Digite o nome do cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm text-muted-foreground">
              Origem da Venda
            </Label>
            <Select value={source} onValueChange={setSource} required>
              <SelectTrigger className="bg-background/50 border-border/50 text-foreground">
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {SALE_SOURCES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm text-muted-foreground">
                Valor (R$)
              </Label>
              <Input
                id="value"
                type="number"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits" className="text-sm text-muted-foreground">
                Créditos
              </Label>
              <Input
                id="credits"
                type="number"
                placeholder="0"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                min="0"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="gradient" className="w-full mt-6">
            Confirmar Venda
          </Button>
        </form>
      </div>
    </div>
  );
}
