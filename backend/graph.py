from langgraph.graph import StateGraph
from state import AgentState

from nodes.planner import planner_node
from nodes.search import search_node
from nodes.retriever import filter_node
from nodes.summarizer import summarize_node
from nodes.validator import validator_node
from nodes.report import report_node

builder = StateGraph(AgentState)

builder.add_node("planner", planner_node)
builder.add_node("search", search_node)
builder.add_node("filter", filter_node)
builder.add_node("summarize", summarize_node)
builder.add_node("validate", validator_node)
builder.add_node("report", report_node)

builder.set_entry_point("planner")

builder.add_edge("planner", "search")
builder.add_edge("search", "filter")
builder.add_edge("filter", "summarize")
builder.add_edge("summarize", "validate")
builder.add_edge("validate", "report")

graph = builder.compile()
