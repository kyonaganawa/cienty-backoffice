'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetTicketById } from '@/hooks/ticket/useGetTicketById';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, AlertCircle, Package, Building2, FileText, Clock } from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: ticket, isLoading, error } = useGetTicketById(params.id as string);

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      assigned: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: 'Aberto',
      assigned: 'Atribuído',
      resolved: 'Resolvido',
      closed: 'Fechado',
    };
    return labels[status as keyof typeof labels] || status;
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
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/tickets')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error?.message || 'Ticket não encontrado'}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/tickets')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">{ticket.titulo}</h2>
          <Badge className={getPrioridadeColor(ticket.prioridade)}>
            {getPrioridadeLabel(ticket.prioridade)}
          </Badge>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
            {getStatusLabel(ticket.status)}
          </span>
        </div>
        <p className="text-gray-500">Detalhes do ticket</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Data de Criação</p>
                <p className="font-medium">
                  {new Date(ticket.dataCriacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Última Atualização</p>
                <p className="font-medium">
                  {new Date(ticket.dataAtualizacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Criado por</p>
                <p className="font-medium">{ticket.criadorNome}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Prioridade</p>
                <Badge className={getPrioridadeColor(ticket.prioridade)}>
                  {getPrioridadeLabel(ticket.prioridade)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Relacionadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Cliente</p>
                <p
                  className="font-medium text-blue-600 cursor-pointer hover:underline"
                  onClick={() => router.push(`/clientes/${ticket.clienteId}`)}
                >
                  {ticket.clienteNome}
                </p>
              </div>
            </div>
            {ticket.ownerNome && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Responsável</p>
                  <p className="font-medium">{ticket.ownerNome}</p>
                </div>
              </div>
            )}
            {ticket.distribuidoraNome && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Distribuidora</p>
                  <p
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/distribuidoras/${ticket.distribuidoraId}`)}
                  >
                    {ticket.distribuidoraNome}
                  </p>
                </div>
              </div>
            )}
            {ticket.pedidoNumero && (
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Pedido</p>
                  <p
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/pedidos/${ticket.pedidoId}`)}
                  >
                    {ticket.pedidoNumero}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <CardTitle>Descrição</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {ticket.descricao}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Status</p>
              <p className="text-lg font-bold text-blue-900 mt-1">
                {getStatusLabel(ticket.status)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Prioridade</p>
              <p className="text-lg font-bold text-purple-900 mt-1">
                {getPrioridadeLabel(ticket.prioridade)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Cliente</p>
              <p className="text-lg font-bold text-green-900 mt-1 truncate">
                {ticket.clienteNome}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Criado há</p>
              <p className="text-lg font-bold text-orange-900 mt-1" suppressHydrationWarning>
                {Math.floor(
                  (new Date().getTime() - new Date(ticket.dataCriacao).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                dias
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
