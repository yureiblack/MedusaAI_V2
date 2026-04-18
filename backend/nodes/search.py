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
                search_depth="basic",
                max_results=3
            )

            for r in response.get("results", []):
                url = r.get("url")

                # Fetch real content
                full_content = fetch_full_content(url)

                results.append({
                    "url": url,
                    "content": full_content if full_content else r.get("content", "")
                })

    except Exception as e:
        errors.append(f"Tavily failed: {str(e)}")

    # limit results
    results = results[:5]

    state["documents"] = results
    state["errors"] = errors

    return state