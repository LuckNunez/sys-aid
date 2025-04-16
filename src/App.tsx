import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { TicketProvider } from "@/context/TicketContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewTicket from "./pages/NewTicket";
import MyTickets from "./pages/MyTickets";
import UnassignedTickets from "./pages/UnassignedTickets";
import AssignedTickets from "./pages/AssignedTickets";
import AllTickets from "./pages/AllTickets";
import ManageUsers from "./pages/ManageUsers";
import TicketDetail from "./pages/TicketDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TicketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Main Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Standard User Routes */}
              <Route path="/new-ticket" element={<NewTicket />} />
              <Route path="/my-tickets" element={<MyTickets />} />

              {/* IT User Routes */}
              <Route path="/unassigned-tickets" element={<UnassignedTickets />} />
              <Route path="/assigned-tickets" element={<AssignedTickets />} />

              {/* Admin Routes */}
              <Route path="/all-tickets" element={<AllTickets />} />
              <Route path="/manage-users" element={<ManageUsers />} />

              {/* Common Routes */}
              <Route path="/ticket/:id" element={<TicketDetail />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TicketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
