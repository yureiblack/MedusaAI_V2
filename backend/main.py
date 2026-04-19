from fastapi import FastAPI, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from graph import graph
from exports.exporter import export_pdf, export_markdown
from auth import get_current_user
from supabase_client import supabase

app = FastAPI()

# In production, specify your Vercel URL here or use os.getenv("PROD_URL")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://medusa-ai-v2.vercel.app", # Your production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/research")
async def research(data: dict, user_id: str = Depends(get_current_user)):
    state = {
        "query": data["query"],
        "search_queries": [],
        "results": [],
        "filtered_results": [],
        "summaries": [],
        "final_report": "",
        "followups": [],
        "expanded_topics": [],
        "errors": []
    }

    result = await graph.ainvoke(state)

    # Save to Supabase
    supabase.table("conversations").insert({
        "user_id": user_id,
        "query": data["query"],
        "report": result["final_report"]
    }).execute()

    return result

@app.get("/history")
async def get_history(user_id: str = Depends(get_current_user)):
    rows = supabase.table("conversations") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()

    return rows.data

from fastapi.responses import FileResponse

@app.post("/export/pdf")
async def pdf(data: dict, user_id: str = Depends(get_current_user)):
    path = export_pdf(data["text"])
    return FileResponse(path, filename="research_report.pdf", media_type="application/pdf")

@app.post("/export/md")
async def md(data: dict, user_id: str = Depends(get_current_user)):
    path = export_markdown(data["text"])
    return FileResponse(path, filename="research_report.md", media_type="text/markdown")