import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect, useRef } from 'react';
import { ArciumIntegration, WalrusIntegration, ReflectIntegration } from '../utils/sponsorIntegrations';
import SpotlightCard from './SpotlightCard';

interface SessionNote {
  id: string;
  timestamp: Date;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  recommendations: string[];
}

interface Psychologist {
  id: string;
  name: string;
  credentials: string;
  rate: number; // per hour in $rUSD
  rating: number;
  specialties: string[];
  availability: string[];
  matchScore: number; // AI-calculated match based on chat insights
  profileImage?: string;
  bio: string;
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

interface ChatInsight {
  topics: string[];
  sentiment: string;
  urgency: 'low' | 'medium' | 'high';
  recommendedSpecialties: string[];
}

export default function VideoChat() {
  const walletCtx = useWallet();
  const { publicKey } = walletCtx;
  const { connection } = useConnection();
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  
  // Video controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  
  // AI Notes
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  
  // Booking flow
  const [currentStep, setCurrentStep] = useState<'insights' | 'selection' | 'calendar' | 'session'>('insights');
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [walrusCid, setWalrusCid] = useState<string | null>(null);
  
  // Mock chat insights (would come from AI analysis of user's chat history)
  const chatInsights: ChatInsight = {
    topics: ['Anxiety', 'Work Stress', 'Sleep Issues', 'Social Relationships'],
    sentiment: 'mixed',
    urgency: 'medium',
    recommendedSpecialties: ['Anxiety Disorders', 'Stress Management', 'Cognitive Behavioral Therapy', 'Mindfulness']
  };

  // Expanded psychologist database with AI matching
  const allPsychologists: Psychologist[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      credentials: 'PhD, Licensed Clinical Psychologist',
      rate: 150,
      rating: 4.9,
      specialties: ['Anxiety Disorders', 'Stress Management', 'CBT'],
      availability: ['9:00 AM', '2:00 PM', '4:00 PM'],
      matchScore: 95,
      bio: 'Specializes in anxiety disorders and stress management with 10+ years experience.'
    },
    {
      id: '2', 
      name: 'Dr. Marcus Johnson',
      credentials: 'PsyD, Licensed Marriage & Family Therapist',
      rate: 120,
      rating: 4.8,
      specialties: ['Relationships', 'Grief', 'Addiction', 'CBT'],
      availability: ['10:00 AM', '3:00 PM', '5:00 PM'],
      matchScore: 78,
      bio: 'Expert in relationship therapy and grief counseling with holistic approach.'
    },
    {
      id: '3',
      name: 'Dr. Elena Rodriguez',
      credentials: 'PhD, Licensed Clinical Social Worker',
      rate: 100,
      rating: 4.7,
      specialties: ['PTSD', 'Bipolar', 'Personality Disorders', 'Mindfulness'],
      availability: ['11:00 AM', '1:00 PM', '6:00 PM'],
      matchScore: 65,
      bio: 'Trauma specialist with expertise in mindfulness-based interventions.'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      credentials: 'PhD, Licensed Clinical Psychologist',
      rate: 180,
      rating: 4.9,
      specialties: ['Anxiety Disorders', 'CBT', 'Mindfulness', 'Sleep Disorders'],
      availability: ['8:00 AM', '12:00 PM', '3:00 PM'],
      matchScore: 92,
      bio: 'Leading expert in anxiety and sleep disorders with evidence-based treatments.'
    },
    {
      id: '5',
      name: 'Dr. Lisa Park',
      credentials: 'PsyD, Licensed Clinical Psychologist',
      rate: 140,
      rating: 4.8,
      specialties: ['Stress Management', 'Work-Life Balance', 'CBT', 'Mindfulness'],
      availability: ['9:30 AM', '2:30 PM', '4:30 PM'],
      matchScore: 88,
      bio: 'Specializes in workplace stress and work-life balance optimization.'
    },
    {
      id: '6',
      name: 'Dr. Michael Brown',
      credentials: 'PhD, Licensed Clinical Psychologist',
      rate: 160,
      rating: 4.7,
      specialties: ['Social Anxiety', 'Relationships', 'CBT', 'Group Therapy'],
      availability: ['10:30 AM', '1:30 PM', '5:30 PM'],
      matchScore: 82,
      bio: 'Expert in social anxiety and relationship dynamics with group therapy experience.'
    }
  ];

