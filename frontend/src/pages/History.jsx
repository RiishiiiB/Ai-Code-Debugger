import { useEffect, useState } from 'react'
import { getSubmissionHistory } from '../services/api'
import { useNavigate } from 'react-router-dom'
function History() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    getSubmissionHistory()
      .then(setSubmissions)
      .catch(() => setError('Failed to load submission history'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-slate-400">Loading history...</p>
  }

  if (error) {
    return <p className="text-red-400">{error}</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">History</h1>

      <p className="mt-2 text-slate-400">
        View your previous code reviews.
      </p>

      <div className="mt-8 bg-surface border border-slate-800 rounded-xl overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No code reviews yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {submissions.map((submission) => (
              <div
              key={submission.id}
              onClick={() => navigate(`/history/${submission.id}`)}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition">
                <div>
                  <p className="font-semibold text-white">
                    Review #{submission.id}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    {submission.language} •{' '}
                    {new Date(submission.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    submission.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : submission.status === 'failed'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {submission.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History