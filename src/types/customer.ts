export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt: Date;
}

export interface CustomerWithStats extends Customer {
    totalPurchases: number;
    totalSpent: number;
    lastPurchaseDate?: Date;
}
