from llm.engine import generate


def _normalize_line(line: str) -> str:
    line = line.strip()
    while line and (line[0].isdigit() or line[0] in {"-", "*", ".", ")"}):
        line = line[1:].strip()
    return line


def _query_tokens(topic: str):
    stop = {
        "a", "an", "the", "in", "on", "of", "for", "to", "and", "or", "with", "by", "from",
        "about", "at", "is", "are"
    }
    return [w for w in topic.lower().split() if len(w) > 2 and w not in stop]


def _is_topic_grounded(candidate: str, topic_tokens):
    c = candidate.lower()
    return any(t in c for t in topic_tokens)


def _fallback_queries(topic: str):
    return [
        f"{topic} historical development timeline key milestones",
        f"{topic} current implementation methods tools case studies",
        f"{topic} future challenges limitations risks ethics",
    ]


def planner_node(state):
    raw_iteration_count = state.get("iteration_count")
    iteration_count = (raw_iteration_count or 0) + 1
    critique = (state.get("critique") or "").strip()
    query = (state.get("query") or "").strip()

    if critique:
        prompt = (
            f"Previous attempt was insufficient: {critique}\n"
            f"Refine the search strategy. Generate 3 targeted queries for: {query}\n"
            "STRICT: Return exactly 3 lines only; one query per line; no headings, numbering, or commentary.\n"
            "STRICT: Focus on factual, technical sources and avoid marketing content."
        )
    else:
        prompt = (
            f"Research Topic: {query}\n"
            "Generate 3 distinct search queries.\n"
            "STRATEGY: Break the topic into (1) Historical Context, (2) Current Implementation, and (3) Future Challenges.\n"
            "STRICT: Return exactly 3 lines only; one query per line; no headings, numbering, or commentary.\n"
            "STRICT: Ensure queries are optimized for technical documentation and academic results."
        )

    output = generate(prompt)
    topic_tokens = _query_tokens(query)

    parsed = []
    seen = set()
    for raw in output.split("\n"):
        q = _normalize_line(raw)
        if not q:
            continue
        q_lower = q.lower()
        if q_lower in seen:
            continue
        seen.add(q_lower)
        if topic_tokens and not _is_topic_grounded(q, topic_tokens):
            continue
        parsed.append(q)
        if len(parsed) == 3:
            break

    if len(parsed) < 3:
        for q in _fallback_queries(query or "AI in healthcare"):
            q_lower = q.lower()
            if q_lower not in seen:
                parsed.append(q)
                seen.add(q_lower)
            if len(parsed) == 3:
                break

    return {
        "search_queries": parsed[:3],
        "iteration_count": iteration_count,
        "is_valid": True,
        "critique": "",
    }
