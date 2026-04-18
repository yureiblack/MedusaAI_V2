import os
import asyncio
import json
import re
from typing import List, Dict
from groq import Groq
from dotenv import load_dotenv


# load env
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not set in environment")

client = Groq(api_key=GROQ_API_KEY)


# config

MAX_DOCS = 3
MAX_CHUNKS_PER_DOC = 3
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


# helpers

def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except:
        pass

    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except:
        pass

    return None


def clean_text(text: str) -> str:
    return " ".join(text.split())


def finalize_text(text: str) -> str:
    text = clean_text(text)
    if text and not text.endswith("."):
        text += "."
    return text


def fallback_summary(text: str) -> str:
    sentences = text.split(".")
    return " ".join(sentences[:2])


def chunk_text(text: str) -> List[str]:
    chunks = []
    start = 0
    length = len(text)

    while start < length:
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks


# deterministic helpers

def generate_key_insights(summary: str) -> List[str]:
    sentences = summary.split(".")
    return [s.strip() for s in sentences if len(s.strip()) > 20][:3]


def generate_themes(summary: str) -> List[str]:
    words = summary.lower().split()
    keywords = ["ai", "healthcare", "diagnostics", "automation", "treatment", "data"]
    return list({w for w in words if w in keywords})[:3]


def generate_applications(summary: str) -> List[str]:
    keywords = {
        "imaging": "Medical imaging",
        "diagnostics": "Disease diagnosis",
        "drug": "Drug discovery",
        "analytics": "Predictive analytics",
        "treatment": "Personalized treatment",
        "workflow": "Workflow automation"
    }

    results = []
    for word, label in keywords.items():
        if word in summary.lower():
            results.append(label)

    return results[:3]


def generate_challenges(summary: str) -> List[str]:
    keywords = {
        "privacy": "Data privacy issues",
        "bias": "Model bias",
        "security": "Security risks",
        "regulation": "Regulatory challenges"
    }

    results = []
    for word, label in keywords.items():
        if word in summary.lower():
            results.append(label)

    return results[:3]


def merge_summaries(summaries: List[str]) -> str:
    seen = set()
    result = []

    for s in summaries:
        if s not in seen:
            seen.add(s)
            result.append(s)

    return " ".join(result)


# llm call

async def call_llm(prompt: str, retries: int = 2) -> str:
    for attempt in range(retries):
        try:
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": "Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
            )
            return response.choices[0].message.content

        except Exception:
            if attempt < retries - 1:
                await asyncio.sleep(2)
            else:
                raise


# chunk summary

async def summarize_chunk(chunk: str) -> Dict:
    prompt = f"""
Return ONLY JSON.

Format:
{{
  "summary": "...",
  "key_points": ["...", "..."],
  "applications": ["...", "..."],
  "challenges": ["...", "..."]
}}

TEXT:
{chunk}
"""

    try:
        response = await call_llm(prompt)
        data = extract_json(response)

        if not data:
            raise ValueError()

        return {
            "summary": finalize_text(data.get("summary", "")),
            "key_points": data.get("key_points", []),
            "applications": data.get("applications", []),
            "challenges": data.get("challenges", [])
        }

    except:
        return {
            "summary": finalize_text(fallback_summary(chunk)),
            "key_points": [],
            "applications": [],
            "challenges": []
        }


# document summary

async def summarize_document(chunk_summaries: List[Dict]) -> Dict:
    combined = "\n".join([c["summary"] for c in chunk_summaries])

    prompt = f"""
Return ONLY JSON.

Format:
{{
  "doc_summary": "...",
  "key_insights": ["...", "..."],
  "applications": ["...", "..."],
  "challenges": ["...", "..."]
}}

TEXT:
{combined}
"""

    try:
        response = await call_llm(prompt)
        data = extract_json(response)

        if not data:
            raise ValueError()

        return {
            "doc_summary": finalize_text(data.get("doc_summary", "")),
            "key_insights": data.get("key_insights", []),
            "applications": data.get("applications", []),
            "challenges": data.get("challenges", [])
        }

    except:
        return {
            "doc_summary": finalize_text(fallback_summary(combined)),
            "key_insights": [],
            "applications": [],
            "challenges": []
        }


# global summary

async def synthesize_global(doc_summaries: List[Dict]) -> Dict:
    combined = "\n".join([d["doc_summary"] for d in doc_summaries])

    prompt = f"""
Return ONLY JSON.

Format:
{{
  "summary": "...",
  "themes": ["...", "..."],
  "applications": ["...", "..."],
  "challenges": ["...", "..."]
}}

TEXT:
{combined}
"""

    try:
        response = await call_llm(prompt)
        data = extract_json(response)

        if not data:
            raise ValueError()

        return {
            "summary": finalize_text(data.get("summary", "")),
            "themes": data.get("themes", []),
            "applications": data.get("applications", []),
            "challenges": data.get("challenges", [])
        }

    except:
        return {}



# main node

async def summarizer_node(state: Dict) -> Dict:
    documents = state.get("documents", [])
    errors = state.get("errors", [])
    mode = state.get("mode", "summary")

    # links mode
    if mode == "links":
        state["output"] = {
            "links": [doc.get("url") for doc in documents],
            "summaries": [],
            "global_summary": {}
        }
        return state

    if not documents:
        errors.append("No documents to summarize")
        state["errors"] = errors
        return state

    documents = documents[:MAX_DOCS]

    final_summaries = []
    all_doc_summaries = []

    for doc in documents:
        content = doc.get("content", "")
        url = doc.get("url", "")

        if not content:
            continue

        try:
            chunks = chunk_text(content)[:MAX_CHUNKS_PER_DOC]

            chunk_summaries = await asyncio.gather(
                *[summarize_chunk(c) for c in chunks]
            )

            doc_summary = await summarize_document(chunk_summaries)

            summary_text = doc_summary["doc_summary"]

            final_summaries.append({
                "url": url,
                "summary": summary_text,
                "key_insights": doc_summary["key_insights"] or generate_key_insights(summary_text),
                "applications": doc_summary.get("applications") or generate_applications(summary_text),
                "challenges": doc_summary.get("challenges") or generate_challenges(summary_text),
            })

            all_doc_summaries.append(doc_summary)

        except Exception as e:
            errors.append(f"{url}: {str(e)}")

    # global summary
    try:
        global_summary = await synthesize_global(all_doc_summaries)

        if not global_summary.get("summary"):
            merged = merge_summaries([d["doc_summary"] for d in all_doc_summaries])

            global_summary = {
                "summary": finalize_text(merged),
                "themes": generate_themes(merged),
                "applications": generate_applications(merged),
                "challenges": generate_challenges(merged)
            }

        if not global_summary.get("applications"):
            global_summary["applications"] = generate_applications(global_summary["summary"])

        if not global_summary.get("challenges"):
            global_summary["challenges"] = generate_challenges(global_summary["summary"])

    except Exception:
        merged = merge_summaries([d["doc_summary"] for d in all_doc_summaries])

        global_summary = {
            "summary": finalize_text(merged),
            "themes": generate_themes(merged),
            "applications": generate_applications(merged),
            "challenges": generate_challenges(merged)
        }

    # final output
    state["output"] = {
        "summaries": final_summaries,
        "global_summary": global_summary,
        "links": [doc.get("url") for doc in documents]
    }

    state["errors"] = errors
    return state