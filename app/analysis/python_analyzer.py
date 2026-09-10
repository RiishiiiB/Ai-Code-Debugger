import ast

from app.schemas.finding import Finding


class VariableAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.assigned = {}
        self.used = set()

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Store):
            self.assigned[node.id] = (node.lineno, node.col_offset + 1)

        elif isinstance(node.ctx, ast.Load):
            self.used.add(node.id)

        self.generic_visit(node)


def analyze_python_code(code: str):
    try:
        tree = ast.parse(code)

    except SyntaxError as error:
        return [
            Finding(
                type="syntax_error",
                severity="error",
                message=error.msg,
                line=error.lineno,
                column=error.offset,
            )
        ]

    analyzer = VariableAnalyzer()
    analyzer.visit(tree)

    unused_variables = set(analyzer.assigned) - analyzer.used

    return [
       Finding(
    type="unused_variable",
    severity="warning",
    message=f"Variable '{variable}' is assigned but never used",
    line=analyzer.assigned[variable][0],
    column=analyzer.assigned[variable][1],
)
        for variable in unused_variables
    ]