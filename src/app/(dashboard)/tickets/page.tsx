'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTickets } from '@/hooks/ticket/useGetTickets';
import { Ticket } from '@/lib/mock-data/tickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle, XCircle, Plus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState, PageHeader, EmptyState } from '@/components/common';
import { formatDate } from '@/lib/date-utils';
import { getTicketPriorityColor, getTicketPriorityLabel } from '@/lib/format-utils';

export default function TicketsPage() {
  const router = useRouter();
  const { data: tickets = [], isLoading } = useGetTickets();
  const [expandedSections, setExpandedSections] = useState({
    open: true,
    assigned: true,
    resolved: true,
    closed: false,
  });

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


  if (isLoading) {
    return <LoadingState message="Carregando tickets..." />;
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
            <Button variant="ghost" size="sm" onClick={() => toggleSection(status)}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            {tickets.length === 0 ? (
              <EmptyState title={`Nenhum ticket ${getStatusLabel(status).toLowerCase()}`} />
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
                          <h3 className="font-semibold text-gray-900 truncate">{ticket.titulo}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTicketPriorityColor(ticket.prioridade)}`}>{getTicketPriorityLabel(ticket.prioridade)}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span>Cliente: {ticket.clienteNome}</span>
                          {ticket.owners?.length > 0 && <span>Responsável: {ticket.owners[0].nome}</span>}
                          {ticket.pedidoNumero && <span>Pedido: {ticket.pedidoNumero}</span>}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Criado em {formatDate(ticket.dataCriacao)} por {ticket.criador?.nome}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>{getStatusLabel(ticket.status)}</span>
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
      <PageHeader
        title="Tickets"
        description="Gerencie todos os tickets de suporte"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/tickets/dashboard')}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => router.push('/tickets/novo')}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Ticket
            </Button>
          </div>
        }
      />

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
