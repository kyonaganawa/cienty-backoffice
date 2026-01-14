import { NextResponse } from 'next/server';
import { mockAdminUsers } from '@/lib/mock-data/admin-users';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return only active users by default
  const activeUsers = mockAdminUsers.filter((user) => user.ativo);

  return NextResponse.json({
    data: activeUsers,
    total: activeUsers.length,
  });
}
