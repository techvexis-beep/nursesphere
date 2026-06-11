import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'NurseSphere <noreply@nursphere.com>';

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, secure, auth: { user, pass }, from };
}

export async function createTransporter() {
  const config = getEmailConfig();
  
  if (!config) {
    console.warn('Email configuration not found. Emails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  });
}

interface SendVerificationEmailParams {
  to: string;
  name: string;
  code: string;
}

export async function sendVerificationEmail({ to, name, code }: SendVerificationEmailParams): Promise<{ success: boolean; error?: string }> {
  const config = getEmailConfig();
  
  const htmlContent = `
<!DOCTYPE html>
<html style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
  <div style="max-width: 480px; margin: 20px; background: rgba(30, 41, 59, 0.95); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); padding: 40px 32px; text-align: center;">
      <div style="display: inline-block; width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 16px; margin-bottom: 16px;">
        <svg width="64" height="64" viewBox="0 0 100 100">
          <path d="M25 55 Q25 35 50 32 Q75 35 75 55 L75 60 Q75 65 50 68 Q25 65 25 60 Z" fill="white" opacity="0.9"/>
          <rect x="46" y="40" width="8" height="22" rx="2" fill="white"/>
          <rect x="39" y="47" width="22" height="8" rx="2" fill="white"/>
        </svg>
      </div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">NurseSphere</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Verify Your Email Address</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 32px;">
      <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Hello <strong style="color: white;">${name}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 32px;">
        Thank you for joining NurseSphere! Please verify your email address to activate your account and unlock all features.
      </p>
      
      <!-- Code Box -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%); border: 2px solid rgba(139, 92, 246, 0.5); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <p style="color: #a5b4fc; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px;">Your Verification Code</p>
        <p style="color: white; font-size: 36px; font-weight: 700; letter-spacing: 8px; margin: 0; font-family: monospace;">${code}</p>
      </div>
      
      <!-- Expiry Notice -->
      <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #fbbf24; font-size: 13px; margin: 0; text-align: center;">
          ⏱️ This code expires in <strong>15 minutes</strong>
        </p>
      </div>
      
      <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0 0 24px;">
        If you didn't create an account on NurseSphere, you can safely ignore this email.
      </p>
      
      <!-- Footer -->
      <div style="border-top: 1px solid rgba(148, 163, 184, 0.2); padding-top: 24px;">
        <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
          Powered by <strong style="color: #a5b4fc;">NurseSphere</strong><br>
          Revolutionizing Global Nursing
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
NurseSphere - Email Verification

Hello ${name},

Thank you for joining NurseSphere! Please verify your email address.

Your verification code: ${code}

This code expires in 15 minutes.

If you didn't create an account, please ignore this email.

---
Powered by NurseSphere
Revolutionizing Global Nursing
`;

  // If no config, log and return demo mode
  if (!config) {
    console.log('📧 EMAIL (Demo Mode)');
    console.log('To:', to);
    console.log('Subject: Verify your NurseSphere email');
    console.log('Code:', code);
    console.log('Full HTML would be sent in production.');
    return { success: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });

    await transporter.sendMail({
      from: config.from,
      to,
      subject: 'Verify your NurseSphere email',
      text: textContent,
      html: htmlContent,
    });

    console.log('✅ Verification email sent to:', to);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message);
    return { success: false, error: error.message };
  }
}

interface SendWelcomeEmailParams {
  to: string;
  name: string;
  role: string;
}

export async function sendWelcomeEmail({ to, name, role }: SendWelcomeEmailParams): Promise<{ success: boolean; error?: string }> {
  const config = getEmailConfig();

  const roleDisplay = {
    LICENSED_NURSE: 'Registered Nurse',
    NURSE_STUDENT: 'Student Nurse',
    MIGRATING_NURSE: 'Migrating Nurse',
    REGULATORY_BODY: 'Regulatory Body',
    NURSE_ADVOCATE: 'Nurse Advocate',
  }[role] || role;

  const htmlContent = `
<!DOCTYPE html>
<html style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
  <div style="max-width: 480px; margin: 20px; background: rgba(30, 41, 59, 0.95); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
    
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 32px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Welcome to NurseSphere!</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Your account is now verified</p>
    </div>
    
    <div style="padding: 40px 32px;">
      <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Hello <strong style="color: white;">${name}</strong>!
      </p>
      
      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%); border: 2px solid rgba(16, 185, 129, 0.5); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <p style="color: #6ee7b7; font-size: 14px; margin: 0 0 8px; text-align: center;">You are now verified as a</p>
        <p style="color: white; font-size: 20px; font-weight: 700; margin: 0; text-align: center;">${roleDisplay}</p>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        You now have full access to all NurseSphere features including:
      </p>
      
      <ul style="color: #e2e8f0; font-size: 14px; line-height: 2; margin: 0 0 32px; padding-left: 24px;">
        <li>AI-powered study tools</li>
        <li>Migration pathway tracking</li>
        <li>NCLEX preparation resources</li>
        <li>Global nursing community</li>
        <li>Job opportunities worldwide</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">Get Started →</a>
      </div>
      
      <div style="border-top: 1px solid rgba(148, 163, 184, 0.2); padding-top: 24px; margin-top: 32px;">
        <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
          Powered by <strong style="color: #a5b4fc;">NurseSphere</strong><br>
          Revolutionizing Global Nursing
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  if (!config) {
    console.log('📧 WELCOME EMAIL (Demo Mode)');
    console.log('To:', to);
    console.log('Subject: Welcome to NurseSphere!');
    return { success: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });

    await transporter.sendMail({
      from: config.from,
      to,
      subject: 'Welcome to NurseSphere! 🎉',
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
