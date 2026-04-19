from llm.engine import generate

def report_node(state):
    summaries = state["summaries"]
    query = state["query"].lower()
    combined = "\n".join(summaries)

    # Detect if the user wants a simple summary or is asking a simple factual question
    query_text = query.strip()
    summary_keywords = ["summary", "brief", "short", "paragraph", "bullet", "list", "overview", "words"]
    report_keywords = ["research", "analyze", "detailed", "report", "comprehensive", "deep dive"]
    factual_starters = ["who is", "what is", "where is", "when did", "how many"]
    
    # Logic: 
    # 1. If they explicitly ask for a report/detailed analysis -> Full Report
    # 2. If they explicitly ask for a summary/brief -> Summary
    # 3. If it starts with a factual "Who/What/When" AND is short -> Summary
    # 4. Otherwise (How/Why or general topics) -> Full Report
    
    force_report = any(word in query_text for word in report_keywords)
    force_summary = any(word in query_text for word in summary_keywords)
    
    is_factual_lookup = any(query_text.startswith(starter) for starter in factual_starters) and len(query_text.split()) < 6
    
    is_summary_request = (force_summary or (is_factual_lookup and not force_report))

    if is_summary_request:
        # Simplified prompt for clean summaries
        prompt = f"""
        You are an expert research assistant. 
        
        The user wants a clean, concise summary about: "{state['query']}"
        
        Using the research findings below, provide a well-written response.
        STRICT RULES:
        1. Do NOT use headings like "Executive Summary" or "Conclusion".
        2. Follow the user's requested format (e.g., if they asked for a paragraph, give a paragraph).
        3. Keep it professional and informative.

        Research Findings:
        {combined}
        """
    else:
        # Standard structured prompt for deep-dive research
        prompt = f"""
        You are an expert research assistant.
        
        Synthesize a professional research report for: "{state['query']}"

        Summaries:
        {combined}

        Structure:
        # Executive Summary
        ## Deep Dive Analysis
        ## Key Takeaways
        ## Conclusion
        """

    report = generate(prompt)
    state["final_report"] = report
    return state