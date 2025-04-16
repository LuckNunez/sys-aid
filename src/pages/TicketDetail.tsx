
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { Ticket } from '@/types';
import { formatDate } from '@/lib/utils/formatDate';
import { ArrowLeft, ClipboardCheck, User, Calendar, CheckCircle } from 'lucide-react';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, users } = useAuth();
  const { 
    getTicketById, 
    assignTicket, 
    resolveTicket, 
    closeTicket, 
    updateTicket 
  } = useTickets();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!id) {
      navigate(-1);
      return;
    }

    const fetchedTicket = getTicketById(id);
    if (!fetchedTicket) {
      navigate(-1);
      return;
    }

    setTicket(fetchedTicket);
  }, [id, currentUser, navigate, getTicketById]);

  if (!currentUser || !ticket) {
    return null;
  }

  const createdByUser = users.find(user => user.id === ticket.createdBy);
  const assignedToUser = ticket.assignedTo ? users.find(user => user.id === ticket.assignedTo) : null;

  const handleAssignToMe = () => {
    if (!ticket) return;
    assignTicket(ticket.id, currentUser.id);
    setTicket(prev => prev ? { ...prev, assignedTo: currentUser.id, status: 'assigned' } : null);
  };

  const handleOpenResolveDialog = () => {
    setResolution('');
    setIsResolveDialogOpen(true);
  };

  const handleResolveTicket = () => {
    if (!ticket || !resolution.trim()) return;
    
    resolveTicket(ticket.id, resolution);
    setTicket(prev => prev ? { 
      ...prev, 
      status: 'resolved', 
      resolution,
      updatedAt: new Date().toISOString()
    } : null);
    
    setIsResolveDialogOpen(false);
  };

  const handleCloseTicket = () => {
    if (!ticket) return;
    
    closeTicket(ticket.id);
    setTicket(prev => prev ? { 
      ...prev, 
      status: 'closed',
      updatedAt: new Date().toISOString()
    } : null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Detalhes do Chamado</h1>
          <p className="text-gray-600">Visualize informações detalhadas do chamado</p>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge status={ticket.status} className="px-3 py-1 text-sm" />
        <PriorityBadge priority={ticket.priority} className="px-3 py-1 text-sm" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{ticket.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> 
            Criado em: {formatDate(ticket.createdAt)}
            {ticket.updatedAt !== ticket.createdAt && (
              <span className="ml-4">
                Atualizado em: {formatDate(ticket.updatedAt)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Descrição do Problema:</h3>
            <p className="text-gray-600 whitespace-pre-line">{ticket.description}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <div className="space-y-2 flex-1">
              <h3 className="font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2" /> Aberto por:
              </h3>
              <p className="text-gray-600">{createdByUser?.name || 'Usuário desconhecido'}</p>
              <p className="text-sm text-gray-500">{createdByUser?.email}</p>
            </div>

            {ticket.assignedTo && (
              <div className="space-y-2 flex-1">
                <h3 className="font-medium text-gray-700 flex items-center">
                  <ClipboardCheck className="h-4 w-4 mr-2" /> Atribuído para:
                </h3>
                <p className="text-gray-600">{assignedToUser?.name || 'Usuário desconhecido'}</p>
                <p className="text-sm text-gray-500">{assignedToUser?.email}</p>
              </div>
            )}
          </div>

          {ticket.resolution && (
            <div className="mt-8 p-4 bg-green-50 rounded-md border border-green-100">
              <h3 className="font-medium text-gray-700 flex items-center mb-2">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Resolução:
              </h3>
              <p className="text-gray-600 whitespace-pre-line">{ticket.resolution}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
          <div className="flex items-center text-sm text-gray-500">
            ID: {ticket.id}
          </div>
          <div className="flex gap-2">
            {currentUser.role === 'it' && ticket.status === 'open' && (
              <Button onClick={handleAssignToMe}>
                Atribuir para mim
              </Button>
            )}
            
            {currentUser.role === 'it' && ticket.status === 'assigned' && ticket.assignedTo === currentUser.id && (
              <Button onClick={handleOpenResolveDialog}>
                <CheckCircle className="h-4 w-4 mr-1" /> Resolver
              </Button>
            )}
            
            {currentUser.role === 'standard' && ticket.status === 'resolved' && ticket.createdBy === currentUser.id && (
              <Button onClick={handleCloseTicket}>
                Fechar Chamado
              </Button>
            )}
            
            {currentUser.role === 'admin' && ticket.status !== 'closed' && (
              <Button onClick={handleCloseTicket} variant="outline">
                Fechar Chamado
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Alerts based on status */}
      {ticket.status === 'open' && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            Este chamado está aguardando atribuição a um técnico.
          </AlertDescription>
        </Alert>
      )}
      
      {ticket.status === 'assigned' && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription>
            Este chamado está sendo trabalhado por {assignedToUser?.name || 'um técnico'}.
          </AlertDescription>
        </Alert>
      )}
      
      {ticket.status === 'resolved' && ticket.createdBy === currentUser.id && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription>
            Este chamado foi resolvido. Se o problema foi solucionado, você pode fechá-lo.
          </AlertDescription>
        </Alert>
      )}

      {/* Resolve Ticket Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolver Chamado</DialogTitle>
            <DialogDescription>
              Descreva a solução aplicada para resolver este chamado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Descrição da Resolução</Label>
              <Textarea
                id="resolution"
                placeholder="Descreva como o problema foi resolvido..."
                rows={5}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleResolveTicket} disabled={!resolution.trim()}>
              Resolver Chamado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
