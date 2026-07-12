import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase()).digest('hex');
}

const verificationStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }

    const hashedEmail = hashEmail(email);
    const stored = verificationStore.get(hashedEmail);

    if (!stored) {
      return NextResponse.json(
        { error: 'Verification code not found. Please request a new code.' },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      verificationStore.delete(hashedEmail);
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    verificationStore.delete(hashedEmail);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });

  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
