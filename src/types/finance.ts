export interface Cost {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
}

export interface Sale {
  id: string;
  source: string;
  value: number;
  credits: number;
  customerName: string;
  createdAt: Date;
}

export interface FinancialSummary {
  totalSales: number;
  totalCosts: number;
  netProfit: number;
  profitPerPartner: number;
  costPerPartner: number;
  totalCredits: number;
}
