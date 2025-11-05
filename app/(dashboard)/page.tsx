'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Building2, Package, Ticket, Store, Clock, AlertTriangle, MessageSquare, Layers } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const menuItems = [
  {
    title: 'Clientes',
    description: 'Gerencie os clientes do sistema',
    href: '/clientes',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Distribuidoras',
    description: 'Gerencie as distribuidoras cadastradas',
    href: '/distribuidoras',
    icon: Building2,
    color: 'bg-green-500',
  },
  {
    title: 'Produtos',
    description: 'Gerencie o catálogo de produtos',
    href: '/produtos',
    icon: Package,
    color: 'bg-purple-500',
  },
  {
    title: 'Tickets',
    description: 'Gerencie tickets de suporte',
    href: '/tickets',
    icon: Ticket,
    color: 'bg-orange-500',
  },
  {
    title: 'Multilojas',
    description: 'Vincule clientes a múltiplas lojas',
    href: '/multilojas',
    icon: Store,
    color: 'bg-pink-500',
  },
  {
    title: 'Jobs',
    description: 'Acompanhe a execução de jobs',
    href: '/jobs',
    icon: Clock,
    color: 'bg-cyan-500',
  },
  {
    title: 'Coleções',
    description: 'Organize produtos em coleções',
    href: '/colecoes',
    icon: Layers,
    color: 'bg-teal-500',
  },
  {
    title: 'Comunicações',
    description: 'Gerencie mensagens e anúncios',
    href: '/comunicacoes',
    icon: MessageSquare,
    color: 'bg-indigo-500',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-500 mt-2">
          Bem-vindo ao sistema de gerenciamento
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          Nova SD está indisponível até dia 22/10
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-blue-600 hover:text-blue-800">
                    Acessar →
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
