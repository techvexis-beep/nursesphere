'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export default function NurseSphereLogo({ size = 40, animated = true, className = '' }: LogoProps) {
  const LogoContent = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Globe Circle */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />

      {/* Globe Background */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="url(#logoGradient)"
        opacity="0.15"
      />

      {/* Globe Grid Lines */}
      <ellipse cx="50" cy="50" rx="30" ry="42" stroke="url(#globeGradient)" strokeWidth="1" fill="none" opacity="0.4" />
      <ellipse cx="50" cy="50" rx="42" ry="30" stroke="url(#globeGradient)" strokeWidth="1" fill="none" opacity="0.4" />
      <line x1="50" y1="8" x2="50" y2="92" stroke="url(#globeGradient)" strokeWidth="1" opacity="0.4" />
      <line x1="8" y1="50" x2="92" y2="50" stroke="url(#globeGradient)" strokeWidth="1" opacity="0.4" />

      {/* Nurse Hat Base */}
      <path
        d="M25 55 Q25 35, 50 32 Q75 35, 75 55 L75 60 Q75 65, 50 68 Q25 65, 25 60 Z"
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />

      {/* Hat Top */}
      <path
        d="M30 52 Q30 38, 50 36 Q70 38, 70 52"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="2"
      />

      {/* Hat Cross Symbol */}
      <rect x="46" y="40" width="8" height="22" rx="2" fill="white" opacity="0.95" />
      <rect x="39" y="47" width="22" height="8" rx="2" fill="white" opacity="0.95" />

      {/* Hat Band */}
      <path
        d="M28 56 Q50 60, 72 56"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />

      {/* Sparkle Accents */}
      <circle cx="78" cy="18" r="3" fill="#EC4899" opacity="0.8" />
      <circle cx="82" cy="25" r="2" fill="#8B5CF6" opacity="0.6" />
      <circle cx="22" cy="22" r="2" fill="#6366F1" opacity="0.7" />

      {/* Decorative Ring */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#logoGradient)"
        strokeWidth="1"
        strokeDasharray="4 4"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        style={{ display: 'inline-flex' }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
}

export function NurseSphereLogoText({ size = 'medium', className = '' }: { size?: 'small' | 'medium' | 'large', className?: string }) {
  const sizes = {
    small: { text: '18px', logo: 28 },
    medium: { text: '24px', logo: 36 },
    large: { text: '32px', logo: 48 },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <NurseSphereLogo size={sizes[size].logo} animated={false} />
      <span
        style={{
          fontSize: sizes[size].text,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        NurseSphere
      </span>
    </div>
  );
}
