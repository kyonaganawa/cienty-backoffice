'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pedido } from '@/lib/mock-data/pedidos';
import { Cliente } from '@/lib/mock-data/clientes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ClientePedidosPage() {
  const params = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clienteRes, pedidosRes] = await Promise.all([
          fetch(`/api/clientes/${params.id}`),
          fetch(`/api/clientes/${params.id}/pedidos`),
        ]);

        if (clienteRes.ok) {
          const clienteData = await clienteRes.json();
          setCliente(clienteData.data);
        }

        if (pedidosRes.ok) {
          const pedidosData = await pedidosRes.json();
          setPedidos(pedidosData.data);
        }
      } catch (error) {
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
        <div className="text-lg">Carregando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(`/clientes/${params.id}`)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Pedidos {cliente && `de ${cliente.nome}`}
        </h2>
        <p className="text-gray-500 mt-2">
          Todos os pedidos realizados por este cliente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos ({pedidos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map((pedido) => (
                  <TableRow
                    key={pedido.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/pedidos/${pedido.id}`)}
                  >
                    <TableCell className="font-medium">{pedido.numero}</TableCell>
                    <TableCell>
                      {new Date(pedido.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          pedido.status
                        )}`}
                      >
                        {getStatusLabel(pedido.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatPrice(pedido.total)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pedidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total de Pedidos</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{pedidos.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {formatPrice(pedidos.reduce((sum, p) => sum + p.total, 0))}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Ticket Médio</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {formatPrice(pedidos.reduce((sum, p) => sum + p.total, 0) / pedidos.length)}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Pedidos Pendentes</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {pedidos.filter((p) => p.status === 'pendente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
