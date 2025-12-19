export default function Header({
  darkMode,
  toggleDarkMode,
  clearChat,
  clearAnalytics,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        🎤 Voice Concierge
      </h1>

      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        <button
          onClick={clearChat}
          className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Clear Chat
        </button>

        <button
          onClick={clearAnalytics}
          className="px-3 py-2 text-sm rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
        >
          Clear Analytics
        </button>

        <button
          onClick={toggleDarkMode}
          className="px-3 py-2 text-sm rounded-lg bg-gray-800 text-white"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </div>
  );
};