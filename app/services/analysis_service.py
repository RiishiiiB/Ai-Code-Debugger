from app.analysis.python_analyzer import analyze_python_code


def analyze_code(code: str, language: str):
    if language.lower() == "python":
        return analyze_python_code(code)

    return []