# MedusaAI: Intelligent Agentic AI Research Assistant

MedusaAI is a fully autonomous AI research assistant designed to go beyond traditional NLP systems. It leverages agentic workflows, real-time web search, and multi-step reasoning to generate comprehensive, structured research reports.

---

## Overview

MedusaAI demonstrates the evolution from traditional RAG (Retrieval-Augmented Generation) to **Agentic AI Systems**. It doesn't just retrieve information; it plans, filters, summarizes, validates, and refines research content autonomously.

### Key Capabilities
- **Agentic Workflows**: Multi-step reasoning powered by LangGraph.
- **Real-time Research**: Live web searching and data aggregation.
- **Structured Outputs**: Professional reports with abstract, findings, and sources.
- **Topic Expansion**: Automatically suggests follow-up questions and related topics.
- **Export Options**: Download research as PDF or Markdown.

---

##  System Architecture

```text
React (Vite) Frontend
         │
         ▼
  FastAPI Backend ◄────► Supabase (Auth/Database)
         │
         ▼
  LangGraph Agent Workflow
  ┌─────────────────────────────────────────┐
  │ Search → Filter → Summarize → Validate  │
  └─────────────────────────────────────────┘
         │
         ▼
  Final Report + Follow-ups + Topics
```

---

## Local Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (3.11 or higher)
- **Git**

### 2. Clone the Repository
```bash
git clone <repository-url>
cd MedusaAI_V2
```

### 3. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your API keys (Supabase, Groq, Tavily) in the `.env` file.
5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://127.0.0.1:8000`.

### 4. Frontend Configuration
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ensure `VITE_API_BASE_URL` points to your running backend (default: `http://127.0.0.1:8000`).
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173` (or the port shown in your terminal).

---

## 📁 Project Structure

```text
MedusaAI_V2/
├── backend/            # FastAPI + LangGraph logic
│   ├── llm/            # Model configurations
│   ├── nodes/          # Individual agent nodes (search, summarizer, etc.)
│   ├── main.py         # API entry point
│   ├── graph.py        # Workflow definition
│   └── .env            # Backend secrets
├── frontend/           # React + Vite application
│   ├── src/            # Components, Hooks, and Pages
│   ├── public/         # Static assets
│   └── .env            # Frontend configuration
├── api/                # Vercel serverless functions (for deployment)
└── database/           # Database schemas and scripts
```

---

## Usage Example

1. **Open the App**: Navigate to `http://localhost:5173`.
2. **Research Query**: Enter a topic like *"The future of quantum computing in cryptography"*.
3. **Execution**: Watch as the agents perform web searches, filter results, and compile a report.
4. **Review**: Read the generated report, explore follow-up questions, and export the result as a PDF or Markdown file.

---

## Tech Stack
- **Frontend**: React, Vite, Axios, React Markdown.
- **Backend**: FastAPI, Python 3.11, LangGraph, LangChain.
- **Database/Auth**: Supabase.
- **LLMs**: Groq (Llama 3).
- **Search**: Tavily API.

---