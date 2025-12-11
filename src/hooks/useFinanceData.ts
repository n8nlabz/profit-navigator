
import { useState, useEffect, useCallback } from 'react';
import { Cost, Sale, FinancialSummary } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

export function useFinanceData() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCosts = async () => {
    try {
      const { data, error } = await supabase
        .from('costs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching costs:', error);
        return;
      }

      const mappedCosts: Cost[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        value: Number(item.value),
        createdAt: new Date(item.created_at),
      }));

      setCosts(mappedCosts);
    } catch (error) {
      console.error('Error in fetchCosts:', error);
    }
  };

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales:', error);
        return;
      }

      const mappedSales: Sale[] = (data || []).map(item => ({
        id: item.id,
        source: item.source,
        value: Number(item.value),
        credits: item.credits,
        customerName: item.customer_name,
        createdAt: new Date(item.created_at),
      }));

      setSales(mappedSales);
    } catch (error) {
      console.error('Error in fetchSales:', error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCosts(), fetchSales()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add a new cost
  const addCost = useCallback(async (name: string, value: number) => {
    try {
      const { error } = await supabase
        .from('costs')
        .insert([{ name, value }]);

      if (error) {
        console.error('Error adding cost:', error);
        return;
      }

      // Refresh list
      fetchCosts();
    } catch (error) {
      console.error('Error in addCost:', error);
    }
  }, []);

  // Remove a cost
  const removeCost = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('costs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing cost:', error);
        return;
      }

      setCosts(current => current.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error in removeCost:', error);
    }
  }, []);

  // Add a new sale
  const addSale = useCallback(async (source: string, value: number, credits: number, customerName: string, customerId?: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .insert([{
          source,
          value,
          credits,
          customer_name: customerName,
          customer_id: customerId
        }]);

      if (error) {
        console.error('Error adding sale:', error);
        return;
      }

      // Refresh list
      fetchSales();
    } catch (error) {
      console.error('Error in addSale:', error);
    }
  }, []);

  // Remove a sale
  const removeSale = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing sale:', error);
        return;
      }

      setSales(current => current.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error in removeSale:', error);
    }
  }, []);

  // Calculate financial summary
  const calculateSummary = useCallback((): FinancialSummary => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.value, 0);
    const totalCosts = costs.reduce((sum, cost) => sum + cost.value, 0);
    const totalCredits = sales.reduce((sum, sale) => sum + sale.credits, 0);

    // Logic Update: All costs and profits are split 50/50
    // Net profit is simply Sales - Total Costs
    const netProfit = totalSales - totalCosts;
    const profitPerPartner = netProfit / 2;
    const costPerPartner = totalCosts / 2;

    return {
      totalSales,
      totalCosts,
      netProfit,
      profitPerPartner,
      costPerPartner,
      totalCredits,
    };
  }, [costs, sales]);

  return {
    costs,
    sales,
    loading,
    addCost,
    removeCost,
    addSale,
    removeSale,
    summary: calculateSummary(),
  };
}
