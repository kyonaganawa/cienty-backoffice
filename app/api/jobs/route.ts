import { NextResponse } from 'next/server';
import { mockJobs } from '@/lib/mock-data/jobs';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockJobs,
    total: mockJobs.length,
  });
}
