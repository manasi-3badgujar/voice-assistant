import { useVoiceAssistant } from "./hooks/useVoiceAssistant";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import MicControl from "./components/MicControl";
import AnalyticsPanel from "./components/AnalyticsPanel";

export default function App() {
  const assistant = useVoiceAssistant();

  return (
    <div className={assistant.darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Header {...assistant} />
          <ChatWindow {...assistant} />
          <MicControl {...assistant} />
          <AnalyticsPanel analytics={assistant.analytics} />
          {assistant.isSpeaking && (
            <div className="mic-blocked-msg">
              🔇 Assistant is speaking
              <div className="text-sm opacity-90 mt-1">
                Microphone is temporarily disabled
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};