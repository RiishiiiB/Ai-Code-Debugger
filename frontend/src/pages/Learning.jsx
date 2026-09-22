import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSubmission } from '../services/api'

function Learning() {
  const { submissionId } = useParams()
  const navigate = useNavigate()

  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showHint, setShowHint] = useState(false)
  const [showConcept, setShowConcept] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    if (!submissionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }

    getSubmission(submissionId)
      .then(setSubmission)
      .catch(() => setError('Failed to load learning review'))
      .finally(() => setLoading(false))
  }, [submissionId])

  if (loading) {
    return <p className="text-slate-400">Loading learning mode...</p>
  }

  if (error) {
    return <p className="text-red-400">{error}</p>
  }

  if (!submission) {
    return (
      <p className="text-slate-400">
        Open Learning Mode from a completed code review.
      </p>
    )
  }

  const findings = submission.findings || []
  const hasIssues = findings.length > 0
  const review = submission.ai_review

  return (
    <div>
      <button
        onClick={() => navigate(`/history/${submission.id}`)}
        className="text-slate-400 hover:text-white mb-6"
      >
        ← Back to Review
      </button>

      <h1 className="text-3xl font-bold text-white">
        Learning Mode
      </h1>

      <p className="mt-2 text-slate-400">
        Understand the problem. Think first. Then use AI as your guide.
      </p>

      {/* =========================================================
          NO ISSUES
      ========================================================= */}

      {!hasIssues && (
        <>
          <div className="mt-8 border border-brand/30 bg-brand/5 rounded-xl p-6">
            <p className="text-brand text-sm font-semibold">
              🟢 CODE LOOKS GOOD
            </p>

            <h2 className="text-2xl font-semibold text-white mt-2">
              No issues were detected.
            </h2>

            <p className="text-slate-400 mt-2">
              Static analysis didn't find any syntax errors or common
              problems in this submission.
            </p>
          </div>

          {review && (
            <div className="mt-8 space-y-6">
              <div className="bg-surface border border-slate-800 rounded-xl p-6">
                <p className="text-cyan text-sm font-semibold">
                  WHAT YOU CAN LEARN
                </p>

                <h2 className="text-xl font-semibold text-white mt-2">
                  Understand the Code
                </h2>

                <p className="text-slate-300 mt-3">
                  {review.explanation}
                </p>
              </div>

              <div className="bg-surface border border-slate-800 rounded-xl p-6">
                <p className="text-cyan text-sm font-semibold">
                  CONCEPT
                </p>

                <p className="text-cyan mt-3">
                  {review.concept}
                </p>
              </div>

              <div className="bg-surface border border-slate-800 rounded-xl p-6">
                <p className="text-cyan text-sm font-semibold">
                  WHY IT MATTERS
                </p>

                <p className="text-slate-300 mt-3">
                  {review.why_it_matters}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 bg-surface border border-slate-800 rounded-xl p-6">
            <p className="text-cyan text-sm font-semibold">
              YOUR CODE
            </p>

            <pre className="bg-background border border-slate-700 rounded-lg p-4 mt-4 overflow-x-auto text-sm text-slate-200">
              <code>{submission.code}</code>
            </pre>
          </div>

          <div className="mt-8 border border-cyan/30 bg-cyan/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-cyan">
              🎯 Ready for another challenge?
            </h2>

            <p className="text-slate-300 mt-2">
              Submit another piece of code and practice identifying
              problems yourself.
            </p>

            <button
              onClick={() => navigate('/code-review')}
              className="mt-5 bg-cyan text-slate-950 font-semibold px-5 py-3 rounded-lg hover:opacity-90"
            >
              Review Another Code
            </button>
          </div>
        </>
      )}

      {/* =========================================================
          ISSUES FOUND
      ========================================================= */}

      {hasIssues && (
        <>
          {/* STEP 1 */}
          <div className="mt-8 border border-red-500/30 bg-red-500/5 rounded-xl p-6">
            <p className="text-red-400 text-sm font-semibold">
              STEP 1 · PROBLEM FOUND
            </p>

            <h2 className="text-2xl font-semibold text-white mt-2">
              Something needs your attention.
            </h2>

            <p className="text-slate-400 mt-2">
              Don't look for the answer yet. First try to understand
              what the analyzer discovered.
            </p>
          </div>

          {/* FINDINGS */}
          <div className="mt-6 space-y-4">
            {findings.map((finding, index) => (
              <div
                key={index}
                className="bg-surface border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan text-sm font-semibold uppercase">
                    {finding.type}
                  </span>

                  <span
                    className={
                      finding.severity === 'error'
                        ? 'text-red-400 text-sm font-semibold'
                        : 'text-yellow-400 text-sm font-semibold'
                    }
                  >
                    {finding.severity}
                  </span>
                </div>

                <p className="text-slate-200 mt-3">
                  {finding.message}
                </p>

                {finding.line && (
                  <p className="text-slate-500 text-sm mt-3">
                    Line {finding.line}
                    {finding.column
                      ? `, Column ${finding.column}`
                      : ''}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* STEP 2 */}
          <div className="mt-8 border border-brand/30 bg-brand/5 rounded-xl p-6">
            <p className="text-brand text-sm font-semibold">
              STEP 2 · THINK
            </p>

            <h2 className="text-xl font-semibold text-white mt-2">
              What do you think is happening?
            </h2>

            <p className="text-slate-300 mt-3">
              Before looking at the AI explanation, inspect the
              highlighted issue and try to explain it in your own
              words.
            </p>

            <textarea
              placeholder="Write your thinking here..."
              className="w-full mt-4 min-h-32 bg-background border border-slate-700 rounded-lg p-4 text-slate-200 placeholder:text-slate-600 outline-none focus:border-brand"
            />

            <p className="text-slate-500 text-sm mt-2">
              Your answer isn't being graded yet. The goal is to make
              you think before seeing the explanation.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="mt-6 bg-surface border border-slate-800 rounded-xl p-6">
            <p className="text-cyan text-sm font-semibold">
              STEP 3 · HINT
            </p>

            <h2 className="text-xl font-semibold text-white mt-2">
              Need a little help?
            </h2>

            {!showHint ? (
              <>
                <p className="text-slate-400 mt-2">
                  Don't reveal the answer yet. Start with a small hint.
                </p>

                <button
                  onClick={() => setShowHint(true)}
                  className="mt-5 border border-cyan/40 text-cyan px-5 py-3 rounded-lg hover:bg-cyan/10"
                >
                  💡 Reveal Hint
                </button>
              </>
            ) : (
              <>
                <div className="mt-4 border border-cyan/20 bg-cyan/5 rounded-lg p-4">
                  <p className="text-slate-300">
                    {review?.hint ||
                      'Look carefully at the issue and trace how the affected variable or expression is being used.'}
                  </p>
                </div>

                {!showConcept && (
                  <button
                    onClick={() => setShowConcept(true)}
                    className="mt-5 bg-cyan text-slate-950 font-semibold px-5 py-3 rounded-lg hover:opacity-90"
                  >
                    Continue → Learn the Concept
                  </button>
                )}
              </>
            )}
          </div>

          {/* STEP 4 */}
          {showConcept && (
            <div className="mt-6 bg-surface border border-slate-800 rounded-xl p-6">
              <p className="text-cyan text-sm font-semibold">
                STEP 4 · CONCEPT
              </p>

              <h2 className="text-xl font-semibold text-white mt-2">
                What concept is involved?
              </h2>

              <p className="text-cyan mt-4">
                {review?.concept}
              </p>

              {!showExplanation && (
                <button
                  onClick={() => setShowExplanation(true)}
                  className="mt-5 bg-brand text-slate-950 font-semibold px-5 py-3 rounded-lg hover:bg-brand-dark"
                >
                  Continue → Explain It
                </button>
              )}
            </div>
          )}

          {/* STEP 5 */}
          {showExplanation && (
            <div className="mt-6 bg-surface border border-slate-800 rounded-xl p-6">
              <p className="text-cyan text-sm font-semibold">
                STEP 5 · UNDERSTAND
              </p>

              <h2 className="text-xl font-semibold text-white mt-2">
                Now let's understand why.
              </h2>

              <p className="text-slate-300 mt-4">
                {review?.explanation}
              </p>

              <div className="mt-5 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">
                  Why this matters
                </p>

                <p className="text-slate-300 mt-2">
                  {review?.why_it_matters}
                </p>
              </div>
            </div>
          )}

          {/* ORIGINAL CODE */}
          <div className="mt-8 bg-surface border border-slate-800 rounded-xl p-6">
            <p className="text-cyan text-sm font-semibold">
              YOUR ORIGINAL CODE
            </p>

            <pre className="bg-background border border-slate-700 rounded-lg p-4 mt-4 overflow-x-auto text-sm text-slate-200">
              <code>{submission.code}</code>
            </pre>
          </div>

          {/* STEP 6 */}
          {showExplanation && (
            <div className="mt-8 border border-brand/30 bg-brand/5 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-brand">
                🧠 STEP 6 · YOUR TURN
              </h2>

              <p className="text-slate-300 mt-2">
                Now that you've thought about the problem, try
                fixing the code yourself.
              </p>

              <button
                onClick={() =>
                  navigate(`/learning/${submission.id}/attempt`)
                }
                className="mt-5 bg-brand text-slate-950 font-semibold px-5 py-3 rounded-lg hover:bg-brand-dark"
              >
                Try Your Fix →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Learning