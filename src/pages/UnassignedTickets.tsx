
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCard } from '@/components/ui/ticket-card';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { TicketPriority, Ticket } from '@/types';
import { Search, Filter } from 'lucide-react';

export default function UnassignedTickets() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUnassignedTickets, assignTicket } = useTickets();
  
  const [unassignedTickets, setUnassignedTickets] = useState<Ticket[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'it') {
      navigate('/');
      return;
    }

    const tickets = getUnassignedTickets();
    setUnassignedTickets(tickets);
  }, [currentUser, navigate, getUnassignedTickets]);

  if (!currentUser) {
    return null;
  }

  const handleAssignTicket = (ticketId: string) => {
    assignTicket(ticketId, currentUser.id);
    // Update the local state
    setUnassignedTickets(prevTickets => 
      prevTickets.filter(ticket => ticket.id !== ticketId)
    );
  };

  const filteredTickets = unassignedTickets.filter(ticket => {
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPriority && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chamados Não Atribuídos</h1>
        <p className="text-gray-600">Selecione chamados para atribuir a você</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pesquisar chamados..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={filterPriority}
              onValueChange={setFilterPriority}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket}
              onAssign={handleAssignTicket}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum chamado não atribuído encontrado.</p>
            {unassignedTickets.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">Tente ajustar os filtros de pesquisa.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
