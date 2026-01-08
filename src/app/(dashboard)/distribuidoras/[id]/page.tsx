'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, User, Building2, MapPin, FileText, Activity } from 'lucide-react';

export default function DistribuidoraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [distribuidora, setDistribuidora] = useState<Distribuidora | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDistribuidora() {
      try {
        const response = await fetch(`/api/distribuidoras/${params.id}`);
        if (!response.ok) {
          throw new Error('Distribuidora não encontrada');
        }
        const data = await response.json();
        setDistribuidora(data.data);
      } catch (error) {
        setError('Erro ao carregar distribuidora');
        console.error('Erro ao carregar distribuidora:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDistribuidora();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (error || !distribuidora) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/distribuidoras')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error || 'Distribuidora não encontrada'}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/distribuidoras')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">{distribuidora.nome}</h2>
        <p className="text-gray-500 mt-2">Detalhes da distribuidora</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Nome da Empresa</p>
                <p className="font-medium">{distribuidora.nome}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">CNPJ</p>
                <p className="font-medium font-mono">{distribuidora.cnpj}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Localização</p>
                <p className="font-medium">
                  {distribuidora.cidade} - {distribuidora.estado}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato e Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Responsável</p>
                <p className="font-medium">{distribuidora.responsavel}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{distribuidora.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    distribuidora.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {distribuidora.status}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-mono text-sm">{distribuidora.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Distribuidora</p>
              <p className="text-lg font-bold text-blue-900 mt-1">{distribuidora.nome}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Localização</p>
              <p className="text-lg font-bold text-purple-900 mt-1">
                {distribuidora.cidade}/{distribuidora.estado}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Status</p>
              <p className="text-lg font-bold text-green-900 mt-1 capitalize">{distribuidora.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
