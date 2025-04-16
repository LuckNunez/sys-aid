
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { User, UserRole } from '@/types';
import { Search, Pencil, Trash2, UserPlus, AlertCircle } from 'lucide-react';

export default function ManageUsers() {
  const navigate = useNavigate();
  const { currentUser, users, updateUser, addUser, deleteUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('standard');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('standard');
    setError('');
    setSelectedUser(null);
  };

  const handleOpenAddUserDialog = () => {
    resetForm();
    setIsAddUserDialogOpen(true);
  };

  const handleOpenEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setError('');
    setIsEditUserDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleAddUser = () => {
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Check if email is already in use
    if (users.some(user => user.email === email)) {
      setError('Este e-mail já está em uso. Tente outro.');
      return;
    }

    addUser({
      name,
      email,
      password,
      role
    });

    setIsAddUserDialogOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    if (!name || !email) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Check if email is already in use by another user
    if (users.some(user => user.email === email && user.id !== selectedUser.id)) {
      setError('Este e-mail já está em uso. Tente outro.');
      return;
    }

    updateUser({
      ...selectedUser,
      name,
      email,
      password: password || selectedUser.password,
      role
    });

    setIsEditUserDialogOpen(false);
    resetForm();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    deleteUser(selectedUser.id);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Administrador</Badge>;
      case 'it':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Técnico de TI</Badge>;
      case 'standard':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Usuário Padrão</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'it':
        return 'Técnico de TI';
      case 'standard':
        return 'Usuário Padrão';
      default:
        return role;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Adicione, edite ou remova usuários do sistema</p>
        </div>
        <Button onClick={handleOpenAddUserDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar usuários..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEditUserDialog(user)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleOpenDeleteDialog(user)}
                          disabled={user.id === currentUser.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input 
                id="name" 
                placeholder="Nome do usuário" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@exemplo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Usuário Padrão</SelectItem>
                  <SelectItem value="it">Técnico de TI</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddUser}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo *</Label>
              <Input 
                id="edit-name" 
                placeholder="Nome do usuário" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail *</Label>
              <Input 
                id="edit-email" 
                type="email" 
                placeholder="email@exemplo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-password">Senha (deixe em branco para manter a atual)</Label>
              <Input 
                id="edit-password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role">Função</Label>
              <Select 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Usuário Padrão</SelectItem>
                  <SelectItem value="it">Técnico de TI</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditUser}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="space-y-1">
                <p><strong>Nome:</strong> {selectedUser.name}</p>
                <p><strong>E-mail:</strong> {selectedUser.email}</p>
                <p><strong>Função:</strong> {getRoleText(selectedUser.role)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
