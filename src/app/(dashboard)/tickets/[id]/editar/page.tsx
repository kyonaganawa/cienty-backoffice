'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { ArrowLeft, Loader2, CheckCircle2, XCircle, X, Plus, Users } from 'lucide-react';
import { Cliente } from '@/lib/mock-data/clientes';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';
import { Pedido } from '@/lib/mock-data/pedidos';
import { Ticket, TicketTag, TicketOwner, TicketAttachment } from '@/lib/mock-data/tickets';
import { AdminUser } from '@/lib/mock-data/admin-users';
import { LoadingState } from '@/components/common';
import { useFileUpload } from '@/hooks/upload/useFileUpload';
import { FileUpload } from '@/components/common/file-upload';
import { useAuth } from '@/hooks/auth/useAuth';

export default function EditarTicketPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<TicketAttachment[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [distribuidoras, setDistribuidoras] = useState<Distribuidora[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [availableTags, setAvailableTags] = useState<TicketTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<TicketTag[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<TicketOwner[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [ownerInput, setOwnerInput] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const ownerInputRef = useRef<HTMLInputElement>(null);
  const ownerDropdownRef = useRef<HTMLDivElement>(null);
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
    status: '',
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
    existingAttachmentsCount: existingAttachments.length,
  });

  const handleRemoveExistingAttachment = (attachmentId: string) => {
    setExistingAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketRes, clientesRes, distribuidorasRes, pedidosRes, tagsRes, adminUsersRes] = await Promise.all([
          fetch(`/api/tickets/${ticketId}`),
          fetch('/api/clientes'),
          fetch('/api/distribuidoras'),
          fetch('/api/pedidos'),
          fetch('/api/tags'),
          fetch('/api/admin-users'),
        ]);

        if (ticketRes.ok) {
          const ticketData = await ticketRes.json();
          const ticketInfo = ticketData.data as Ticket;
          setTicket(ticketInfo);
          setFormData({
            titulo: ticketInfo.titulo,
            descricao: ticketInfo.descricao,
            clienteId: ticketInfo.clienteId,
            distribuidoraId: ticketInfo.distribuidoraId || '',
            pedidoId: ticketInfo.pedidoId || '',
            prioridade: ticketInfo.prioridade,
            status: ticketInfo.status,
          });
          setSelectedTags(ticketInfo.tags || []);
          setSelectedOwners(ticketInfo.owners || []);
          setExistingAttachments(ticketInfo.attachments || []);
        }

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

        if (adminUsersRes.ok) {
          const adminUsersData = await adminUsersRes.json();
          setAdminUsers(adminUsersData.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [ticketId]);

  // Close dropdowns when clicking outside
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
      if (
        ownerDropdownRef.current &&
        !ownerDropdownRef.current.contains(event.target as Node) &&
        ownerInputRef.current &&
        !ownerInputRef.current.contains(event.target as Node)
      ) {
        setIsOwnerDropdownOpen(false);
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
    if (!trimmedInput || trimmedInput.length < 2) return;

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

  // Filter available admin users based on input and exclude already selected
  const filteredOwners = adminUsers.filter(
    (user) =>
      !selectedOwners.some((selected) => selected.id === user.id) &&
      (user.nome.toLowerCase().includes(ownerInput.toLowerCase()) ||
        user.email.toLowerCase().includes(ownerInput.toLowerCase()))
  );

  const handleAddOwner = (user: AdminUser) => {
    if (!selectedOwners.some((o) => o.id === user.id)) {
      setSelectedOwners([
        ...selectedOwners,
        { id: user.id, nome: user.nome, email: user.email },
      ]);
    }
    setOwnerInput('');
    setIsOwnerDropdownOpen(false);
  };

  const handleRemoveOwner = (ownerId: string) => {
    setSelectedOwners(selectedOwners.filter((owner) => owner.id !== ownerId));
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

    setIsSubmitting(true);

    // Get client name
    const selectedClient = clientes.find((c) => c.id === formData.clienteId);
    const selectedDistribuidora = distribuidoras.find((d) => d.id === formData.distribuidoraId);
    const selectedPedido = pedidos.find((p) => p.id === formData.pedidoId);

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clienteNome: selectedClient?.nome,
          distribuidoraNome: selectedDistribuidora?.nome,
          pedidoNumero: selectedPedido?.numero,
          tags: selectedTags,
          owners: selectedOwners,
          attachments: [...existingAttachments, ...getCompletedAttachments()],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Ticket atualizado com sucesso!',
        });
        // Wait a bit before redirecting
        setTimeout(() => {
          router.push(`/tickets/${ticketId}`);
        }, 1500);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Erro ao atualizar ticket',
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
    return <LoadingState />;
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/tickets')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">Ticket não encontrado</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/tickets/${ticketId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editar Ticket</h2>
        <p className="text-gray-500 mt-2">
          Atualize as informações do ticket #{ticketId}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  required
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="assigned">Atribuído</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
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

            {/* Owners Section */}
            <div className="space-y-2">
              <Label htmlFor="owners">Responsáveis (opcional)</Label>
              <div className="space-y-3">
                {/* Selected Owners Display */}
                {selectedOwners.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedOwners.map((owner) => (
                      <span
                        key={owner.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {owner.nome}
                        <button
                          type="button"
                          onClick={() => handleRemoveOwner(owner.id)}
                          className="hover:opacity-70 focus:outline-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Owner Input with Dropdown */}
                <div className="relative">
                  <Input
                    ref={ownerInputRef}
                    id="owners"
                    placeholder="Digite para buscar um responsável..."
                    value={ownerInput}
                    onChange={(e) => {
                      setOwnerInput(e.target.value);
                      setIsOwnerDropdownOpen(true);
                    }}
                    onFocus={() => setIsOwnerDropdownOpen(true)}
                  />

                  {/* Dropdown */}
                  {isOwnerDropdownOpen && (ownerInput.length > 0 || filteredOwners.length > 0) && (
                    <div
                      ref={ownerDropdownRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {/* Filtered admin users */}
                      {filteredOwners.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleAddOwner(user)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{user.nome}</div>
                            <div className="text-xs text-gray-500">{user.email} - {user.cargo}</div>
                          </div>
                        </button>
                      ))}

                      {/* No results message */}
                      {filteredOwners.length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          Nenhum usuário encontrado
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Atribua um ou mais responsáveis para este ticket
                </p>
              </div>
            </div>

            {/* File Attachments Section */}
            <div className="space-y-2">
              <Label>Anexos (opcional)</Label>
              <FileUpload
                existingAttachments={existingAttachments}
                pendingFiles={pendingFiles}
                onFilesSelected={addFiles}
                onRemoveAttachment={handleRemoveExistingAttachment}
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
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/tickets/${ticketId}`)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
