from typing import TypedDict, List

class AgentState(TypedDict):
    query: str
    search_queries: List[str]
    results: List[dict]
    filtered_results: List[dict]
    summaries: List[str]
    final_report: str
    errors: List[str]
