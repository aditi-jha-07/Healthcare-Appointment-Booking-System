import React, { useState, useEffect, useRef } from 'react';
import { Appointment } from '../types/healthcare';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  FileText,
  Activity,
  CheckCircle2,
  Lock,
  MessageSquare,
  Send,
  Maximize2
} from 'lucide-react';

interface VideoConsultationProps {
  appointment?: Appointment | null;
  onEndCall: () => void;
}

export const VideoConsultation: React.FC<VideoConsultationProps> = ({
  appointment,
  onEndCall,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'vitals' | 'chat'>('notes');
  const [callDuration, setCallDuration] = useState(148); // start at 2m 28s for instant realism
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Clinical SOAP Notes
  const [soapNotes, setSoapNotes] = useState({
    subjective: 'Patient reports mild occasional fatigue for 3 weeks. Sleep duration 6.5 hours. No chest pain, syncope, or shortness of breath.',
    objective: 'Appears healthy, well-nourished. Vital signs within normal limits. Alert and oriented x3.',
    assessment: '1. Benign fatigue, likely work-related sleep hygiene.\n2. Routine preventive health maintenance.',
    plan: 'Order CBC, CMP, TSH, Ferritin labs. Recommended sleep hygiene protocol. Follow-up in 4 weeks or sooner if new symptoms arise.',
  });

  // Telehealth Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; time: string; text: string }>>([
    { sender: 'System', time: '10:00 AM', text: 'End-to-end encrypted WebRTC room established via Twilio Video Gateway.' },
    { sender: 'Dr. Sarah Chen', time: '10:01 AM', text: 'Hello! I have your recent lab results on screen. Can you hear and see me clearly?' },
    { sender: 'Patient', time: '10:01 AM', text: 'Yes Dr. Chen, audio and video are crystal clear.' },
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: true,
          });
          if (mounted) {
            streamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        }
      } catch (err) {
        console.warn('Webcam permission not granted, using simulated local feed:', err);
        if (mounted) {
          setCameraError('Camera access not granted or not supported in this frame. Simulated preview active.');
        }
      }
    }

    setupCamera();

    // Call timer
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle toggling audio tracks
  const handleToggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // toggle
      });
    }
    setIsMuted(!isMuted);
  };

  // Handle toggling video tracks
  const handleToggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff; // toggle
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    setChatMessages((prev) => [...prev, { sender: 'You', time: timeStr, text: newChatInput.trim() }]);
    setNewChatInput('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const doctorName = appointment?.providerName || 'Dr. Sarah Chen, MD';
  const specialty = appointment?.providerSpecialty || 'Primary Care';
  const roomSid = appointment?.videoRoomSid || 'RM-77402-METRO-TELEHEALTH';

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[780px] max-w-7xl mx-auto">
      {/* Telehealth Top Bar */}
      <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold text-slate-100">{doctorName}</span>
            <span className="text-slate-400">({specialty})</span>
          </div>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Lock className="w-3 h-3 text-teal-400" />
            <span>Twilio Video Room: {roomSid}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono tabular-nums bg-slate-800/80 px-2.5 py-1 rounded text-slate-200">
            <span>Duration:</span>
            <span className="text-emerald-400 font-bold">{formatTimer(callDuration)}</span>
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:block">
            <span>HIPAA BAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Call View Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left 2 Cols: Video Stage */}
        <div className="lg:col-span-2 relative bg-slate-900 flex items-center justify-center overflow-hidden">
          {/* Remote Video (Doctor Stream) */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/src/assets/images/telehealth_clinic_hero_1791899886659.jpg"
              alt="Telehealth Consult"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-95"
            />
            {/* Scrim overlay with doctor identity */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            {/* Doctor info tag overlay */}
            <div className="absolute bottom-5 left-5 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700/60 text-xs">
              <div className="font-semibold text-white flex items-center gap-2">
                <span>{doctorName}</span>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-1.5 py-0.5 rounded font-mono">MD ATTENDING</span>
              </div>
              <div className="text-slate-400 text-[11px]">1080p WebRTC · 48kHz Opus Audio</div>
            </div>
          </div>

          {/* Local Video Picture-in-Picture (Patient Stream) */}
          <div className="absolute top-5 right-5 w-44 sm:w-52 aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-xl z-20">
            {!isVideoOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center bg-slate-900">
                <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
                <span>Camera Off</span>
              </div>
            )}

            {cameraError && !streamRef.current && (
              <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-2 text-slate-300 text-xs">
                <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold mb-1">
                  You
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Local Feed (Mirror)</div>
              </div>
            )}

            <div className="absolute bottom-1.5 left-2 text-[10px] font-medium bg-black/60 px-1.5 py-0.5 rounded text-white flex items-center gap-1">
              <span>You (Patient)</span>
              {isMuted && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
            </div>
          </div>

          {/* Screen Sharing Notification if active */}
          {isScreenSharing && (
            <div className="absolute top-5 left-5 bg-blue-600/90 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 z-20">
              <Share2 className="w-3.5 h-3.5" />
              <span>You are presenting your screen</span>
            </div>
          )}

          {/* Bottom Call Controls Strip */}
          <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-3 z-30">
            <button
              onClick={handleToggleMute}
              className={`p-3.5 rounded-full transition-all ${
                isMuted
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={handleToggleVideo}
              className={`p-3.5 rounded-full transition-all ${
                isVideoOff
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={isVideoOff ? 'Start Video' : 'Stop Video'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3.5 rounded-full transition-all ${
                isScreenSharing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title="Share Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={onEndCall}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Consultation</span>
            </button>
          </div>
        </div>

        {/* Right Col: Clinical Telehealth Sidebar */}
        <div className="bg-slate-900 border-l border-slate-800 flex flex-col h-full">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-teal-500 text-teal-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SOAP Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'vitals'
                  ? 'border-teal-500 text-teal-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Vitals</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'border-teal-500 text-teal-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4">
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">Clinical Encounter Record</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Saving
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Subjective (S)</label>
                  <textarea
                    rows={2}
                    value={soapNotes.subjective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Objective (O)</label>
                  <textarea
                    rows={2}
                    value={soapNotes.objective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Assessment (A)</label>
                  <textarea
                    rows={2}
                    value={soapNotes.assessment}
                    onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Plan & Rx (P)</label>
                  <textarea
                    rows={3}
                    value={soapNotes.plan}
                    onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'vitals' && (
              <div className="space-y-4">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Real-Time Biometric Streams
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                    <div className="text-slate-400 text-[11px]">Heart Rate</div>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">72 bpm</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sinus Rhythm</div>
                  </div>

                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                    <div className="text-slate-400 text-[11px]">Blood Pressure</div>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">118/76</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Optimal Range</div>
                  </div>

                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                    <div className="text-slate-400 text-[11px]">Oxygen Saturation</div>
                    <div className="text-xl font-bold font-mono text-teal-400 mt-1 tabular-nums">99%</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">SpO2 Room Air</div>
                  </div>

                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                    <div className="text-slate-400 text-[11px]">Body Temperature</div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">98.4°F</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Normothermic</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-300 space-y-1.5">
                  <div className="font-semibold text-slate-200">Device Stream Source</div>
                  <div className="text-[11px] text-slate-400">
                    Connected via Bluetooth Medical Gateway (BLE 5.2). Measurements encrypted with AES-256 before transmission.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg text-xs ${
                        msg.sender === 'System'
                          ? 'bg-slate-800/60 text-slate-400 border border-slate-700/50 text-[11px]'
                          : msg.sender === 'You'
                          ? 'bg-teal-700 text-white ml-6'
                          : 'bg-slate-800 text-slate-200 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[11px] mb-1 opacity-80">
                        <span>{msg.sender}</span>
                        <span className="font-mono text-[10px]">{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={newChatInput}
                    onChange={(e) => setNewChatInput(e.target.value)}
                    placeholder="Type HIPAA-protected message..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
