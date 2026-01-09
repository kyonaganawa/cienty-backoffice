'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProdutos } from '@/hooks/product/useGetProdutos';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar, PageHeader, LoadingState } from '@/components/common';
import { formatPrice } from '@/lib/format-utils';

export default function ProdutosPage() {
  const router = useRouter();
  const { data: produtos = [], isLoading } = useGetProdutos();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProdutos = useMemo(() => {
    if (!searchQuery.trim()) {
      return produtos;
    }

    const query = searchQuery.toLowerCase();
    return produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(query) ||
        produto.codigo.toLowerCase().includes(query) ||
        produto.categoria.toLowerCase().includes(query) ||
        produto.descricao.toLowerCase().includes(query) ||
        produto.status.toLowerCase().includes(query)
    );
  }, [produtos, searchQuery]);

  if (isLoading) {
    return <LoadingState message="Carregando produtos..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos"
        description="Gerencie o catálogo completo de produtos"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Lista de Produtos ({filteredProdutos.length})</CardTitle>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nome, código, categoria..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProdutos.map((produto) => (
                  <TableRow
                    key={produto.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/produtos/${produto.id}`)}
                  >
                    <TableCell className="font-mono text-sm">{produto.codigo}</TableCell>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell className="font-semibold">{formatPrice(produto.preco)}</TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          produto.estoque === 0 ? 'text-red-600' : produto.estoque < 50 ? 'text-yellow-600' : 'text-green-600'
                        }`}
                      >
                        {produto.estoque}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          produto.status === 'disponivel' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {produto.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{produto.descricao}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
