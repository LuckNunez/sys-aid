
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TicketCard } from '@/components/ui/ticket-card';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { Ticket } from '@/types';
import { Search } from 'lucide-react';

export default function AssignedTickets() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getAssignedTickets, resolveTicket } = useTickets();
  
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'it') {
      navigate('/');
      return;
    }

    const tickets = getAssignedTickets(currentUser.id);
    setAssignedTickets(tickets);
  }, [currentUser, navigate, getAssignedTickets]);

  if (!currentUser) {
    return null;
  }

  const handleOpenResolveDialog = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setResolution('');
    setIsResolveDialogOpen(true);
  };

  const handleResolveTicket = () => {
    if (!selectedTicketId || !resolution.trim()) return;
    
    resolveTicket(selectedTicketId, resolution);
    
    // Update the local state
    setAssignedTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === selectedTicketId
          ? { ...ticket, status: 'resolved', resolution }
          : ticket
      )
    );
    
    setIsResolveDialogOpen(false);
    setSelectedTicketId(null);
    setResolution('');
  };

  const filteredTickets = assignedTickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meus Chamados Atribuídos</h1>
        <p className="text-gray-600">Gerencie e resolva os chamados atribuídos a você</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Pesquisar chamados..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket}
              onResolve={() => handleOpenResolveDialog(ticket.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum chamado atribuído encontrado.</p>
            {assignedTickets.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">Tente ajustar os filtros de pesquisa.</p>
            )}
            {assignedTickets.length === 0 && (
              <div className="mt-4">
                <Button onClick={() => navigate('/unassigned-tickets')} variant="outline">
                  Ver chamados não atribuídos
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

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
