'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetProdutoById } from '@/hooks/product/useGetProdutoById';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, InfoField, StatusBadge } from '@/components/common';
import { formatPrice } from '@/lib/format-utils';
import { ArrowLeft, Package, Tag, Layers, DollarSign, Activity, FileText } from 'lucide-react';

export default function ProdutoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: produto, isLoading, error } = useGetProdutoById(params.id as string);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !produto) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/produtos')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error?.message || 'Produto não encontrado'}</div>
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
          onClick={() => router.push('/produtos')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">{produto.nome}</h2>
        <p className="text-gray-500 mt-2">Detalhes do produto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField icon={Package} label="Nome" value={produto.nome} />
            <InfoField icon={Tag} label="Código" value={<span className="font-mono">{produto.codigo}</span>} />
            <InfoField icon={Layers} label="Categoria" value={produto.categoria} />
            <InfoField icon={FileText} label="Descrição" value={produto.descricao} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preço e Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Preço</p>
                <p className="font-bold text-2xl text-green-600">
                  {formatPrice(produto.preco)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Estoque</p>
                <p
                  className={`font-bold text-2xl ${
                    produto.estoque === 0
                      ? 'text-red-600'
                      : produto.estoque < 50
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {produto.estoque} unidades
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    produto.status === 'disponivel'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {produto.status}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-mono text-sm">{produto.id}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Produto</p>
              <p className="text-lg font-bold text-blue-900 mt-1">{produto.nome}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Categoria</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{produto.categoria}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Preço</p>
              <p className="text-lg font-bold text-green-900 mt-1">{formatPrice(produto.preco)}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Estoque</p>
              <p className="text-lg font-bold text-orange-900 mt-1">{produto.estoque} un.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
