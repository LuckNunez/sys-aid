
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCard } from '@/components/ui/ticket-card';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { Ticket, TicketStatus } from '@/types';
import { FilePlus2, Search, Filter } from 'lucide-react';

export default function MyTickets() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUserTickets } = useTickets();
  
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'standard') {
      navigate('/');
      return;
    }

    const tickets = getUserTickets(currentUser.id);
    setUserTickets(tickets);
  }, [currentUser, navigate, getUserTickets]);

  if (!currentUser) {
    return null;
  }

  const filteredTickets = userTickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meus Chamados</h1>
          <p className="text-gray-600">Visualize e acompanhe o status dos seus chamados</p>
        </div>
        <Button onClick={() => navigate('/new-ticket')}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Novo Chamado
        </Button>
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
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="open">Abertos</SelectItem>
                <SelectItem value="assigned">Em andamento</SelectItem>
                <SelectItem value="resolved">Resolvidos</SelectItem>
                <SelectItem value="closed">Fechados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum chamado encontrado.</p>
            {userTickets.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">Tente ajustar os filtros de pesquisa.</p>
            )}
            {userTickets.length === 0 && (
              <div className="mt-4">
                <Button onClick={() => navigate('/new-ticket')} variant="outline">
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Criar seu primeiro chamado
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
