'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Globe, User, Briefcase, Award, Shield, Check } from 'lucide-react';
import { useUser, OnboardingData, UserRole, Gender } from '@/context/UserContext';

const COUNTRIES = [
  'Nigeria', 'Philippines', 'India', 'USA', 'UK', 'Canada', 'Australia', 
  'Ghana', 'Kenya', 'South Africa', 'Saudi Arabia', 'UAE', 'Qatar',
  'Singapore', 'Malaysia', 'Japan', 'South Korea', 'Germany', 'France',
  'Spain', 'Italy', 'Brazil', 'Mexico', 'China', 'New Zealand', 'Ireland'
];

const SPECIALIZATIONS = [
  'General Nursing', 'Pediatric Nursing', 'Critical Care', 'Emergency Nursing',
  'Mental Health', 'Oncology', 'Cardiac Care', 'Operating Room',
  'Obstetric Nursing', 'Community Health', 'Rehabilitation', 'Geriatric Care'
];

const LANGUAGES = [
  'English', 'Spanish', 'Filipino', 'Hindi', 'Urdu', 'Arabic', 
  'French', 'Portuguese', 'Chinese', 'Korean', 'Japanese', 'German'
];

interface OnboardingModalProps {
  onComplete?: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { user, completeOnboarding, setShowOnboardingModal } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingData>({
    dateOfBirth: '',
    country: '',
    gender: 'prefer_not_to_say',
    specialization: '',
    yearsOfExperience: undefined,
    institution: '',
    targetCountry: '',
    languages: [],
    regulatorId: '',
    regulatorBody: '',
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await completeOnboarding(formData);
    setIsSubmitting(false);
    onComplete?.();
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages?.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...(prev.languages || []), lang]
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.dateOfBirth && formData.country && formData.gender;
      case 2:
        if (user?.role === 'LICENSED_NURSE' || user?.role === 'NURSE_ADVOCATE') {
          return formData.specialization;
        }
        if (user?.role === 'NURSE_STUDENT') {
          return formData.institution;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  if (!user || user.hasCompletedOnboarding) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        <div className="relative p-6 border-b border-slate-700/50">
          <button
            onClick={() => setShowOnboardingModal(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
              <p className="text-sm text-slate-400">Step {step} of 3 - Help us personalize your experience</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Calendar size={16} className="text-indigo-400" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Globe size={16} className="text-indigo-400" />
                  Country of Residence
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:border-indigo-500/50 outline-none transition-all"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <User size={16} className="text-indigo-400" />
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female', 'other', 'prefer_not_to_say'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                        formData.gender === g
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {g === 'prefer_not_to_say' ? 'Prefer not to say' : g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Globe size={16} className="text-indigo-400" />
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg border transition-all text-sm ${
                        formData.languages?.includes(lang)
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              {(user.role === 'LICENSED_NURSE' || user.role === 'NURSE_ADVOCATE') && (
                <>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Briefcase size={16} className="text-emerald-400" />
                      Area of Specialization
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:border-indigo-500/50 outline-none transition-all"
                    >
                      <option value="">Select specialization</option>
                      {SPECIALIZATIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Award size={16} className="text-emerald-400" />
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsOfExperience || ''}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || undefined })}
                      placeholder="e.g., 5"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {user.role === 'NURSE_STUDENT' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Award size={16} className="text-purple-400" />
                    Institution/School Name
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g., University of Lagos"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 outline-none transition-all"
                  />
                </div>
              )}

              {user.role === 'MIGRATING_NURSE' && (
                <>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Globe size={16} className="text-amber-400" />
                      Target Country
                    </label>
                    <select
                      value={formData.targetCountry}
                      onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:border-indigo-500/50 outline-none transition-all"
                    >
                      <option value="">Select target country</option>
                      {COUNTRIES.filter(c => c !== formData.country).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Shield size={16} className="text-amber-400" />
                      Nursing License Number (if applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber || ''}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="e.g., RN-123456"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {user.role === 'REGULATORY_BODY' && (
                <>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Shield size={16} className="text-violet-400" />
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.regulatorBody}
                      onChange={(e) => setFormData({ ...formData, regulatorBody: e.target.value })}
                      placeholder="e.g., NCSBN, NMC"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Award size={16} className="text-violet-400" />
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.regulatorId}
                      onChange={(e) => setFormData({ ...formData, regulatorId: e.target.value })}
                      placeholder="e.g., REG-2024-001"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 outline-none transition-all"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Shield size={40} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You're All Set!</h3>
                <p className="text-slate-400 text-sm">
                  Complete regulator ID verification to earn your verified badge and unlock full access to all features.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Award size={16} className="text-amber-400" />
                  Verification Benefits
                </h4>
                <ul className="space-y-2">
                  {[
                    'Verified badge on your profile',
                    'Access to exclusive migration pathways',
                    'Connect with verified nurses worldwide',
                    'Priority support from NurseSphere team',
                    'Eligibility for premium features'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-emerald-400 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center text-sm text-slate-500">
                You can complete verification later in your profile settings.
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700/50 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all font-medium"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Completing...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
