# SevaSetu (सेवासेतु • சேவாசேது)
### AI-Based Multilingual Chatbot for Welfare Scheme Awareness

SevaSetu is an industry-grade, direct-to-citizen digital assistant built to bridge information asymmetry in rural and semi-urban India. By utilizing Retrieval-Augmented Generation (RAG) powered by Gemini and a programmatic rule-calculation engine, the platform enables citizens to discover government welfare schemes, verify eligibility, and generate printable checklists of required documentation.

---

## 🌟 Key Features

*   **RAG-Grounded AI Chatbot**: Employs Gemini (`gemini-2.0-flash`) with dynamic keyword-extraction context injection. Answers are grounded in the official schemes database (`schemes_db.json`) to prevent AI hallucinations.
*   **Eligibility Wizard**: An interactive, 5-step demographic questionnaire covering occupation, income, agricultural land ownership, age, gender, and household status, returning programmatically matched welfare programs.
*   **Multilingual Support (i18n)**: Instantly toggle UI languages and chatbot context between **English**, **Hindi (हिंदी)**, and **Tamil (தமிழ்)**.
*   **Acoustic Voice I/O**:
    *   *Speech-to-Text (STT)*: Allows users to ask questions verbally in local accents.
    *   *Text-to-Speech (TTS)*: Reads responses aloud using high-fidelity localized Indian speech synthesis models.
*   **Responsive Glassmorphism UI**: High-fidelity, floating card aesthetics with three selectable design themes: *Seva Gold* (warm orange), *Dark Velvet* (purple dark-mode), and *Emerald Care* (accessible green).
*   **Print-Ready Checklists**: Custom popups displaying document checklists with print-friendly formatting (automatically stripping navbars and backgrounds for physical prints) and a mock SMS sharing simulator.

---

## 🏗️ Technology Stack

*   **Frontend**: React `v19.x`, Vite `v8.x`, Web Speech API (STT / TTS).
*   **Backend**: Node.js, Express `v5.x` (featuring async route handlers).
*   **AI Engine**: Google Generative AI SDK (`@google/generative-ai` v2.0+).
*   **Styling**: Vanilla CSS with HSL variables.

---

## 💻 Local Quickstart

### 1. Clone & Install
```bash
git clone https://github.com/doomguy04/SevaSetu-AI-Based-Multilingual-Chatbot-for-Welfare-Scheme-Awareness-project.git
cd SevaSetu-AI-Based-Multilingual-Chatbot-for-Welfare-Scheme-Awareness-project
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root of the project:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Alternatively, you can input your Gemini key inside the application's in-app ⚙️ Settings panel to store it in local storage.)*

### 3. Run Development Servers
Start both the React development server (Vite) and the Node API server (Express) concurrently:
```bash
npm run dev
```
*   **Frontend Access**: [http://localhost:5173](http://localhost:5173)
*   **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Production Deployment Guide

SevaSetu is designed to be deployed as a single unified service where the Express backend serves both the API endpoints and the static compiled frontend assets.

### 1. Build the Frontend
Compile the React frontend into static HTML/JS/CSS assets:
```bash
npm run build
```
This generates a production-ready bundle inside the `dist/` directory at the project root.

### 2. Node.js Production Routing
The Express backend (`server.js`) handles static routing automatically:
```javascript
// Serve static client assets
app.use(express.static(path.join(__dirname, 'dist')));

// Wildcard fallback to direct all other routes to React's index.html
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

### 3. Deploying to PaaS (Render, Railway, Heroku)

These hosting platforms compile and run the application directly from the Git repository.

#### Render Deployment Steps:
1. Create a new **Web Service** and connect your repository.
2. Select **Node** as the environment runtime.
3. Configure the build and start commands:
   *   **Build Command**: `npm install && npm run build`
   *   **Start Command**: `npm start`
4. Add the following **Environment Variables** in the dashboard:
   *   `GEMINI_API_KEY`: *(Your Google AI Studio Key)*
   *   `NODE_ENV`: `production`
   *   `PORT`: `10000` *(Render will map this automatically)*

#### Railway Deployment Steps:
1. Create a new project, select **Deploy from GitHub repo**, and select your repository.
2. Railway will read the `package.json` scripts and run standard startup checks.
3. Go to the service **Variables** settings page and add `GEMINI_API_KEY` and `PORT`.

---

### 4. Deploying to Cloud VMs (AWS EC2, DigitalOcean, GCP)

For deployments on virtual machines running Linux (Ubuntu/Debian):

#### Step A: Build and Run Daemon (PM2)
Install PM2 globally to keep the Node process running in the background:
```bash
npm install -g pm2
npm run build
pm2 start server.js --name "sevasetu"
pm2 save
pm2 startup
```

#### Step B: Configure Nginx as Reverse Proxy
Install Nginx to route external requests (Port 80/443) to the internal Node server (Port 5000):
```bash
sudo apt update
sudo apt install nginx
```
Edit the Nginx configuration `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

#### Step C: SSL Encryption (Certbot)
Secure the server using Let's Encrypt SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### 5. Containerized Deployment (Docker)

If deploying to Docker-based services (ECS, Kubernetes, GCP Cloud Run), use this multi-stage build:

Create a `Dockerfile` at the root:
```dockerfile
# Stage 1: Build Frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve Backend & Frontend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY server.js schemes_db.json ./
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server.js"]
```



#Team Members->
Shrestha Shrinivas
Yuvraj
Vivek Kumar
Vansh Kumar

Build and run the container:
```bash
docker build -t sevasetu .
docker run -p 5000:5000 -e GEMINI_API_KEY="your_api_key" sevasetu
```
