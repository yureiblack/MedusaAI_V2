import asyncio
from nodes.search import search_node
from nodes.summarizer import summarizer_node

async def run():
    query = input("Enter your query: ")

    state = {
        "query": query,
        "search_queries": [query],
        "mode": "links" if "link" in query.lower() else "summary",
        "errors": []
    }

    print("\n STEP 1: SEARCH NODE\n")
    state = search_node(state)
    print("Documents fetched:", len(state.get("documents", [])))
    print(state.get("documents", [])[:1])  # preview 1 doc

    print("\n STEP 2: SUMMARIZER NODE\n")
    state = await summarizer_node(state)
    print("Summaries generated:")
    print(state["output"]["summaries"])

    print("\n STEP 3: GLOBAL SUMMARY\n")
    print(state["output"]["global_summary"])

    print("\n LINKS\n")
    print(state["output"]["links"])

    print("\n ERRORS\n")
    print(state.get("errors"))

asyncio.run(run())