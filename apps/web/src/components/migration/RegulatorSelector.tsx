'use client';

import { motion } from 'framer-motion';

interface Regulator {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  region: string | null;
  _count: {
    pathways: number;
    liveSessions: number;
    tracking: number;
  };
}

interface RegulatorSelectorProps {
  regulators: Regulator[];
  selectedRegulator: string | null;
  trackedRegulators: string[];
  onSelect: (regulator: Regulator) => void;
  onTrack: (regulatorId: string, action: 'track' | 'untrack') => void;
  loading?: boolean;
}

export function RegulatorSelector({ 
  regulators, 
  selectedRegulator, 
  trackedRegulators,
  onSelect,
  onTrack,
  loading 
}: RegulatorSelectorProps) {
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#6366F1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          Loading regulators...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (regulators.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px dashed rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
          No verified regulators found for this country.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '8px' }}>
          Please select another country or check back later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: 700, 
        color: 'white', 
        marginBottom: '16px' 
      }}>
        Select Your Regulator
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {regulators.map((regulator, index) => {
          const isSelected = selectedRegulator === regulator.id;
          const isTracked = trackedRegulators.includes(regulator.id);
          const hasLiveSessions = regulator._count.liveSessions > 0;

          return (
            <motion.div
              key={regulator.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(regulator)}
              style={{
                padding: '20px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))'
                  : 'rgba(255, 255, 255, 0.03)',
                border: `2px solid ${isSelected ? '#6366F1' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              whileHover={{ borderColor: '#6366F1', x: 4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                  }}>
                    {regulator.logo ? (
                      <img 
                        src={regulator.logo} 
                        alt={regulator.name}
                        style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                      />
                    ) : (
                      '🏛️'
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontWeight: 600, color: 'white', fontSize: '16px', margin: 0 }}>
                        {regulator.name}
                      </h3>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: '#6366F1',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 600,
                          }}
                        >
                          SELECTED
                        </motion.span>
                      )}
                    </div>
                    
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'rgba(255,255,255,0.5)', 
                      margin: '0 0 8px',
                      lineHeight: 1.5 
                    }}>
                      {regulator.description?.slice(0, 120)}
                      {regulator.description && regulator.description.length > 120 ? '...' : ''}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        📍 {regulator.region || 'National'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        📋 {regulator._count.pathways} pathway{regulator._count.pathways !== 1 ? 's' : ''}
                      </span>
                      <span style={{ fontSize: '12px', color: hasLiveSessions ? '#10B981' : 'rgba(255,255,255,0.4)' }}>
                        {hasLiveSessions ? '🔴 Live Q&A' : '📅 No upcoming sessions'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  {isTracked ? (
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrack(regulator.id, 'untrack');
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #EF4444',
                        background: 'rgba(239,68,68,0.1)',
                        color: '#EF4444',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      whileHover={{ background: 'rgba(239,68,68,0.2)' }}
                    >
                      ✕ Untrack
                    </motion.button>
                  ) : (
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrack(regulator.id, 'track');
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #10B981',
                        background: 'rgba(16,185,129,0.1)',
                        color: '#10B981',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      whileHover={{ background: 'rgba(16,185,129,0.2)' }}
                    >
                      + Track
                    </motion.button>
                  )}
                  
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                    👥 {regulator._count.tracking} tracking
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default RegulatorSelector;
