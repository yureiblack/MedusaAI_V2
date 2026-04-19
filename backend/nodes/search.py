from tavily import TavilyClient
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))



# fetching full webpages

def fetch_full_content(url: str) -> str:
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        # remove noise
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.extract()

        text = soup.get_text(separator=" ")

        # clean text
        text = " ".join(text.split())

        return text[:3000]  # limit size

    except Exception:
        return ""



# search node

def search_node(state):
    results = []
    errors = state.get("errors", [])

    try:
        for q in state.get("search_queries", []):
            response = client.search(
                query=q,
                search_depth="advanced", 
                max_results=5
            )

            for r in response.get("results", []):
                results.append({
                    "url": r.get("url"),
                    "content": r.get("content", "")
                })

    except Exception as e:
        errors.append(f"Tavily failed: {str(e)}")

    # Ensure we have at least some documents
    state["documents"] = results[:8]
    state["errors"] = errors
    return state