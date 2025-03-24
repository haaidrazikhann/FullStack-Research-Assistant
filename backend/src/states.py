from pydantic import BaseModel

class State(BaseModel):
    query: str
    results: list[dict] = []
    response: str = ""