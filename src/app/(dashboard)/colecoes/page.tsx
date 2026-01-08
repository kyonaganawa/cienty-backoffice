'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Colecao } from '@/lib/mock-data/colecoes';
import {
  Layers,
  Package,
  Search,
  Plus,
  Calendar,
} from 'lucide-react';

export default function ColecoesPage() {
  const router = useRouter();
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchColecoes() {
      try {
        const response = await fetch('/api/colecoes');
        const data = await response.json();
        setColecoes(data.data);
      } catch (error) {
        console.error('Erro ao carregar coleções:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchColecoes();
  }, []);

  const filteredColecoes = useMemo(() => {
    return colecoes.filter((colecao) => {
      const matchesSearch =
        colecao.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        colecao.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        colecao.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [colecoes, searchQuery]);

  const stats = useMemo(() => {
    const totalColecoes = colecoes.length;
    const totalProdutos = colecoes.reduce(
      (sum, c) => sum + c.produtoIds.length,
      0
    );
    const mediaProdutos =
      totalColecoes > 0 ? (totalProdutos / totalColecoes).toFixed(1) : '0';

    return { totalColecoes, totalProdutos, mediaProdutos };
  }, [colecoes]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando coleções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coleções</h2>
          <p className="text-gray-500 mt-2">
            Organize produtos em coleções temáticas
          </p>
        </div>
        <Button
          onClick={() => router.push('/colecoes/novo')}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Coleção
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Coleções</p>
                <p className="text-2xl font-bold">{stats.totalColecoes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Produtos</p>
                <p className="text-2xl font-bold">{stats.totalProdutos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Média por Coleção</p>
                <p className="text-2xl font-bold">{stats.mediaProdutos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Buscar por nome, descrição ou ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Digite para buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Todas as Coleções ({filteredColecoes.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Criado Por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredColecoes.map((colecao) => (
                <TableRow
                  key={colecao.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/colecoes/${colecao.id}`)}
                >
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      #{colecao.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{colecao.nome}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-500 max-w-xs truncate">
                      {colecao.descricao || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {colecao.produtoIds.length}
                      </span>
                      <span className="text-sm text-gray-500">
                        {colecao.produtoIds.length === 1
                          ? 'produto'
                          : 'produtos'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(colecao.dataCriacao)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600">
                      {colecao.criadoPor}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredColecoes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhuma coleção encontrada com os filtros aplicados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
