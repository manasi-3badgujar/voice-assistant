import { useEffect, useRef, useState } from "react";

export function useSpeechRecognition(onFinal) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [noInput, setNoInput] = useState(false);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;

    rec.onresult = e => {
      clearTimeout(silenceTimerRef.current); // ✅ input detected
      setNoInput(false);

      let finalText = "";
      for (let r of e.results) {
        r.isFinal
          ? (finalText += r[0].transcript)
          : setTranscript(r[0].transcript);
      }

      if (finalText.trim()) {
        setTranscript("");
        onFinal(finalText.trim());
      }
    };

    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;
  }, []);

  const startListening = () => {
    if (window.speechSynthesis.speaking) return;

    setListening(true);
    setTranscript("");
    setNoInput(false);

    recognitionRef.current.start();

    // ⏱️ 5s silence timeout
    silenceTimerRef.current = setTimeout(() => {
      recognitionRef.current.stop();
      setListening(false);
      setNoInput(true);
    }, 5000);
  };

  const stopListening = () => {
    clearTimeout(silenceTimerRef.current);
    recognitionRef.current.stop();
    setListening(false);
    setTranscript("");
  };

  return {
    listening,
    transcript,
    noInput,
    startListening,
    stopListening,
  };
};