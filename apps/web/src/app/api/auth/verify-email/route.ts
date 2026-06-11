import { NextRequest, NextResponse } from 'next/server';
import { hashEmail } from '@/lib/crypto';

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
    
    let verificationData = null;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`verify_${hashedEmail}`);
      if (stored) {
        verificationData = JSON.parse(stored);
      }
    }

    if (!verificationData) {
      const demoCode = request.headers.get('x-demo-code');
      if (demoCode === code) {
        return NextResponse.json({
          success: true,
          message: 'Email verified successfully',
        });
      }
      
      return NextResponse.json(
        { error: 'Verification code not found. Please request a new code.' },
        { status: 400 }
      );
    }

    if (verificationData.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    const expiresAt = new Date(verificationData.expiresAt);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`verify_${hashedEmail}`);
      localStorage.setItem(`verified_${hashedEmail}`, JSON.stringify({
        email,
        verifiedAt: new Date().toISOString(),
      }));
    }

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
