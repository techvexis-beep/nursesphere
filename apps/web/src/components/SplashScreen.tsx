'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState(0);
  const [logoFloat, setLogoFloat] = useState(0);

  useEffect(() => {
    const floatInterval = setInterval(() => {
      setLogoFloat(prev => (prev + 1) % 20);
    }, 100);

    const stage1 = setTimeout(() => setStage(1), 400);
    const stage2 = setTimeout(() => setStage(2), 1000);
    const stage3 = setTimeout(() => setStage(3), 1800);
    const complete = setTimeout(() => onComplete(), 2600);

    return () => {
      clearInterval(floatInterval);
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      clearTimeout(complete);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 60px rgba(99, 102, 241, 0.8), 0 0 100px rgba(139, 92, 246, 0.4); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .splash-logo {
          animation: float 2s ease-in-out infinite, pulse-glow 3s ease-in-out infinite;
        }
        .splash-text {
          animation: fadeInUp 0.6s ease forwards;
        }
        .splash-subtitle {
          animation: fadeInUp 0.6s ease 0.3s forwards;
          opacity: 0;
        }
        .splash-loader {
          animation: fadeInUp 0.6s ease 0.6s forwards;
          opacity: 0;
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .fade-out {
          animation: fadeOut 0.5s ease forwards;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
        }
      `}</style>

      {/* Animated Background Orbs */}
      <div className="orb" style={{
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div className="orb" style={{
        bottom: '20%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />
      <div className="orb" style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
      }} />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Logo */}
        <div 
          className="splash-logo"
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            backgroundSize: '200% 200%',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            transform: `translateY(${Math.sin(logoFloat * 0.3) * 5}px)`,
          }}
        >
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '56px' }}>N</span>
        </div>

        {/* App Name */}
        {stage >= 1 && (
          <h1 
            className="splash-text gradient-text"
            style={{ 
              fontSize: '42px', 
              fontWeight: '800', 
              margin: 0,
              letterSpacing: '-1px',
            }}
          >
            NurseSphere
          </h1>
        )}

        {/* Tagline */}
        {stage >= 2 && (
          <p className="splash-subtitle" style={{
            color: '#9ca3af',
            fontSize: '16px',
            margin: '12px 0 0',
            maxWidth: '300px',
          }}>
            AI-Powered Nursing Platform
          </p>
        )}

        {/* Loading Bar */}
        {stage >= 3 && (
          <div className="splash-loader" style={{ marginTop: '40px' }}>
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              margin: '0 auto',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease infinite',
                borderRadius: '2px',
              }} />
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '12px',
              marginTop: '12px',
            }}>
              Loading...
            </p>
          </div>
        )}
      </div>

      {/* Version */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        color: '#4b5563',
        fontSize: '12px',
      }}>
        Version 1.0.0 • Made with ❤️ for Nurses
      </div>
    </div>
  );
}
