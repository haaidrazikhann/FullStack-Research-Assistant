import os
from dotenv import load_dotenv
from states import State
from tavily import TavilyClient

load_dotenv()

tavily_api_key = os.environ.get("TAVILY_API_KEY")

client = TavilyClient(api_key=tavily_api_key)

def websearch(state: State):
    search_results = client.search(state.query)
    raw_results = search_results.get("results",[])
    formatted_results = [
        {
            "title": result.get("title", "No Title"),
            "url": result.get("url", "No URL"),
            "content": result.get("content", "No Content")
        }
        for result in raw_results
    ]

    return State(query=state.query,results=formatted_results)