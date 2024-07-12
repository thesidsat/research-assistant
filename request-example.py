import requests
import json

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
            print(f"Title: {paper['title']}")
            print(f"Authors: {paper['authors']}")
            print(f"Published: {paper['published']}")
            print(f"Summary: {paper['summary']}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Example usage
if __name__ == "__main__":
    search_query = "quantum computing"
    search_papers(search_query, max_results=2)