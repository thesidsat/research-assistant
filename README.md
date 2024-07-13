# Langgraph Hackathon - Research Assistant

  

This repo provides an API for searching and summarizing scientific papers using LangChain, LangGraph, and AI/ML API. It allows users to search for research papers on arXiv and get concise summaries with the option to read out the summaries

  

## Features

  

- Search for scientific papers on arXiv based on user queries

- Summarize papers using preferred LLM and let AI read it out to you 

- Configurable number of responses

- FastAPI-based REST API

- LangGraph workflow


  
  

## Installation

 
1. Clone the repository:

2. Install dependencies:

    `pip install -r requirements.txt`
3. - Create a `.env` file in the project root - Add your AI/ML API key and base URL: ``` OPENAI_API_KEY=your_openai_api_key_here OPENAI_BASE_URL=https://api.aimlapi.com ```

## Usage 
1. Start the server: `python main.py`
2.  The API will be available at `http://localhost:9999`  Use the `/search` endpoint to search and summarize papers
3. run `python client.py`
4. The API will return a JSON response with summaries of the found papers.
5. Pass paperid in payload to generate tts of the summary to the following endpoint `http://localhost:9999/text-to-speech`

## Customization 
To modify the summarization prompt, edit the `prompt` variable in the `summarize_papers` function in `main.py`. - To change the GPT model used for summarization, update the `model` parameter in the `client.chat.completions.create` call. - To extend the workflow, add new nodes to the `StateGraph` in `main.py`.
