'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetTicketById } from '@/hooks/ticket/useGetTicketById';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, InfoField } from '@/components/common';
import { ArrowLeft, User, Calendar, AlertCircle, Package, Building2, FileText, Clock, Pencil, Tag, Users, Paperclip } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { getTicketPriorityColor, getTicketPriorityLabel } from '@/lib/format-utils';
import { AttachmentList } from '@/components/common/attachment-list';
import { TicketComments } from '@/components/common/ticket-comments';

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


  if (isLoading) {
    return <LoadingState />;
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
        <Button
          onClick={() => router.push(`/tickets/${params.id}/editar`)}
          className="gap-2"
        >
          <Pencil className="w-4 h-4" />
          Editar Ticket
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">{ticket.titulo}</h2>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTicketPriorityColor(ticket.prioridade)}`}>{getTicketPriorityLabel(ticket.prioridade)}</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>{getStatusLabel(ticket.status)}</span>
        </div>
        <p className="text-gray-500">Detalhes do ticket</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField
              icon={Calendar}
              label="Data de Criação"
              value={<span suppressHydrationWarning>{formatDate(ticket.dataCriacao, "dd 'de' MMMM 'de' yyyy")}</span>}
            />
            <InfoField
              icon={Clock}
              label="Última Atualização"
              value={<span suppressHydrationWarning>{formatDate(ticket.dataAtualizacao, "dd 'de' MMMM 'de' yyyy")}</span>}
            />
            <InfoField icon={User} label="Criado por" value={ticket.criador?.nome || 'N/A'} />
            <InfoField
              icon={AlertCircle}
              label="Prioridade"
              value={<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTicketPriorityColor(ticket.prioridade)}`}>{getTicketPriorityLabel(ticket.prioridade)}</span>}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Relacionadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField
              icon={User}
              label="Cliente"
              value={
                <span
                  className="font-medium text-blue-600 cursor-pointer hover:underline"
                  onClick={() => router.push(`/clientes/${ticket.clienteId}`)}
                >
                  {ticket.clienteNome}
                </span>
              }
            />
            {ticket.owners && ticket.owners.length > 0 && (
              <InfoField
                icon={Users}
                label="Responsáveis"
                value={
                  <div className="flex flex-wrap gap-1">
                    {ticket.owners.map((owner: { id: string; nome: string; email: string }) => (
                      <span
                        key={owner.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {owner.nome}
                      </span>
                    ))}
                  </div>
                }
              />
            )}
            {ticket.distribuidoraNome && (
              <InfoField
                icon={Building2}
                label="Distribuidora"
                value={
                  <span
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/distribuidoras/${ticket.distribuidoraId}`)}
                  >
                    {ticket.distribuidoraNome}
                  </span>
                }
              />
            )}
            {ticket.pedidoNumero && (
              <InfoField
                icon={Package}
                label="Pedido"
                value={
                  <span
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/pedidos/${ticket.pedidoId}`)}
                  >
                    {ticket.pedidoNumero}
                  </span>
                }
              />
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

      {ticket.tags && ticket.tags.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <CardTitle>Tags</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tag.cor}`}
                >
                  {tag.nome}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {ticket.attachments && ticket.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Paperclip className="w-5 h-5" />
              <CardTitle>Anexos ({ticket.attachments.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AttachmentList attachments={ticket.attachments} />
          </CardContent>
        </Card>
      )}

      <TicketComments ticketId={ticket.id} initialComments={ticket.comments} />

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
                {getTicketPriorityLabel(ticket.prioridade)}
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
