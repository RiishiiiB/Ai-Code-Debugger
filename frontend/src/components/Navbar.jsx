function Navbar() {
  return (
    <header className="h-16 border-b border-slate-800 bg-background flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          AI Code Debugger
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white">
          🔔
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-brand text-slate-950 flex items-center justify-center font-bold">
            R
          </div>

          <span className="text-sm text-slate-300">
            Rishi
          </span>
        </div>
      </div>
    </header>
  )
}

export default Navbar