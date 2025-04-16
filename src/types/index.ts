
export type UserRole = 'standard' | 'it' | 'admin';

export type TicketStatus = 'open' | 'assigned' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo: string | null;
  resolution: string | null;
}
