
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { TicketPriority } from '@/types';
import { AlertCircle } from 'lucide-react';

export default function NewTicket() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createTicket } = useTickets();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser || currentUser.role !== 'standard') {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      createTicket({
        title,
        description,
        priority,
        createdBy: currentUser.id,
      });
      
      navigate('/my-tickets');
    } catch (error) {
      setError('Ocorreu um erro ao criar o chamado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Abrir Novo Chamado</h1>
        <p className="text-gray-600">Preencha os detalhes do seu problema</p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes do Chamado</CardTitle>
            <CardDescription>
              Forneça informações detalhadas para que nossa equipe possa ajudar da melhor forma
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Título do Chamado *</Label>
              <Input 
                id="title" 
                placeholder="Ex: Problema com impressora" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Problema *</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva detalhadamente o problema que está enfrentando"
                className="min-h-32" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as TicketPriority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Selecione a prioridade baseada na urgência do problema.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Abrir Chamado'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
}
