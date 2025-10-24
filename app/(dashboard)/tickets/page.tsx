'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket } from '@/lib/mock-data/tickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    open: true,
    assigned: true,
    resolved: true,
    closed: false,
  });

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch('/api/tickets');
        const data = await response.json();
        setTickets(data.data);
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const groupedTickets = useMemo(() => {
    const groups = {
      open: [] as Ticket[],
      assigned: [] as Ticket[],
      resolved: [] as Ticket[],
      closed: [] as Ticket[],
    };

    tickets.forEach((ticket) => {
      groups[ticket.status].push(ticket);
    });

    // Sort by date (most recent first)
    Object.keys(groups).forEach((key) => {
      groups[key as keyof typeof groups].sort(
        (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
      );
    });

    return groups;
  }, [tickets]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: 'Abertos',
      assigned: 'Atribuídos',
      resolved: 'Resolvidos',
      closed: 'Fechados',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      assigned: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      open: AlertCircle,
      assigned: Clock,
      resolved: CheckCircle,
      closed: XCircle,
    };
    const Icon = icons[status as keyof typeof icons] || AlertCircle;
    return <Icon className="w-5 h-5" />;
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: 'bg-gray-100 text-gray-700',
      media: 'bg-yellow-100 text-yellow-700',
      alta: 'bg-orange-100 text-orange-700',
      urgente: 'bg-red-100 text-red-700',
    };
    return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPrioridadeLabel = (prioridade: string) => {
    const labels = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta',
      urgente: 'Urgente',
    };
    return labels[prioridade as keyof typeof labels] || prioridade;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando tickets...</div>
      </div>
    );
  }

  const renderTicketGroup = (status: keyof typeof groupedTickets, tickets: Ticket[]) => {
    const isExpanded = expandedSections[status];

    return (
      <Card key={status}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(status)}
              <CardTitle>
                {getStatusLabel(status)} ({tickets.length})
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(status)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            {tickets.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum ticket {getStatusLabel(status).toLowerCase()}
              </p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {ticket.titulo}
                          </h3>
                          <Badge className={getPrioridadeColor(ticket.prioridade)}>
                            {getPrioridadeLabel(ticket.prioridade)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span>Cliente: {ticket.clienteNome}</span>
                          {ticket.ownerNome && (
                            <span>Responsável: {ticket.ownerNome}</span>
                          )}
                          {ticket.pedidoNumero && (
                            <span>Pedido: {ticket.pedidoNumero}</span>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Criado em {new Date(ticket.dataCriacao).toLocaleDateString('pt-BR')} por{' '}
                          {ticket.criadorNome}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
          <p className="text-gray-500 mt-2">
            Gerencie todos os tickets de suporte
          </p>
        </div>
        <Button onClick={() => router.push('/tickets/novo')}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abertos</p>
                <p className="text-2xl font-bold">{groupedTickets.open.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Atribuídos</p>
                <p className="text-2xl font-bold">{groupedTickets.assigned.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resolvidos</p>
                <p className="text-2xl font-bold">{groupedTickets.resolved.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fechados</p>
                <p className="text-2xl font-bold">{groupedTickets.closed.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {renderTicketGroup('open', groupedTickets.open)}
        {renderTicketGroup('assigned', groupedTickets.assigned)}
        {renderTicketGroup('resolved', groupedTickets.resolved)}
        {renderTicketGroup('closed', groupedTickets.closed)}
      </div>
    </div>
  );
}
