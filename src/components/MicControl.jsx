import Waveform from "./Waveform";

export default function MicControl({
  listening,
  startListening,
  stopListening,
  isSpeaking,
  thinking,
}) {
  const micClass = isSpeaking
    ? "mic-speaking"
    : listening
    ? "mic-listening"
    : "mic-idle";

  return (
    <div className="flex flex-col items-center mt-10">
      {(listening || thinking) && !isSpeaking && (
        <Waveform active={true} mode="user" />
      )}

      {isSpeaking && <Waveform active={true} mode="assistant" />}

      <button
        onClick={listening ? stopListening : startListening}
        disabled={isSpeaking}
        className={`mic-btn ${micClass}`}
      >
        {/* SVG mic icon */}
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>
    </div>
  );
};