import { useEffect, useState } from 'react'
import { createSubmission, getSubmission } from '../services/api'

function CodeReview() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    if (!code.trim()) {
      setError('Please enter some code first.')
      return
    }

    setLoading(true)
    setError(null)
    setSubmission(null)

    try {
      const result = await createSubmission(code, language)
      setSubmission(result)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Failed to analyze code.')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!submission?.id || submission.status === 'completed') {
      if (submission?.status === 'completed') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false)
      }
      return
    }

    const interval = setInterval(async () => {
      try {
        const updatedSubmission = await getSubmission(submission.id)

        setSubmission(updatedSubmission)

        if (
          updatedSubmission.status === 'completed' ||
          updatedSubmission.status === 'failed'
        ) {
          setLoading(false)
          clearInterval(interval)
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError('Failed to fetch analysis.')
        setLoading(false)
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [submission])

  return (
    <div>
      <h1 className="text-3xl font-bold">Code Review</h1>

      <p className="mt-2 text-slate-400">
        Write your code and let AI help you understand it.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Code Editor */}
        <div className="bg-surface border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your Code</h2>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-background border border-slate-700 rounded-lg px-4 py-2"
            >
              <option value="python">Python</option>
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write or paste your code here..."
            className="w-full h-96 bg-background border border-slate-700 rounded-lg p-4 text-sm font-mono text-white resize-none focus:outline-none focus:border-brand"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-4 bg-brand text-slate-950 font-semibold py-3 rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>

        {/* Review Panel */}
        <div className="bg-surface border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-6">Review</h2>

          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}

          {!submission && !error && (
            <div className="border border-dashed border-slate-700 rounded-lg h-96 flex items-center justify-center">
              <p className="text-slate-500">
                Your analysis will appear here
              </p>
            </div>
          )}

          {submission && (
            <div className="space-y-6">

              {/* Processing State */}
              {submission.status === 'processing' && (
                <div className="border border-cyan/30 rounded-lg p-4">
                  <p className="text-cyan font-semibold">
                    Analyzing your code...
                  </p>

                  <p className="text-slate-400 text-sm mt-2">
                    Static analysis is complete. Your AI learning review is
                    being prepared.
                  </p>
                </div>
              )}

              {/* Status */}
              <div>
                <p className="text-slate-400 text-sm">
                  Status
                </p>

                <p
                  className={
                    submission.status === 'completed'
                      ? 'text-brand font-medium mt-1'
                      : submission.status === 'failed'
                        ? 'text-red-400 font-medium mt-1'
                        : 'text-cyan font-medium mt-1'
                  }
                >
                  {submission.status}
                </p>
              </div>

              {/* Findings */}
              <div>
                <p className="text-slate-400 text-sm mb-3">
                  Issues Found
                </p>

                {submission.findings?.length === 0 ? (
                  <p className="text-slate-500">
                    No issues found.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {submission.findings?.map((finding, index) => (
                      <div
                        key={index}
                        className="border border-slate-700 rounded-lg p-4"
                      >
                        <p className="text-amber-400 font-semibold">
                          {finding.type}
                        </p>

                        <p className="text-slate-300 mt-2">
                          {finding.message}
                        </p>

                        {finding.line && (
                          <p className="text-slate-500 text-sm mt-2">
                            Line {finding.line}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Learning Review */}
              {submission.ai_review && (
                <div className="space-y-4">

                  <div>
                    <p className="text-slate-400 text-sm">
                      Explanation
                    </p>

                    <p className="text-slate-200 mt-1">
                      {submission.ai_review.explanation}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">
                      Concept
                    </p>

                    <p className="text-cyan mt-1">
                      {submission.ai_review.concept}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">
                      Why it matters
                    </p>

                    <p className="text-slate-200 mt-1">
                      {submission.ai_review.why_it_matters}
                    </p>
                  </div>

                  <div className="border border-brand/30 rounded-lg p-4">
                    <p className="text-brand text-sm font-semibold">
                      Hint
                    </p>

                    <p className="text-slate-200 mt-1">
                      {submission.ai_review.hint}
                    </p>
                  </div>

                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeReview