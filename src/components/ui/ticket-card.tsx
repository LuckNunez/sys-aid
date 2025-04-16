
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { Ticket } from "@/types";
import { formatDate } from "@/lib/utils/formatDate";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, CheckCircle } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  onAssign?: (ticketId: string) => void;
  onResolve?: (ticketId: string) => void;
}

export function TicketCard({ ticket, onAssign, onResolve }: TicketCardProps) {
  const navigate = useNavigate();
  const { users, currentUser } = useAuth();

  const createdByUser = users.find(user => user.id === ticket.createdBy);
  const assignedToUser = ticket.assignedTo ? users.find(user => user.id === ticket.assignedTo) : null;

  return (
    <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-secondary/20">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
          <div className="flex space-x-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Criado por: {createdByUser?.name || 'Usuário desconhecido'}</p>
          <p>Data de criação: {formatDate(ticket.createdAt)}</p>
          {ticket.assignedTo && (
            <p>Atribuído para: {assignedToUser?.name || 'Usuário desconhecido'}</p>
          )}
          {ticket.resolution && (
            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100">
              <p className="font-medium text-sm">Resolução:</p>
              <p className="text-sm">{ticket.resolution}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 py-2">
        <div className="flex justify-end w-full space-x-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/ticket/${ticket.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" /> Ver detalhes
          </Button>
          
          {currentUser?.role === 'it' && ticket.status === 'open' && onAssign && (
            <Button 
              size="sm"
              variant="secondary"
              onClick={() => onAssign(ticket.id)}
            >
              Atribuir para mim
            </Button>
          )}
          
          {currentUser?.role === 'it' && 
           ticket.status === 'assigned' && 
           ticket.assignedTo === currentUser.id && 
           onResolve && (
            <Button 
              size="sm"
              onClick={() => onResolve(ticket.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Resolver
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
