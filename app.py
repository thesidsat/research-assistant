import os
from typing import Literal, TypedDict, List
from fastapi import FastAPI, Query
from pydantic import BaseModel
from openai import OpenAI
from langchain_community.document_loaders import ArxivLoader
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from langgraph.checkpoint import MemorySaver
from dotenv import load_dotenv
load_dotenv()
# Set up OpenAI client with custom base URL
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    base_url=os.environ.get("OPENAI_BASE_URL"),
)
# 
# FastAPI app setup
app = FastAPI(title="LLM Research Paper Search and Summarize API")

# Pydantic models
class SearchRequest(BaseModel):
    query: str
    max_results: int = 3

class PaperSummary(BaseModel):
    title: str
    authors: str
    published: str
    summary: str

class SearchResponse(BaseModel):
    results: List[PaperSummary]

# Define the state schema
class State(TypedDict):
    query: str
    max_results: int
    papers: List[dict]
    summaries: List[PaperSummary]

# Define the search function
def search_arxiv(state: State):
    loader = ArxivLoader(query=state["query"], load_max_docs=state["max_results"])
    docs = loader.load()
    state["papers"] = [
        {
            "title": doc.metadata.get("Title", "No title"),
            "authors": doc.metadata.get("Authors", "No authors"),
            "published": doc.metadata.get("Published", "No date"),
            "content": doc.page_content[:2000] 
        } for doc in docs
    ]
    return state

# Define the summarization function
def summarize_papers(state: State):
    summaries = []
    for paper in state["papers"]:
        prompt = f"""Summarize the following scientific paper:

Title: {paper['title']}
Authors: {paper['authors']}
Published: {paper['published']}

Content:
{paper['content']}

Provide a concise summary focusing on:
1. Main Objective
2. Key Innovation
3. Methodology
4. Principal Findings
5. Implications for the field

Aim for about 200 words.
"""
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert in summarizing scientific papers."},
                {"role": "user", "content": prompt}
            ],
        )
        summary = response.choices[0].message.content
        summaries.append(PaperSummary(
            title=paper['title'],
            authors=paper['authors'],
            published=paper['published'],
            summary=summary
        ))
    state["summaries"] = summaries
    return state

# Define the graph
workflow = StateGraph(State)

# Define nodes
workflow.add_node("search", search_arxiv)
workflow.add_node("summarize", summarize_papers)

# Set the entrypoint
workflow.set_entry_point("search")

# Add edges
workflow.add_edge("search", "summarize")
workflow.add_edge("summarize", END)

# Compile the graph
chain = workflow.compile()

@app.post("/search", response_model=SearchResponse)
def search_llm_papers(request: SearchRequest):
    initial_state = State(
        query=request.query,
        max_results=request.max_results,
        papers=[],
        summaries=[]
    )
    final_state = chain.invoke(initial_state)
    return SearchResponse(results=final_state["summaries"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9999)