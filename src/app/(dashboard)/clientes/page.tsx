'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetClientes } from '@/hooks/client/useGetClientes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar, StatusBadge, PageHeader, LoadingState } from '@/components/common';
import { formatDate } from '@/lib/date-utils';

export default function ClientesPage() {
  const router = useRouter();
  const { data: clientes = [], isLoading } = useGetClientes();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClientes = useMemo(() => {
    if (!searchQuery.trim()) {
      return clientes;
    }

    const query = searchQuery.toLowerCase();
    return clientes.filter(
      (cliente) =>
        cliente.name?.toLowerCase().includes(query) ||
        cliente.cnpj?.toLowerCase().includes(query) ||
        (cliente.phone?.toLowerCase() || '').includes(query) ||
        cliente.company?.name?.toLowerCase().includes(query) ||
        (cliente.city?.toLowerCase() || '').includes(query) ||
        (cliente.state?.toLowerCase() || '').includes(query)
    );
  }, [clientes, searchQuery]);

  if (isLoading) {
    return <LoadingState message="Carregando clientes..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie todos os clientes cadastrados no sistema"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nome, CNPJ, empresa, cidade..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Nome</TableHead>
                <TableHead className="w-[15%]">CNPJ</TableHead>
                <TableHead className="w-[12%]">Status</TableHead>
                <TableHead className="w-[13%]">Data Cadastro</TableHead>
                <TableHead className="w-[18%]">Empresa</TableHead>
                <TableHead className="w-[17%]">Localização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow
                    key={cliente.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/clientes/${cliente.id}`)}
                  >
                    <TableCell className="font-medium truncate">{cliente.name || '-'}</TableCell>
                    <TableCell className="font-mono text-sm">{cliente.cnpj || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge active={cliente.active} />
                    </TableCell>
                    <TableCell suppressHydrationWarning>{formatDate(cliente.createdAt)}</TableCell>
                    <TableCell className="truncate">{cliente.company?.name || '-'}</TableCell>
                    <TableCell className="truncate">
                      {cliente.city || '-'}/{cliente.state || '-'}
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
