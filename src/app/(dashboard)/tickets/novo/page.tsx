'use client';

import { useEffect, useState, useRef } from 'react';
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
import { ArrowLeft, Loader2, CheckCircle2, XCircle, X, Plus } from 'lucide-react';
import { Cliente } from '@/lib/mock-data/clientes';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';
import { Pedido } from '@/lib/mock-data/pedidos';
import { TicketTag } from '@/lib/mock-data/tickets';
import { useAuth } from '@/hooks/auth/useAuth';
import { useFileUpload } from '@/hooks/upload/useFileUpload';
import { FileUpload } from '@/components/common/file-upload';

export default function NovoTicketPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [distribuidoras, setDistribuidoras] = useState<Distribuidora[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [availableTags, setAvailableTags] = useState<TicketTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<TicketTag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
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

  // File upload hook
  const {
    pendingFiles,
    isUploading,
    addFiles,
    removePending,
    getCompletedAttachments,
  } = useFileUpload({
    uploader: {
      id: user?.id || '',
      nome: user?.name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientesRes, distribuidorasRes, pedidosRes, tagsRes] = await Promise.all([
          fetch('/api/clientes'),
          fetch('/api/distribuidoras'),
          fetch('/api/pedidos'),
          fetch('/api/tags'),
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

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setAvailableTags(tagsData.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node) &&
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter available tags based on input and exclude already selected
  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTags.some((selected) => selected.id === tag.id) &&
      tag.nome.toLowerCase().includes(tagInput.toLowerCase())
  );

  // Check if the input matches any existing tag exactly
  const exactMatch = availableTags.some(
    (tag) => tag.nome.toLowerCase() === tagInput.toLowerCase().trim()
  );

  // Check if the tag is already selected
  const isAlreadySelected = selectedTags.some(
    (tag) => tag.nome.toLowerCase() === tagInput.toLowerCase().trim()
  );

  const handleAddTag = (tag: TicketTag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
    setIsTagDropdownOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleCreateTag = async () => {
    const trimmedInput = tagInput.trim();
    if (!trimmedInput || trimmedInput.length < 2) { return; }

    setIsCreatingTag(true);
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: trimmedInput }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const newTag = data.data;
        // Add to available tags if it's new
        if (!data.isExisting) {
          setAvailableTags([...availableTags, newTag]);
        }
        // Add to selected tags
        handleAddTag(newTag);
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    } finally {
      setIsCreatingTag(false);
    }
  };

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

    if (!user) {
      setSubmitStatus({
        type: 'error',
        message: 'Usuário não autenticado',
      });
      return;
    }

    setIsSubmitting(true);

    // Get related entity names
    const selectedClient = clientes.find((c) => String(c.id) === formData.clienteId);
    const selectedDistribuidora = distribuidoras.find((d) => String(d.id) === formData.distribuidoraId);
    const selectedPedido = pedidos.find((p) => String(p.id) === formData.pedidoId);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clienteNome: selectedClient?.name,
          distribuidoraNome: selectedDistribuidora?.nome,
          pedidoNumero: selectedPedido?.numero,
          tags: selectedTags,
          attachments: getCompletedAttachments(),
          criador: {
            id: user.id,
            nome: user.name,
            email: user.email,
          },
          owners: [],
        }),
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
                      <SelectItem key={cliente.id} value={String(cliente.id)}>
                        {cliente.name} - {cliente.company.name}
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

            {/* Tags Section */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (opcional)</Label>
              <div className="space-y-3">
                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${tag.cor}`}
                      >
                        {tag.nome}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag.id)}
                          className="hover:opacity-70 focus:outline-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag Input with Dropdown */}
                <div className="relative">
                  <Input
                    ref={tagInputRef}
                    id="tags"
                    placeholder="Digite para buscar ou criar uma tag..."
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setIsTagDropdownOpen(true);
                    }}
                    onFocus={() => setIsTagDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (tagInput.trim().length >= 2 && !isAlreadySelected) {
                          handleCreateTag();
                        }
                      }
                    }}
                  />

                  {/* Dropdown */}
                  {isTagDropdownOpen && (tagInput.length > 0 || filteredTags.length > 0) && (
                    <div
                      ref={tagDropdownRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {/* Filtered existing tags */}
                      {filteredTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        >
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tag.cor}`}
                          >
                            {tag.nome}
                          </span>
                        </button>
                      ))}

                      {/* Create new tag option */}
                      {tagInput.trim().length >= 2 && !exactMatch && !isAlreadySelected && (
                        <button
                          type="button"
                          onClick={handleCreateTag}
                          disabled={isCreatingTag}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-blue-600 border-t border-gray-100"
                        >
                          {isCreatingTag ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          <span>Criar tag &quot;{tagInput.trim()}&quot;</span>
                        </button>
                      )}

                      {/* No results message */}
                      {filteredTags.length === 0 && tagInput.trim().length < 2 && (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          Digite pelo menos 2 caracteres para criar uma nova tag
                        </div>
                      )}

                      {/* Already selected message */}
                      {isAlreadySelected && (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          Esta tag já foi adicionada
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Selecione tags existentes ou crie novas digitando e pressionando Enter
                </p>
              </div>
            </div>

            {/* File Attachments Section */}
            <div className="space-y-2">
              <Label>Anexos (opcional)</Label>
              <FileUpload
                existingAttachments={[]}
                pendingFiles={pendingFiles}
                onFilesSelected={addFiles}
                onRemoveAttachment={() => {}}
                onRemovePending={removePending}
                disabled={isSubmitting || isUploading}
              />
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
