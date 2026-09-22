from app.analysis.python_analyzer import analyze_python_code


def analyze_learning_attempt(code: str, language: str):
    """
    Analyze the learner's attempted code using the same
    deterministic analyzer used during the original review.
    """

    findings = []

    if language.lower() == "python":
        findings = analyze_python_code(code)

    return findings