  // Filter psychologists based on AI insights
  const recommendedPsychologists = allPsychologists
    .filter(psych => 
      psych.specialties.some(specialty => 
        chatInsights.recommendedSpecialties.some(rec => 
          specialty.toLowerCase().includes(rec.toLowerCase()) || 
          rec.toLowerCase().includes(specialty.toLowerCase())
        )
      )
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  // Mock time slots for calendar
  const generateTimeSlots = (psychologist: Psychologist): TimeSlot[] => {
    const today = new Date();
    const slots: TimeSlot[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      psychologist.availability.forEach(time => {
        slots.push({
          id: `${psychologist.id}_${date.toISOString().split('T')[0]}_${time}`,
          time,
          date: date.toISOString().split('T')[0],
          available: Math.random() > 0.3 // 70% availability
        });
      });
    }
    
    return slots;
  };

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
        setSessionDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    setSessionDuration(0);
    setIsRecording(true);
    setIsEncrypted(true);
    setCurrentStep('session');
    
    // Mock encryption start
    try {
      await ArciumIntegration.encryptData('Video session started');
      console.log('Session encryption enabled');
    } catch (error) {
      console.error('Encryption setup failed:', error);
    }
  };

  const endSession = async () => {
    if (!isSessionActive) return;
    
    setIsSessionActive(false);
    setIsRecording(false);
    
    // Generate AI notes and automatically store them
    setIsGeneratingNotes(true);
    setTimeout(async () => {
      const mockNote: SessionNote = {
        id: `note_${Date.now()}`,
        timestamp: new Date(),
        content: `Session Summary: Patient discussed feelings of anxiety related to work stress. Key themes included perfectionism, fear of failure, and difficulty setting boundaries. Patient showed good insight and expressed willingness to try new coping strategies.`,
        sentiment: 'positive',
        keyTopics: ['Work Stress', 'Perfectionism', 'Boundaries', 'Coping Strategies'],
        recommendations: ['Practice mindfulness daily', 'Set work-life boundaries', 'Consider CBT techniques', 'Schedule follow-up in 2 weeks']
      };
      setSessionNotes([mockNote]);
      setIsGeneratingNotes(false);
      
      // Automatically store in Walrus (mocked)
      try {
        const notesData = JSON.stringify([mockNote]);
        const cid = await WalrusIntegration.storeEncryptedData(notesData);
        setWalrusCid(cid);
        console.log('Session notes automatically stored in Walrus:', cid);
      } catch (error) {
        console.error('Auto-storage failed:', error);
      }
    }, 2000);
  };

  const storeInWalrus = async () => {
    if (sessionNotes.length === 0) return;
    
    try {
      const notesData = JSON.stringify(sessionNotes);
      const cid = await WalrusIntegration.storeEncryptedData(notesData);
      setWalrusCid(cid);
      alert('Session notes stored in Walrus! CID: ' + cid);
    } catch (error) {
      console.error('Walrus storage failed:', error);
      alert('Failed to store in Walrus');
    }
  };

  const payPsychologist = async () => {
    if (!selectedPsychologist) return;
    
    setIsProcessingPayment(true);
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use existing Reflect integration mock
      const txId = await ReflectIntegration.mintRUSD(selectedPsychologist.rate);
      console.log('Payment processed:', txId);
      
      setPaymentSuccess(true);
      setIsProcessingPayment(false);
      
      // End session after payment
      await endSession();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const autoSelectPsychologist = () => {
    const bestMatch = recommendedPsychologists[0];
    setSelectedPsychologist(bestMatch);
    setCurrentStep('calendar');
  };

  const selectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    // Auto-proceed to session after selecting time
    setTimeout(() => {
      startSession();
    }, 1000);
  };

