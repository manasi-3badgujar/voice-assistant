"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalQueries: 0,
    lastIntent: "None",
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [processingQuery, setProcessingQuery] = useState(false);
  // ✅ NEW: Assistant wave states
  const [assistantVolumes, setAssistantVolumes] = useState(new Array(20).fill(0));

  const QA = [
    { intent: "greeting", keywords: ["hello", "hi", "hey"], response: "Hello! How can I assist you today?" },
    { intent: "introduction", keywords: ["who are you", "who r u", "your name"], response: "I am your smart hotel voice assistant, here to help you with anything you need." },
    { intent: "thanks", keywords: ["thank you", "thanks", "thx"], response: "You're welcome! 😊 Happy to help." },
    { intent: "food", keywords: ["food", "breakfast", "menu", "order"], response: "Our restaurant is open 24/7. You can order food from the in-room tablet or by calling extension 9." },
    { intent: "water", keywords: ["water", "bottle", "drinking water"], response: "Sure! Housekeeping will deliver two bottles of drinking water shortly." },
    { intent: "housekeeping", keywords: ["clean room", "housekeeping", "towel", "linen"], response: "Housekeeping has been notified. They will attend to your room in 10–15 minutes." },
    { intent: "wifi", keywords: ["wifi", "internet"], response: "The WiFi password is: ROOM1234." },
    { intent: "pool", keywords: ["swimming pool", "pool"], response: "The swimming pool is open from 6 AM to 8 PM." },
    { intent: "gym", keywords: ["gym", "fitness"], response: "Our gym is open 24 hours and accessible using your room card." },
    { intent: "checkout", keywords: ["check out", "checkout"], response: "Standard checkout time is 11 AM. You can request late checkout based on availability." },
    { intent: "location", keywords: ["location", "address"], response: "We are located at 12th Cross, MG Road, Bangalore." },
  ];

  const FALLBACK = "I'm sorry, I didn't understand that. Could you please rephrase?";

  const recognitionRef = useRef(null);
  const chatRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const assistantAnimationRef = useRef(null);
  const thinkingAnimationRef = useRef(null); // ✅ NEW: Thinking animation
  const silenceTimeoutRef = useRef(null);
  const [volumes, setVolumes] = useState(new Array(20).fill(0));
  const mediaStreamRef = useRef(null);
  const isProcessingRef = useRef(false);

  // 🗄️ LocalStorage persistence - CHAT
  useEffect(() => {
    const savedChat = localStorage.getItem("chat_history");
    if (savedChat) setConversation(JSON.parse(savedChat));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(conversation));
  }, [conversation]);

  // 🗄️ LocalStorage persistence - ANALYTICS
  useEffect(() => {
    const savedAnalytics = localStorage.getItem("voice_assistant_analytics");
    if (savedAnalytics) {
      try {
        setAnalytics(JSON.parse(savedAnalytics));
      } catch {
        setAnalytics({ totalQueries: 0, lastIntent: "None" });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("voice_assistant_analytics", JSON.stringify(analytics));
  }, [analytics]);

  const clearAnalytics = () => {
    const resetAnalytics = { totalQueries: 0, lastIntent: "None" };
    setAnalytics(resetAnalytics);
    localStorage.setItem("voice_assistant_analytics", JSON.stringify(resetAnalytics));
  };

  const clearChat = () => {
    setConversation([]);
    localStorage.removeItem("chat_history");
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [conversation]);

  // ✅ NEW: Assistant "listening/thinking" wave animation
  const animateThinkingWaveform = () => {
    if (!thinking) return;
    
    const time = Date.now() * 0.002;
    const arr = Array.from({ length: 20 }, (_, i) => {
      const listeningWave = 0.1 + 0.3 * Math.sin(time * 1.5 + i * 0.4);
      const pulse = 0.2 * Math.sin(time * 0.8);
      const noise = 0.1 * Math.random();
      return Math.max(0.05, Math.min(0.8, listeningWave + pulse + noise));
    });
    setAssistantVolumes(arr);
    thinkingAnimationRef.current = requestAnimationFrame(animateThinkingWaveform);
  };

  // ✅ Assistant speaking wave animation
  const animateAssistantWaveform = () => {
    if (!isSpeaking) return;
    
    const time = Date.now() * 0.003;
    const arr = Array.from({ length: 20 }, (_, i) => {
      const baseWave = 0.2 + 0.5 * Math.sin(time + i * 0.25);
      const noise = 0.15 * (Math.random() - 0.5);
      return Math.max(0.1, Math.min(1, baseWave + noise));
    });
    setAssistantVolumes(arr);
    assistantAnimationRef.current = requestAnimationFrame(animateAssistantWaveform);
  };

  // Speech synthesis - UPDATED
  const speak = (text) => {
    stopListening();
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setProcessingQuery(true);
      try { recognitionRef.current?.stop(); } catch {}
      if (thinkingAnimationRef.current) {
        cancelAnimationFrame(thinkingAnimationRef.current);
      }
      animateAssistantWaveform(); // Speaking waves
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setProcessingQuery(false);
      if (assistantAnimationRef.current) {
        cancelAnimationFrame(assistantAnimationRef.current);
      }
      setAssistantVolumes(new Array(20).fill(0));
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setProcessingQuery(false);
      if (assistantAnimationRef.current) {
        cancelAnimationFrame(assistantAnimationRef.current);
      }
      setAssistantVolumes(new Array(20).fill(0));
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const normalizeText = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]/g, "");

  const matchIntents = (text) => {
    const normalizedInput = normalizeText(text);
    const matched = [];

    QA.forEach(q => {
      q.keywords.forEach(k => {
        if (normalizedInput.includes(normalizeText(k))) {
          matched.push(q);
        }
      });
    });

    const uniqueIntents = [];
    const seenIntents = new Set();
    matched.forEach(match => {
      if (!seenIntents.has(match.intent)) {
        seenIntents.add(match.intent);
        uniqueIntents.push(match);
      }
    });

    return uniqueIntents.length ? uniqueIntents : null;
  };

  const handleFinalizedSpeech = (text) => {
    if (isSpeaking || processingQuery || isProcessingRef.current) {
      setTranscript("");
      return;
    }

    isProcessingRef.current = true;
    setProcessingQuery(true);

    setConversation((p) => [...p, { role: "user", text: text.trim() }]);
    setThinking(true);
    animateThinkingWaveform(); // ✅ Start assistant listening animation

    setTimeout(() => {
      const matches = matchIntents(text);
      const reply = matches ? matches.map(m => m.response).join(" ") : FALLBACK;

      setAnalytics((p) => ({
        totalQueries: p.totalQueries + 1,
        lastIntent: matches ? matches.map(m => m.intent).join(", ") : "unknown",
      }));

      speak(reply);
      setConversation((p) => [...p, { role: "assistant", text: reply }]);
      setThinking(false);
      if (thinkingAnimationRef.current) {
        cancelAnimationFrame(thinkingAnimationRef.current);
      }
      
      isProcessingRef.current = false;
      setProcessingQuery(false);
    }, 500);
  };

  // Speech recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e) => {
      if (isSpeaking || processingQuery || isProcessingRef.current) {
        setTranscript("");
        return;
      }
      
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          setTranscript(result[0].transcript);
        }
      }
      
      if (finalText.trim()) {
        setTranscript("");
        handleFinalizedSpeech(finalText.trim());
      }
    };

    rec.onend = () => {
      if (listening && !isSpeaking && !processingQuery) {
        setTimeout(() => {
          if (listening && !isSpeaking && !processingQuery) {
            try { rec.start(); } catch {}
          }
        }, 100);
      }
    };

    recognitionRef.current = rec;
  }, [listening, isSpeaking, processingQuery]);

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      if (!isSpeaking && !processingQuery) stopListening();
    }, 10000);
  };

  const startListening = async () => {
    if (isSpeaking || processingQuery || isProcessingRef.current) return;
    
    setListening(true);
    setTranscript("");

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      recognitionRef.current.start();
      resetSilenceTimer();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      animateWaveform();
    } catch (err) {
      alert("Microphone permission required.");
      setListening(false);
    }
  };

  const stopListening = () => {
    setListening(false);
    setProcessingQuery(false);
    
    try {
      recognitionRef.current?.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    } catch {}

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (assistantAnimationRef.current) cancelAnimationFrame(assistantAnimationRef.current);
    if (thinkingAnimationRef.current) cancelAnimationFrame(thinkingAnimationRef.current);
    setTranscript("");
    setVolumes(new Array(20).fill(0));
    setAssistantVolumes(new Array(20).fill(0));
  };

  const animateWaveform = () => {
    if (!listening || isSpeaking || processingQuery || !analyserRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const arr = Array.from({ length: 20 }, (_, i) => dataArrayRef.current[i] / 255);
    setVolumes(arr);
    animationRef.current = requestAnimationFrame(animateWaveform);
  };

  // ✅ Get current volumes (user or assistant)
  const currentVolumes = isSpeaking ? assistantVolumes : volumes;
  const showWaves = (listening && !isSpeaking && !processingQuery) || isSpeaking || thinking;

  return (
    <div className={`${darkMode ? "bg-black text-white" : "bg-white text-black"} min-h-screen transition-all`}>
      {/* ✅ RESPONSIVE CONTAINER */}
      <div className="max-w-5xl mx-auto py-4 px-3 sm:py-6 sm:px-4 md:py-8 md:px-6">
        
        {/* ✅ RESPONSIVE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left">Voice Concierge</h1>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
            <button 
              onClick={clearChat} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex-1 sm:flex-none"
            >
              Clear Chat
            </button>
            <button 
              onClick={clearAnalytics} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all flex-1 sm:flex-none"
            >
              Clear Analytics
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all flex-1 sm:flex-none"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* ✅ RESPONSIVE CHAT */}
        <div 
          ref={chatRef} 
          className={`flex flex-col gap-2 sm:gap-3 h-[320px] sm:h-[400px] md:h-[430px] overflow-y-auto p-3 sm:p-6 border-2 rounded-2xl shadow-md sm:shadow-2xl transition-all ${
            darkMode 
              ? "bg-[#111] border-gray-700" 
              : "bg-gradient-to-br from-gray-50 to-gray-100 border-blue-200"
          }`}
        >
          {conversation.map((msg, i) => (
            <div 
              key={i} 
              className={`p-2.5 sm:p-4 rounded-xl max-w-[90%] sm:max-w-[80%] shadow-lg transition-all text-sm sm:text-base ${
                msg.role === "user" 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white self-end" 
                  : darkMode 
                  ? "bg-gray-800/80 backdrop-blur-sm text-white self-start" 
                  : "bg-white/80 backdrop-blur-sm shadow-xl text-black self-start"
              }`}
            >
              <b>{msg.role === "user" ? "👤 You" : "🤖 Assistant"}:</b> {msg.text}
            </div>
          ))}
          {/* ✅ NEW: Assistant Listening/Thinking Animation */}
          {thinking && (
            <div className="p-2.5 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 text-white animate-pulse max-w-[90%] sm:max-w-[80%] self-start shadow-lg border-2 border-indigo-300">
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-0.5 h-8 w-24">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div 
                      key={i} 
                      className="w-1 rounded-full shadow-md bg-white/90" 
                      style={{ 
                        height: `${6 + Math.sin(Date.now() * 0.015 + i * 0.3) * 12 + (thinking ? Math.random() * 8 : 0)}px`,
                        animation: 'none',
                        transition: 'height 0.1s ease-out'
                      }} 
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="text-sm sm:text-base font-medium">🤖 Listening...</span>
                  </div>
                  <span className="text-xs opacity-90 block">Processing your request</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ RESPONSIVE LISTENING STATUS */}
        {listening && !isSpeaking && !processingQuery && (
          <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border-2 text-sm sm:text-base shadow-lg ${
            darkMode 
              ? "bg-gray-800/80 border-gray-600 text-gray-200" 
              : "bg-blue-50 border-blue-200"
          }`}>
            <b>🎤 Listening:</b> {transcript || <span className="animate-pulse">Adjusting microphone...</span>}
          </div>
        )}

        {/* ✅ RESPONSIVE MIC SECTION - TRIPLE MODE WAVES */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-10 mb-6 sm:mb-8">
          {/* ✅ Waves for user listening, assistant thinking, OR assistant speaking */}
          {showWaves && (
            <div className="flex items-end gap-0.5 sm:gap-1 h-20 sm:h-24 mb-3 sm:mb-4 w-full max-w-sm justify-center">
              {currentVolumes.map((v, i) => (
                <div 
                  key={i} 
                  className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ease-out shadow-lg ${
                    // Indigo for thinking, Purple for speaking, Blue for user
                    thinking
                      ? "bg-gradient-to-t from-indigo-400 to-purple-500"
                      : isSpeaking
                      ? "bg-gradient-to-t from-purple-400 to-pink-500"
                      : darkMode 
                      ? "bg-gradient-to-t from-emerald-400 to-emerald-500" 
                      : "bg-gradient-to-t from-blue-400 to-cyan-400"
                  }`} 
                  style={{ height: `${12 + v * 45}px`, transformOrigin: 'bottom' }} 
                />
              ))}
            </div>
          )}

          {/* Responsive Mic Button - FIXED */}
          <div className="flex items-center justify-center">
            <button
              onClick={listening ? stopListening : startListening}
              disabled={isSpeaking || processingQuery}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                isSpeaking || processingQuery
                  ? "bg-gradient-to-br from-purple-500 via-pink-600 to-purple-700 ring-8 ring-purple-400/60 shadow-purple-500/50 animate-pulse" 
                  : listening 
                  ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 ring-8 ring-red-400/60 shadow-red-500/50 animate-pulse" 
                  : "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 ring-8 ring-blue-400/60 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/50"
              }`}
            >
              <svg 
                className="w-10 h-10 sm:w-12 sm:h-12 transition-all group-hover:scale-110" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
                {showWaves && (
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    className="animate-ping" 
                    style={{animationDuration: '1.2s'}} 
                    opacity="0.6"
                  />
                )}
              </svg>
              {showWaves && (
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 via-purple-500/30 to-indigo-500/30 animate-ping-slow" 
                  style={{animationDuration: '1.8s'}}
                />
              )}
            </button>
          </div>
        </div>

        {/* ✅ RESPONSIVE ANALYTICS - Bottom Right */}
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 w-64 sm:w-72 p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-xl border z-50 transition-all hover:scale-105 hover:shadow-3xl" style={{ 
          background: darkMode ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)", 
          borderColor: darkMode ? "#374151" : "#e5e7eb",
          color: darkMode ? "#f9fafb" : "#1f2937"
        }}>
          <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">📊 Analytics <span className="text-xs opacity-75">(Saved)</span></h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <p><span className="font-medium">Total Queries:</span> <b className="text-blue-400">{analytics.totalQueries}</b></p>
            <p><span className="font-medium">Last Intent:</span> <b className={analytics.lastIntent === "unknown" ? "text-orange-400" : "text-green-400"}>{analytics.lastIntent}</b></p>
            <p className="text-xs opacity-75 pt-2 border-t border-gray-200/50 flex items-center gap-2">
              <span className={isSpeaking ? "text-orange-400" : "text-green-400"}>•</span>
              Speaking: <b>{isSpeaking ? "YES" : "NO"}</b>
            </p>
          </div>
        </div>

        {/* ✅ RESPONSIVE MIC BLOCK WARNING - Bottom Left */}
        {isSpeaking && (
          <div className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 w-64 sm:w-72 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-xl border-4 border-orange-400/50 z-50 animate-pulse" style={{ 
            background: darkMode ? "rgba(124, 58, 237, 0.95)" : "rgba(251, 146, 60, 0.95)", 
            color: "white"
          }}>
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl">🔇</span>
              <div>
                <b className="block text-base sm:text-lg">Microphone Blocked</b>
                <p className="text-xs sm:text-sm opacity-90 mt-1">Assistant is speaking</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
