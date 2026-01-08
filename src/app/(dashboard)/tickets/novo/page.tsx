'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Cliente } from '@/lib/mock-data/clientes';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';
import { Pedido } from '@/lib/mock-data/pedidos';

export default function NovoTicketPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [distribuidoras, setDistribuidoras] = useState<Distribuidora[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    clienteId: '',
    distribuidoraId: '',
    pedidoId: '',
    prioridade: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientesRes, distribuidorasRes, pedidosRes] = await Promise.all([
          fetch('/api/clientes'),
          fetch('/api/distribuidoras'),
          fetch('/api/pedidos'),
        ]);

        if (clientesRes.ok) {
          const clientesData = await clientesRes.json();
          setClientes(clientesData.data);
        }

        if (distribuidorasRes.ok) {
          const distribuidorasData = await distribuidorasRes.json();
          setDistribuidoras(distribuidorasData.data);
        }

        if (pedidosRes.ok) {
          const pedidosData = await pedidosRes.json();
          setPedidos(pedidosData.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    if (!formData.titulo || !formData.descricao || !formData.clienteId || !formData.prioridade) {
      setSubmitStatus({
        type: 'error',
        message: 'Por favor, preencha todos os campos obrigatórios',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Ticket criado com sucesso!',
        });
        // Wait a bit before redirecting
        setTimeout(() => {
          router.push('/tickets');
        }, 1500);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Erro ao criar ticket',
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/tickets')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Criar Novo Ticket</h2>
        <p className="text-gray-500 mt-2">
          Preencha os dados para criar um novo ticket de suporte
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Ticket</CardTitle>
            <CardDescription>
              Campos marcados com * são obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Problema com integração"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o problema detalhadamente..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                  required
                >
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade *</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
                  required
                >
                  <SelectTrigger id="prioridade">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="distribuidora">Distribuidora (opcional)</Label>
                <Select
                  value={formData.distribuidoraId}
                  onValueChange={(value) => setFormData({ ...formData, distribuidoraId: value })}
                >
                  <SelectTrigger id="distribuidora">
                    <SelectValue placeholder="Nenhuma" />
                  </SelectTrigger>
                  <SelectContent>
                    {distribuidoras.map((distribuidora) => (
                      <SelectItem key={distribuidora.id} value={distribuidora.id}>
                        {distribuidora.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pedido">Pedido (opcional)</Label>
                <Select
                  value={formData.pedidoId}
                  onValueChange={(value) => setFormData({ ...formData, pedidoId: value })}
                >
                  <SelectTrigger id="pedido">
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    {pedidos.map((pedido) => (
                      <SelectItem key={pedido.id} value={pedido.id}>
                        {pedido.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <div className="mt-6 flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Ticket'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/tickets')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
