'use client';

import { useEffect, useState, useMemo } from 'react';
import { Job } from '@/lib/mock-data/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Upload,
  Download,
  Database,
  Trash2
} from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultadoFilter, setResultadoFilter] = useState<string>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data.data);
      } catch (error) {
        console.error('Erro ao carregar jobs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.nome.toLowerCase().includes(query) ||
          job.descricao.toLowerCase().includes(query)
      );
    }

    // Filter by resultado
    if (resultadoFilter !== 'all') {
      filtered = filtered.filter((job) => job.resultado === resultadoFilter);
    }

    // Filter by tipo
    if (tipoFilter !== 'all') {
      filtered = filtered.filter((job) => job.tipo === tipoFilter);
    }

    return filtered;
  }, [jobs, searchQuery, resultadoFilter, tipoFilter]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const success = jobs.filter((j) => j.resultado === 'success').length;
    const error = jobs.filter((j) => j.resultado === 'error').length;
    return { total, success, error };
  }, [jobs]);

  const getResultadoBadge = (resultado: string) => {
    if (resultado === 'success') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Sucesso
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="w-3 h-3 mr-1" />
        Erro
      </Badge>
    );
  };

  const getTipoIcon = (tipo: string) => {
    const icons = {
      sync: Play,
      import: Upload,
      export: Download,
      backup: Database,
      cleanup: Trash2,
    };
    const Icon = icons[tipo as keyof typeof icons] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      sync: 'Sincronização',
      import: 'Importação',
      export: 'Exportação',
      backup: 'Backup',
      cleanup: 'Limpeza',
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando jobs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
        <p className="text-gray-500 mt-2">
          Histórico de execução de jobs do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Jobs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bem-sucedidos</p>
                <p className="text-2xl font-bold">{stats.success}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Com Erro</p>
                <p className="text-2xl font-bold">{stats.error}</p>
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
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Nome ou descrição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Resultado Filter */}
            <div className="space-y-2">
              <Label htmlFor="resultado">Resultado</Label>
              <Select value={resultadoFilter} onValueChange={setResultadoFilter}>
                <SelectTrigger id="resultado">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo Filter */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="sync">Sincronização</SelectItem>
                  <SelectItem value="import">Importação</SelectItem>
                  <SelectItem value="export">Exportação</SelectItem>
                  <SelectItem value="backup">Backup</SelectItem>
                  <SelectItem value="cleanup">Limpeza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Execuções ({filteredJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum job encontrado
            </p>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded">
                          {getTipoIcon(job.tipo)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {job.nome}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {job.descricao}
                          </p>
                          <div className="flex gap-3 mt-1">
                            <span className="text-xs text-gray-500">
                              Empresa: <span className="font-medium text-gray-700">{job.empresa}</span>
                            </span>
                            <span className="text-xs text-gray-500">
                              Distribuidora: <span className="font-medium text-gray-700">{job.distribuidora}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 ml-14">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(job.dataExecucao).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {getTipoLabel(job.tipo)}
                          </Badge>
                        </div>
                        <div>Duração: {formatDuration(job.duracao)}</div>
                        {job.mensagemErro && (
                          <div className="text-red-600 w-full">
                            Erro: {job.mensagemErro}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getResultadoBadge(job.resultado)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
