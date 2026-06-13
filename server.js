import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Schemes Database
const SCHEMES_DB_PATH = path.join(__dirname, 'schemes_db.json');
let schemesData = [];

try {
  const fileContent = fs.readFileSync(SCHEMES_DB_PATH, 'utf-8');
  schemesData = JSON.parse(fileContent);
  console.log(`Loaded ${schemesData.length} welfare schemes from database.`);
} catch (error) {
  console.error("Error reading schemes database:", error);
}

// 1. Get all schemes
app.get('/api/schemes', (req, res) => {
  res.json(schemesData);
});

// 2. Programmatic Eligibility Calculator
app.post('/api/eligibility', (req, res) => {
  const { occupation, income, ownsLand, age, gender, hasGirlChild } = req.body;
  
  const ageNum = parseInt(age, 10) || 0;
  const isFemale = gender === 'female';
  const hasLand = ownsLand === 'yes';
  const hasGirl = hasGirlChild === 'yes';
  
  const results = schemesData.map(scheme => {
    let eligible = true;
    const reasons = [];

    // PM-KISAN rules
    if (scheme.id === 'pm-kisan') {
      if (occupation !== 'farmer') {
        eligible = false;
        reasons.push("Must be a farmer.");
      }
      if (!hasLand) {
        eligible = false;
        reasons.push("Must own cultivable agricultural land.");
      }
    }

    // Ayushman Bharat rules
    if (scheme.id === 'ayushman-bharat') {
      if (income !== 'low') {
        eligible = false;
        reasons.push("Family income must be below ₹1.5 Lakhs per year.");
      }
    }

    // PMAY rules
    if (scheme.id === 'pmay') {
      if (income !== 'low' && income !== 'medium') {
        eligible = false;
        reasons.push("Household income must be below ₹3 Lakhs per year.");
      }
    }

    // PM Ujjwala rules
    if (scheme.id === 'pmuy') {
      if (!isFemale) {
        eligible = false;
        reasons.push("Applicant must be female.");
      }
      if (ageNum < 18) {
        eligible = false;
        reasons.push("Applicant must be 18 years or older.");
      }
      if (income !== 'low') {
        eligible = false;
        reasons.push("Must belong to a Below Poverty Line (BPL) household.");
      }
    }

    // MGNREGA rules
    if (scheme.id === 'mgnrega') {
      if (ageNum < 18) {
        eligible = false;
        reasons.push("Must be an adult (18+).");
      }
      if (occupation !== 'farmer' && occupation !== 'worker') {
        eligible = false;
        reasons.push("Must be a rural worker or farmer willing to do manual labor.");
      }
    }

    // Sukanya Samriddhi rules
    if (scheme.id === 'ssy') {
      if (!hasGirl) {
        eligible = false;
        reasons.push("Must have a girl child under 10 years old.");
      }
    }

    // PM Mudra rules
    if (scheme.id === 'pmmy') {
      if (occupation !== 'entrepreneur') {
        eligible = false;
        reasons.push("Must be an entrepreneur or small business owner.");
      }
      if (ageNum < 18) {
        eligible = false;
        reasons.push("Must be 18 years or older.");
      }
    }

    // Atal Pension rules
    if (scheme.id === 'apy') {
      if (ageNum < 18 || ageNum > 40) {
        eligible = false;
        reasons.push("Age must be between 18 and 40 years.");
      }
    }

    // PM Suraksha Bima rules
    if (scheme.id === 'pmsby') {
      if (ageNum < 18 || ageNum > 70) {
        eligible = false;
        reasons.push("Age must be between 18 and 70 years.");
      }
    }

    return {
      scheme,
      eligible,
      reasons
    };
  });

  res.json(results);
});

// 3. Grounded RAG Chatbot using Gemini
app.post('/api/chat', async (req, res) => {
  const { message, history, language, customApiKey } = req.body;
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: "Gemini API key is missing. Please configure it in settings." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build RAG context from the schemes database
    let groundingContext = "You are Seva (सेवा), an empathetic and helpful welfare schemes assistant for citizens of India. Here is the official database of schemes you must ground your answers in:\n\n";
    
    schemesData.forEach(scheme => {
      groundingContext += `[Scheme ID: ${scheme.id}]\n`;
      groundingContext += `Name: ${JSON.stringify(scheme.name)}\n`;
      groundingContext += `Description: ${JSON.stringify(scheme.description)}\n`;
      groundingContext += `Benefits: ${JSON.stringify(scheme.benefits)}\n`;
      groundingContext += `Eligibility Criteria: ${JSON.stringify(scheme.eligibility_criteria.text)}\n`;
      groundingContext += `Required Documents: ${JSON.stringify(scheme.documents)}\n`;
      groundingContext += `Official Link: ${scheme.apply_link}\n\n`;
    });

    groundingContext += `Instructions:
1. Always respond in the language requested (English, Hindi, or Tamil).
2. Answer the user's questions accurately using only the facts from the database above. If you don't know or if it's not in the database, politely say you don't have that information.
3. Be supportive, concise, and structured. Use bullet points and bold formatting for clarity.
4. Keep the persona of Seva (सेवा), the friendly chatbot.`;

    const chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: groundingContext }] },
        { role: 'model', parts: [{ text: "Understood. I will act as Seva and ground my responses strictly in the provided welfare schemes database in the user's language." }] },
        // Map history to gemini format (role: 'user' | 'model')
        ...history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      ]
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    res.json({ text: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Error contacting Gemini AI: " + error.message });
  }
});

// Serve static frontend assets in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});