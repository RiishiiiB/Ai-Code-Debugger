import { useEffect, useState } from 'react'
import { getDashboardStats } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard statistics'))
  }, [])

  if (error) {
    return <p className="text-red-400">{error}</p>
  }

  if (!stats) {
    return <p className="text-slate-400">Loading dashboard...</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-2 text-slate-400">
        Welcome to your AI Code Debugger.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <div className="bg-surface border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400">Total Reviews</p>
          <p className="text-3xl font-bold mt-2">{stats.total_submissions}</p>
        </div>

        <div className="bg-surface border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400">Completed Reviews</p>
          <p className="text-3xl font-bold text-brand mt-2">
            {stats.completed_reviews}
          </p>
        </div>

        <div className="bg-surface border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400">Issues Found</p>
          <p className="text-3xl font-bold text-amber-400 mt-2">
            {stats.total_findings}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard