
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User, Phone, Mail, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const CRM = () => {
    const { customers, loading, addCustomer } = useCustomers();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
    const navigate = useNavigate();

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addCustomer(newCustomer);
            setIsAddOpen(false);
            setNewCustomer({ name: '', email: '', phone: '' });
        } catch (error) {
            console.error('Failed to add customer', error);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(val);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/')}
                        className="hover:bg-primary/10"
                    >
                        <ArrowLeft className="h-6 w-6 text-primary" />
                    </Button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-light text-foreground">
                            <span className="gradient-text">CRM</span> Clientes
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Gerencie seus clientes e histórico de vendas
                        </p>
                    </div>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button variant="gradient" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCustomer} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome</Label>
                                <Input
                                    required
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Telefone</Label>
                                <Input
                                    value={newCustomer.phone}
                                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full">Salvar</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar clientes..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-10">Carregando...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">{customer.name}</h3>
                                        <p className="text-xs text-muted-foreground">Cliente desde {customer.createdAt.toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {customer.email && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        {customer.email}
                                    </div>
                                )}
                                {customer.phone && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        {customer.phone}
                                    </div>
                                )}

                                <div className="pt-4 mt-4 border-t border-border/50 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">{customer.totalPurchases} Compra(s)</span>
                                    </div>
                                    <span className="text-success font-bold">
                                        {formatCurrency(customer.totalSpent)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CRM;
