
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import { useAuth } from './AuthContext';

// Sample tickets for demonstration
const SAMPLE_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'Problema com impressora',
    description: 'A impressora do setor financeiro não está funcionando corretamente.',
    status: 'open',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: '1',
    assignedTo: null,
    resolution: null
  },
  {
    id: '2',
    title: 'Acesso ao sistema bloqueado',
    description: 'Não consigo acessar o sistema de gestão financeira após a atualização.',
    status: 'assigned',
    priority: 'high',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: '1',
    assignedTo: '2',
    resolution: null
  },
  {
    id: '3',
    title: 'Instalação de software',
    description: 'Preciso que seja instalado o pacote Office no meu computador.',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    createdBy: '1',
    assignedTo: '2',
    resolution: 'Software instalado e configurado conforme solicitado.'
  }
];

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedTo' | 'resolution'>) => void;
  assignTicket: (ticketId: string, userId: string) => void;
  resolveTicket: (ticketId: string, resolution: string) => void;
  closeTicket: (ticketId: string) => void;
  updateTicket: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;
  getUserTickets: (userId: string) => Ticket[];
  getTicketById: (id: string) => Ticket | undefined;
  getUnassignedTickets: () => Ticket[];
  getAssignedTickets: (userId: string) => Ticket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { currentUser } = useAuth();

  // Initialize tickets from localStorage or use sample data
  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets');
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      setTickets(SAMPLE_TICKETS);
      localStorage.setItem('tickets', JSON.stringify(SAMPLE_TICKETS));
    }
  }, []);

  // Save tickets to localStorage when they change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedTo' | 'resolution'>) => {
    if (!currentUser) return;
    
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      status: 'open',
      assignedTo: null,
      resolution: null
    };

    setTickets(prev => [...prev, newTicket]);
  };

  const assignTicket = (ticketId: string, userId: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              assignedTo: userId, 
              status: 'assigned', 
              updatedAt: new Date().toISOString() 
            } 
          : ticket
      )
    );
  };

  const resolveTicket = (ticketId: string, resolution: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              resolution, 
              status: 'resolved', 
              updatedAt: new Date().toISOString() 
            } 
          : ticket
      )
    );
  };

  const closeTicket = (ticketId: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status: 'closed', 
              updatedAt: new Date().toISOString() 
            } 
          : ticket
      )
    );
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === updatedTicket.id 
          ? { 
              ...updatedTicket, 
              updatedAt: new Date().toISOString() 
            } 
          : ticket
      )
    );
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const getUserTickets = (userId: string) => {
    return tickets.filter(ticket => ticket.createdBy === userId);
  };

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const getUnassignedTickets = () => {
    return tickets.filter(ticket => ticket.status === 'open');
  };

  const getAssignedTickets = (userId: string) => {
    return tickets.filter(ticket => ticket.assignedTo === userId);
  };

  return (
    <TicketContext.Provider 
      value={{ 
        tickets,
        createTicket,
        assignTicket,
        resolveTicket,
        closeTicket,
        updateTicket,
        deleteTicket,
        getUserTickets,
        getTicketById,
        getUnassignedTickets,
        getAssignedTickets
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
