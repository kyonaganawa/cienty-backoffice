'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Cliente } from '@/lib/mock-data/clientes';
import { Pedido } from '@/lib/mock-data/pedidos';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Building2, Calendar, Activity, ChevronDown, ChevronUp, ShoppingCart, Package } from 'lucide-react';

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [distribuidoras, setDistribuidoras] = useState<Distribuidora[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPedidos, setShowPedidos] = useState(true);
  const [showDistribuidoras, setShowDistribuidoras] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clienteRes, pedidosRes, distribuidorasRes] = await Promise.all([
          fetch(`/api/clientes/${params.id}`),
          fetch(`/api/clientes/${params.id}/pedidos`),
          fetch(`/api/clientes/${params.id}/distribuidoras`),
        ]);

        if (!clienteRes.ok) {
          throw new Error('Cliente não encontrado');
        }

        const clienteData = await clienteRes.json();
        const pedidosData = await pedidosRes.json();
        const distribuidorasData = await distribuidorasRes.json();

        setCliente(clienteData.data);
        setPedidos(pedidosData.data);
        setDistribuidoras(distribuidorasData.data);
      } catch (error) {
        setError('Erro ao carregar dados');
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_processamento: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pendente: 'Pendente',
      em_processamento: 'Em Processamento',
      enviado: 'Enviado',
      entregue: 'Entregue',
      cancelado: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
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
            <div className="text-center text-red-600">{error || 'Cliente não encontrado'}</div>
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
        <h2 className="text-3xl font-bold tracking-tight">{cliente.nome}</h2>
        <p className="text-gray-500 mt-2">Detalhes do cliente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{cliente.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{cliente.telefone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-medium">{cliente.empresa}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status e Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    cliente.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {cliente.status}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Data de Cadastro</p>
                <p className="font-medium">
                  {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-mono text-sm">{cliente.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Nome Completo</p>
              <p className="text-lg font-bold text-blue-900 mt-1">{cliente.nome}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Empresa</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{cliente.empresa}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Status da Conta</p>
              <p className="text-lg font-bold text-green-900 mt-1 capitalize">{cliente.status}</p>
            </div>
          </div>
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
                        {new Date(pedido.data).toLocaleDateString('pt-BR')} • {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
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
              <CardTitle>Distribuidoras Conectadas ({distribuidoras.length})</CardTitle>
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
            {distribuidoras.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma distribuidora conectada</p>
            ) : (
              <div className="space-y-3">
                {distribuidoras.map((distribuidora) => (
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
                    </div>
                    <div>
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
