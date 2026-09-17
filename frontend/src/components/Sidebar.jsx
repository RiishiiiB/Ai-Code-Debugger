import { useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-background border-r border-slate-800 text-white p-5">
      <h1 className="text-xl font-bold mb-8">
  <span className="text-brand">⚡</span> AI Code Debugger
</h1>

      <nav className="space-y-2">
        <button className="w-full text-left px-4 py-3 rounded-lg bg-brand text-slate-950 font-semibold">
          Dashboard
        </button>

        <button
  onClick={() => navigate('/code-review')}
  className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface"
>
  Code Review
</button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface">
          History
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface">
          Learning
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface">
          Projects
        </button>
      </nav>

      <div className="mt-auto pt-10 space-y-2">
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface">
          Settings
        </button>

        <button
  onClick={handleLogout}
  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-900/30 text-red-400"
>
  Logout
</button>
      </div>
    </aside>
  )
}

export default Sidebar