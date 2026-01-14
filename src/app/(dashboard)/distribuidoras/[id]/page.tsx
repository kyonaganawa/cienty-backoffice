'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetDistribuidoraById } from '@/hooks/distributor/useGetDistribuidoraById';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, StatusBadge, InfoField } from '@/components/common';
import { ArrowLeft, Mail, User, Building2, MapPin, FileText } from 'lucide-react';

export default function DistribuidoraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: distribuidora, isLoading, error } = useGetDistribuidoraById(params.id as string);

  if (isLoading) {
    return <LoadingState />;
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
            <div className="text-center text-red-600">{error?.message || 'Distribuidora não encontrada'}</div>
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
            <InfoField icon={Building2} label="Nome da Empresa" value={distribuidora.nome} />
            <InfoField icon={FileText} label="CNPJ" value={<span className="font-mono">{distribuidora.cnpj}</span>} />
            <InfoField icon={MapPin} label="Localização" value={`${distribuidora.cidade} - ${distribuidora.estado}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato e Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField icon={User} label="Responsável" value={distribuidora.responsavel} />
            <InfoField icon={Mail} label="Email" value={distribuidora.email} />
            <InfoField icon={Building2} label="Status" value={<StatusBadge active={distribuidora.status === 'ativo'} />} />
            <InfoField icon={FileText} label="ID" value={<span className="font-mono text-sm">{distribuidora.id}</span>} />
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
