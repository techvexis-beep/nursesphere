import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createHash } from 'crypto';

function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase()).digest('hex');
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const verificationStore = new Map<string, { code: string; expiresAt: number }>();

function getEmailConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'NurseSphere <noreply@nursphere.com>',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const code = generateVerificationCode();
    const hashedEmail = hashEmail(email);

    verificationStore.set(hashedEmail, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    const config = getEmailConfig();
    
    if (!config.user || !config.pass || config.user === 'your-email@gmail.com') {
      console.log('EMAIL (Demo Mode - No SMTP Config)');
      console.log('To:', email);
      console.log('Code:', code);
      
      return NextResponse.json({
        success: true,
        message: 'Verification code generated (demo mode)',
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass,
        },
        connectionTimeout: 15000,
        socketTimeout: 15000,
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; margin: 0; padding: 40px; }
            .container { max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
            .code-box { background: rgba(99, 102, 241, 0.2); border: 2px solid rgba(139, 92, 246, 0.5); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
            .code { color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace; }
            .warning { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px; text-align: center; margin: 16px 0; }
            .warning p { color: #fbbf24; margin: 0; font-size: 14px; }
            p { color: #94a3b8; line-height: 1.6; }
            .footer { border-top: 1px solid #334155; padding-top: 16px; margin-top: 24px; text-align: center; }
            .footer p { color: #64748b; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NurseSphere</h1>
              <p>Verify Your Email Address</p>
            </div>
            <p>Hello <strong style="color: white;">${name.split(' ')[0]}</strong>,</p>
            <p>Thank you for joining NurseSphere! Please verify your email address to activate your account.</p>
            <div class="code-box">
              <p style="color: #a5b4fc; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Your Verification Code</p>
              <p class="code">${code}</p>
            </div>
            <div class="warning">
              <p>This code expires in 15 minutes</p>
            </div>
            <p style="font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
            <div class="footer">
              <p>Powered by <strong style="color: #a5b4fc;">NurseSphere</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: config.from,
        to: email,
        subject: 'Verify your NurseSphere email',
        html: htmlContent,
      });

      console.log('Verification email sent to:', email);

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
      });

    } catch (smtpError: any) {
      console.error('SMTP Error:', smtpError.message);
      
      return NextResponse.json({
        success: true,
        message: 'Verification code generated',
        warning: 'Email service unavailable',
      });
    }

  } catch (error: any) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
