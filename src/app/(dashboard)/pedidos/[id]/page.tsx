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
import { LoadingState, InfoField, ColoredBadge } from '@/components/common';
import { ArrowLeft, Calendar, User, Building2, Package, DollarSign, FileText } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { formatPrice, getOrderStatusColor, getOrderStatusLabel } from '@/lib/format-utils';

export default function PedidoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: pedido, isLoading: isLoadingPedido, error } = useGetPedidoById(params.id as string);
  const { data: cliente } = useGetClienteById(pedido?.clienteId || '');
  const { data: distribuidora } = useGetDistribuidoraById(pedido?.distribuidoraId || '');

  const isLoading = isLoadingPedido;

  if (isLoading) {
    return <LoadingState />;
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
            <InfoField icon={FileText} label="Número do Pedido" value={pedido.numero} />
            <InfoField
              icon={Calendar}
              label="Data do Pedido"
              value={<span suppressHydrationWarning>{formatDate(pedido.data, "dd 'de' MMMM 'de' yyyy")}</span>}
            />
            <InfoField
              icon={Package}
              label="Status"
              value={<ColoredBadge text={getOrderStatusLabel(pedido.status)} colorClasses={getOrderStatusColor(pedido.status)} />}
            />
            <InfoField
              icon={DollarSign}
              label="Valor Total"
              value={<span className="font-bold text-2xl text-green-600">{formatPrice(pedido.total)}</span>}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Relacionadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cliente && (
              <InfoField
                icon={User}
                label="Cliente"
                value={
                  <div>
                    <p
                      className="font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => router.push(`/clientes/${cliente.id}`)}
                    >
                      {cliente.name}
                    </p>
                    <p className="text-sm text-gray-500">{cliente.company.name}</p>
                  </div>
                }
              />
            )}
            {distribuidora && (
              <InfoField
                icon={Building2}
                label="Distribuidora"
                value={
                  <div>
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
                }
              />
            )}
            <InfoField icon={FileText} label="ID do Pedido" value={<span className="font-mono text-sm">{pedido.id}</span>} />
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
                {getOrderStatusLabel(pedido.status)}
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
