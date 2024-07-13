import os
from typing import Literal, TypedDict, List
from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openai import OpenAI
from langchain_community.document_loaders import ArxivLoader
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from langgraph.checkpoint import MemorySaver
from dotenv import load_dotenv
import requests
import uuid
import subprocess
import tempfile
from typing import List
from collections import defaultdict
import re

load_dotenv()
# Set up OpenAI client with custom base URL
print("Environment variables:")
for key, value in os.environ.items():
    print(f"{key}: {value}")
AIML_API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(
    api_key=AIML_API_KEY,
    base_url=os.environ.get("OPENAI_BASE_URL"),
)
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID")
# FastAPI app setup
app = FastAPI(title="LLM Researcher")

summary_storage = defaultdict(list)

# Pydantic models
class SearchRequest(BaseModel):
    query: str
    max_results: int = 3

class PaperSummary(BaseModel):
    id: str
    title: str
    authors: str
    published: str
    summary: str

class SearchResponse(BaseModel):
    results: List[PaperSummary]

class TextToSpeechRequest(BaseModel):
    summary_id: str

# Define the state schema
class State(dict):
    query: str
    max_results: int
    papers: List[dict]
    summaries: List[PaperSummary]

def clean_summary(text):
    # This regex keeps letters, numbers, spaces, and basic punctuation
    return re.sub(r'[^a-zA-Z0-9\s.,;:!?()"-]', '', text)

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
Aim for about 200 words and return plain text.
"""
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert in summarizing scientific papers."},
                {"role": "user", "content": prompt}
            ],
        )
        summary = response.choices[0].message.content
        summary_id = str(uuid.uuid4())
        cleaned_summary = clean_summary(summary)
        summaries.append(PaperSummary(
            id=summary_id,
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
    summary_storage[request.query] = final_state["summaries"]
    return SearchResponse(results=final_state["summaries"])


@app.post("/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest):
    # Find the summary with the given ID
    summary = None
    for summaries in summary_storage.values():
        summary = next((s for s in summaries if s.id == request.summary_id), None)
        if summary:
            break
    
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")

    # Create a unique filename for the audio file
    audio_filename = f"summary_audio_{request.summary_id}.mp3"
    audio_path = os.path.join("audio_files", audio_filename)

    # Ensure the audio_files directory exists
    os.makedirs("audio_files", exist_ok=True)

    # ElevenLabs API request
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    data = {
        "text": summary.summary,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()

        # Save the audio file
        with open(audio_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)

        # Return the audio file
        return FileResponse(audio_path, media_type="audio/mpeg", filename=audio_filename)

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"TTS API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9999)
