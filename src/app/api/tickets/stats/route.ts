import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';

interface GroupCount {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

interface TicketStats {
  total: number;
  byStatus: {
    open: number;
    assigned: number;
    resolved: number;
    closed: number;
  };
  byTag: GroupCount[];
  byClient: GroupCount[];
  byDistributor: GroupCount[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || 'monthly';

  // Calculate date threshold
  const now = new Date();
  const daysAgo = period === 'weekly' ? 7 : 30;
  const threshold = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  // Filter tickets by date
  const filteredTickets = mockTickets.filter((ticket) => {
    const ticketDate = new Date(ticket.dataCriacao);
    return ticketDate >= threshold;
  });

  const total = filteredTickets.length;

  // Count by status
  const byStatus = {
    open: filteredTickets.filter((t) => t.status === 'open').length,
    assigned: filteredTickets.filter((t) => t.status === 'assigned').length,
    resolved: filteredTickets.filter((t) => t.status === 'resolved').length,
    closed: filteredTickets.filter((t) => t.status === 'closed').length,
  };

  // Count by tag
  const tagCounts = new Map<string, { name: string; count: number }>();
  filteredTickets.forEach((ticket) => {
    ticket.tags.forEach((tag) => {
      const existing = tagCounts.get(tag.id);
      if (existing) {
        existing.count++;
      } else {
        tagCounts.set(tag.id, { name: tag.nome, count: 1 });
      }
    });
  });
  const byTag: GroupCount[] = Array.from(tagCounts.entries())
    .map(([id, { name, count }]) => ({
      id,
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Count by client
  const clientCounts = new Map<string, { name: string; count: number }>();
  filteredTickets.forEach((ticket) => {
    const existing = clientCounts.get(ticket.clienteId);
    if (existing) {
      existing.count++;
    } else {
      clientCounts.set(ticket.clienteId, {
        name: ticket.clienteNome,
        count: 1,
      });
    }
  });
  const byClient: GroupCount[] = Array.from(clientCounts.entries())
    .map(([id, { name, count }]) => ({
      id,
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Count by distributor
  const distributorCounts = new Map<string, { name: string; count: number }>();
  filteredTickets.forEach((ticket) => {
    if (ticket.distribuidoraId && ticket.distribuidoraNome) {
      const existing = distributorCounts.get(ticket.distribuidoraId);
      if (existing) {
        existing.count++;
      } else {
        distributorCounts.set(ticket.distribuidoraId, {
          name: ticket.distribuidoraNome,
          count: 1,
        });
      }
    }
  });
  const byDistributor: GroupCount[] = Array.from(distributorCounts.entries())
    .map(([id, { name, count }]) => ({
      id,
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const stats: TicketStats = {
    total,
    byStatus,
    byTag,
    byClient,
    byDistributor,
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json({
    success: true,
    data: stats,
    period,
  });
}
