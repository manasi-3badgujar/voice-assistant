import { useState, useCallback, useEffect } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { matchIntent } from "../lib/intentMatcher";
import { loadChat, saveChat } from "../lib/storage";

const loadAnalytics = () =>
  JSON.parse(localStorage.getItem("voice_assistant_analytics")) || {
    totalQueries: 0,
    lastIntent: "None",
    lastConfidence: 0,
  };

export function useVoiceAssistant() {
  const [conversation, setConversation] = useState(loadChat());
  const [thinking, setThinking] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(loadAnalytics());

  const { speak, isSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    localStorage.setItem(
      "voice_assistant_analytics",
      JSON.stringify(analytics)
    );
  }, [analytics]);

  const addMessage = useCallback((role, text) => {
    setConversation(prev => {
      const updated = [...prev, { role, text }];
      saveChat(updated);
      return updated;
    });
  }, []);

  const handleFinal = useCallback(
  (text) => {
    if (isSpeaking) return;

    addMessage("user", text);
    setThinking(true);

    setTimeout(() => {
      const results = matchIntent(text);

      const combinedResponse = results.map(r => r.response).join(" ");

      addMessage("assistant", combinedResponse);
      speak(combinedResponse);

      setAnalytics(a => ({
        totalQueries: a.totalQueries + 1,
        lastIntent: results.map(r => r.intent).join(", "),
        lastConfidence: Math.round(
          (results.reduce((s, r) => s + r.confidence, 0) / results.length) * 100
        ),
      }));

      setThinking(false);
    }, 2000); 
  },
  [isSpeaking, addMessage, speak]
);


  const speech = useSpeechRecognition(handleFinal);

  return {
    ...speech, // 👈 THIS exposes noInput
    conversation,
    thinking,
    isSpeaking,
    analytics,
    darkMode,
    toggleDarkMode: () => setDarkMode(d => !d),
    clearChat: () => {
      setConversation([]);
      localStorage.removeItem("chat");
    },
    clearAnalytics: () => {
      const reset = { totalQueries: 0, lastIntent: "None", lastConfidence: 0 };
      setAnalytics(reset);
      localStorage.setItem(
        "voice_assistant_analytics",
        JSON.stringify(reset)
      );
    },
  };
};