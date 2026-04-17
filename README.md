# Intelligent Agentic AI Research Assistant

---

## Project Title  
**Intelligent Agentic AI Research Assistant (React PWA + LangGraph Backend)**

---

## Motive  

The objective of this project is to build a **fully autonomous AI research assistant** that goes beyond traditional NLP systems by incorporating:

- Agentic workflows  
- Real-time web search  
- Multi-step reasoning  
- Structured report generation  

This project demonstrates the evolution from:
> Traditional NLP Pipelines → Retrieval-Augmented Generation → Agentic AI Systems

---

## Description  

This is a **full-stack AI application** consisting of:

### Frontend (React PWA)
- Progressive Web App (installable)
- User-friendly interface for research queries
- Displays reports, sources, follow-ups, and topics

### Backend (FastAPI + LangGraph)
- Executes agentic workflow
- Handles search, summarization, reasoning, and report generation
- Provides API endpoints for frontend communication

---

## System Architecture  
```text
React PWA (Frontend)
        ↓
FastAPI Backend
        ↓
LangGraph Agent Workflow
        ↓
Search → Filter → Summarize → Validate → Report
        ↓
Follow-up Questions + Topic Expansion
        ↓
PDF / Markdown Export
```

---

## Installation Instructions  

### 1. Clone Repository
```bash
git clone <your-repo-link>
cd project
```

---

### 2. Backend Setup

#### Install Python 3.11 (if not installed)
Using Homebrew:
```bash
brew install python@3.11
```

```bash
cd backend
python3.11 -m venv venv
```

#### Activate Virtual Environment
```bash
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Run Backend Server
```bash
uvicorn main:app --reload
```

#### Backend runs at:
```bash
http://127.0.0.1:8000
```

---

### 3. Frontend Setup (React PWA)
```bash
cd frontend
npm install
npm start
```

#### Frontend runs at:
```bash
http://localhost:3000
```

---

## Usage Example

### Step 1: Open Application
Go to:
```bash
http://localhost:3000
```

### Step 2: Enter Query
Example: Impact of Artificial Intelligence in Healthcare

### Step 3: Generate Results
- The system will:

    - Perform web search

    - Summarize multiple sources

    - Generate structured report

### Step 4: Output Includes
- Research Report
    - Title
    - Abstract
    - Key Findings
    - Sources
    - Conclusion

- Follow-up Questions
    - Suggested next research directions

- Expanded Topics
    - Related subtopics for deeper exploration

### Step 5: Export Options
- Export as PDF
- Export as Markdown

---

## Project Structure

```text
milestone_2/
├── backend/
│   ├── nodes/
│   ├── llm/
│   ├── utils/
│   ├── exports/
│   ├── state.py
│   ├── graph.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## Features Implemented

### Core Functionalities
- Accept open-ended research queries
- Perform real-time web search
- Aggregate multi-source information
- Maintain state across workflow
- Generate structured research reports

### Agentic Capabilities
- Multi-step LangGraph workflow
- Query planning
- Validation and error handling
- Retrieval-augmented generation

### Extensions
- Follow-up question generation
- Topic expansion
- PDF export
- Markdown export

### Error Handling
- The system handles:
    - Missing or insufficient search results
    - API or model failures
    - Noisy or duplicate sources
    - Displays user-friendly error messages

### Future Improvements
- Session-based memory
- Chat-style UI
- Better source ranking
- Agent retry loops (self-correcting AI)
- Deployment (Render + Vercel)