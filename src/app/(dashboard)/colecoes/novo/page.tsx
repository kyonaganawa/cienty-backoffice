'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, XCircle, Package, X } from 'lucide-react';
import { Produto } from '@/lib/mock-data/produtos';

export default function NovaColecaoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    produtoIds: [] as string[],
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await fetch('/api/produtos');
        const data = await response.json();
        setProdutos(data.data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoadingProdutos(false);
      }
    }

    fetchProdutos();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductToggle = (produtoId: string) => {
    setFormData((prev) => {
      const isSelected = prev.produtoIds.includes(produtoId);
      return {
        ...prev,
        produtoIds: isSelected
          ? prev.produtoIds.filter((id) => id !== produtoId)
          : [...prev.produtoIds, produtoId],
      };
    });
  };

  const handleRemoveProduct = (produtoId: string) => {
    setFormData((prev) => ({
      ...prev,
      produtoIds: prev.produtoIds.filter((id) => id !== produtoId),
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      return 'Por favor, informe o nome da coleção';
    }
    if (formData.produtoIds.length === 0) {
      return 'Por favor, selecione pelo menos um produto';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await fetch('/api/colecoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Coleção criada com sucesso!',
        });
        setTimeout(() => {
          router.push('/colecoes');
        }, 1500);
      } else {
        const error = await response.json();
        setSubmitStatus({
          type: 'error',
          message: error.error || 'Erro ao criar coleção',
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

  const getSelectedProdutos = () => {
    return produtos.filter((p) => formData.produtoIds.includes(p.id));
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => router.push('/colecoes')}
        variant="ghost"
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Coleções
      </Button>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova Coleção</h2>
        <p className="text-gray-500 mt-2">
          Crie uma nova coleção e selecione os produtos
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
                  Nome e descrição da coleção
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Eletrônicos Premium"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva a coleção..."
                    value={formData.descricao}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Selecionar Produtos{' '}
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Escolha os produtos que farão parte desta coleção
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProdutos ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Carregando produtos...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {produtos.map((produto) => (
                      <div
                        key={produto.id}
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`produto-${produto.id}`}
                          checked={formData.produtoIds.includes(produto.id)}
                          onCheckedChange={() =>
                            handleProductToggle(produto.id)
                          }
                        />
                        <label
                          htmlFor={`produto-${produto.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{produto.nome}</p>
                              <p className="text-sm text-gray-500">
                                {produto.codigo} • {produto.categoria}
                              </p>
                              <p className="text-sm font-medium text-green-600 mt-1">
                                R$ {produto.preco.toFixed(2)}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                produto.status === 'disponivel'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {produto.status === 'disponivel'
                                ? 'Disponível'
                                : 'Indisponível'}
                            </span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Selected Products */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Selecionados</CardTitle>
                <CardDescription>
                  {formData.produtoIds.length}{' '}
                  {formData.produtoIds.length === 1 ? 'produto' : 'produtos'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.produtoIds.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Nenhum produto selecionado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getSelectedProdutos().map((produto) => (
                      <div
                        key={produto.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {produto.nome}
                          </p>
                          <p className="text-xs text-gray-500">
                            {produto.codigo}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(produto.id)}
                          className="ml-2 h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">Dica</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-gray-700">
                  Organize produtos em coleções para facilitar a navegação e
                  destacar grupos de produtos relacionados.
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
            {isSubmitting ? 'Criando...' : 'Criar Coleção'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/colecoes')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
