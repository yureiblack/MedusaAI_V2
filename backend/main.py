from fastapi import FastAPI, Header, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback
from graph import graph
from exports.exporter import export_pdf, export_markdown
from auth import get_current_user
from supabase_client import supabase

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "traceback": traceback.format_exc(),
            "detail": "Global error handler caught an unhandled exception"
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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