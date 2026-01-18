import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoloButton, HoloText } from './ui/holo';
import { supabase, WaitlistEntry } from '../lib/supabase';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please fill in all fields');
      setSubmitStatus('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const waitlistEntry: WaitlistEntry = {
        name: name.trim(),
        email: email.trim(),
      };

      const { error } = await supabase
        .from('waitlist')
        .insert([waitlistEntry]);

      if (error) {
        throw error;
      }

      setSubmitStatus('success');
      setName('');
      setEmail('');

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting to waitlist:', error);
      setErrorMessage(error.message || 'Failed to join waitlist. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setEmail('');
      setSubmitStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isSubmitting]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Crystal corner accents */}
            <div className="crystal-corner-tl absolute -top-2 -left-2" />
            <div className="crystal-corner-tr absolute -top-2 -right-2" />
            <div className="crystal-corner-bl absolute -bottom-2 -left-2" />
            <div className="crystal-corner-br absolute -bottom-2 -right-2" />

            {/* Geometric overlay */}
            <div className="geometric-overlay absolute inset-0 rounded-xl" />

            {/* Main terminal container */}
            <div className="relative bg-black/95 border border-electric-cyan/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.3)]">
              {/* Terminal header */}
              <div className="flex items-center justify-between p-4 border-b border-electric-cyan/20 bg-black/90">
                <HoloText className="text-lg font-bold text-electric-cyan font-terminal">
                  psy://waitlist/join
                </HoloText>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
                >
                  ✕
                </button>
              </div>

              {/* Terminal body */}
              <div className="p-6 space-y-6">
                {/* Welcome message */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-electric-cyan font-terminal text-sm">
                    <span className="text-neon-purple">$</span>
                    <span>echo "Welcome to PsyChat Beta"</span>
                  </div>
                  <HoloText className="text-white/90 leading-relaxed">
                    Join our waitlist to be among the first to experience encrypted,
                    privacy-preserving conversations powered by blockchain and ZK proofs.
                  </HoloText>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name input */}
                  <div className="space-y-2">
                    <label className="block text-electric-cyan font-terminal text-sm">
                      <span className="text-neon-purple">$</span> name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 bg-black/50 border border-electric-cyan/30 rounded-md text-white placeholder-white/40 focus:outline-none focus:border-electric-cyan focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all font-mono text-sm"
                    />
                  </div>

                  {/* Email input */}
                  <div className="space-y-2">
                    <label className="block text-electric-cyan font-terminal text-sm">
                      <span className="text-neon-purple">$</span> email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 bg-black/50 border border-electric-cyan/30 rounded-md text-white placeholder-white/40 focus:outline-none focus:border-electric-cyan focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all font-mono text-sm"
                    />
                  </div>

                  {/* Error message */}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm font-mono bg-red-900/20 border border-red-400/30 rounded-md p-3"
                    >
                      <span className="text-red-300">$</span> {errorMessage}
                    </motion.div>
                  )}

                  {/* Success message */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-green-400 text-sm font-mono bg-green-900/20 border border-green-400/30 rounded-md p-3 text-center"
                    >
                      <span className="text-green-300">$</span> Successfully joined waitlist! 🎉
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <HoloButton
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="w-full h-12 font-terminal"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : submitStatus === 'success' ? (
                      '✓ Joined Successfully'
                    ) : (
                      'Join Waitlist'
                    )}
                  </HoloButton>
                </form>

                {/* Footer */}
                <div className="text-center text-white/50 text-xs font-mono border-t border-electric-cyan/10 pt-4">
                  Your data is encrypted and stored securely.
                  <br />
                  We'll never share your information.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}