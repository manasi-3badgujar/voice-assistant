# 🎤 Voice Concierge – Browser-Based Hotel Voice Assistant

Voice Concierge is a fully client-side React web application that allows users to interact with a hotel assistant using voice. The application uses native browser Speech-to-Text (STT) and Text-to-Speech (TTS) APIs, responds using rule-based logic, and runs entirely in the browser without any backend or paid services.

---

## 🚀 Features Overview

- 🎙️ Voice input using browser Speech-to-Text (STT)
- 🔊 Spoken responses using browser Text-to-Speech (TTS)
- 🧠 Rule-based intent matching (keyword + fuzzy matching)
- 💬 Full conversation display (user + assistant)
- ⏯️ Clear Start / Stop microphone control
- 🌙 Full-page Dark / Light mode
- 💾 LocalStorage persistence (chat + analytics)
- ❌ No backend
- ❌ No external or paid APIs
- 🌐 Runs fully in the browser

---

## 🛠 Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **Browser SpeechRecognition API**
- **Browser SpeechSynthesis API**
- **LocalStorage**

---

## 🎙 How Speech-to-Text (STT) Is Implemented

Speech-to-Text is implemented using the browser’s native `SpeechRecognition` API.

### Flow
1. User clicks the microphone button to start listening.
2. The browser captures audio input via the microphone.
3. Interim transcripts are displayed live while the user is speaking.
4. A final transcript is captured when speech ends.
5. The microphone automatically stops when:
   - Speech is completed
   - No input is detected for 5 seconds
   - The assistant starts speaking

### Notes
- No third-party or paid APIs are used.
- Microphone permission is required.
- Best supported on Chromium-based browsers.

---

## 🔊 How Text-to-Speech (TTS) Is Implemented

Text-to-Speech is implemented using the browser’s native `SpeechSynthesisUtterance` API.

### Flow
1. After intent resolution, the assistant generates a text response.
2. The response is passed to `SpeechSynthesisUtterance`.
3. The browser speaks the response using its default voice.
4. While the assistant is speaking:
   - The microphone is fully disabled
   - User input is blocked
   - A visual “Assistant is speaking” indicator is shown

This ensures clean, turn-based interaction between the user and the assistant.

---

## 🧠 How Queries Are Matched (Keyword + Fuzzy Search)

The application uses a **rule-based intent matching system**.

### 1. Keyword Matching
Each intent is defined by:
- An intent name
- A list of associated keywords
- A predefined response

**Example**
- Keywords: `food`, `menu`, `order`
- Intent: `food`
- Response: Restaurant information

### 2. Fuzzy Matching
To improve robustness:
- User input is normalized (lowercased, punctuation removed)
- Partial word similarity is calculated
- A confidence score is generated
- Intents above a confidence threshold are selected

### 3. Multi-Intent Handling
If a single query contains multiple valid intents:
- All matched intents are answered in one response
- Duplicate intents within the same query are answered only once

**Example**
> “What’s the wifi password and gym timing?”

The assistant responds with both answers.

### 4. Fallback Handling
If no intent meets the confidence threshold:
> “I’m sorry, I didn’t understand that. Could you please rephrase?”

---

## ⭐ Bonus Features Added

In addition to the required functionality, the following enhancements were implemented:

- 📊 Analytics panel (total queries, last intent, confidence score)
- 📈 Confidence score display for intent matching
- 🎧 User listening waveform animation
- 🔊 Assistant speaking waveform animation
- 🔇 Automatic microphone blocking while assistant speaks
- ⏱️ Auto-stop microphone after 5 seconds of silence
- 💡 “No input received” feedback message
- 🧠 Assistant “thinking / processing” state before replying
- 📱 Fully responsive UI (mobile & desktop)
- 🎨 Tailwind CSS with gradient-based design

---

## 💾 Persistence

- Chat history is stored in `localStorage`
- Analytics data is stored in `localStorage`
- Data is automatically restored on page reload

---

## ⚠️ Limitations

- Speech recognition accuracy depends on browser and microphone quality
- Best experience on Chrome and Edge
- Safari has partial support
- Firefox support is limited / experimental
- No server-side processing or persistence

---

## ▶️ Running the Application Locally

```bash
npm install
npm run dev

Then open:

http://localhost:5173

## 🚀 Live Demo

https://voice-assistant-mocha-ten.vercel.app/