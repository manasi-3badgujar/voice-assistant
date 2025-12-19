export default function ChatWindow({
  conversation,
  transcript,
  thinking,
  noInput,
}) {
  return (
    <div className="chat-container">
      {conversation.map((m, i) => (
        <div
          key={i}
          className={m.role === "user" ? "chat-user" : "chat-assistant"}
        >
          <b>{m.role === "user" ? "👤 You" : "🤖 Assistant"}:</b> {m.text}
        </div>
      ))}

      {thinking && (
        <div className="system-thinking">
          🤖 Processing your request...
        </div>
      )}

      {noInput && (
        <div className="system-warning">
          🤖 No input received. Please try again.
        </div>
      )}

      {transcript && (
        <div className="text-xs opacity-70">🎤 {transcript}</div>
      )}
    </div>
  );
};