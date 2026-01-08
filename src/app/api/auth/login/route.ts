import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'admin@backoffice.com',
    password: 'admin123',
    name: 'Admin User',
  },
  {
    id: '2',
    email: 'user@backoffice.com',
    password: 'user123',
    name: 'Regular User',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication - find user
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token: 'mock-jwt-token',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
