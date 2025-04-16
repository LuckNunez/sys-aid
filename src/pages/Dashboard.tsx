
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus2, ClipboardList, Users, Clock, ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { tickets, getUserTickets, getUnassignedTickets, getAssignedTickets } = useTickets();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  // Get relevant statistics based on user role
  const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
  const assignedTickets = tickets.filter(ticket => ticket.status === 'assigned').length;
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved').length;
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
  
  const userTickets = getUserTickets(currentUser.id).length;
  const unassignedTicketsCount = getUnassignedTickets().length;
  const assignedToMeCount = currentUser.role === 'it' ? getAssignedTickets(currentUser.id).length : 0;

  const renderStandardUserDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FilePlus2 className="mr-2 h-5 w-5 text-primary" />
              Meus Chamados
            </CardTitle>
            <CardDescription>Total de chamados abertos por você</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userTickets}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex justify-start items-center" 
              variant="outline"
              onClick={() => navigate('/new-ticket')}
            >
              <FilePlus2 className="mr-2 h-5 w-5" />
              Abrir Novo Chamado
            </Button>
            <Button 
              className="w-full flex justify-start items-center" 
              variant="outline"
              onClick={() => navigate('/my-tickets')}
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              Ver Meus Chamados
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Chamados</CardTitle>
            <CardDescription>Status dos seus chamados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-blue-600">
                <Clock className="mr-2 h-4 w-4" /> Abertos
              </span>
              <span className="font-medium">
                {getUserTickets(currentUser.id).filter(t => t.status === 'open').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-yellow-600">
                <Clock className="mr-2 h-4 w-4" /> Em andamento
              </span>
              <span className="font-medium">
                {getUserTickets(currentUser.id).filter(t => t.status === 'assigned').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-green-600">
                <ClipboardCheck className="mr-2 h-4 w-4" /> Resolvidos
              </span>
              <span className="font-medium">
                {getUserTickets(currentUser.id).filter(t => t.status === 'resolved').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-gray-600">
                <ClipboardCheck className="mr-2 h-4 w-4" /> Fechados
              </span>
              <span className="font-medium">
                {getUserTickets(currentUser.id).filter(t => t.status === 'closed').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderITUserDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FilePlus2 className="mr-2 h-5 w-5 text-blue-500" />
              Não Atribuídos
            </CardTitle>
            <CardDescription>Chamados aguardando atendimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{unassignedTicketsCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              Meus Chamados
            </CardTitle>
            <CardDescription>Chamados atribuídos a você</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assignedToMeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5 text-green-500" />
              Resolvidos
            </CardTitle>
            <CardDescription>Chamados resolvidos por você</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {tickets.filter(t => t.assignedTo === currentUser.id && t.status === 'resolved').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex justify-start items-center" 
              variant="outline"
              onClick={() => navigate('/unassigned-tickets')}
            >
              <FilePlus2 className="mr-2 h-5 w-5" />
              Ver Chamados Não Atribuídos
            </Button>
            <Button 
              className="w-full flex justify-start items-center" 
              variant="outline"
              onClick={() => navigate('/assigned-tickets')}
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              Ver Meus Chamados
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Visão geral dos chamados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-blue-600">
                <Clock className="mr-2 h-4 w-4" /> Abertos
              </span>
              <span className="font-medium">{openTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-yellow-600">
                <Clock className="mr-2 h-4 w-4" /> Em andamento
              </span>
              <span className="font-medium">{assignedTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-green-600">
                <ClipboardCheck className="mr-2 h-4 w-4" /> Resolvidos
              </span>
              <span className="font-medium">{resolvedTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-gray-600">
                <ClipboardCheck className="mr-2 h-4 w-4" /> Fechados
              </span>
              <span className="font-medium">{closedTickets}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FilePlus2 className="mr-2 h-5 w-5 text-blue-500" />
              Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{openTickets}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assignedTickets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5 text-green-500" />
              Resolvidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resolvedTickets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-violet-500" />
              Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tickets.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex justify-start items-center" 
              variant="outline"
              onClick={() => navigate('/all-tickets')}
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              Ver Todos os Chamados
            </Button>
            <Button 
              className="w-full flex justify-start items-center" 
              variant="outline"
              onClick={() => navigate('/manage-users')}
            >
              <Users className="mr-2 h-5 w-5" />
              Gerenciar Usuários
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas por Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-red-600">
                Crítica
              </span>
              <span className="font-medium">
                {tickets.filter(t => t.priority === 'critical').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-amber-600">
                Alta
              </span>
              <span className="font-medium">
                {tickets.filter(t => t.priority === 'high').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-blue-600">
                Média
              </span>
              <span className="font-medium">
                {tickets.filter(t => t.priority === 'medium').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm text-green-600">
                Baixa
              </span>
              <span className="font-medium">
                {tickets.filter(t => t.priority === 'low').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-gray-600">Bem-vindo ao Sistema de Gerenciamento de Chamados</p>
      </div>
      
      {currentUser.role === 'standard' && renderStandardUserDashboard()}
      {currentUser.role === 'it' && renderITUserDashboard()}
      {currentUser.role === 'admin' && renderAdminDashboard()}
    </DashboardLayout>
  );
}
