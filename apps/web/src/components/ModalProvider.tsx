'use client';

import { useUser } from '@/context/UserContext';
import OnboardingModal from './OnboardingModal';
import EmailVerificationModal from './EmailVerificationModal';
import VerificationModal from './VerificationModal';
import { useState } from 'react';

export default function ModalProvider() {
  const { showOnboardingModal, showVerifyEmailModal, user } = useUser();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  return (
    <>
      <OnboardingModal />
      <EmailVerificationModal />
      {user && !user.isCreator && (
        <VerificationModalButton onOpen={() => setShowVerificationModal(true)} />
      )}
      <VerificationModal 
        isOpen={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)} 
      />
    </>
  );
}

import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

function VerificationModalButton({ onOpen }: { onOpen: () => void }) {
  const { user } = useUser();
  
  if (user?.verificationStatus === 'verified') return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
    >
      <Shield size={20} />
      <span>Complete Verification</span>
    </motion.button>
  );
}
