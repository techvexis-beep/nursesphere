'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Upload, FileText, CheckCircle, Clock, AlertCircle, 
  Loader2, X, ChevronRight, Award, Building, User, Calendar,
  Globe, Lock, Eye, Download, Trash2, Sparkles, CreditCard,
  Zap, Star, Crown
} from 'lucide-react';
import { useUser, Notification, VERIFICATION_FEES } from '@/context/UserContext';

interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  file?: File;
  url?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

interface RegulatorInfo {
  body: string;
  licenseNumber: string;
  expirationDate: string;
}

const REGULATORY_BODIES: Record<string, { name: string; country: string; website: string }> = {
  NCSBN: { name: 'National Council of State Boards of Nursing', country: 'USA', website: 'ncsbn.org' },
  NMC: { name: 'Nursing and Midwifery Council', country: 'UK', website: 'nmc.org.uk' },
  AHPRA: { name: 'Australian Health Practitioner Regulation Agency', country: 'Australia', website: 'ahpra.gov.au' },
  SRNA: { name: 'Saskatchewan Registered Nurses Association', country: 'Canada', website: 'srna.org' },
  BRN: { name: 'Board of Registered Nursing', country: 'California, USA', website: 'rn.ca.gov' },
  NCLEX: { name: 'NCLEX Examination', country: 'International', website: 'ncsbn.org/nclex' },
  PRC: { name: 'Professional Regulation Commission', country: 'Philippines', website: 'prc.gov.ph' },
  NNA: { name: 'Nursing and Midwifery Council of Nigeria', country: 'Nigeria', website: 'nnc.gov.ng' },
};

type VerificationTier = 'basic' | 'premium' | 'urgent';

