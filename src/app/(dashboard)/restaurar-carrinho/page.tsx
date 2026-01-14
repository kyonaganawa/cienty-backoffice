'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader, LoadingState } from '@/components/common';
import {
  ShoppingCart,
  Package,
  Calendar,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  User,
} from 'lucide-react';
import { Carrinho } from '@/lib/mock-data/carrinhos';

interface Cliente {
  id: string;
  empresa: string;
  usuarios?: User[];
}

interface User {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
}

export default function RestaurarCarrinhoPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>('');
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>('');
  const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
  const [carrinhoAtivo, setCarrinhoAtivo] = useState<Carrinho | null>(null);
  const [carrinhosArquivados, setCarrinhosArquivados] = useState<Carrinho[]>(
    []
  );
  const [isLoadingClientes, setIsLoadingClientes] = useState(true);
  const [isLoadingCarrinhos, setIsLoadingCarrinhos] = useState(false);
  const [carrinhoParaRestaurar, setCarrinhoParaRestaurar] =
    useState<Carrinho | null>(null);
  const [carrinhoParaVisualizar, setCarrinhoParaVisualizar] =
    useState<Carrinho | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await fetch('/api/clientes');
        const data = await response.json();
        setClientes(data.data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setIsLoadingClientes(false);
      }
    }

    fetchClientes();
  }, []);

  useEffect(() => {
    if (clienteSelecionado) {
      const cliente = clientes.find((c) => c.id === clienteSelecionado);
      setClienteAtual(cliente || null);

      if (cliente?.usuarios) {
        setUsuarios(cliente.usuarios);

        // Auto-select if only one user
        if (cliente.usuarios.length === 1) {
          setUsuarioSelecionado(cliente.usuarios[0].id);
        } else {
          setUsuarioSelecionado('');
          // Clear carts when switching clients with multiple users
          setCarrinhos([]);
          setCarrinhoAtivo(null);
          setCarrinhosArquivados([]);
        }
      }
    } else {
      setClienteAtual(null);
      setUsuarios([]);
      setUsuarioSelecionado('');
      setCarrinhos([]);
      setCarrinhoAtivo(null);
      setCarrinhosArquivados([]);
    }
  }, [clienteSelecionado, clientes]);

  useEffect(() => {
    if (clienteSelecionado && usuarioSelecionado) {
      fetchCarrinhos();
    }
  }, [usuarioSelecionado]);

  async function fetchCarrinhos() {
    if (!clienteSelecionado || !usuarioSelecionado) {return;}

    setIsLoadingCarrinhos(true);
    setRestoreStatus({ type: null, message: '' });
    try {
      const response = await fetch(
        `/api/carrinhos/cliente/${clienteSelecionado}?userId=${usuarioSelecionado}`
      );
      const data = await response.json();
      setCarrinhos(data.data);

      const ativo = data.data.find((c: Carrinho) => c.status === 'ativo');
      const arquivados = data.data.filter(
        (c: Carrinho) => c.status === 'arquivado'
      );

      setCarrinhoAtivo(ativo || null);
      setCarrinhosArquivados(arquivados);
    } catch (error) {
      console.error('Erro ao carregar carrinhos:', error);
    } finally {
      setIsLoadingCarrinhos(false);
    }
  }

  const handleRestaurarCarrinho = async () => {
    if (!carrinhoParaRestaurar) {return;}

    setIsRestoring(true);
    setRestoreStatus({ type: null, message: '' });

    try {
      const response = await fetch(
        `/api/carrinhos/${carrinhoParaRestaurar.id}/restore`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        setRestoreStatus({
          type: 'success',
          message: 'Carrinho restaurado com sucesso!',
        });
        // Refresh carts
        await fetchCarrinhos();
        setCarrinhoParaRestaurar(null);
      } else {
        const error = await response.json();
        setRestoreStatus({
          type: 'error',
          message: error.error || 'Erro ao restaurar carrinho',
        });
      }
    } catch (error) {
      setRestoreStatus({
        type: 'error',
        message: 'Erro ao conectar com o servidor',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const showUserSelection = usuarios.length > 1;
  const showCarts = usuarioSelecionado && !isLoadingCarrinhos;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restaurar Carrinho de Compras"
        description="Selecione um cliente e usuário para visualizar e restaurar carrinhos anteriores"
      />

      {/* Client and User Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Cliente e Usuário</CardTitle>
          <CardDescription>
            Escolha o cliente e o usuário para visualizar os carrinhos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              {isLoadingClientes ? (
                <p className="text-sm text-gray-500">Carregando clientes...</p>
              ) : (
                <Select
                  value={clienteSelecionado}
                  onValueChange={setClienteSelecionado}
                >
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* User Selection - Only show if multiple users */}
            {showUserSelection && (
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <Select
                  value={usuarioSelecionado}
                  onValueChange={setUsuarioSelecionado}
                >
                  <SelectTrigger id="usuario">
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <p className="font-medium">{usuario.nome}</p>
                            {usuario.cargo && (
                              <p className="text-xs text-gray-500">
                                {usuario.cargo}
                              </p>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Auto-selected user info */}
            {!showUserSelection && usuarios.length === 1 && (
              <div className="space-y-2">
                <Label>Usuário (selecionado automaticamente)</Label>
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{usuarios[0].nome}</p>
                    {usuarios[0].cargo && (
                      <p className="text-xs text-gray-500">
                        {usuarios[0].cargo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Message */}
      {restoreStatus.type && (
        <Alert
          className={
            restoreStatus.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }
        >
          {restoreStatus.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={
              restoreStatus.type === 'success'
                ? 'text-green-800'
                : 'text-red-800'
            }
          >
            {restoreStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoadingCarrinhos && <LoadingState message="Carregando carrinhos..." />}

      {/* Active Cart */}
      {showCarts && carrinhoAtivo && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-900">Carrinho Ativo</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Este é o carrinho atualmente ativo do usuário{' '}
              <strong>{carrinhoAtivo.userNome}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-700">Total de Itens</p>
                  <p className="text-2xl font-bold text-green-900">
                    {carrinhoAtivo.totalItens}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Valor Total</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(carrinhoAtivo.valorTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Última Modificação</p>
                  <p className="text-sm font-medium text-green-900" suppressHydrationWarning>
                    {formatDate(carrinhoAtivo.dataUltimaModificacao)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-green-900 mb-2">
                  Produtos no Carrinho:
                </p>
                <div className="space-y-2">
                  {carrinhoAtivo.itens.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-white rounded border border-green-200"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {item.produtoNome}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.produtoCodigo} • Qtd: {item.quantidade}
                        </p>
                      </div>
                      <p className="font-medium text-sm">
                        {formatCurrency(item.precoTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Cart */}
      {showCarts &&
        !carrinhoAtivo &&
        carrinhosArquivados.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este usuário não possui um carrinho ativo no momento.
            </AlertDescription>
          </Alert>
        )}

      {/* No Archived Carts to Restore */}
      {showCarts && carrinhosArquivados.length === 0 && carrinhos.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                Não há carrinho para restaurar
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Este usuário não possui carrinhos arquivados disponíveis para restauração
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archived Carts */}
      {showCarts && carrinhosArquivados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Carrinhos Disponíveis para Restauração (
              {carrinhosArquivados.length})
            </CardTitle>
            <CardDescription>
              Selecione um carrinho para restaurar e torná-lo ativo para{' '}
              <strong>
                {usuarios.find((u) => u.id === usuarioSelecionado)?.nome}
              </strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Criado Em</TableHead>
                  <TableHead>Última Modificação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrinhosArquivados.map((carrinho) => (
                  <TableRow
                    key={carrinho.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setCarrinhoParaVisualizar(carrinho)}
                  >
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        #{carrinho.id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {carrinho.totalItens}
                        </span>
                        <span className="text-sm text-gray-500">
                          {carrinho.totalItens === 1 ? 'item' : 'itens'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(carrinho.valorTotal)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600" suppressHydrationWarning>
                        <Calendar className="w-4 h-4" />
                        {formatDate(carrinho.dataCriacao)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600" suppressHydrationWarning>
                        {formatDate(carrinho.dataUltimaModificacao)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCarrinhoParaRestaurar(carrinho);
                        }}
                        className="gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restaurar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* No Carts Found */}
      {showCarts && carrinhos.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Nenhum carrinho encontrado para este usuário
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cart Details Dialog */}
      {carrinhoParaVisualizar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setCarrinhoParaVisualizar(null)}
        >
          <Card
            className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Detalhes do Carrinho
              </CardTitle>
              <CardDescription>
                Informações completas sobre o carrinho selecionado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              {/* Cart Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">ID do Carrinho</p>
                  <code className="text-sm bg-white px-2 py-1 rounded border">
                    #{carrinhoParaVisualizar.id}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Usuário</p>
                  <p className="text-sm font-medium">
                    {carrinhoParaVisualizar.userNome}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total de Itens</p>
                  <p className="text-lg font-bold text-blue-600">
                    {carrinhoParaVisualizar.totalItens}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Valor Total</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(carrinhoParaVisualizar.valorTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Criado em</p>
                  <p className="text-sm">
                    {formatDate(carrinhoParaVisualizar.dataCriacao)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Última Modificação
                  </p>
                  <p className="text-sm">
                    {formatDate(carrinhoParaVisualizar.dataUltimaModificacao)}
                  </p>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Produtos no Carrinho</h3>
                </div>
                <div className="space-y-2">
                  {carrinhoParaVisualizar.itens.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {item.produtoNome}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Código: {item.produtoCodigo}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-green-600">
                            {formatCurrency(item.precoTotal)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-xs text-gray-500">Quantidade:</span>{' '}
                            <span className="font-medium">{item.quantidade}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Preço Unit.:</span>{' '}
                            <span className="font-medium">
                              {formatCurrency(item.precoUnitario)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setCarrinhoParaVisualizar(null);
                    setCarrinhoParaRestaurar(carrinhoParaVisualizar);
                  }}
                  className="flex-1 gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Este Carrinho
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCarrinhoParaVisualizar(null)}
                >
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Dialog */}
      {carrinhoParaRestaurar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>Confirmar Restauração</CardTitle>
              <CardDescription>
                Tem certeza que deseja restaurar este carrinho?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  O carrinho atual de{' '}
                  <strong>{carrinhoParaRestaurar.userNome}</strong> será
                  arquivado e este carrinho se tornará o carrinho ativo.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <p className="text-sm font-medium">Detalhes do Carrinho:</p>
                <div className="p-3 bg-gray-50 rounded space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">ID:</span> #
                    {carrinhoParaRestaurar.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Usuário:</span>{' '}
                    {carrinhoParaRestaurar.userNome}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total de Itens:</span>{' '}
                    {carrinhoParaRestaurar.totalItens}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Valor Total:</span>{' '}
                    {formatCurrency(carrinhoParaRestaurar.valorTotal)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Criado em:</span>{' '}
                    {formatDate(carrinhoParaRestaurar.dataCriacao)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleRestaurarCarrinho}
                  disabled={isRestoring}
                  className="flex-1"
                >
                  {isRestoring ? 'Restaurando...' : 'Confirmar Restauração'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCarrinhoParaRestaurar(null)}
                  disabled={isRestoring}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
