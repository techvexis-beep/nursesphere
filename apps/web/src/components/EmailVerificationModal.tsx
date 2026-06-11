'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Shield, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface EmailVerificationModalProps {
  onVerified?: () => void;
}

export default function EmailVerificationModal({ onVerified }: EmailVerificationModalProps) {
  const { user, verifyEmail, sendVerificationCode, setShowVerifyEmailModal } = useUser();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs: HTMLInputElement[] = [];

  useEffect(() => {
    if (user && !user.verificationCode) {
      sendVerificationCode();
    }
  }, [user, sendVerificationCode]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6 - index).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
          setCode(newCode);
        }
      });
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs[nextIndex]?.focus();
      if (index + digits.length >= 6) {
        handleVerify(newCode.join(''));
      }
      return;
    }

    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs[index + 1]?.focus();
      }

      if (newCode.every(d => d) && newCode.join('').length === 6) {
        handleVerify(newCode.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    pasted.split('').forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setCode(newCode);
    if (pasted.length >= 6) {
      handleVerify(pasted);
    } else {
      inputRefs[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    if (codeToVerify.length !== 6) return;

    setIsVerifying(true);
    setError('');

    const isValid = await verifyEmail(codeToVerify);

    if (isValid) {
      setSuccess(true);
      setTimeout(() => {
        onVerified?.();
      }, 1500);
    } else {
      setError('Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs[0]?.focus();
    }

    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setError('');
    await sendVerificationCode();
    setCountdown(60);
    setIsResending(false);
  };

  if (!user || user.isEmailVerified) return null;

  const maskedEmail = user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        <div className="relative p-8 text-center">
          <button
            onClick={() => setShowVerifyEmailModal(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>

          {success ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="py-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Check size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-slate-400">You now have full access to NurseSphere.</p>
            </motion.div>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Mail size={40} className="text-indigo-400" />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Secure Verification</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-slate-400 mb-2">
                Enter the 6-digit code sent to
              </p>
              <p className="text-indigo-400 font-medium mb-3">{maskedEmail}</p>
              
              {user.verificationCode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40"
                >
                  <p className="text-xs text-amber-400 font-medium mb-2 text-center flex items-center justify-center gap-1">
                    <AlertCircle size={12} />
                    Demo Mode - Enter this code:
                  </p>
                  <p className="text-3xl font-bold text-white text-center tracking-widest font-mono">
                    {user.verificationCode}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    For real emails, configure SMTP in .env.local
                  </p>
                </motion.div>
              )}

              <div 
                className="flex justify-center gap-2 mb-4"
                onPaste={handlePaste}
              >
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { if (el) inputRefs[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isVerifying}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl bg-slate-900/50 border transition-all outline-none ${
                      error
                        ? 'border-red-500/50 focus:border-red-500 text-red-400'
                        : 'border-slate-700/50 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-white'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mb-4 text-red-400 text-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              <button
                onClick={() => handleVerify()}
                disabled={isVerifying || code.join('').length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="text-center">
                <p className="text-slate-500 text-sm mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="text-indigo-400 hover:text-indigo-300 font-medium text-sm disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </span>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
