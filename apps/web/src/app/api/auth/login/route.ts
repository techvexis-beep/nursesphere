import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nursesphere-jwt-secret';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const emailMatch = rawBody.match(/"email"\s*:\s*"([^"]+)"/);
    const passwordMatch = rawBody.match(/"password"\s*:\s*"([^"]+)"/);
    const email = emailMatch?.[1];
    const password = passwordMatch?.[1];

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    let rawBody = '';
    try { rawBody = await (error as any)?.request?.text?.() || ''; } catch {}
    return NextResponse.json(
      {
        message: 'Login failed',
        detail: error?.message,
        name: error?.name,
      },
      { status: 500 }
    );
  }
}
