import requests
import json
import os

def search_papers(query: str, max_results: int = 1):
    # API endpoint URL
    url = "http://localhost:9999/search"  # Adjust this if your server is running on a different host/port
    
    # Request payload
    payload = {
        "query": query,
        "max_results": max_results
    }
    
    # Headers
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        # Send POST request
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        
        # Check if the request was successful
        response.raise_for_status()
        
        # Parse the JSON response
        results = response.json()
        
        # Print the results
        print(f"Search Results for query: '{query}'")
        for i, paper in enumerate(results['results'], 1):
            print(f"\nPaper {i}:")
            print(f"ID: {paper['id']}")
            print(f"Title: {paper['title']}")
            print(f"Authors: {paper['authors']}")
            print(f"Published: {paper['published']}")
            print(f"Summary: {paper['summary']}")
        
        return results['results']
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def text_to_speech(summary_id: str):
    url = "http://localhost:9999/text-to-speech"
    
    payload = {
        "summary_id": summary_id
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, stream=True)
        response.raise_for_status()
        
        # Save the audio file
        file_name = f"summary_{summary_id}.wav"
        with open(file_name, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        print(f"Audio saved as {file_name}")
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    search_query = "Machine learning"
    papers = search_papers(search_query, max_results=1)
    
    if papers and len(papers) > 0:
        paper = papers[0]
        print(f"\nGenerating audio for the summary of: {paper['title']}")
        text_to_speech(paper['id'])
    else:
        print("No papers found or an error occurred during the search.")
