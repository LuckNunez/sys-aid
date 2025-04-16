
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ClipboardList, 
  FilePlus2, 
  Users, 
  LogOut, 
  Settings, 
  CheckCircle2
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'standard':
        return [
          { icon: Home, label: 'Início', path: '/' },
          { icon: FilePlus2, label: 'Abrir Chamado', path: '/new-ticket' },
          { icon: ClipboardList, label: 'Meus Chamados', path: '/my-tickets' },
        ];
      case 'it':
        return [
          { icon: Home, label: 'Início', path: '/' },
          { icon: ClipboardList, label: 'Chamados Não Atribuídos', path: '/unassigned-tickets' },
          { icon: CheckCircle2, label: 'Meus Chamados', path: '/assigned-tickets' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Início', path: '/' },
          { icon: ClipboardList, label: 'Todos Chamados', path: '/all-tickets' },
          { icon: Users, label: 'Gerenciar Usuários', path: '/manage-users' },
          { icon: Settings, label: 'Configurações', path: '/settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">
            SysAid Manager
          </h1>
        </div>
        <div className="py-4">
          <nav>
            <ul>
              {navItems.map((item, index) => (
                <li key={index}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-6 py-3 text-left"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                </li>
              ))}
              <li className="mt-8">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-6 py-3 text-left text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Sair</span>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentUser && (
                <span>Olá, {currentUser.name} ({currentUser.role === 'standard' ? 'Usuário' : currentUser.role === 'it' ? 'Técnico de TI' : 'Administrador'})</span>
              )}
            </h2>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
