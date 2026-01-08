'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetPedidoById } from '@/hooks/pedido/useGetPedidoById';
import { useGetClienteById } from '@/hooks/client/useGetClienteById';
import { useGetDistribuidoraById } from '@/hooks/distributor/useGetDistribuidoraById';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Building2, Package, DollarSign, FileText } from 'lucide-react';

export default function PedidoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: pedido, isLoading: isLoadingPedido, error } = useGetPedidoById(params.id as string);
  const { data: cliente } = useGetClienteById(pedido?.clienteId || '');
  const { data: distribuidora } = useGetDistribuidoraById(pedido?.distribuidoraId || '');

  const isLoading = isLoadingPedido;

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

  if (error || !pedido) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error?.message || 'Pedido não encontrado'}</div>
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
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">{pedido.numero}</h2>
        <p className="text-gray-500 mt-2">Detalhes do pedido</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Número do Pedido</p>
                <p className="font-medium">{pedido.numero}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Data do Pedido</p>
                <p className="font-medium">
                  {new Date(pedido.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    pedido.status
                  )}`}
                >
                  {getStatusLabel(pedido.status)}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="font-bold text-2xl text-green-600">
                  {formatPrice(pedido.total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Relacionadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cliente && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/clientes/${cliente.id}`)}
                  >
                    {cliente.nome}
                  </p>
                  <p className="text-sm text-gray-500">{cliente.empresa}</p>
                </div>
              </div>
            )}
            {distribuidora && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Distribuidora</p>
                  <p
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/distribuidoras/${distribuidora.id}`)}
                  >
                    {distribuidora.nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    {distribuidora.cidade}/{distribuidora.estado}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ID do Pedido</p>
                <p className="font-mono text-sm">{pedido.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido ({pedido.itens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-right">Preço Unitário</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedido.itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.produtoNome}</TableCell>
                  <TableCell className="text-center">{item.quantidade}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.precoUnitario)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPrice(item.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50 font-bold">
                <TableCell colSpan={3} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right text-green-600 text-lg">
                  {formatPrice(pedido.total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Pedido</p>
              <p className="text-lg font-bold text-blue-900 mt-1">{pedido.numero}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Status</p>
              <p className="text-lg font-bold text-purple-900 mt-1 capitalize">
                {getStatusLabel(pedido.status)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Valor Total</p>
              <p className="text-lg font-bold text-green-900 mt-1">{formatPrice(pedido.total)}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Itens</p>
              <p className="text-lg font-bold text-orange-900 mt-1">
                {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
