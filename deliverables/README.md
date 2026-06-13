# SevaSetu (सेवासेतु) — Prototype Access Guide

**SevaSetu (सेवासेतु • சேவாசேது)** is an industry-grade, AI-powered welfare scheme awareness platform designed to bridge information asymmetry for rural and underserved populations in India. The application features a conversational interface grounded in official schemes, a programmatic eligibility calculator, and printable document checklists.

---

## 🚀 Accessing & Running the Prototype

The project runs on a concurrent dual-server architecture with an Express.js API backend and a Vite React frontend.

### Prerequisites
- **Node.js**: `v18.x` or higher (verified on `v26.2.0`)
- **Gemini API Key**: Required for AI chatbot responses. You can obtain a free key from the [Google AI Studio](https://aistudio.google.com/).

### Installation
If you need to install dependencies, run the following in the project root (`/home/doom/NSS`):
```bash
npm install
```

### Launching Development Servers
To start the frontend and backend servers concurrently, run:
```bash
npm run dev
```

### Local Access Points
- **Frontend App (Vite)**: [http://localhost:5173](http://localhost:5173)
- **Backend API (Express)**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 AI Chatbot Activation (Gemini API Key)

The prototype supports two methods for setting up your Gemini API key:

1. **Environment Variable**: Create a `.env` file at the project root with your key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
2. **In-App Settings Panel**: Click the settings gear icon (⚙️) on the top right of the UI. Enter your key in the **Gemini API Key** field and click **Save**. This persists the key securely in your browser's local storage (`seva_gemini_key`).

---

## 🏗️ Core Architecture & File Structure

```
NSS/
├── server.js              # Express.js backend (RAG retrieval & Gemini API proxy)
├── schemes_db.json        # Unified schemes database (9 core welfare programs)
├── package.json           # Project metadata, dependencies, and concurrent run script
├── vite.config.js         # Vite configuration (routes client /api requests to port 5000)
└── src/
    ├── main.jsx           # Client entrypoint
    ├── App.jsx            # Main app shell (manages tabs, language, theme state, settings popup)
    ├── index.css          # Design system stylesheet (glassmorphic layout, themes, animations)
    ├── translations.js    # Multilingual translation dictionary (English, Hindi, Tamil)
    └── components/
        ├── MascotLogo.jsx        # Status-aware SVG animated mascot ("Seva")
        ├── ChatInterface.jsx     # Conversational interface with Voice STT & Voice TTS
        ├── EligibilityWizard.jsx  # 5-step interactive eligibility questionnaire
        └── DocumentChecklist.jsx  # Printable custom document checklist (popup modal)
```

---

## 🌟 Key Technical Features

1. **RAG-Grounded Chatbot**: The backend parses user queries, extracts keywords, queries the local schema database (`schemes_db.json`), and feeds relevant context to the Gemini `gemini-2.0-flash` model. This prevents AI hallucinations and limits answers strictly to the official scheme details.
2. **Eligibility Wizard**: A step-by-step wizard capturing occupation, income, land ownership, age, gender, and household status. It queries the backend programmatic rule-engine endpoint `/api/eligibility` to filter matching schemes.
3. **Mascot Interaction**: "Seva" is a vector SVG mascot that responds dynamically to the app state (changes animations on `listening`, `thinking`, `speaking`, and `idle`).
4. **Multilingual (i18n)**: Instant runtime switching between English (EN), Hindi (HI), and Tamil (TA) across both the UI and the chatbot's voice narration.
5. **Acoustic Voice Support**:
   - **Speech to Text (STT)**: Allows speech queries in local accents using Web Speech API.
   - **Text to Speech (TTS)**: Narrates answers with localized Indian speech profiles for rural access.
6. **Unified Modal System**: High-fidelity glassmorphism overlay popups for both Settings and Document Checklists that automatically scale and color-theme depending on the chosen design profile.
