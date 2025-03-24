from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from states import State

load_dotenv()

google_api_key = os.environ.get("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(api_key=google_api_key,model="gemini-2.0-flash",temperature=0)

def generate_response(state: State) -> State:
    template = """
    Take the retrieved information {results} and give the user insights on it.
    The response from you should be structured and professional but not dry either.
    """
    prompt = PromptTemplate(
        input_variables=["results"],
        template=template
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    response = chain.run(results=state.results)
    return State(query=state.query, results=state.results, response=response)
