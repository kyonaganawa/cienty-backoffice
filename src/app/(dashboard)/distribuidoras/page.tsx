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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando distribuidoras...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Distribuidoras</h2>
        <p className="text-gray-500 mt-2">Gerencie todas as distribuidoras parceiras</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Lista de Distribuidoras ({filteredDistribuidoras.length})</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, CNPJ, cidade..."
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
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          distribuidora.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {distribuidora.status}
                      </span>
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
