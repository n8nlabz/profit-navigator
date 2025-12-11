
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Customer, CustomerWithStats } from '@/types/customer';

export function useCustomers() {
    const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch customers
            const { data: customersData, error: customersError } = await supabase
                .from('customers')
                .select('*')
                .order('name');

            if (customersError) throw customersError;

            // Fetch sales to calculate stats
            // Note: In a larger app, we'd use a view or RPC for this aggregation
            const { data: salesData, error: salesError } = await supabase
                .from('sales')
                .select('customer_id, value, created_at');

            if (salesError) throw salesError;

            const statsMap = new Map<string, { count: number; spent: number; lastDate: Date | null }>();

            salesData?.forEach(sale => {
                if (!sale.customer_id) return;

                const current = statsMap.get(sale.customer_id) || { count: 0, spent: 0, lastDate: null };
                const saleDate = new Date(sale.created_at);

                statsMap.set(sale.customer_id, {
                    count: current.count + 1,
                    spent: current.spent + Number(sale.value),
                    lastDate: current.lastDate && current.lastDate > saleDate ? current.lastDate : saleDate
                });
            });

            const mappedCustomers: CustomerWithStats[] = (customersData || []).map(c => {
                const stats = statsMap.get(c.id) || { count: 0, spent: 0, lastDate: null };
                return {
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    createdAt: new Date(c.created_at),
                    totalPurchases: stats.count,
                    totalSpent: stats.spent,
                    lastPurchaseDate: stats.lastDate || undefined
                };
            });

            setCustomers(mappedCustomers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const addCustomer = async (data: { name: string; email?: string; phone?: string }) => {
        const { error } = await supabase.from('customers').insert([data]);
        if (error) throw error;
        fetchCustomers();
    };

    return {
        customers,
        loading,
        addCustomer,
        refresh: fetchCustomers
    };
}
