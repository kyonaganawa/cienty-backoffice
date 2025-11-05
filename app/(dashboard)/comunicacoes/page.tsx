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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Comunicacao } from '@/lib/mock-data/comunicacoes';
import {
  MessageSquare,
  Calendar,
  Eye,
  MousePointerClick,
  Search,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';

export default function ComunicacoesPage() {
  const router = useRouter();
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchComunicacoes() {
      try {
        const response = await fetch('/api/comunicacoes');
        const data = await response.json();
        setComunicacoes(data.data);
      } catch (error) {
        console.error('Erro ao carregar comunicações:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComunicacoes();
  }, []);

  const filteredComunicacoes = useMemo(() => {
    return comunicacoes.filter((comunicacao) => {
      const matchesSearch =
        comunicacao.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comunicacao.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comunicacao.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || comunicacao.status === statusFilter;

      const matchesTipo = tipoFilter === 'all' || comunicacao.tipo === tipoFilter;

      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [comunicacoes, searchQuery, statusFilter, tipoFilter]);

  const stats = useMemo(() => {
    const ativas = comunicacoes.filter((c) => c.status === 'ativo').length;
    const agendadas = comunicacoes.filter((c) => c.status === 'agendado').length;
    const totalVisualizacoes = comunicacoes.reduce(
      (sum, c) => sum + c.visualizacoes,
      0
    );
    const totalCliques = comunicacoes.reduce((sum, c) => sum + c.cliques, 0);

    return { ativas, agendadas, totalVisualizacoes, totalCliques };
  }, [comunicacoes]);

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      agendado: 'bg-blue-100 text-blue-800',
      expirado: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      ativo: 'Ativo',
      inativo: 'Inativo',
      agendado: 'Agendado',
      expirado: 'Expirado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      popup: 'Pop-up',
      banner: 'Banner',
      topbar: 'Topbar',
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      popup: 'bg-purple-100 text-purple-800',
      banner: 'bg-blue-100 text-blue-800',
      topbar: 'bg-yellow-100 text-yellow-800',
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
          <p className="mt-4 text-gray-600">Carregando comunicações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comunicações</h2>
          <p className="text-gray-500 mt-2">
            Gerencie mensagens e anúncios para seus usuários
          </p>
        </div>
        <Button
          onClick={() => router.push('/comunicacoes/novo')}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Comunicação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Comunicações Ativas</p>
                <p className="text-2xl font-bold">{stats.ativas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Agendadas</p>
                <p className="text-2xl font-bold">{stats.agendadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Visualizações</p>
                <p className="text-2xl font-bold">
                  {stats.totalVisualizacoes.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MousePointerClick className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Cliques</p>
                <p className="text-2xl font-bold">
                  {stats.totalCliques.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Título, texto ou ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="popup">Pop-up</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="topbar">Topbar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Todas as Comunicações ({filteredComunicacoes.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Imagem</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComunicacoes.map((comunicacao) => (
                <TableRow
                  key={comunicacao.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/comunicacoes/${comunicacao.id}`)}
                >
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      #{comunicacao.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium">{comunicacao.titulo}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {comunicacao.texto}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(
                          comunicacao.tipo
                        )}`}
                      >
                        {getTipoLabel(comunicacao.tipo)}
                      </span>
                      {comunicacao.tipo === 'popup' &&
                        comunicacao.frequenciaHoras && (
                          <p className="text-xs text-gray-500 mt-1">
                            A cada {comunicacao.frequenciaHoras}h
                          </p>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {formatDate(comunicacao.dataInicio)}
                      </p>
                      <p className="text-gray-500 ml-4">
                        até {formatDate(comunicacao.dataFim)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {comunicacao.imagem ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ImageIcon className="w-4 h-4" />
                        Sim
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Eye className="w-4 h-4 text-gray-400" />
                      {comunicacao.visualizacoes.toLocaleString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MousePointerClick className="w-4 h-4 text-gray-400" />
                      {comunicacao.cliques.toLocaleString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        comunicacao.status
                      )}`}
                    >
                      {getStatusLabel(comunicacao.status)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredComunicacoes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhuma comunicação encontrada com os filtros aplicados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
