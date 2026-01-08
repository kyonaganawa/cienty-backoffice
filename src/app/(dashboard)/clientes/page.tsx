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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
        cliente.name.toLowerCase().includes(query) ||
        cliente.cnpj.toLowerCase().includes(query) ||
        (cliente.phone?.toLowerCase() || '').includes(query) ||
        cliente.company.name.toLowerCase().includes(query) ||
        cliente.city.toLowerCase().includes(query) ||
        cliente.state.toLowerCase().includes(query)
    );
  }, [clientes, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <p className="text-gray-500 mt-2">Gerencie todos os clientes cadastrados no sistema</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, CNPJ, empresa, cidade..."
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
                <TableHead>Empresa</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Cadastro</TableHead>
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
                    <TableCell className="font-medium">{cliente.name}</TableCell>
                    <TableCell className="font-mono text-sm">{cliente.cnpj}</TableCell>
                    <TableCell>{cliente.company.name}</TableCell>
                    <TableCell>
                      {cliente.city}/{cliente.state}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cliente.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {cliente.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell suppressHydrationWarning>{formatDate(cliente.createdAt)}</TableCell>
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
