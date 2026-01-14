'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetClienteById } from '@/hooks/client/useGetClienteById';
import { useGetClientePedidos } from '@/hooks/client/useGetClientePedidos';
import { useGetClienteDistribuidoras } from '@/hooks/client/useGetClienteDistribuidoras';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';
import { formatRelativeTime, formatDate } from '@/lib/date-utils';
import { formatPrice, getOrderStatusColor as getStatusColor, getOrderStatusLabel as getStatusLabel } from '@/lib/format-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, StatusBadge, InfoField } from '@/components/common';
import { ArrowLeft, Mail, Phone, Building2, Calendar, Activity, ShoppingCart, Package, User, RefreshCw, Clock, ChevronUp, ChevronDown } from 'lucide-react';

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const { data: cliente, isLoading: isLoadingCliente, error } = useGetClienteById(clienteId);
  const { data: pedidos = [] } = useGetClientePedidos(clienteId);
  const { data: distribuidoras = [] } = useGetClienteDistribuidoras(clienteId);

  const [showPedidos, setShowPedidos] = useState(true);
  const [showDistribuidoras, setShowDistribuidoras] = useState(true);
  const [syncingDistribuidora, setSyncingDistribuidora] = useState<string | null>(null);
  const [localDistribuidoras, setLocalDistribuidoras] = useState<Distribuidora[]>([]);

  const isLoading = isLoadingCliente;

  // Update local state when distribuidoras change
  useEffect(() => {
    setLocalDistribuidoras(distribuidoras);
  }, [distribuidoras]);

  const handleSyncDistribuidora = async (e: React.MouseEvent, distribuidoraId: string) => {
    e.stopPropagation();
    setSyncingDistribuidora(distribuidoraId);

    // Simulate sync API call
    setTimeout(() => {
      // Update the lastSync date for this distribuidora
      setLocalDistribuidoras(prev =>
        prev.map(d =>
          d.id === distribuidoraId
            ? { ...d, lastSync: new Date().toISOString() }
            : d
        )
      );
      setSyncingDistribuidora(null);
    }, 2000);
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) {
      return 'Nunca sincronizado';
    }
    return formatRelativeTime(lastSync);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !cliente) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/clientes')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error?.message || 'Cliente não encontrado'}</div>
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
          onClick={() => router.push('/clientes')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">{cliente.name}</h2>
        <p className="text-gray-500 mt-2">Detalhes do cliente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField
              icon={Building2}
              label="CNPJ"
              value={<span className="font-mono text-sm">{cliente.cnpj}</span>}
            />
            <InfoField icon={Building2} label="Empresa" value={cliente.company.name} />
            <InfoField icon={Phone} label="Telefone" value={cliente.phone || 'Não informado'} />
            <InfoField icon={Mail} label="Email Principal" value={cliente.pharmacyContacts[0]?.email || 'Não informado'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status e Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField icon={Activity} label="Status" value={<StatusBadge active={cliente.active} />} />
            <InfoField
              icon={Calendar}
              label="Data de Cadastro"
              value={
                <span suppressHydrationWarning>{formatDate(cliente.createdAt, 'dd \'de\' MMMM \'de\' yyyy')}</span>
              }
            />
            <InfoField icon={Building2} label="ID" value={<span className="font-mono text-sm">{cliente.id}</span>} />
          </CardContent>
        </Card>
      </div>

      {/* Contacts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Contatos ({cliente.pharmacyContacts?.length || 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!cliente.pharmacyContacts || cliente.pharmacyContacts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum contato cadastrado</p>
          ) : (
            <div className="space-y-3">
              {cliente.pharmacyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        {contact.position && (
                          <p className="text-sm text-gray-500">{contact.position}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pedidos Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <CardTitle>Pedidos ({pedidos.length})</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/clientes/${params.id}/pedidos`)}
              >
                Ver Todos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPedidos(!showPedidos)}
              >
                {showPedidos ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showPedidos && (
          <CardContent>
            {pedidos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum pedido encontrado</p>
            ) : (
              <div className="space-y-3">
                {pedidos.slice(0, 5).map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/pedidos/${pedido.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{pedido.numero}</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            pedido.status
                          )}`}
                        >
                          {getStatusLabel(pedido.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(pedido.data)} • {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatPrice(pedido.total)}</p>
                    </div>
                  </div>
                ))}
                {pedidos.length > 5 && (
                  <div className="pt-2 text-center">
                    <Button
                      variant="link"
                      onClick={() => router.push(`/clientes/${params.id}/pedidos`)}
                    >
                      Ver todos os {pedidos.length} pedidos
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Distribuidoras Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <CardTitle>Distribuidoras Conectadas ({localDistribuidoras.length})</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDistribuidoras(!showDistribuidoras)}
            >
              {showDistribuidoras ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {showDistribuidoras && (
          <CardContent>
            {localDistribuidoras.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma distribuidora conectada</p>
            ) : (
              <div className="space-y-3">
                {localDistribuidoras.map((distribuidora) => (
                  <div
                    key={distribuidora.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/distribuidoras/${distribuidora.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{distribuidora.nome}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {distribuidora.cidade}/{distribuidora.estado} • {distribuidora.responsavel}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span suppressHydrationWarning>Última sinc: {formatLastSync(distribuidora.lastSync)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleSyncDistribuidora(e, distribuidora.id)}
                        disabled={syncingDistribuidora === distribuidora.id}
                        className="gap-2"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            syncingDistribuidora === distribuidora.id ? 'animate-spin' : ''
                          }`}
                        />
                        {syncingDistribuidora === distribuidora.id ? 'Sincronizando...' : 'Sincronizar'}
                      </Button>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          distribuidora.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {distribuidora.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
