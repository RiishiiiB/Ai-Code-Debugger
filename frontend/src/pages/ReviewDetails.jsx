import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSubmission } from '../services/api'

function ReviewDetails() {
  const { submissionId } = useParams()
  const navigate = useNavigate()

  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSubmission(submissionId)
      .then(setSubmission)
      .catch(() => setError('Failed to load review'))
      .finally(() => setLoading(false))
  }, [submissionId])

  if (loading) {
    return <p className="text-slate-400">Loading review...</p>
  }

  if (error) {
    return <p className="text-red-400">{error}</p>
  }

  return (
    <div>
      <button
        onClick={() => navigate('/history')}
        className="text-slate-400 hover:text-white mb-6"
      >
        ← Back to History
      </button>

      <h1 className="text-3xl font-bold">
        Review #{submission.id}
      </h1>

      <p className="mt-2 text-slate-400">
        {submission.language} • {submission.status}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Code */}
        <div className="bg-surface border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">
            Submitted Code
          </h2>

          <pre className="bg-background border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200">
            <code>{submission.code}</code>
          </pre>
        </div>

        {/* Findings */}
        <div className="bg-surface border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">
            Issues Found
          </h2>

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

        {/* AI Review */}
        {submission.ai_review && (
          <div className="lg:col-span-2 bg-surface border border-slate-800 rounded-xl p-6">
            <h2 className="font-semibold mb-6">
              AI Learning Review
            </h2>

            <div className="space-y-5">

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
          </div>
        )}

      </div>
    </div>
  )
}

export default ReviewDetails