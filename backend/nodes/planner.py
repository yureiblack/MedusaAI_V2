from llm.engine import generate

def planner_node(state):
    prompt = f"Break into 3 search queries:\n{state['query']}"
    output = generate(prompt)

    queries = [q.strip("- ").strip() for q in output.split("\n") if q.strip()]
    state["search_queries"] = queries[:3]

    return state
