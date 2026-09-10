import os

from dotenv import load_dotenv
from google import genai

from app.schemas.ai_review import AIReview

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
def generate_review(code: str, findings: list):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
You are an AI coding tutor.

Review the following Python code based on the static analysis findings.

Code:
{code}

Static analysis findings:
{findings}

Do not provide corrected code.
Guide the learner toward understanding and fixing the problem themselves.

Return:
- explanation
- concept
- why_it_matters
- hint
""",
        config={
            "response_mime_type": "application/json",
            "response_schema": AIReview,
        },
    )

    return AIReview.model_validate_json(response.text)