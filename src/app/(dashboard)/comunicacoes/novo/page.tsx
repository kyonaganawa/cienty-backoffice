'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function NovaComunicacaoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    texto: '',
    tipo: 'popup' as 'popup' | 'banner' | 'topbar',
    dataInicio: '',
    dataFim: '',
    imagem: '',
    linkAcao: '',
    frequenciaHoras: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'agendado',
    prioridade: 'media' as 'baixa' | 'media' | 'alta',
    alvo: 'todos' as 'todos' | 'novos_usuarios' | 'usuarios_ativos' | 'usuarios_inativos',
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.titulo.trim()) {
      return 'Por favor, informe o título da comunicação';
    }
    if (!formData.texto.trim()) {
      return 'Por favor, informe o texto da comunicação';
    }
    if (!formData.dataInicio) {
      return 'Por favor, informe a data de início';
    }
    if (!formData.dataFim) {
      return 'Por favor, informe a data de término';
    }
    if (new Date(formData.dataFim) < new Date(formData.dataInicio)) {
      return 'A data de término deve ser posterior à data de início';
    }
    if (formData.tipo === 'popup' && !formData.frequenciaHoras) {
      return 'Por favor, informe a frequência de exibição do popup';
    }
    if (formData.tipo === 'popup' && formData.frequenciaHoras) {
      const freq = parseInt(formData.frequenciaHoras);
      if (isNaN(freq) || freq <= 0) {
        return 'A frequência deve ser um número positivo';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({
        type: 'error',
        message: validationError,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/comunicacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Comunicação criada com sucesso!',
        });
        // Redirect after delay
        setTimeout(() => {
          router.push('/comunicacoes');
        }, 1500);
      } else {
        const error = await response.json();
        setSubmitStatus({
          type: 'error',
          message: error.error || 'Erro ao criar comunicação',
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => router.push('/comunicacoes')}
        variant="ghost"
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Comunicações
      </Button>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova Comunicação</h2>
        <p className="text-gray-500 mt-2">
          Crie uma nova mensagem ou anúncio para seus usuários
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Título e conteúdo da comunicação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">
                    Título <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Novidades no Sistema"
                    value={formData.titulo}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="texto">
                    Texto <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="texto"
                    placeholder="Digite o conteúdo da mensagem..."
                    value={formData.texto}
                    onChange={(e) => handleChange('texto', e.target.value)}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formData.texto.length} caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkAcao">Link de Ação (opcional)</Label>
                  <Input
                    id="linkAcao"
                    type="url"
                    placeholder="https://exemplo.com ou /pagina"
                    value={formData.linkAcao}
                    onChange={(e) => handleChange('linkAcao', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    URL externa ou caminho interno para redirecionar ao clicar
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Visual Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Visuais</CardTitle>
                <CardDescription>
                  Tipo e imagem da comunicação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">
                    Tipo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => handleChange('tipo', value)}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popup">
                        Pop-up - Modal centralizado
                      </SelectItem>
                      <SelectItem value="banner">
                        Banner - Imagem grande destacada
                      </SelectItem>
                      <SelectItem value="topbar">
                        Topbar - Barra no topo da página
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Frequency field - only for popup type */}
                {formData.tipo === 'popup' && (
                  <div className="space-y-2">
                    <Label htmlFor="frequenciaHoras">
                      Frequência de Exibição (horas){' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="frequenciaHoras"
                      type="number"
                      min="1"
                      placeholder="Ex: 24"
                      value={formData.frequenciaHoras}
                      onChange={(e) =>
                        handleChange('frequenciaHoras', e.target.value)
                      }
                      required={formData.tipo === 'popup'}
                    />
                    <p className="text-xs text-gray-500">
                      Intervalo em horas para o pop-up ser exibido novamente ao
                      mesmo usuário
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="imagem">URL da Imagem (opcional)</Label>
                  <Input
                    id="imagem"
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={formData.imagem}
                    onChange={(e) => handleChange('imagem', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Recomendado para pop-ups e banners
                  </p>
                </div>

                {formData.imagem && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={formData.imagem}
                      alt="Preview"
                      className="w-full max-h-48 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/600x400/e5e7eb/6b7280?text=Imagem+não+encontrada';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Period Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Período de Exibição</CardTitle>
                <CardDescription>
                  Quando a comunicação será exibida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">
                      Data de Início <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dataInicio"
                      type="datetime-local"
                      value={formData.dataInicio}
                      onChange={(e) =>
                        handleChange('dataInicio', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataFim">
                      Data de Término <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dataFim"
                      type="datetime-local"
                      value={formData.dataFim}
                      onChange={(e) => handleChange('dataFim', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="agendado">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={formData.prioridade}
                    onValueChange={(value) => handleChange('prioridade', value)}
                  >
                    <SelectTrigger id="prioridade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alvo">Público-Alvo</Label>
                  <Select
                    value={formData.alvo}
                    onValueChange={(value) => handleChange('alvo', value)}
                  >
                    <SelectTrigger id="alvo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Usuários</SelectItem>
                      <SelectItem value="novos_usuarios">
                        Novos Usuários
                      </SelectItem>
                      <SelectItem value="usuarios_ativos">
                        Usuários Ativos
                      </SelectItem>
                      <SelectItem value="usuarios_inativos">
                        Usuários Inativos
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-gray-700">
                  <strong>Pop-up:</strong> Ideal para anúncios importantes que
                  exigem atenção imediata
                </p>
                <p className="text-gray-700">
                  <strong>Banner:</strong> Perfeito para promoções e campanhas
                  visuais
                </p>
                <p className="text-gray-700">
                  <strong>Topbar:</strong> Melhor para avisos discretos e
                  informativos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Status */}
        {submitStatus.type && (
          <Alert
            className={`mt-6 ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                submitStatus.type === 'success'
                  ? 'text-green-800'
                  : 'text-red-800'
              }
            >
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-none"
          >
            {isSubmitting ? 'Criando...' : 'Criar Comunicação'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/comunicacoes')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
