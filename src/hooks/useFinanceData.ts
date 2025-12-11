import { useState, useEffect, useCallback } from 'react';
import { Cost, Sale, FinancialSummary } from '@/types/finance';

const COSTS_KEY = 'finance_costs';
const SALES_KEY = 'finance_sales';

export function useFinanceData() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCosts = localStorage.getItem(COSTS_KEY);
    const savedSales = localStorage.getItem(SALES_KEY);

    if (savedCosts) {
      setCosts(JSON.parse(savedCosts));
    }
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  // Save costs to localStorage
  const saveCosts = useCallback((newCosts: Cost[]) => {
    localStorage.setItem(COSTS_KEY, JSON.stringify(newCosts));
    setCosts(newCosts);
  }, []);

  // Save sales to localStorage
  const saveSales = useCallback((newSales: Sale[]) => {
    localStorage.setItem(SALES_KEY, JSON.stringify(newSales));
    setSales(newSales);
  }, []);

  // Add a new cost
  const addCost = useCallback((name: string, value: number) => {
    const newCost: Cost = {
      id: crypto.randomUUID(),
      name,
      value,
      createdAt: new Date(),
    };
    saveCosts([...costs, newCost]);
  }, [costs, saveCosts]);

  // Remove a cost
  const removeCost = useCallback((id: string) => {
    saveCosts(costs.filter(c => c.id !== id));
  }, [costs, saveCosts]);

  // Add a new sale
  const addSale = useCallback((source: string, value: number, credits: number, customerName: string) => {
    const newSale: Sale = {
      id: crypto.randomUUID(),
      source,
      value,
      credits,
      customerName,
      createdAt: new Date(),
    };
    saveSales([...sales, newSale]);
  }, [sales, saveSales]);

  // Remove a sale
  const removeSale = useCallback((id: string) => {
    saveSales(sales.filter(s => s.id !== id));
  }, [sales, saveSales]);

  // Calculate financial summary
  const calculateSummary = useCallback((): FinancialSummary => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.value, 0);
    const totalCosts = costs.reduce((sum, cost) => sum + cost.value, 0);
    const totalCredits = sales.reduce((sum, sale) => sum + sale.credits, 0);

    // Calculate proportional costs based on sales
    // If we have sales, calculate what portion of costs applies
    const proportionalCosts = totalSales > 0 ? Math.min(totalCosts, totalSales) : 0;
    
    const netProfit = totalSales - proportionalCosts;
    const profitPerPartner = netProfit / 2;
    const costPerPartner = proportionalCosts / 2;

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
    addCost,
    removeCost,
    addSale,
    removeSale,
    summary: calculateSummary(),
  };
}
