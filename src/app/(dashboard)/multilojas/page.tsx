'use client';

import { useState, useMemo } from 'react';
import { useGetClientes } from '@/hooks/client/useGetClientes';
import { useGetLojas } from '@/hooks/loja/useGetLojas';
import { Loja } from '@/lib/mock-data/lojas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Store, User, CheckCircle2, XCircle, Loader2, Search, X, MapPin } from 'lucide-react';

export default function MultilojasPage() {
  const { data: clientes = [], isLoading: isLoadingClientes } = useGetClientes();
  const { data: lojas = [], isLoading: isLoadingLojas } = useGetLojas();
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [selectedLojaIds, setSelectedLojaIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const isLoading = isLoadingClientes || isLoadingLojas;

  const handleLojaToggle = (lojaId: string) => {
    setSelectedLojaIds((prev) =>
      prev.includes(lojaId)
        ? prev.filter((id) => id !== lojaId)
        : [...prev, lojaId]
    );
  };

  const handleRemoveLoja = (lojaId: string) => {
    setSelectedLojaIds((prev) => prev.filter((id) => id !== lojaId));
  };

  const filteredLojas = useMemo(() => {
    if (!searchQuery.trim()) {return lojas;}

    const query = searchQuery.toLowerCase();
    return lojas.filter(
      (loja) =>
        loja.nome.toLowerCase().includes(query) ||
        loja.cidade.toLowerCase().includes(query) ||
        loja.estado.toLowerCase().includes(query) ||
        loja.responsavel.toLowerCase().includes(query)
    );
  }, [lojas, searchQuery]);

  const selectedLojas = useMemo(() => {
    return lojas.filter((loja) => selectedLojaIds.includes(loja.id));
  }, [lojas, selectedLojaIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    if (!selectedClienteId) {
      setSubmitStatus({
        type: 'error',
        message: 'Por favor, selecione um usuário',
      });
      return;
    }

    if (selectedLojaIds.length === 0) {
      setSubmitStatus({
        type: 'error',
        message: 'Por favor, selecione pelo menos uma loja',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/multilojas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId: selectedClienteId,
          lojaIds: selectedLojaIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Vinculação realizada com sucesso!',
        });
        // Reset form
        setSelectedClienteId('');
        setSelectedLojaIds([]);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Erro ao processar vinculação',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Erro ao conectar com o servidor',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Multilojas</h2>
        <p className="text-gray-500 mt-2">
          Vincule usuários a múltiplas lojas
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <CardTitle>Selecione o Usuário</CardTitle>
                </div>
                <CardDescription>
                  Escolha o usuário que será vinculado às lojas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="cliente">Usuário</Label>
                  <Select
                    value={selectedClienteId}
                    onValueChange={setSelectedClienteId}
                  >
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome} - {cliente.empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedClienteId && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Usuário Selecionado:
                      </p>
                      <p className="text-sm text-blue-700">
                        {clientes.find((c) => c.id === selectedClienteId)?.nome}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {clientes.find((c) => c.id === selectedClienteId)?.email}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Stores Cards */}
            {selectedLojas.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      <CardTitle>Lojas Selecionadas ({selectedLojas.length})</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {selectedLojas.map((loja) => (
                      <div
                        key={loja.id}
                        className="flex items-start justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-green-900">{loja.nome}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-green-600" />
                            <p className="text-xs text-green-700">
                              {loja.cidade}/{loja.estado}
                            </p>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            Responsável: {loja.responsavel}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLoja(loja.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Store Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                <CardTitle>Lojas Disponíveis</CardTitle>
              </div>
              <CardDescription>
                Selecione as lojas que deseja vincular ao usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, cidade, estado..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Stores List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredLojas.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma loja encontrada
                    </p>
                  ) : (
                    filteredLojas.map((loja) => (
                      <div
                        key={loja.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={loja.id}
                          checked={selectedLojaIds.includes(loja.id)}
                          onCheckedChange={() => handleLojaToggle(loja.id)}
                        />
                        <label
                          htmlFor={loja.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{loja.nome}</p>
                            <Badge variant="outline" className="text-xs">
                              {loja.estado}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {loja.cidade} • {loja.responsavel}
                          </p>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Status */}
        {submitStatus.type && (
          <Card
            className={`mt-6 ${
              submitStatus.type === 'success'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {submitStatus.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <p
                  className={`font-medium ${
                    submitStatus.type === 'success'
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {submitStatus.message}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full lg:w-auto"
            disabled={isSubmitting || !selectedClienteId || selectedLojaIds.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Vincular Usuário às Lojas'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
