from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from websearch import websearch
from aggregator import generate_response
from states import State
from fastapi.middleware.cors import CORSMiddleware

class Request(BaseModel):
    query: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/search", response_model=State)
def search_query(request: Request):
    try:
        state = State(query=request.query)  # Initialize state
        
        # Fetch search results
        state = websearch(state)
        
        # Check if search results exist before calling LLM
        if not state.results:
            raise HTTPException(status_code=404, detail="No search results found.")

        # Generate LLM response
        state = generate_response(state)
        
        return state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "AI Search API is running!"}
