'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Produto } from '@/lib/mock-data/produtos';

export default function ProdutosPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await fetch('/api/produtos');
        const data = await response.json();
        setProdutos(data.data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProdutos();
  }, []);

  const filteredProdutos = useMemo(() => {
    if (!searchQuery.trim()) {return produtos;}

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
        <p className="text-gray-500 mt-2">
          Gerencie o catálogo completo de produtos
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Lista de Produtos ({filteredProdutos.length})</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, código, categoria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
                  <TableCell className="font-mono text-sm">
                    {produto.codigo}
                  </TableCell>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(produto.preco)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        produto.estoque === 0
                          ? 'text-red-600'
                          : produto.estoque < 50
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {produto.estoque}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        produto.status === 'disponivel'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {produto.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {produto.descricao}
                  </TableCell>
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
