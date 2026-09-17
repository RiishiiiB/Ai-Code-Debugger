import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setError('')

    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch('http://localhost:8000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    if (!response.ok) {
      setError('Invalid email or password')
      return
    }

    const data = await response.json()

    localStorage.setItem('access_token', data.access_token)

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md bg-surface border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back
        </h1>

        <p className="text-slate-400 mt-2">
          Sign in to your AI Code Debugger
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-slate-700 text-white"
            required
          />

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-brand text-slate-950 font-semibold py-3 rounded-lg hover:bg-brand-dark"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login