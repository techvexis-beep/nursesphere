'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Eye, EyeOff, ChevronRight, Loader2, Shield, GraduationCap, Plane, Building2, Scale } from 'lucide-react';
import NurseSphereLogo from '@/components/NurseSphereLogo';
import { Button } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { Input } from '@/components/ui';

const roles = [
  { value: 'NURSE_STUDENT', label: 'Nursing Student', icon: GraduationCap, description: 'Currently enrolled in a nursing program' },
  { value: 'LICENSED_NURSE', label: 'Licensed Nurse', icon: Shield, description: 'Currently licensed to practice nursing' },
  { value: 'MIGRATING_NURSE', label: 'Migrating Nurse', icon: Plane, description: 'Planning to work abroad as a nurse' },
  { value: 'REGULATORY_BODY', label: 'Regulatory Body', icon: Building2, description: 'Nursing board or regulatory organization' },
  { value: 'NURSE_ADVOCATE', label: 'Nurse Advocate', icon: Scale, description: 'Advocate for nursing rights and welfare' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role || 'NURSE_STUDENT',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/login?registered=true');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword && formData.agreeTerms;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <NurseSphereLogo size={32} animated={false} />
            </div>
            <span className="font-semibold text-foreground text-xl">NurseSphere</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Join thousands of nurses worldwide</p>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Account' : s === 2 ? 'Role' : 'Verify'}
                </span>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Create a strong password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm your password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{' '}
                      <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  <Button
                    type="button"
                    onClick={() => canProceedStep1 && setStep(2)}
                    disabled={!canProceedStep1}
                    className="w-full"
                  >
                    Continue to Role Selection
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Role Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <p className="text-muted-foreground mb-6">Select your role to help us customize your experience</p>

                  <div className="space-y-3 mb-6">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = formData.role === role.value;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: role.value })}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                            <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{role.label}</div>
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => formData.role && setStep(3)}
                      disabled={!formData.role}
                      className="flex-1"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Verification */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="p-4 rounded-xl bg-muted border border-border mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Account Verification</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your account will be pending verification. We&apos;ll notify you once approved.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <NurseSphereLogo size={120} animated={true} />

          <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">
            Join the Community
          </h2>
          <p className="text-muted-foreground mb-8">
            Connect with nurses from around the world, track your career progress, and access exclusive resources.
          </p>

          <div className="space-y-4">
            {[
              { icon: GraduationCap, title: 'CBT Exam Platform', desc: 'Practice with AI-adaptive tests' },
              { icon: Plane, title: 'Migration Tracker', desc: 'NCLEX, IELTS, Visa & credentials' },
              { icon: Shield, title: 'Verified Credentials', desc: 'Secure document verification' },
            ].map((feature, i) => (
              <div key={i} className="p-5 rounded-xl bg-card border border-border text-left">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">{feature.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-border">
            {[
              { value: '50K+', label: 'Users' },
              { value: '120+', label: 'Countries' },
              { value: '95%', label: 'Pass Rate' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
