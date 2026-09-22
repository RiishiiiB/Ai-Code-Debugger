import json
import os

from google import genai


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_learning_feedback(
    thinking: str,
    attempted_code: str,
    findings: list,
):
    findings_text = json.dumps(
        [
            {
                "type": finding.type,
                "severity": finding.severity,
                "message": finding.message,
                "line": finding.line,
                "column": finding.column,
            }
            for finding in findings
        ],
        indent=2,
    )

    prompt = f"""
You are an AI programming tutor.

Your job is to evaluate a learner's debugging reasoning.

IMPORTANT RULES:

1. Do NOT simply provide the corrected code.
2. Do NOT rewrite the learner's code.
3. Do NOT solve the problem for the learner.
4. Focus on their reasoning and understanding.
5. Explain concepts clearly at a beginner-friendly level.
6. Encourage the learner to think independently.
7. If their reasoning is correct, reinforce what they understood.
8. If their reasoning is incomplete or incorrect, explain what they missed.
9. Give a better debugging thought process, not the final solution.
10. Keep the feedback concise but educational.

LEARNER'S THINKING:
{thinking}

LEARNER'S ATTEMPTED CODE:
{attempted_code}

STATIC ANALYSIS FINDINGS:
{findings_text}

Return ONLY valid JSON using exactly this structure:

{{
    "understanding": "...",
    "missed_concept": "...",
    "better_thinking": "...",
    "reinforcement": "..."
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    return json.loads(text) 