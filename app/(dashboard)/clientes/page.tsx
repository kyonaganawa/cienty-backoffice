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
import { Cliente } from '@/lib/mock-data/clientes';

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await fetch('/api/clientes');
        const data = await response.json();
        setClientes(data.data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    if (!searchQuery.trim()) return clientes;

    const query = searchQuery.toLowerCase();
    return clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(query) ||
        cliente.email.toLowerCase().includes(query) ||
        cliente.telefone.toLowerCase().includes(query) ||
        cliente.empresa.toLowerCase().includes(query) ||
        cliente.status.toLowerCase().includes(query)
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
        <p className="text-gray-500 mt-2">
          Gerencie todos os clientes cadastrados no sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, email, empresa..."
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
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Empresa</TableHead>
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
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.empresa}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cliente.status === 'ativo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cliente.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
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