  return (
    <div className="psychat-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">AI-Curated Video Therapy</h2>
        <div className="text-sm text-white/60">
          {isSessionActive ? `Session: ${formatDuration(sessionDuration)}` : 'Step ' + (currentStep === 'insights' ? '1' : currentStep === 'selection' ? '2' : currentStep === 'calendar' ? '3' : '4') + ' of 4'}
        </div>
      </div>

      {/* Step 1: AI Insights */}
      {currentStep === 'insights' && (
        <SpotlightCard className="p-6 mb-6" spotlightColor="rgba(97, 220, 163, 0.2)">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-4">AI Analysis Complete</h3>
            <p className="text-white/80 mb-6">Based on your chat history, we've identified key areas for therapy focus.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3">Key Topics Identified</h4>
              <div className="flex flex-wrap gap-2">
                {chatInsights.topics.map((topic, idx) => (
                  <span key={idx} className="text-xs bg-psy-blue/20 text-psy-blue px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3">Recommended Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {chatInsights.recommendedSpecialties.map((specialty, idx) => (
                  <span key={idx} className="text-xs bg-psy-green/20 text-psy-green px-2 py-1 rounded">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentStep('selection')}
              className="psychat-button"
            >
              View Curated Therapists →
            </button>
          </div>
        </SpotlightCard>
      )}

      {/* Step 2: Psychologist Selection */}
      {currentStep === 'selection' && (
        <SpotlightCard className="p-6 mb-6" spotlightColor="rgba(97, 179, 220, 0.2)">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">AI-Curated Therapist Matches</h3>
            <button
              onClick={autoSelectPsychologist}
              className="psychat-button text-sm"
            >
              Auto-Select Best Match
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPsychologists.map((psych) => (
              <div
                key={psych.id}
                onClick={() => {
                  setSelectedPsychologist(psych);
                  setCurrentStep('calendar');
                }}
                className="bg-black/40 rounded-lg p-4 cursor-pointer hover:bg-black/60 transition-colors border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold">{psych.name}</div>
                  <div className="text-xs bg-psy-green/20 text-psy-green px-2 py-1 rounded">
                    {psych.matchScore}% match
                  </div>
                </div>
                <div className="text-white/60 text-sm mb-2">{psych.credentials}</div>
                <div className="text-psy-green font-semibold mb-2">${psych.rate}/hour in $rUSD</div>
                <div className="text-white/60 text-sm mb-2">⭐ {psych.rating}/5.0</div>
                <div className="text-xs text-white/50 mb-2">{psych.bio}</div>
                <div className="flex flex-wrap gap-1">
                  {psych.specialties.slice(0, 2).map((specialty, idx) => (
                    <span key={idx} className="text-xs bg-psy-blue/20 text-psy-blue px-1 py-0.5 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Step 3: Calendar Booking */}
      {currentStep === 'calendar' && selectedPsychologist && (
        <SpotlightCard className="p-6 mb-6" spotlightColor="rgba(147, 51, 234, 0.2)">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Book Session with {selectedPsychologist.name}</h3>
              <div className="text-white/60 text-sm">{selectedPsychologist.credentials}</div>
            </div>
            <button
              onClick={() => setCurrentStep('selection')}
              className="text-white/60 hover:text-white text-sm"
            >
              ← Back to Selection
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <h4 className="text-white font-semibold mb-4">Available Times</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generateTimeSlots(selectedPsychologist).map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && selectTimeSlot(slot)}
                    disabled={!slot.available}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      slot.available 
                        ? 'bg-black/40 hover:bg-black/60 text-white border border-white/20' 
                        : 'bg-black/40 text-white/30 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium">{slot.date}</div>
                    <div className="text-sm text-white/60">{slot.time}</div>
                    {!slot.available && <div className="text-xs text-red-400">Unavailable</div>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Session Details */}
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-4">Session Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Therapist:</span>
                  <span className="text-white">{selectedPsychologist.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Rate:</span>
                  <span className="text-psy-green">${selectedPsychologist.rate}/hour in $rUSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Duration:</span>
                  <span className="text-white">60 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Cost:</span>
                  <span className="text-psy-green font-semibold">${selectedPsychologist.rate} $rUSD</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-psy-blue/10 border border-psy-blue/20 rounded">
                <div className="text-sm text-white/80">
                  <strong>Payment:</strong> You will pay ${selectedPsychologist.rate} $rUSD for this therapy session.
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Step 4: Video Session */}
      {currentStep === 'session' && (
        <>
          {/* Selected Psychologist Info */}
          {selectedPsychologist && (
            <SpotlightCard className="p-4 mb-6" spotlightColor="rgba(97, 179, 220, 0.2)">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Session with {selectedPsychologist.name}</div>
                  <div className="text-white/60 text-sm">{selectedPsychologist.credentials}</div>
                  <div className="text-psy-green text-sm">${selectedPsychologist.rate}/hour in $rUSD</div>
                </div>
                {selectedTimeSlot && (
                  <div className="text-right">
                    <div className="text-white text-sm">{selectedTimeSlot.date}</div>
                    <div className="text-white/60 text-sm">{selectedTimeSlot.time}</div>
                  </div>
                )}
              </div>
            </SpotlightCard>
          )}

          {/* Video Interface Placeholder */}
          <SpotlightCard className="p-6 mb-6" spotlightColor="rgba(147, 51, 234, 0.2)">
            <div className="relative">
              {/* Jitsi Placeholder */}
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
                {isSessionActive ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">📹</div>
                    <div className="text-white text-lg">Video Call Active</div>
                    <div className="text-white/60 text-sm">Encrypted with Arcium ZK Powered by Jitsi</div>
                    <div className="flex items-center justify-center mt-4 space-x-4">
                      <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                      <span className="text-white/60 text-sm">
                        {isRecording ? 'Recording' : 'Not Recording'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <div className="text-white text-lg">Ready to Start Session</div>
                    <div className="text-white/60 text-sm">Click "Start Session" to begin</div>
                  </div>
                )}
              </div>

              {/* Session Controls */}
              <div className="flex items-center justify-center space-x-4">
                {!isSessionActive ? (
                  <button
                    onClick={startSession}
                    disabled={!selectedPsychologist || !publicKey}
                    className="psychat-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Session
                  </button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`px-4 py-2 rounded ${isMuted ? 'bg-red-500/20 text-red-300' : 'bg-black/40 text-white border border-white/10'}`}
                    >
                      {isMuted ? '🔇 Unmute' : '🎤 Mute'}
                    </button>
                    <button
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`px-4 py-2 rounded ${!isCameraOn ? 'bg-red-500/20 text-red-300' : 'bg-black/40 text-white border border-white/10'}`}
                    >
                      {isCameraOn ? '📹 Camera On' : '📷 Camera Off'}
                    </button>
                    <button
                      onClick={payPsychologist}
                      disabled={isProcessingPayment}
                      className="psychat-button disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessingPayment ? 'Processing...' : 'Pay for Therapy'}
                    </button>
                  </div>
                )}
              </div>

              {/* Status Indicators */}
              {isSessionActive && (
                <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isEncrypted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className="text-white/60">Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-white/60">Recording</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-white/60">Connected</span>
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>
        </>
      )}

      {/* AI Notes Section */}
      {(sessionNotes.length > 0 || isGeneratingNotes) && (
        <SpotlightCard className="p-6 mb-6" spotlightColor="rgba(97, 220, 163, 0.2)">
          <h3 className="text-xl font-bold text-white mb-4">AI Session Notes</h3>
          
          {isGeneratingNotes ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🤖</div>
              <div className="text-white">Generating AI notes...</div>
              <div className="text-white/60 text-sm">Analyzing session content with ZK privacy</div>
            </div>
          ) : (
            <div className="space-y-4">
              {sessionNotes.map((note) => (
                <div key={note.id} className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white/60 text-sm">
                      {note.timestamp.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        note.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                        note.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {note.sentiment}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-white mb-3">{note.content}</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-white/60 text-sm mb-2">Key Topics:</div>
                      <div className="flex flex-wrap gap-2">
                        {note.keyTopics.map((topic, idx) => (
                          <span key={idx} className="text-xs bg-psy-blue/20 text-psy-blue px-2 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 text-sm mb-2">Recommendations:</div>
                      <ul className="text-sm text-white/80 space-y-1">
                        {note.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-psy-green mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => alert('HNFT minting would happen here - session notes added to your psychological history')}
                      className="psychat-button text-sm"
                    >
                      Add to HNFT
                    </button>
                    {walrusCid && (
                      <div className="text-xs text-white/60">
                        ✅ Auto-stored in Walrus • CID: {walrusCid}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SpotlightCard>
      )}

      {/* Payment Success */}
      {paymentSuccess && (
        <SpotlightCard className="p-6 mb-6" spotlightColor="rgba(74, 222, 128, 0.2)">
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <div className="text-white text-lg font-semibold mb-2">Payment Successful!</div>
            <div className="text-white/60 text-sm mb-4">
              You paid {selectedPsychologist?.name} ${selectedPsychologist?.rate} in $rUSD
            </div>
            <div className="text-xs text-white/50">
              Transaction processed via Reflect • Auto-compound enabled
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Privacy Notice */}
      <div className="p-4 bg-psy-blue/10 border border-psy-blue/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-psy-blue">🔒</span>
          <div className="text-sm text-white/80">
            <strong>Privacy First:</strong> Your video session is ZK-encrypted (Arcium) and stored securely. 
            AI notes are generated with privacy-preserving techniques. Only you control access to your session data.
          </div>
        </div>
      </div>
    </div>
  );
}