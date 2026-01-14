'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingState } from '@/components/common';
import { Ticket, Tag, Users, Building2, BarChart3 } from 'lucide-react';

interface GroupCount {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

interface TicketStats {
  total: number;
  byStatus: {
    open: number;
    assigned: number;
    resolved: number;
    closed: number;
  };
  byTag: GroupCount[];
  byClient: GroupCount[];
  byDistributor: GroupCount[];
}

export default function TicketDashboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tickets/stats?period=${period}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!stats) {
    return (
      <div className="text-center text-red-600">Erro ao carregar estatísticas</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Tickets</h2>
          <p className="text-gray-500 mt-1">
            Visão geral dos tickets {period === 'weekly' ? 'da última semana' : 'do último mês'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === 'weekly' ? 'default' : 'outline'}
            onClick={() => setPeriod('weekly')}
          >
            Semanal
          </Button>
          <Button
            variant={period === 'monthly' ? 'default' : 'outline'}
            onClick={() => setPeriod('monthly')}
          >
            Mensal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Tickets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abertos</p>
                <p className="text-2xl font-bold">{stats.byStatus.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resolvidos</p>
                <p className="text-2xl font-bold">{stats.byStatus.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fechados</p>
                <p className="text-2xl font-bold">{stats.byStatus.closed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Tags */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <CardTitle>Por Tags</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.byTag.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.byTag.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">{item.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* By Client */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle>Por Cliente</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.byClient.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.byClient.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">{item.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* By Distributor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <CardTitle>Por Distribuidora</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.byDistributor.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distribuidora</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.byDistributor.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">{item.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
