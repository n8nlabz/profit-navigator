import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  BarChart3,
  LogOut,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { SummaryCard } from '@/components/admin/SummaryCard';
import { CostsTable } from '@/components/admin/CostsTable';
import { SalesTable } from '@/components/admin/SalesTable';
import { AddSaleModal } from '@/components/admin/AddSaleModal';
import { PartnerSplit } from '@/components/admin/PartnerSplit';
import { useFinanceData } from '@/hooks/useFinanceData';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { costs, sales, addCost, removeCost, addSale, removeSale, summary } = useFinanceData();
  const navigate = useNavigate();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-foreground">
              <span className="gradient-text">Dashboard</span> Financeiro
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gerencie custos, vendas e divisão de lucros
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/crm')}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              CRM
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/login');
              }}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
            <Button
              variant="gradient"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Venda
            </Button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Vendas"
            value={formatCurrency(summary.totalSales)}
            subtitle={`${summary.totalCredits} créditos vendidos`}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
          />
          <SummaryCard
            title="Total Custos"
            value={formatCurrency(summary.totalCosts)}
            subtitle={`${costs.length} itens`}
            icon={<TrendingDown className="h-6 w-6" />}
            variant="warning"
          />
          <SummaryCard
            title="Lucro Líquido"
            value={formatCurrency(summary.netProfit)}
            subtitle="Após custos"
            icon={<DollarSign className="h-6 w-6" />}
            variant="default"
          />
          <SummaryCard
            title="Por Sócio"
            value={formatCurrency(summary.profitPerPartner)}
            subtitle="Divisão 50/50"
            icon={<CreditCard className="h-6 w-6" />}
            variant="accent"
          />
        </div>

        {/* Partner Split */}
        <PartnerSplit summary={summary} />

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CostsTable
            costs={costs}
            onAddCost={addCost}
            onRemoveCost={removeCost}
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Vendas Registradas</span>
              </div>
              <Button
                variant="success"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </Button>
            </div>
            <SalesTable
              sales={sales}
              onRemoveSale={removeSale}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-muted-foreground">
          <p>Dashboard Financeiro • Dados salvos localmente</p>
        </footer>
      </div>

      <AddSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSale={addSale}
      />
    </div>
  );
};

export default Index;
