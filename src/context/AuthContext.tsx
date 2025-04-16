
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

// Sample users for demonstration
const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'Usuário Padrão',
    email: 'user@example.com',
    password: 'password',
    role: 'standard'
  },
  {
    id: '2',
    name: 'Usuário TI',
    email: 'it@example.com',
    password: 'password',
    role: 'it'
  },
  {
    id: '3',
    name: 'Administrador',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin'
  }
];

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => boolean;
  updateUser: (user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize users from localStorage or use sample data
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(SAMPLE_USERS);
      localStorage.setItem('users', JSON.stringify(SAMPLE_USERS));
    }

    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (userData: Omit<User, 'id'>) => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    
    // Update current user if it's the one being updated
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };

    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        users, 
        login, 
        logout, 
        register,
        updateUser,
        addUser,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
