export default function MicButton({ listening, startListening, stopListening }) {
  return (
    <button className="mic" onClick={listening ? stopListening : startListening}>
      {listening ? "⏹ Stop" : "🎤 Start"}
    </button>
  );
};