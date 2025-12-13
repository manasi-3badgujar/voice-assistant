________________________________________
# 🎤 Voice Concierge — Hotel Voice Assistant

Voice Concierge is a fully browser-based hotel voice assistant that allows guests to speak, receive rule-based voice responses, and view the entire conversation in a clean chat-style interface.

Built for the **RoomMitra Voice Concierge Assignment**, this application runs completely on the client with *no backend and no paid APIs*.

---

## 🚀 Live Demo
Deployed on Vercel  
https://voice-assistant-omega-lime.vercel.app

---

## 🛠 Tech Stack

- Next.js 14
- Tailwind CSS
- Web Speech API (STT + TTS)
- Web Audio API
- React Hooks
- localStorage

---

## 🎯 Core Assignment Features (Implemented)

✅ Browser-based Speech-to-Text with Start / Stop microphone  
✅ Live transcription display  
✅ Rule-based canned responses using keyword matching  
✅ Fallback response for unrecognized queries  
✅ Browser Text-to-Speech using default voice  
✅ Full conversation displayed in chat format  
✅ Clean and responsive UI  
✅ Runs fully in the browser with no backend  

---

## ✨ Bonus Features Implemented

🔊 **Audio Wave Visualizations**
- User listening waveform
- Assistant thinking animation
- Assistant speaking waveform

🌙 **Dark / Light Mode Toggle**

📊 **Analytics Dashboard**
- Total queries asked
- Last detected intent
- Speaking and listening indicators

💾 **LocalStorage Persistence**
- Chat history
- Analytics data (survives refresh)

⏱ **Auto Silence Handling**
- Microphone stops automatically after inactivity

📱 **Responsive UI**
- Optimized for tablet and desktop

---

## 🧠 How It Works (Brief)

🎙 **Speech-to-Text**
- Uses the browser’s Web Speech API
- Converts spoken input into text in real time
- Interim and final transcripts handled separately

🧠 **Rule-Based Matching**
- User input is normalized and matched against predefined keywords
- Multiple intents can be matched per query
- If no match is found, a fallback response is returned:
  “I’m sorry, I didn’t understand that. Could you please rephrase?”

🔊 **Text-to-Speech**
- Uses the browser’s SpeechSynthesis API
- Default system voice
- Microphone is blocked while the assistant is speaking

---

## 🏨 Supported Use Cases

- Room service (food, water)
- Housekeeping requests
- Hotel facilities (WiFi, pool, gym)
- Checkout timing and hotel location
- Greetings and general queries

---

## ⚠️ Limitations

- Keyword-based matching only (no AI, NLP, or fuzzy search)
- Best experience in Google Chrome
- Limited speech recognition support on iOS Safari
- Requires microphone permission from the browser
- Internet connection required for browser STT (browser-dependent)
- Auto-response accepting after assistant reply is **not available**

---

## 🔒 Privacy

- No backend
- No audio recordings stored
- All processing happens locally in the browser
- Data stored only in localStorage

---

## ▶️ Run Locally

Clone the repository and run:

git clone <your-repo-url>  
npm install  
npm run dev  

Open http://localhost:3000 in your browser.

---