const VERIFICATION_TIERS = {
  basic: {
    id: 'basic' as VerificationTier,
    name: 'Basic',
    price: VERIFICATION_FEES.basic,
    description: 'Standard verification',
    turnaround: '5-7 business days',
    icon: <Clock size={18} />,
    color: '#6B7280',
    popular: false,
    features: [
      'Document verification',
      'License authenticity check',
      'Digital badge',
      'Email support',
    ],
  },
  premium: {
    id: 'premium' as VerificationTier,
    name: 'Premium',
    price: VERIFICATION_FEES.premium,
    description: 'Priority verification',
    turnaround: '2-3 business days',
    icon: <Star size={18} />,
    color: '#8B5CF6',
    popular: true,
    features: [
      'Fast-track verification',
      'License authenticity check',
      'Blockchain credential',
      'Priority support',
      'Verified badge with expiry',
      'Credential PDF download',
    ],
  },
  urgent: {
    id: 'urgent' as VerificationTier,
    name: 'Urgent',
    price: VERIFICATION_FEES.urgent,
    description: 'Express verification',
    turnaround: '24 hours',
    icon: <Zap size={18} />,
    color: '#F59E0B',
    popular: false,
    features: [
      'Same-day verification',
      'License authenticity check',
      'Blockchain credential',
      'Dedicated support',
      'Verified badge with expiry',
      'Credential PDF download',
      'Verification letter',
      'Priority employer visibility',
    ],
  },
};

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function VerificationModal({ isOpen, onClose, onComplete }: VerificationModalProps) {
  const { user, updateUser, setNotifications, notifications: notificationsState } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTier, setSelectedTier] = useState<VerificationTier>('premium');
  const [regulatorInfo, setRegulatorInfo] = useState<RegulatorInfo>({
    body: '',
    licenseNumber: '',
    expirationDate: '',
  });
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    { id: '1', name: 'Nursing License Certificate', type: 'license', status: 'pending' },
    { id: '2', name: 'Government-issued ID', type: 'id', status: 'pending' },
  ]);
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState(false);

  const handleFileUpload = useCallback((docId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, file, status: 'uploaded', url: URL.createObjectURL(file) }
        : doc
    ));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragActive(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(docId, file);
    }
  }, [handleFileUpload]);

  const handleRemoveDocument = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, file: undefined, url: undefined, status: 'pending' }
        : doc
    ));
  };

  const handleProceedToPayment = () => {
    setStep(4);
    setPaymentStep(true);
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateUser({
      verificationStatus: 'pending' as const,
      profile: user?.profile ? {
        ...user.profile,
        regulatorId: regulatorInfo.licenseNumber,
        regulatorBody: regulatorInfo.body,
      } : {
        dateOfBirth: '',
        country: '',
        gender: 'prefer_not_to_say' as const,
        regulatorId: regulatorInfo.licenseNumber,
        regulatorBody: regulatorInfo.body,
      },
    });

    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      type: 'info' as const,
      title: 'Payment Successful',
      message: `Your ${selectedTier} verification ($${VERIFICATION_TIERS[selectedTier].price}) has been processed. Documents submitted for review.`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications([newNotification, ...notificationsState]);

    setIsSubmitting(false);
    setPaymentStep(false);
    onComplete?.();
    onClose();
  };

  if (!isOpen) return null;

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
        className="w-full max-w-2xl bg-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Shield size={24} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Professional Verification</h2>
                <p className="text-sm text-slate-400">Get your verified badge and unlock all features</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>Regulator</span>
            <span className={`text-xs ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>Documents</span>
            <span className={`text-xs ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>Review</span>
            <span className={`text-xs ${step >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>Payment</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-indigo-400" />
                    <div>
                      <p className="font-medium text-white">Why verify with regulators?</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Linking your nursing license to your country's regulatory body ensures authenticity and builds trust with the global nursing community.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Building size={16} className="text-violet-400" />
                    Regulatory Body
                  </label>
                  <select
                    value={regulatorInfo.body}
                    onChange={(e) => setRegulatorInfo({ ...regulatorInfo, body: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  >
                    <option value="">Select your regulatory body</option>
                    {Object.entries(REGULATORY_BODIES).map(([code, body]) => (
                      <option key={code} value={code}>{body.name} ({body.country})</option>
                    ))}
                  </select>
                  {regulatorInfo.body && REGULATORY_BODIES[regulatorInfo.body] && (
                    <p className="text-xs text-slate-500 mt-2">
                      Visit {REGULATORY_BODIES[regulatorInfo.body].website} to verify your license
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Award size={16} className="text-emerald-400" />
                    License/Registration Number
                  </label>
                  <input
                    type="text"
                    value={regulatorInfo.licenseNumber}
                    onChange={(e) => setRegulatorInfo({ ...regulatorInfo, licenseNumber: e.target.value })}
                    placeholder="e.g., RN-12345678"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Calendar size={16} className="text-amber-400" />
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={regulatorInfo.expirationDate}
                    onChange={(e) => setRegulatorInfo({ ...regulatorInfo, expirationDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:border-emerald-500/50 outline-none transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <p className="text-sm text-slate-400">
                  Upload clear, readable images of your documents. Accepted formats: JPG, PNG, PDF (max 5MB each).
                </p>

                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          doc.status === 'uploaded' ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                        }`}>
                          {doc.status === 'uploaded' ? (
                            <CheckCircle size={20} className="text-emerald-400" />
                          ) : (
                            <FileText size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{doc.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{doc.type}</p>
                        </div>
                      </div>
                      {doc.status === 'uploaded' && (
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {doc.status === 'pending' ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragActive(doc.id); }}
                        onDragLeave={() => setDragActive(null)}
                        onDrop={(e) => handleDrop(e, doc.id)}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                          dragActive === doc.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <Upload size={32} className="mx-auto text-slate-500 mb-3" />
                        <p className="text-sm text-slate-400 mb-2">
                          Drag and drop or click to upload
                        </p>
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all text-sm font-medium">
                            Select File
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(doc.id, file);
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden">
                        {doc.file?.type.startsWith('image/') ? (
                          <img
                            src={doc.url}
                            alt={doc.name}
                            className="w-full h-40 object-cover"
                          />
                        ) : (
                          <div className="h-40 flex items-center justify-center bg-slate-800">
                            <FileText size={48} className="text-slate-500" />
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all text-sm">
                            <Eye size={14} />
                            Preview
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all text-sm">
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-400">Verification Process</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Your documents will be reviewed within 24-48 hours. You can still use the platform while verification is pending.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <h3 className="text-xl font-bold text-white mb-2">Select Verification Tier</h3>
                  <p className="text-slate-400 text-sm">Choose the verification speed that works for you</p>
                </div>

                <div className="space-y-3">
                  {Object.values(VERIFICATION_TIERS).map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTier === tier.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700/50 bg-slate-900/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                        >
                          {tier.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{tier.name}</span>
                              {tier.popular && (
                                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-white">${tier.price}</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{tier.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <Clock size={12} className="text-emerald-400" />
                            <span className="text-slate-400">Turnaround: {tier.turnaround}</span>
                          </div>
                        </div>
                        {selectedTier === tier.id && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      {selectedTier === tier.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 pt-3 border-t border-slate-700/50"
                        >
                          <div className="grid grid-cols-2 gap-1.5">
                            {tier.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                                <CheckCircle size={12} className="text-emerald-400" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-emerald-400" />
                      <span className="text-sm text-white font-medium">Total</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white">${VERIFICATION_TIERS[selectedTier].price}</span>
                      <p className="text-xs text-slate-500">One-time payment</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <Lock size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-400">30-day money-back guarantee</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Not satisfied? Get a full refund within 30 days of verification completion.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <CreditCard size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Complete Payment</h3>
                  <p className="text-slate-400 text-sm">Secure payment powered by Stripe</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${VERIFICATION_TIERS[selectedTier].color}20`, 
                          color: VERIFICATION_TIERS[selectedTier].color 
                        }}
                      >
                        {VERIFICATION_TIERS[selectedTier].icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{VERIFICATION_TIERS[selectedTier].name} Verification</p>
                        <p className="text-xs text-slate-500">{VERIFICATION_TIERS[selectedTier].turnaround}</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-white">${VERIFICATION_TIERS[selectedTier].price}</span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">${VERIFICATION_TIERS[selectedTier].price}.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Processing fee</span>
                      <span className="text-emerald-400">$0.00</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <span className="font-semibold text-white">Total</span>
                      <span className="text-xl font-bold text-white">${VERIFICATION_TIERS[selectedTier].price}.00</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <p className="text-sm font-medium text-white mb-3">Payment Method</p>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">VISA</span>
                      </div>
                      <span className="text-sm text-white">•••• •••• •••• 4242</span>
                    </div>
                    <button className="text-xs text-violet-400 hover:text-violet-300">Change</button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock size={12} />
                  <span>Your payment info is encrypted and secure</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-slate-700/50 flex gap-3 flex-shrink-0">
          {step > 1 && (
            <button
              onClick={() => {
                if (step === 4) {
                  setPaymentStep(false);
                  setStep(3);
                } else {
                  setStep(step - 1);
                }
              }}
              className="px-6 py-3 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all font-medium"
            >
              Back
            </button>
          )}
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleProceedToPayment}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Proceed to Payment
              <ChevronRight size={18} />
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handlePayment}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Pay ${VERIFICATION_TIERS[selectedTier].price}
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
