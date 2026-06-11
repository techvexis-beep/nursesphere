'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  upvotes: number;
}

interface AskRegulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  regulatorId: string;
  regulatorName: string;
  hasLiveSessions: boolean;
}

export function AskRegulatorModal({ 
  isOpen, 
  onClose, 
  regulatorId, 
  regulatorName,
  hasLiveSessions 
}: AskRegulatorModalProps) {
  const { token, user } = useUser();
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  const fetchFAQs = useCallback(async () => {
    setLoadingFaqs(true);
    try {
      const res = await fetch(`/api/regulators?regulatorId=${regulatorId}`);
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoadingFaqs(false);
    }
  }, [regulatorId]);

  useEffect(() => {
    if (isOpen) {
      fetchFAQs();
    }
  }, [isOpen, fetchFAQs]);

  const handleSubmit = async () => {
    if (!question.trim() || !token) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/migration/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          regulatorId,
          question: question.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setQuestion('');
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit question:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '85vh',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '24px',
              zIndex: 1001,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: 'white', 
                  margin: 0 
                }}>
                  Ask {regulatorName}
                </h2>
                <p style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.5)', 
                  margin: '4px 0 0' 
                }}>
                  Get official answers to your questions
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', marginBottom: '16px' }}>
              {!user ? (
                <div style={{ 
                  padding: '24px', 
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔐</div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                    Please log in to ask questions
                  </p>
                  <a
                    href="/login"
                    style={{
                      display: 'inline-block',
                      marginTop: '12px',
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Log In
                  </a>
                </div>
              ) : submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    padding: '32px', 
                    textAlign: 'center',
                    background: 'rgba(16,185,129,0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                  <p style={{ color: '#10B981', fontSize: '16px', fontWeight: 600 }}>
                    Question Submitted!
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>
                    The regulator will review your question soon.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 style={{ 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: 'rgba(255,255,255,0.6)', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Popular Questions
                  </h3>
                  
                  {loadingFaqs ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderTopColor: '#6366F1',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto',
                      }} />
                      <style>{`
                        @keyframes spin {
                          to { transform: rotate(360deg); }
                        }
                      `}</style>
                    </div>
                  ) : faqs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      {faqs.slice(0, 3).map((faq) => (
                        <div
                          key={faq.id}
                          style={{
                            padding: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          <p style={{ 
                            fontSize: '13px', 
                            color: 'white', 
                            fontWeight: 500, 
                            margin: '0 0 6px' 
                          }}>
                            Q: {faq.question}
                          </p>
                          <p style={{ 
                            fontSize: '12px', 
                            color: 'rgba(255,255,255,0.5)', 
                            margin: 0,
                            lineHeight: 1.5,
                          }}>
                            A: {faq.answer?.slice(0, 100)}
                            {faq.answer && faq.answer.length > 100 ? '...' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'rgba(255,255,255,0.4)', 
                      marginBottom: '20px',
                      fontStyle: 'italic',
                    }}>
                      No frequently asked questions yet. Be the first to ask!
                    </p>
                  )}

                  <h3 style={{ 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: 'rgba(255,255,255,0.6)', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Ask Your Question
                  </h3>
                  
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                </>
              )}
            </div>

            {user && !submitted && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {hasLiveSessions && (
                  <a
                    href="/live"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #6366F1',
                      background: 'rgba(99,102,241,0.1)',
                      color: '#6366F1',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    🎥 Join Live Q&A
                  </a>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!question.trim() || submitting}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: question.trim() 
                      ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                      : 'rgba(255,255,255,0.1)',
                    color: question.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: question.trim() && !submitting ? 'pointer' : 'not-allowed',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Sending...' : 'Submit Question'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AskRegulatorModal;
