import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createLearningAttempt } from '../services/api'

function LearningAttempt() {
  const { submissionId } = useParams()
  const navigate = useNavigate()

  const [thinking, setThinking] = useState('')
  const [attemptedCode, setAttemptedCode] = useState('')

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    if (loading) {
      return
    }

    // Don't allow another submission after
    // the learner has already successfully fixed it.
    if (result?.fixed) {
      return
    }

    if (!thinking.trim()) {
      setError('Please explain what you think is wrong first.')
      return
    }

    if (!attemptedCode.trim()) {
      setError('Please enter your attempted fix.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await createLearningAttempt(
        submissionId,
        thinking,
        attemptedCode
      )

      setResult(data)
    } catch (err) {
      console.error('Learning attempt error:', err)

      setError(
        err.message || 'Failed to analyze your fix.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleTryAgain() {
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-5xl">

      {/* Back */}
      <button
        onClick={() => navigate(`/learning/${submissionId}`)}
        className="text-slate-400 hover:text-white mb-6"
      >
        ← Back to Learning Mode
      </button>

      {/* Header */}
      <h1 className="text-3xl font-bold text-white">
        Try Your Fix
      </h1>

      <p className="text-slate-400 mt-2">
        Don't worry about getting it perfect. The goal is to
        understand the problem and try solving it yourself.
      </p>

      {/* =====================================================
          STEP 1 — THINKING
      ====================================================== */}

      <div className="mt-8 bg-surface border border-slate-800 rounded-xl p-6">

        <p className="text-brand text-sm font-semibold">
          STEP 1 · YOUR THINKING
        </p>

        <h2 className="text-xl font-semibold text-white mt-2">
          What do you think is wrong?
        </h2>

        <textarea
          value={thinking}
          onChange={(e) => setThinking(e.target.value)}
          disabled={loading || result?.fixed}
          placeholder="Explain what you think is causing the problem..."
          className="w-full mt-4 min-h-32 bg-background border border-slate-700 rounded-lg p-4 text-slate-200 placeholder:text-slate-600 outline-none focus:border-brand disabled:opacity-50"
        />

        <p className="text-slate-500 text-sm mt-2">
          Explain the problem in your own words before fixing the code.
        </p>

      </div>

      {/* =====================================================
          STEP 2 — CODE
      ====================================================== */}

      <div className="mt-6 bg-surface border border-slate-800 rounded-xl p-6">

        <p className="text-cyan text-sm font-semibold">
          STEP 2 · YOUR FIX
        </p>

        <h2 className="text-xl font-semibold text-white mt-2">
          Write your corrected code
        </h2>

        <textarea
          value={attemptedCode}
          onChange={(e) => setAttemptedCode(e.target.value)}
          disabled={loading || result?.fixed}
          placeholder="Write your attempted solution here..."
          spellCheck="false"
          className="w-full mt-4 min-h-96 bg-background border border-slate-700 rounded-lg p-4 text-slate-200 font-mono text-sm placeholder:text-slate-600 outline-none focus:border-cyan resize-y disabled:opacity-50"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || result?.fixed}
          className="mt-5 bg-brand text-slate-950 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Analyzing...'
            : result?.fixed
              ? 'Fix Verified ✓'
              : 'Analyze My Fix →'}
        </button>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/5 rounded-xl p-5">

          <p className="text-red-400">
            {error}
          </p>

        </div>
      )}

      {/* =====================================================
          RESULT
      ====================================================== */}

      {result && (
        <div className="mt-8">

          {/* =================================================
              SUCCESS
          ================================================== */}

          {result.fixed ? (

            <div className="border border-brand/30 bg-brand/5 rounded-xl p-6">

              <p className="text-brand text-sm font-semibold">
                🎉 NICE WORK
              </p>

              <h2 className="text-2xl font-semibold text-white mt-2">
                You fixed the issue!
              </h2>

              <p className="text-slate-300 mt-3">
                The static analyzer no longer detects the
                original problem in your attempted code.
              </p>

              {/* Reasoning */}
              <div className="mt-6">

                <p className="text-cyan text-sm font-semibold">
                  YOUR REASONING
                </p>

                <div className="mt-3 bg-background border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-300">
                    {thinking}
                  </p>
                </div>

              </div>

              {/* Verified */}
              <div className="mt-6 border border-brand/20 bg-brand/5 rounded-lg p-4">

                <p className="text-brand font-semibold">
                  ✓ Fix verified by static analysis
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  No remaining findings were detected.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(`/learning/${submissionId}`)
                }
                className="mt-6 bg-brand text-slate-950 font-semibold px-5 py-3 rounded-lg hover:bg-brand-dark"
              >
                Continue Learning →
              </button>

            </div>

          ) : (

            /* =================================================
               NOT FIXED
            ================================================== */

            <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-6">

              <p className="text-yellow-400 text-sm font-semibold">
                🟡 NOT QUITE YET
              </p>

              <h2 className="text-2xl font-semibold text-white mt-2">
                Your fix still has some issues.
              </h2>

              <p className="text-slate-400 mt-2">
                That's completely fine. Look at the remaining
                findings and try again.
              </p>

              {/* Remaining findings */}
              <div className="mt-6 space-y-4">

                {result.remaining_findings?.map(
                  (finding, index) => (

                    <div
                      key={index}
                      className="bg-background border border-slate-700 rounded-lg p-4"
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

                      <p className="text-slate-300 mt-3">
                        {finding.message}
                      </p>

                      {finding.line && (
                        <p className="text-slate-500 text-sm mt-2">
                          Line {finding.line}
                          {finding.column
                            ? `, Column ${finding.column}`
                            : ''}
                        </p>
                      )}

                    </div>

                  )
                )}

              </div>

              <button
                onClick={handleTryAgain}
                className="mt-6 border border-cyan/40 text-cyan px-5 py-3 rounded-lg hover:bg-cyan/10"
              >
                ← Try Again
              </button>

            </div>

          )}

        </div>
      )}

    </div>
  )
}

export default LearningAttempt