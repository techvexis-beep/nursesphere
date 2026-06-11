'use client';

import { useState } from 'react';

interface TrackerCardProps {
  title: string;
  icon: string;
  gradient: string;
  status: string;
  date?: string | null;
  score?: number | null;
  examName?: string;
  fees?: string;
  documents?: string;
  onStatusChange: (v: string) => void;
  onDateChange: (v: string | null) => void;
  onScoreChange?: (v: number | null) => void;
  onAskRegulator?: () => void;
  statusOptions: { value: string; label: string; color: string; bg: string }[];
  saving: boolean;
  scoreLabel?: string;
  scoreStep?: number;
}

export default function TrackerCard({ 
  title, 
  icon, 
  gradient, 
  status, 
  date, 
  score,
  examName,
  fees,
  documents,
  onStatusChange, 
  onDateChange, 
  onScoreChange,
  onAskRegulator,
  statusOptions, 
  saving,
  scoreLabel = 'Score',
  scoreStep = 1 
}: TrackerCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const statusBadge = statusOptions.find(s => s.value === status) || statusOptions[0];
  
  let parsedFees: string[] = [];
  let parsedDocuments: string[] = [];
  
  try {
    if (fees) parsedFees = JSON.parse(fees);
  } catch (e) { parsedFees = []; }
  
  try {
    if (documents) parsedDocuments = JSON.parse(documents);
  } catch (e) { parsedDocuments = []; }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      padding: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>
            {icon}
          </div>
          <div>
            <h3 style={{ fontWeight: 700, color: 'white', fontSize: '16px', margin: 0 }}>{title}</h3>
            {examName && (
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
                {examName}
              </p>
            )}
          </div>
        </div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 600,
          background: statusBadge.bg,
          color: statusBadge.color,
        }}>
          {statusBadge.label}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px', display: 'block' }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value} style={{ background: '#1a1a2e' }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px', display: 'block' }}>
            Date
          </label>
          <input
            type="date"
            value={date?.split('T')[0] || ''}
            onChange={(e) => onDateChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {onScoreChange && (
          <div>
            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px', display: 'block' }}>
              {scoreLabel}
            </label>
            <input
              type="number"
              step={scoreStep}
              value={score || ''}
              onChange={(e) => onScoreChange(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder={`Enter ${scoreLabel.toLowerCase()}`}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      {(parsedFees.length > 0 || parsedDocuments.length > 0) && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {showDetails ? '▲' : '▼'} View Requirements
          </button>
          
          {showDetails && (
            <div style={{ 
              marginTop: '12px', 
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '10px',
            }}>
              {parsedFees.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                    💰 Fees
                  </h4>
                  {parsedFees.map((fee: string, i: number) => (
                    <p key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '2px 0' }}>
                      {fee}
                    </p>
                  ))}
                </div>
              )}
              
              {parsedDocuments.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                    📄 Required Documents
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {parsedDocuments.map((doc: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          padding: '4px 8px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {onAskRegulator && (
        <button
          onClick={onAskRegulator}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            color: '#A5B4FC',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          💬 Ask Regulator
        </button>
      )}

      {saving && (
        <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Saving...
        </div>
      )}
    </div>
  );
}
