'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetDistribuidoras } from '@/hooks/distributor/useGetDistribuidoras';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar, PageHeader, LoadingState, StatusBadge } from '@/components/common';

export default function DistribuidorasPage() {
  const router = useRouter();
  const { data: distribuidoras = [], isLoading } = useGetDistribuidoras();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDistribuidoras = useMemo(() => {
    if (!searchQuery.trim()) {
      return distribuidoras;
    }

    const query = searchQuery.toLowerCase();
    return distribuidoras.filter(
      (distribuidora) =>
        distribuidora.nome.toLowerCase().includes(query) ||
        distribuidora.cnpj.toLowerCase().includes(query) ||
        distribuidora.cidade.toLowerCase().includes(query) ||
        distribuidora.estado.toLowerCase().includes(query) ||
        distribuidora.responsavel.toLowerCase().includes(query) ||
        distribuidora.email.toLowerCase().includes(query) ||
        distribuidora.status.toLowerCase().includes(query)
    );
  }, [distribuidoras, searchQuery]);

  if (isLoading) {
    return <LoadingState message="Carregando distribuidoras..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Distribuidoras"
        description="Gerencie todas as distribuidoras parceiras"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Lista de Distribuidoras ({filteredDistribuidoras.length})</CardTitle>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nome, CNPJ, cidade..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Cidade/Estado</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDistribuidoras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Nenhuma distribuidora encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredDistribuidoras.map((distribuidora) => (
                  <TableRow
                    key={distribuidora.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/distribuidoras/${distribuidora.id}`)}
                  >
                    <TableCell className="font-medium">{distribuidora.nome}</TableCell>
                    <TableCell>{distribuidora.cnpj}</TableCell>
                    <TableCell>
                      {distribuidora.cidade}/{distribuidora.estado}
                    </TableCell>
                    <TableCell>{distribuidora.responsavel}</TableCell>
                    <TableCell>{distribuidora.email}</TableCell>
                    <TableCell>
                      <StatusBadge active={distribuidora.status === 'ativo'} />
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
