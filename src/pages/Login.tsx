
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Check if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate("/");
            }
        });
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            navigate("/");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao entrar",
                description: error.message || "Verifique suas credenciais.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
            <div className="w-full max-w-md space-y-8 glass rounded-xl p-8 border border-primary/20">
                <div className="text-center">
                    <h1 className="text-3xl font-light text-foreground">
                        <span className="gradient-text">Profit</span> Navigator
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Entre para acessar seu dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-background/50"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        variant="gradient"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
